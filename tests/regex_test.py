#!/usr/bin/env python
import angle
import english_parser

angle.use_tree = False
from parser_test_helper import *


class LoopTest(ParserBaseTest):
    
    def test_match(self):
        assert_that("'beep' ~ r'ee'")

    def test_match2(self):
        assert_that("'be4ep' ~ regex '\d' == 4")

    def test_match3(self):
        # skip()
        assert_that("'be4ep' ~ '\d' == 4")
