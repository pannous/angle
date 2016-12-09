#!/usr/bin/env python
# -*- coding: utf-8 -*-

from tests.parser_test_helper import *


class AlgebraTest(ParserBaseTest,unittest.TestCase):

    # def setUp(self):
    #     self.parser=parser(self) #HYH>?
    #     self.parser.do_interpret()
    #     context.use_tree=False
    #     super(AlgebraTest, self).setUp()

    def test_algebra1(self):
        assert_result_is('two minus 1', 1)
        assert_result_is('3 minus one', 2)
        init('4.0')
        assert_equals(self.parser.fraction(), 4)
        init('4.0+3.0')
        self.parser.do_interpret()

        assert_equals(self.parser.algebra(), 7)
        assert_result_is('4.0+3.0', 7.0)

    def test_algebra_NOW(self):

        # skip('test_algebra_NOW, DONT SKIP!')
        assert_result_is('1.0+3/4.0', 7/4.)
        assert_result_is('1.0+(3/4.0)', 7/4.)
        assert_result_is('1+3/4.0', 7 / 4.)

    def test_tau_pi(self):

        import math
        self.assert_that('tau / 2 = pi')
        # assert_result_is('tau / 2 ', math.pi)
        # assert_result_is('†/2', math.pi)# alt+t on mac
        # assert_result_is('τ / 2 = π', True)

    def test_algebra_NOW2(self):
        # skip('test_algebra_NOW, DONT SKIP!')
        assert_result_is('1+(3/4)', 7/4.)
        assert_result_is('1+3/4', 7/4.)

    def test_algebra(self):
        ok = parse('2*(3+10)')
        print((('Parsed input as ' + str(ok)) + '!'))
        assert_equals(ok, 26)
        # skip()
        # assert(self.current_node!=(None))
        # full_value = self.current_node.full_value()
        # val = eval(full_value)
        # assert_equals(val, 26)
        # val = self.current_node.eval_node(self.variableValues)
        # assert_equals(val, 26)
