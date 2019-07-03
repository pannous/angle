#!/usr/bin/env python
from parser_test_helper import *


class PropertyTest(ParserBaseTest):


	def test_property_of_known(self):
		parse("a={}")
		init("a.b=3")
		parser.property()
		assert_result_is("a.b",3)

	def test_property_of_unknown_forbidden(self):
		assert_has_error("z.b=3", exception.UndeclaredVariable)

	def test_property_of_unknown_allowed(self):
		skip()
		init("z.b=3")
		parser.property()
		assert_result_is("z.b", 3)

	def test_property(self):
		assert_result_is("x={};x.a=7;x.a", 7)

	def test_property_index(self):
		assert_result_is("x={};x.a=7;x['a']", 7)
		assert_result_is("x={};x.a=7;x[a]", 7)

	def test_property_from_type(self):
		init("x is a map")
		x=parser.setter()
		assert x.type == dict
		assert_result_is("x is a map;x.a=7;x.a", 7)

	def test_property_from_empty_declaration(self):
		x=parse("map x")
		assert x=={} #  variable results return resolved!
		# assert x.type == dict
		# assert x.value == {}

	def test_property_from_type2(self):
		assert_result_is("map y;y.a=7;y.a", 7)

	def test_property_of_object(self):
		init("x is an object") # 'object' object has no attribute 'a' :(
		x = parser.setter()
		assert x.type == object
		assert_result_is("x is an object;x.a=7;x.a", 7)

	def test_property3(self):
		assert_result_is("x={};a of x is 7;x.a", 7)

	def test_property_s(self):
		assert_result_is("x={};x's a is 7;x.a", 7)

	def test_relations(self):
		bill, mary = parse(" bill's parent is mary ")
		assert_equals(bill.parent, mary)

	def test_relations(self):
		bill, mary, john = parse("""
		bill's parent is mary
		parent or mary is john
		[bill,mary,john]
		""")
		assert_equals(bill.parent,mary)
