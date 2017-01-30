#!/usr/bin/env python
# -*- coding: utf-8 -*-

from tests.parser_test_helper import *


class NumberTest(ParserBaseTest, unittest.TestCase):
	def test_unicode(self):
		assert_result_is("½", 0.5)

	def test_increment(self):
		assert_result_is('x=2;x++', 3)

	def test_addition(self):
		assert_result_is('x=2;x+1', 3)

	def test_div(self):
		assert_result_is('3/3', 1)

	def test_type1(self):
		print((parse('class of 1')))
		assert_equals(self.result(), int)
		parse('class of 3.3')
		assert (the.result == float)

	def test_type2(self):
		assert '3.2 is a Numeric'
		assert '3.2 is a Float'
		assert '3.2 is a float'
		assert '3.2 is a real'
		assert '3.2 is a float number'
		assert '3.2 is a real number'

	def test_type3(self):
		assert '3 is a Number'
		assert '3 is a Fixnum'
		assert '3 is a Numeric'
		assert '3 is a Integer'

	def test_english_number_types(self):
		assert '3.2 is a number'
		assert '3.2 is a real number'
		assert '3.2 is a real'
		assert '3.2 is a float'
		assert '3.2 is a float number'
		assert '3 is a number'
		assert '3 is a integer'
		assert '3 is an integer'

	def _test_int_methods(self):
		parse('invert 3')
		assert self.result.equals('1/3')

	def test_parse_float(self):
		init('5.0')
		x = self.parser.real()
		parse('20/5.0')
		assert_equals(result(), 4)
