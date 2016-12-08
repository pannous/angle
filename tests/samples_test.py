#!/usr/bin/env python
from tests.parser_test_helper import *

class SamplesTest(ParserBaseTest):

    def setUp(self):
      super(SamplesTest, self).setUp()

      # context._verbose = True
      self.parser.clear()

    def test_addition(self):
      x=parse("samples/addition.e")
      assert x, "parsed"
      assert_result_is("add 7 to 3","10")

    def test_hello_world(self):
      x=parse("samples/hello-world.e")
      assert_equals(x,"hello world")
