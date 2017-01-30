#!/usr/bin/env python
import inspect
import unittest

import ast

import kast.kast
import nodes

import exceptionz
import english_parser
import context
import pyc_emitter
# from angle import english_parser, pyc_emitter, context #NO! creates 2nd context !!!
# from nodes import * #EVIL!! creates second class

from extensions import *
import collections

global parser
parser = english_parser  # .EnglishParser()

NONE = "None"
TRUE = "True"
FALSE = "False"
ENV = {'APPLE': True}
methods = {}
functions = {}
variables = {}
variableValues = {}
emit = False
global base_test
base_test = None
import context as the


def name(x):
	return x


def contains(a, b):
	return a in b or b in a


def bigger_than(a, b):
	return a > b


def less_than(a, b):
	return a < b


def kind(x):
	type(x)


def body(param):
	english_parser.rooty()


def fix_encoding(x):
	return x


def read(x):
	return open(x) or x.read()


def count(x):
	len(x)


def p(x):
	print(x)


def last_result():
	return context.last_result


#
# def parse_tree(x):
# 	print("  File \"%s\", line %d" % (inspect.stack()[1][1], inspect.stack()[1][2]))
# 	context.use_tree = True
# 	power_parser.dont_interpret()
# 	angle_ast = power_parser.parse(x).tree  # AST
# 	if not isinstance(angle_ast, ast.Module):
# 		angle_ast = kast.Module(body=[angle_ast])
# 	angle_ast = ast.fix_missing_locations(angle_ast)
# 	return angle_ast


def puts(x):
	print(x)


def assert_result_emitted(a, b, bla=None):
	print("  File \"%s\", line %d" % (inspect.stack()[1][1], inspect.stack()[1][2]))
	context.use_tree = True
	x = parse(a)
	if isinstance(x, ast.Module): x = x.body
	assert_equals(b, x, bla)


def assert_result_is(a, b, bla=None):
	print("  File \"%s\", line %d" % (inspect.stack()[1][1], inspect.stack()[1][2]))
	# print(inspect.stack()[1][3])
	x = parse(a)
	# y=parse(b)
	y = b
	if bla:
		assert x == y, "%s %s SOULD EQUAL %s BUT WAS %s" % (bla, a, b, x)
	else:
		assert x == y, "%s SOULD EQUAL %s \nGOT %s != %s" % (a, b, x, y)


def assert_equals(a, b, bla=None):
	print("  File \"%s\", line %d" % (inspect.stack()[1][1], inspect.stack()[1][2]))
	if a == 'False': a = False
	if isinstance(a, map): a = list(a) # fuck py3!
	if isinstance(a, ast.List): a = a.elts  # todo remove
	assert a == b, "%s SHOULD BE %s  ( %s )" % (a, b, bla)

def assert_contains(a, b):
	assert b in a or a in b, "%s SHOULD CONTAIN %s" % (a, b)


# assert a==b, "%s SHOULD BE %s   %s"%(a,b,bla)
# assert a == b, "%s SHOULD BE %s   %s" % (a, b, bla)


#
# def do_assert(a, bla=None):
#     assert a

class SkippingTest(Exception):
	pass


def skip(me=0):
	if me:print("SKIPPED! reason: %s"%me)
	raise unittest.SkipTest()


# TestCase.skipTest()
# raise SkippingTest()


def assert_has_error(x, ex=None):
	print("  File \"%s\", line %d" % (inspect.stack()[1][1], inspect.stack()[1][2]))
	got_ex = False
	try:
		if isinstance(x, collections.Callable):
			x()
		else:
			parse(x)
	except (Exception, exceptionz.StandardError) as e: #, exceptionz.Exception
		if ex:
			if not isinstance(e, ex):
				print(("WRONG ERROR: {0} {1} expected error: {2}".format(e.__class__.__name__,str(e), str(ex))))
				# ifdef FUCKING PY3:
				raise  # e from e
			# e.raise()
			# raise e, None, sys.exc_info()[2]
			print(("OK, got expected %s : %s" % (ex, e)))
		else:
			print(("OK, got expected " + str(e)))
		return
	raise Exception("EXPECTED ERROR: " + str(ex) + "\nIN: " + x)


def assert_has_no_error(x):
	parse(x)


def sleep(s):
	pass


def update_local(context):
	variables.update(context.variables)
	variableValues.update(context.variableValues)
	functions.update(context.methods)
	methods.update(context.methods)
	copy_variables()


def parse(s):
	if 'use_tree' in os.environ: context.use_tree = True
	if 'no_tree' in os.environ: context.use_tree = False
	if not "parser_test_helper" in inspect.stack()[1][1]:
		print("  File \"%s\", line %d" % (inspect.stack()[1][1], inspect.stack()[1][2]))
	if not (isinstance(s, str) or isinstance(s, str) or isinstance(s, file)): return s
	with open("out/inline", 'wt') as outfile:
		outfile.write(s)
	interpretation = english_parser.parse(s)
	r = interpretation.result
	if isinstance(r, ast.AST) or isinstance(r, list) and isinstance(r[0], ast.AST):
		r = pyc_emitter.run_ast(r)
	update_local(context)
	print("DONE PARSING :")
	print("  File \"%s\", line %d\n\n" % (inspect.stack()[1][1], inspect.stack()[1][2]))

	return r


def init(s):
	copy_variables()
	english_parser.init(s)


def result():
	return context.result


def equals(a, b):
	return a == b


def copy_variables(variables=variables):
	global variableValues
	variable_keys = list(variables.keys())
	for name in variable_keys:
		v_ = variables[name]
		if isinstance(v_, nodes.Variable):
			context.variables[name] = v_
			context.variableValues[name] = v_.value
			continue
		context.variableValues[name] = v_
		context.variables[name] = nodes.Variable(name=name, value=v_, type=type(v_))
		variables[name] = nodes.Variable(name=name, value=v_, type=type(v_))


class ParserBaseTest(unittest.TestCase):
	global _parser

	# def __init__(self, *args, **kwargs): #ruby : initialize
	#     super(ParserBaseTest, self).__init__()
	#     if ENV['TEST_SUITE'] or ENV['DEBUG_ANGLE']or ENV['ANGLE_DEBUG']or ENV['DEBUG']:
	#
	#     self.parser = _parser = english_parser#.EnglishParser()

	def setUp(self):
		self.parser = english_parser
		global base_test
		base_test = self
		self.parser.clear()  # OK Between test, just not between parses!
		if 'use_tree' in os.environ: context.use_tree = True
		if 'no_tree' in os.environ: context.use_tree = False
		if not context.use_tree:
			parser.do_interpret()

	@classmethod
	def setUpClass(cls):
		context._debug = context._debug or 'ANGLE_DEBUG' in os.environ
		context._verbose = context._debug or context._verbose or 'ANGLE_VERBOSE' in os.environ
		context.testing = True
		cls.parser = _parser = english_parser  # .EnglishParser()
		pass  # reserved for expensive environment one time set up

	def parse(self, s):
		print(("PARSING %s" % s))
		x = _parser.parse(s).result
		print(("DONE PARSING %s" % s))
		return x

	def assert_has_no_error(self, x):
		parse(x)
		print((x + ' parses OK'))

	def assert_has_error(self, x, block):
		try:
			parse(x)
			raise Exception("SHOULD THROW")
		except Exception as e:
			puts("OK")

	def assert_result_is(self, x, r):
		if isinstance(x, str): x = parse(x)
		if isinstance(r, str): r = parse(r)
		assert_equals(x, r)

	# assert_equals(parse(x), parse(r))

	def assert_equals(self, a, b):
		if a == b or str(a) == str(b):
			print(('TEST PASSED! %s      %s == %s' % (self.parser.original_string, a, b)))
		else:
			assert a == b, "%s should equal %s" % (a, b)
		# print(filter_stack(caller()))

	def assert_that(self, x, msg=None, block=None):
		return self.do_assert(x, msg, block)

	def do_assert(self, x, msg=None, block=None):
		copy_variables()
		if not msg: msg = x
		ok = False
		if x == True:
			print(('TEST PASSED! ' + str(msg)))
			return True
		if isinstance(msg, collections.Callable):
			msg = msg.call()
		if block:
			msg = (msg or self.parser.to_source(block))
		if x == False and block:
			x = block()
		if x == False:
			assert False, ('%s NOT PASSING: %s' % (x, msg))
		if isinstance(x, str):
			print(('Testing ' + x))
			init(x)
			ok = self.parser.condition()
			if ok == False or ok == FALSE or ok == NONE:  # no match etc
				assert False, 'NOT PASSING: ' + str(msg)
		print(('TEST PASSED!  ' + str(msg) + ' \t VALUE ' + str(ok)))

	# def NOmethod_missing(self, sym, args, block):
	#     syms = sym.to_s()
	#     if self.parser and contains(sym, self.parser.methods()):
	#         [
	#         if equals(0, args.len()):
	#             x = maybe(),
	#         if equals(1, args.len()):
	#             x = maybe(),
	#         if bigger_than(0, args.len()):
	#             x = maybe(),
	#         return x, ]
	#     super([sym], args, [sym], args)

	def init(self, string):
		self.parser.allow_rollback((-1))
		self.parser.init(string)

	def variables(self):
		return context.variables

	def variableValues(self):
		return context.variableValues

	def functions(self):
		return context.methods

	def methods(self):
		return context.methods

	def interpretation(self):
		return self.interpretation

	def result(self):
		return context.result

	# self.parser.result

	def parse_tree(self, x):
		if isinstance(x, str):
			return x
		self.parser.dont_interpret()
		interpretation = self.parser.parse(x)
		self.parser.full_tree()
		if context.emit:
			return parser.emit(interpretation, interpretation.root())
		else:
			return interpretation.evaluate()

	# def emit(self, interpretation, root):
	#     from c-emitter import *
	#     emit(interpretation, {'run': True, }, NativeCEmitter())

	def parse(self, x):
		if context.interpret:
			self.parser.do_interpret()
		if context.emit:
			self.result = parse_tree(x)
		else:
			self.result = self.parser.parse(x).result
		return self.result

	def variableTypes(self, v):
		type(variables[v], )

	# def verbose(self):
	#     if context.raking:
	#         return None
	#     self.parser.verbose = True

# class Function:
#     pass
# class Argument:
#     pass
# class Variable:
#     pass
# class Quote:
#     pass
