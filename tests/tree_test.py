#!/usr/bin/env python
import angle
from parser_test_helper import *
angle.use_tree=True

class TreeTest(ParserBaseTest):

    def test_num(self):
        assert_result_emitted("1",ast.Num(1))

    def test_method4(self):
        # init('how to integrate a bug\n      test\n    ok')
        init('how to integrate a bug\n      test\nok')
        assert(self.parser.method_definition())

    def _test_block(self):
        init('let the initial value of I be x;\n\n      step size is the length of the interval,\n      divided by the number of steps\n\n      var x = 8;')
        self.parser.block()

    def _test_while(self):
        parse('i=0;y=5;while i is smaller or less then y do\n        increase i by 4;\n      done')
        assert_equals(the.variableValues['i'], 8)

    def _test_while2(self):
        init('while i is smaller or less then y do\n evaluate the function at point I\n add the result to the sum\n increase I by the step size\ndone')
        self.parser.looper()

    def _test_setter3(self):
        init('step size is the length of the interval, divided by the number of steps')
        self.parser.setter()

    def test_looper(self):
        skip()
        parse('i=1;y=2;')
        init('while i is smaller or equal y do\ni++\nend')
        self.parser.loops()
        init('while i is smaller or equal than y do\ni++\nend')
        self.parser.loops()

    def test_then_typo(self):
        skip()
        parse('while i is smaller or equal y then do\nyawn\nend')
        skip()
        parse('while i is smaller or equal then y do\nyawn\nend')

    def test_method_call(self):
        skip()
        init('evaluate the function at point I')

    def test_algebra_NOW(self):
        # skip('test_algebra_NOW, DONT SKIP!')
        assert_result_is('1+3/4.0', 1.75)
        assert_result_is('1.0+3/4.0',1.75)
        assert_result_is('1.0+3/4',1.75)
        assert_result_is('1+3/4',1.75)

    def test_fraction(self):
        assert_result_is('1 3/4',1.75)

    def test_algebra(self):
        init('2*(3+10)')
        ok = self.parser.algebra()
        print('Parsed input as %s !'%ok)
        assert_equals(ok, 26)
