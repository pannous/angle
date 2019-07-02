#!/usr/bin/env python
# -*- coding: utf-8 -*-
from parser_test_helper import *


class ConditionTest(ParserBaseTest):


	def setUp(self):
		super(ParserBaseTest, self).setUp()
		context.use_tree = False
		context.interpret = True
		# parser.do_interpret()
		english_parser.clear()

	@staticmethod
	def test_simple():
		assert_result_is('1==2', False)

	@staticmethod
	def test_root_comparisons():
		assert_result_is('1<2', True)
		assert_result_is('1≠2', True)
		assert_result_is('2==2', True)
		assert_result_is('1==2', False)
		assert_result_is('3<2', False)
		assert_result_is('3>2', True)
	# assert_result_is('1=2', False)

	def test_eq(self):
		variables['counter'] = 3
		copy_variables(variables)
		assert self.parse('counter == 3')

	def test_eq1(self):
		variables['counter'] = 3
		copy_variables(variables)
		print((self.variables()))
		assert self.parse('counter == 3')
		assert self.parse('counter = 3')
		init('counter = 3')
		parser.condition()
		assert self.parse('counter = 3')
		assert self.parse('counter =3')
		assert self.parse('counter is 3')
		assert self.parse('counter equals 3')
		assert self.parse('counter is the same as 3')

	def test_root_comparisons_eq(self):
		self.doCleanups()
		parser.clear()
		assert_has_error('x==2')
		# assert_has_error('x==2',UndeclaredVariable)
		assert_result_is('x=2;x==2', True)
		assert_result_is('x=2;x==3', False)
		assert_result_is('x==2', True)  # keep state ^^ !
		assert_result_is('x==3', False)
		assert_result_is('2==2', True)
		assert_result_is('1==2', False)

	def test_UndeclaredVariable(self):
		# from angle.exception import UndeclaredVariable
		assert_has_error('x=y', exception.UndeclaredVariable)

	def test_return(self):
		assert_result_is('if 1<2 then 5 else 4', 5)

	def test_return2(self):
		assert_result_is('if(3<2) then 3 else 4', 4)
		assert_result_is('if 3<2 then 5 else 4', 4)
		assert_result_is('if 1<2 then false else 4', False)
		assert_result_is('if(1<2) then 3 else 4', 3)

	# assert_result_is('if 1<2 then false else 4', 'false')

	def test_if_(self):
		assert_result_is('if(1<2) then 3 else 4', 3)
		assert_result_is('if 1<2 then 5 else 4', 5)

	def test_if_1(self):
		assert_result_is('if 1<2 then true else 4', True)
		assert_result_is('if 1<2 then "True" else 4', True)

	def test_else_(self):
		assert_result_is('if(3<2) then 3 else 4', 4)

	def test_else_2(self):
		assert_result_is('if 3<2 then 5 else 4', 4)
		assert_result_is('if 3<2 then 5 else False', False)

	def test_if_x_false(self):
		assert_result_is('if 1<2 then false else 4', False)

	# assert_result_is('if 1<2 then false else 4', 'false')

	def dont_test_everything_is_fine(self):
		init('everything is fine;')
		ok = parser.block()
		init('everything is fine')
		parser.condition()
		assert self.parse('everything is fine')

	def test_if_math(self):
		assert_result_is("if ½*2==1: 2", 2)
		assert_result_is("if ½*2!=1: 2; else 4", 4)

	def test_if_math2(self):
		assert_result_is("if ½*2=1: 2; else 4", 2)
		assert_result_is("if ½*2≠1: 2; else 4", 4)

	def test_list_quantifiers(self):
		check = parse('x=2;if all 0,1,2 are smaller 4 then x++')
		assert_equals(check, 3)  # YAY YAY

	def test_list_quantifiers1(self):
		check = parse('x is 5; if all 0,1,2 are smaller 3 then increase x')
		assert_equals(check, 6)
		check = parse('x=2;if all 0,1,2 are smaller 2 then x++')
		assert_equals(check, False)

	def test_list_quantifiers2(self):  # bug: algebra 0,1,2 is smaller 3
		# skip()
		check = parse('x=5;if one of 0,1,2 is smaller 3 then x++')
		assert_equals(check, 6)

	def test_list_quantifiers3(self):
		check = parse('x=5;if all of 0,1,2 are smaller 3 then x++')
		assert_equals(check, 6)

	def test_list_quantifiers3(self):
		check = parse('x=5;if many of 0,1,2 are smaller 3 then x++')
		assert_equals(check, 6)
		check = parse('x=5;if many of 0,1,2 are smaller 1 then x++')
		assert_equals(check, False)

	def test_list_quantifiers4(self):
		check = parse('x=2;if none of 0,1,2 is smaller 3 then x++')
		assert_equals(check, False)

	def test_assert(self):
		# skip()
		assert self.parse("assert 3rd word in 'hi my friend' is 'friend'")
		assert self.parse("assert 3rd word in 'hi my friend' is 'friend'")
		assert_result_is("assert 3rd word in 'hi my friend' is 'friend'", True)

	def test_and(self):
		x = self.parse('x=2;if x is smaller 3 and x is bigger 1 then true')
		assert x

	def test_and2(self):
		assert self.parse('x=2;if x is smaller 3 and x is bigger 1 then true else false')
		assert_result_is('x=2;if x is smaller 3 and x is bigger 1 then true else false', True)

	def test_but(self):
		assert self.parse('x=2;if x is smaller 3 but not x is smaller 1 then true')
		assert self.parse('x=2;if x is smaller 3 but not x is smaller 1 then true')

	def test_and2(self):
		assert self.parse('x=2;if x is smaller 3 and x is bigger 3 then "DONT REACH" else true')
		assert self.parse('x=2;if x is smaller 3 and x is bigger 3 then "DONT REACH" else true')

	def test_and22(self):
		assert_result_is('x=2;if x is smaller 3 and x is bigger 1 then 4 else 5', 4)
		assert_result_is('x=2;if x is smaller 3 and x is bigger 1 then 4 else 5', 4)

	def test_and3(self):
		assert_result_is('if 1 is smaller 3 and 1 is bigger 3 then 4 else 5', 5)

	def test_no_rollback(self):
		assert_has_error('x=2;if x is smaller 3 and x is bigger 1 then for end')
		assert_has_error('x=2;if x is smaller 3 and x is bigger 1 then for end')

	def test_return_result(self):
		assert_result_is('x=3', 3)
		assert_result_is('x=3;4', 4)

	def test_return_result_var(self):
		assert_result_is('x=3;x', 3)

	def test_it(self):
		assert_result_is('x=3;it', 3)
		assert_result_is('x=3;it*2', 6)

	def test_it2(self):
		assert_result_is('3;it*2', 6)
		assert_result_is('2*it', 12)
		assert_result_is('it*2', 24)
		assert_result_is('6;that*2', 12)
		assert_result_is('6;2*result', 12)

	def test_if_it_result2(self):
		assert_result_is('x=1+2', 3)
		self.parse('x=1+2;assert if it is 3 then true')
		assert self.parse('x=1+2;if it is 3 then true')

	def test_if_it_result3(self):
		assert self.parse('x=1+2;if it is 3 then true else 0')
		assert self.parse('x=1+2;if it is 4 then False else 1')
		x = self.parse('x=1+2;if it is 4 then 1')
		assert x == False

	def test_if_it_result(self):
		x = self.parse('x=1+2;if it is 3 then False else False')
		assert x == False
		x = self.parse('x=1+2;if it is 3 then False else 1')
		assert x == False

	def test_if_it_result2(self):
		x = self.parse('x=1+2;if it is 3 then 1 else False')
		assert x == 1

	def test_or(self):
		assert self.parse('x=2;if x is smaller 1 or x is bigger 1 then true')
		assert self.parse('x=2;if x is smaller 1 or x is bigger 1 then true')

	def test_either_or(self):
		assert self.parse('x=2;if either x is smaller 1 or x is bigger 1 then true')

	# assert self.parse('x=2;if either x is smaller 1 or x is bigger 1 then true')

	def test_else(self):
		assert_equals(parse('if 1 then false else 2'), False)
		assert_equals(parse('if 1 then false else 2'), False)

	def test_if_smaller(self):
		parse('x=2;if x is smaller 3 then x++')
		assert_equals(variables['x'], 3)
		parse('x=2;if x is smaller three then x++')
		assert_equals(variables['x'], 3)
		parse('x=2;if x is smaller three then x++')
		assert_equals(variables['x'], 3)
		parse('x=2;if x is smaller than three then x++')
		assert_equals(variables['x'], 3)
		parse('x=2;if x is smaller than three x++')
		assert_equals(variables['x'], 3)

	def test_if_return(self):
		assert_equals(parse('if 1>0 then beep'), 'beeped')
		assert_equals(parse('if 1>0 then beep else 0'), 'beeped')

	def test_if_return2(self):
		assert_equals(parse('return 1 if 1'), 1)

	def assert_c_ok(self):
		variables['c'] = [0, ]
		z = parse('if c>-1 then beep;')
		assert_equals(z, 'beeped')
		z = parse('c++;if c>1 then beep;')
		assert_equals(z, False)
		parser.do_interpret()
		z = parse('c++;if c>1 then beep;')
		assert_equals(z, 'beeped')
		init('c++')
		parser.do_interpret()
		c2 = parser.block()
		assert_equals(c2, 3)
		assert_equals(the.variables['c'], 3)

	def test_comparisons(self):
		init('two is bigger than zero')
		ok = parser.condition()
		assert_equals(ok, True)

	def test_if_then2(self):
		parser.do_interpret()
		# init('if 1>0 then: beep;')
		# parser.if_then()
		parse('if 1>0 then: beep;')
		assert_equals(self.result(), 'beeped')

		parse('if 1>0 then beep')
		assert_equals(self.result(), 'beeped')
		parse('if 1>0 then: beep')
		assert_equals(self.result(), 'beeped')

	def test_if_then4(self):
		parser.do_interpret()
		parse('if 1>0 then: beep;end')
		assert_equals(self.result(), 'beeped')

	def test_if_then3(self):
		parse('if 1>0\n beep\nend')
		assert_equals(self.result(), 'beeped')

	def test_if_then4(self):
		# skip()
		parse('if 1>0 beep')
		assert_equals(self.result(), 'beeped')

	def test_if_then5(self):
		parse('if two is bigger than zero then beep')
		assert_equals(self.result(), 'beeped')

	def test_root(self):
		self.assert_that('1==1')

	def test_complicated(self):
		# skip()
		# ; is  consumed for end of action but also needed for end of statement
		parse('x is 2; if all 0,2,4 are smaller 5 then increase x; assert x equals 3')
		assert (the.result == True)

	def test_zbug_and4(self):  # OK When tested separately!?
		assert_result_is('x=2;if x is smaller 3 and x is bigger 3 then 4 else 5', 5)
		assert_result_is('x=2;if x is smaller 3 and x is bigger 3 then 4 else 5', 5)

	#
	# def test_complicated2(self):
	#	 parse('x is 2; if 0,2,4 are all smaller 5 then increase x; assert x equals 3')
	#	 assert(self.result()==True)
	#
	# def test_complicated3(self):
	#	 parse('x is 2; if 0,2,4 are smaller 5 then increase x; assert x equals 3')
	#	 assert(self.result()==True)
