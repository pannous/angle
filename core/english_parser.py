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
import copy
import traceback
import sys
# import HelperMethods
# import Interpretation
# import HelperMethods
# import kast
import array
import interpretation
import inspect
from english_tokens import *
from kast import kast
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
    return __(nill_words)


def boolean():
    b = __('True', 'False', 'true', 'false')
    the.result = (b == 'True' or b == 'true') and TRUE or FALSE
    return the.result


def should_not_start_with(words):
    bad = starts_with(words)
    if not bad: return OK
    if bad: info("should_not_match DID match #{bad)")
    if bad: raise NotMatching(ShouldNotMatchKeyword(bad))


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
    __(result_words)
    return the.last_result


def value():
    global current_value
    if the.current_type == _token.STRING:
        return quote()
    if the.current_type == _token.NUMBER:
        return number()
    current_value = None
    no_keyword_except(constants + numbers + result_words + nill_words + ['+', '-'])
    the.result = maybe(quote) or \
                 maybe(nill) or \
                 maybe(number) or \
                 maybe(true_variable) or \
                 maybe(boolean) or \
                 maybe(constant) or \
                 maybe(it) or \
                 maybe(nod) or \
                 raise_not_matching("Not a value")
    if ___('as'):
        typ = typeNameMapped()
        the.result = call_cast(the.result, typ)
    return the.result


# def maybe(f):
#     maybe(f)
#
# def word():
#     pass
#
#
# def ruby_require(dependency):
#     pass
#
#
# def rest_of_line():
#     pass
#
#
# def maybe_token(comparison_words):
#     pass
#
#
# def _(token):
#     token(token)
#
#
# def regex():
#     pass


def __(*tokens0):
    return tokens(tokens0)


def ___(*tokens0):
    return maybe_tokens(tokens0)


    # !!!
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
    __("package context gem library".split())  # source:
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
    if re.search(r'\.js$'): return javascript_require(dependency, dependency)
    if type and "javascript script js".split().has(type): return javascript_require(dependency)
    # if not type or "ruby gem".split().has(type): return ruby_require(dependency)

    # #{escape_token t)


def regex(x):
    ## global the.string
    match = re.search(x, the.string)
    match = match or re.search(r'(?im)^\s*%s' % x, the.string)
    if not match: raise NotMatching(x)
    the.string = the.string[match.end():].strip()
    return match


def package_version():
    maybe_token('with')
    c = maybe_token(comparison_words)
    __('v'), 'version'
    c = c or maybe_token(comparison_words)
    subnode({'bigger': c})
    # current_value=
    the.result = c + " " + regex('\d(\.\d)*')[0]
    ___("or later")
    return the.result

    # (:use [native])


#
# def maybe(quote):
#     pass

@Starttokens(import_keywords)
def requirements():
    type = ___(require_types)
    __(import_keywords)
    type = type or ___(require_types)
    ___("file script header source src".split())
    ___('gem', 'package', 'library', 'module', 'context')
    type = type or ___(require_types)
    # maybe(source) maybe(really)
    dependency = maybe(quote)
    no_rollback(5)
    # maybe(list_of){packages)
    dependency = dependency or word()  # regex "\w+(\/\w*)*(\.\w*)*\.?\*?" # rest_of_line
    version = maybe(package_version)
    if interpreting(): includes(dependency, type, version)  #
    the.result = {'dependency': {'type': type, 'package': dependency, 'version': version}}
    return the.result


@Starttokens(context_keywords)
def context():
    __(context_keywords)
    context = word()
    newlines()  # part of block?
    # NL
    block()
    done()  # done context!!!
    return context


# @Starttokens('(')
def bracelet():
    subnode({'brace': _('(')})
    a = algebra()
    subnode({'brace': _(')')})
    return a


@Starttokens(operators)
def operator():
    # if current_type==_token.OP ok
    return tokens(operators)


def algebra():
    # global result
    must_contain_before(args=operators, before=[be_words, ',', ';', ':'])
    stack = {}
    stack[0] = the.result = maybe(value) or bracelet()  # any { maybe( value ) or maybe( bracelet ) )

    def lamb():
        op = operator()  # operator KEYWORD!?! ==> the.string="" BUG     4 and 5 == TROUBLE!!!
        if not op == 'and': no_rollback()
        y = maybe(value) or bracelet()
        if interpreting():  # and not angel.use_tree:
            if op == "/":  # 3'4==0 ? NOT WITH US!!:
                y = float(y)
            stack[0] = the.result = do_send(stack[0], op, y or the.result)
            # try:
            # except SyntaxError as e:
            #     error(e)
            #     # except Exception as e:
                #     raise e
        return the.result or True

    the.result = star(lamb)
    #         if angel.use_tree and not interpreting():
    #             return parent_node()
    #         # the.result=result
    #         if angel.use_tree and interpret:
    #             tree = parent_node()
    #             if tree: the.result = tree.eval_node(variableValues, the.result)  # except the.result #wasteful!!
    #         return the.result
    return the.result


def read_block(type=None):
    block = []
    start_block(type)
    while True:
        if maybe(lambda: end_block(type)): break
        block.append(rest_of_line)
    return subnode(type or {'block': block})


@Starttokens(["<html>"])
def html_block():
    return read_block('html')


@Starttokens(['js', 'script', 'javascript'])
def javascript_block():
    block = maybe(read_block('script')) or maybe(read_block('js')) or read_block('javascript')
    javascript.append(block.join(";\n"))
    return block


@Starttokens(['ruby'])
def ruby_block():
    return read_block('ruby')


def special_blocks():
    return maybe(html_block) or maybe(ruby_block) or javascript_block()

    # or end_expression #end_block #newlines

    # see read_block for RAW blocks! (</EOF> type)
    # EXCLUDING start_block & end_block !!!


def nth_item():  # Also redundant with property evaluation (But okay as a shortcut)):
    set = maybe_token('set')
    n = __(numbers + ['first', 'last', 'middle'])
    n = xstr(n).parse_integer()
    if (n > 0): n = n - 1  # -1 AppleScript style !!! BUT list[0] !!!
    raiseEnd()
    maybe_tokens(['.', 'rd', 'st', 'nd'])
    type = ___(['item', 'element', 'object', 'word', 'char', 'character'] + type_names)  # noun
    ___('in', 'of')
    l = resolve(maybe(true_variable)) or maybe(liste) or quote()  # or (expression) with parenthesis!!
    if re.search(r'^char', type):
        the.result = "".join(l).__getitem__(n)
        return the.result
    if type in type_names:
        l = l.select(lambda x: isinstance(x, type))  # or x.is_a(type)!
    elif isinstance(l, str):
        l = l.split(" ")
    the.result = l[n]  # .__getitem__(n)
    if angle.in_condition:
        return the.result
    if set and _('to'):  # or maybe_tokens(be_words): #LATER
        val = endNode()
        l[n] = do_evaluate(val)
    return the.result


def listselector():
    return maybe(nth_item) or functionalselector()

    # DANGER: INTERFERES WITH maybe(LIST), NAH, NO COMMA: {x > 3)


@Starttokens(['{'])
def functionalselector():
    _('{')
    xs = true_variable()
    crit = selector()
    _('}')
    return filter(xs, crit)

global inside_list
inside_list=False
@Starttokens(['[', '(', '{'])
def liste(check=True):
    global inside_list
    if the.current_word == ',': raise NotMatching()
    if check: must_contain_before(',',be_words+ operators+['of'])  # - ['and']
    # +[' '] ???
    start_brace = ___('[', '{', '(')  # only one!
    if not start_brace and inside_list: raise NotMatching('not a deep list')

    # all<<expression(start_brace)
    # angel.verbose=True #debug
    inside_list = True
    first = maybe(endNode)
    if not first: inside_list = False
    if not first: raise_not_matching()
    all = [first]
    def lamb():
        tokens([',', 'and'])
        e=endNode()
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
    mod = ___(self_modifying_operators)
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
        ___('"', "'")
        key = word()
        ___('"', "'")
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
    must_contain(":", "=>", {'before': ")"})
    # z=maybe(regular_json_hash) or immediate_json_hash RUBY BUG! or and  or  act very differently!
    z = maybe(regular_json_hash) or immediate_json_hash()
    return z

    # colon for types not maybe(Compatible) puts a:int vs puts {a:int) ? maybe egal
    # careful with blocks!! {puts "s") VS {a:"s")


@Starttokens('{')
def regular_json_hash():
    _('{')
    maybe_token(':') and no_rollback()  # {:a:.) Could also mean list of maybe(symbols) Nah
    h = {}

    def lamb():
        if len(h) > 0: ___(';', ',')
        quoted = ___('"', "'")
        key = word()
        if quoted: __('"', "'")
        # Property versus hash !!
        ___('=>', '=') or starts_with("{") or ___('=>', ':')
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


def evaluate_index(args):
    pass


def starts_with_(param):
    return maybe(lambda: starts_with(param))


def immediate_json_hash():  # a:{b) OR a{b():c)):
    # must_contain_before ":{", ":"
    w = word()  # expensive
    # maybe(lambda:starts_with("={")) and maybe_token('=') or:c)
    starts_with_("{") or _('=>')  # or _(':') disastrous :  BLOCK START!
    no_rollback()
    r = regular_json_hash()
    return {str(the.result): r}  # AH! USEFUL FOR NON-symbols !!!


# todo PYTHONBUG ^^

def maybe_cast(context):
    if not maybe_token('as'): return False
    typ=typeNameMapped()
    return call_cast(context,typ)

def maybe_algebra(context):
    op=maybe_tokens(operators)
    if not op: return False
    z=expression()
    return do_send(context,op,z)

def postoperations(context):
    return maybe_cast(context) or maybe_algebra(context) or context

def quick_expression():
    if the.current_word in the.token_map:
        fun = the.token_map[the.current_word]
        the.result = maybe(fun)
        if the.current_word in operators or the.current_word in special_chars:  # - ';'
            raise_not_matching("quick_expression too simplistic")
        return the.result
    return False


def expression(fallback=None):
    start = pointer()
    the.result = ex = quick_expression() or \
                      maybe(algebra) or \
                      maybe(json_hash) or \
                      maybe(evaluate_index) or \
                      maybe(listselector) or \
                      maybe(liste) or \
                      maybe(evaluate_property) or \
                      maybe(selfModify) or \
                      maybe(endNode) or \
                      raise_not_matching("Not an expression: "+pointer_string()) #and print_pointer(True)
                      # maybe(method_call) or \
    # maybe(swift_hash) or \

    ex=postoperations(ex) or ex
    check_comment()

    if not interpreting():
        # if not angle.use_tree:
        #     return (start, pointer())
        return the.result # AST NODE, Hopefully

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
    # subnode (expression: ex)
    if ex == ZERO: ex = 0  # HERE ?
    the.result = ex
    return the.result


def piped_actions():
    if the.in_pipe: return False
    must_contain("|")
    the.in_pipe = True
    a = statement()
    token('|')
    no_rollback()
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
    raiseNewline()  # maybe(really) maybe(why)
    if checkNewline(): return NEWLINE
    x = maybe(loops) or \
        maybe(if_then_else) or \
        maybe(action_if) or \
        maybe(once) or \
        maybe(piped_actions) or \
        maybe(declaration) or \
        maybe(setter) or \
        maybe(returns) or \
        maybe(requirements) or \
        maybe(method_definition) or \
        maybe(assert_that) or \
        maybe(breaks) or \
        maybe(new) or \
        maybe(action) or \
        maybe(expression) or \
        raise_not_matching("Not a statement")
    # AS RETURN VALUE! DANGER!
    if x:
        the.result = x
    else:
        print "WTF?"
    check_comment()
    return the.result

    # one :action, :if_then ,:once , :looper
    # any{action  or  if_then  or  once  or  looper)


# nice optional return 'as':
# define sum x,y as:
#     x+y
# end
# define the sum of numbers x,y and z as number x+y+z
@Starttokens(method_tokens)
def method_definition():
    # annotations=maybe(annotations)
    # modifiers=maybe(modifiers)
    tokens(method_tokens)  # how to
    no_rollback()
    name = maybe(noun) or verb  # integrate or word
    # obj=maybe( endNode ) # a sine wave  TODO: invariantly get as argument book.close==close(book)
    brace=maybe_token('(')
    args = []
    def arguments():
        angle.in_params = True
        a = param(len(args))
        maybe_token(',')
        args.append(a)
        return a
    star(arguments)  # i.e. 'over an interval i' 'from a to b' 'int x, int y=7'

    return_type = ___('as') and maybe(typeNameMapped) or None
    return_type = ___( 'return', 'returns', 'returning', '=', '->') and maybe(typeNameMapped) or return_type

    angle.in_params = False
    if brace: token(')')
    dont_interpret()
    b = action_or_block()  # define z as 7 allowed !!!
    f = Function(name=name, arguments=args, return_type=return_type, body=b)
    # ,modifiers:modifiers, annotations:annotations
    the.methods[name] = f or parent_node() or b
    # # with args! only in tree mode!!
    the.params.clear()
    return f or name


def execute(command):
    import os
    os.system(command)
    # NOT: exec(command) !! == eval


@Starttokens('bash')
def bash_action():
    # import bindingsr'shell'bash-commands
    ok = starts_with(['bash'] + bash_commands)
    if not ok: raise_not_matching("no bash commands")
    remove_tokens('execute', 'command', 'commandline', 'run', 'shell', 'shellscript', 'script', 'bash')
    command = maybe(quote)  # danger bash "hi">echo
    command = command or rest_of_line
    subnode({'bash': command})
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
    if ok != "OK" and ok != False:  # and ok !=FALSE:
        the.result = ok
    else:
        the.result = o
    return the.result


def action_if():
    must_contain('if')
    a = action_or_expressions
    _('if')
    c = condition_tree()
    if interpreting():
        if check_condition(c):
            return do_execute_block(a)
        else:
            return OK  # false but block ok!
    return a


def if_then():
    __(if_words)
    no_rollback()  # 100
    c = condition_tree()
    if c == None: raise InternalError("no condition_tree")
    # c=condition()
    maybe_token('then')
    maybe_token(':')
    dont_interpret()  # if not c  else: dont do_execute_block twice!
    b = expression_or_block()  # action_or_block()
    maybe_newline()
    # o=maybe(otherwise)
    # if use_block: b=block
    # if not use_block: b=statement
    # if not use_block: b=action()
    allow_rollback()
    if c == False: return c
    if interpreting():
        if check_condition(c):
            return do_execute_block(b)
        else:
            return OK  # o or  false but block ok!
    return b


def future_event():
    if the.current_word.endswith("ed"): # beeped etc
        return word()

@Starttokens(once_words)
def once_trigger():
    __(once_words)
    no_rollback()
    dont_interpret()
    c = maybe(future_event) or condition() # eval later, variables might not be set yet!!!
    maybe_token('then')
    b=action_or_block()
    return interpretation.add_trigger(c, b)

def _do():
    return maybe(lambda: _('do'))


@Starttokens('do')
def action_once():
    if not _do(): must_contain(once_words) #and
    no_rollback()
    maybe_newline()
    b = action_or_block()
    # _do=maybe_token('do')
    # dont_interpret()
    # if not _do: b=action()
    # if _do: b=block and maybe(done)
    __(once_words)
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
    call = __(invoke_keywords)
    if call: no_rollback()
    ruby_method = ___(builtin_methods + core_methods)
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
    subnode({'method': ruby_method})  # why not maybe(auto})?
    subnode({'args': args})
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




def get_method(method, clazz=object, assume=False):
    if not callable(method):
        if method in the.methods:
            method = the.methods[method]
        if clazz in the.moduleMethods:
            if method in the.moduleMethods[clazz]:
                clazz=get_module(clazz)
        elif not isinstance(clazz, type):  # lol:
            clazz = type(clazz)
        if method in dir(clazz):
            found=getattr(clazz, method) # NOT __get_attr__!!!
            the.methods[method]=found
            return found
    if not callable(method):
        raise_not_matching(method + "not callable")
    return method

# In Python 2.7, built-in function objects such as print()
# simply do not have enough information for you to discover what arguments they support!!
def has_args(method, clazz=object, assume=False):
    if method in ['invert', '++', '--']:  # increase by 8: todo all intransitive verbs with objects!
        return False
    method=get_method(method,clazz)
    try:
        args, varargs, varkw, defaults = inspect.getargspec(method)
        return len(args) + (defaults and len(defaults) or 0) + (varkw and len(varkw) or 0) > 0 or assume
    except:
        return assume


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
    if not the.allMethods:
        constructors = the.classes.keys() + type_names
        the.allMethods=constructors+c_methods+methods.keys()+core_methods+builtin_methods+the.methodToModulesMap.keys()
    return the.allMethods

def is_method(name):
    return name in all_methods() or maybe(verb)


def import_module(module_name):
    try:
        print("TRYING MODULE "+module_name)
        import importlib
        importlib.import_module(module_name)
        module = sys.modules[module_name]
        # moduleMethods=dir(module)
        # methods+=moduleMethods #ONCE!!
        moduleMethods=the.moduleMethods[module_name]
        # import inspect
        return module,moduleMethods
    except Exception as e:
        raise e


def subProperty(context):
    maybe_token(".")
    property = maybe_tokens(dir(context))
    # the.moduleMethods[module_name] etc!
    if not property or callable(property) or is_method(property):
        return context,property # save methods for later!
    property=maybe_token(".") and subProperty(property) or property
    return property,None


def true_method():
    no_keyword()
    should_not_start_with(auxiliary_verbs)
    xmodule= maybe_tokens(the.moduleNames)
    if xmodule:
        module,moduleMethods=import_module(xmodule)
        obj,name = subProperty(module)
        if obj==module: obj=None
        if obj: moduleMethods+=dir(obj)
        name = name or maybe_tokens(moduleMethods)
    else:
        obj = subProperty(None)
        name = maybe_tokens(all_methods()) or maybe(verb)
    if not name:
        raise NotMatching('no method found')
        # if the.current_word.endswith("ed"):
        # sorted files -> sort files ?
    return xmodule,obj,name  # .to_s





    # maybe(ruby_method_call)  or
# read mail or module read mail or object read mail bla(1) or a.bla(1)  vs ruby_method_call !!
def method_call(obj=None):
    # verb_node
    module,obj, method = true_method()
    start_brace = ___('(', '{')  # '[', list and closure danger: index)
    # todo  ?merge with maybe(liste)
    if start_brace: no_rollback()
    if module or obj or is_object_method(method):  # todo  not has_object(method) is_class_method:
        obj = obj or None # globals
    else:
        maybe_token('of')
        if angle.in_args: obj = maybe(maybe(nod))
        if not angle.in_args:
            obj = maybe(nod) or maybe(liste) # danger: liste vs args below
        maybe_token(',')
        # print(sorted files)
        # if not in_args: obj=maybe( maybe(nod)  or  maybe(list)  or  expression )

    assume_args = True  # not starts_with("of")  # True    #<< Redundant with property eventilation!
    args=None
    if has_args(method, module or obj, assume_args):
        current_value = None
        angle.in_args = True
        args=[]
        def call_args():
            if len(args)>0:__([',','and'])
            args.append(call_arg())
            return args
        args = star(call_args)
        if not args: args = obj;obj = None
    else:
        more = maybe_token(',')
        if more: obj = [obj] + liste(False)

    angle.in_args = False
    if start_brace == '(': _(')')
    if start_brace == '[': _(']')
    if start_brace == '{': _(')')
    if not interpreting():
        if method=="puts" or method=="print":
            # return kast.Print(dest=None,values=args,nl=True) # hack!
            import ast
            return ast.Print(dest=None, values=[args], nl=True)#lineno=1, col_offset=20
            # return kast.Print(dest=None, values=[args], nl=True)#lineno=1, col_offset=20
            # return kast.Print(None,args,True) # hack!
        return FunctionCall(name=method, arguments=args, object=obj)
    the.result = do_send(obj, method, args)
    return the.result


def tokens_(tokens0):
    return ___(tokens0)


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
    if interpreting(): the.result = execute("/usr/bin/osascript -ss -e $'%s'"%the.result)
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
    pass #see class!
    # class Color(shared Integer rgba) {

@Starttokens(['create', 'new', 'init'])
def new():
    ___('create', 'init')  # define
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
    __('return', 'returns')
    no_rollback()
    the.result = maybe(expression)
    if interpreting():
        the.params.clear()
    return the.result


@Starttokens(flow_keywords)
def breaks():
    return __(flow_keywords)


#	 or 'say' x=(.*) -> 'bash "say $quote"'
def action():
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
    if not interpreting():
        if not angle.use_tree: return (start, pointer())
    return the.result  # value or AST


def action_or_block():  # expression_or_block ??):
    _start=___(start_block_words)
    if _start:
        # allow_rollback()
        if maybe_newline():
    # 1) def x do \n block \n (end)
            ab= block()
        else:
    # 2) def x do action (end)
            ab= action()
    else:
        if maybe_newline():
            # allow_rollback()
    # 3) def x \n block \n (end)
            ab=block()
        else:
            raise_not_matching("expecting action or block start")
    maybe_newline() or end_block(_start)
    return ab


def expression_or_block():  # action_or_block):
    a = maybe(action) or maybe(expression)
    if a: return a
    b = block()
    return b


def end_block(type=None):
    return done(type)


def done(_type=None):
    if _type and maybe(lambda: close_tag(_type)): return OK
    if checkEndOfLine(): return OK
    checkNewline()
    ok = tokens(done_words)
    if _type: token(_type)
    ignore_rest_of_line()
    return ok


# used by done / end_block()
def close_tag(type):
    _('</')
    _(type)
    _('>')
    return type


def do_call_function(f, args=None):
    if (callable(f)):
        if (args):
            return f(args)
        else:
            return f()
    return do_send(f.object, f.name, args or f.arguments)


def do_execute_block(b, args={}):
    if not interpreting(): return
    global variableValues
    if not b: return False
    if b == True: return True
    if isinstance(b, FunctionCall): return do_call_function(b)
    if callable(b): return do_call_function(b, args)
    if isinstance(b, kast.AST):
        exec (b)  # TODO ARGS???
    if isinstance(b, TreeNode): b = b.content
    if not isinstance(b, str): return b  # OR :. !!!
    block_parser = the  # EnglishParser()
    block_parser.variables = variables
    block_parser.variableValues = variableValues
    if not isinstance(args, dict): args = {'arg': args}
    for arg, val in args.iteritems():
        if arg in block_parser.variables:
            v = block_parser.variables[arg]
            # v = v.clone
            v.value = val
            block_parser.variables[str(arg)] = v  # to_sym todo NORM in hash!!!
        else:
            block_parser.variables[str(arg)] = Variable(name=arg, value=val)
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
    no_rollback()
    ___('around', 'about')
    # import chronic_duration
    # WAH! every second  VS  every second hour WTF ! lol
    n = maybe(number) or 1  # every [1] second
    _to = maybe(lambda: tokens(['to', 'and']))
    if _to: _to = number()
    _unit = __(time_words)  # +["am"]
    _to = _to or ___('to', 'and')
    if _to: _to = _to or maybe(number)
    # return events.Interval(_kind, n, _to, _unit)


def collection():
      return maybe(ranger) or \
             maybe(true_variable) or\
             action_or_expressions()

@Starttokens('for')
def for_i_in_collection():
    must_contain('for')
    maybe_token('repeat')
    ___('for', 'with')
    maybe_token('all')
    v = variable()  # selector() !
    ___('in', 'from')
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
        oldType=var.type
    else:
        oldType = None
    # try:
    if oldType and type and not issubclass(type,oldType): # FAIL:::type <= oldType:
        raise WrongType(var.name+" has type "+str(oldType)+", can't set to "+str(type))
    if oldType and var.type and not issubclass(var.type,oldType):
        raise WrongType(var.name+" has type "+str(oldType)+", cannot set to "+str(var.type))
    if type and var.type and not (issubclass(var.type,type) or issubclass(type,var.type)): #DOWNCAST TODO
        raise WrongType(var.name+" has type "+str(var.type)+", Can't set to "+str(type))
    var.type = type #ok: set


def assure_same_type_overwrite(var, val):
    oldType = var.type
    oldValue = var.value
    if oldType and not isinstance(val, oldType):
        raise WrongType("OLD: %s %s VS %s %s"%(oldType,oldValue, type(val),val))
    if var.final and var.value and not val == var.value:
        raise ImmutableVaribale("OLD: %s %s VS %s %s"%(oldType,oldValue, type(val),val))
    var.value=val


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
    must_contain_before([".","'s"], xlist(special_chars)-'.')
    no_rollback()
    owner = class_constant
    owner = get_obj(owner) or variables[true_variable(False)].value  # reference
    _('.')
    properti = word
    return Property(name=properti, owner=owner)


# difference to setter? just public int var const test
def declaration():
    should_not_contain('=')
    # must_contain_before  be_words+['set'],';'
    a = the_()
    mod = maybe_tokens(modifiers)
    type = typeNameMapped()
    ___('var', 'val', 'value of')
    mod = mod or maybe_tokens(modifiers)  # public static :.
    var = maybe(property) or variable(a,ctx=kast.Store())
    if var.type:
        assure_same_type(var, type)
    else:
        var.type = type
    var.final = mod in const_words
    var.modifier = mod
    return var


@Starttokens(let_words)
def setter():
    must_contain_before(args=be_words + ['set'], before=['>', '<', '+', '-', '|', '/', '*'])
    _let = ___(let_words)
    if _let: no_rollback()
    a = maybe(_the)
    mod = maybe_tokens(modifiers)
    _type = maybe(typeNameMapped)
    ___('var', 'val', 'value of') # same as let? don't overwrite?
    mod = mod or maybe(modifier)  # public static :.
    var = maybe(property) or variable(a,ctx=kast.Store())
    # _22("always") => pointer()
    setta = ___('to') or be()  # or not_to_be 	contain -> add or create
    # val = maybe(adjective) or expressions()
    val = expression()
    _cast=___(["as","kast","kast to","kast into","kast as"]) and typeNameMapped()
    if _cast:
        if interpreting():
            val=do_cast(val,_cast)
        else: _type=_cast #todo
    allow_rollback()
    if setta in [ 'are' ,'consist of' ,'consists of']: val = flatten(val)
    var.typed=_type or var.typed or 'typed'==mod # in [mod]

    assure_same_type(var, _type or type(val))
    assure_same_type_overwrite(var, val)
    # if var.typed:
    #     var.type = _type #ok: set

    if not var.name in variableValues or mod != 'default':# and interpreting():
        the.variableValues[var.name] = val
        the.variables[var.name] = var
        var.value = val

    var.final = mod in const_words
    var.modifier = mod
    the.variableTypes[var.name]=var.type
    if isinstance(var, Property): var.owner.send(var.name + "=", val)  # todo
    # the.result = var
    # the.result = val
    # end_expression via statement!
    # if interpret: return var

    subnode({'var': var})
    subnode({'val': val})
    the.token_map[var.name] = true_variable
    if not interpreting(): return kast.Assign(kast.Name(var.name, kast.Store()), val)

    if interpreting() and val != 0: return val
    return var
    # if angel.use_tree: return parent_node()
    # if not interpret: return old-the.string
    #  or 'to'
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


def variable(a=None,ctx=kast.Load()):
    a = a or maybe_tokens(articles)
    if a != 'a': a = None  # hack for a variable
    typ = maybe(typeNameMapped)  # DOESN'T BELONG HERE! why not?
    # ___(["name","label"]) #ignore?
    p = ___(possessive_pronouns)
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
    if isinstance(ctx,kast.Param): # STORE IN CONTEXT (i.e. def x(int y)): y+3
        # todo split name!  width w, etc!!
        param=Variable(name=name, type=typ or None,ctx=ctx)
        the.params[name]=param
        return param
    if isinstance(ctx,kast.Load):
        if name in the.variables:
            return the.variables[name]
        if name in the.params:
            return the.params[name]
        else: raise raise_not_matching("Unknown variable "+name)
    # typ=_(":") and typeNameMapped() or typ # postfix type int x vs x:int VERSUS def x:\n !!!!

    if isinstance(ctx,kast.Store):
        if name in the.variableValues:
            oldVal = the.variableValues[name] #  default or overwrite -> WARN? return OLD?
        else:
            oldVal = None
        the.result = Variable(name=name, type=typ or None, scope=current_node(), module=current_context(), value=oldVal,ctx=ctx)
        the.variables[name] = the.result
        return the.result
    raise Exception("Unknown variable context "+ctx)


word_regex = r'^\s*[a-zA-Z]+[\w_]*'
def word(include=[]):
    ## global the.string
    # danger:greedy!!!
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


def should_not_contain(words):
    old = the.current_token
    words = flatten(words)
    while not checkEndOfLine() and the.current_word!=';':
        for w in words:
            if w == the.current_word:
                raise ShouldNotMatchKeyword(w)
        next_token()
    set_token(old)
    return OK


def must_not_start_with(words):
    should_not_start_with(words)


def todo(x):
    raise NotImplementedError(x)


def do_cast(x, typ):
    if isinstance(typ, float): return float(x)
    if isinstance(typ, int): return int(x)
    if typ==int: return int(x)  # todo!
    if typ==xint: return int(x)  # todo!
    if typ=="int": return int(x)
    if typ=="integer": return int(x)
    if typ==str: return str(x)
    if typ==xstr: return str(x)
    if typ=="str": return str(x)
    if typ=="string": return str(x)
    todo("do_cast")
    return x


def call_cast(x, typ):
    if interpreting(): return do_cast(x, typ)
    return x #FunctionCall(name('cast'


def nod():  # options{generateAmbigWarnings=false)):
    return maybe(number) or \
           maybe(quote) or \
           maybe(true_variable) or \
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
    a=variable(a=None,ctx=kast.Param())
    return Argument(preposition=pre, name=a.name, type= a.type, position= position)

# VALUES given to CALLED method, NOT in declaration! # SEE PARAM ^^^!!
def call_arg(position=1):
    pre = maybe_tokens(prepositions) or ""  # might be superfluous if calling"BY":
    ___(articles)
    # allow_rollback()
    a = maybe(variable)
    if a: return Argument(name=a.name, type=a.type, preposition=pre, position=position, value=a)
    type = maybe(typeNameMapped)
    if look_ahead('='):
        name = maybe(word)
        maybe_token('=')
    else:
        name=None
    value = endNode()
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
    __('that', 'who', 'which')
    star(adverb)  # only
    comp = verb  # live
    maybe_token('s')  # lives
    s = star(lambda: maybe(adverb) or maybe(preposition) or maybe(endNoun))
    return comp


# more easisly
def more_comparative():
    __('more', 'less', 'equally')  # comparison_words
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
    __('that'), 'which', 'who'
    be()
    # bigger than live
    comp = maybe(adjective)
    comp or maybe(compareNode) or gerund()  # whining
    return comp


# things that I saw yesterday
def that_object_predicate():
    tokens('that', 'which', 'who', 'whom')
    maybe(pronoun) or endNoun
    verbium
    s = star(lambda: maybe(adverb) or maybe(preposition) or maybe(endNoun))
    return s


def that():
    filter = maybe(that_do) or maybe(that_are) or whose()
    return filter


def where():
    tokens('where')  # NOT: ,'who','whose','which'
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


def comparation_tree():
    Todo()


# is more or less
# is neither :. nor :.
# are all smaller than :.
# Comparison phrase
def comparation():
    # danger: is, is_a
    eq = ___(be_words)
    maybe_token('all')
    start = pointer()
    ___('either', 'neither')
    _not = ___('not')
    maybe(adverb)  # 'quite','nearly','almost','definitely','by any means','without a doubt'
    if (eq):  # is (equal) optional:
        comp = ___(comparison_words)
    else:
        comp = tokens(comparison_words)
        no_rollback()

    if eq: maybe_token('to')
    ___('and', 'or', 'xor', 'nor')
    ___(comparison_words)  # bigger or equal != different to condition_tree True or false
    # comp = comp and pointer() - start or eq
    # if Jens.smaller then ok:
    maybe_token('than')  # , 'then' #_22'then' ;) danger:
    subnode({'comparation': comp})
    return comp or eq


def either_or():
    ___('be', 'is', 'are', 'were')
    tokens('either', 'neither')
    maybe(comparation)
    value
    ___('or', 'nor')
    maybe(comparation)
    return value


def is_comparator(c):
    ok = c in comparison_words or \
         c in class_words
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
            if not the.result and ['all', 'each', 'every', 'everything', 'the whole'].matches(quantifier): break
            if the.result and ['either', 'one', 'some', 'few', 'any'].contains(quantifier): break
            if the.result and ['no', 'not', 'none', 'nothing'].contains(quantifier):
                negated = not negated
                break

            if the.result: count = count + 1

        min = len(lhs) / 2
        if quantifier == 'most' or quantifier == 'many': the.result = count > min
        if quantifier == 'at least one': the.result = count >= 1
        # todo "at least two","at most two","more than 3","less than 8","all but 8"
        # if not the.result= not the.result
        if not the.result:
            verbose("condition not met %s %s %s"%(lhs,comp,rhs))

        return the.result
    except Exception as e:
        # debug x #soft message
        error(e)  # exit!
    return False


def check_condition(cond=None, negate=False):
    if cond == None: raise InternalError("NO Condition given!")
    if cond == True or cond == 'True': return True
    if cond == False or cond == 'False': return False
    if not isinstance(cond, (TreeNode, str, Condition)):  return cond
    # cond==None  or
    # if cond==false: return false
    try:
        # else: use state variables todo better!
        if isinstance(cond, Condition):
            lhs = cond.lhs
            rhs = cond.rhs
            comp = cond.comp
        if isinstance(cond, TreeNode):
            lhs = cond['expressions']
            rhs = cond.all('expressions').reject(lambda x: x == False)[-1]
            comp = cond.all('comparation').reject(lambda x: x == False)[-1]
            # comp=cond[:comparation]

        if not comp: return False
        if lhs and isinstance(lhs, str): lhs = lhs.strip()  # None==None ok
        if rhs and isinstance(rhs, str): rhs = rhs.strip()  # " a "=="a" !?!?!? NOOO! maybe(why)
        comp = comp.strip()
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
            verbose("condition not met %s %s %s"%(lhs,comp,rhs))
        return the.result
    except IgnoreException as e:
        # debug x #soft message
        error(e)  # exit!

    return False


def action_or_expressions(fallback=None):
    return maybe(action) or expression(fallback)
    # maybe(expressions(fallback))
    # expressions(fallback)

    # all of 1,2,3
    # all even numbers in [1,2,3,4]
    # one element in 1,2,3


def element_in():
    must_contain_before(["of","in"],special_chars)
    n = noun()
    __('in' "of")
    return n


def condition():
    start = pointer()
    brace = maybe_token('(')
    negated = maybe_token('not')
    if negated: brace = brace or maybe_token('(')
    # a=endNode:(
    quantifier = ___(quantifiers)  # vs selector()!
    filter=None
    if quantifier: filter=maybe(element_in) # all words in
    # angel.in_condition=True
    lhs = action_or_expressions(quantifier)
    _not = False
    comp = use_verb = maybe(verb_comparison)  # run like , contains
    if not use_verb: comp = maybe(comparation)
    # allow_rollback # upto maybe(where)?
    if comp: rhs = action_or_expressions(None)
    if brace: _(')')
    negate = (negated or _not) and not (negated and _not)
    subnode({'negate': negate})
    # angel.in_condition=False # WHAT IF raised !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!??????!
    if not comp: return lhs
    # 1,2,3 are smaller 4  VS 1,2,4 in 3
    if isinstance(lhs, list) and not maybe(lambda: lhs.respond_to(comp)) and not isinstance(rhs, list):
        quantifier = quantifier or "all"
    # if not comp: return  negate ?  not a : a
    cond = Condition(lhs=lhs, comp=comp, rhs=rhs)
    if interpreting():
        if quantifier:
            if negate:
                return (not check_list_condition(quantifier))
            else:
                return check_list_condition(quantifier)
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
def condition_tree(recurse=True):
    brace = maybe_token('(')
    maybe_token('either')  # todo don't match 'either of'!!!
    # negate=maybe_token('neither')
    if brace and recurse: c = condition_tree(False)
    if not brace: c = condition()
    cs = [c]  # lamda hack

    def lamb():
        op = __('and', 'or', 'nor', 'xor', 'nand', 'but')
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
    must_contain('else', 'otherwise')
    pre=___('else', 'otherwise')
    maybe_token(':')
    e = expression()
    not pre or ___('else', 'otherwise') and newline()  #  suffix style: "return 1 otherwise"
    return e


# todo  I hate to :.
def loveHateTo():
    ___('would', "wouldn't")
    ___('do', 'not', "don't")
    __(['want', 'like', 'love', 'hate'])
    return _('to')


def gerundium():
    verb
    return token('ing')


def verbium():
    return comparison or verb and adverb  # be or have or


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
    modules = dict(sys.modules) #dictionary changed size during iteration
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
    x=x0.lower()
    if x == "char": return xchar
    if x == "character": return xchar
    # if x == "class": return type #DANGER!
    if x == "type": return type
    if x == "word": return str #DANGER!
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
    if x == "tuple": return tuple #list

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
    pr = ___(prepositions)  # wrapped in
    if pr: maybe(endNode)
    current_value = match[1]
    return current_value


def postjective():  # 4 squared , 'bla' inverted, buttons pushed in, mail read by James):
    ## global the.string
    match = re.search(r'^\s*(\w+)ed', the.string)
    if not match: return False
    the.string = the.string[match.end():]
    if not checkEndOfLine(): pr = ___(prepositions)  # wrapped in
    if pr and not checkEndOfLine(): maybe(endNode)  # silver
    current_value = match[1]
    return current_value

    # TODO: big cleanup!
    # see resolve, eval_string,  do_evaluate, do_evaluate_property, do_s


def get_class(x):
    if isinstance(x,Variable):return x.type
    return type(x) # unless AST/overwritten etc!!!


def do_evaluate_property(attr, node):
    # todo: REFLECTION / eval NODE !!!
    if not attr: return False
    verbose("do_evaluate_property '"+str(attr)+"' in "+ str(node))
    the.result = None  # delete old!
    if attr in dir(node): # y.__att
        return node.__getattribute__(attr)
    if attr in [ 'type', 'class','kind']:
        return get_class(node)
    if isinstance(node,list):
        return map(lambda x:do_evaluate_property(attr,x),node)
    if isinstance(attr, _ast.AST):
        return todo("do_evaluate_property")
    return the.result

# Strange method, see resolve, do_evaluate
def eval_string(x):
    if not x: return None
    if isinstance(x,Variable):return x.value
    if isinstance(x, extensions.File): return x.to_path
    # if isinstance(x, str): return x
    # and x.index(r'')   :. notodo :.  re.search(r'^\'.*[^\/]$',x): return x
    # if maybe(x.is_a) Array: x=x.join(" ")
    if isinstance(x, list) and len(x) == 1: return x[0]
    if isinstance(x, list): return x
    # if maybe(x.is_a) Array: return x.to_s
    return do_evaluate(x)

def eval_ast(my_ast):
    import codegen
    import ast
    try:
        source=codegen.to_source(my_ast)
        print(source) # => CODE
        if not type(my_ast)==ast.Module:
            my_ast= _ast.Module(body=my_ast)
        my_ast=ast.fix_missing_locations(my_ast)
        code=compile(my_ast, 'file', 'exec')
        # code=compile(my_ast, 'file', 'exec')
        exec(code)
    except Exception as e:
        print(my_ast)
        ast.dump(my_ast)
        raise e,None,sys.exc_info()[2]

# see resolve eval_maybe(the.string)??
def do_evaluate(x, _type=None):
    if not interpreting(): return x
    try:
        if isinstance(x, type): return x
        if isinstance(x, list) and len(x) == 1: return do_evaluate(x[0])
        if isinstance(x, list) and len(x) != 1: return x
        if isinstance(x, Variable):
            # if not x.name in the.variableValues:
            #     raise InternalError("variableValues broken")
            return x.value or the.variableValues[x.name]
        if isinstance(x, kast.AST): eval_ast(x)
        if x == ZERO: return 0
        if x == TRUE: return True
        if x == FALSE: return FALSE
        if x == NILL: return None
        if isinstance(x, str):
            if _type and isinstance(_type, extensions.Numeric): return float(x)
            if x in the.variableValues: return the.variableValues[x]
        if x == True or x == False: return x
        if isinstance(x, str) and _type and _type == float: return float(x)
        # if isinstance(x, str) and type and is_a(type,float): return float(x)
        if isinstance(x, TreeNode): return x.eval_node(variableValues)
        if isinstance(x, str) and match_path(x): return resolve(x)
        # :. todo METHOD / Function!
        # if isinstance(x, extensions.Method): return x.call  #Whoot
        # if callable(x): return x()  # Whoot
        if isinstance(x, str): return x
        if isinstance(x, str): return eval(x)  # except x
        return x  # DEFAULT!
    except (TypeError, SyntaxError)as e:
        print("ERROR #{e) in do_evaluate #{x)")
        raise e,None,sys.exc_info()[2]
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
    return method == 'increase' or method == 'decrease' or re.search(r'\!$', str(method))


#
# def self_modifying(method):
#     EnglishParser.self_modifying(method)  # -lol

def is_math(method):
    ok= method in operators
    return ok


def do_math(a, op, b):
    # a = float(a)
    # b = float(b)
    if op == '+': return a + b
    if op == 'plus': return a + b
    if op == 'add': return a + b
    if op == '-': return a - b
    if op == 'minus': return a - b
    if op == 'substract': return a - b
    if op == '/': return a / b
    if op == 'devided': return a / b
    if op == 'devided by': return a / b
    if op == '%': return a % b
    if op == 'modulo': return a % b
    if op == '*': return a * b
    if op == 'times': return a * b
    if op == 'multiplied by': return a * b
    if op == '**': return a ** b
    if op == 'to the': return a ** b
    if op == 'power': return a ** b
    if op == '&&': return a & b
    if op == '&': return a & b
    if op == '^': return a ^ b
    if op == '|': return a | b
    if op == '||': return a | b
    raise Exception("UNKNOWN OPERATOR " + op)

def isbound(method):
    # return hasattr(m, '__self__')
    return method.__self__ is not None
 # the new synonym for im_self is __self__, and im_func is also available as __func__.

def instance(bounded_method):
    return bounded_method.im_self

def findMethod(obj0, method0, args0):
    method=method0

    if isinstance(method, list) and len(method) == 1: method = method[0]
    if method in the.methods:
        method = the.methods[method]
    if method in locals():
        return locals()[method];
    if globals in locals():
        return locals()[globals];
    if method in dir(obj0):
        method=getattr(obj0, method)  # NOT __getattribute__(name)!!!!
        # method=method.__get__(obj0, ex)
    elif type(obj0) in angle.extensionMap:
        ex=angle.extensionMap[type(obj0)]
        if method in dir(ex):
            method=getattr(ex, method)  # NOT __getattribute__(name)!!!!
            method=method.__get__(obj0, ex)
    elif type(obj0)==type and  method in obj0.__dict__:
        method=obj0.__dict__[method] #class
        method.__get__(None, obj0) #The staticmethod decorator wraps your class and implements a dummy __get__
        # that returns the wrapped function as function and not as a method
    return method
        # if callable(method):method(args)

# INTERPRET only,  todo cleanup method + argument matching + concept
def do_send(obj0, method0, args0):
    if not interpreting(): return False
    if not method0: return False

    # try direct first!
    method=findMethod(obj0,method0,args0)
    method_name = callable(method) and str(method) or method0  # what for??

    if isinstance(method, Function):
        the.result = do_execute_block(method.body, args0)
        return the.result
    # if callable(method): obj = method.owner no such concept in Python !! only as self parameter

    args = args0
    if isinstance(args, Argument): args = args.name_or_value
    # if isinstance(args, list) and isinstance(args[0], Argument): args = args.map(name_or_value)
    args = eval_string(args)  # except NoMethodError
    if args and isinstance(args, str): args = xstr(args).replace_numerals()
    if (args and isinstance(args, list) and len(args) > 0 and args[0] == 'of'): return evaluate_property(args[1], obj0)
    if (method == 'of'): return evaluate_property(args, obj0)

    # if args and maybe(obj.respond_to) + " " etc!: args=args.strip()
    obj = resolve(obj0)

    if not obj:
        if args: return method(args)
        else: return method()

    if not args and not callable(method) and method in dir(obj):
        return obj.__getattribute__(method)

    if (args and args[0] == 'of'):# and has_args(method, obj)):
        if not callable(method) and method in dir(obj):
            return obj.__getattribute__(method)
        else:
            method(args[1]) # square of 7

    if is_math(method_name):
        return do_math(obj, method_name, args)

    if not callable(method):
        raise MethodMissingError(type(obj), method, args)

    if not args or not has_args(method, obj, False):
        if method.im_self:
            the.result = method() or NILL
        else:
            the.result = method(obj) or NILL
    elif has_args(method, obj, True):
        if method.im_self:
            the.result = method(args) or NILL
        else:
            the.result = method(obj, args) or NILL
        # the.result = method(obj, *args) or NILL
        # the.result = method([obj]+args) or NILL try!
    else:the.result = MethodMissingError

    # todo: call FUNCTIONS!
    # puts object_method.parameters #todo MATCH!

    # => selfModify todo
    if (obj0 or args) and self_modifying(method):
        name = str(obj0 or args)  # .to_sym()  #
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
    if isinstance(b, int) and re.search(r'^\+?\-?\.?\d', str(a)): a = int(a) # EEK PHP STYLE !? REALLY??
    if isinstance(a, int) and re.search(r'^\+?\-?\.?\d', str(b)): b = int(b) # EEK PHP STYLE !? REALLY??
    if isinstance(comp, str): comp = comp.strip()
    if comp == 'smaller' or comp == 'tinier' or comp == 'comes before' or comp == '<':
        return a < b
    elif comp == 'bigger' or comp == 'larger' or comp == 'greater' or comp == 'comes after' or comp == '>':
        return a > b
    elif comp == 'smaller or equal' or comp == '<=':
        return a <= b
    elif comp == 'bigger or equal' or comp == '>=':
        return a >= b
    elif comp in be_words:
        return a == b
    elif class_words.index(comp):
        return issubclass(a , b) or isinstance(a, b) # issubclass? a bird is an animal OK
        # if b.isa(Class): return a.isa(b)
    elif be_words.index(comp) or re.search(r'same', comp):
        return isinstance(a, b) or a.__eq__(b)
    elif comp == 'equal' or comp == 'the same' or comp == 'the same as' or comp == 'the same as' or comp == '=' or comp == '==':
        return a == b  # Redundant
    else:
        try:
            return a.send(comp, b)  # raises!
        except:
            error('ERROR COMPARING ' + str(a) + ' ' + str(comp) + ' ' + str(b))
            return a.send(comp + '?', b)


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


def simpleProperty():
    must_contain_before(".",special_chars+keywords)
    module=token(the.moduleNames) #or token(the.classes) # or objs!!
    _(".")
    prop = word()
    if interpreting():
        x=getattr(module, prop)
        return x
    return kast.Attribute(kast.Name(module, kast.Load()), prop, kast.Load())

def selectable():
    must_contain('that', 'whose', 'which')
    ___('every', 'all', 'those')
    xs = resolve(true_variable()) or endNoun()
    s = maybe(selector)  # rhs=xs, lhs implicit! (BAD!)
    if interpreting(): x = filter(xs, s)  # except xs
    return x


def ranger():
    if in_params: return False
    must_contain('to')
    maybe_token('from')
    a = number()
    _('to')
    b = number()
    return range(a, b)  # a:b # (a:b).to_a


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
        maybe(true_variable) or \
        maybe(article) and word() or \
        maybe(ranger) or \
        maybe(value) or \
        maybe(typeNameMapped) or \
        maybe_token('a') or \
        raise_not_matching("Not an endNode")  # "+pointer_string())
    po = maybe(postjective)  # inverted
    if po and interpreting(): x = do_send(x, po, None)
    return x


def endNoun(included=[]):
    maybe(article)
    adjs = star(adjective)  # first second :. included
    obj = maybe(lambda:noun(included))
    if not obj:
        if adjs and adjs.join(' ').is_noun:
            return adjs.join(' ')
        else:
            raise NotMatching('no endNoun')

    if angle.use_tree: return obj
    # return adjs.to_s+" "+obj.to_s # hmmm  hmmm
    if adjs and isinstance(adjs, list):
        todo("adjectives in endNoun")
        return ' ' + adjs.join(' ')+" "+str(obj) #  hmmm  W.T.F.!!!!!!!!!!!!!?????
    return str(obj)


def any_ruby_line():
    ## global the.string
    line = the.string
    the.string = the.string.gsub(r'.*', '')
    checkNewline()
    return line


def start_block(type=None):
    if type:
        xmls = _('<')
        _(type)
        if xmls: _('>')

    if checkNewline(): return OK
    return ___(start_block_words) # OPTIONAL!!!???


def check_end_of_statement():
    return checkEndOfLine() or the.current_word == ";" or maybe_tokens(done_words)


def end_of_statement():
    return checkEndOfLine() or the.previous_word==';' or token(';')  # consume ";", but DON'T consume done_words here!


def english_to_math(s):
    s = s.replace_numerals
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


def evaluate_index():
    should_not_start_with('[')
    must_contain('[', ']')
    v = endNode()  # true_variable()
    _('[')
    i = endNode()
    _(']')
    set = maybe_token('=')
    if set: set = expression
    # if interpreting(): the.result=v.send :index,i
    # if interpreting(): the.result=do_send v,:[], i
    # if set and interpreting(): the.result=do_send(v,:[]=, [i, set])
    va = resolve(v)
    if interpreting(): the.result = va.__index__(i)  # old value
    if set and interpreting():
        the.result = va.__index__(i, set)
    if set and isinstance(v, Variable): v.value = va

    # if interpreting(): the.result=do_evaluate "#{v)[#{i)]"
    return the.result


def evaluate_property():
    maybe_token('all')  # list properties (all files in x)
    must_contain_before(['of', 'in', '.'], '(')
    raiseNewline()
    x = endNoun(type_keywords)
    __('of', 'in')
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
    jeannie_api = 'https:r''weannie.pannous.com/maybe(api)'
    params = 'login=test-user&out=simple&input='
    # if not current_value: raise "empty evaluation"
    # download(jeannie_api+params+URI.encode(request))


#  those attributes. maybe(hacky) do better / don't use
def subnode(attributes={}):
    if not angle.use_tree: return
    if not current_node: return

    def lamb():
        name = attributes['name'] or attributes[0]
        value = attributes['value'] or attributes[1]
        node = TreeNode(name=name, value=value)
        nodes.append(node)
        current_node.nodes.append(node)
        current_value = value

    attributes.each(lamb)

    return attributes  # current_value


@Starttokens(eval_keywords)
def evaluate():
    __(eval_keywords)
    no_rollback()
    the_expression = rest_of_line
    subnode({'statement': the_expression})
    current_value = the_expression
    try:
        the.result = eval(english_to_math(the_expression))  # if not the.result:
    except:
        the.result = jeannie(the_expression)

    subnode({'result': the.result})  #: via automagic})
    current_value = the.result
    return current_value


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


# def variables:
#   variables
#
#
# def the.result:
#   the.result
#
# $testing=testing or False
# if ARGV and not $testing and not $commands_server: EnglishParser.startup

def verbs():
    return main_verbs  # None #remove:


def be(): tokens(be_words)


def modifier(): tokens(modifiers)


def attribute(): tokens(attributes)


def preposition(): tokens(prepositions)


def pronoun(): tokens(pronouns)


def nonzero(): tokens(nonzero_keywords)


# def # nill=t():tokens(nill_words)
#     return Nill

def wordnet_is_adverb():
    pass


def adverb():
    no_keyword_except(adverbs)
    found_adverb = ___(adverbs)
    if not found_adverb: raise_not_matching("no adverb")
    if not angle.use_wordnet: return found_adverb
    current_value = found_adverb or wordnet_is_adverb()  # call_is_verb
    return current_value


def verb():
    no_keyword_except(remove_from_list(system_verbs, be_words))
    found_verb = ___(xlist(other_verbs + system_verbs) - be_words - ['do'])  # verbs,
    if not found_verb: raise_not_matching("no verb")
    if not angle.use_wordnet: return found_verb
    current_value = found_verb or wordnet_is_verb()  # call_is_verb
    return current_value


def adjective():
    if not angle.use_wordnet: return tokens(['funny', 'big', 'small', 'good', 'bad'])
    # if not found_verb: raise_not_matching("no verb")
    return wordnet_is_adjective()


def wordnet_is_noun():  # expensive!!!):
    ## global the.string
    if re.search(r'^\d'): raise NotMatching("numbers are not nouns", the.string)
    if re.search(r'^\s*(\w+)'): the_noun = the.string.match(r'^\s*(\w+)', the.string)[1]
    # if not the_noun: return false
    if not the_noun: raise NotMatching("no noun word")
    if not the_noun.is_noun: raise NotMatching("no noun")
    the.string = the.string.strip[len(the_noun):-1]
    return the_noun


def wordnet_is_adjective():  # expensive!!!):
    ### global the.string
    if re.search(r'^\s*(\w+)'): the_adjective = the.string.match(r'^\s*(\w+)', the.string)[1]  #
    if boolean_words.has(the_adjective): raise NotMatching("no boolean adjectives")
    # if not the_adjective: return false
    if not the_adjective: raise NotMatching("no adjective word")
    if not the_adjective.is_adjective: raise NotMatching("no adjective")
    the.string = the.string.strip[len(the_adjective):-1]
    return the_adjective


def wordnet_is_verb():  # expensive!!!):
    ## global the.string
    if re.search(r'^\s*(\w+)'): the_verb = the.string.match(r'^\s*(\w+)', the.string)[1]
    if not the_verb: return False
    if the_verb.synsets('verb'): raise NotMatching("no verb")
    # if not the_verb.is_verb: raise NotMatching.new "no verb"
    the.string = the.string.strip[len(the_verb):-1]
    return the_verb


def call_is_verb():
    ## global the.string
    # eats=>eat todo lifted => lift
    test = re.search(r'^\s*(\w+)maybe(s)', the.string)[1]
    if not test: return False
    command = app_path() + "r':'word-lists/is_verb " + test
    # puts command
    found_verb = False  # exec(command)
    if not found_verb: raise NotMatching("no verb")
    if found_verb: the.string = the.string.strip[len(found_verb):-1]
    verbose("found_verb " + str(found_verb))
    return found_verb


def call_is_noun():
    ## global the.string
    test = re.search(r'^\s*(\w+)', the.string)[1]
    if not test: return False
    command = app_path() + "r':'word-lists/is_noun " + test
    found_noun = False  # exec(command)
    if not found_noun: raise NotMatching("no noun")
    if found_noun == found_noun.upcase: raise NotMatching("B.A.D. acronym noun")
    if found_noun: the.string = the.string.strip[len(found_noun):-1]
    verbose("found_noun " + str(found_noun))
    return found_noun


def quote():
    raiseEnd()
    if the.current_type == _token.STRING:
        the.result = the.current_word[1:-1]
        if not interpreting():
            the.result=kast.Str(s=the.result)
        next_token()
        return the.result
    # global the.result, the.string
    # if checkEnd: return
    # todo :match ".*?"
    if the.current_word == "'":
        the.string = the.string.strip()
        to = the.string[1:-1].index("'")
        the.result = current_value = the.string[1:to];
        the.string = the.string[to + 2:-1].strip()
        return Quote(current_value)
        # return "'"+current_value+"'"

    if the.current_word == '"':
        the.string = the.string.strip()
        to = the.string[1:-1].index('"')
        the.result = current_value = the.string[1:to];
        the.string = the.string[to + 2:-1].strip()
        return Quote(the.result)
        # return '"'+current_value+'"'

    raise NotMatching("quote")
    # if throwing: throw "no quote"
    return False

def maybe_param(method,classOrModule):
    param=maybe(true_param)
    if param:
        return param.value or param
    method=get_method(method,classOrModule)
    import inspect
    args, varargs, varkw, defaults = inspect.getargspec(method)
    param=maybe_tokens(varkw+defaults)
    return param


def true_param():
    vars = the.params.keys()
    if (len(vars) == 0): raise NotMatching()
    v = tokens(vars)
    v = the.params[v]  # why maybe(later)
    return v

def true_variable(node=True):
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
    if not a: should_not_start_with(xlist(keywords)-include)
    if not angle.use_wordnet:
        return word(include)
    from nltk.corpus import wordnet as wn
    # if true_variable(): return True
    no_keyword_except(include)
    current_value = wordnet_is_noun()  # expensive!!!
    return current_value
    # current_value=call_is_noun # expensive!!!
    # return tokens(question_words) ??????????????

    # is defined as
    #


def bla():
    return tokens('hey')  # ,'here is')


def _the():
    return tokens(articles)


def the_():
    maybe_tokens(articles)


def fileName():
    raiseEnd()
    match = is_file(the.string, False)
    if match:
        path = match[0]
        path = path.gsub(r'^/home', "'Users")
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
        path = path.gsub(r'^/home', "'Users")
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


# beep every 4 seconds
# every 4 seconds beep
# at 5pm send message to john
# send message to john at 5pm
def repeat_every_times():
    must_contain(time_words)
    dont_interpret()  # 'cause later
    ___('repeat')
    b = maybe(action)
    interval = datetime()
    no_rollback()
    if not b:
        start_block()
        dont_interpret()
        b = maybe(action) or block()
        end_block()

        # event=Event(interval:interval,event:b)
        # event=Event(interval, b)
        # event
        # if angel.use_tree: parent_node()


def repeat_action_while():
    _('repeat')  # ,'do'
    if re.search(r'\s*while'): raise_not_matching("repeat_action_while != repeat_while_action", the.string)
    b = action_or_block()
    _('while')
    c = condition()
    if not interpreting():
        return kast.While(test=c, body=b)
    while check_condition(c):
        the.result = do_execute_block(b)
    return the.result

def repeat_with():
    _('repeat')
    _('with')
    no_rollback()
    v=variable()
    _('in')
    c=collection()
    b=action_or_block()
    if interpreting():
        for i in c:
            do_execute_block(b,{v:i})
        return the.result
    return kast.For(target=v,iter=c,body=b)
    #     'iter',
    #     'body',
    #     'orelse',)



def while_loop():
    ___('repeat')
    __('while', 'as long as')
    no_rollback()  # no_rollback 13 # arbitrary value ! :{
    dont_interpret()
    c = condition()
    no_rollback()
    ___('repeat')  # keep gerunding
    ___('then')  # ,':'
    if not check_condition(c): dont_interpret()
    b = action_or_block()  # Danger when interpreting it might contain conditions and breaks
    r = False
    if not interpreting():
        return kast.While(test=c, body=b)
    while (check_condition(c)):
        r = do_execute_block(b)
    return r  # or OK


def until_loop():
    ___('repeat')
    __('until', 'as long as')
    dont_interpret()
    no_rollback()  # no_rollback 13 # arbitrary value ! :{
    c = condition()
    ___('repeat')
    b = action_or_block()  # Danger when interpreting it might contain conditions and breaks
    r = False
    if interpreting():
        while (not check_condition(c)):
            r = do_execute_block(b)

    return r


def looped_action():
    must_not_start_with('while')
    must_contain('as long as', 'while')
    dont_interpret()
    ___('do')
    ___('repeat')
    a = action()  # or semi-block
    __('as long as', 'while')
    c = condition()
    r = False
    if not interpreting(): return a
    if interpreting():
        while (check_condition(c)):
            r = do_execute_block(a)

    return r


def looped_action_until():
    must_contain('until')
    dont_interpret()
    ___('do')
    ___('repeat')
    a = action()  # or semi-block
    _('until')
    c = condition()
    r = False
    if not interpreting(): return a
    if interpreting():
        while (not check_condition(c)):
            r = do_execute_block(a)
    return r


def is_number(n):
    str(n).replace_numerals().to_i() != 0  # hum

    # notodo: LTR parser just here!
    # say hello 6 times   #=> (say hello 6) times ? give up for now
    # say hello 6 times 5 #=> hello 30 ??? SyntaxError! say hello (6 times 5)


def action_n_times():
    must_contain('times')
    dont_interpret()
    ___('do')
    # ___ "repeat"
    a = action()
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
    no_rollback()
    ___('do')
    ___('repeat')
    dont_interpret()
    a = action_or_block()
    if interpreting():
        int(n).times(lambda: do_evaluate(a))
    return a


def repeat_n_times():
    must_contain('times')
    _('repeat')
    n = number()
    _('times')
    no_rollback()
    dont_interpret()
    b = action_or_block()
    if interpreting(): int(n).times(lambda: do_execute_block(b))
    return b
    # if angel.use_tree: parent_node()


# if action was (not) parsed before: todo: node cache: skip action(X) -> _'forever'
def forever():
    must_contain('forever')
    dont_interpret()
    allow_rollback
    a = action()
    _('forever')
    if interpreting():
        while (True):
            do_execute_block(a)


def as_long_condition_block():
    _('as long as')
    c = condition()
    a = block()  # danger, block might contain condition()
    if interpreting():
        while (check_condition(c)):
            do_execute_block(a)


def ruby_action():
    _('ruby')
    exec (action or quote)
