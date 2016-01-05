#!/usr/bin/env python
import angle
import exceptions
import power_parser

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
    if angle.use_tree == False:
      assert_result_emitted('x=5;increase x', 6)
      # skip()

  def test_int_setter(self):
    if angle.use_tree == False:
      skip()
    assert_result_emitted('x=5;puts x', 5)

  def test_type_cast(self):
    # Module(body=[Print(dest=None, values=[Num(n=1, lineno=1, col_offset=6)], nl=True, lineno=1, col_offset=0)])
    # Module([Print(None, [Num(1)], True)])
    assert_result_is('2.3', 2.3)
    # assert_result_is('return 2.3', 2.3)

  def test_type_cast23(self):
    assert_result_is('2.3 as int', 2)
    # Module([Assign([Name('__result__', Store())], Call(Name('int', Load()), [Num(2.4)], [], None, None))])
    # Module(body=[Assign(targets=[Name(id='__result__', ctx=Store(), lineno=1, col_offset=0)], value=Call(func=Name(id='int', ctx=Load(), lineno=1, col_offset=11), args=[Num(n=2.4, lineno=1, col_offset=15)], keywords=[], starargs=None, kwargs=None, lineno=1, col_offset=11), lineno=1, col_offset=0)])

  def test_type_cast2(self):
    assert_result_emitted('int z is 2.3 as int', 2)
    # assert_result_emitted('z is 2.3 as string',"2.3") # WrongType: z has type <type 'int'>, can't set to <class 'nodes.FunctionCall'> okish

  def test_type_cast3(self):
    assert_result_emitted('z2 is 2.3 as string', "2.3")

  def test_type_cast_error(self):
    try:
      assert_result_emitted('int z is 2.3 as string', 2)
      raise Exception("SHOULD RAISE WrongType: OLD: <type 'int'> None VS str [2.3] return_type: <type 'str'> ")
    except power_parser.WrongType:
      pass  # all good, did raise

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
    assert_result_emitted('i=7', 7)
    # Module(body=[Assign(targets=[Name(id='x', ctx=Store(), lineno=1, col_offset=0)], value=Num(n=1, lineno=1, col_offset=2), lineno=1, col_offset=0)])

  # Module([Assign([Name('x', Store())], Num(1))])

  def test_setter2(self):
    angle.use_tree = True
    self.parser.dont_interpret()
    assert_result_emitted("x='ho';puts x", 'ho')
    # interpretation = (self.parser.interpretation() or Interpretation())
    # self.parser.show_tree()
    # emit(interpretation, {'run': True, }, NativeCEmitter())

  def test_function_call(self):
    assert_result_emitted('i=7;i minus one', 6)
    #   Module(body=[Assign(targets=[Name(id='i', ctx=Store(), lineno=1, col_offset=0)], value=Num(n=7, lineno=1, col_offset=0), lineno=1, col_offset=0), Assign(targets=[Name(id='__result__', ctx=Store(), lineno=1, col_offset=0)], value=Expr(value=BinOp(left=Name(id='i', ctx=Load(), lineno=1, col_offset=0), op=Sub(), right=Num(n=1.0, lineno=1, col_offset=0), lineno=1, col_offset=0), lineno=1, col_offset=0), lineno=1, col_offset=0)])

  # Module([Assign([Name('i', Store())], Num(7)), Assign([Name('__result__', Store())], Expr(BinOp(Name('i', Load()), Sub(), Num(1.0))))])
  # Module([Assign([Name('i', Store())], Num(7)), Assign([Name('__result__', Store())], BinOp(Name('i', Load()), Sub(), Num(1)))])
  # Module(body=[Assign(targets=[Name(id='i', ctx=Store(), lineno=1, col_offset=0)], value=Num(n=7, lineno=1, col_offset=2), lineno=1, col_offset=0), Assign(targets=[Name(id='__result__', ctx=Store(), lineno=1, col_offset=4)], value=BinOp(left=Name(id='i', ctx=Load(), lineno=1, col_offset=15), op=Sub(), right=Num(n=1, lineno=1, col_offset=17), lineno=1, col_offset=15), lineno=1, col_offset=4)])


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


  def test_function_args(self):
        add1=parse("def add1(x):return x+1")
        assert_result_is('add1(5)',6)

  def test_identity(self):
        identity0=parse("def identity(x):return x")
        assert_result_is('identity(5)',5)
        # assert_equals(identity0.call(5),5)
        # assert('identity(5) is 5')

  # Module([FunctionDef('test', arguments([], None, None, []), [Print(None, [Str('yay')], True)], []), Expr(Call(Name('test', Load()), [], [], None, None))])

  # Module(body=[FunctionDef(name='test', args=arguments(args=[], vararg=None, kwarg=None, defaults=[]), body=[Print(dest=None, values=[Str(s='yay', lineno=1, col_offset=17)], nl=True, lineno=1, col_offset=11)], decorator_list=[], lineno=1, col_offset=0), Expr(value=Call(func=Name(id='test', ctx=Load(), lineno=2, col_offset=0), args=[], keywords=[], starargs=None, kwargs=None, lineno=2, col_offset=0), lineno=2, col_offset=0)])


  # Module(body=[Function(name='test', args=arguments(args=[], vararg=None, kwarg=None, defaults=[]), body=[Assign(targets=[Name(id='result', ctx=Store())], value=Print(dest=None, values=[Str(s='yay')], nl=True))], decorator_list=[]), Call(func=Name(id='test', ctx=Load()), args=[], keywords=[], starargs=None, kwargs=None)])

  def test_function2(self):
    parse_file('samples/factorial.e')
    assert_result_emitted('factorial 6', 5040)

  def test_if_then(self):
    # assert_result_emitted('if (3 > 0):1\nelse:0', 1)
    assert_result_emitted('if 3 > 0 then 1 else 0', 1)
    # IfExp(Compare(Num(3), [Gt()], [Num(0)]), Num(1), Num(0)))
# Module([Assign([Name('result', Store())], IfExp(Compare(Num(3), [Gt()], [Num(0)]), Num(1), Num(0)))])
# IfExp(test=Compare(left=Num(n=3, lineno=1, col_offset=12), ops=[Gt()], comparators=[Num(n=0, lineno=1, col_offset=14)], lineno=1, col_offset=12), body=Num(n=1, lineno=1, col_offset=7), orelse=Num(n=0, lineno=1, col_offset=21), lineno=1, col_offset=7), lineno=1, col_offset=0)])
#
# Module(body=[If(test=Compare(left=Num(n=3, lineno=1, col_offset=3), ops=[Gt()], comparators=[Num(n=0, lineno=1, col_offset=5)], lineno=1, col_offset=3), body=[Expr(value=Num(n=1, lineno=1, col_offset=7), lineno=1, col_offset=7)], orelse=[Expr(value=Num(n=0, lineno=2, col_offset=5), lineno=2, col_offset=5)], lineno=1, col_offset=0)])
# Module([If(Compare(Num(3), [Gt()], [Num(0)]), [Expr(Num(1))], [Expr(Num(0))])])


# Module(body=[Assign(targets=[Name(id='__result__', ctx=Store(), lineno=1, col_offset=0)], value=If(test=Condition(left=Num(n=3, lineno=1, col_offset=0), ops=[Gt()], comparators=[Num(n=0, lineno=1, col_offset=0)], lineno=1, col_offset=0), body=[Num(n=1, lineno=1, col_offset=0)], orelse=[Num(n=0, lineno=1, col_offset=0)], lineno=1, col_offset=0), lineno=1, col_offset=0)])
#
# Module([Assign([Name('__result__', Store())], If(Condition(Num(3), [Gt()], [Num(0)]), [Num(1)], [Num(0)]))])

  def test_array(self):
    # assert_result_emitted('xs=[1,4,7];xs.reverse()', [7, 4, 1])
    assert_result_emitted('xs=[1,4,7];reverse xs', [7, 4, 1])
    # assert_result_emitted('xs=[1,4,7];invert xs', [7, 4, 1])
    # assert_result_emitted('def invert(x):x.reverse;return x;\nxs=[1,4,7];invert xs', [7, 4, 1])
  # Module([Assign([Name('xs', Store())], List([Num(1), Num(2), Num(3)], Load())), Expr(Call(Attribute(Name('xs', Load()), 'reverse', Load()), [], [], None, None)), Print(None, [Name('xs', Load())], True)])

# Module(body=[Assign(targets=[Name(id='xs', ctx=Store(), lineno=1, col_offset=0)], value=List(elts=[Num(n=1, lineno=1, col_offset=4), Num(n=2, lineno=1, col_offset=6), Num(n=3, lineno=1, col_offset=8)], ctx=Load(), lineno=1, col_offset=3), lineno=1, col_offset=0), Expr(value=Call(func=Attribute(value=Name(id='xs', ctx=Load(), lineno=1, col_offset=11), attr='reverse', ctx=Load(), lineno=1, col_offset=11), args=[], keywords=[], starargs=None, kwargs=None, lineno=1, col_offset=11), lineno=1, col_offset=11), Print(dest=None, values=[Name(id='xs', ctx=Load(), lineno=1, col_offset=30)], nl=True, lineno=1, col_offset=24)])
