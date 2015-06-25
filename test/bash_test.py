import angle
angle.use_tree = angle.emit
angle.use_tree = False
from parser_test_helper import *


class BashTest(ParserBaseTest):
    

    def test_pipe(self):
        parse("bash 'ls -al' | column 1")
        parse("bash 'ls -al' | column 1")
