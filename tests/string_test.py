#!/usr/bin/env python
import angle
from tests.parser_test_helper import *


class StringTest(ParserBaseTest,unittest.TestCase):

    def setUp(self):
        super(StringTest, self).setUp()
        parser.clear()

    def test_string_methods(self):
        parse("invert 'hi'")
        self.assert_equals(the.result, 'ih')
        self.assert_that("invert('hi') is 'ih'")
        # self.assert_that("invert 'hi' is 'ih'") # todo HIGHER BINDING OF CALL!

    def test_nth_word(self):
        self.assert_that("3rd word in 'hi my friend !!!' is 'friend'")
        self.assert_that("3rd word in 'hi my friend !!!' is 'friend'")

    def _test_advanced_string_methods(self):
        parse("x='hi' inverted")
        self.assert_that(the.result.equals('ih'))
        self.assert_equals('ih', self.variableValues['x'])

    def _test_select_character(self):
        self.assert_that("last character of 'hi' is 'i'")
        self.assert_that("first character of 'hi' is 'h'")
        self.assert_that("second character of 'hi' is 'i'")

    def _test_select_word(self):
        self.assert_that("first word of 'hi you' is 'hi'")
        self.assert_that("second word of 'hi you' is 'you'")
        self.assert_that("last word of 'hi you' is 'you'")

    def test_gerunds(self):
        init('gerunding')
        x = parser.gerund()
        init('gerunded')
        x = parser.postjective()
        x

    def test_concatenation(self):
        parser.do_interpret()
        parse("z is 'Hi' plus 'World'")
        self.assert_equals(the.variables['z'], 'HiWorld')

    def test_concatenation2(self):
        parser.do_interpret()
        parse("x is 'Hi'; y is 'World';z is x plus y")
        self.assert_equals(the.variables['z'], 'HiWorld')

    def test_concatenation_b(self):
        init("x is 'hi'")
        parser.setter()
        self.assert_equals('hi', the.variables['x'])
        init("x + ' world'")
        r = parser.algebra()
        self.assert_equals(r, 'hi world')
        parse("x + ' world'")
        self.assert_equals(result(), 'hi world')
        parse("y is ' world'")
        parse('z is x + y')
        self.assert_equals(the.variables['z'], 'hi world')

    def test_concatenation_b0(self):
        parse("x is 'hi'")
        parse("y is ' you'\n       z is x + y")
        # parse("y is ' you'\nz is x + y")
        self.assert_equals(the.variables['z'], 'hi you')

    def test_concatenation_b1(self):
        init("x is 'hi'")
        parser.setter()
        self.assert_equals('hi', the.variables['x'])
        init("x + ' world'")
        r = parser.algebra()
        self.assert_equals(r, 'hi world')
        parse("x + ' world'")
        self.assert_equals(result(), 'hi world')
        parse("y is ' world'")
        parse('z is x + y')
        self.assert_equals(the.variables['z'], 'hi world')

    def test_concatenation_c(self):
        parse("x is 'hi'")
        parse("y is ' you'")
        parse('z is x + y')
        self.assert_equals(the.variables['z'], 'hi you')

    def test_newline_statements(self):
        parse("x is 'hi';\n           z='ho'")
        self.assert_equals(the.variables['z'], 'ho')

    def test_concatenation_c3(self):
        parse("x is 'hi'")
        parse("y is ' you';z is x + y")
        self.assert_equals(the.variables['z'], 'hi you')

    def DONT_test_concatenation_by_and(self):
        parse('z = x and y')
        self.assert_equals('hi world', the.variables['z'])
        self.assert_that("x and y == 'hi world'")
        parse("z is x and ' ' and y")
        self.assert_that('type of z is string or list')

    def dont_test_list_concatenation(self):
        init("'hi' ' ' 'world'")
        z = parser.expressions()
        self.assert_equals(z, 'hi world')
        the.variables['x'] = ['hi', ]
        the.variables['y'] = ['world', ]
        init("z=x ' ' y")
        z = parser.setter()
        self.assert_equals(z, 'hi world')
        parse("x is 'hi'; y is 'world';z is x ' ' y")
        self.assert_that('type of z is string or type of z is list')
        self.assert_that('type of z is string or list')
        self.assert_equals(the.variables['z'], 'hi world')
        self.assert_that("z is 'hi world' OR z is 'hi',' ','world'")

    def test_concatenation2(self):
        parse("x is 'hi'; y = ' world'")
        self.assert_equals(the.variables['x'],'hi')
        self.assert_equals(the.variables['y'],' world')
        self.assert_equals(parse('x + y'), 'hi world')
        self.assert_that("x plus y == 'hi world'")

    def test_concatenation2b(self):
        self.assert_equals(parse("'hi'+ ' '+'world'"), 'hi world')
        self.assert_result_is("'hi'+ ' '+'world'", "'hi world'")
        parse("x is 'hi'; y is 'world';z is x plus ' ' plus y")
        self.assert_equals(the.variables['z'], 'hi world')
        self.assert_that("z is 'hi world'")

    def test_type(self):
        parse("x='hi'")
        self.assert_result_is('type of x', str)
        self.assert_that('type of x is string')

    def test_type3(self):
        parse("x be 'hello world';")
        self.assert_that('x is a string')
        self.assert_that('type of x is string')
        self.assert_that('class of x is string')
        self.assert_that('kind of x is string')
        parse('yy= class of x')
        self.assert_equals(str, the.variables['yy'].value)
        # self.assert_equals(Quote, the.variables['y'])
        self.assert_that('yy is string')
        parse('yy is type of x')
        self.assert_that('yy is string')

    def test_type1(self):
        init("class of 'hi'")
        parser.evaluate_property()
        self.assert_equals(result(), str)
        # self.assert_equals(result(), Quote)
        init("class of 'hi'")
        parser.expression()
        self.assert_equals(result(), str)
        # self.assert_equals(result(), Quote)
        parse("class of 'hi'")
        self.assert_equals(result(), str)
        # self.assert_equals(result(), Quote)

    def test_type2(self):
        parse("x='hi';\n      class of x")
        parse("x='hi';class of x")
        self.assert_equals(result(), str)
        # self.assert_equals(result(), Quote)

    def test_result(self):
        parse("x be 'hello world';show x;x; class of x")
        self.assert_that('type of x is string')
        self.assert_that('class of x is string')
        parse('yy is type of x')
        self.assert_that('yy is string')
