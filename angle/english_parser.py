#!/usr/bin/env python
# encoding: utf-8
# encoding=utf8  

import sys
import os

# from exceptions import GivingUp
# import yappi
import traceback
import types
#import stem.util.system
# import interpretation
import inspect

if 'ANGLE_HOME' in os.environ:
    sys.path.append(os.environ['ANGLE_HOME'])
    sys.path.append(os.environ['ANGLE_HOME'] + "/angle")
else:
	sys.path.append( "..") # for cast


#import pyc_emitter

# Thank you, python3 di*k*s, for making such a fantastic mess with input/raw_input
# real_raw_input = vars(__builtins__).get('raw_input', input)
from six.moves import input as real_raw_input

# from exceptions.exceptions import GivingUp
#
from english_tokens import *
import ast_magic
import _ast
from kast import kast
from kast.kast import name, store, assign, call, num, zero, Self
from _ast import *  # VS
# from kast.kast import * # DANGER: inheritance not handled correctly in all libs!
from tree import operator_equals
from power_parser import *
import power_parser
# from context import * # DOESN'T WORK!!
import context as the
from extensions import *
import token as _token
# from tree import TreeNode
import nodes

py2 = sys.version < '3'
py3 = sys.version >= '3'


def get(name):
    if isinstance(name, Name): name = name.id  # make sure to Load() !!
    if (isinstance(name, nodes.Variable)): name = name.name
    return _ast.Name(id=name, ctx=Load())


from kast.kast import name


# def name(x):
# 	return kast.name()

def parent_node():
    pass


global english_parser_imported


# if english_parser_imported:
# 	return



def do_self_modify(v, mod, arg):
    val = v.value
    if mod == '|=': the.result = val | arg
    if mod == '||=': the.result = val or arg
    if mod == '&=': the.result = val & arg
    if mod == '&&=': the.result = val and arg
    if mod == '+=': the.result = val + arg
    if mod == '-=': the.result = val - arg
    if mod == '*=': the.result = val * arg
    if mod == '**=': the.result = val ** arg
    if mod == '/=': the.result = val / arg
    if mod == '%=': the.result = val % arg
    if mod == '^=': the.result = val ^ arg
    # if mod == '<<': the.result = val.append(arg)
    if mod == '<<': the.result = val << (arg)
    if mod == '>>': the.result = val >> arg
    v.value = the.result
    return the.result


# ## global the.string

# class Starttokens(object):
#   def __init__(self, starttokens):
#     if not isinstance(starttokens, list):
#       starttokens = [starttokens]
#     self.starttokens = starttokens
#
#   def __call__(self, original_func):
#     decorator_self = self
#     for t in self.starttokens:
#       if t in iter(the.token_map):
#         debug("ALREADY mapped \"%s\" to %s, now %s" % (t, the.token_map[t], original_func))
#       else:
#         the.token_map[str(t)] = original_func
#     return original_func
#

class Todo:
    pass


# def maybe(block):
#     return maybe(block)

def _(x):
    return power_parser.token(x)


def __(x):
    return power_parser.tokens(x)


# class Nil(object):
#     pass
#
# class Nill(Nil):
#     pass

def nill():
    if tokens(nill_words): return NILL


@Starttokens(['True', 'False', 'true', 'false'])
def boolean():
    b = tokens(['True', 'False', 'true', 'false'])
    the.result = (b == 'True' or b == 'true') and TRUE or FALSE
    return the.result


def should_not_start_with(words):
    bad = starts_with(words)
    if not bad: return OK
    if bad:
        info("should_not_match DID match %s" % bad)
    if bad: raise NotMatching("should_not_match DID match %s" % bad)  # MustNotMatchKeyword(bad))


remove_hash = {}


# remove_from_list_count=0
def remove_from_list(keywords0, excepty):
    # if (keywords0,excepty) in remove_hash:
    #   return remove_hash[(keywords0,excepty)]
    # global remove_from_list_count
    # remove_from_list_count+=1
    # info("remove_from_list called "+str(remove_from_list_count)+" times")
    good = list(keywords0)  # clone
    for x in excepty:
        while x in good:
            good.remove(x)
    # remove_hash[(keywords0, excepty)]=good
    return good


def no_keyword_except(excepty=None):
    if not excepty:
        excepty = []
    bad = remove_from_list(keywords, excepty)
    return should_not_start_with(bad)


def no_keyword():
    return no_keyword_except([])


@Starttokens(constants)
def constant():
    return constantMap.get(tokens(constants))


@Starttokens(result_words)
def it():
    tokens(result_words)
    return the.last_result


def value():
    global current_value
    if the.current_type == _token.STRING:
        return quote()
    if the.current_type == _token.NUMBER:
        return number()
    current_value = None
    # TypeError: unsupported operand type(s) for +: 'dict_keys' and 'list' WTF PY3 8(
    no_keyword_except(constants + numbers + result_words + nill_words + ['+', '-'])
    the.result = maybe(bracelet) or \
                 maybe(quote) or \
                 maybe(nill) or \
                 maybe(number) or \
                 maybe(known_variable) or \
                 maybe(boolean) or \
                 maybe(constant) or \
                 maybe(it) or \
                 maybe(nod) or \
                 raise_not_matching("Not a value")
    if maybe_tokens(['as']):
        typ = typeNameMapped()
        the.result = call_cast(the.result, typ)
    return the.result


# import TreeBuilder
# import CoreFunctions
# import EnglishParserTokens # module
# import LoopsGrammar # while, as long as, :.
# import RubyGrammar # def, :.
# import Betty # convert a.wav to mp3
# import ExternalLibraries

# property methods, :result, :last_result, :interpretation, :variables, :variableValues,:variableType #remove the later!


class Interpretation:
    pass


def interpretation():
    # import interpretation

    # interpretation = interpretation.Interpretation()
    interpretation = Interpretation()
    i = interpretation  # Interpretation.new
    i.result = the.result
    i.tree = the.result
    i.error_position = error_position()
    # super  # set tree, nodes
    # i.javascript = javascript
    # i.context = _context
    i.methods = the.methods
    i.ruby_methods = builtin_methods
    i.variables = the.variables
    i.svg = svg
    return i


# beep when it rains
# listener




# todo vs checkNewline() ??


def end_expression():
    return checkEndOfLine() or token(';')


def raiseSyntaxError():
    raise SyntaxError("incomprehensible input")


def rooty():
    power_parser.block(multiple=True)
    # maybe(block) or \
    #  maybe(statement) or \
    #    raiseSyntaxError()# raise_not_matching("")
    # maybe(expressions) and end_expression() or\
    # maybe(condition) or \
    # maybe(context) or \
    return the.result


# # maybe( ruby_def )or\ # SHOULD BE just as method_definition !!:


def set_context(_context):
    _context = _context


def package():
    tokens("package context gem library".split())  # source:
    return set_context(rest_of_line())


def javascript_require(dependency):
    # import bindingsr'js'javascript_auto_libs
    # import javascript_auto_libs
    dependency = dependency.replace(r'.* ', "")  # require javascript bla.js
    return dependency


# mapped    =$javascript_libs[dependency]
# if mapped: dependency=mapped
# javascript.append("javascript_require(): #{dependency));")


def includes(dependency, type, version):
    if re.search(r'\.js$', the.token):
        return javascript_require(dependency)
    if type and type in "javascript script js".split():
        return javascript_require(dependency)


@Starttokens(["r'", '/', "regex", "regexp", "regular expression"])
def regexp(val=0):
    if not val:
        tokens(["regex", "regexp", "regular expression"])
        val = the.string
    if val.startswith("r'"):
        return re.compile(val[2:-1])
    elif val.startswith("'"):
        return re.compile(val[1:-1])
    return re.compile(val)


def package_version():
    maybe_token('with')
    c = maybe_tokens(comparison_words)
    tokens(['v', 'version'])
    c = c or maybe_tokens(comparison_words)
    # current_value=
    the.result = c + " " + regex_match(r'\d(\.\d)*', the.string)
    maybe_tokens("or later")
    return the.result


@Starttokens(import_keywords)
def imports():  # requirements
    _type = maybe_tokens(require_types)
    tokens(import_keywords)
    _type = _type or maybe_tokens(require_types)
    maybe_tokens("file script header source src".split())
    maybe_tokens(['gem', 'package', 'library', 'module', 'context'])
    _type = _type or maybe_tokens(require_types)
    # maybe(source) maybe(really)
    dependency = maybe(quote)
    no_rollback()
    # maybe(list_of){packages)
    dependency = dependency or word()  # regex "\w+(\/\w*)*(\.\w*)*\.?\*?" # rest_of_line
    version = maybe(package_version)
    if interpreting(): includes(dependency, _type, version)  #
    the.result = {'dependency': {'type': _type, 'package': dependency, 'version': version}}
    return the.result


@Starttokens(context_keywords)
def module():
    tokens(context_keywords)
    _context = word()
    newlines()  # part of block?
    # NL
    block()
    done()  # done context!!!
    return _context


#  surrounded by braces everything can be of value!
def bracelet():
    _('(')  # ok, lists checked before
    # a = value()
    a = expression()
    # a = statement()
    _(')')
    return a  # todo wrapped in (result=a) OK?


# @Starttokens(operators) #NOT STANDALONE!
def operator():
    # if current_type==_token.OP ok
    return tokens(operators)


def isUnary(op):
    todo("isUnary")
    return False


def ast_operator(op):
    if isinstance(op, (cmpop, BinOp)):
        return op
    return kast_operator_map[op]


def fix_context(x):
    if isinstance(x, Variable): x = kast.name(x.name)
    return x


def apply_op(stack, i, op):
    right = stack[i + 1]
    left = stack[i - 1]
    if interpreting():  # and not context.use_tree:
        if op == "!" or op == "not":
            stack[i:i + 2] = [not do_evaluate(right)]
        else:
            result = do_math(left, op, right)
            stack[i - 1:i + 2] = [result]
    else:
        if op == "!" or op == "not":
            stack[i:i + 2] = [kast.Not(right)]
        else:
            # ast.BoolOp ??
            left = fix_context(left)
            right = fix_context(right)

            if isinstance(op, _ast.operator):
                stack[i - 1:i + 2] = [kast.BinOp(left, ast_operator(op), right)]
            elif op in true_operators:
                stack[i - 1:i + 2] = [kast.BinOp(left, ast_operator(op), right)]
            elif op in comparison_words:
                stack[i - 1:i + 2] = [kast.Compare(left, [ast_operator(op)], [right])]  # array for multi compare !
            else:
                stack[i - 1:i + 2] = [kast.Compare(left, [ast_operator(op)], [right])]


def fold_algebra(stack):
    used_operators = [x for x in operators if x in stack]
    used_ast_operators = [x for x in kast_operator_map.values() if x in stack]
    # print("x in stack %s"%("==" in stack))
    # while len(stack) > 1 and len(used_operators)>0:
    for op in used_operators + used_ast_operators:
        i = 0
        leng = len(stack)
        while i < len(stack):
            if stack[i] == op:
                apply_op(stack, i, op)
            else:
                i += 1
        # if leng == len(stack):
        # 	raise Exception("OPERATOR NOT CONSUMED: "+op)
    if len(stack) > 1 and len(used_operators) > 0:
        raise Exception("NOT ALL OPERATORS CONSUMED IN %s ONLY %s" % (stack, used_operators))

    # if not interpreting():
    #     return kast.setter("it",stack[0])
    return stack[0]


def algebra(val=None):
    if context.in_algebra: return False  # TODOO?? x * f(x-1)
    # global result
    if not val: must_contain_before(args=operators, before=be_words + ['then', ',', ';', ':'])  # todo is smaller ->
    stack = []
    val = val or maybe(value) or bracelet()
    stack.append(val)  # any { maybe( value ) or maybe( bracelet ) )

    def lamb():
        if the.token in be_words and context.in_args:
            return False  # f x is 0 == f(x) is 0 NOT f(x is 0) !!
        op = maybe(comparation) or operator()
        # if in_setter and op == '=': return False # see setter!
        if op == '=': raise NotMatching  # return False # see setter!
        n = maybe_token('not')
        y = maybe(value) or maybe(bracelet)
        context.in_algebra = True
        y = y or expression()  # so deep still NOT ok, use context.in_algebra
        # y = maybe(value) or bracelet()
        # y = postoperations(y) or y NOO but need LIST!
        if y == ZERO: y = 0
        stack.append(op)  # after success of maybe(value)
        stack.append(n) if n else 0
        stack.append(y)
        return y or True

    star(lamb)
    context.in_algebra = False
    the.result = fold_algebra(stack)
    if the.result == False: the.result = FALSE
    return the.result


def read_block(type=None):
    block = []
    _(type)
    while True:
        if maybe(lambda: end_block(type)): break
        block.append(rest_of_line())
    return block


# @Starttokens("<") #OK?
def read_xml_block(t=None):
    _("<")
    t = t or word()
    if maybe_token('/'): return _(">")
    _(">")
    b = read_xml_block()
    _("</")
    token(t)
    _(">")
    return b


@Starttokens("<html>")
def html_block():
    return read_xml_block('html')


@Starttokens(['js', 'script', 'javascript'])
def javascript_block():
    block = maybe(read_block('script')) or maybe(read_block('js')) or read_block('javascript')
    javascript.append(block.join(";\n"))
    return block


@Starttokens('ruby')
def ruby_block():
    return read_block('ruby')


def special_blocks():
    return maybe(html_block) or maybe(ruby_block) or javascript_block()


# or end_expression #end_block #newlines

# see read_block for RAW blocks! (</EOF> type)
# EXCLUDING start_block & end_block !!!


def is_a(x, type0):
    _type = mapType(type0)
    debug(_type)
    if is_string(_type): raise Exception("BAD TYPE %s" % type0)
    if isinstance(x, _type): return True
    if isinstance(x, unicode) and _type == types.StringType: return True
    if isinstance(x, unicode) and _type == xchar and len(x) == 1: return True
    if isinstance(x, unicode) and _type == xstr: return True
    if isinstance(xx(x), _type): return True
    return False


@Starttokens(number_selectors)  # other numbers already handled
def nth_item(val=0):  # Also redundant with property evaluation (But okay as a shortcut)):
    set = maybe_token('set')
    n = val or tokens(number_selectors + ['first', 'last', 'middle'])
    n = xstr(n).parse_integer()
    if (n > 0): n = n - 1  # -1 AppleScript style !!! BUT list[0] !!!
    raiseEnd()
    maybe_tokens(['.', 'rd', 'st', 'nd'])
    type = maybe_tokens(['item', 'element', 'object', 'word', 'char', 'character'] + type_names)  # noun
    maybe_tokens(['in', 'of'])
    l = do_evaluate(maybe(known_variable)) or maybe(liste) or quote()  # or (expression) with parenthesis!!
    if re.search(r'^char', type):
        the.result = "".join(l).__getitem__(n)
        return the.result
    elif is_string(l):
        l = l.split(" ")
    if isinstance(l, list) and type in type_names:
        l = [x for x in l if is_a(x, type)]
    if (n > len(l)): raise IndexError("%d > %d in %s[%d]" % (n, len(l), l, n))
    the.result = l[n]  # .__getitem__(n)
    if context.in_condition:
        return the.result
    if set and _('to'):  # or maybe_tokens(be_words): #LATER
        val = endNode()
        the.result = do_evaluate(val)
        l[n] = the.result
    return the.result


def listselector():
    return maybe(nth_item)  #


# or functionalselector() # expensive -> later!


# DANGER: INTERFERES WITH maybe(LIST), NAH, NO COMMA: {x > 3)
# { optional around standard selector  birds that fly
# @Starttokens('{','(')
# expensive -> later!
def functionalselector():
    if contains(','): return list()
    if contains(':'): return hash()
    _('{')
    xs = known_variable()
    crit = selector()
    _('}')
    return list(filter(xs, crit))


@Starttokens(['[', '('])  # , '{' vs hash!! -> only in js!
def liste(check=True, first=None):
    if not first and the.token == ',': raise NotMatching()
    if context.in_hash: must_not_contain(":")  # ,before=',')
    if check: must_contain_before(',', be_words + operators + ['of'])  # - ['and']
    # +[' '] ???
    start_brace = maybe_tokens(['[', '{', '('])  # only one!
    if not start_brace and (context.in_list or in_args): raise NotMatching('not a deep list')

    # all<<expression(start_brace)
    # context.verbose=True #debug
    context.in_list = True
    first = first or maybe(endNode)
    if not first: context.in_list = False
    if not first: raise_not_matching()
    if isinstance(first, list):
        all = first
    else:
        all = [first]

    def lamb():
        tokens([',', 'and'])
        e = endNode()
        if e == ZERO: e = 0
        # e=expression()
        all.append(e)
        return e

    star(lamb)
    # danger: and as plus! BAD IDEA!!!
    if start_brace == '[': _(']')
    if start_brace == '{': _('}')
    if start_brace == '(': _(')')
    context.in_list = False
    if context.use_tree:
        return kast.List(all, ast.Load())  # ast.Load() ??
    # return xlist(all)  # Important in order to distinguish from list
    return all


def must_contain_substring(param):  # ++ != '+' '+' tokens :(
    current_statement = re.split(';|:|\n', the.current_line[the.current_offset:])[0]
    if not param in current_statement:
        raise_not_matching("must_contain_substring(%s)" % param)


def plusPlus(v=None):
    must_contain_substring('++')
    start = pointer()
    pre = maybe_token('+') and token('+')
    v = v or variable()
    pre or _('+') and token('+')
    if not interpreting():
        # return kast.AugAssign(kast.Name(v.name, kast.Store()), kast.Add(), kast.Num(1))  # INcompatible was chained assignment it=b--
        return Assign([store(v.name)], BinOp(name(v.name), Add(), num(1)))
    the.result = do_evaluate(v, v.type) + 1
    the.variableValues[v.name] = v.value = the.result
    return the.result


def minusMinus(v=None):
    must_contain_substring('--')
    pre = maybe_token('-') and token('-')
    v = v or variable()
    pre or _('-') and token('-')
    if not interpreting():
        # return kast.AugAssign(kast.Name(v.name, kast.Store()), kast.Sub(), kast.Num(1))  # INcompatible was chained assignment it=b--
        return Assign([store(v.name)], BinOp(name(v.name), Sub(), num(1)))
    the.result = do_evaluate(v, v.type) + 1
    variableValues[v] = v.value = the.result
    return the.result


def selfModify():
    return maybe(self_modify) or maybe(plusPlus) or minusMinus()


#
# @Interpret
# @Starttokens(self_modifying_operators)
def self_modify(v=None, exp=None):
    must_contain(self_modifying_operators)
    v = v or variable()
    mod = tokens(self_modifying_operators)
    exp = exp or expression()  # value
    if not interpreting():
        op = operator_equals(mod)
        # return kast.AugAssign(store(v.name), op, exp) # UNcompatible was chained assignment it=b+=1
        return Assign([store(v.name)], BinOp(name(v.name), Add(), ast_magic.wrap_value(exp)))
    else:
        arg = do_evaluate(exp, v.type)
        the.result = do_self_modify(v, mod, arg)
        the.variableValues[v.name] = the.result
        v.value = the.result
        return the.result


# @Starttokens('[')
def swift_hash():
    _('[')
    h = {}

    def hashy():
        if len(h) > 0: _(',')
        maybe_tokens(['"', "'"])
        key = word()
        maybe_tokens(['"', "'"])
        _(':')
        context.context.in_list = True
        h[key] = expression()  # no
        the.result = {key: h[key]}
        return the.result

    star(hashy)
    _(']')
    context.context.in_list = False
    return h


def close_bracket():  # for nice GivingUp):
    return _(')')


def empty_map():
    _("{")
    _("}")
    if interpreting(): return EMPTY_MAP
    return Expr(Dict([], []))


hash_assign = [":", "to", "=>", "->"]  # tokenized as = > !?!


def hash_map():
    must_contain_before(args=hash_assign, before=["}"])
    # z=maybe(regular_json_hash) or immediate_json_hash RUBY BUG! or and  or  act very differently!
    z = regular_hash() if starts_with("{") else immediate_hash()
    return z


# colon for types not maybe(Compatible) puts a:int vs puts {a:int) ? maybe egal
# careful with blocks!! {puts "s") VS {a:"s")
# careful with blocks/closures ! map{puts it} VS data{a:"b")
@Starttokens('{')
def regular_hash():
    _('{')
    context.in_hash = True
    maybe_tokens(hash_assign) and no_rollback()  # symbol  why "MAYBE
    h = {}

    def lamb():
        if len(h) > 0: tokens([';', ','])
        # context.in_list = True
        key = maybe(quote) or word()
        # Property versus hash !!
        maybe_tokens(hash_assign) or starts_with("{")
        val = expression()
        h[key] = val
        return {key: val}

    star(lamb)
    _('}')
    context.in_hash = False
    # context.context.in_list = False
    if not interpreting():
        return Dict(list(h.keys()), list(h.values()))  # ORDER OK???
    return h


# careful with blocks/closures ! map{puts it} VS data{a:"b")


def immediate_hash():  # a:b a:{b} OR a{b:c}):
    must_contain_before(hash_assign, "}")
    w = maybe(quote) or word()  # expensive
    if maybe_tokens(hash_assign):  # disastrous :  BLOCK START!
        r = expression()
    elif starts_with("{") or _('=>'):
        # maybe(lambda:starts_with("={")) and maybe_token('=') or:c)
        no_rollback()
        r = regular_hash()
    else:
        raise_not_matching("no immediate_hash")
    if interpreting():
        return {str(w): r}  # AH! USEFUL FOR NON-symbols !!!
    return kast.Dict([w], [r])


# todo PYTHONBUG ^^

def maybe_cast(_context):
    if not maybe_token('as'): return False
    typ = typeNameMapped()
    return call_cast(_context, typ)


def maybe_algebra(_context):
    op = maybe_tokens(operators)
    if not op: return False
    z = expression()
    return do_call(_context, op, z)


def contains(token):
    return token in the.current_line


def contains_any(tokens):
    for token in tokens:
        if token in the.current_line:
            return True


def quick_expression():  # bad idea?
    result = False
    # end
    if the.token == '': raise EndOfLine()
    if the.token == ';': raise EndOfStatement()
    # list
    if the.token == ',': return liste(first=the.result)
    # hash_map
    if not context.in_params and look_1_ahead(':'):
        return immediate_hash()  # a:b ~ {a=>b} todo  a:string type etc
    # hash_map
    if the.token == '{':
        if look_1_ahead('}'): return empty_map()
        if contains("=>") or contains(":"): return hash_map()
    # property
    if look_1_ahead(['.', '\'s', "of"]):
        maybe(method_call) or property()  # simpleProperty()
        if callable(the.result) or isinstance(the.result,Call):
            return call(the.result,result) # flipped js style a.b(c)
        else: return the.result

    # setter
    if look_1_ahead('='):
        if not context.in_condition: return setter()
    # declaration   (map x)
    if the.token in type_names or the.token in the.classes.keys():
        return declaration()  # setter case ABOVE!
    # NO(?!) algebra
    if the.token in operators + special_chars:
        if the.token != "~": return False  # USE ALGEBRA // Fuckup !!  #TODO: if more than one
    # if context.in_algebra: return False
    # return algebra(result)
    # if context.in_condition: return condition()

    # number
    if the.current_type == _token.NUMBER:
        result = number()
        # n'th item
        if maybe_tokens(['rd', 'nd', 'th']):
            result = nth_item(result)
    # regexp
    elif the.token.startswith("r'"):  # wrongly tokeinzied: : or the.current_word.startswith("/"):
        result = regexp(the.token)
        next_token(False)
    # string
    elif the.current_type == _token.STRING or the.token.startswith("'"):
        result = quote()
    # <token>
    elif the.token in the.token_map:  # safe, ok!
        fun = the.token_map[the.token]
        # no_rollback() #! << NEW
        debug("token_map: %s -> %s" % (the.token, fun))
        result = fun()  # already wrapped maybe(fun)
    # method builtin?
    elif the.token in the.method_token_map:
        fun = the.method_token_map[the.token]
        debug("method_token_map: %s -> %s" % (the.token, fun))
        result = fun()  # already wrapped maybe(fun)
    # method dynamic?  <<
    elif the.token in the.method_names:
        if method_allowed(the.token):
            result = method_call()  # already wrapped maybe(method_call)
    # param
    elif the.token in list(the.params.keys()):
        result = true_param()
    # variable
    elif the.token in list(the.variables.keys()):
        result = known_variable()  # we don't rise undeclared variable here
    # type TODO
    elif the.token in english_tokens.type_names:
        return maybe(setter) or method_definition()  # or ... !!!!!

    # a of b
    if look_1_ahead('of'):
        result = evaluate_property(result)

    if not result: return False
    # if not context.in_algebra and the.current_word in operators  + ["element", "item"]:# + special_chars todo
    #   op=the.current_word;next_token()
    #   return do_math(result,op,nod())
    # try:
    while True:
        z = post_operations(result)
        if not z or z == result: break  # or z=='False'
        result = z
    # except Exception as e:
    #   print (e)
    #   pass # allow some extra stuff?
    return result


def post_operations(result):  # see quick_expression !!
    if the.token == '': return result
    if the.token == ';': return result
    # if the.current_word in ['not']: return not result
    if the.token == '.': return method_call(result)
    if the.token == ',' and not (context.in_args or context.in_params or context.in_hash):
        return liste(check=False, first=result)
    # if the.current_word in operators and look_1_ahead('='):
    # 	return self_modify(result) # see operator_equals
    if the.token in self_modifying_operators:
        return self_modify(result)
    if the.token == '+' and look_1_ahead('+'):
        return plusPlus(result)
    if the.token == '-' and look_1_ahead('-'):
        return minusMinus(result)
    if the.token in be_words:
        if not context.in_condition:
            if isinstance(result, Variable):
                return setter(result)
            else: return algebra(result)
        # else:
        #     raise_not_matching("better try setter")
        elif the.token == 'are':
            return False  # DONT DO algebra here HACK
    if the.token == '|': return piped_actions(result or the.last_result)
    # if the.current_word in comparison_words:
    #   if not look_ahead(operators):
    #     compar=comparation()
    #     return do_compare(context,compar,expression()) or FALSE
    # else algebra(context)
    if the.token in operators:
        # if not the.current_word in quantifiers:
        return algebra(result)
    if the.token == '[':
        return evaluate_index(result)
    if the.token in operators + special_chars + ["element", "item"]:
        return False
    if result and the.token == 'to': return ranger(result)
    if result and the.token == 'if': return action_if(result)
    # raise_not_matching("quick_expression too simplistic")
    if the.current_line.endswith("times"): return action_n_times(result)
    if the.token in be_words: return setter(result)
    if the.token == "if":  # YAY!
        return result if _("if") and condition() else maybe("else") and expression() or None
    if the.token == "as": return maybe_cast(result)
    return False


# or maybe_algebra(context) or context


@Starttokens(["pass"])  # , ";"
def passing():
    ok = tokens(["pass", ";"])
    return ok if interpreting() else ast.Pass()


def space():
    if (token(' ') or token('')) != None:
        return OK
    else:
        return False


def expression(fallback=None, resolve=True):
    maybe(space)  # why? bug!
    if the.token == '' or len(the.token) == 0:
        raise EndOfLine()
    if the.token == ';': raise EndOfStatement()
    the.result = ex = maybe(quick_expression) or \
                      maybe(listselector) or \
                      maybe(algebra) or \
                      maybe(hash_map) or \
                      maybe(evaluate_index) or \
                      maybe(liste) or \
                      maybe(evaluate_property) or \
                      maybe(selfModify) or \
                      maybe(endNode) or \
                      maybe(passing) or \
                      raise_not_matching("Not an expression: " + pointer_string())  # and print_pointer(True)
    # maybe(method_call) or \
    # maybe(swift_hash) or \

    ex = post_operations(ex) or ex
    skip_comments()

    if not interpreting():
        # if not context.use_tree:
        #     return (start, pointer())
        return ex  # the.result  # AST NODE, Hopefully

    if resolve and ex and interpreting():
        the.last_result = the.result = do_evaluate(ex)
    # TODO PYTHON except SyntaxError:
    if not the.result or the.result == SyntaxError and not ex == SyntaxError:
        pass
    # keep false
    else:
        ex = the.result
    # NEIN! print('hi' etc etc)
    # if the.result.isa(Quote): more=maybe(expression0)
    # more=more or maybe(quote) #  "bla " 7 " yeah"
    # if more.isa(Quote) except "": more+=maybe(expression0)
    # if more: ex+=more
    if ex == ZERO: ex = 0  # HERE ?
    the.result = ex
    return the.result


def piped_actions(a=False):
    if context.in_pipe: return False
    must_contain(["|", 'pipe'])  # then
    context.in_pipe = True
    a = a or statement()
    tokens(['|', 'pipe'])
    no_rollback()
    xmodule, obj, name = true_method() or bash_action()
    args = star(call_arg)
    context.in_pipe = False
    if isinstance(name, collections.Callable): args = [args, Argument(value=a)]  # with owner
    if interpreting():
        if isinstance(a,list):
          a=xlist(a)
        the.result = do_call(a, name, args)
        print((the.result))
        return the.result
    else:
        return OK


def statement(doraise=True):
    if starts_with(done_words) or checkNewline():  # allow empty blocks
        if doraise:
            raise_not_matching("end of block ok")
        else:
            return False
    # raiseNewline()  # maybe(really) maybe(why)
    if checkNewline(): return NEWLINE
    maybe_indent()
    x = maybe(quick_expression) or \
        maybe(setter) or \
        maybe(returns) or \
        maybe(imports) or \
        maybe(method_definition) or \
        maybe(assert_that) or \
        maybe(breaks) or \
        maybe(loops) or \
        maybe(if_then_else) or \
        maybe(once) or \
        maybe(piped_actions) or \
        maybe(declaration) or \
        maybe(nth_item) or \
        maybe(new) or \
        maybe(action) or \
        maybe(expression) or \
        raise_not_matching("Not a statement %s" % pointer_string())
    # AS RETURN VALUE! DANGER!

    context.in_condition = False  # hack!
    the.result = x
    the.last_result = x
    skip_comments()
    adjust_interpret()
    return the.result


# one :action, :if_then ,:once , :looper
# any{action  or  if_then  or  once  or  looper)


# nice optional return 'as':
# define sum x,y as:
#     x+y
# end
# define the sum of numbers x,y and z as number x+y+z
def addMethodNames(f):
    if len(f.arguments) > 0:
        obj = f.arguments[0]
        if len(obj.name) == 1: return f  # hack against "fibonacci n"
        if not obj.preposition:
            name = f.name + " " + obj.name
            args = f.arguments[1:]
            f2 = FunctionDef(name=name, arguments=args, return_type=f.return_type, body=f.body)
            the.methods[name] = f2
            the.method_names.insert(0, name)  # add longnames first!
            addMethodNames(f2)
            return f2
    return f


@Starttokens(method_tokens)
def method_definition(name=None, return_type=None):
    if not name:
        # annotations=maybe(annotations)
        modifiers = maybe_tokens(modifier_words)
        return_type = maybe(typeName)
        tokens(method_tokens)  # how to
        no_rollback()
        name = word(include=english_operators)  # maybe(noun) or verb()  # integrate or word

    brace = maybe_token('(')
    context.in_params = True
    args = []

    def arguments():
        if the.current_offset == 0: raise_not_matching("BLOCK START")
        a = param(len(args))
        maybe_token(',')
        args.append(a)
        return a

    # obj= maybe( endNode ) # a sine wave  TODO: invariantly get as argument book.close==close(book)
    star(arguments)  # i.e. 'over an interval i' 'from a to b' 'int x, int y=7'

    context.in_params = False
    if brace: token(')')

    return_type = return_type or maybe_tokens(['as']) and maybe(typeNameMapped) or None
    return_type = maybe_tokens(['returns', 'returning', '=>', '->']) and maybe(typeNameMapped) or return_type
    maybe_tokens(['return', '='])  # as block starters, NOT as return_type indicators!

    dont_interpret()

    f = FunctionDef(name=name, arguments=args, return_type=return_type, body="allow pre-recursion")
    # ,modifiers:modifiers, annotations:annotations
    the.methods[name] = f
    the.method_names.insert(0, name)
    f2 = addMethodNames(f)
    # # with args! only in tree mode!!
    b = action_or_block()  # define z as 7 allowed !!!
    look_1_ahead("return", "Return statement out of method {block}, are you missing curlies?", must_not_be=True)
    if not isinstance(b, list): b = [b]
    if not isinstance(b[-1], (kast.Print, ast.Return)):
        b[-1] = kast.assign("it", b[-1])
    # b[-1]=(ast.Expr(b[-1]))
    f.body = b
    f2.body = b  # ürx
    the.params.clear()
    return f


def execute(command):
    import os
    return os.popen(command).read()


# NOT: exec(command) !! == eval


@Starttokens(['bash', '`', 'exec'])
def bash_action():
    # import bindingsr'shell'bash-commands
    if starts_with("`") and beginning_of_line():
        raise DidYouMean("shell <bash command ...>")
    ok = starts_with(['bash', 'exec', '`'] + bash_commands)
    if not ok: raise_not_matching("no bash commands")
    no_rollback()
    maybe_tokens(['execute', 'exec', 'command', 'commandline', 'run', 'shell', 'shellscript', 'script', 'bash'])
    command = maybe(quote)  # danger bash "hi">echo
    command = command or rest_of_line()
    # any{ maybe(  ) or   statements )
    if interpreting():
        try:
            print(('Going to execute ' + command))
            the.result = execute(command)
            print('the.result:')
            print((the.result))
            if the.result:
                return the.result.split("\n")
            else:
                return True
        except:
            print('error (e)xecuting bash_action')

    return False


@Starttokens(if_words)
def if_then_else():
    ok = if_then()  # todo :if 1 then False else: 2 => 2 :(: ok      =
    # if ok == False:
    #     ok = FALSE
    adjust_rollback()
    o = maybe(otherwise)
    if context.use_tree:
        if isinstance(ok, ast.IfExp):
            ok.orelse = o or NameConstant(None) #ast.Num(0)
        else:
            if o:
                ok.orelse = [ast.Expr(o)]
            else:
                ok.orelse = []
        return ok
    if ok != "OK" and ok != False:  # and ok !=FALSE ^^:
        the.result = ok
    else:
        the.result = o
    return the.result


def action_if(a):
    if not a: must_not_start_with("if")
    must_contain('if')
    a = a or action_or_expression()
    _('if')
    # c = condition_tree()
    c = condition()
    if interpreting():
        if check_condition(c):
            return do_execute_block(a)
        else:
            return OK  # false but block ok!
    return a


def isStatementOrExpression(b):
    return isinstance(b, (ast.stmt, ast.Expr))


def if_then():
    tokens(if_words)
    no_rollback()
    c = condition()
    # c = condition_tree()
    # c = algebra()
    if c == None: raise InternalError("no condition_tree")
    started = maybe_token('then')
    if c != True: dont_interpret()
    adjust_rollback()
    b = action_or_block(started)
    maybe_newline()  # for else
    adjust_interpret()
    if c == False or c == FALSE: return False
    if c == True: return b
    if interpreting() and c != True:  # c==True done above!
        if check_condition(c):
            return do_execute_block(b)
        else:
            return OK  # o or  false but block ok!
    else:  # AST
        # if not isStatementOrExpression(b):b=ast.Expr(b)
        if isinstance(b, (ast.Num, ast.Str)):  # ... simple cases
            return ast.IfExp(test=c, body=b, orelse=[])  # todo body cant be block here !
        else:
            if not isinstance(b, list): b = [b]
            if not isinstance(b[-1], (ast.Expr, ast.Return)): b[-1] = ast.Expr(b[-1])  # Expr(Call()) WTF
            return ast.If(test=c, body=b, orelse=[])


def future_event():
    if the.token.endswith("ed"):  # beeped etc
        return word()


@Starttokens(once_words)
def once_trigger():
    tokens(once_words)
    no_rollback()
    dont_interpret()
    c = maybe(future_event) or condition()  # eval later, variables might not be set yet!!!
    maybe_token('then')
    b = action_or_block()
    return interpretation.add_trigger(c, b)


def _do():
    return maybe(lambda: _('do'))


@Starttokens('do')
def action_once():
    if not _do(): must_contain(once_words)  # and
    no_rollback()
    maybe_newline()
    b = action_or_block()
    # _do=maybe_token('do')
    # dont_interpret()
    # if not _do: b=action()
    # if _do: b=block and maybe(done)
    tokens(once_words)
    c = condition()
    end_expression()
    interpretation.add_trigger(c, b)


def once():
    # or  'as soon as' condition \n block 'ok'
    #	 or  'as soon as' condition 'then' action;
    return maybe(once_trigger) or action_once()


# or  action 'as soon as' condition()

# /*n_times
#	 verb number 'times' preposition nod -> "<verb> <preposition> <nod> for <number> times" 	*/
# r'*	 verb number 'times' preposition nod -> ^(number times (verb preposition nod)) # Tree ~= lisp	*'
def verb_node():
    v = verb
    nod
    if not v in methods: raise UnknownCommandError('no such method: ' + v)
    return v


# end_expression


def spo():
    # NotImplementedError
    if not use_wordnet: return False
    if not use_wordnet: raise NotMatching("use_wordnet==false")
    s = endNoun
    p = verb
    o = nod
    if interpreting(): return do_call(s, p, o)


def print_variables():
    return ''.join(['%s=%s' % (v, k) for v, k in variables.items()])


def is_object_method(method_name):
    if not str(method_name) in globals(): return False
    if method_name.lower() in keywords: return False
    object_method = globals()[str(method_name)]  # .method(m)
    return object_method  # 'True' ;)


# Object.constants  :IO, :STDIN, :STDOUT, :STDERR :.:Complex, :RUBY_VERSION :.


def has_object(m):
    return str(m) in globals()


def get_module(module):
    try:
        return sys.modules[module]
    except:
        import importlib

        importlib.import_module(module)
        return sys.modules[module]


def first_is_self(method):
    try:
        # args, varargs, varkw, defaults = inspect.getargspec(method)
        args, varargs, varkw, defaults, kwonlyargs, kwonlydefaults, annotations = inspect.getfullargspec(method)
        return args[0] == 'self'
    except:
        return False


# In Python 2.7, built-in function objects such as print() simply
# do not have enough information for you to discover what arguments they support!!
def has_args(method, clazz=object, assume=0):
    #  todo all intransitive verbs with objects! IF OBJECT  'invert' x
    if method in ['increase', '++', '--']:  # increase by 8:
        return 0
    if isinstance(method, FunctionDef):
        return len(method.arguments)
    method = findMethod(clazz, method)
    try:
        is_builtin = type(method) == types.BuiltinFunctionType or type(method) == types.BuiltinMethodType
        if (is_builtin):
            doku = method.__doc__
            if doku:  # no Python documentation found for 'hypot'
                convention = doku.split('\n')[0]
                num = len(convention.split(","))
                return num
            warn("BuiltinMethodType => no idea about the method arguments!")
            return assume
        # args, varargs, varkw, defaults = inspect.getargspec(method)
        args, varargs, varkw, defaults, kwonlyargs, kwonlydefaults, annotations = inspect.getfullargspec(method)
        alle = len(args) + (defaults and len(defaults) or 0) + (varkw and len(varkw) or 0)
        # if alle == 0: return assume
        return alle
    except:
        return assume or 0


def c_method():
    return tokens(c_methods)


def builtin_method():
    w = word
    if not w: raise_not_matching("no word")
    # if w.title() == w: raise_not_matching("capitalized #{w) no builtin_method")
    m = is_object_method(w)
    # m = m or HelperMethods.method(w)
    return m


# m ? m.name : None


def is_method(name):
    return name in the.method_names or maybe(verb)


def import_module(module_name):
    try:
        print(("TRYING MODULE " + module_name))
        import importlib

        importlib.import_module(module_name)
        module = sys.modules[module_name]
        # moduleMethods=dir(module)
        # methods+=moduleMethods #ONCE!!
        moduleMethods = the.moduleMethods[module_name]
        # import inspect
        return module, moduleMethods
    except Exception as e:
        raise e


def subProperty(_context):
    maybe_token(".")
    properties = dir(_context)
    if _context and type(_context) in context.extensionMap:
        ext = context.extensionMap[type(_context)]
        properties += dir(ext)
    property = maybe_tokens(properties)
    # the.moduleMethods[module_name] etc!
    if not property or isinstance(property, collections.Callable) or is_method(property):
        return _context, property  # save methods for later!
    property = maybe_token(".") and subProperty(property) or property
    return property, None


def true_method(obj=None):
    ex = english_operators  # - ['print','add','subtract']
    no_keyword_except(ex)
    should_not_start_with(auxiliary_verbs)
    xmodule = maybe_tokens(the.moduleNames)
    xvariable = maybe_tokens(list(the.variables.keys()))
    if xmodule:
        module, moduleMethods = import_module(xmodule)
        obj, name = subProperty(module)
        # if obj == module: obj = None
        if obj: moduleMethods += dir(obj)
        if not name: name = maybe_tokens(moduleMethods)
    elif xvariable:
        variable = the.variables[xvariable]
        if isinstance(variable.value, collections.Callable):
            name = variable.value.__name__
        else:
            if not isinstance(variable.value, str):
                raise_not_matching("not a method: %s" % variable.value)
            name = findMethod(nil, variable.value)
            if not name:
                obj, name = subProperty(variable.value)
    else:
        obj, property = subProperty(obj)
        name = maybe_tokens(the.method_names) or maybe(verb)
    if not name:
        raise NotMatching('no method found')
    if maybe_tokens(articles):
        obj = ' '.join(one_or_more(word))
        longName = name + " " + obj
        if longName in the.method_names:
            name = longName
        if obj in the.variables:
            obj = the.variables[obj]
        # if the.current_word.endswith("ed"):
        # sorted files -> sort files ?
    return xmodule, obj, name  # .to_s


# maybe(ruby_method_call)  or


# read mail or module read mail or object read mail bla(1) or a.bla(1)  vs ruby_method_call !!
def method_call(obj=None,method0=None):
    # verb_node
    if not method0:
        module, obj, method_name = true_method(obj)
    else:
        module=None
        method_name=findMethod(obj,method0)
    context.in_algebra = False  # hack?
    # method = findMethod(obj, method_name)  # already? todo findMethods with S, ambiguous ones!!
    # no_rollback()  # maybe doch?
    start_brace = maybe_tokens(['(', '{'])  # '[', list and closure danger: index)
    # todo  ?merge with maybe(liste)
    if start_brace: no_rollback()
    if module or obj or is_object_method(method_name):  # todo  not has_object(method) is_class_method:
        obj = obj or None  # globals
    else:
        maybe_token('of')  # size of class?? << todo
        obj = maybe(list(the.classes.keys())) or maybe(the.moduleNames)  # exclude vars
        if not context.in_args:
            obj = obj or maybe(liste)  # danger: liste vs args below
        maybe_token(',')
    # print(sorted files)
    # if not in_args: obj=maybe( maybe(nod)  or  maybe(list)  or  expression )

    method = findMethod(obj, method_name)  # Now we know the object
    assume_args = True  # not starts_with("of")  # True    #<< Redundant with property eventilation!
    args = None
    if has_args(method, module or obj, assume_args):
        context.in_args = True
        args = []

        def call_args():
            if len(args) > 0: maybe_tokens([',', 'and'])
            if starts_with(';'): return False  # done
            arg = call_arg()
            if isinstance(arg, list):
                args.extend(arg)
            else:
                args.append(arg)
            return args

        star(call_args)  # args = set above!
        if not args and not context.use_tree and not self_modifying(
                method):  # todo! x.y() vs y(x) : call(attribute(x),y) vs call(y,x)
            if context.use_tree:
                args = obj
            else:
                args = do_evaluate(obj)
            obj = None  # self mechanism!! x.do() = x::do(self)
    else:
        more = maybe_token(',')
        if more: obj = [obj] + liste(False)

    method = findMethod(obj, method, args)  # if not unique before!
    context.in_args = False
    if start_brace == '(': _(')')
    if start_brace == '[': _(']')
    if start_brace == '{': _('}')
    if not interpreting():
        if method_name == "puts" or method_name == "print":
            return kast.Print(dest=None, values=args, nl=True)  # call symbolically!
        # return kast.Print(dest=None, values=map(do_evaluate,args), nl=True)
        return FunctionCall(func=method, arguments=args, object=obj)
    the.result = do_call(obj or None, method, args or None)
    return the.result


def tokens_(tokens0):
    return maybe_tokens(tokens0)


@Starttokens(bla_words)
def bla():
    return tokens_(bla_words)


@Starttokens('tell')
def applescript():
    _('tell')
    tokens(['application', 'app'])
    no_rollback()
    app = quote
    the.result = "tell application \"%s\"" % app
    if maybe_token('to'):
        the.result += ' to ' + rest_of_line()  # "end tell"
    else:  # Multiline
        while the.string and not the.current_line.contains('end tell'):
            the.result += rest_of_line() + "\n"

    # the.result        +="\ntell application \"#{app)\" to activate" # to front
    # -s o r'path'tor'the'script.scpt
    # from platform import system as platform
    import platform

    if not platform.system() is 'Darwin':
        raise Exception("tell application ")
    if interpreting(): the.result = execute("/usr/bin/osascript -ss -e $'%s'" % the.result)
    return the.result


@Starttokens('assert')
def assert_that():
    _('assert')
    maybe_token('that')
    no_rollback()
    # s=statement()
    do_interpret()
    # s = condition_old()
    s = condition()
    # s = expression()
    if interpreting():
        assert check_condition(s), s
    if context.use_tree:
        # left=kast.assign('left', s.left)
        # s.left=kast.name('left')
        # return [left, ast.Assert(test=s, msg=str(s) + "\n %s %s %s" % (s.left, s.comp, s.right))]
        return ast.Assert(test=s, msg=str(s))
    return s


def arguments():
    return star(param)


def maybe_token(x):
    if x == the.token:
        next_token()
        return x
    return False


def constructor():
    pass  # see class!


# class Color(shared Integer rgba) {


@Starttokens(['create', 'new', 'init'])
def new():
    maybe_tokens(['create', 'init'])  # define
    the_()
    _('new')
    # clazz=word #allow data
    clazz = class_constant()
    return do_call(clazz, "__init__", arguments())


# clazz=Class.new
# variables[clazz]=
# clazz(arguments)


@Starttokens(['return', 'returns'])
def returns():
    tokens(['return', 'returns'])
    no_rollback()
    the.result = maybe(expression)
    if interpreting():
        the.params.clear()
    if context.use_tree:
        return ast.Return(value=the.result)
    return the.result


@Starttokens(flow_keywords)
def breaks():
    return tokens(flow_keywords)


#	 or 'say' x=(.*) -> 'bash "say $quote"'
def action():  # NOT THE SAME AS EXPRESSION!?
    start = pointer()
    maybe(bla)
    the.result = maybe(quick_expression) or \
                 maybe(special_blocks) or \
                 maybe(applescript) or \
                 maybe(bash_action) or \
                 maybe(evaluate) or \
                 maybe(returns) or \
                 maybe(selfModify) or \
                 maybe(method_call) or \
                 maybe(spo) or \
                 raise_not_matching("Not an action")
    # maybe( verb_node ) or
    # maybe( verb )
    # if not interpreting():
    #     if not context.use_tree: return (start, pointer())
    # if the.result=='False': the.result=False #SURE??
    return the.result  # value or AST


def action_or_expression(fallback=None):  # if a/e then a/b
    ok = maybe(action)
    if ok: return ok  # and ok!='False' ? all good?
    return expression(fallback)


def expression_or_block():  # action_or_block):
    return action_or_block()


def action_or_block(started=False):  # expression_or_block
    _start = maybe_tokens(start_block_words) or started
    if _start:
        # allow_rollback()
        if maybe_newline() or must_contain(done_words, False):
            # 1) def x do \n block \n (end)
            ab = block()
        else:
            # 2) def x do action (end)
            ab = action_or_expression()
        # ab = action()
    else:
        if maybe_newline():
            # allow_rollback()
            # 3) def x \n block \n (end)
            ab = block()
        else:
            # 4) generous!! if 1>0 beep
            maybe_indent()
            ab = action_or_expression()
        # raise_not_matching("expecting action or block start")
    if _start == "then" and the.token == "else": return ab
    maybe_newline() or end_block(_start)
    return ab


def end_block(type=None):
    return done(type)


def done(_type=None):
    # if _type and maybe(lambda: close_tag(_type)): return OK
    if checkEndOfFile(): return OK
    # if checkEndOfLine(): return OK NOT ENOUGH FOR BLOCK!
    if the.current_line == "\n": return OK
    if the.current_line == "end\n":
        next_token()
        return OK  # todoooo
    if the.current_type == _token.DEDENT: return OK
    checkNewline()
    ok = maybe_tokens(done_words)
    if _type and not _type in start_block_words:
        token(_type)
    # if ok: ignore_rest_of_line() NO: def x:0;end;puts x
    if _type and the.previous_word == ";": return OK  # REALLY??
    # maybe_newline()
    return ok


# used by done / end_block()
def close_tag(type):
    _('</')
    _(type)
    _('>')
    return type


# Similar to align_args DIFFERENCE?
def prepare_named_args(args):
    import copy
    # eval_args(args)
    context_variables = copy.copy(the.variables)
    if not isinstance(args, dict):
        # todo()
        return {'arg': args}
    for arg, val in args.items():
        if arg in context_variables:
            v = context_variables[arg]
            # v = v.clone
            if isinstance(v, Variable):
                v.value = val
            context_variables[str(arg)] = val  # v  # to_sym todo NORM in hash!!!
        else:
            context_variables[str(arg)] = val  # Variable(name=arg, value=val)
    return context_variables


# also on the fly when interpreting
def eval_ast(b, args={}):
    import pyc_emitter
    args = prepare_named_args(args)
    the.result = pyc_emitter.eval_ast(b, args, run=True)
    return the.result


def do_execute_block(b, args={}):
    if not interpreting():
      return b
    global variableValues
    if not b: return False
    if b == True: return True
    if isinstance(b, collections.Callable): return do_call(None, b, args)
    if isinstance(b, FunctionCall): return do_call(b.object, b.name, args or b.arguments)
    if isinstance(b, kast.AST): return eval_ast(b, args)
    if isinstance(b, list) and isinstance(b[0], kast.AST): return eval_ast(b, args)
    if not is_string(b): return b  # OR :. !!!
    block_parser = EnglishParser()
    block_parser.variables = the.variables
    block_parser.variableValues = variableValues
    # block_parser.variables+=args
    try:
        print("using old interpretation recursion")
        the.result = block_parser.parse(b)
    except:
        error(traceback.extract_stack())
    variableValues = block_parser.variableValues
    return the.result


def datetime():
    # Complicated stuff!
    # later: 5 secs from now  , _(5pm) == AT 5pm
    must_contain(time_words)
    _kind = tokens(event_kinds)
    no_rollback()
    maybe_tokens(['around', 'about'])
    # import chronic_duration
    # WAH! every second  VS  every second hour WTF ! lol
    n = maybe(number) or 1  # every [1] second
    _to = maybe(lambda: tokens(['to', 'and']))
    if _to: _to = number()
    _unit = tokens(time_words)  # +["am"]
    _to = _to or maybe_tokens(['to', 'and'])
    if _to: _to = _to or maybe(number)


# return events.Interval(_kind, n, _to, _unit)


def collection():
    return maybe(ranger) or \
           maybe(known_variable) or \
           action_or_expression()


@Starttokens('for')
def for_i_in_collection():
    must_contain('for')
    maybe_token('repeat')
    maybe_tokens(['for', 'with'])
    maybe_token('all')
    v = variable(ctx=Store())  # or v=it(selector())
    maybe_tokens(['in', 'from'])
    c = collection()
    dont_interpret()
    b = action_or_block()
    do_interpret()
    if interpreting():
        for i in c:
            v.value = i
            the.result = do_execute_block(b)
    else:
        if isinstance(c, list): c = List(elts=c, ctx=Load())
        return For(store(v), c, [b], [])
    # return For(store(v), c, [assign('it', b)], [])
    return the.result


#  until_condition ,:while_condition ,:as_long_condition()

def assure_same_type(var, _type):
    if var.name in the.variableTypes:
        oldType = the.variableTypes[var.name] or type(var.value)
    elif var.type:
        oldType = var.type
    else:
        oldType = None

    if _type == "Unknown": return

    if isinstance(_type, ast.AST):
        warn("TYPE AST")
        return

    if not isType(oldType):
        if oldType:
            warn("NOT A TYPE %s" % oldType)  # todo?
        return

    # if isinstance(oldType,str):
    #   oldType=eval(oldType)
    # oldType =getattr(sys.modules[__name__], oldType)

    if oldType and issubclass(oldType, unicode):
        if issubclass(_type, int):
            return  # OK todo autocast!
        if issubclass(_type, str):
            return  # OK todo if len()==1

    if oldType and issubclass(oldType, str):
        if issubclass(_type, unicode):
            # var.type = type  # ok: upgrade
            return  # OK
    # try:
    if issubclass(_type, _ast.AST):
        print("skipping type check for AST expressions (for now)!")
        return
    if oldType and _type and not issubclass(oldType, _type):  # FAIL:::type <= oldType:
        raise WrongType(var.name + " has type " + str(oldType) + ", can't set to " + str(_type))
    if oldType and var.type and not issubclass(oldType, var.type):
        raise WrongType(var.name + " has type " + str(oldType) + ", cannot set to " + str(var.type))
    if _type and var.type and not (issubclass(var.type, _type) or issubclass(_type, var.type)):  # DOWNCAST TODO
        raise WrongType(var.name + " has type " + str(var.type) + ", Can't set to " + str(_type))
    var.type = _type  # ok: set

# what's the difference?? ^^>>
def assure_same_type_overwrite(var, val, auto_cast=False):
    if not val: return
    oldType = var.type
    oldValue = var.value
    if (isinstance(val, FunctionCall)):
        if val.return_type != "Unknown" and val.return_type != oldType:  # None:
            raise WrongType("OLD: %s %s VS %s return_type: %s " % (oldType, oldValue, val, val.return_type))
    elif oldType:
        try:
            wrong_type = WrongType("OLD: %s %s VS %s %s" % (oldType, oldValue, type(val), val))
            if not isinstance(val, oldType) and not issubclass(oldType, type(val)):
                if auto_cast:
                    return do_cast(val, oldType)
                else:
                    raise wrongType
        except:
            if not issubclass(type(val), _ast.AST):
                raise wrong_type
            else:
                print("skipping type check for AST expressions (for now)!")
    if var.final and var.value and not val == var.value:
        raise ImmutableVaribale("OLD: %s %s VS %s %s" % (oldType, oldValue, type(val), val))
    var.value = val


def do_get_class_constant(c):
    # if interpreting(): c = getattr(__module__, c)
    try:
        for module in sys.modules:
            if hasattr(module, c):
                return getattr(module, c)
    except Exception as e:
        print(e)


def class_constant():
    c = word
    return do_get_class_constant(c)


# if not Object.maybe(const_defined) c: raise NameError "uninitialized constant #{c)"


def get_obj(o):
    if not o: return False
    eval(o)  # except variables[o]


# Object.property  or  object.property



# see method_call!!
def simpleProperty():
    must_contain_before(".", special_chars + keywords)
    module = token(the.moduleNames)  # or token(the.classes) # or objs!!
    module = get_module(module)
    _(".")
    prop = word()
    if interpreting():
        x = getattr(module, prop)
        return x
    return kast.Attribute(kast.Name(module, kast.Load()), prop, kast.Load())


#       maybe_tokens(['every', 'all', 'those'])

# see method_call!!
def property():  # sett=False,delay_eval=True):
    must_contain_before([".", "'s", "of"], special_chars)
    var = value() # variable()  # todo or word() # or type/class!
    container = do_evaluate(var)
    # container = var.value
    of = __(['.', "'s", "of"])  # todo ,"of" don't work if var is unknown
    no_rollback()
    properti = word(include=operators)
    if of == "of": container, properti = properti, container  # flip!

    # if sett:
    sett = maybe_token('=') and expression()
    if sett:
        if interpreting():
            if isinstance(container, dict):
                container[properti] = sett
            else:
                setattr(container, properti, sett)
            return sett
        return Assign([Attribute(container, properti, sett and Store() or Load()), sett])
    if interpreting():
        # if delay_eval: return Attribute(container, properti, sett and Store() or Load())
        if isinstance(container, dict):
            return container[properti]
        else:
            return do_evaluate_property(properti,container)
    return Attribute(container, properti, sett and Store() or Load())


# return Property(name=properti, owner=owner)


# difference to setter? just public int var const test # no be_words
def declaration():
    must_not_contain(be_words)
    # must_contain_before  be_words+['set'],';'
    a = the_()
    mod = maybe_tokens(modifier_words)
    type = typeNameMapped()
    maybe_tokens(['var', 'val', 'let'])
    mod = mod or maybe_tokens(modifier_words)  # public static :.
    var = maybe(known_variable) or variable(a, ctx=kast.Store())
    try:
        val = type()  # DEFAULT CONSTRUCTOR!?
    except:
        val = None
    var = add_variable(var, val, mod, _type=type)
    if var.type:
        assure_same_type(var, type)
    else:
        var.type = type
    var.final = mod in const_words
    var.modifier = mod
    the.variableTypes[var.name] = var.type
    return var


@Starttokens(let_words)
def setter(var=None):
    # if not var:
    must_contain_before(args=['is', 'be', 'are', ':=', '=', 'set', 'to'],
                        before=['>', '<', '+', '-', '|', '/', '*', ';'])
    _let = maybe_tokens(let_words)
    if _let: no_rollback()
    a = maybe(_the)
    mod = maybe_tokens(modifier_words)
    _type = maybe(typeNameMapped)
    maybe_tokens(['var', 'val', 'value of'])  # same as let? don't overwrite?
    mod = mod or maybe(modifier)  # public static :.
    # else:
    #     _type=var.type
    #     mod=var.modifier
    var = var or variable(a, ctx=kast.Store())  # property now has own method with setter
    if token == "[":
        return evaluate_index(var)
    # if use_tree: var.ctx=Store()
    setta = maybe_tokens(['to']) or be()  # or not_to_be 	contain -> add or create
    if not setta: raise NotMatching("BE!?")  # bug ^^
    if (setta == ':=' or _let == 'alias'): return alias(var);
    # val = maybe(adjective) or expressions()
    if maybe_tokens(['a', 'an']) and not _type:  # todo x is a list of ... !?
        _type = typeNameMapped()
        val = _type()  # default constructor!!!
        return add_variable(var, val, mod, _type)
    else:
        context.in_setter=True
        val = expression()
    _cast = maybe_tokens(["as", "cast", "cast to", "cast into", "cast as"]) and typeNameMapped()
    guard = maybe_token("else") and value()
    # guard = maybe_token("else") and action_or_block()

    if _cast:
        if interpreting():
            val = do_cast(val, _cast)
        else:
            _type = _cast  # todo
    val = do_evaluate(val) or do_evaluate(guard)
    # allow_rollback()
    if setta in ['are', 'consist of', 'consists of']:
        val = flatten(val)

    try:
        add_variable(var, val, mod, _type)
    except Exception as e:
        if guard:
            val = guard
            add_variable(var, guard, mod, _type)
        else:
            raise

    # end_expression via statement!
    context.in_setter=False
    if not interpreting():
        return ast.Assign([kast.Name(var.name, kast.Store())], val)
    if interpreting() and val != 0: return val
    return var


# 'initial'?	maybe(let) maybe(_the) ('initial' or 'var' or 'val' or 'value of')? variable (be or 'to') value


# alias l=ls x:=y*y x(y):=y*y
@Starttokens(['alias'])
def alias(var=None):
    if not var:
        must_contain(['alias', ':='])
        ali = _('alias')
        var = variable(False, ctx=kast.Store())
        if look_1_ahead('('):
            return method_definition(var.name)
        ali or be()
    dont_interpret()
    a = rest_of_line()  # can't parse yet (i.e. x:= y*y )
    # a=maybe(action_or_block) or rest_of_line()
    add_variable(var, a)
    var.type = "alias"
    if context.use_tree:
        f = FunctionDef(name=var.name, body=a)
        addMethodNames(f)
        return f
    return var


def add_variable(var, val, mod=None, _type=None):
    # type Variable
    if not isinstance(var, Variable):
        print("NOT a Variable: %s" % var)
        return var
    if isinstance(val,Variable):
        val = val.value

    var.typed = _type or var.typed or 'typed' == mod  # in [mod]
    if isinstance(val, FunctionCall):
        assure_same_type(var, val.returns)
    else:
        assure_same_type(var, _type or type(val))
        assure_same_type_overwrite(var, val)
    # if var.typed:
    #     var.type = _type #ok: set

    if not var.name in variableValues.keys() or mod != 'default':  # and interpreting():
        the.variableValues[var.name] = val
        the.variables[var.name] = var
        var.value = val
    the.token_map[var.name] = known_variable
    var.type = _type or type(val)
    var.final = mod in const_words
    var.modifier = mod
    the.variableTypes[var.name] = var.type
    # if isinstance(var, Property): var.owner.send(var.name + "=", val)  # todo
    return var


# todo : allow other methods: go to berlin ...
@Starttokens(['go', 'start', 'thread', 'run'])
def go_thread():
    tokens(['go', 'start', 'thread'])
    must_not_start_with(prepositions)  # go to berlin
    dont_interpret()
    a = action_or_block()
    if interpreting():
        import threading
        thread = threading.Thread(target=do_execute_block, args=[a])
        the.threads.append(thread)
        thread.start()
    else:
        body = []
        if not isinstance(a, list): a = [a]
        body.append(ast.Import([ast.alias(name='threading', asname=None)]))  # alias('threading'
        body.append(FunctionDef(name='_tmp', body=a))
        # ast_lambda = ast.Lambda(args=[], body=a) Lambda Doesn't like Print statement!!
        body.append(kast.assign('_t', kast.call_attribute('threading', 'Thread', target=kast.name('_tmp'))))
        body.append(kast.call_attribute('_t', 'start'))
        return body
    return OK


# a=7
# a dog=7
# Int dog=7
# my dog=7
# a green dog=7
# an integer i
def isType(x):
    if isinstance(x, type): return True
    if x in type_names: return True
    return False


# already existing


def current_node():
    pass


def current_context():
    pass


def variable(a=None, ctx=kast.Load(), isParam=False):
    a = a or maybe_tokens(articles)
    if a != 'a': a = None  # hack for a variable
    must_not_start_with(keywords)
    typ = maybe(typeNameMapped)  # DOESN'T BELONG HERE! why not?
    # maybe_tokens(["name","label"]) #ignore?
    p = maybe_tokens(possessive_pronouns)
    # all=p ? [p] : []
    # try:
    no_keyword()
    all = one_or_more(word)
    # except:
    # if a == 'a':
    #     all = [a]
    # else:
    #     raise NotMatching()
    if not all or all[0] == None: raise_not_matching()
    name = " ".join(str(v) for v in all)
    if not typ and len(all) > 1 and isType(all[0]): name = all[1:-1].join(' ')  # (p ? 0 : 1)
    if p: name = p + ' ' + name
    name = name.strip()
    if isParam or isinstance(ctx, kast.Param):  # STORE IN CONTEXT (i.e. def x(int y)): y+3
        # todo split name!  width w, etc!!
        param = Variable(name=name, type=typ or None, ctx=ctx)
        the.params[name] = param
        return param
    if isinstance(ctx, kast.Load):
        if name in the.variables:
            return the.variables[name]
        if name in the.params:
            return the.params[name]
        else:
            if context.in_setter:
                raise UndeclaredVariable("Unknown variable " + name)
            else:
                raise NotMatching("Unknown variable " + name)
    # typ=_(":") and typeNameMapped() or typ # postfix type int x vs x:int VERSUS def x:\n !!!!

    if isinstance(ctx, kast.Store):  # why not return existing variable?
        if name in the.variables:
            return the.variables[name]
        # if name in the.variableTypes:
        #     typ=typ or the.variableTypes[name]
        oldVal = None
        # if name in the.variableValues:
        #     oldVal = the.variableValues[name]  # default or overwrite -> WARN? return OLD?
        # else:
        # oldVal = None
        the.result = Variable(name=name, type=typ or None, scope=None, module=current_context(), value=oldVal, ctx=ctx)
        the.variables[name] = the.result
        return the.result
    raise Exception("Unknown variable context %s" % ctx)


word_regex = r'^\s*[a-zA-Z]+[\w_]*'


def word(include=None):
    ## global the.string
    # danger:greedy!!!
    maybe_tokens(articles)
    if not include:
        include = []
    no_keyword_except(include)
    raiseNewline()
    # if not the.string: raise EndOfDocument.new
    # if maybe(starts_with) keywords: return false
    # match = re.search(r'^\s*[a-zA-Z]+[\w_]*',the.string)
    match = re.search(word_regex, the.token)
    if (match):
        current_value = the.token  # the.string[:match.end()]
        # the.string = the.string[match.end():].strip()
        next_token()
        return current_value
    raise_not_matching("word")


# fad35
# unknown
# noun

# NOT SAME AS should_not_start_with!!!


def must_not_contain(words, before=";"):
    old = the.current_token
    words = flatten(words)
    while not checkEndOfLine() and the.token != ';' and the.token != before:
        for w in words:
            if w == the.token:
                raise MustNotMatchKeyword(w)
        next_token()
    set_token(old)
    return OK


def must_not_start_with(words):
    should_not_start_with(words)


def todo(x=""):
    raise NotImplementedError(x)


def do_cast_x(x, typ):  # todo
    if isinstance(typ, float): return xfloat(x)
    if isinstance(typ, int): return xint(x)
    if typ == int: return xint(x)  # todo!
    if typ == xint: return xint(x)  # todo!
    if typ == "int": return xint(x)
    if typ == "integer": return xint(x)
    if typ == str: return xstr(x)
    if typ == xstr: return xstr(x)
    if typ == unicode: return xstr(x)
    if typ == "str": return xstr(x)
    if typ == "string": return xstr(x)
    if typ == extensions.xchar and len(str(x)) == 1:
        return extensions.xchar(str(x)[0])
    raise WrongType("CANNOT CAST: %s (%s) TO %s " % (x, type(x), typ))


def do_cast(x, typ):
    if isinstance(typ, float): return float(x)
    if isinstance(typ, int): return int(x)
    if typ == int: return int(x)  # todo!
    if typ == xint: return int(x)  # todo!
    if typ == "int": return int(x)
    if typ == "integer": return int(x)
    if typ == str: return str(x)
    if typ == xstr: return str(x)
    if typ == unicode: return str(x)
    if typ == "str": return str(x)
    if typ == "string": return str(x)
    if typ == extensions.xchar and len(str(x)) == 1:
        return extensions.xchar(str(x)[0])
    raise WrongType("CANNOT CAST: %s (%s) TO %s " % (x, type(x), typ))


def call_cast(x, typ):
    if interpreting(): return do_cast(x, typ)
    if isinstance(typ, type):
        typ = typ.__name__
    return FunctionCall(name=typ, arguments=x)  # 'cast'


def nod():  # options{generateAmbigWarnings=false)):
    return maybe(number) or \
           maybe(quote) or \
           maybe(regexp) or \
           maybe(known_variable) or \
           maybe(true_param) or \
           the_noun_that()


# maybe(the_noun_that)  # or
# maybe( variables_that ) # see selectable


def article():
    tokens(articles)


def number_or_word():
    maybe(number) or word()


# method definition args != call args
def param(position=1):
    pre = maybe_tokens(prepositions) or None  # might be superfluous if calling"BY":
    a = variable(a=None, isParam=True)  # set later:, ctx=kast.Param())
    # a = variable(a=None, ctx=kast.Param())
    return Argument(preposition=pre, name=a.name, type=a.type, position=position)


# VALUES given to CALLED method, NOT in declaration! # SEE PARAM ^^^!!
def call_arg(position=1):
    pre = maybe_tokens(prepositions) or ""  # might be superfluous if calling"BY":
    maybe_tokens(articles)
    # allow_rollback()
    # a = maybe(variable)# and not the.current_word in operators
    # if a: return Argument(name=a.name, type=a.type, preposition=pre, position=position, value=a)
    type = maybe(typeNameMapped)
    if look_1_ahead('='):
        name = maybe(word)
        maybe_token('=')
    else:
        name = None
    # value = endNode()
    value = expression(fallback=None, resolve=False)  # allow f(x-1)
    if isinstance(value, Variable):
        name = value.name
        type = type or value.type
    # value = expression()
    # method=get_method(name,obj)
    # if isinstance(method,Function):
    #     for a in method.arguments:
    return Argument({'preposition': pre, 'name': name, 'type': type, 'position': position, 'value': value})


# call integrate with integer n = 7


# BAD after filter, ie numbers [ > 7 ]
# that_are bigger 8
# whose z are nonzero
def compareNode():
    c = comparison_word()
    if not c: raise NotMatching("NO comparison")
    if c == '=': raise NotMatching('compareNode = not allowed')  # todo Why not / when
    right = endNode()  # expression
    return right


# @Starttokens('whose')
def whose():
    _('whose')
    endNoun()
    return compareNode()  # is bigger than live


# things that stink
# things that move backwards
# people who move like Chuck
# the input, which has caused problems
# images which only vary horizontally
def that_do():
    global comp
    tokens(['that', 'who', 'which'])
    star(adverb)  # only
    comp = verb  # live
    maybe_token('s')  # lives
    s = star(lambda: maybe(adverb) or maybe(preposition) or maybe(endNoun))
    return comp


# more easisly
def more_comparative():
    tokens(['more', 'less', 'equally'])  # comparison_words
    return adverb()


def as_adverb_as():
    _('as')
    a = adverb()
    _('as')
    return a


def endNode_():
    return maybe(endNode)


# 50% more
# "our burgers have more flavor",
# "our picture is sharper"
# "our picture runs sharper"
def null_comparative():
    verb()
    c = comparative()
    endNode_()
    if c.startswith('more') or c.ends_with('er'):
        return c


# faster than ever
#  more funny than the funny cat
def than_comparative():
    comparative()
    _('than')
    return maybe(adverb) or endNode()


# more bigger
def comparative():  # partial
    c = maybe(more_comparative) or adverb
    if c.startswith('more') or maybe(lambda: c.ends_with('er')):
        comp = c
    return c


def that_are():
    tokens(['that', 'which', 'who'])
    be()
    # bigger than live
    comp = maybe(adjective)
    comp or maybe(compareNode) or gerund()  # whining
    return comp


# things that I saw yesterday
def that_object_predicate():
    tokens(['that', 'which', 'who', 'whom'])
    maybe(pronoun) or endNoun()
    verbium()
    s = star(lambda: maybe(adverb) or maybe(preposition) or maybe(endNoun))
    return s


def that():
    filter = maybe(that_do) or maybe(that_are) or whose()
    return filter


def where():
    tokens(['where'])  # NOT: ,'who','whose','which'
    return condition()


# maybe(ambivalent)  delete james from china

# def current_value():
#     TreeBuilder.current_value()


def selector():
    if checkEndOfLine(): return
    x = maybe(compareNode) or \
        maybe(where) or \
        maybe(that) or \
        maybe(token('of') and endNode) or \
        preposition and nod  # friends in africa
    if context.use_tree:
        return parent_node()
    return x


# preposition nod  # maybe(ambivalent)  delete james, from china delete (james from china)

# (who) > run like < rabbits
# contains
def verb_comparison():
    star(adverb)
    comp = verb()  # WEAK !?
    maybe(preposition)
    return comp


def comparison_word():  # WEAK maybe(pattern)):
    global comp
    comp = maybe(verb_comparison) or comparation()  # are bigger than
    return comp


# def comparation_tree():
#     Todo() VIA ALGEBRA!


# is more or less
# is neither :. nor :.
# are all smaller than :.
# Comparison phrase
def comparation():
    # danger: is, is_a
    eq = maybe_tokens(be_words)
    maybe_token('all')
    start = pointer()
    maybe_tokens(['either', 'neither'])
    _not = maybe_tokens(['not'])
    maybe(adverb)  # 'quite','nearly','almost','definitely','by any means','without a doubt'
    if (eq):  # is (equal) optional:
        comp = maybe_tokens(comparison_words)
    else:
        comp = tokens(comparison_words)
        no_rollback()

    if eq: maybe_token('to')
    maybe_tokens(['and', 'or', 'xor', 'nor'])
    maybe_tokens(comparison_words)  # bigger or equal != different to condition_tree True or false
    # comp = comp and pointer() - start or eq
    # if Jens.smaller then ok:
    maybe_token('than')  # , 'then' #_22'then' ;) danger:
    comp = comp or eq
    if context.use_tree:
        comp = kast_operator_map[comp]  # todo: hacky _min LATER
    return comp


def either_or():
    maybe_tokens(['be', 'is', 'are', 'were'])
    tokens(['either', 'neither'])
    maybe(comparation)
    v = value()
    maybe_tokens(['or', 'nor'])
    maybe(comparation)
    return v


def is_comparator(c):
    ok = c in comparison_words
    ok = ok or c in class_words
    ok = ok or isinstance(c, ast.cmpop)
    ok = ok or isinstance(c, ast.Compare)
    # or \
    # (c - "is ") in comparison_words.contains() or \
    # comparison_words.contains(c - "are ") or \
    # comparison_words.contains(c - "the ") or \
    return ok


def check_list_condition(quantifier, left, comp, right):
    global negated
    # if not a.isa(Array): return True
    # see quantifiers
    try:
        count = 0
        comp = comp.strip()
        for item in left:
            if is_comparator(comp): the.result = do_compare(item, comp, right)
            if not is_comparator(comp): the.result = do_call(item, comp, right)
            # if not the.result and xlist(['all', 'each', 'every', 'everything', 'the whole']).matches(quantifier): break
            if not the.result and quantifier in ['all', 'each', 'every', 'everything', 'the whole']: break
            if the.result and quantifier in ['either', 'one', 'some', 'few', 'any']: break
            if the.result and quantifier in ['no', 'not', 'none', 'nothing']:
                negated = not negated
                break

            if the.result: count = count + 1

        min = len(left) / 2
        if quantifier == 'most' or quantifier == 'many': the.result = count > min
        if quantifier == 'at least one': the.result = count >= 1
        # todo "at least two","at most two","more than 3","less than 8","all but 8"
        if negated: the.result = not the.result
        if not the.result:
            verbose("List condition not met %s %s %s" % (left, comp, right))

        return the.result
    except IgnoreException as e:
        # debug x #soft message
        error(e)  # exit!
    return False


def check_condition(cond=None, negate=False):
    if cond == True or cond == 'True': return True
    if cond == False or cond == 'False': return False
    if isinstance(cond, ast.BinOp): cond = Compare(left=cond.left, comp=cond.op, right=cond.right)
    if isinstance(cond, Variable): return cond.value
    if cond == None:  # or
        raise InternalError("NO Condition given! %s" % cond)
    if not isinstance(cond, Compare):
        warn("Compare: %s" % cond)
        cond.right=cond.comparators[0] # todo more??
        cond.comp=cond.ops[0] #more??
        # return True  # everything this truthy

    # return cond
    try:
        left = cond.left
        right = cond.right
        comp = cond.comp
        if not comp: return False
        if left and is_string(left): left = left.strip()  # None==None ok
        if right and is_string(right): right = right.strip()  # " a "=="a" !?!?!? NOOO! maybe(why)
        if is_string(comp): comp = comp.strip()
        if is_comparator(comp):
            the.result = do_compare(left, comp, right)
        else:
            the.result = do_call(left, comp, right)

        # if  not the.result and cond:
        #   #if c: a,comp,b= extract_condition c
        #   evals=''
        #   variables.each { |var, val| evals+= "#{var)=#{val);" )
        #   the.result=eval(evals+cond.join(' ')) #dont set the.result here (i.e. while(:.)last_result )
        #
        # if _not: the.result = not the.result
        if negate: the.result = not the.result
        if not the.result:
            verbose("condition not met %s %s %s" % (left, comp, right))
        verbose("condition met %s %s %s" % (left, comp, right))
        return the.result
    except IgnoreException as e:
        # debug x #soft message
        error(e)  # exit!
    return False


# all of 1,2,3
# all even numbers in [1,2,3,4]
# one element in 1,2,3


def element_in():
    must_contain_before(["of", "in"], special_chars)
    # n = noun()
    n = maybe(noun)
    tokens(['in', "of"])
    return n


def get_type(object1):
    todo("get_type")


# return object


def method_dir(left):
    object1 = do_evaluate(left)
    if interpreting():
        return dir(object1)
    return get_type(object1).__dict__


# def condition():
def condition_new():
    context.in_condition = True
    # if contains('all',
    maybe_token('either')
    # c=action_or_expression()
    c = expression()
    # c=algebra() # too weak ^^
    # c=maybe(algebra) or action_or_expression()
    context.in_condition = False
    return c


# def condition_old():
def condition():
    start = pointer()
    brace = maybe_token('(')
    maybe_token('either')
    negated = maybe_token('not')
    if negated: brace = brace or maybe_token('(')
    # a=endNode:(
    quantifier = maybe_tokens(quantifiers)  # vs selector()!
    filters = quantifier and (maybe(element_in) or maybe_tokens(["of", "in"]))  # all words in
    context.in_condition = True
    left = action_or_expression(quantifier)  # OK: algebra!
    if isinstance(left, ast.BinOp):
        left = Compare(left=left.left, comp=left.op, right=left.right)
    if starts_with("then"):
        if quantifier in negative_quantifiers:
            return not left
        return left
    comp = use_verb = maybe(verb_comparison)  # run like , contains
    if not use_verb: comp = maybe(comparation)
    # allow_rollback # upto maybe(where)?
    if comp: right = action_or_expression(None)
    if brace: _(')')
    context.in_condition = False
    if not comp: return left
    negate = negated  # (negated or _not) and not (negated and _not) << where did "_not" go???
    # context.in_condition=False # WHAT IF raised !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!??????!
    # 1,2,3 are smaller 4  VS 1,2,4 in 3
    if isinstance(left, list) and not isinstance(right, list):  # and not maybe(lambda: comp in method_dir(left))
        quantifier = quantifier or "all"
    # if not comp: return  negate ?  not a : a
    cond = Compare(left=left, comp=comp, right=right)
    if interpreting():
        if quantifier:
            if negate:
                return (not check_list_condition(quantifier, left, comp, right))
            else:
                return check_list_condition(quantifier, left, comp, right)
        if negate:
            return (not check_condition(cond))
        else:
            return check_condition(cond)  # None
    else:
        return cond
    # return Condition.new left:a,cmp:comp,right:b
    # if not context.use_tree: return start - pointer()
    # if context.use_tree: return parent_node()


# @Starttokens('(')
#  SEE ALGEBRA!
def condition_tree(recurse=True):
    brace = maybe_token('(')
    maybe_token('either')  # todo don't match 'either of'!!!
    negate = maybe_token('neither')
    if brace:
        c = condition_tree(False)
    else:
        c = condition()
    cs = [c]  # lamda hack

    def lamb():
        op = tokens(['and', 'or', 'nor', 'xor', 'nand', 'but'])
        if recurse: c2 = condition_tree(False)
        if not interpreting(): return current_node  # or context.use_tree
        if op == 'or': cs[0] = cs[0] or c2
        # if op=='or' RUBY BUG!?!?!: NIL c = c or c2
        # if op=='and'  or  op=='but': c =c and c2
        if op == 'and' or op == 'but': cs[0] = cs[0] and c2
        if op == 'nor': cs[0] = cs[0] and not c2
        return cs[0] or False

    star(lamb)
    if brace: _(')')
    return cs[0]


def otherwise():
    maybe_newline()
    must_contain(['else', 'otherwise'])
    pre = maybe_tokens(['else', 'otherwise'])
    maybe_token(':')
    e = expression()
    not pre or maybe_tokens(['else', 'otherwise']) and newline()  # suffix style: "return 1 otherwise"
    return e


# todo  I hate to :.
def loveHateTo():
    maybe_tokens(['would', "wouldn't"])
    maybe_tokens(['do', 'not', "don't"])
    tokens(['want', 'like', 'love', 'hate'])
    return _('to')


def gerundium():
    return the.token.endswith("ing")


# verb()
# return token('ing')


def verbium():
    return maybe(comparison_word) or verb() and adverb()  # be or have or


def resolve_netbase(n):
    return n  # Todo


def the_noun_that():
    maybe(_the)
    n = noun()
    if not n: raise_not_matching("no noun")
    if the.token == "that":
        criterium = star(selector)  # todo: apply ;)
        if criterium and interpreting():
            n = list(filter(n, criterium))
        else:
            n = resolve_netbase(n)
    else:
        if n in the.variables:
            return the.variables[n]
        # if n in the.methods:
        #     return the.methods[n]
        if n in the.classes:
            return the.classes[n]
        raise_not_matching("only 'that' filtered nouns for now!")
        raise Exception("Undefined: " + n)
    return n


# def plural:
#  word #todo
#


def const_defined(c):
    if c == "Pass": return False
    if c in context.moduleClasses:
        return True
    # SLOW: LIVE
    # modules = dict(sys.modules)  # dictionary changed size during iteration
    # for module in modules:
    #     for name, obj in inspect.getmembers(modules[module]):
    #         try:
    #             if name == c and inspect.isclass(obj):
    #                 return obj
    #         except Exception as e:
    #             raise e
    return False


def classConstDefined():
    try:
        c = word().capitalize()
        if not const_defined(c): raise NotMatching("Not a class Const")  # return False
    except IgnoreException:  # (AttributeError,NameError ) as e:
        raise NotMatching()
    if interpreting(): c = do_get_class_constant(c)
    if not c:        raise NotMatching()
    return c


def mapType(x0):
    x = x0.lower()
    if x == "char": return xchar
    if x == "character": return xchar
    if x == "letter": return xchar
    # if x == "class": return type #DANGER!
    if x == "type": return type
    if x == "word": return str  # DANGER!
    if x == "int": return int
    if x == "integer": return int
    if x == "long": return int
    if x == "double": return int
    if x == "str": return str
    if x == "string": return str
    if x == "real": return float
    if x == "float": return float
    if x == "number": return float
    if x == "fraction": return float
    if x == "rational": return float
    if x == "hash": return dict
    if x == "hashmap": return dict
    if x == "hashtable": return dict
    if x == "dict": return dict
    if x == "dictionary": return dict
    if x == "map": return dict
    if x == "object": return object  # vs dict See JS for goodness!
    if x == "array": return list
    if x == "set": return set
    if x == "list": return list
    if x == "tuple": return tuple  # list

    # Put named parameters somewhere else!
    if x == "name": return str
    if x == "label": return str
    if x == "length": return int
    if x == "label": return str
    if x == "class": raise NotMatching("class is not a type")  # ?
    raise NotMatching("not a known type:" + x)  # ?
    # raise UnkownType(x)
    # if x == "size": return int or tuple
    return x0


def typeNameMapped():
    x = typeName()
    if x in the.classes:
        return the.classes[x]
    return mapType(x)


def typeName():
    return maybe_tokens(type_names) or classConstDefined()


def gerund():
    ## global the.string
    # 'stinking'
    match = re.search(r'^\s*(\w+)ing', the.string)
    if not match: return False
    the.string = the.string[match.end():]
    pr = maybe_tokens(prepositions)  # wrapped in
    if pr: maybe(endNode)
    current_value = match.group(1)
    return current_value


def postjective():  # 4 squared , 'bla' inverted, buttons pushed in, mail read by James):
    ## global the.string
    match = re.search(r'^\s*(\w+)ed', the.string)
    if not match: return False
    the.string = the.string[match.end():]
    pr = not checkEndOfLine() and maybe_tokens(prepositions)  # wrapped in
    if pr and not checkEndOfLine(): maybe(endNode)  # silver
    current_value = match.group(1)
    return current_value


# TODO: big cleanup!
# see resolve, eval_string,  do_evaluate, do_evaluate_property, do_s


def get_class(x):
    if isinstance(x, Variable): return x.type
    return type(x)  # unless AST/overwritten etc!!!


def do_evaluate_property(attr, node):
    # todo: REFLECTION / eval NODE !!!
    if not attr: return False
    verbose("do_evaluate_property '" + str(attr) + "' in " + str(node))
    the.result = None  # delete old!
    if attr in dir(node):  # y.__att
        return node.__getattribute__(attr)
    if attr in ['type', 'class', 'kind']:
        return get_class(node)
    if isinstance(node, list):
        return [do_evaluate_property(attr, x) for x in node]
    if isinstance(attr, _ast.AST):
        return todo("do_evaluate_property")
    try:
        return getattr(node,attr)
    except:
        verbose("do_send(node,attr) failed")

    the.result = method_call(node,attr) #do_call(node, attr)
    # try:
    #     the.result = method_call(node, attr)  # do_call(node, attr)
    #     return the.result
    # except:
    #     verbose("do_send(node,attr) failed")
    #     return findMethod(node,attr)


# resolve
def do_evaluate(x, _type=None):
    #  if not interpreting():   return emitters.kast_emitter.wrap_value(val) # LATER!!
    if x == ZERO or x == 0: return 0
    if x == TRUE: return True
    if x == FALSE: return FALSE  # False NOT HERE! WHERE?
    if x == NILL: return None
    # if x == 'pi': return math.pi
    # if x == 'tau': return 2*math.pi
    # if isinstance(x, ast.Unifuck): return x.s
    # if isinstance(x, nodes.Variable): return do_evaluate(x.value)
    if isinstance(x, Variable): return do_evaluate(x.value)
    if isinstance(x, Argument): return do_evaluate(x.value)  # args.value
    if not x: return None

    #todo don't eval twice! var(x='c')->string('c')->var['c'] ... ;)
    # x.evaluated=True

    if isinstance(x, ast.Name): x=x.id
    if isinstance(x, collections.Callable): return x  # x()  Whoot
    if isinstance(x, type): return x
    if isinstance(x, ast.Num): return x.n
    if isinstance(x, ast.Str): return x.s

    if isinstance(x, extensions.File): return x.to_path
    # if is_string(x): return x
    # and x.index(r'')   :. notodo :.  re.search(r'^\'.*[^\/]$',x): return x
    if isinstance(x, list) and len(x) == 1: return do_evaluate(x[0])
    if isinstance(x, list): return xlist(map(do_evaluate, x))
    # if maybe(x.is_a) Array: return x.to_s
    if is_string(x):
        if _type and isinstance(_type, extensions.Numeric): return float(x)
        if not isinstance(x,xstr) and x in the.variableValues:
            return the.variableValues[x]
        if match_path(x): return do_evaluate(x)
        if _type and _type == float: return float(x)
        if _type and _type == int: return int(x)
        return x
    # if isinstance(x, extensions.Method): return x.call  #Whoot
    if not interpreting(): return x
    if isinstance(x, kast.AST): return pyc_emitter.eval_ast([x])  # shouldn't happen here?
    if isinstance(x, list) and isinstance(x[0], kast.AST): return pyc_emitter.eval_ast(x)
    # if x == True or x == False: return x
    return x  # DEFAULT!


# except (TypeError, SyntaxError)as e:
#     print("ERROR #{e) in do_evaluate #{x)")
#     raise e, None, sys.exc_info()[2]
#     # return x


def self_modifying(method):
    if callable(method): method = method.__name__
    if is_string(method): return method == 'increase' or method == 'decrease' or method.endswith("!")
    return False


#
# def self_modifying(method):
#     EnglishParser.self_modifying(method)  # -lol

def is_math(method):
    ok = method in operators
    return ok


def do_math(a0, op, b0):
    a = do_evaluate(a0) or 0
    b = do_evaluate(b0) or 0
    if isinstance(a, Variable):
        a = a.value
    if isinstance(b, Variable):
        b = b.value
    a = xx(a)
    b = xx(b)
    # a = float(a)
    # b = float(b)
    if op == '+': return a + b
    if op == 'plus': return a + b
    if op == 'add': return a + b
    if op == '-': return a - b
    if op == 'minus': return a - b
    if op == 'substract': return a - b
    if op == '/': return a / float(b)
    if op == 'devided': return a / float(b)
    if op == 'devided by': return a / float(b)
    if op == '%': return a % b
    if op == 'modulo': return a % b
    if op == '*': return a * b
    if op == 'times': return a * b
    if op == 'multiplied by': return a * b

    if op == '**': return a ** b
    if op == 'to the power of': return a ** b
    if op == 'to the power': return a ** b
    if op == 'to the': return a ** b
    if op == 'power': return a ** b
    if op == 'pow': return a ** b
    if op == '^^': return a ** b
    if op == '^': return a ** b
    # if op == '^': return a ^ b
    if op == 'xor': return a ^ b
    if op == 'and': return a and b or FALSE
    if op == '&&': return a and b
    if op == 'but not':
        return a and not b
    if op == 'nor':
        return not a and not b
    if op == 'neither':
        return not a and not b
    if op == 'but':
        if isinstance(a, list):
            return a.remove(b)
        else:
            return a and b
    # if op == '&': return a and b
    if op == '&': return a & b
    if op == '|': return a | b
    if op == '||': return a | b
    if op == 'or': return a or b
    if op == '<': return a < b
    if op == 'smaller': return a < b
    if op == '>': return a > b
    if op == 'bigger': return a > b
    if op == '<=': return a <= b
    if op == '>=': return a >= b
    if op == '==': return a == b
    if op == '=': return a == b
    if op == '~': return regex_match(a, b)
    if op == '~=': return regex_match(a, b)
    if op == '=~': return regex_match(a, b)
    if op == '~~': return regex_match(a, b)
    if op == 'is': return a == b  # NOT the same as python a is b:
    if op == 'be': return a == b
    if op == 'equal to': return a == b
    if op == '===': return a is b
    if op == 'is identical': return a is b  # python ===
    if op == 'is exactly': return a is b
    if op == 'same as': return a == b  # weaker than 'exactly'!
    if op == 'the same as': return a == b
    if op == 'equals': return a == b
    if op == '!=': return a != b
    if op == '≠': return a != b
    if op == 'is not': return a != b
    if op == 'isn\'t': return a != b
    if op in class_words: return isinstance(a, b) or is_a(a, b)
    if op in subtype_words: return issubclass(a, b) or is_(a, b)
    raise Exception("UNKNOWN OPERATOR " + op)


def is_bound(method):
    _is_bound = 'im_self' in dir(method) and method.__self__
    _is_bound = _is_bound or 'bound' in str(method)  # hack
    return _is_bound


# return method.__self__ is not None   # NO py3
# return hasattr(m, '__self__')
# the new synonym for im_self is __self__, and im_func is also available as __func__.


def is_unbound(method):
    return hasattr(method, 'im_class') and method.__self__ is None


def instance(bounded_method):
    return bounded_method.__self__


def findMethod(obj0, method0, args0=None, bind=True):
    method = method0
    if isinstance(method, collections.Callable): return method
    if isinstance(method, FunctionDef): return method  # .body is AST!
    if not obj0 and isinstance(args0, list) and len(args0) == 1:
        obj0 = args0[0]
    _type = type(obj0)
    if (isinstance(obj0, Variable)):
        _type = obj0.type
        obj0 = obj0.value
    if (isinstance(obj0, Argument)):
        _type = obj0.type
        obj0 = obj0.value
    if (isinstance(args0, Argument)):
        # _type = obj0.type
        args0 = args0.value
    if method in the.methods:
        return the.methods[method]
    if method in locals():
        return locals()[method];
    if method in globals():
        return globals()[method];
    if method in dir(obj0):
        return getattr(obj0, method)  # NOT __getattribute__(name)!!!!
    if _type in context.extensionMap:
        ex = context.extensionMap[_type]
        if method in dir(ex):
            method = getattr(ex, method)  # NOT __getattribute__(name)!!!!
            if bind:
                method = method.__get__(obj0, ex)  # bind!
            return method
    # if method in context.extensionMap and not obj0:
    #     return the.extensionMap[method]
    if isinstance(obj0, type) and method in obj0.__dict__:
        method = obj0.__dict__[method]  # class
        if bind:
            method.__get__(None, obj0)  # The staticmethod decorator wraps your class and implements a dummy __get__
        return method
    # elif "im_class" in
    #     method = method.__get__(args[0],method.im_class)
    # that returns the wrapped function as function and not as a method
    # if is_string(method):
    #     raise_not_matching("NO such METHOD %s" % method)
    # if not is_string(method):
    #     raise_not_matching("NO such METHOD %s" % method)
    if not isinstance(method, collections.Callable) and isinstance(args0, list) and len(
            args0) > 0:  # TRY TO WORK ARGUMENT WISE!
        function = findMethod(obj0 or args0[0], method0, args0[0], bind=False)
        return function
    # def map_list(xs,*xss):
    #         if xs and xss: xs=[xs]+list(xss)
    #         if not xs:xs=xss
    #         return map(function,xs)
    #     return map_list
    return method


# if callable(method):method(args)


def align_function_args(args, clazz, method):
    newArgs = {}
    if isinstance(args, (dict, tuple, list)) and len(method.arguments) == 1:
        return {method.arguments[0].name: args}

    if not isinstance(args, (dict, list)):
        args = [args]
    for param in method.arguments:
        if isinstance(args, dict):
            if param.name in args:
                param.value = args[param.name]
            elif param.default:
                param.value = param.default
            else:
                raise Exception("MISSING ARGUMENT %s" % param.name)
        elif isinstance(args, list):
            if param.position < len(args):
                param.value = args[param.position]
            elif param.default:
                param.value = param.default
            else:
                raise Exception("MISSING ARGUMENT %s" % param.name)
        newArgs[param.name] = param.value
    return newArgs


# return method.arguments


def eval_args(args):
    if not args: return []  # None
    if isinstance(args,Argument):
        args=args.value
    # if args and is_string(args): args = xstr(args).replace_numerals()
    if isinstance(args, (list, tuple)):
        args = list(map(do_evaluate, args))
    elif isinstance(args, dict):
        pass  # OK
    else:
        args = [do_evaluate(args)]
    # else:args=do_evaluate(args)
    return args


# Similar to prepare_named_args for block ast eval!
def align_args(args, clazz, method):
    # selfmodifying = self_modifying(method)
    # if selfmodifying: return args  # todo
    is_bound = 'im_self' in dir(method) and method.__self__
    if is_bound:
        if method.__self__ == args: args = None
        if (args and isinstance(args, list) and len(args) > 0):
            if method.__self__ == args[0]: args.remove(args[0])
        return args
    try:
        if isinstance(method, FunctionDef):
            expect = len(method.args)
        # method = findMethod(clazz, method)
        else:
            margs, varargs, varkw, defaults = inspect.getargspec(method)
            expect = len(margs) - (defaults and len(defaults) or 0) + (varkw and len(varkw) or 0)
        if not isinstance(args, (xlist, list, dict)):
            args = [args]
        if isinstance(args, list):
            if (len(args) > expect and len(args) > 1):
                args = [args]
        if isinstance(method, FunctionDef):
            for i in range(expect):
                aa = method.args[i]
                if isinstance(aa, Argument):
                    if aa.name in args:
                        the.params[aa] = args[aa.name]
                        the.params[aa.name] = args[aa.name]
                    else:
                        the.params[aa] = args[i]
                        the.params[aa.name] = args[i]
                elif aa in args:
                    the.params[aa] = args[aa]
                else:
                    the.params[aa] = args[i]
            args = the.params
        return args
    except:
        return args


def call_unbound(method, args, number_of_arguments):
    if isinstance(args, dict):
        try:
            the.result = method(**args) or NILL
        except:
            the.result = method(*list(args.values())) or NILL
    if isinstance(args, list) or isinstance(args, tuple):
        if is_unbound(method) and len(args) == 1 and number_of_arguments == 1:
            import types
            arg0 = args[0]
            obj_type = type(arg0)
            if (method.__self__.__class__ in list(extensionMap.values())):
                the.result = method(xx(arg0)) or NILL
            else:
                # the.result = method(arg0) or NILL
                bound_method = types.MethodType(method, obj_type, xx(args[0]))
                # bound_method = method.__get__(args[0], obj_type) # rebind
                # bound_method.im_self=args[0] # read-only
                the.result = bound_method(args[1:])
            #    TypeError: unbound method invert() must be called with xstr instance as first argument (got str instance instead)
            #    can't solve?
        else:
            if is_bound(method) and len(args) >= 1 and method.__self__ == args[0]:
                args = args[1:]
            try:
                the.result = method(*args) or NILL
            except:
                the.result = method() or NILL
            #     the.result = method(args) or NILL
    else:
        the.result = method(args) or NILL
    return the.result


# INTERPRET only,  todo cleanup method + argument matching + concept
def do_call(obj0, method0, args0=[]):
    if not method0: raise Exception("NO METHOD GIVEN %s %s" % (obj0, args0))  # return False
    if not interpreting(): return FunctionCall(func=method0, arguments=args0, object=obj0)
    if method0 in be_words and obj0 == args0: return True  # stupid unnecessary shortcut

    # try direct first!
    # args0=map(do_evaluate,args0)
    args = eval_args(args0)
    method = findMethod(obj0, method0, args)
    method_name = isinstance(method, collections.Callable) and method.__name__ or method0  # what for??
    # if callable(method): obj = method.owner no such concept in Python !! only as self parameter

    if (method == 'of'): return evaluate_property(args0, obj0)
    # if isinstance(args, list) and isinstance(args[0], Argument): args = args.map(name_or_value)
    is_builtin = type(method) == types.BuiltinFunctionType or type(method) == types.BuiltinMethodType
    # if args and maybe(obj.respond_to) + " " etc!: args=args.strip()
    if self_modifying(method):
        obj = obj0
    else:
        obj = do_evaluate(obj0)

    if isinstance(method,str):# and (method in dir(obj) or method in obj): << wow wieso nicht method in obj??
      try:
        method=obj.__getattribute__(method) # OK!! but not method in dir(obj) ??
      except: pass

    bound = is_bound(method)
    args = align_args(args, obj, method)
    number_of_arguments = has_args(method, obj, not not args)
    is_first_self = first_is_self(method)
    if isinstance(method, FunctionDef):
        the.result = do_execute_block(method.body, args)
        return the.result

    # if (args and args[0] == 'of'):  # and has_args(method, obj)):
    #     if not callable(method) and method in dir(obj):
    #         return obj.__getattribute__(method)
    #     else:
    #         method(args[1])  # square of 7
    debug("CALLING %s %s with %s" % (obj or "", method, args))  # , file=sys.stderr)

    if not args and not isinstance(method, collections.Callable) and method in dir(obj):
        return obj.__getattribute__(method)

    try:
        if not isinstance(method, collections.Callable) and isinstance(args, list):  # TRY TO WORK ARGUMENT WISE!
            def map_list(x):
                function = findMethod(x, method0, None)
                if isinstance(function, FunctionCall):
                    from .emitters import pyc_emitter
                    return pyc_emitter.eval_ast(function, args)
                if not isinstance(function, collections.Callable):
                    raise Exception("DONT KNOW how to apply %s to %s" % (method0, args0))
                return function()

            the.result = list(map(map_list, args))
            verbose("GOT RESULT %s " % (the.result))
            return the.result
    except Exception as e:
        print(e)
        verbose("CAN'T CALL ARGUMENT WISE")

    if not isinstance(method, collections.Callable):
        raise MethodMissingError(type(obj), method, args)

    if is_math(method_name):
        return do_math(obj, method_name, args)
    if not obj:
        if args and number_of_arguments > 0:
            the.result = call_unbound(method, args, number_of_arguments)
        else:
            the.result = method()
    elif not args or number_of_arguments == 0 or number_of_arguments == 1 and is_first_self:
        if bound or is_builtin:
            the.result = method() or NILL
        else:
            the.result = method(obj) or NILL
    elif has_args(method, obj, True):
        if bound or is_builtin:
            call_unbound(method, args, number_of_arguments)
        else:
            # try:
            if (isinstance(args, list) and len(args) == 1):
                args = args[0]
            the.result = method(obj, args) or NILL
        # except: the.result = method(args) or NILL

        # the.result = method(obj, *args) or NILL
        # the.result = method([obj]+args) or NILL try!
    else:
        the.result = MethodMissingError

    # todo: call FUNCTIONS!
    # puts object_method.parameters #todo MATCH!

    # => selfModify todo
    #  OK, done elsewhere!
    # if (obj0 or args0) and self_modifying(method):
    #     name = str(obj0 or args0)  # .to_sym()  #
    #     the.variables[name].value = the.result  #
    #     the.variableValues[name] = the.result

    # todo : None OK, error not!
    # if the.result == NoMethodError: msg = "ERROR CALLING #{obj).#{method)(): #{args))"
    if the.result == MethodMissingError: raise MethodMissingError(obj, method, args)
    # raise SyntaxError("ERROR CALLING: NoMethodError")
    verbose("GOT RESULT %s " % (the.result))
    return the.result


def do_compare(a, comp, b):
    a = do_evaluate(a)  # NOT: "a=3; 'a' is 3" !!!!!!!!!!!!!!!!!!!!   Todo ooooooo!!
    b = do_evaluate(b)
    if isinstance(b, float) and re.search(r'^\+?\-?\.?\d', str(a)): a = float(a)
    if isinstance(a, float) and re.search(r'^\+?\-?\.?\d', str(b)): b = float(b)
    if isinstance(b, int) and re.search(r'^\+?\-?\.?\d', str(a)): a = int(a)  # EEK PHP STYLE !? REALLY??
    if isinstance(a, int) and re.search(r'^\+?\-?\.?\d', str(b)): b = int(b)  # EEK PHP STYLE !? REALLY??
    if is_string(comp): comp = comp.strip()
    if comp == 'smaller' or comp == 'tinier' or comp == 'comes before' or comp == '<' or isinstance(comp, ast.Lt):
        return a < b
    elif comp == 'bigger' or comp == 'larger' or comp == 'greater' or comp == 'comes after' or comp == '>' or isinstance(
            comp, ast.Gt):
        return a > b
    elif comp == 'smaller or equal' or comp == '<=' or isinstance(comp, ast.LtE):
        return a <= b
    elif comp == 'bigger or equal' or comp == '>=' or isinstance(comp, ast.GtE):
        return a >= b
    elif comp in ['!=', 'is not'] or isinstance(comp, ast.NotEq):
        return a == b
    elif comp in ['in', 'element of'] or isinstance(comp, ast.In):
        return a in b
    elif comp in subtype_words:
        return issubclass(a, b)
    elif comp in class_words:
        if a == b or isinstance(a, b): return True
        if isinstance(a, Variable): return issubclass(a.type, b) or isinstance(a.value, b)
        if isinstance(a, type): return issubclass(a, b)  # issubclass? a bird is an animal OK
        return False
    elif comp == 'equal' or comp == 'the same' or comp == 'the same as' or comp == 'the same as' or comp == '=' or comp == '==':
        return a == b  # Redundant
    elif comp == 'not equal' or comp == 'not the same' or comp == 'different' or comp == '!=' or comp == '≠':
        return a != b  # Redundant
    elif comp in be_words or isinstance(comp, (ast.Eq, kast.Eq)) or 'same' in comp:
        return a == b or isinstance(b, type) and isinstance(a, b)
    else:
        try:
            return a.send(comp, b)  # raises!
        except:
            error('ERROR COMPARING ' + str(a) + ' ' + str(comp) + ' ' + str(b))
        # return a.send(comp + '?', b)


def drop_plural(x):
    if x.endswith("s"): return x[:-1]
    return x


# all floats in xs
@Starttokens(['every', 'all', 'those'])
def liste_selector():
    if context.in_list: return False
    tokens(['every', 'all', 'those'])
    typ = typeName()
    tokens(['in', 'of'])
    xs = maybe(variable) or liste()
    if interpreting():
        if isinstance(xs, Variable): xs = xs.value
        print("FILTERING %s in %s" % (typ, xs))
        xs = list(filter(lambda x: is_a(x, typ), xs))  # except xs
        print(xs)
        return xs
    return todo("filter list")


def selectable():
    must_contain(['that', 'whose', 'which'])
    maybe_tokens(['every', 'all', 'those'])
    xs = do_evaluate(known_variable()) or endNoun()
    s = maybe(selector)  # right=xs, left implicit! (BAD!)
    if interpreting(): xs = list(filters(xs, s))  # except xs
    return xs


# see selectable
def filters(liste, criterion):
    # global right, left, comp
    if not criterion: return liste
    mylist = do_evaluate(liste)
    # if not isinstance(mylist, mylist): mylist = get_iterator(mylist)
    if context.use_tree:
        method = criterion['comparative'] or criterion['comparison'] or criterion['adjective']
        args = criterion['endNode'] or criterion['endNoun'] or criterion['expressions']
    else:
        method = criterion()  # comp or ??
        args = right
    return mylist.select(lambda i: do_compare(i, method, args))  # REPORT BUGS!!! except False


def ranger(a=None):
    if context.in_params or context.in_args:
        return False  # add 1 to 3 != add [1,2,3]
    must_contain('to')
    maybe_token('from')
    a = a or number()
    _('to')
    b = number()
    if context.use_tree:
        return kast.call('range', [a, ast.Num(b + 1)])
    return list(range(a, b + 1))  # count from 1 to 10 => 10 INCLUDED, thus +1!


# #  or  endNode have adjective  or  endNode attribute  or  endNode verbTo verb # or endNode auxiliary gerundium
def endNode():
    raiseEnd()
    # maybe( plural) or
    x = maybe(liste) or \
        maybe(fileName) or \
        maybe(linuxPath) or \
        maybe(quote) or \
        maybe(regexp) or \
        maybe(lambda: maybe(article) and typeNameMapped()) or \
        maybe(simpleProperty) or \
        maybe(evaluate_property) or \
        maybe(selectable) or \
        maybe(liste_selector) or \
        maybe(known_variable) or \
        maybe(article) and word() or \
        maybe(ranger) or \
        maybe(value) or \
        maybe(typeNameMapped) or \
        maybe(variable) or \
        maybe_token('a') or \
        raise_not_matching("Not an endNode")  # "+pointer_string())
    po = maybe(postjective)  # inverted
    if po and interpreting(): x = do_call(x, po, None)
    return x


def endNoun(included=None):
    if not included:
        included = []
    maybe(article)
    adjs = star(adjective)  # first second :. included
    obj = maybe(lambda: noun(included))
    if not obj:
        if adjs and adjs.join(' ').is_noun:
            return adjs.join(' ')
        else:
            raise NotMatching('no endNoun')

    if context.use_tree: return obj
    # return adjs.to_s+" "+obj.to_s # hmmm  hmmm
    if adjs and isinstance(adjs, list):
        todo("adjectives in endNoun")
        return ' ' + " ".join(adjs) + " " + str(obj)  # hmmm  W.T.F.!!!!!!!!!!!!!?????
    return str(obj)


def start_xml_block(type):
    _('<')
    if type:
        _(type)
    else:
        type = word()
    _('>')
    return type


def check_end_of_statement():
    return checkEndOfLine() or the.token == ";" or maybe_tokens(done_words)


# End of block also acts as end of statement but not the other way around!!
def end_of_statement():
    return beginning_of_line() or maybe_newline() or starts_with(done_words) \
           or the.current_offset == 0 or the.previous_word == ';' or the.previous_word == '\n' or token(';',
                                                                                                        'end_of_statement')


# consume ";", but DON'T consume done_words here!


def english_to_math(s):
    s = xstr(s)
    s = s.replace_numerals()
    s = s.replace(' plus ', '+')
    s = s.replace(' minus ', '-')
    s = s.replace(r'(\d+) multiply (\d+)', "\\1 * \\2")
    s = s.replace(r'multiply (\d+) with (\d+)', "\\1 * \\2")
    s = s.replace(r'multiply (\d+) by (\d+)', "\\1 * \\2")
    s = s.replace(r'multiply (\d+) and (\d+)', "\\1 * \\2")
    s = s.replace(r'divide (\d+) with (\d+)', "\\1 / \\2")
    s = s.replace(r'divide (\d+) by (\d+)', "\\1 / \\2")
    s = s.replace(r'divide (\d+) and (\d+)', "\\1 / \\2")
    s = s.replace(' multiplied by ', '*')
    s = s.replace(' times ', '*')
    s = s.replace(' divided by ', '/')
    s = s.replace(' divided ', '/')
    s = s.replace(' with ', '*')
    s = s.replace(' by ', '*')
    s = s.replace(' and ', '+')
    s = s.replace(' multiply ', '*')
    return s


def evaluate_index(obj=None):
    if not obj:
        should_not_start_with('[')
        must_contain(['[', ']'])
        obj = maybe(variable) or endNode()
    _('[')
    index = endNode()
    _(']')
    set = maybe_token('=') or None
    if set: set = expression()
    # if interpreting(): the.result=v.send :index,i
    # if interpreting(): the.result=do_send v,:[], i
    # if set and interpreting(): the.result=do_send(v,:[]=, [i, set])
    if interpreting():
        if set != None:  # and interpreting():
            if isinstance(obj, Variable):
                the.result = obj.value[index] = set
            else:
                the.result = va[index] = set  # va.__index__(i, set)
        else:
            va = do_evaluate(obj)
            the.result = va[index]  # va.__index__(i)  # old value
    else:
        the.result = Subscript(value=get(obj), slice=Index(index), ctx=Load())
        if set != None:  # and interpreting():
            the.result = Assign([Subscript(get(obj), Index(index), Store())], set)
    return the.result


def evaluate_property(x=None):
    maybe_token('all')  # list properties (all files in x)
    must_contain_before(['of', 'in', '.'], '(')
    # raiseNewline()
    x = x or endNoun(included=type_keywords)
    tokens(['of', 'in'])
    y = expression()
    if not interpreting(): return parent_node()
    try:  # interpret !:
        the.result = do_evaluate_property(x, y)
    except SyntaxError as e:
        verbose("ERROR do_evaluate_property")
    # if not the.result: the.result=jeannie all
    # except Exception as e:
    #     verbose("ERROR do_evaluate_property")
    #     verbose(e)
    #     error(e)
    #     error(traceback.extract_stack())
    # if not the.result: the.result=jeannie all

    return the.result


def jeannie(request):
    jeannie_api = 'https://weannie.pannous.com/api'
    params = 'login=test-user&out=simple&input='


# if not current_value: raise "empty evaluation"
# download(jeannie_api+params+URI.encode(request))


@Starttokens(eval_keywords)
def evaluate():
    tokens(eval_keywords)
    no_rollback()
    the_expression = rest_of_line
    try:
        the.result = eval(english_to_math(the_expression))  # if not the.result:
    except:
        the.result = jeannie(the_expression)
    return the.result


def svg(x):
    svg.append(x)


#
# def load_history_why(? history_file):
#     histSize = 100
#     try:
#       history_file = File::expand_path(history_file)
#       if File::maybe(lambda:exists(history_file))
#         lines = IO::readlines(history_file).collect (lambda line: line.chomp )
#         Readline::HISTORY.push(*lines)
#
#       Kernel::at_exit do
#         lines = Readline::HISTORY.to_a.reverse.uniq.reverse
#         if len(lines) > histSize: lines = lines[-histSize, histSize]
#         File::open(history_file, File::WRONLY|File::CREAT|File::TRUNC) (lambda io: io.print(lines.join("\n") ))
#
#     except Exception as e:
#       print("Error when configuring history: #{e)")
#



def be():
    return tokens(be_words)


def modifier(): return tokens(modifier_words)


def attribute(): return tokens(attributes)


def preposition(): return tokens(prepositions)


def pronoun(): return tokens(pronouns)


def nonzero(): return tokens(nonzero_keywords)


def wordnet_is_adverb():
    pass


def adverb():
    no_keyword_except(adverbs)
    found_adverb = maybe_tokens(adverbs)
    if not found_adverb: raise_not_matching("no adverb")
    return found_adverb


def verb():
    no_keyword_except(remove_from_list(system_verbs, be_words))
    found_verb = maybe_tokens(xlist(other_verbs + system_verbs + the.verbs) - be_words - ['do'])  # verbs,
    if not found_verb: raise_not_matching("no verb")
    return found_verb


def adjective():
    return tokens(the.adjectives)


# if not found_verb: raise_not_matching("no verb")


def quote():
    raiseEnd()
    if the.current_type == _token.STRING or the.token[0] == "'" or the.token[0] == '"':
        the.result = the.token[1:-1]
        if not interpreting():
            the.result = kast.Str(s=the.result)
        next_token()
        return xstr(the.result)
    raise_not_matching("no quote")


def maybe_param(method, classOrModule):
    param = maybe(true_param)
    if param:
        return param.value or param
    method = findMethod(classOrModule, method)
    import inspect

    args, varargs, varkw, defaults = inspect.getargspec(method)
    param = maybe_tokens(varkw + defaults)
    return param


def true_param():
    vars = list(the.params.keys())
    if (len(vars) == 0): raise NotMatching()
    v = tokens(vars)
    v = the.params[v]  # why maybe(later)
    return v


def known_variable(node=True):
    # must_not_start_with(the.method_names)
    vars = list(the.variables.keys())
    if (len(vars) == 0): raise NotMatching()
    v0 = tokens(vars)
    if not interpreting():
        return name(v0)
    v = the.variables[v0]  # why maybe(later)
    # if interpret #LATER!: variableValues[v]
    # if node and not interpreting(): return kast.name(v)
    return v


# for v in the.variables.keys:
#  if the.string.maybe(start_with) v:
#    var=token(v)
#    return var
#
#
# tokens(the.variables_list # todo: remove (in endNodes, selectors,:.))


def noun(include=[]):
    a = maybe_tokens(articles)
    if not a: should_not_start_with(xlist(keywords) - include)
    if not context.use_wordnet:
        return word(include)
    if the.token in the.nouns:
        return the.token
    raise_not_matching("noun")


def bla():
    return tokens(['hey'])  # ,'here is')


def _the():
    return tokens(articles)


def the_():
    maybe_tokens(articles)


def fileName():
    raiseEnd()
    match = is_file(the.string, False)
    if match:
        path = match[0]
        path = path.gsub(r'^/home', "/Users") if stem.util.system.is_mac() else path
        path = extensions.File(path)
        next_token()
        the.current_value = path
        return path
    return False


def linuxPath():
    raiseEnd()
    match = match_path(the.string)
    if match:
        path = match[0]
        path = path.gsub(r'^/home', "/Users") if stem.util.system.is_mac() else path
        path = extensions.Dir(path)  # except path
        next_token()
        the.current_value = path
        return path
    return False


def loops():
    return maybe(repeat_every_times) or \
           maybe(repeat_n_times) or \
           maybe(n_times_action) or \
           maybe(action_n_times) or \
           maybe(for_i_in_collection) or \
           maybe(repeat_with) or \
           maybe(while_loop) or \
           maybe(looped_action) or \
           maybe(looped_action_until) or \
           maybe(repeat_action_while) or \
           maybe(as_long_condition_block) or \
           maybe(forever) or \
           raise_not_matching("Not a loop")


# todo merge for_i_in_collection
@Starttokens(['repeat with'])
def repeat_with():
    maybe_token('for') or _('repeat') and _('with')
    no_rollback()
    v = variable()
    _('in')
    c = collection()
    b = action_or_block()
    if interpreting():
        for i in c:
            do_execute_block(b, {v: i})
        return the.result
    return kast.For(target=v, iter=c, body=b)


#     'iter',
#     'body',
#     'orelse',)


@Starttokens(['while', 'as long as'])
def while_loop():
    maybe_tokens(['repeat'])
    tokens(['while', 'as long as'])
    no_rollback()
    dont_interpret()
    c = condition()
    allow_rollback()
    maybe_tokens(['repeat'])  # keep gerunding
    maybe_tokens(['then'])  # ,':'
    dont_interpret()
    b = action_or_block()  # Danger when interpreting it might contain conditions and breaks
    r = False
    adjust_interpret()
    if not interpreting():
        return kast.While(test=c, body=b)
    while (check_condition(c)):
        r = do_execute_block(b)
    return r  # or OK


@Starttokens(['until'])  # , 'as long as'])
def until_loop():
    maybe_tokens(['repeat'])
    tokens(['until', 'as long as'])
    dont_interpret()
    no_rollback()
    c = condition()
    maybe_tokens(['repeat'])
    b = action_or_block()  # Danger when interpreting it might contain conditions and breaks
    r = False
    if interpreting():
        while (not check_condition(c)):
            r = do_execute_block(b)

    return r


# beep every 4 seconds
# every 4 seconds beep
# at 5pm send message to john
# send message to john at 5pm
def repeat_every_times():
    must_contain(time_words)
    dont_interpret()  # 'cause later
    maybe_tokens(['repeat'])
    action_or_block()
    interval = datetime()


# event=Event(interval:interval,event:b)


def repeat_action_while():
    _('repeat')  # ,'do'
    if re.search(r'\s*while', the.token):
        raise_not_matching("repeat_action_while != repeat_while_action", the.string)
    b = action_or_block()
    _('while')
    c = condition()
    if not interpreting():
        return kast.While(test=c, body=b)
    while check_condition(c):
        the.result = do_execute_block(b)
    return the.result


# todo: merge with looped_action_until
def looped_action():
    must_not_start_with('while')
    must_contain(['as long as', 'while'])
    dont_interpret()
    maybe_tokens(['do', 'repeat'])
    a = action()  # or semi-block
    tokens(['as long as', 'while'])
    c = condition()
    r = False
    if not interpreting(): return a
    if interpreting():
        while (check_condition(c)):
            r = do_execute_block(a)
    return r


def looped_action_until():
    must_contain('until')
    b = maybe_tokens(['do', 'repeat'])
    dont_interpret()
    a = action_or_block('until') if b else action()
    _('until')
    c = condition()
    r = False
    if not interpreting(): return a
    if interpreting():
        while (not check_condition(c)):
            r = do_execute_block(a)
    return r


def is_number(n):
    return xstr(n).parse_number() != 0  # hum


# notodo: LTR parser just here!
# say hello 6 times   #=> (say hello 6) times ? give up for now
# say hello 6 times 5 #=> hello 30 ??? SyntaxError! say hello (6 times 5)
def action_n_times(a=None):
    must_contain('times')
    dont_interpret()
    maybe_tokens(['do'])
    # maybe_tokens "repeat"
    a = a or action()
    # ws=a.join(' ').split(' ') except [a]

    # if is_number ws[-1] # greedy action hack "say hello 6" times:
    #   a=ws[0..-2]
    #   n=ws[-1]

    # if not n:
    n = number()
    _('times')
    end_block()
    if interpreting():
        int(n).times(lambda: do_evaluate(a))
    else:
        todo("action_n_times")
    return a


def n_times_action():
    # global the.result
    must_contain('times')
    n = number()  # or int_variable
    _('times')
    no_rollback()
    maybe_tokens(['do', 'repeat'])
    dont_interpret()
    a = action_or_block()
    if interpreting():
        xint(n).times_do(lambda: do_evaluate(a))
    return a


@Starttokens('repeat')
def repeat_n_times():
    _('repeat')
    n = number()
    _('times')
    dont_interpret()
    no_rollback()
    b = action_or_block()
    adjust_interpret()
    if interpreting():
        the.result = xint(n).times_do(lambda: do_execute_block(b))
    else:
        # return Expr(Call(Name('times_do', Load()), [num(n), b], []))
        if py2:
          return For(store('i'), call('range', [zero, n]), [assign('it', b)])
        if py3:
          return For(store('i'), call('range', [zero, n]), [assign('it', b)],[]) # orelse

    # todo("repeat_n_times")
    return the.result


# if context.use_tree: parent_node()


# if action was (not) parsed before: todo: node cache: skip action(X) -> _'forever'
def forever(a=None):
    must_contain('forever')
    a = a or action()
    _('forever')
    if interpreting():
        while (True):
            do_execute_block(a)


def as_long_condition_block():
    _('as long as')
    c = condition()
    if not c: dont_interpret()
    a = action_or_block()  # danger, block might contain condition()
    if interpreting():
        while (check_condition(c)):
            do_execute_block(a)


def ruby_action():
    _('ruby')
    exec (action or quote)

def run_tests():
    	ok=parse('1+2')
    	print(ok. result)
    

def start_shell(args=[]):
    try:
     import readline
    except:
    	print('running tests')
    	return run_tests()
    context._debug = context._debug or 'ANGLE_DEBUG' in os.environ
    # context.home=os.environ['ANGLE_HOME']
    from os.path import expanduser
    home = expanduser("~")  # WTF
    try: readline.read_history_file(home + '/.angle_history')
    except: pass
    if len(args) > 1:
        input0 = ' '.join(args)
    else:
        # input0 = input('⦠ ')
        input0 = real_raw_input('⦠ ')
    while True:  # input0:
        # while input = Readline.readline('angle-script⦠ ', True)
        readline.write_history_file(home + "/.angle_history")
        # while True
        #   print("> ")
        #   input = STDIN.gets.strip()
        try:
            # interpretation= parser.parse input
            interpretation = parse(input0, None)
            if not interpretation: next
            # if context.use_tree: print(interpretation.tree)
            print((interpretation.result))
        except IgnoreException as e:
            pass
        except NotMatching as e:
            print('Syntax Error')
        except GivingUp as e:
            print('Syntax Error')
        except NameError as e:
            print('Name Error')
        except SyntaxError as e:
            print('Syntax Error')
        except EOFError as e:
            break
        except Exception as e:
            raise
        # print(e)
        # input0 = input("⦠ ")
        input0 = real_raw_input('⦠ ')
    print("Bye.")
    exit(1)


def main():
    the._verbose = False
    ARGV = sys.argv
    if 'ANGLE_DEBUG' in os.environ:
       context.debug = os.environ['ANGLE_DEBUG']
    if 'ANGLE_HOME' in os.environ:
       context.home = os.environ['ANGLE_HOME']
    # version=`git rev-list --all --count`
    # ARGF=sys.argv
    if len(ARGV) == 1:
        print('Angle english programming language v1.2')
        print('usage:')
        print("\t./angle 6 plus six")
        print("\t./angle samples/test.e")
        print("\t./angle (no args for shell)")
        return start_shell()
    a = str(ARGV[1])
    print((">>> %s" % a))
    if a == "--version" or a == '-version' or a == '-v':
        print((the.version))
        return
    if a == "--verbose":
        context._verbose = True
    # read from commandline argument or pipe!!
    # all=ARGF.read or File.read(a) except a
    target_file = None
    try:
        interpretation = parse(a.decode('utf-8'), target_file)
        # interpretation = parse(a.encode('utf-8'), target_file)
        if context.use_tree: print((interpretation.tree))
        if the.result and not not the.result and not the.result == Nil:
            print((the.result))
        if not target_file: start_shell()
    except NotMatching as e:
        print(e)
        print('Syntax Error')
    except GivingUp as e:
        print('Syntax Error')
    except KeyboardInterrupt as e:
        pass
    # except Exception as e:
    #     print(e)
    print("")


if __name__ == '__main__':
    main()

english_parser_imported = True
context.starttokens_done = True
