#!/usr/bin/env python
from tests.parser_test_helper import *


class LoopTest(ParserBaseTest):
	def test_match(self):
		self.assert_that("'beep' ~ r'ee'")

	def test_match2(self):
		self.assert_that("'be4ep' ~ regex '\d' == 4")

	def test_match3(self):
		# skip()
		self.assert_that("'be4ep' ~ '\d' == 4")
