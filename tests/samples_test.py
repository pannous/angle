#!/usr/bin/env python
import angle
angle.use_tree = True
angle._verbose = True
from parser_test_helper import *


class SamplesTest(ParserBaseTest):


    def test_hello_world(self):
      angle._verbose = True
      the._verbose = True
      x=parse("samples/hello-world.e")
      assert_equals(x,"hello world")
