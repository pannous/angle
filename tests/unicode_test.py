#!/usr/bin/env python
# -*- coding: utf-8 -*-

import angle
from parser_test_helper import *


class UnicodeTest(ParserBaseTest,unittest.TestCase):

    def setUp(self):
        angle.use_tree = False
        angle._verbose = False
        super(UnicodeTest, self).setUp()
        self.parser.clear()

    def test_string_methods(self):
        self.assert_result_is("if ½*2≠1: 2; else 4",4)
