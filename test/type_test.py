import _global
_global.use_tree = False
from parser_test_helper import *


class TypeTest(ParserBaseTest):

    def test_typed_variable(self):
        parse('Int i=7')
        assert_equals(variableTypes['i'], int)

    def test_typed_variable2(self):
        parse('int i=7')
        assert_equals(variableTypes['i'], int)

    # def test_typed_variable2(self):
    #     parse('int i=7')
    #     assert_equals(variableTypes['i'], Integer)
    #
    # def test_auto_typed_variable(self):
    #     parse('i=7')
    #     assert_equals(variableTypes['i'], Fixnum)

    def test_type11(self):
        init('class of 1,2,3')
        self.parser.evaluate_property()
        assert_equals(result(), list)
        init('class of [1,2,3]')
        self.parser.expression()
        assert_equals(result(), list)

    def test_type1(self):
        # skip()
        parse('class of 1,2,3') #  [<type 'int'>, 2, 3] SHOULD BE <type 'list'>  BUG
        assert_equals(result(), list)

    def test_type22(self):
        parse('x=1;class of x')
        assert_equals(result(), int)

    def test_type2(self):
        parse('x=1,2,3;class of x')
        assert_equals(result(), list)

    def test_type(self):
        parse('x=1,2,3;')
        assert('type of x is Array')

    def test_type3(self):
        parse('x be 1,2,3;y= class of x')
        assert_equals(variables['x'].type , list)
        assert_equals(type(variableValues['x']) , list)
        assert_equals(type(variables['x'].value) , list)
        assert_equals(variableValues['y'], list)
        assert_equals(variables['y'].value, list)
        assert_equals(variables['y'].type, type)

    def test_type33(self):
        parse('x be 1,2,3;y= class of x')
        self.do_assert('y is a Array')
        self.do_assert('y is an Array')
        self.do_assert('y is Array')
        self.do_assert('Array == class of x')
        self.do_assert('class of x is Array')
        self.do_assert('kind of x is Array')
        self.do_assert('type of x is Array')

    def test_type4(self):
        variables['x'] = [[1, 2, 3], ]
        self.do_assert('class of x is Array')
        self.do_assert('kind of x is Array')
        self.do_assert('type of x is Array')

    def test_type_cast(self):
        # assert_result_is('2.3', None)
        parse('int z=2.3 as int')
        assert_equals(result(), 2)

    def test_no_type_cast(self):
        assert_equals(type(parse('2.3 as int'), ), int)
        assert_equals(type(parse('2.3'), ), float)