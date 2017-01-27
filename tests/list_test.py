#!/usr/bin/env python
from tests.parser_test_helper import *
from nodes import *

context.use_tree = False


class ListTest(ParserBaseTest, unittest.TestCase):
	def setUp(self):
		parser.clear()

	# 	# context.use_tree=False
	# 	self.parser.do_interpret()
	# 	super(ListTest, self).setUp()
	# 	super(ParserBaseTest, self).setUp()


	def test_natural_array_index(self):
		assert_equals(parse('second element in [1,2,3]'), 2)

	def test_natural_array_index_var(self):
		parse('x=[1,2,3]')
		assert_equals(parse('third element in x'), 3)

	def test_lists(self):
		x = parse('1 , 2 , 3')
		assert_equals(x, [1, 2, 3])
		x = parse('1,2,3')
		assert_equals(x, [1, 2, 3])
		x = parse('[1,2,3]')
		assert_equals(x, [1, 2, 3])
		x = parse('{1,2,3}')
		assert_equals(x, [1, 2, 3])
		x = parse('1,2 and 3')
		assert_equals(x, [1, 2, 3])
		x = parse('[1,2 and 3]')
		assert_equals(x, [1, 2, 3])
		x = parse('{1,2 and 3}')
		assert_equals(x, [1, 2, 3])

	def test_type0(self):
		init('1 , 2 , 3')
		assert_equals(self.parser.liste(), [1, 2, 3])
		init('1,2,3')
		assert_equals(self.parser.liste(), [1, 2, 3])
		init('[1,2,3]')
		assert_equals(self.parser.liste(), [1, 2, 3])
		init('{1,2,3}')
		assert_equals(self.parser.liste(), [1, 2, 3])
		init('1,2 and 3')
		assert_equals(self.parser.liste(), [1, 2, 3])
		init('[1,2 and 3]')
		assert_equals(self.parser.liste(), [1, 2, 3])
		init('{1,2 and 3}')
		assert_equals(self.parser.liste(), [1, 2, 3])

	def test_list_methods(self):
		context.use_tree = True
		x = parse('invert [1,2,3]')
		assert_equals(x, [3, 2, 1])
		assert_equals(result(), [3, 2, 1])

	def test_error(self):
		assert_has_error("first item in 'hi,'you' is 'hi'")
		assert_has_error("first item in 'hi,'you' is 'hi'")

	def test_last(self):
		self.assert_that("last item in 'hi','you' is equal to 'you'")
		self.assert_that("last item in 'hi','you' is equal to 'you'")

	def test_select2(self):
		self.assert_that("first item in 'hi','you' is 'hi'")
		self.assert_that("second item in 'hi','you' is 'you'")
		self.assert_that("last item in 'hi','you' is 'you'")

	def test_select3(self):
		assert_equals(parse("1st word of 'hi','you'"), 'hi')
		self.assert_that("1st word of 'hi','you' is 'hi'")
		self.assert_that("2nd word of 'hi','you' is 'you'")
		self.assert_that("3rd word of 'hi','my','friend' is 'friend'")

	def test_select4(self):
		self.assert_that("first word of 'hi','you' is 'hi'")
		self.assert_that("second word of 'hi','you' is 'you'")
		self.assert_that("last word of 'hi','you' is 'you'")

	def test_select5(self):
		skip()
		self.assert_that('numbers are 1,2,3. second number is 2')
		self.assert_that('my friends are a,b and c. my second friend is b')

	def test_select6(self):
		self.assert_that("last character of 'howdy' is 'y'")
		self.assert_that("first character of 'howdy' is 'h'")
		self.assert_that("second character of 'howdy' is 'o'")

	def test_list_syntax(self):
		self.assert_that('1,2 is [1,2]')
		self.assert_that('1,2 is {1,2}')
		self.assert_that('1,2 == [1,2]')
		self.assert_that('[1,2] is {1,2}')
		self.assert_that('1,2 = [1,2]')

	def test_list_syntax2(self):
		self.assert_that('1,2,3 is the same as [1,2,3]')
		self.assert_that('1,2 and 3 is the same as [1,2,3]')
		self.assert_that('1,2 and 3 are the same as [1,2,3]')
		self.assert_that('1,2 and 3 is [1,2,3]')

	def test_concatenation(self):
		parse('x is 1,2,3;y=4,5,6')
		assert (equals([1, 2, 3], the.variableValues['x'], ))
		assert (equals(3, len(the.variableValues['y'], ), ))
		init('x + y')
		z = self.parser.algebra()
		if context.use_tree:
			z = parser.eval_ast(z)
		assert_equals(len(z), 6)
		z = parse('x + y')
		assert_equals(len(z), 6)
		assert_equals(len(result(), ), 6)
		z = parse('x plus y')
		assert_equals(len(z), 6)

	def test_concatenation_plus(self):
		parse('x is 1,2;y=3,4')
		z = parse('x plus y')
		assert_equals(z, [1, 2, 3, 4])

	def test_concatenation2(self):
		parse('x is 1,2,3;y=4,5,6')
		parse('x + y')
		assert (equals(6, len(result(), )))
		parse('z is x + y')
		assert_equals(the.variables['z'], [1, 2, 3, 4, 5, 6])

	def test_concatenation2c(self):
		# raise Exception("SERIOUS BUG: LOOP!")
		# skip()
		parse('x is 1,2\n       y is 3,4\n       z is x + y')
		assert_equals(the.variables['z'], [1, 2, 3, 4])

	def test_concatenation3(self):
		variables['x'] = [1, 2]
		variables['y'] = [3, 4]
		init('x + y == 1,2,3,4')
		self.parser.condition()
		assert ('x + y == 1,2,3,4')
		assert_equals(parse('x plus y'), [1, 2, 3, 4])
		assert ('x plus y == [1,2,3,4]')

	def test_concatenation4(self):
		assert ('1,2 and 3 == 1,2,3')
		assert ('1,2 and 3 == 1,2,3')

	def test_type1(self):
		init('class of 1,2,3')
		self.parser.evaluate_property()
		assert_equals(result(), list)
		init('class of [1,2,3]')
		self.parser.expression()
		assert_equals(result(), list)
		skip()
		parse('class of 1,2,3')
		assert_equals(result(), list)

	def test_type2(self):
		parse('x=1,2,3;class of x')
		assert_equals(result(), list)

	def test_type(self):
		self.setUp()
		parse('x=1,2,3;')
		assert ('type of x is Array')

	def test_type3(self):
		parse('x be 1,2,3;y= class of x')
		assert (equals(list, the.variables['y'].value))
		assert (isinstance(the.variables['x'].value, list))
		assert_equals(the.variables['x'].type, list)

	def test_type3b(self):
		parse('x be 1,2,3;y= class of x')
		assert_equals(type(the.variableValues['x']), list)
		# assert_equals(kind(the.variableValues['x'], list)
		assert_equals(the.variables['y'].value, list)
		self.assert_that('y is a Array')
		self.assert_that('y is an Array')
		self.assert_that('y is Array')
		self.assert_that('Array == class of x')
		self.assert_that('class of x is Array')
		self.assert_that('kind of x is Array')
		self.assert_that('type of x is Array')

	def test_type4(self):
		variables['x'] = Variable({'name': 'x', 'value': [1, 2, 3], })
		self.assert_that('class of x is Array')
		self.assert_that('kind of x is Array')
		self.assert_that('type of x is Array')

	def test_len(self):
		variables['xs'] = Variable({'value': [1, 2, 3], 'name': 'xs', })
		self.assert_that('length of xs is 3')
		self.assert_that('size of xs is 3')
		self.assert_that('count of xs is 3')

	def test_map(self):
		# parse("def square x:x*x")
		assert_equals(parse('square [2,3,4]'), [4, 9, 16])
		assert_equals(parse('square [1,2 and 3]'), [1, 4, 9])

	def test_and(self):
		skip()
		self.assert_that('square of 1,2 and 3 == 1,4,9')
		assert_equals(parse('square 1,2,3'), [1, 4, 9])
		assert_equals(parse('square 1,2 and 3'), [1, 4, 9])

	def test_and2(self):
		skip()
		# parse("def square x:x*x")
		# parse("def square(x:int)->int:x*x")
		# parse("def square(xs:list)->list:square all in xs")
		assert_result_is('square 1,2 and 3', [1, 4, 9])
		self.assert_that('square of [1,2 and 3] equals 1,4,9')

	def test_and3(self):
		skip()
		parse('assert square of [1,2 and 3] equals 1,4,9')

	def test_and4(self):
		skip()
		self.assert_that('square 1,2 and 3 == 1,4,9')

	def test_every_selector(self):
		# DAMN PLURAL!
		self.assert_result_is('all letter in 1,"a",2,"c",3', ["a", "c"])
		self.assert_that('(all letter in 1,"a",2,"c",3) == "a","c"')

	# self.assert_result_is('all letters in 1,"a",2,"c",3',["a","c"])
	# self.assert_that('(all letters in 1,"a",2,"c",3) == "a","c"')

	def test_every_selector2(self):
		self.assert_that('(all number in 1,"a",2,3) == 1,2,3')
		self.assert_that('(all numbers in 1,"a",2,3) == 1,2,3')
		self.assert_that('(every number in 1,"a",2,3) == 1,2,3')

	def test_every_selector_no_braces(self):
		self.assert_that('all number in 1,"a",2,3 == 1,2,3')
		self.assert_that('all numbers in 1,"a",2,3 == 1,2,3')
		self.assert_that('every number in 1,"a",2,3 == 1,2,3')

	def test_map3(self):
		skip()
		self.assert_that('square every number in 1,"a",2,3 == 1,4,9')

	# wrong operator precedence:
	# square(number, [1,"a",2,3])  vs
	# square(numbers in [1,"a",2,3])


	def test_map4(self):
		skip()  # too hard
		self.assert_that('add one to every number in 1,2,3 ==2,3,4')
		self.assert_that("square every number in 1,'a',3 ==1,9")

	def test_hasht(self):
		init('{1,2,3}')
		assert_equals(self.parser.liste(), [1, 2, 3])
		init('{a:1,b:2,c:3}')
		assert_equals(self.parser.hash_map(), {'b': 2, 'a': 1, 'c': 3, })
