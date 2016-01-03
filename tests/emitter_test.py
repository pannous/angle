#!/usr/bin/env python
import angle
angle.use_tree = True
angle._verbose = False
from parser_test_helper import *
# from c-emitter import *


class EmitterTest(ParserBaseTest):

    def init(self):
        angle.use_tree = True

    def initialize(self):
        angle.use_tree = True


    def assert_result_emitted(self, x, r):
        assert_equals(last_result(parse_tree(x, True)), r)

    def test_js_emitter(self):
        if angle.use_tree==False:
            assert_result_emitted('x=5;increase x', 6)
            # skip()

    def test_int_setter(self):
        if angle.use_tree==False:
            skip()
        assert_result_emitted('x=5;puts x', 5)

    def test_type_cast(self):
        assert_result_is('2.3', None)
        parse('int z=2.3 as int')
        assert_equals(result(), 2)

    def test_printf(self):
        angle.use_tree = True
        self.parser.dont_interpret()
        parse("printf 'hello world'", False)
        self.parser.full_tree()
        # result = emit(interpretation, {'run': True, }, NativeCEmitter())
        # assert_equals(result, 'hello world')

    def test_printf_1(self):
        assert_result_emitted("printf 'hello world'", 'hello world')
        assert_result_emitted("printf 'hello world'", 'hello world')


    def test_setter(self):
        assert_result_emitted('i=7',7)
    # Module(body=[Assign(targets=[Name(id='x', ctx=Store(), lineno=1, col_offset=0)], value=Num(n=1, lineno=1, col_offset=2), lineno=1, col_offset=0)])
# Module([Assign([Name('x', Store())], Num(1))])

    def test_setter2(self):
        angle.use_tree = True
        self.parser.dont_interpret()
        assert_result_emitted("x='ho';puts x",'ho')
        # interpretation = (self.parser.interpretation() or Interpretation())
        # self.parser.show_tree()
        # emit(interpretation, {'run': True, }, NativeCEmitter())

    def test_function_call(self):
        assert_result_emitted('i=7;i minus one', 6)


    def test_function_defs(self):
        parse("def test{pass}")
        parse("def test{pass};test")
        parse("def test{puts 'yay'}")
        parse("def test{puts 'yay'};test")

    def test_function_def(self):
        parse("def test{puts 'yay'}")
        # parse("def test{puts 'yay'};test")
        # Module([FunctionDef('test', arguments([], None, None, []), [Print(None, [Str('yay')], True)], [])])
        # Module(body=[FunctionDef(name='test', args=arguments(args=[], vararg=None, kwarg=None, defaults=[]), body=[Print(dest=None, values=[Str(s='yay', lineno=1, col_offset=17)], nl=True, lineno=1, col_offset=11)], decorator_list=[], lineno=1, col_offset=0)])


    def test_function(self):
        parse("def test():puts 'yay'\ntest()")
        assert_result_emitted("def test{puts 'yay'};test", 'yay')
# Module([FunctionDef('test', arguments([], None, None, []), [Print(None, [Str('yay')], True)], []), Expr(Call(Name('test', Load()), [], [], None, None))])

    # Module(body=[FunctionDef(name='test', args=arguments(args=[], vararg=None, kwarg=None, defaults=[]), body=[Print(dest=None, values=[Str(s='yay', lineno=1, col_offset=17)], nl=True, lineno=1, col_offset=11)], decorator_list=[], lineno=1, col_offset=0), Expr(value=Call(func=Name(id='test', ctx=Load(), lineno=2, col_offset=0), args=[], keywords=[], starargs=None, kwargs=None, lineno=2, col_offset=0), lineno=2, col_offset=0)])


# Module(body=[Function(name='test', args=arguments(args=[], vararg=None, kwarg=None, defaults=[]), body=[Assign(targets=[Name(id='result', ctx=Store())], value=Print(dest=None, values=[Str(s='yay')], nl=True))], decorator_list=[]), Call(func=Name(id='test', ctx=Load()), args=[], keywords=[], starargs=None, kwargs=None)])

    def test_function2(self):
        parse_file('examples/factorial.e')
        assert_result_emitted('factorial 6', 5040)

    def test_array(self):
        assert_result_emitted('xs=[1,4,7];invert xs', [7, 4, 1])
