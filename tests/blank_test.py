#!/usr/bin/env python
from tests.parser_test_helper import *


class BlankTest(ParserBaseTest):

	def test_ok(self):
		assert_contains([1],1)
