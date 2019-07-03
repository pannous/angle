#!/usr/bin/env python
import angle
#
#
from parser_test_helper import *


class JobTest(ParserBaseTest):

		def test_simple(self):
			context.use_tree = False
			assert_equals(parse('do print 3'), 3) # the program waits for the job to finish

		def test_invariance(self):
			skip()
			assert_result_is('thread{print 3}', 'go print 3')

		def test_complex(self):
				skip()
				xs=parse("xs=for i in 1 to 10: go print i")
				# assert_that("elements in xs are 1 to 10, but order different")
