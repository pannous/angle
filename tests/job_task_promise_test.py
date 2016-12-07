#!/usr/bin/env python
import angle
#
#
from tests.parser_test_helper import *


class JobTest(ParserBaseTest):

    def test_simple(self):
        assert_equals(parse('do print 3'), 3) # the program waits for the job to finish

    def test_invariance(self):
        assert_result_is('thread{print 3}', 'go print 3')

    def test_complex(self):
        xs=parse("xs=for i in 1 to 10: go print i")
        # assert_that("elements in xs are 1 to 10, but order different")
