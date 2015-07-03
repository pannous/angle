#!/usr/bin/env python
# encoding: utf-8
# import ast
# import types
# import tree

# global inside_list
# inside_list=False
# import time
# import traceback
# import sys
# import __builtin__ # class function(object) etc
# import inspect
# import kast
# from kast import *
# import re
# import __builtin__
import _ast
import ast
from ast import NodeVisitor
import traceback
# import HelperMethods
# import Interpretation
# import HelperMethods
# import kast
import types
import sys
import stem.util.system
import emitters.kast_emitter
import interpretation
import inspect
from english_tokens import *
from kast import kast
from power_parser import maybe, allow_rollback
from power_parser import *
import power_parser
from nodes import Function, Argument, Variable, Property, Condition, FunctionCall
# from power_parser import Starttokens
from angle import *
from extensions import *
import token as _token
import the
# from the import the.string
from tree import TreeNode


def parent_node():
    pass


# ## global the.string

class Starttokens(object):
    def __init__(self, starttokens):
        if not isinstance(starttokens, list):
            starttokens = [starttokens]
        self.starttokens = starttokens

    def __call__(self, original_func):
        decorator_self = self
        for t in self.starttokens:
            if t in the.token_map:
                print("ALREADY mapped %s to %s, now %s" % (t, the.token_map[t], original_func))
            the.token_map[t] = original_func
        return original_func


class Todo:
    pass


# def maybe(block):
#     return maybe(block)


def _(x):
    return power_parser.token(x)


# class Nil(object):
#     pass
#
# class Nill(Nil):
#     pass

def nill():
    return tokens(nill_words)


def boolean():
    b = tokens(['True', 'False', 'true', 'false'])
    the.result = (b == 'True' or b == 'true') and TRUE or FALSE
    return the.result


def should_not_start_with(words):
    bad = starts_with(words)
    if not bad: return OK
    if bad: info("should_not_match DID match #{bad)")
    if bad: raise NotMatching(MustNotMatchKeyword(bad))


def remove_from_list(keywords0, excepty):
    good = list(keywords0)
    for x in excepty:
        if x in good:
            good.remove(x)
    return good


def no_keyword_except(excepty=None):
    if not excepty:
        excepty = []
    bad = remove_from_list(keywords, excepty)
    return should_not_start_with(bad)


def no_keyword():
    return no_keyword_except([])


def constant():
    return tokens(constants)


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

    # attr_accessor :methods, :result, :last_result, :interpretation, :variables, :variableValues,:variableType #remove the later!


def interpretation():
    import interpretation

    interpretation = interpretation.Interpretation()
    i = interpretation  # Interpretation.new
    i.result = the.result
    i.tree = the.result
    i.error_position = error_position()
    # super  # set tree, nodes
    i.javascript = javascript
    i.context = context
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
    power_parser.block()
    # maybe(block) or \
    #  maybe(statement) or \
    #    raiseSyntaxError()# raise_not_matching("")
    # maybe(expressions) and end_expression() or\
    # maybe(condition) or \
    # maybe(context) or \
    return the.result
    # # maybe( ruby_def )or\ # SHOULD BE just as method_definition !!:


def set_context(context):
    context = context


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
    if re.search(r'\.js$', the.current_word):
        return javascript_require(dependency)
    if type and type in "javascript script js".split():
        return javascript_require(dependency)


def regexp(x):
    ## global the.string
    match = re.search(x, the.string)
    match = match or re.search(r'(?im)^\s*%s' % x, the.string)
    if not match: raise NotMatching(x)
    the.string = the.string[match.end():].strip()
    return match


def package_version():
    maybe_token('with')
    c = maybe_tokens(comparison_words)
    tokens(['v', 'version'])
    c = c or maybe_tokens(comparison_words)
    # current_value=
    the.result = c + " " + regexp('\d(\.\d)*')
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
    allow_rollback()
    # maybe(list_of){packages)
    dependency = dependency or word()  # regex "\w+(\/\w*)*(\.\w*)*\.?\*?" # rest_of_line
    version = maybe(package_version)
    if interpreting(): includes(dependency, _type, version)  #
    the.result = {'dependency': {'type': _type, 'package': dependency, 'version': version}}
    return the.result


@Starttokens(context_keywords)
def context():
    tokens(context_keywords)
    context = word()
    newlines()  # part of block?
    # NL
    block()
    done()  # done context!!!
    return context


#  surrounded by braces everything can be of value!
def bracelet():
    _('(')  # ok, lists checked before
    allow_rollback()
    # a = value()
    a = expression()
    # a = statement()
    _(')')
    return a  # todo wrapped in (result=a) OK?


@Starttokens(operators)
def operator():
    # if current_type==_token.OP ok
    return tokens(operators)


def isUnary(op):
    return


# always Rightfully assume that the values left and right of the operator are the final values
def ast_operator(op):
    return kast_operator_map[op]


def apply_op(stack, i, op):
    if interpreting():  # and not angel.use_tree:
        if op == "!" or op == "not":
            stack[i:i + 2] = [not stack[i + 1]]
        else:
            result = do_math(stack[i - 1], op, stack[i + 1])
            stack[i - 1:i + 2] = [result]
    else:
        if op == "!" or op == "not":
            stack[i:i + 2] = [kast.Not(stack[i + 1])]
        else:
            # ast.BoolOp ??
            stack[i - 1:i + 2] = [kast.BinOp(stack[i - 1], ast_operator(op), stack[i + 1])]


def fold_algebra(stack):
    used_operators = [x for x in operators if x in stack]
    while len(stack) > 1:
        for op in used_operators:
            i = 0
            while i < len(stack):
                if stack[i] == op:
                    apply_op(stack, i, op)
                i += 1
    return stack


def algebra(val=None):
    # global result
    must_contain_before(args=operators, before=be_words + ['then', ',', ';', ':'])  # todo is smaller ->
    stack = []
    val=val or maybe(value) or bracelet()
    stack.append(val)  # any { maybe( value ) or maybe( bracelet ) )

    def lamb():
        op = maybe(comparation) or operator()
        if not op == 'and': allow_rollback()
        n = maybe_token('not')
        y = maybe(value) or bracelet()
        if y == ZERO: y = 0
        stack.append(op)  # after success of maybe(value)
        stack.append(n) if n else 0
        stack.append(y)
        return y or True

    star(lamb)
    the.result = fold_algebra(stack)[0]
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
    t=t or word()
    if maybe_token('/'): return _(">")
    _(">")
    b=read_xml_block()
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
    if isinstance(_type, str): raise Exception("BAD TYPE %s" % type0)
    if isinstance(x, _type): return True
    return False


def nth_item():  # Also redundant with property evaluation (But okay as a shortcut)):
    set = maybe_token('set')
    n = tokens(numbers + ['first', 'last', 'middle'])
    n = xstr(n).parse_integer()
    if (n > 0): n = n - 1  # -1 AppleScript style !!! BUT list[0] !!!
    raiseEnd()
    maybe_tokens(['.', 'rd', 'st', 'nd'])
    type = maybe_tokens(['item', 'element', 'object', 'word', 'char', 'character'] + type_names)  # noun
    maybe_tokens(['in', 'of'])
    l = resolve(maybe(known_variable)) or maybe(liste) or quote()  # or (expression) with parenthesis!!
    if re.search(r'^char', type):
        the.result = "".join(l).__getitem__(n)
        return the.result
    elif isinstance(l, str):
        l = l.split(" ")
    if isinstance(l, list) and type in type_names:
        l = [x for x in l if is_a(x, type)]
    the.result = l[n]  # .__getitem__(n)
    if angle.in_condition:
        return the.result
    if set and _('to'):  # or maybe_tokens(be_words): #LATER
        val = endNode()
        the.result = do_evaluate(val)
        l[n] = the.result
    return the.result


def listselector():
    return maybe(nth_item) or functionalselector()

    # DANGER: INTERFERES WITH maybe(LIST), NAH, NO COMMA: {x > 3)


@Starttokens('{')
def functionalselector():
    _('{')
    xs = known_variable()
    crit = selector()
    _('}')
    return filter(xs, crit)


global inside_list
inside_list = False


@Starttokens(['[', '(', '{'])
def liste(check=True):
    global inside_list
    if the.current_word == ',': raise NotMatching()
    if check: must_contain_before(',', be_words + operators + ['of'])  # - ['and']
    # +[' '] ???
    start_brace = maybe_tokens(['[', '{', '('])  # only one!
    if not start_brace and (inside_list or in_args): raise NotMatching('not a deep list')

    # all<<expression(start_brace)
    # angel.verbose=True #debug
    inside_list = True
    first = maybe(endNode)
    if not first: inside_list = False
    if not first: raise_not_matching()
    all = [first]

    def lamb():
        tokens([',', 'and'])
        e = endNode()
        # e=expression()
        all.append(e)
        return e

    star(lamb)
    # danger: and as plus! BAD IDEA!!!
    if start_brace == '[': _(']')
    if start_brace == '{': _('}')
    if start_brace == '(': _(')')
    inside_list = False
    return all


def must_contain_substring(param):  # ++ != '+' '+' tokens :(
    current_statement = re.split(';|:|\n', the.current_line[the.current_offset:])[0]
    if not param in current_statement:
        raise_not_matching("must_contain_substring(%s)" % param)


def plusPlus():
    must_contain_substring('++')
    start = pointer()
    pre = maybe_token('+') and token('+')
    v = variable()
    pre or _('+') and token('+')
    if not interpreting(): return kast.AugAssign(kast.Name(v.name, kast.Store()), kast.Add(), kast.Num(1))
    the.result = do_evaluate(v, v.type) + 1
    the.variableValues[v.name] = v.value = the.result
    return the.result


def minusMinus():
    must_contain_substring('--')
    pre = maybe_token('-') and token('-')
    v = variable()
    pre or _('-') and token('-')
    if not interpreting():
        return kast.AugAssign(kast.Name(v.name, kast.Store()), kast.Sub(), kast.Num(1))
    the.result = do_evaluate(v, v.type) + 1
    variableValues[v] = v.value = the.result
    return the.result


def selfModify():
    return maybe(plusEqual) or maybe(plusPlus) or minusMinus()


#
# @Interpret
@Starttokens(self_modifying_operators)
def plusEqual():
    must_contain(self_modifying_operators)
    v = variable()
    mod = tokens(self_modifying_operators)
    exp = expression()  # value
    arg = do_evaluate(exp, v.type)
    if not interpreting():
        op = tree.operator_equals(mod)
        return kast.AugAssign(kast.Name(v.name, kast.Store()), op, arg)
    else:
        the.result = interpretation.self_modify(v, mod, arg)
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
        angle.inside_list = True
        h[key] = expression()  # no
        the.result = {key: h[key]}
        return the.result

    star(hashy)
    _(']')
    angle.inside_list = False
    return h


def close_bracket():  # for nice GivingUp):
    return _(')')


def json_hash():
    must_contain_before(args=[":", "=>"], before=[")"])
    # z=maybe(regular_json_hash) or immediate_json_hash RUBY BUG! or and  or  act very differently!
    z = maybe(regular_json_hash) or immediate_json_hash()
    return z

    # colon for types not maybe(Compatible) puts a:int vs puts {a:int) ? maybe egal
    # careful with blocks!! {puts "s") VS {a:"s")


@Starttokens('{')
def regular_json_hash():
    _('{')
    maybe_token(':') and allow_rollback()  # {:a:.) Could also mean list of maybe(symbols) Nah
    h = {}

    def lamb():
        if len(h) > 0: maybe_tokens([';', ','])
        quoted = maybe_tokens(['"', "'"])
        key = word()
        if quoted: tokens(['"', "'"])
        # Property versus hash !!
        maybe_tokens(['=>', '=']) or starts_with("{") or maybe_tokens(['=>', ':'])
        inside_list = True
        # h[key] = expression0 # no
        h[the.result] = expression()

    star(lamb)
    # no_rollback()
    close_bracket()
    inside_list = False
    return h

    # maybe(expensive)
    # careful with blocks/closures ! map{puts it) VS data{a:"b")



def starts_with_(param):
    return maybe(lambda: starts_with(param))


def immediate_json_hash():  # a:{b) OR a{b():c)):
    # must_contain_before ":{", ":"
    w = word()  # expensive
    # maybe(lambda:starts_with("={")) and maybe_token('=') or:c)
    starts_with_("{") or _('=>')  # or _(':') disastrous :  BLOCK START!
    allow_rollback()
    r = regular_json_hash()
    return {str(the.result): r}  # AH! USEFUL FOR NON-symbols !!!


# todo PYTHONBUG ^^

def maybe_cast(context):
    if not maybe_token('as'): return False
    typ = typeNameMapped()
    return call_cast(context, typ)


def maybe_algebra(context):
    op = maybe_tokens(operators)
    if not op: return False
    z = expression()
    return do_send(context, op, z)


def postoperations(context):# see quick_expression !!
    if the.current_word in be_words: return false  # handled differently
    if the.current_word == "if":  # YAY!
        return the.result if _("if") and condition() else maybe("else") and expression() or None
    return maybe_cast(context) or maybe_algebra(context) or context


def quick_expression():  # bad idea!
    the.result = False
    if the.current_word in the.variables.keys():
        the.result = known_variable()
    elif the.current_word in the.method_names + the.methods.keys():
        the.result = method_call()  # already wrapped maybe(method_call)
    elif the.current_word in the.token_map:
        fun = the.token_map[the.current_word]
        if look_ahead(['rd', 'st', 'nd']): fun = nth_item
        the.result = fun()  # already wrapped maybe(fun)
    if the.current_word=='': return the.result
    if the.current_word==';': return the.result
    if the.current_word=='.': return method_call(the.result)
    if the.current_word=='to':return ranger(the.result)
    if the.current_word=='if':return action_if(the.result)
    if the.current_word in be_words:
        if angle.in_condition: return the.result
        if isinstance(the.result,Variable):return setter(the.result)
        else:raise_not_matching("better try setter")
    if the.current_word=='[':
        return evaluate_index(the.result)
    if the.current_word in operators:
        return algebra(the.result)
    if the.current_word != ";" and the.current_word in operators + special_chars + ["element", "item"]:
        raise_not_matching("quick_expression too simplistic")
    return the.result


def expression(fallback=None):
    start = pointer()
    the.result = ex = maybe(quick_expression) or \
                      maybe(listselector) or \
                      maybe(algebra) or \
                      maybe(json_hash) or \
                      maybe(evaluate_index) or \
                      maybe(liste) or \
                      maybe(evaluate_property) or \
                      maybe(selfModify) or \
                      maybe(endNode) or \
                      raise_not_matching("Not an expression: " + pointer_string())  # and print_pointer(True)
    # maybe(method_call) or \
    # maybe(swift_hash) or \

    ex = postoperations(ex) or ex
    check_comment()

    if not interpreting():
        # if not angle.use_tree:
        #     return (start, pointer())
        return the.result  # AST NODE, Hopefully

    if ex and interpreting():
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


def piped_actions():
    if the.in_pipe: return False
    must_contain("|")
    the.in_pipe = True
    a = statement()
    token('|')
    allow_rollback()
    c = true_method() or bash_action()
    args = star(call_arg)
    if callable(c): args = [args, Argument(value=a)]  # with owner
    if interpreting():
        the.result = do_send(a, c, args)
        print(the.result)
        return the.result
    else:
        return OK


def statement():
    if starts_with(done_words):  # allow empty blocks
        raise_not_matching("end of block")
    raiseNewline()  # maybe(really) maybe(why)
    if checkNewline(): return NEWLINE
    x = maybe(quick_expression) or \
        maybe(loops) or \
        maybe(if_then_else) or \
        maybe(once) or \
        maybe(piped_actions) or \
        maybe(declaration) or \
        maybe(nth_item) or \
        maybe(setter) or \
        maybe(returns) or \
        maybe(imports) or \
        maybe(method_definition) or \
        maybe(assert_that) or \
        maybe(breaks) or \
        maybe(new) or \
        maybe(action) or \
        maybe(expression) or \
        raise_not_matching("Not a statement %s"%pointer_string())
    # AS RETURN VALUE! DANGER!
    the.result = x
    the.last_result= x
    check_comment()
    return the.result

    # one :action, :if_then ,:once , :looper
    # any{action  or  if_then  or  once  or  looper)


# nice optional return 'as':
# define sum x,y as:
#     x+y
# end
# define the sum of numbers x,y and z as number x+y+z
def addLongname(f):
    if len(f.arguments) > 0:
        obj = f.arguments[0]
        if not obj.preposition:
            name = f.name + " " + obj.name
            args = f.arguments[1:]
            f2 = Function(name=name, arguments=args, return_type=f.return_type, body=f.body)
            the.methods[name] = f2
            the.method_names.insert(0, name)  # add longnames first!
            addLongname(f2)
            return f2
    return f


@Starttokens(method_tokens)
def method_definition():
    # annotations=maybe(annotations)
    # modifiers=maybe(modifiers)
    tokens(method_tokens)  # how to
    allow_rollback()
    name = maybe(noun) or verb  # integrate or word
    # obj=maybe( endNode ) # a sine wave  TODO: invariantly get as argument book.close==close(book)
    brace = maybe_token('(')
    args = []

    def arguments():
        angle.in_params = True
        a = param(len(args))
        maybe_token(',')
        args.append(a)
        return a

    star(arguments)  # i.e. 'over an interval i' 'from a to b' 'int x, int y=7'

    return_type = maybe_tokens(['as']) and maybe(typeNameMapped) or None
    return_type = maybe_tokens(['return', 'returns', 'returning', '=', '->']) and maybe(typeNameMapped) or return_type

    angle.in_params = False
    if brace: token(')')
    dont_interpret()
    b = action_or_block()  # define z as 7 allowed !!!
    f = Function(name=name, arguments=args, return_type=return_type, body=b)
    # ,modifiers:modifiers, annotations:annotations
    the.methods[name] = f or parent_node() or b
    the.method_names.append(name)
    f = addLongname(f)
    # # with args! only in tree mode!!
    the.params.clear()
    return f


def execute(command):
    import os

    os.system(command)
    # NOT: exec(command) !! == eval


@Starttokens('bash')
def bash_action():
    # import bindingsr'shell'bash-commands
    ok = starts_with(['bash'] + bash_commands)
    if not ok: raise_not_matching("no bash commands")
    remove_tokens(['execute', 'command', 'commandline', 'run', 'shell', 'shellscript', 'script', 'bash'])
    command = maybe(quote)  # danger bash "hi">echo
    command = command or rest_of_line
    # any{ maybe(  ) or   statements )
    if interpreting():
        try:
            print('going to execute ' + command)
            the.result = execute(command)
            print('the.result:')
            print(the.result)
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
    o = maybe(otherwise) or FALSE
    if ok != "OK" and ok != False:  # and ok !=FALSE ^^:
        the.result = ok
    else:
        the.result = o
    return the.result


def action_if(a):
    if not a:must_not_start_with("if")
    must_contain('if')
    a = a or action_or_expression()
    _('if')
    c = condition_tree()
    if interpreting():
        if check_condition(c):
            return do_execute_block(a)
        else:
            return OK  # false but block ok!
    return a


def if_then():
    tokens(if_words)
    # no_rollback()
    c = condition_tree()
    if c == None: raise InternalError("no condition_tree")
    # c=condition()
    started = maybe_token('then')
    if c != True:
        dont_interpret()
    b = action_or_block(started)
    maybe_newline()  # for else
    adjust_interpret()
    if c == False or c == FALSE: return False
    if interpreting() and c != True:  # c==True done above!
        if check_condition(c):
            return do_execute_block(b)
        else:
            return OK  # o or  false but block ok!
    return b


def future_event():
    if the.current_word.endswith("ed"):  # beeped etc
        return word()


@Starttokens(once_words)
def once_trigger():
    tokens(once_words)
    allow_rollback()
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
    allow_rollback()
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
    if interpreting(): return do_send(s, p, o)


def print_variables():
    return ''.join(['%s=%s' % (v, k) for v, k in variables.iteritems()])


@Starttokens(invoke_keywords)
def extern_method_call():
    call = tokens(invoke_keywords)
    if call: allow_rollback()
    ruby_method = maybe_tokens(builtin_methods + core_methods)
    if not ruby_method: raise UndefinedRubyMethod(word())
    args = rest_of_line
    # args=substitute_variables rest_of_line
    if interpreting():
        try:
            the_call = ruby_method + ' ' + str(the.result)
            # print_variables=variableValues.inject("") ? (lambda x: x==False )={v[1].is_a(the.string) ? '"'+v[1]+'"' : v[1]);"+s )
            the.result = eval(print_variables() + the_call) or ''
            verbose(the_call + '  called successfully with result ' + str(the.result))
            return the.result
        except SyntaxError as e:
            print("\n!!!!!!!!!!!!\n ERROR calling #{the_call)\n!!!!!!!!!!!! #{e)\n ")
            # except Exception as e:
            #     print("\n!!!!!!!!!!!!\n ERROR calling #{the_call)\n!!!!!!!!!!!! #{e)\n ")
            #     import traceback
            #     error(traceback.extract_stack())
            #     print('!!!! ERROR calling ' + the_call)

    checkNewline()
    # raiseEnd
    current_value = ruby_method
    return current_value
    # return Object.method ruby_method.to_sym
    # return Method_call(ruby_method,args,:ruby)


def is_object_method(m):
    if not str(m) in globals(): return False
    if callable(m) and str(m) in globals():
        return m  # 'True'
    object_method = globals()[m]  # .method(m)
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


# In Python 2.7, built-in function objects such as print()
# simply do not have enough information for you to discover what arguments they support!!
def has_args(method, clazz=object, assume=0):
    if method in ['increase', 'invert', '++', '--']:  # increase by 8: todo all intransitive verbs with objects!
        return 0
    if isinstance(method, Function):
        return len(method.arguments)
    method = findMethod(clazz, method)
    try:
        is_builtin = type(method) == types.BuiltinFunctionType or type(method) == types.BuiltinMethodType
        if (is_builtin):
            doku = help(method.__name__)
            convention = doku[1]  # no Python documentation found for 'hypot'
            num = len(convention.split(","))
            return num
        args, varargs, varkw, defaults = inspect.getargspec(method)
        alle = len(args) + (defaults and len(defaults) or 0) + (varkw and len(varkw) or 0)
        if alle == 0: return assume
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


def all_methods():
    if not the.method_names:
        constructors = the.classes.keys() + type_names
        the.method_names = the.methods.keys() + constructors + c_methods + methods.keys() + core_methods + builtin_methods + the.methodToModulesMap.keys()
    the.method_names = [x for x in the.method_names if len(x)>2]
    return the.method_names


def is_method(name):
    return name in all_methods() or maybe(verb)


def import_module(module_name):
    try:
        print("TRYING MODULE " + module_name)
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


def subProperty(context):
    maybe_token(".")
    properties = dir(context)
    if type(context) in angle.extensionMap:
        ext = angle.extensionMap[type(context)]
        properties += dir(ext)
    property = maybe_tokens(properties)
    # the.moduleMethods[module_name] etc!
    if not property or callable(property) or is_method(property):
        return context, property  # save methods for later!
    property = maybe_token(".") and subProperty(property) or property
    return property, None


def true_method(obj=None):
    no_keyword()
    should_not_start_with(auxiliary_verbs)
    xmodule = maybe_tokens(the.moduleNames)
    xvariable = maybe_tokens(the.variables.keys())
    if xmodule:
        module, moduleMethods = import_module(xmodule)
        obj, name = subProperty(module)
        # if obj == module: obj = None
        if obj: moduleMethods += dir(obj)
        if not name: name = maybe_tokens(moduleMethods)
    elif xvariable:
        variable = the.variables[xvariable]
        obj, name = subProperty(variable.value)
    else:
        obj, property = subProperty(obj)
        name = maybe_tokens(all_methods()) or maybe(verb)
    if not name:
        raise NotMatching('no method found')
    if maybe_tokens(articles):
        obj = ' '.join(one_or_more(word))
        longName = name + " " + obj
        if longName in the.method_names:
            name = longName
            # if the.current_word.endswith("ed"):
            # sorted files -> sort files ?
    return xmodule, obj, name  # .to_s





    # maybe(ruby_method_call)  or


# read mail or module read mail or object read mail bla(1) or a.bla(1)  vs ruby_method_call !!
def method_call(obj=None):
    # verb_node
    module, obj, method = true_method(obj)
    method = findMethod(obj, method)  # already? todo findMethods with S, ambiguous ones!!
    allow_rollback()  # maybe doch?
    start_brace = maybe_tokens(['(', '{'])  # '[', list and closure danger: index)
    # todo  ?merge with maybe(liste)
    if start_brace: allow_rollback()
    if module or obj or is_object_method(method):  # todo  not has_object(method) is_class_method:
        obj = obj or None  # globals
    else:
        maybe_token('of')
        if angle.in_args: obj = maybe(maybe(nod))
        if not angle.in_args:
            obj = maybe(nod) or maybe(liste)  # danger: liste vs args below
        method = findMethod(obj, method)  # Now we know the object
        maybe_token(',')
        # print(sorted files)
        # if not in_args: obj=maybe( maybe(nod)  or  maybe(list)  or  expression )

    assume_args = True  # not starts_with("of")  # True    #<< Redundant with property eventilation!
    args = None
    if has_args(method, module or obj, assume_args):
        angle.in_args = True
        args = []

        def call_args():
            if len(args) > 0: maybe_tokens([',', 'and'])
            args.append(call_arg())
            return args

        args = star(call_args)
        if not args: args = obj;obj = None
    else:
        more = maybe_token(',')
        if more: obj = [obj] + liste(False)

    method = findMethod(obj, method, args)  # if not unique before!
    angle.in_args = False
    if start_brace == '(': _(')')
    if start_brace == '[': _(']')
    if start_brace == '{': _(')')
    if not interpreting():
        if method == "puts" or method == "print":
            return kast.Print(dest=None, values=[args], nl=True)
        return FunctionCall(func=method, arguments=args, object=obj)
    the.result = do_send(obj, method, args)
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
    allow_rollback()
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
    # s=statement()
    s = condition()
    if interpreting():
        assert check_condition(s)
    return s


def arguments():
    return star(param)


def maybe_token(x):
    if x == the.current_word:
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
    return do_send(clazz, "__init__", arguments())
    # clazz=Class.new
    # variables[clazz]=
    # clazz(arguments)


@Starttokens(['return', 'returns'])
def returns():
    tokens(['return', 'returns'])
    allow_rollback()
    the.result = maybe(expression)
    if interpreting():
        the.params.clear()
    return the.result


@Starttokens(flow_keywords)
def breaks():
    return tokens(flow_keywords)


#	 or 'say' x=(.*) -> 'bash "say $quote"'
def action():  # NOT THE SAME AS EXPRESSION!?
    start = pointer()
    maybe(bla)
    the.result = maybe(special_blocks) or \
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
    #     if not angle.use_tree: return (start, pointer())
    return the.result  # value or AST


def action_or_expression(fallback=None):  # if a/e then a/b
    return maybe(action) or expression(fallback)


def expression_or_block():  # action_or_block):
    action_or_block()


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
            ab = action_or_expression()
            # raise_not_matching("expecting action or block start")
    if _start == "then" and the.current_word == "else": return ab
    maybe_newline() or end_block(_start)
    return ab


def end_block(type=None):
    return done(type)


def done(_type=None):
    # if _type and maybe(lambda: close_tag(_type)): return OK
    if checkEndOfFile(): return OK
    if checkEndOfLine(): return OK
    checkNewline()
    ok = tokens(done_words)
    if _type and not _type in start_block_words:
        token(_type)
    ignore_rest_of_line()
    return ok


# used by done / end_block()
def close_tag(type):
    _('</')
    _(type)
    _('>')
    return type


# Similar to align_args
def prepare_named_args(args):
    import copy

    context_variables = copy.copy(the.variables)
    if not isinstance(args, dict): return args  # = {'arg': args}
    for arg, val in args.iteritems():
        if arg in context_variables:
            v = context_variables[arg]
            # v = v.clone
            v.value = val
            context_variables[str(arg)] = val  # v  # to_sym todo NORM in hash!!!
        else:
            context_variables[str(arg)] = val  # Variable(name=arg, value=val)
    return context_variables


def do_execute_block(b, args={}):
    if not interpreting(): return
    global variableValues
    if not b: return False
    if b == True: return True
    if callable(b): return do_send(None, b, args)
    if isinstance(b, FunctionCall): return do_send(b.object, b.name, args or b.arguments)
    args = prepare_named_args(args)
    if isinstance(b, kast.AST): return eval_ast(b, [args])
    if isinstance(b, list) and isinstance(b[0], kast.AST): return eval_ast(b, args)
    if isinstance(b, TreeNode): b = b.content
    if not isinstance(b, str): return b  # OR :. !!!
    block_parser = the  # EnglishParser()
    block_parser.variables = variables
    block_parser.variableValues = variableValues
    # block_parser.variables+=args
    try:
        the.result = block_parser.parse.result
    except:
        error(traceback.extract_stack())
    variableValues = block_parser.variableValues
    return the.result


def datetime():
    # Complicated stuff!
    # later: 5 secs from now  , _(5pm) == AT 5pm
    must_contain(time_words)
    _kind = tokens(event_kinds)
    allow_rollback()
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
    v = variable()  # selector() !
    maybe_tokens(['in', 'from'])
    c = collection()
    b = action_or_block()
    for i in c:
        v.value = i
        the.result = do_execute_block(b)
    return the.result


#  until_condition ,:while_condition ,:as_long_condition()

def assure_same_type(var, type):
    if var.name in the.variableTypes:
        oldType = the.variableTypes[var.name]
    elif var.type:
        oldType = var.type
    else:
        oldType = None
    # try:
    if oldType and type and not issubclass(type, oldType):  # FAIL:::type <= oldType:
        raise WrongType(var.name + " has type " + str(oldType) + ", can't set to " + str(type))
    if oldType and var.type and not issubclass(var.type, oldType):
        raise WrongType(var.name + " has type " + str(oldType) + ", cannot set to " + str(var.type))
    if type and var.type and not (issubclass(var.type, type) or issubclass(type, var.type)):  # DOWNCAST TODO
        raise WrongType(var.name + " has type " + str(var.type) + ", Can't set to " + str(type))
    var.type = type  # ok: set


def assure_same_type_overwrite(var, val):
    oldType = var.type
    oldValue = var.value
    if oldType and not isinstance(val, oldType):
        raise WrongType("OLD: %s %s VS %s %s" % (oldType, oldValue, type(val), val))
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


def property():
    must_contain_before([".", "'s"], xlist(special_chars) - '.')
    allow_rollback()
    owner = class_constant
    owner = get_obj(owner) or variables[known_variable(False)].value  # reference
    _('.')
    properti = word
    return Property(name=properti, owner=owner)


# difference to setter? just public int var const test # no be_words
def declaration():
    must_not_contain(be_words)
    # must_contain_before  be_words+['set'],';'
    a = the_()
    mod = maybe_tokens(modifiers)
    type = typeNameMapped()
    maybe_tokens(['var', 'val', 'let'])
    mod = mod or maybe_tokens(modifiers)  # public static :.
    var = maybe(known_variable) or variable(a, ctx=kast.Store())
    if var.type:
        assure_same_type(var, type)
    else:
        var.type = type
    var.final = mod in const_words
    var.modifier = mod
    return var


@Starttokens(let_words)
def setter(var=None):
    # if not var:
    must_contain_before(args=be_words + ['set'], before=['>', '<', '+', '-', '|', '/', '*'])
    _let = maybe_tokens(let_words)
    if _let: allow_rollback()
    a = maybe(_the)
    mod = maybe_tokens(modifiers)
    _type = maybe(typeNameMapped)
    maybe_tokens(['var', 'val', 'value of'])  # same as let? don't overwrite?
    mod = mod or maybe(modifier)  # public static :.
    # else:
    #     _type=var.type
    #     mod=var.modifier
    var = var or maybe(property) or variable(a, ctx=kast.Store())
    setta = maybe_tokens(['to']) or be()  # or not_to_be 	contain -> add or create
    # val = maybe(adjective) or expressions()
    val = expression()
    _cast = maybe_tokens(["as", "kast", "kast to", "kast into", "kast as"]) and typeNameMapped()
    if _cast:
        if interpreting():
            val = do_cast(val, _cast)
        else:
            _type = _cast  # todo
    allow_rollback()
    if setta in ['are', 'consist of', 'consists of']: val = flatten(val)
    var.typed = _type or var.typed or 'typed' == mod  # in [mod]

    assure_same_type(var, _type or type(val))
    assure_same_type_overwrite(var, val)
    # if var.typed:
    #     var.type = _type #ok: set

    if not var.name in variableValues or mod != 'default':  # and interpreting():
        the.variableValues[var.name] = val
        the.variables[var.name] = var
        var.value = val

    var.final = mod in const_words
    var.modifier = mod
    the.variableTypes[var.name] = var.type
    if isinstance(var, Property): var.owner.send(var.name + "=", val)  # todo
    # end_expression via statement!
    the.token_map[var.name] = known_variable
    if not interpreting(): return kast.Assign(kast.Name(var.name, kast.Store()), val)
    if interpreting() and val != 0: return val
    return var
    # 'initial'?	maybe(let) maybe(_the) ('initial' or 'var' or 'val' or 'value of')? variable (be or 'to') value


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


def variable(a=None, ctx=kast.Load()):
    a = a or maybe_tokens(articles)
    if a != 'a': a = None  # hack for a variable
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
    name = " ".join(all)
    if not typ and len(all) > 1 and isType(all[0]): name = all[1:-1].join(' ')  # (p ? 0 : 1)
    if p: name = p + ' ' + name
    name = name.strip()
    if isinstance(ctx, kast.Param):  # STORE IN CONTEXT (i.e. def x(int y)): y+3
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
            raise raise_not_matching("Unknown variable " + name)
    # typ=_(":") and typeNameMapped() or typ # postfix type int x vs x:int VERSUS def x:\n !!!!

    if isinstance(ctx, kast.Store):
        if name in the.variableValues:
            oldVal = the.variableValues[name]  # default or overwrite -> WARN? return OLD?
        else:
            oldVal = None
        the.result = Variable(name=name, type=typ or None, scope=current_node(), module=current_context(), value=oldVal,
                              ctx=ctx)
        the.variables[name] = the.result
        return the.result
    raise Exception("Unknown variable context " + ctx)


word_regex = r'^\s*[a-zA-Z]+[\w_]*'


def word(include=None):
    ## global the.string
    # danger:greedy!!!
    if not include:
        include = []
    no_keyword_except(include)
    raiseNewline()
    # if not the.string: raise EndOfDocument.new
    # if maybe(starts_with) keywords: return false
    # match = re.search(r'^\s*[a-zA-Z]+[\w_]*',the.string)
    match = re.search(word_regex, the.current_word)
    if (match):
        current_value = the.current_word  # the.string[:match.end()]
        # the.string = the.string[match.end():].strip()
        next_token()
        return current_value
    raise_not_matching("word")

    # fad35
    # unknown
    # noun

    # NOT SAME AS should_not_start_with!!!


def must_not_contain(words):
    old = the.current_token
    words = flatten(words)
    while not checkEndOfLine() and the.current_word != ';':
        for w in words:
            if w == the.current_word:
                raise MustNotMatchKeyword(w)
        next_token()
    set_token(old)
    return OK


def must_not_start_with(words):
    should_not_start_with(words)


def todo(x=""):
    raise NotImplementedError(x)


def do_cast(x, typ):
    if isinstance(typ, float): return float(x)
    if isinstance(typ, int): return int(x)
    if typ == int: return int(x)  # todo!
    if typ == xint: return int(x)  # todo!
    if typ == "int": return int(x)
    if typ == "integer": return int(x)
    if typ == str: return str(x)
    if typ == xstr: return str(x)
    if typ == "str": return str(x)
    if typ == "string": return str(x)
    todo("do_cast")
    return x


def call_cast(x, typ):
    if interpreting(): return do_cast(x, typ)
    return x  # FunctionCall(name('cast'


def nod():  # options{generateAmbigWarnings=false)):
    return maybe(number) or \
           maybe(quote) or \
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
    a = variable(a=None, ctx=kast.Param())
    return Argument(preposition=pre, name=a.name, type=a.type, position=position)


# VALUES given to CALLED method, NOT in declaration! # SEE PARAM ^^^!!
def call_arg(position=1):
    pre = maybe_tokens(prepositions) or ""  # might be superfluous if calling"BY":
    maybe_tokens(articles)
    # allow_rollback()
    a = maybe(variable)
    if a: return Argument(name=a.name, type=a.type, preposition=pre, position=position, value=a)
    type = maybe(typeNameMapped)
    if look_ahead('='):
        name = maybe(word)
        maybe_token('=')
    else:
        name = None
    value = endNode()
    # method=get_method(name,obj)
    # if isinstance(method,Function):
    #     for a in method.arguments:
    return Argument({'preposition': pre, 'name': name, 'type': type, 'position': position, 'value': value})


# call integrate with integer n = 7


# BAD after filter, ie numbers [ > 7 ]
# that_are bigger 8
# whose z are nonzero
def compareNode():
    c = comparison()
    if not c: raise NotMatching("NO comparison")
    if c == '=': raise NotMatching('compareNode = not allowed')  # todo Why not / when
    rhs = endNode()  # expression
    return rhs


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


def comparative():
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
    if angle.use_tree:
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


def comparison():  # WEAK maybe(pattern)):
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
        allow_rollback()

    if eq: maybe_token('to')
    maybe_tokens(['and', 'or', 'xor', 'nor'])
    maybe_tokens(comparison_words)  # bigger or equal != different to condition_tree True or false
    # comp = comp and pointer() - start or eq
    # if Jens.smaller then ok:
    maybe_token('than')  # , 'then' #_22'then' ;) danger:
    return comp or eq


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
    # or \
    # (c - "is ") in comparison_words.contains() or \
    # comparison_words.contains(c - "are ") or \
    # comparison_words.contains(c - "the ") or \
    return ok


def check_list_condition(quantifier, lhs, comp, rhs):
    global negated
    # if not a.isa(Array): return True
    # see quantifiers
    try:
        count = 0
        comp = comp.strip()
        for item in lhs:
            if is_comparator(comp): the.result = do_compare(item, comp, rhs)
            if not is_comparator(comp): the.result = do_send(item, comp, rhs)
            # if not the.result and xlist(['all', 'each', 'every', 'everything', 'the whole']).matches(quantifier): break
            if not the.result and quantifier in ['all', 'each', 'every', 'everything', 'the whole']: break
            if the.result and quantifier in ['either', 'one', 'some', 'few', 'any']: break
            if the.result and quantifier in ['no', 'not', 'none', 'nothing']:
                negated = not negated
                break

            if the.result: count = count + 1

        min = len(lhs) / 2
        if quantifier == 'most' or quantifier == 'many': the.result = count > min
        if quantifier == 'at least one': the.result = count >= 1
        # todo "at least two","at most two","more than 3","less than 8","all but 8"
        # if not the.result= not the.result
        if not the.result:
            verbose("condition not met %s %s %s" % (lhs, comp, rhs))

        return the.result
    except IgnoreException as e:
        # debug x #soft message
        error(e)  # exit!
    return False


def check_condition(cond=None, negate=False):
    if cond == True or cond == 'True': return True
    if cond == False or cond == 'False': return False
    if isinstance(cond, ast.BinOp): cond = Condition(lhs=cond.left, comp=cond.op, rhs=cond.right)
    if cond == None or not isinstance(cond, Condition):
        raise InternalError("NO Condition given! %s" % cond)

        # return cond
    try:
        lhs = cond.lhs
        rhs = cond.rhs
        comp = cond.comp
        if not comp: return False
        if lhs and isinstance(lhs, str): lhs = lhs.strip()  # None==None ok
        if rhs and isinstance(rhs, str): rhs = rhs.strip()  # " a "=="a" !?!?!? NOOO! maybe(why)
        if isinstance(comp, str): comp = comp.strip()
        if is_comparator(comp):
            the.result = do_compare(lhs, comp, rhs)
        else:
            the.result = do_send(lhs, comp, rhs)

        # if  not the.result and cond:
        #   #if c: a,comp,b= extract_condition c
        #   evals=''
        #   variables.each { |var, val| evals+= "#{var)=#{val);" )
        #   the.result=eval(evals+cond.join(' ')) #dont set the.result here (i.e. while(:.)last_result )
        #
        # if _not: the.result = not the.result
        if negate: the.result = not the.result
        if not the.result:
            verbose("condition not met %s %s %s" % (lhs, comp, rhs))
        verbose("condition met %s %s %s" % (lhs, comp, rhs))
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
    n = noun()
    tokens(['in' "of"])
    return n


def get_type(object1):
    todo("get_type")
    # return object


def method_dir(lhs):
    object1 = do_evaluate(lhs)
    if interpreting():
        return dir(object1)
    return get_type(object1).__dict__


def condition():
    start = pointer()
    brace = maybe_token('(')
    negated = maybe_token('not')
    if negated: brace = brace or maybe_token('(')
    # a=endNode:(
    quantifier = maybe_tokens(quantifiers)  # vs selector()!
    filter = None
    if quantifier: filter = maybe(element_in)  # all words in
    angle.in_condition = True
    lhs = action_or_expression(quantifier)
    _not = False
    comp = use_verb = maybe(verb_comparison)  # run like , contains
    if not use_verb: comp = maybe(comparation)
    angle.in_condition=False
    if not comp:return lhs
    # allow_rollback # upto maybe(where)?
    if comp: rhs = action_or_expression(None)
    if brace: _(')')
    negate = (negated or _not) and not (negated and _not)
    # angel.in_condition=False # WHAT IF raised !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!??????!
    # 1,2,3 are smaller 4  VS 1,2,4 in 3
    if isinstance(lhs, list) and not isinstance(rhs, list):  # and not maybe(lambda: comp in method_dir(lhs))
        quantifier = quantifier or "all"
    # if not comp: return  negate ?  not a : a
    cond = Condition(lhs=lhs, comp=comp, rhs=rhs)
    if interpreting():
        if quantifier:
            if negate:
                return (not check_list_condition(quantifier, lhs, comp, rhs))
            else:
                return check_list_condition(quantifier, lhs, comp, rhs)
        if negate:
            return (not check_condition(cond))
        else:
            return check_condition(cond)  # None
    else:
        return cond
        # return Condition.new lhs:a,cmp:comp,rhs:b
        # if not angel.use_tree: return start - pointer()
        # if angel.use_tree: return parent_node()


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
        if not interpreting(): return current_node  # or angel.use_tree
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
    return the.current_word.endswith("ing")
    # verb()
    # return token('ing')


def verbium():
    return maybe(comparison) or verb() and adverb()  # be or have or


def resolve_netbase(n):
    return n  # Todo


def the_noun_that():
    maybe(_the)
    n = noun()
    if not n: raise_not_matching("no noun")
    if the.current_word == "that":
        criterium = star(selector)  # todo: apply ;)
        if criterium and interpreting():
            n = filter(n, criterium)
        else:
            n = resolve_netbase(n)
    else:
        if n in the.variables:
            return the.variables[n]
        if n in the.methods:
            return the.methods[n]
        if n in the.classes:
            return the.classes[n]
        raise_not_matching("only 'that' filtered nouns for now!")
        raise Exception("Undefined: " + n)
    return n


# def plural:
#  word #todo
#


def const_defined(c):
    import inspect

    modules = dict(sys.modules)  # dictionary changed size during iteration
    for module in modules:
        for name, obj in inspect.getmembers(modules[module]):
            try:
                if name == c and inspect.isclass(obj):
                    return obj
            except Exception as e:
                raise e
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
    # if x == "class": return type #DANGER!
    if x == "type": return type
    if x == "word": return str  # DANGER!
    if x == "int": return int
    if x == "integer": return int
    if x == "long": return long
    if x == "double": return long
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
    if x == "array": return list
    if x == "set": return set
    if x == "list": return list
    if x == "tuple": return tuple  # list

    # Put named parameters somewhere else!
    if x == "name": return str
    if x == "label": return str
    if x == "length": return int
    if x == "label": return str
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
    current_value = match[1]
    return current_value


def postjective():  # 4 squared , 'bla' inverted, buttons pushed in, mail read by James):
    ## global the.string
    match = re.search(r'^\s*(\w+)ed', the.string)
    if not match: return False
    the.string = the.string[match.end():]
    pr = not checkEndOfLine() and maybe_tokens(prepositions)  # wrapped in
    if pr and not checkEndOfLine(): maybe(endNode)  # silver
    current_value = match[1]
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
    try:
        the.result = do_send(node, attr)
        return the.result
    except:
        verbose("do_send(node,attr) failed")
    if attr in dir(node):  # y.__att
        return node.__getattribute__(attr)
    if attr in ['type', 'class', 'kind']:
        return get_class(node)
    if isinstance(node, list):
        return map(lambda x: do_evaluate_property(attr, x), node)
    if isinstance(attr, _ast.AST):
        return todo("do_evaluate_property")


# Strange method, see resolve, do_evaluate
def eval_string(x):
    if not x: return None
    if isinstance(x, Variable): return x.value
    if isinstance(x, ast.Num): return x.n
    if isinstance(x, ast.Str): return x.s
    if isinstance(x, extensions.File): return x.to_path
    # if isinstance(x, str): return x
    # and x.index(r'')   :. notodo :.  re.search(r'^\'.*[^\/]$',x): return x
    # if maybe(x.is_a) Array: x=x.join(" ")
    if isinstance(x, list) and len(x) == 1: return x[0]
    if isinstance(x, list): return x
    # if maybe(x.is_a) Array: return x.to_s
    return do_evaluate(x)


class Reflector(object):
    def __getitem__(self, name):
        print("Reflector __getitem__ %s" % str(name))
        if name in the.variables:
            return do_evaluate(the.variables[name].value)
        if name in the.methods:
            return the.methods[name]
        raise Exception("UNKNOWN ITEM %s" % name)
        return name

    def __setitem__(self, key, value):
        print("Reflector __setitem__ %s %s" % (key, value))
        if key in the.variables:
            the.variables[key].value = value
        else:
            the.variables[key] = Variable(name=key, value=value)
        the.variableValues[key] = value
        the.result = value

class PrepareTreeVisitor(ast.NodeTransformer):
    def visit_int(self,x):
        return ast.Num(x)

    # def generic_visit(self, node):


def eval_ast(my_ast, args={}):
    import codegen
    import ast

    try:  # todo args =-> SETTERS!
        # context_variables=variableValues.copy()+globals()+locals()
        context_variables = variableValues.copy()
        context_variables.update(globals())
        context_variables.update(locals())

        variable_inits = []
        # for k in args:
        #     s = kast.setter(k, do_evaluate(args[k]))
        #     variable_inits.append(s)
        if not type(my_ast) == ast.Module:
            my_ast = flatten(my_ast)
            my_ast = _ast.Module(body=variable_inits + my_ast)
        # elif args:my_ast.body=variable_inits+my_ast.body
        PrepareTreeVisitor().visit(my_ast)
        print(my_ast.body)
        source = codegen.to_source(my_ast)
        print(source)  # => CODE
        print ast.dump(my_ast)
        my_ast = ast.fix_missing_locations(my_ast)
        code = compile(my_ast, 'file', 'exec')
        # code=compile(my_ast, 'file', 'exec')
        # eval can't handle arbitrary python code (eval("import math") ), and
        # exec() doesn't return the results.
        ret = eval(code, context_variables, Reflector())
        ret = ret or the.result
        print("GOT RESULT %s" % ret)
        # err= sys.stdout.getvalue()
        # if err: raise err
        # z=exec (code)
        return ret
    except Exception as e:
        print(my_ast)
        ast.dump(my_ast)
        raise e, None, sys.exc_info()[2]


def do_evaluate(x, _type=None):
    try:
        if isinstance(x, type): return x
        if isinstance(x, list) and len(x) == 1: return do_evaluate(x[0])
        if isinstance(x, list) and len(x) != 1: return x
        if x == True or x == False: return x
        if x == ZERO: return 0
        if x == TRUE: return True
        if x == FALSE: return FALSE
        if x == NILL: return None
        if isinstance(x, Variable):
            val = x.value or the.variableValues[x.name]
            if not interpreting():
                return val
            else:
                return emitters.kast_emitter.wrap_value(val)

        if isinstance(x, str):
            if _type and isinstance(_type, extensions.Numeric): return float(x)
            if x in the.variableValues: return the.variableValues[x]
            if match_path(x): return resolve(x)
            if _type and _type == float: return float(x)
            if _type and _type == int: return int(x)
            return x
        # if isinstance(x, str) and type and is_a(type,float): return float(x)
        # if isinstance(x, TreeNode): return x.eval_node(variableValues)
        # :. todo METHOD / Function!
        # if isinstance(x, extensions.Method): return x.call  #Whoot
        # if callable(x): return x()  # Whoot
        if not interpreting(): return x
        if isinstance(x, kast.AST): return eval_ast([x])
        if isinstance(x, list) and isinstance(x[0], kast.AST): return eval_ast(x)
        return x  # DEFAULT!
    except (TypeError, SyntaxError)as e:
        print("ERROR #{e) in do_evaluate #{x)")
        raise e, None, sys.exc_info()[2]
        # return x


# see do_evaluate ! merge
def resolve(x):
    if not x: return x
    if is_dir(x): return extensions.Directory(x)
    if is_file(x): return extensions.File(x)
    if isinstance(x, Variable): return x.value  # or ast.Name?
    if interpreting() and variableValues.has_key(x): return variableValues[x.strip]
    return x


def self_modifying(method):
    method=method.__name__
    return method == 'increase' or method == 'decrease' or method.endswith("!")


#
# def self_modifying(method):
#     EnglishParser.self_modifying(method)  # -lol

def is_math(method):
    ok = method in operators
    return ok


def do_math(a, op, b):
    if isinstance(a, Variable): a = a.value
    if isinstance(b, Variable): b = b.value
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
    if op == 'to the': return a ** b
    if op == 'power': return a ** b
    if op == 'and': return a and b
    if op == '&&': return a and b
    if op == 'but':
        if isinstance(a, list): return a.remove(b)
        return a and b
    # if op == '&': return a and b
    if op == '&': return a & b
    if op == '^': return a ^ b
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
    if op == 'is': return a == b  # NOT the same as a is b:
    if op == '===': return a is b
    if op == 'is identical': return a is b
    if op == 'is exactly': return a is b
    if op == 'same as': return a == b
    if op == 'the same as': return a == b
    if op == 'equals': return a == b
    if op == '!=': return a != b
    if op == 'is not': return a != b
    if op == 'isn\'t': return a != b
    raise Exception("UNKNOWN OPERATOR " + op)


def isbound(method):
    # return hasattr(m, '__self__')
    return method.__self__ is not None
    # the new synonym for im_self is __self__, and im_func is also available as __func__.


def instance(bounded_method):
    return bounded_method.im_self


def findMethod(obj0, method0, args0=None):
    method = method0
    if callable(method): return method
    if isinstance(method, Function): return method
    _type = type(obj0)
    if (isinstance(obj0, Variable)):
        _type = obj0.type
        obj0 = obj0.value
    if isinstance(method, list) and len(method) == 1: method = method[0]
    if not isinstance(method, str):
        raise_not_matching("NO such METHOD %" % method)
    if method in the.methods:
        return the.methods[method]
    if method in locals():
        return locals()[method];
    if globals in locals():
        return locals()[globals];
    if method in dir(obj0):
        return getattr(obj0, method)  # NOT __getattribute__(name)!!!!
    if _type in angle.extensionMap:
        ex = angle.extensionMap[_type]
        if method in dir(ex):
            method = getattr(ex, method)  # NOT __getattribute__(name)!!!!
            method = method.__get__(obj0, ex)  # bind!
    elif isinstance(obj0, type) and method in obj0.__dict__:
        method = obj0.__dict__[method]  # class
        method.__get__(None, obj0)  # The staticmethod decorator wraps your class and implements a dummy __get__
        # that returns the wrapped function as function and not as a method
    if isinstance(method, str):
        raise_not_matching("NO such METHOD %s" % method)
    return method
    # if callable(method):method(args)


# Similar to prepare_named_args for block ast eval!
def align_args(args, clazz, method):
    if args and isinstance(args, str): args = xstr(args).replace_numerals()
    if isinstance(args, Argument): args = args.name_or_value
    selfmodifying=self_modifying(method)
    if selfmodifying: return args # todo
    def values(x):
        return x.value

    if (isinstance(args, list)):
        args = map(values, args)
    if (isinstance(args, Argument)): args = args.value

    is_bound = 'im_self' in dir(method) and method.im_self
    if is_bound:
        if method.im_self == args: args = None
        if (args and isinstance(args, list) and len(args) > 0):
            if method.im_self == args[0]: args.remove(args[0])
    args = eval_string(args)  # except NoMethodError
    return args
    if isinstance(method, Function):
        method = findMethod(clazz, method)
    try:
        margs, varargs, varkw, defaults = inspect.getargspec(method)
        expect = len(margs) + (defaults and len(defaults) or 0) + (varkw and len(varkw) or 0)
        if isinstance(args, list):
            if (len(args) > expect):
                args = [args]
        return args
    except:
        return args


# INTERPRET only,  todo cleanup method + argument matching + concept
def do_send(obj0, method0, args0=[]):
    if not interpreting(): return False
    if not method0: return False
    if method0 in be_words and obj0 == args0: return True  # stupid unnecessary shortcut

    # try direct first!
    method = findMethod(obj0, method0, args0)
    method_name = callable(method) and str(method) or method0  # what for??

    if isinstance(method, Function):
        the.result = do_execute_block(method.body, args0)
        return the.result
    # if callable(method): obj = method.owner no such concept in Python !! only as self parameter

    if (method == 'of'): return evaluate_property(args0, obj0)
    # if isinstance(args, list) and isinstance(args[0], Argument): args = args.map(name_or_value)
    is_builtin = type(method) == types.BuiltinFunctionType or type(method) == types.BuiltinMethodType
    is_bound = 'im_self' in dir(method) and method.im_self

    # if args and maybe(obj.respond_to) + " " etc!: args=args.strip()
    obj = do_evaluate(obj0)
    args = align_args(args0, obj, method)
    number_of_arguments = has_args(method, obj, not not args)

    # if (args and args[0] == 'of'):  # and has_args(method, obj)):
    #     if not callable(method) and method in dir(obj):
    #         return obj.__getattribute__(method)
    #     else:
    #         method(args[1])  # square of 7
    print >> sys.stderr, ("CALLING %s %s with %s" % (obj, method, args))

    if not args and not callable(method) and method in dir(obj):
        return obj.__getattribute__(method)

    if not obj:
        if args and number_of_arguments > 0:
            return method(args)
        else:
            return method()
    if is_math(method_name):
        return do_math(obj, method_name, args)

    if not callable(method):
        raise MethodMissingError(type(obj), method, args)

    if not args or not number_of_arguments:
        if is_bound or is_builtin:
            the.result = method() or NILL
        else:
            the.result = method(obj) or NILL
    elif has_args(method, obj, True):
        if is_bound or is_builtin:
            if isinstance(args, dict):
                try:
                    the.result = method(**args) or NILL
                except:
                    the.result = method(*args.values()) or NILL
            if isinstance(args, list) or isinstance(args, tuple):
                if len(args) == 1 and number_of_arguments == 1:
                    the.result = method(args) or NILL
                else:
                    the.result = method(*args) or NILL
            else:
                the.result = method(args) or NILL
        else:
            the.result = method(obj, args) or NILL
            # the.result = method(obj, *args) or NILL
            # the.result = method([obj]+args) or NILL try!
    else:
        the.result = MethodMissingError

    # todo: call FUNCTIONS!
    # puts object_method.parameters #todo MATCH!

    # => selfModify todo
    if (obj0 or args0) and self_modifying(method):
        name = str(obj0 or args0)  # .to_sym()  #
        the.variables[name].value = the.result  #
        the.variableValues[name] = the.result

    # todo : None OK, error not!
    # if the.result == NoMethodError: msg = "ERROR CALLING #{obj).#{method)(): #{args))"
    if the.result == MethodMissingError: raise MethodMissingError(obj, method, args)
    # raise SyntaxError("ERROR CALLING: NoMethodError")
    return the.result


def do_compare(a, comp, b):
    a = eval_string(a)  # NOT: "a=3; 'a' is 3" !!!!!!!!!!!!!!!!!!!!   Todo ooooooo!!
    b = eval_string(b)
    if isinstance(b, float) and re.search(r'^\+?\-?\.?\d', str(a)): a = float(a)
    if isinstance(a, float) and re.search(r'^\+?\-?\.?\d', str(b)): b = float(b)
    if isinstance(b, int) and re.search(r'^\+?\-?\.?\d', str(a)): a = int(a)  # EEK PHP STYLE !? REALLY??
    if isinstance(a, int) and re.search(r'^\+?\-?\.?\d', str(b)): b = int(b)  # EEK PHP STYLE !? REALLY??
    if isinstance(comp, str): comp = comp.strip()
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
    elif comp in be_words or isinstance(comp, ast.Eq):
        return a == b
    elif class_words.index(comp):
        return issubclass(a, b) or isinstance(a, b)  # issubclass? a bird is an animal OK
        # if b.isa(Class): return a.isa(b)
    elif be_words.index(comp) or re.search(r'same', comp):
        return isinstance(a, b) or a.__eqtokens(b)
    elif comp == 'equal' or comp == 'the same' or comp == 'the same as' or comp == 'the same as' or comp == '=' or comp == '==':
        return a == b  # Redundant
    else:
        try:
            return a.send(comp, b)  # raises!
        except:
            error('ERROR COMPARING ' + str(a) + ' ' + str(comp) + ' ' + str(b))
            return a.send(comp + '?', b)

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


def selectable():
    must_contain(['that', 'whose', 'which'])
    maybe_tokens(['every', 'all', 'those'])
    xs = resolve(known_variable()) or endNoun()
    s = maybe(selector)  # rhs=xs, lhs implicit! (BAD!)
    if interpreting(): xs = filter(xs, s)  # except xs
    return xs


# see selectable
def filter(liste, criterion):
    global rhs, lhs, comp
    if not criterion: return liste
    mylist = eval_string(liste)
    # if not isinstance(mylist, mylist): mylist = get_iterator(mylist)
    if angle.use_tree:
        method = criterion['comparative'] or criterion['comparison'] or criterion['adjective']
        args = criterion['endNode'] or criterion['endNoun'] or criterion['expressions']
    else:
        method = comp or criterion()
        args = rhs
    mylist.select(lambda i: do_compare(i, method, args))  # REPORT BUGS!!! except False

def ranger(a=None):
    if in_params: return False
    must_contain('to')
    maybe_token('from')
    a = a or number()
    _('to')
    b = number()
    return range(a, b+1) # count from 1 to 10 => 10 INCLUDED, thus +1!


# #  or  endNode have adjective  or  endNode attribute  or  endNode verbTo verb # or endNode auxiliary gerundium
def endNode():
    raiseEnd()
    # maybe( plural) or
    x = maybe(liste) or \
        maybe(fileName) or \
        maybe(linuxPath) or \
        maybe(quote) or \
        maybe(lambda: maybe(article) and typeNameMapped()) or \
        maybe(simpleProperty) or \
        maybe(evaluate_property) or \
        maybe(selectable) or \
        maybe(known_variable) or \
        maybe(article) and word() or \
        maybe(ranger) or \
        maybe(value) or \
        maybe(typeNameMapped) or \
        maybe_token('a') or \
        raise_not_matching("Not an endNode")  # "+pointer_string())
    po = maybe(postjective)  # inverted
    if po and interpreting(): x = do_send(x, po, None)
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

    if angle.use_tree: return obj
    # return adjs.to_s+" "+obj.to_s # hmmm  hmmm
    if adjs and isinstance(adjs, list):
        todo("adjectives in endNoun")
        return ' ' + " ".join(adjs) + " " + str(obj)  # hmmm  W.T.F.!!!!!!!!!!!!!?????
    return str(obj)


def start_xml_block(type):
    _('<')
    if type:_(type)
    else: type=word()
    _('>')
    return type



def check_end_of_statement():
    return checkEndOfLine() or the.current_word == ";" or maybe_tokens(done_words)


# End of block also acts as end of statement but not the other way around!!
def end_of_statement():
    return checkEndOfLine() or starts_with(done_words) or the.previous_word == ';' or token(';')
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
        obj = endNode()  # true_variable()
    _('[')
    i = endNode()
    _(']')
    set = maybe_token('=') or None
    if set: set = expression()
    # if interpreting(): the.result=v.send :index,i
    # if interpreting(): the.result=do_send v,:[], i
    # if set and interpreting(): the.result=do_send(v,:[]=, [i, set])
    va = resolve(obj)
    if interpreting(): the.result = va[i]  # va.__index__(i)  # old value
    if set!=None:# and interpreting():
        the.result = va[i] = set  # va.__index__(i, set)
    if set!=None and isinstance(obj, Variable):
        the.result=obj.value = va
    # if interpreting(): the.result=do_evaluate "#{v)[#{i)]"
    return the.result


def evaluate_property():
    maybe_token('all')  # list properties (all files in x)
    must_contain_before(['of', 'in', '.'], '(')
    raiseNewline()
    x = endNoun(included=type_keywords)
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
    allow_rollback()
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



def be(): tokens(be_words)


def modifier(): tokens(modifiers)


def attribute(): tokens(attributes)


def preposition(): tokens(prepositions)


def pronoun(): tokens(pronouns)


def nonzero(): tokens(nonzero_keywords)


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
    if the.current_type == _token.STRING:
        the.result = the.current_word[1:-1]
        if not interpreting():
            the.result = kast.Str(s=the.result)
        next_token()
        return the.result
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
    vars = the.params.keys()
    if (len(vars) == 0): raise NotMatching()
    v = tokens(vars)
    v = the.params[v]  # why maybe(later)
    return v


def known_variable(node=True):
    # must_not_start_with(the.method_names)
    vars = the.variables.keys()
    if (len(vars) == 0): raise NotMatching()
    v = tokens(vars)
    v = the.variables[v]  # why maybe(later)
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
    if not angle.use_wordnet:
        return word(include)
    if the.current_word in the.nouns:
        return the.current_word
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


@Starttokens(['for','repeat with'])
def repeat_with():
    maybe_token('for') or _('repeat') and _('with')
    allow_rollback()
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
    allow_rollback()  # no_rollback 13 # arbitrary value ! :{
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

@Starttokens(['until', 'as long as'])
def until_loop():
    maybe_tokens(['repeat'])
    tokens(['until', 'as long as'])
    dont_interpret()
    allow_rollback()  # no_rollback 13 # arbitrary value ! :{
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
    if re.search(r'\s*while', the.current_word):
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
    maybe_tokens(['do','repeat'])
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
    b = maybe_tokens(['do','repeat'])
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
    return a


def n_times_action():
    # global the.result
    must_contain('times')
    n = number()  # or int_variable
    _('times')
    allow_rollback()
    maybe_tokens(['do','repeat'])
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
    b = action_or_block()
    adjust_interpret()
    if interpreting():
        xint(n).times_do(lambda: do_execute_block(b))
    return b
    # if angel.use_tree: parent_node()


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


def start_shell():
    angle.verbose = False
    print('usage:')
    print("\t./angle 6 plus six")
    print("\t.r'angle examples'test.e")
    print("\t./angle (no args for shell)")
    # parser=EnglishParser()
    # import readline
    # maybe(lambda:load_history_why('~/.english_history'))
    # http:r''www.unicode.orgr'charts'PDF/U2980.pdf
    # Readline.readline('⦠ ', True)
    input0 = input()
    while input0:
        # while input = Readline.readline('angle-script⦠ ', True)
        # Readline.write_history_file("~/.english_history")
        # while True
        #   print("> ")
        #   input = STDIN.gets.strip()
        try:
            # interpretation= parser.parse input
            interpretation = parse(input)
            if not interpretation: next
            if angle.use_tree: print(interpretation.tree)
            print(interpretation.result)
        except IgnoreException as e:
            pass

        # except NotMatching as e:
        #   print('Syntax Error')
        # except GivingUp as e:
        #   print('Syntax Error')
        # except Exception as e:
        #     print(e)
        input0 = input()
    print("")
    exit()


def startup():
    ARGV = sys.argv
    # ARGF=sys.argv
    if len(ARGV) == 0: return start_shell()  # and not ARGF:
    all = ARGV.join(' ')
    a = ARGV[0].to_s
    # read from commandline argument or pipe!!
    # all=ARGF.read or File.read(a) except a
    # if isinstance(all,str) and all.endswith(".e"): all=File.read(`pwd`.strip+"/"+a)
    if isinstance(all, str): all = all.split("\n")

    # puts "parsing #{all)"
    for line in all:
        if not line: continue
        try:
            interpretation = parse(line.encode('utf-8'))
            # interpretation=EnglishParser().parse line.encode('utf-8')
            the.result = interpretation.the.result
            if angle.use_tree: print(interpretation.tree)
            if the.result and not not the.result and not the.result == Nil: print(the.result)
        except NotMatching as e:
            print(e)
            print('Syntax Error')
        except GivingUp as e:
            print('Syntax Error')
        except e:
            print(e)
            print(e.backtrace.join("\n"))

    print("")
