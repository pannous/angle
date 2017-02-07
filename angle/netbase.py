#!/usr/bin/env PYTHONIOENCODING="utf-8" python
# -*- coding: utf-8 -*-
import os
import re
import os.path

# api = "http://netbase.pannous.com/json/all/"
api = "http://localhost:8181/json/all/"
api_html = api.replace("json", "html")
api_limit = " limit 100"
# caches_netbase_ = "~/Library/Caches/netbase/"
caches_netbase_ = "/Users/me/Library/Caches/netbase/"

import json
import extensions

try: # pathetic ! :
	from urllib2 import urlopen
	from urllib import urlretrieve
except ImportError:
	from urllib.request import urlopen, urlretrieve  # library HELL


def download(url):  # to memory
	return urlopen(url).read()


class Edges(extensions.xlist):
	pass


def get(id, name=0):
	return netbase.get(id or name)


class Node:
	def __init__(self, *args, **kwargs):
		# print(args)
		if not kwargs: kwargs = args[0]
		# print(kwargs)
		# self.id = args['id']
		# self.name = args['name']
		# self.statements = Edges(args['statements'])
		self.id = kwargs['id']
		self.name = kwargs['name']
		# if 'description' in result:
		if 'description' in kwargs:
			self.description = kwargs['description']
		else:
			self.description = ""
		if 'statementCount' in kwargs:
			self.count = kwargs['statementCount']
		if 'statements' in kwargs:
			self.edges = Edges(kwargs['statements'])

	def __str__(self):
		return self.name or self.id

	def __repr__(self):
		return self.name or self.id

	# return self.name + "_" + str(self.id)
	# if self.type:
	# 	return self.name + ":" + self.type.name
	# return self.name + ":" + self.type.name

	def _short(self):
		return "{name:'%s', id:%d, description:'%s'}" % (self.name, self.id, self.description)

	def _json(self):
		return "{name:'%s', id:%d, description:'%s', statements:%s}" % (self.name, self.id, self.description, self.edges)

	def open(self):
		if "http" in self.name:
			os.system("open " + self.name)
		else:
			os.system("open " + api_html + self.name)

	def show(self):
		if "http" in self.name:
			os.system("open " + self.name);
		print(self._json())

	def _predicates(self):
		all = []
		for e in self.edges:
			predicate = e['predicate']
			if not predicate in all:
				all.append(predicate)
		return all

	def _print_edges(self):
		for e in self.edges:
			if e['sid'] == self.id:
				print(" %s:%s" % (e['predicate'], e['object']))
			else:
				if " of" in e['predicate']:
					print(" %s: %s" % (e['predicate'].replace(" of", ""), e['subject']))
				else:
					print(" %s of: %s" % (e['predicate'], e['subject']))
		return self.edges

	def _map(self):
		map = {}
		for e in self.edges:
			if e['sid'] == self.id:
				map[e['predicate']] = e['object']
			else:
				if " of" in e['predicate']:
					map[e['predicate'].replace(" of", "")] = e['subject']
				else:
					map[e['predicate']+" of"] = e['subject']
		return map

	def _load_edges(self):
		url = api + str(self.id)
		print(url)
		data = download(url)
		data = json.loads(data.decode('utf8', 'ignore'))  # FUCK PY3 !!!
		# data = json.loads(str(data, "UTF8"))  # FUCK PY3 !!!
		result = data['results'][0]
		self.edges = Edges(result['statements'])
		return self.edges

	def getProperties(self, property, strict=False):
		found = []
		for e in self.edges:
			predicate = e['predicate'].lower()
			if predicate == property or not strict and (property in predicate):
				if e['sid'] == self.id:
					found.append(get(name=e['object'], id=e['oid']))
				elif not strict:
					found.append(get(name=e['subject'], id=e['sid']))
		if property == 'instance':
			found.extend(self.getProperties('type', strict=True))
		if self in found: found.remove(self)
		if not found: return []
		return set(found)

	def getProperty(self, property, strict=False):
		if property == 'predicates': return self._predicates()
		if property == 'edges': return self._load_edges()
		if property == 'all': return net.all(self.id, True, False)
		# if property == 'list': return self._print_edges()  # net.all(self.id, True, False)
		if property == 'list': return self._map()  # net.all(self.id, True, False)
		if property == 'count': return self.count or self.edges.count()
		if property == 'json': return self._json()
		if property == 'short': return self._short()
		if property == 'descriptions': return self.description

		property = property.replace("_", " ").lower()
		# print("getProperty " + self.name+"."+ property)
		for e in self.edges:
			predicate = e['predicate'].lower()
			if predicate == property:
				if e['sid'] == self.id:
					return Node(name=e['object'], id=e['oid'])
				elif not strict:
					return Node(name=e['subject'], id=e['sid'])
		if strict: return None
		for e in self.edges:
			if property in e['predicate'].lower():
				if e['oid'] == self.id:
					return Node(name=e['subject'], id=e['sid'])
				else:
					return Node(name=e['object'], id=e['oid'])
		if property == 'parent':
			return self.getProperty('superclass', strict=True) or self.getProperty('type', strict=True)
		if is_plural(property):
			return self.getProperties(singular(property))

	def __getattr__(self, name):
		# print("get " + name)
		return self.getProperty(name)


def is_plural(name):
	return name.endswith("s")  # todo


def singular(name):
	if name.endswith("ies"):
		return re.sub(r"ies$", "y", name)
	# return name.replace(r"ies$", "y")  # WTF PYTHON !
	if name.endswith("ses"):
		return re.sub(r"ses$", "s", name)
	if name.endswith("s"):
		return re.sub(r"s$", "", name)  # todo
	return name


import dill as pickle  # BEST! no more Can't pickle <function


class Netbase:
	def __init__(self):
		self.cache = {}
		self.caches = {}

	def types(self, name):
		return self.all(name, instances=False)

	# @classmethod
	def all(self, name, instances=False, deep=False, reload=False):
		if isinstance(name, int):
			name = str(name)  # id
		if is_plural(name):
			return self.all(singular(name))
		if name in self.caches:
			return self.caches[name]
		if deep: name = "query/all/" + name  # hack!
		file = caches_netbase_ + name + ".json"
		if reload or not os.path.exists(file):
			print(api + name)
			urlretrieve(api + name, file)
		data = open(file).read()
		try:
			data = json.loads(data)
		except Exception as ex:
			print(ex)
			os.remove(file)
			return Node(id=-666, name="ERROR")
		nodes = extensions.xlist()
		for result in data['results']:
			# print(result)
			node = Node(result)
			nodes.append(node)
			if instances:
				nodes.append(self.all(node.id, False, True, reload))
				nodes.append(node.instances)
		self.caches[name] = nodes
		return nodes

	# @classmethod
	def get(self, name):
		# return all(name)[0]
		if isinstance(name, int):
			name = str(name)  # id
		if is_plural(name):
			return self.all(singular(name))
		if name in self.cache:
			return self.cache[name]
		# print("getThe "+name)

		file = caches_netbase_ + name + ".json"
		if not os.path.exists(file):
			print(api + name)
			urlretrieve(api + name, file)
		data = open(file, 'rb').read()
		try:
			data = json.loads(data.decode("UTF8", 'ignore'))  # FUCK PY3 !!!
		except:
			os.remove(file)
		result = data['results'][0]
		node = Node(result)
		self.cache[name] = node
		return node

	def __getattr__(self, name):
		if name == "all":
			return All()  # use net.all.birds OR net.birds.all / net.bird.232.all
		# return self.all(name)
		# print("get "+name)
		return self.get(name)


class All(Netbase):
	def __getattr__(self, name):
		return self.all(name, True, True)

	# return self.all(name, True, False) #reload


netbase = world = net = Netbase()
alle = All()


def main():
	# print(net.c)
	# print(net.countries)
	# print(net.weapons)
	# print(net.states)
	print(net.states[0])
	print(net.states[0].description)
	print(net.states.descriptions)
	print(net.states[0].type)
	print(net.states[0].id)
	# print(net.states[0].subclasses)
	print(net.states[0].short)
	# print(net.california.open())
	# print(net.united_states_.edges.to_s())
	# print(net.united_states_.predicates)
	# print(net.united_states_.ofs)
	# print(alle.weapons)
	# print(net.north_america.countries)
	# print(net.north_america.predicates)
	# print(net.north_america.parts)
	# print(net.north_america.rocky_mountains_)
	print(net.rocky_mountains_.list)

	# print(net.north_america.states)

	# print(alle.insects)
	# print(net.id_10017)
	# print(net.types('country').id)
	#
	return
	print(net.Germany.name)
	print(net.Germany.capital)
	# print(net.Germany.edges)
	# print(net.Germany.predicates)
	print(net.Germany.type)
	print(net.Germany.saint)
	print(net.Germany.borders)
	print(net.Germany.time_zone)
	print(net.Germany.country_code)
	# print(net.Germany.image)
	print(net.Germany.flag.image)
	# print(net.Germany.born.edges)
	print(net.Germany.type)
	print(net.Germany.parent)
	# print(net.Germany.parent.subclasses)

	# print(net.Hasloh.edges)
	print(net.Hasloh.count)
	# print(net.Hasloh.website.open())
	# print(net.Hasloh.image.show())
	print(net.Hasloh.partner)
	# print(net.Hasloh.topic)
	print(net.Hasloh.types)
	print(net.Hasloh.parent.instances)


# print(net.Hasloh.type.parent.parent.parent.parent.parent.parent.parent.parent.parent)
#
#
#
#


# print(net.Hasloh.type.predicates)
# # print(net.Hasloh.type.edges)
# print(net.Hasloh.type.superclass)
# print(net.Germany.type)
# print(net.Germany.type.parent)


# print(net.Germany.capital)


if __name__ == '__main__':
	main()
