#!/usr/bin/env python
# -*- coding: utf-8 -*-
import angle
from parser_test_helper import *


class CommentTest(ParserBaseTest):

    def setUp(self):
        context.testing = True
    # 	context.use_tree=False

    def test_python_comment(self):
        assert_result_is('1 # 3', 1)

    def test_java_comment(self):
        assert_result_is('1 // 3', 1)

    def test_java_block_comment(self):
        assert_result_is('1 /*3*/ +3', 4)

    def test_bad_comment(self):
        skip()
        assert_result_is('1\n--no comment', 1)
