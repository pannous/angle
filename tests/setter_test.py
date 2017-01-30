#!/usr/bin/env python
import angle
from tests.parser_test_helper import *
from power_parser import WrongType, ImmutableVaribale


class SetterTest(ParserBaseTest,unittest.TestCase):

	def setUp(self):
		parser.clear()

	def test_samples(self):
		x=parse("samples/basics.e")
		assert x==6

	def test_a_setter_article_vs_variable(self):
		skip()
		# dont_
		parse('a=green')
		assert_equals(variables['a'], 'green')
		parse('a dog=green')
		assert_equals(variables['dog'], 'green')

	def test_alias(self):
		skip("aliases sit between methods and variables. do we really want them?")
		parse('alias x=y*y')
		parse('z:=y*y')
		parse('y=8')
		assert_result_is('x',64)
		assert_result_is('z',64)


	def test_variable_type_syntax(self):
		parse('int i=3')
		parse('an integer i;i=3')
		parse('int i;i=3')

	def test_variable_type_cast(self):
		parse('int i;i=3.2 as int')

	def test_variable_range(self):
		j = parse('list i is 5 to 10')
		i = parse('i is 5 to 10')
		assert_equals(i,j)
		assert_equals(i, list(range(5, 10 + 1)))  # count from 1 to 10 => 10 INCLUDED, thus +1!

	def test_variable_type_cast2(self):
		skip()
		parse('int i;i=int(3.2)')
		parse('int i;i=int(float("3.2"))')
		parse('int i;i=float("3.2") as int')
		parse('int i;i=int("3.2")')

	def test_guard_value(self):
		assert_result_is("x=nil or 'c'",'c') #  value side to guard!
		assert_result_is("x=nil else 'c'",'c')#  assignment side guard!
		assert_result_is("char x=3 else 'c'",'c')

	def test_guard_value_setter(self):
		skip()
		assert_result_is("x=nil else x='c'",'c')
		assert_result_is("char x=3 else x='c'",'c')
	# =>  why not use 'else' as 'or' operator?
	# if x=1: nil else 1  MISSLEADING!

	def test_guard_action(self):
		skip()
		parse("x=nil else return")
		parse("x=nil else print 'ok'")

	def test_guard_rescue(self):
		assert_result_is("x=1/0 rescue 2", 2)
		assert_result_is("x=1 rescue 2/0", 1)

	def test_guard_rescue2(self):
		assert_result_is("try x=1/0 rescue 2", 2)
		assert_result_is("x=2;try x=x/0", 2)

	def test_guard_block(self):
		parse("x=nil else { print 'nevermind' }")
		parse("guard let x=nil else { print 'nevermind' }")
		parse("x=nil else { print 'ok' }")

	def test_variable_type_syntax2(self):
		parse("char x='c'")
		parse("char x;x='c'")
		parse("char x;x=3 as char")# ambiguous : x='3' or x=chr(3) == '\x03' ?
		# all error free

	def test_variable_type_safety_a(self):
		assert_has_no_error("typed i='hi';i='ho'")

	def test_variable_type_safety_b(self):
		assert_has_error("typed i='hi';i=3", WrongType)
		# Especially useful if we get the return value of a function with unknown type but mutable value

	def test_variable_type_safety0(self):
		x=parse('string i=3')
		if(x=='3'):print("auto casted it to string")
		assert_has_error('string i=3', WrongType)
		assert_has_error("int i='hi'", WrongType)
		assert_has_error("integer i='hi'", WrongType)

	def test_variable_type_safety1(self):
		assert_has_error("an integer i;i='hi'", WrongType)
		assert_has_error("typed i='hi';i=3", WrongType)

	def test_variable_immutable(self):
		assert_has_error("const i=1;i='hi'", WrongType)
		assert_has_error("const i='hi';i='ho'", WrongType)
		assert_has_error('const i=1;i=2', ImmutableVaribale)

	def test_variable_type_declaration_safety(self):
		assert_has_error("int i;string i", WrongType)
		assert_has_error('i=1;string i', WrongType)
		assert_has_error("int i;i='hi'", WrongType)
