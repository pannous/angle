import compiler.ast
import unittest
import ast
import sys
import angle
import kast
# import kast.cast
import english_parser
import power_parser
import the

global parser
from nodes import *
from extensions import *

parser = english_parser#.EnglishParser()

ENV = {'APPLE': True}
methods = {}
functions = {}
variables = {}
variableValues = {}
emit=False
base_test=None
global base_test

def contains(a,b):
    return a in b or b in a

def bigger_than(a, b):
    return a > b


def less_than(a, b):
    return a < b


def kind(x):
    type(x)


def body(param):
    english_parser.rooty()

def fix_encoding(x):
    return x

def read(x):
    return open(x) or x.read()

def count(x):
    len(x)

def p(x):
    print(x)


def last_result():
    return the.last_result


def parse_tree(x):
    angle.use_tree=True
    power_parser.dont_interpret()
    angle_ast=power_parser.parse(x).tree #AST
    if not isinstance(angle_ast, ast.Module):
        angle_ast= kast.Module(body=[angle_ast])
    angle_ast=ast.fix_missing_locations(angle_ast)
    return angle_ast


def puts(x):
    print(x)


def assert_result_emitted(a, b, bla=None):
    angle.use_tree=True
    x=parse(a)
    if isinstance(x,ast.Module):x=x.body
    y=b
    if not isinstance(y,list):y=[y]
    if not isinstance(y[-1],ast.Expr):
         y[-1]=kast.Expr(y[-1])
    # assert_equals(x,y,bla)
    assert_equals(y,x,bla)


def assert_result_is(a, b, bla=None):
    x=parse(a)
    # y=parse(b)
    y=b
    if bla:
        assert x==y, "%s %s SOULD EQUAL %s BUT WAS %s"%(bla,a,b,x)
    else:
        assert x==y, "%s SOULD EQUAL %s \nGOT %s != %s"%(a,b,x,y)


def parse_file(x):
    english_parser.parse(x)


def assert_equals(a, b, bla=None):
    if a == 'False':a=False
    if isinstance(a,ast.List):a=a.value
    assert a==b, "%s SHOULD BE %s   %s"%(a,b,bla)


def assert_equal(a, b, bla=None):
    assert a==b, "%s SHOULD BE %s   %s"%(a,b,bla)

#
# def do_assert(a, bla=None):
#     assert a

class SkippingTest(Exception):
    pass

def skip(me=0):
    raise unittest.SkipTest()
     # TestCase.skipTest()
    # raise SkippingTest()


def assert_has_error(x,ex=None):
    got_ex=False
    try:
        if callable(x):
            x()
        else: parse(x)
    except Exception as e :
        if ex:
            if not isinstance(e,ex):
                print("WRONG ERROR: "+str(e)+" expected error: "+str(ex))
                raise e, None, sys.exc_info()[2]
            print("OK, got expected ERROR %s : %s"%(ex,e))
        else:
            print("OK, got expected ERROR "+str(e))
        return
    raise Exception("EXPECTED ERROR: "+str(ex)+"\nIN: "+x)



def assert_has_no_error(x):
    parse(x)


def sleep(s):
    pass

def clear_test():
    global variables,variableValues
    variables={}
    variableValues={}
        # the._verbose=True # False
    angle.testing=True
    the.variables.clear()
    the.variableTypes.clear()
    the.variableValues.clear()
    angle.in_hash=False
    angle.in_list=False
    angle.in_condition=False
    angle.in_args=False
    angle.in_params=False
    angle.in_pipe=False
    if not angle.use_tree:
        power_parser.do_interpret()

def parse(s):
    print("PARSING %s"%s)
    interpretation= english_parser.parse(s)
    r=interpretation.result
    variables.update(the.variables)
    variableValues.update(the.variableValues)
    functions.update(the.methods)
    methods.update(the.methods)
    print("DONE PARSING %s"%s)
    return r


def init(str):
    copy_variables()
    english_parser.init(str)
    # parser.init(str)


def result():
    return the.result


def equals(a, b):
    return a == b


def name(x):
    return x

def assert_that(x,msg=None, block=None):
    return base_test.do_assert(x,msg=None, block=None)


def copy_variables(variables=variables):
    global variableValues
    variable_keys = variables.keys()
    for name in variable_keys:
        v_ = variables[name]
        if isinstance(v_,Variable):
            the.variables[name]=v_
            the.variableValues[name]=v_.value
            continue
        the.variableValues[name]=v_
        the.variables[name]=Variable(name=name,value=v_,type=type(v_))
        variables[name]=Variable(name=name,value=v_,type=type(v_))

class ParserBaseTest(unittest.TestCase):

    def setUp(self):
        global base_test
        base_test=self
        clear_test()

    def context(self):
        pass
    global p,_p,parser,_parser
    parser=p= english_parser#.EnglishParser() # Module, lol hack
    _parser=_p= english_parser#.EnglishParser
        # p=Parser() # CANT BE ASSIGNED without double global
        # global p
        # p=Parser() # CAN BE ASSIGNED!!!
        # self._p=_p # generator
        # self.p=p   # instance!
        # self._p=Parser # generator
        # self.p=Parser()#  fresh  instance!

    parser=property(lambda :p,0)

    @classmethod
    def setUpClass(cls):
        pass # reserved for expensive environment one time set up

    # def test_true(self):
    #     assert True
    # def test_globals(self):
    #     self.assertIsInstance(p,Parser)

    def __getattr__(self, name):
        if name=='parser':
            return p
        # ruby method_missing !!!
        if name in dir(parser):
            method = getattr(parser, name)  # NOT __getattribute__(name)!!!!
            if callable(method):
                return method()
            else:
                return parser.__getattribute__(name)
        else:
            raise Exception( "NO SUCH ATTRIBUTE " + name)

    # return lambda value: self.all().filter(field, value)

    def parse(self, s):
        print("PARSING %s"%s)
        x= parser.parse(s).result
        print("DONE PARSING %s"%s)
        return x



    def initialize(self, args):
        if ENV['TEST_SUITE']:
            angle._verbose = False
        if angle.raking:
            angle.emit = False
        self.parser = english_parser.EnglishParser()
        super(args)

    def assert_has_no_error(self, x):
        parse(x)
        print(x+(' parses OK'))

    def assert_has_error(self, x, block):
        try:
                parse(x)
                raise "SHOULD THROW"
        except Exception as e:
            puts("OK")


    def assert_result_is(self, x, r):
        assert_equals(parse(x), parse(r))
        assert_equals(parse(x), parse(r))

    def assert_equals(self, a, b):
        if ((a==b or str(a)==str(b))):
            print('TEST PASSED! %s      %s == %s' % ( self.parser.original_string, a, b))
        else:
            assert a==b, ((str(a) + ' should equal ') + str(b))
            # print(filter_stack(caller()))

    def assert_that(self, x,msg=None, block=None):
        return self.do_assert( x,msg, block)

    def do_assert(self, x,msg=None, block=None):
        copy_variables()
        if not msg: msg=x
        ok=False
        if x == True:
            print('TEST PASSED! ' + str(msg))
            return True
        if callable(msg):
            msg = msg.call()
        if block:
            msg = (msg or self.parser.to_source(block))
        if x==False and block:
            x = block()
        if x==False:
            assert False, ('%s NOT PASSING: %s' % (x,msg))
        if isinstance(x,str):
            print(('Testing ' + x))
            init(x)
            ok = self.parser.condition()
            if ok==False or ok=='False':
                assert False, 'NOT PASSING: ' + str( msg)
        print 'TEST PASSED!  ' + str( msg) + ' \t VALUE '+str(ok)

    # def NOmethod_missing(self, sym, args, block):
    #     syms = sym.to_s()
    #     if self.parser and contains(sym, self.parser.methods()):
    #         [
    #         if equals(0, args.len()):
    #             x = maybe(),
    #         if equals(1, args.len()):
    #             x = maybe(),
    #         if bigger_than(0, args.len()):
    #             x = maybe(),
    #         return x, ]
    #     super([sym], args, [sym], args)

    def init(self, string):
        self.parser.allow_rollback((-1))
        self.parser.init(string)

    def variables(self):
        return the.variables

    def variableValues(self):
        return the.variableValues

    def functions(self):
        return the.methods

    def methods(self):
        return the.methods

    def interpretation(self):
        return self.interpretation

    def result(self):
        return the.result
        # self.parser.result

    def parse_file(self, file):
        parse(IO.read(file))

    def parse_tree(self, x):
        if isinstance(x,str):
            return x
        self.parser.dont_interpret()
        self.interpretation = self.parser.parse(x)
        self.parser.full_tree()
        if angle.emit:
            return parser.emit(interpretation, interpretation.root())
        else:
            return interpretation.evaluate()

    # def emit(self, interpretation, root):
    #     from c-emitter import *
    #     emit(interpretation, {'run': True, }, NativeCEmitter())

    def parse(self, x):
        if interpret:
            self.parser.do_interpret()
        if angle.emit:
            self.result = parse_tree(x)
        else:
            self.result = self.parser.parse(x)
        return the.result

    def variableTypes(self, v):
        type(variables[v], )

    # def verbose(self):
    #     if angle.raking:
    #         return None
    #     self.parser.verbose = True

# class Function:
#     pass
# class Argument:
#     pass
# class Variable:
#     pass
# class Quote:
#     pass
