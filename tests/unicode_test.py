#!/usr/bin/env python
# -*- coding: utf-8 -*-

import angle
from tests.parser_test_helper import *


class UnicodeTest(ParserBaseTest,unittest.TestCase):

    def setUp(self):
        super(UnicodeTest, self).setUp()
        context.use_tree=False
        self.parser.clear()

    def test_string_methods(self):
        self.assert_result_is("if ½*2≠1: 2; else 4",4)
