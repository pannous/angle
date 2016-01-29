#!/usr/bin/env python

from parser_test_helper import *


class ConditionTest(ParserBaseTest):

    def test_block(self):
        assert_result_is(parse("begin 1.times do 1 end end"),1)

    def test_block_returns(self):
        skip() #
        assert_result_is(parse("print begin 1.times do 1 end end"),1)
