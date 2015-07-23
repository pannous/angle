import angle
angle.use_tree = angle.emit
angle.use_tree = False
from parser_test_helper import *


class BashTest(ParserBaseTest):

    def test_pipe(self):
        parse("bash 'ls -al' | column 1| row 2")

    def test_ls(self):
        f=parse("ls | row 4")
        f=parse("ls | item 4")
        assert_equal(f, 'algebra_test.py')

    # def test_pipe2(self):
    #     parse("def column n:n;bash 'ls -al' | column 1| row 2")
