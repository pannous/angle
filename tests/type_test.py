#!/usr/bin/env python
import angle

from tests.parser_test_helper import *


class TypeTest(ParserBaseTest,unittest.TestCase):

		def test_typed_variable(self):
				parse('Int i=7')
				assert_equals(the.variables['i'].type, int)

		def test_typed_variable2(self):
				parse('int i=7')
				assert_equals(the.variables['i'].type, int)

		# def test_typed_variable2(self):
		#     parse('int i=7')
		#     assert_equals(variableTypes['i'], Integer)
		#
		# def test_auto_typed_variable(self):
		#     parse('i=7')
		#     assert_equals(variableTypes['i'], Fixnum)


		def test_class11(self):
			init('class of 1,2,3')
			parser.evaluate_property()
			assert_equals(result(), list)
			init('class of [1,2,3]')
			parser.expression()
			assert_equals(result(), list)

		def test_class1(self):
			# skip()
			parse('class of 1,2,3')  # [<class 'int'>, 2, 3] SHOULD BE <class 'list'>  BUG
			assert_equals(result(), list)

		def test_class22(self):
			parse('x=1;class of x')
			assert_equals(result(), int)

		def test_class2(self):
			parse('x=1,2,3;class of x')
			assert_equals(result(), list)

		def test_type11(self):
			init('type of 1,2,3')
			parser.evaluate_property()
			assert_equals(result(), list)
			init('type of [1,2,3]')
			parser.expression()
			assert_equals(result(), list)

		def test_type1(self):
			# skip()
			parse('type of 1,2,3')  # [<type 'int'>, 2, 3] SHOULD BE <type 'list'>  BUG
			assert_equals(result(), list)

		def test_type22(self):
			parse('x=1;type of x')
			assert_equals(result(), int)

		def test_type2(self):
			parse('x=1,2,3;type of x')
			assert_equals(result(), list)

		def test_type(self):
				parse('x=1,2,3;')
				assert('type of x is Array')

		def test_type3(self):
				parse('x be 1,2,3;y= class of x')
				assert_equals(the.variables['x'].type , list)
				assert_equals(type(the.variableValues['x']) , list)
				assert_equals(type(the.variables['x'].value) , list)
				assert_equals(the.variableValues['y'], list)
				assert_equals(the.variables['y'].value, list)
				assert_equals(the.variables['y'].type, type)

		def test_type33(self):
				parse('x be 1,2,3;y= class of x')
				self.do_assert('x is a Array')
				self.do_assert('x is an Array')
				self.do_assert('x is Array')
				self.do_assert('Array == class of x')
				self.do_assert('class of x is Array')
				self.do_assert('kind of x is Array')
				self.do_assert('type of x is Array')

		def test_type34(self):
			parse('x be 1,2,3;y= class of x')
			self.do_assert('Array == y')
			self.do_assert('y is Array')
			skip()
			self.do_assert('y is an Array') # nee

		def test_type4(self):
				variables['x'] = [[1, 2, 3], ]
				self.do_assert('class of x is Array')
				self.do_assert('kind of x is Array')
				self.do_assert('type of x is Array')

		def test_type_cast(self):
				# assert_result_is('2.3', None)
				parse('int z=2.3 as int')
				assert_equals(result(), 2)

		def test_no_type_cast(self):
				assert_equals(type(parse('2.3 as int'), ), int)
				assert_equals(type(parse('2.3'), ), float)

		# def test_type_hinting_python3_5(self):
		#     from typing import List  # , TYPE_CHECKING
		#     def sum_and_stringify(nums: List[int]) -> str:
		#         return str(sum(nums))
		#     print(sum_and_stringify([1, 'b']))
		#
		# def test_type_hinting_python3_5b():
		#     def sum_and_stringify(nums: list) -> str:
		#         return str(sum(nums))
		#     print(sum_and_stringify([1,'b']))

		def test_type_hinting_python2(self):
				def sum_and_stringify(nums):
						# type (list) -> str
						return str(sum(nums))
				print((sum_and_stringify([1, 'b'])))

