#!/usr/bin/env python
from parser_test_helper import *


# see HashTest
class DataTest(ParserBaseTest):

	def setUp(self):
		parser.clear()
		# context.use_tree = True
		# context.interpret = False

	def test_basic(self):
		assert_result_is("#bla\nprint 'hello'","hello")
		assert_result_is("{a:1}",{'a':1})

