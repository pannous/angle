#!/usr/bin/env python


from tests.parser_test_helper import *

context.use_tree = False


class LoopTest(ParserBaseTest, unittest.TestCase):
	def _test_forever(self):
		init('beep forever')
		english_parser.loops()
		parse('beep forever')

	def test_while_return(self):
		assert_equals(parse('c=0;while c<1:c++;beep;done'), 'beeped')
		assert_equals(parse('c=0;while c<1:c++;beep;done'), 'beeped')

	def test_while_loop(self):
		parse('c=0;while c<3:c++;beep;done')
		assert_equals(3, the.variables['c'].value)

	def test_for_loop(self):
		assert_result_is("c=0;for x in 1 to 10: c+=x;c", 55)
		# assert_result_is("c=0;for x in 1 to 10: c+=x;print c", 55)

	def test_for_loop2(self):
		assert_result_is(" for x in 1 to 10: print x",10)

	def test_increment_expressions(self):
		parse('counter=1')
		assert_equals(1, parse('counter'))
		parse('counter++')
		assert_equals(2, parse('counter'))
		parse('counter+=1')
		assert_equals(3, parse('counter'))
		parse('counter=counter+counter')
		assert_equals(6, parse('counter'))


	def test_repeat(self): # increase acting on Variable, not on value! hard for AST?
		parse('counter =0; repeat three times: increase the counter; okay')
		counter_ = the.variables['counter']
		assert_equals(counter_.value, 3)
		self.assert_that('counter==3')

	def test_repeat3(self):
		print("I DON'T GET IT")
		# TypeError: unsupported operand type(s) for +: 'BinOp' and 'int' why??
		assert_result_is('counter =0; repeat three times: counter=counter+1; okay', 3)

	def test_repeat4(self):
		assert_result_is('counter =0; repeat while counter < 3: counter=counter+1; okay', 3)

	def test_increment(self):
		assert_result_is('counter=1;counter+=2;',3)

	def test_repeat1(self):
		parse('counter =0; repeat three times: counter+=1; okay')
		self.assert_that('counter =3')

	def test_repeat2(self):
		parse('counter =0; repeat three times: counter++; okay')
		counter = the.variableValues['counter']
		self.assert_that('counter =3')
		assert(counter == 3)

	def test_forever(self):
		skip("we don't have time forever")
		self.parser.s('beep forever')
		self.parser.loops()
