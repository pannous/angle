#!/usr/bin/env python
import unittest
from unittest import TestCase
from unittest import BaseTestSuite

import angle
import emitters.pyc_emitter

import english_parser
import power_parser
from nodes import *
from extensions import *
global parser
parser = english_parser#.EnglishParser()

NONE = "None"
TRUE = "True"
FALSE = "False"
ENV = {'APPLE': True}
methods = {}
functions = {}
variables = {}
variableValues = {}
emit=False
global base_test
base_test=None

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
    assert_equals(b,x,bla)


def assert_result_is(a, b, bla=None):
    x=parse(a)
    # y=parse(b)
    y=b
    if bla:
        assert x==y, "%s %s SOULD EQUAL %s BUT WAS %s"%(bla,a,b,x)
    else:
        assert x==y, "%s SOULD EQUAL %s \nGOT %s != %s"%(a,b,x,y)


def assert_equals(a, b, bla=None):
    if a == 'False':a=False
    if isinstance(a,ast.List):a=a.value
    assert a==b, "%s SHOULD BE %s   %s"%(a,b,bla)


def assert_equal(a, b, bla=None):
	print( "%s SHOULD BE %s   %s"%(a,b,bla))
    # assert a==b, "%s SHOULD BE %s   %s"%(a,b,bla)
    # assert a == b, "%s SHOULD BE %s   %s" % (a, b, bla)


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
                #ifdef FUCKING PY3:
                # raise e from e
                # e.ra
                raise e, None, sys.exc_info()[2]
            print("OK, got expected %s : %s"%(ex,e))
        else:
            print("OK, got expected "+str(e))
        return
    raise Exception("EXPECTED ERROR: "+str(ex)+"\nIN: "+x)



def assert_has_no_error(x):
    parse(x)


def sleep(s):
    pass


def parse(s):
    if not (isinstance(s,str) or isinstance(s,unicode) or isinstance(s,file)): return s
    print("PARSING %s"%s)
    interpretation= english_parser.parse(s)
    r=interpretation.result
    if(isinstance(r,list) and isinstance(r[0],ast.AST) or isinstance(r,ast.AST)):
        if isinstance(r,ast.Module): r=r.body[-1] #YA?
        r=emitters.pyc_emitter.run_ast(r)
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
    global _parser
    # def __init__(self, *args, **kwargs): #ruby : initialize
    #     super(ParserBaseTest, self).__init__()
    #     if ENV['TEST_SUITE'] or ENV['DEBUG_ANGLE']or ENV['ANGLE_DEBUG']or ENV['DEBUG']:
    #         angle._verbose = False
    #     self.parser = _parser = english_parser#.EnglishParser()

    @classmethod
    def setUpClass(cls):
        angle._debug = angle._debug or 'ANGLE_DEBUG' in os.environ
        cls.parser = _parser = english_parser#.EnglishParser()
        pass # reserved for expensive environment one time set up

    def setUp(self):
        global base_test
        base_test=self
        self.parser.clear() # OK Between test, just not between parses!


    def parse(self, s):
        print("PARSING %s"%s)
        x= _parser.parse(s).result
        print("DONE PARSING %s"%s)
        return x


    def assert_has_no_error(self, x):
        parse(x)
        print(x+(' parses OK'))

    def assert_has_error(self, x, block):
        try:
                parse(x)
                raise Exception("SHOULD THROW")
        except Exception as e:
            puts("OK")


    def assert_result_is(self, x, r):
        if isinstance(x,str):x = parse(x)
        if isinstance(r,str):r = parse(r)
        assert_equals(x, r)
        # assert_equals(parse(x), parse(r))

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
            if ok==False or ok==FALSE or ok==NONE: # no match etc
                assert False, 'NOT PASSING: ' + str( msg)
        print('TEST PASSED!  ' + str( msg) + ' \t VALUE '+str(ok))

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

    def parse_tree(self, x):
        if isinstance(x,str):
            return x
        self.parser.dont_interpret()
        interpretation = self.parser.parse(x)
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
