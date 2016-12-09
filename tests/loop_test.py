#!/usr/bin/env python
import angle
import english_parser


from tests.parser_test_helper import *


class LoopTest(ParserBaseTest,unittest.TestCase):
    

    def _test_forever(self):
        init('beep forever')
        english_parser.loops()
        parse('beep forever')

    def test_while_return(self):
        assert_equals(parse('c=0;while c<1:c++;beep;done'), 'beeped')
        assert_equals(parse('c=0;while c<1:c++;beep;done'), 'beeped')

    def test_while_loop(self):
        parse('c=0;while c<3:c++;beep;done')
        assert_equals(3, the.variables['c'].value)

    def test_increment_expressions(self):
        parse('counter=1')
        assert_equals(1, parse('counter'))
        parse('counter++')
        assert_equals(2, parse('counter'))
        parse('counter+=1')
        assert_equals(3, parse('counter'))
        parse('counter=counter+counter')
        assert_equals(6, parse('counter'))

    def test_repeat(self):
        parse('counter =0; repeat three times: increase the counter; okay')
        self.assert_that('counter==3')
        counter_ = the.variables['counter']
        assert_equals(counter_.value, 3)

    def test_repeat3(self):
        assert_result_is('counter =0; repeat three times: counter=counter+1; okay', 3)
        assert_result_is('counter =0; repeat while counter < 3: counter=counter+1; okay', 3)

    def test_repeat1(self):
        parse('counter =0; repeat three times: counter+=1; okay')
        self.assert_that('counter =3')
        parse('counter =0; repeat three times: counter++; okay')
        counter = the.variableValues['counter']
        self.assert_that('counter =3')
        self.assert_that(counter.equals(3))

    def _test_forever(self):
        self.parser.s('beep forever')
        self.parser.loops()
