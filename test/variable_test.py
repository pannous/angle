import _global
from parser_test_helper import *
from power_parser import WrongType, ImmutableVaribale


class VariableTest(ParserBaseTest):

    def dont_test_a_setter_article_vs_variable(self):
        parse('a=green')
        assert_equals(variables['a'], 'green')
        parse('a dog=green')
        assert_equals(variables['dog'], 'green')

    def test_variableTypes(self):
        init('an integer i')
        self.parser.variable()

    def test_variable_type_syntax(self):
        parse('int i=3')
        parse('an integer i;i=3')
        parse('int i;i=3')
        parse("char x='c'")
        parse("char x;x='c'")

    def test_variable_type_safety0(self):
        assert_has_error('string i=3', WrongType)
        assert_has_error("int i='hi'", WrongType)
        assert_has_error("integer i='hi'", WrongType)
        assert_has_error("an integer i;i='hi'", WrongType)

    def test_variable_immutable(self):
        assert_has_error("const i=1;i='hi'", WrongType)
        assert_has_error("const i='hi';i='ho'", WrongType)
        assert_has_error('const i=1;i=2', ImmutableVaribale)

    def test_variable_type_declaration_safety(self):
        assert_has_error("int i;string i", WrongType)
        assert_has_error('i=1;string i', WrongType)
        assert_has_error("int i;i='hi'", WrongType)

    def test_variable_scope(self):
        parse("""def cycle
                    i = 1
                    while i > 10
                    i += 1
                    end
                    i
                    """)
                # end""") # IndentationError: unindent does not match any outer indentation level TOKENIZER WTF
        assert_result_is(1,variables['i'])

    def test_var_condition_unmodified(self):
        variables['counter'] = Variable({'name': 'counter', 'value': 3, })
        init('counter=2')
        assert(equals(self.parser.condition(),False))
        self.do_assert('counter=3')

    def test_vars(self):
        variables['counter'] = Variable({'name': 'counter', 'value': 3, })
        parse('counter=2')
        assert_equals(variables['counter'], 2)
