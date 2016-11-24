#!/usr/bin/env python
import angle
import english_parser

angle.use_tree = False
from parser_test_helper import *


class LoopTest(ParserBaseTest):
    

    def test_match(self):
        assert_that("'beep' ~ /ee/")
