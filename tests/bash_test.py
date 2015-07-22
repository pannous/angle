import angle
angle.use_tree = angle.emit
angle.use_tree = False
from parser_test_helper import *


class BashTest(ParserBaseTest):
    def setUp(self):
        pass

    def test_pipe(self):
        parse("def column n:n;bash 'ls -al' | column 1| row 2")
