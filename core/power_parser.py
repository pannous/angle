#!/usr/bin/env python
# encoding: utf-8
from __future__ import print_function  # for stderr

# from TreeBuilder import show_tree
# from english_parser import result, comment, condition, root
import sys
import tokenize
import english_tokens
import re
import token as _token
import angle
from exceptions import *
import nodes
from the import *
import the


# Beware of decorator classes. They don't work on methods unless you manually reinvent the logic of instancemethod descriptors.
class Starttokens(object):
    def __init__(self, starttokens):
        if not isinstance(starttokens, list):
            starttokens = [starttokens]
        self.starttokens = starttokens

    def __call__(self, original_func):
        decorator_self = self
        for t in self.starttokens:
            if t in the.token_map:
                    print("ALREADY MAPPED \"%s\" to %s, now %s" % (t, the.token_map[t], original_func))
            the.token_map[t] = original_func
        return original_func
        # def wrappee( *args, **kwargs):
        # print 'in decorator with',decorator_self.flag
        #     original_func(*args,**kwargs)
        # return wrappee


# def starttokens(keywords,fun):
#     for t in keywords:
#         token_map[t]=fun
#     return fun


#
# class NotMatching(StandardError):
#     pass

class StandardError(Exception):
    pass


class Error(Exception):
    pass


class MethodMissingError(StandardError):
    pass


class InternalError(StandardError):
    pass


class NotMatching(StandardError):
    pass


class UnknownCommandError(StandardError):
    pass


class SecurityError(StandardError):
    pass


# NotPassing = Class.new StandardError
class NotPassing(StandardError):
    pass


class NoResult(NotMatching):
    pass


class EndOfDocument(StandardError):
    pass


class EndOfLine(NotMatching):
    pass


class EndOfStatement(EndOfLine):
    pass


class MaxRecursionReached(StandardError):
    pass


class EndOfBlock(NotMatching):
    pass


class GivingUp(StandardError):
    pass


class MustNotMatchKeyword(NotMatching):
    pass


class KeywordNotExpected(NotMatching):
    pass


class UndefinedRubyMethod(NotMatching):
    pass


class WrongType(StandardError):
    pass


class ImmutableVaribale(StandardError):
    pass


class SystemStackError(StandardError):
    pass


def app_path():
    return "./"


def dictionary_path():
    app_path() + "word-lists/"


def isnumeric(start):
    return isinstance(start, int) or isinstance(start, float)  # or isinstance(start, long)


    # def current_context():
    # context: tree / per node

    # def javascript:
    # maybe(script_block)
    #   __(current_context)=='javascript' ? 'script' : 'java script', 'javascript', 'js'
    #   no_rollback() 10
    #   javascript+=rest_of_line+';'
    #   newline22
    #   return javascript
    #   #if not javascript: block and done
    #


# _try=maybe

def star(lamb,giveUp=False):
    if (depth > max_depth): raise SystemStackError("if(len(nodes)>max_depth)")
    good = []
    old = current_token
    old_state = current_value #?
    try:
        while not checkEndOfLine():  # many statements, so ';' is ok! but: MULTILINE!?!
            match = lamb()  # yield  # <------!!!!!!!!!!!!!!!!!!!
            if not match: break
            old = current_token
            good.append(match)
            max = 20  # no list of >100 ints !?! WOW exclude lists!! TODO OOO!
            if len(good) > max: raise " too many occurrences of " + to_source(lamb)
    except GivingUp as e:
        if giveUp:  raise e, None, sys.exc_info()[2]
        verbose("GivingUp ok in star")  # ok in star!
        set_token(old)
        return good
    except NotMatching as e:
        set_token(old)
        if very_verbose and not good:
            verbose("NotMatching star " + str(e))
            # if verbose: print_pointer()
    except EndOfDocument as e:
        verbose("EndOfDocument")  # ok in star!
    except IgnoreException as e:
        error(e)
        error("error in star " + to_source(lamb))
    if len(good) == 1: return good[0]
    if good: return good
    # else: restore!
    set_token(old)
    # invalidate_obsolete(old_nodes)
    return old_state


def ignore_rest_of_line():
    while not checkEndOfLine():
        next_token()

def pointer_string():
    if not the.current_token:
        offset = len(the.current_line)
        l = 3
    else:
        offset = the.current_offset
        l = the.current_token[3][1] - offset
    return the.current_line[offset:] + "\n" + the.current_line + "\n" + " " * (offset) + "^" * l + "\n"


def print_pointer(force=False):
    if (force or the._verbose):
        print(the.current_token, file=sys.stderr)
        print(pointer_string(), file=sys.stderr)
    return OK


def error(e, force=False):
    if isinstance(e, GivingUp): raise e  # hand through!
    if isinstance(e, NotMatching): raise e
    if isinstance(e, str): print(e)
    if isinstance(e, Exception):
        # print(e.str(clazz )+" "+e.str(message))
        # print(clean_backtrace e.backtrace)
        # print(e.str( class )+" "+e.str(message))
        print_pointer()
        # if angle.use_tree:
        #     import TreeBuilder
        #     TreeBuilder.show_tree()
        if not angle._verbose: raise e,None, sys.exc_info()[2]  # SyntaxError(e):


def warn(e):
    print(e)


def caller():
    import inspect

    curframe = inspect.currentframe()
    calframe = inspect.getouterframes(curframe, 2)
    # calframe_ = calframe[1][3]
    # print('caller name:', calframe_)
    return calframe


def verbose(info):
    if angle._verbose:
        print(info)

def debug(info):
    if angle._debug:
        print(info)

def info(info):
    if the._verbose:
        print(info)


def to_source(block):
    return str(block)


def filter_backtrace(e):
    return e


def tokens(tokenz):
    raiseEnd()
    ok = maybe_tokens(tokenz)
    if (ok): return ok
    raise NotMatching(result)


# so much cheaper!!! -> copy to ruby
# TODO: COLLECT ALL
def maybe_tokens(tokens0):
    # tokens = flatten(tokens0)
    for t in tokens0:
        if t == the.current_word or t.lower() == the.current_word.lower() :
            next_token()
            return t
        if " " in t: # EXPENSIVE
            old = the.current_token
            for to in t.split(" "):
                if to != the.current_word:
                    t = None
                    break
                else:
                    next_token()
            if not t:
                set_token(old)
                continue
            return t
    return False


def __(x):
    return tokens(x)


# shortcut: method missing (and maybe(}?)
# def maybe_tokens(*x):
#     # DANGER!! Obviously very different semantics from maybe(tokens}!!
#     # remove_tokens x # shortcut
#     return maybe(tokens, x)


# class Parser(object):  # <MethodInterception:
# import
# attr_accessor :lines, :verbose, :original_string

# def __init__():

def next_token(check=True):
    # if check: check_comment()
    the.token_number = the.token_number + 1
    if (the.token_number >= len(the.tokenstream)):
        raise EndOfDocument()
    token = the.tokenstream[the.token_number]
    the.previous_word = the.current_word
    return set_token(token)


def set_token(token):
    global current_token, current_type, current_word, current_line, token_number
    the.current_token = current_token = token
    the.current_type = current_type = token[0]
    the.current_word = current_word = token[1]
    the.line_number, the.current_offset = token[2]
    end_pointer = token[3]
    the.current_line = current_line = token[4]
    the.token_number = token_number = token[5]
    the.string = current_word  # hack, kinda
    return token[1]


# TODO: we need a tokenizer which is agnostic to Python !
# SEE test_variable_scope
# end""") # IndentationError: unindent does not match any outer indentation level TOKENIZER WTF
def parse_tokens(s):
    import tokenize
    from io import BytesIO

    the.tokenstream = []

    def tokeneater(token_type, tokenn, start_row_col, end_row_col, line):
        if token_type != tokenize.COMMENT:
            the.tokenstream.append((token_type, tokenn, start_row_col, end_row_col, line, len(the.tokenstream)))

    tokenize.tokenize(BytesIO(s.encode('utf-8')).readline, tokeneater)  # tokenize the string
    return the.tokenstream

def init(strings):
    # global is ok within one file but do not use it across different files
    global no_rollback_depth, rollback_depths, line_number, original_string, root, lines,  depth, lhs, rhs, comp
    if not the.moduleMethods:
        load_module_methods()
    the.no_rollback_depth = -1
    the.rollback_depths = []
    the.line_number = 0
    if isinstance(strings, list):
        the.lines = strings
        parse_tokens("\n".join(strings))
    if isinstance(strings, str):
        the.lines = strings.split("\n")
        parse_tokens(strings)
    the.token_number = -1
    next_token()
    the.string = the.lines[0].strip()  # Postpone angel.problem
    the.original_string = the.string
    the.root = None
    the.nodes = []
    the.depth = 0
    lhs = rhs = comp = None
    for nr in english_tokens.numbers:
        the.token_map[nr] = number

        # result           =None NOO, keep old!


# def s(s):
#     allow_rollback()
#     init(s)
    # parser.init the.string


def assert_equals(a, b):
    if a != b: raise NotPassing("#{a} should equal #{b}")


def doassert(x=None, block=None):
    if not x and block: x = block()  # yield
    # if not x: raise Exception.new (to_source(block))
    if block and not x: raise NotPassing(to_source(block))
    if not x: raise NotPassing()
    if isinstance(x, str):
        try:
            # if the.string: root
            s(x)
            import english_parser

            ok = english_parser.condition()
        except SyntaxError as e:
            raise e  # ScriptError.new "NOT PASSING: SyntaxError : "+x+" \t("+e.class.to_s+") "+e.to_s
        # except Exception as e:
        #     raise NotPassing("NOT PASSING: " + str(x) + " \t(" + str(type(e)) + ") " + str(e))

        if not ok:
            raise NotPassing("NOT PASSING: " + str(x))
        print(x)

    print("TEST PASSED! " + str(x) + " \t" + to_source(block).to_s)
    return True


def error_position():
    pass


# def interpretation():
#     interpretation.error_position = error_position()
#     return interpretation


# gem 'debugger'
# gem 'ruby-debug19', :require => 'ruby-debug'
# import ruby-debug
# import debugger
# gem 'ParseTree' ruby 1.9 only :{
# import sourcify #http://stackoverflow.com/questions/5774916/print-actual-ruby-code-of-a-block BAD
# import method_source

# gem 'ruby-debug', :platforms => :ruby_18
# gem 'ruby-debug19', :platforms => :ruby_19, :require => 'ruby-debug'

# def maybe(block):
#  return yield except True
#
def raiseEnd():
    if current_type == _token.ENDMARKER:
        raise EndOfDocument()
    if (the.token_number >= len(the.tokenstream)):
        raise EndOfDocument()
        # if not the.string or len(the.string)==0:
        #     if line_number >= len(lines): raise EndOfDocument()
        #     #the.string=lines[++line_number];
        #     raise EndOfLine()


def remove_tokens(*tokenz):
    while (the.current_word in tokenz):
        next_token()
        # for t in flatten(tokenz):
        #     the.string = the.string.replace(r' *%s *' % t, " ")


def must_contain(args,do_raise=True):  # before ;\n
    if isinstance(args[-1], dict):
        return must_contain_before(args[0:-2], args[-1]['before'])
    if isinstance(args, str):args=[args]
    old = current_token
    pre=the.previous_word
    while not (checkEndOfLine()):
        for x in args:
            if current_word == x:
                set_token(old)
                return x
        next_token()
        if do_raise and (current_word == ';' or current_word == '\n'):
            break
    set_token(old)
    the.previous_word=pre
    if do_raise:raise NotMatching("must_contain " + str(args))
    return False


def must_contain_before(args, before):  # ,before():None
    old = current_token
    good = None
    while not (checkEndOfLine() or current_word in before and not current_word in args):
        if current_word in args:
            good = current_word
            break
        next_token()
    set_token(old)
    if not good: raise (NotMatching(args))
    return good


def must_contain_before_old(before, *args):  # ,before():None
    raiseEnd()
    good = False
    if before and isinstance(before, str): before = [before]
    if before: before = flatten(before) + [';']
    args = flatten(args)
    for x in flatten(args):
        if re.search(r'^\s*\w+\s*$', x):
            good = good or re.search(r'[^\w]%s[^\w]' % x, the.string)
            if (type(good).__name__ == "SRE_Match"):
                good = good.start()
            if good and before and good.pre_match in before and before.index(good.pre_match):
                good = None
        else:  # token
            good = good or re.search(escape_token(x), the.string)
            if (type(good).__name__ == "SRE_Match"):
                good = good.start()
            sub = the.string[0:good]
            if good and before and sub in before and before.index(sub):
                good = None
        if good: break

    if not good: raise (NotMatching(x))
    for nl in english_tokens.newline_tokens:
        if nl in str(good): raise (NotMatching(x))  # ;while
        # if nl in str(good.pre_match): raise (NotMatching(x))  # ;while
    return OK


# NOT == starts_with !!!
def look_ahead(expect_next, doraise=False):
    if the.current_word=='':return False
    token = the.tokenstream[the.token_number + 1]
    if expect_next == token[1]:
        return True
    elif isinstance(expect_next,list) and token[1] in expect_next:
        return True
    else:
        if doraise:
            raise (NotMatching(expect_next))
        return False


def _(x):
    return token(x)


def lastmaybe(stack):
    for s in stack:
        if re.search("try", s):
            return s


def caller_name():
    return caller()


# for i in 0..(len(caller)):
#   if not caller[i].match(r'parser'): next
#   name=caller[i].match(r'`(.*)'')[1]
#   if caller[i].index("parser"): return name


 # remove the border, if above border
def adjust_interpret():
    depth = caller_depth()
    if (angle.interpret_border > depth-2):
        angle.interpret = angle.did_interpret
        angle.interpret_border = -1  # remove the border
        do_interpret()

def do_interpret():
    if(angle.did_interpret != angle.interpret):
        angle.did_interpret = angle.interpret
    angle.interpret = True


def dont_interpret():
    depth = caller_depth()
    if angle.interpret_border < 0:
        angle.interpret_border = depth
        angle.did_interpret = angle.interpret
    angle.interpret = False


def interpreting():
    if angle.use_tree: return False
    return angle.interpret


def check_rollback_allowed():
    c = caller_depth
    throwing = True  # []
    level = 0
    return c < no_rollback_depth or c > no_rollback_depth + 2


# if no result: same as try but throws

# same as maybe
# def any(block):
#     global throwing
#     raiseEnd()
#     # if checkEnd: return
#     last_try = 0
#     # if level>20: throw "Max recursion reached #{to_source(block)}"
#     if len(caller()) > 180: raise MaxRecursionReached(to_source(block))
#     was_throwing = throwing
#     throwing = False
#     # throwing[level]=false
#     old = current_token
#     # oldString = the.string
#     result = False
#     try:
#         result = block()  # yield  # <--- !!!!!
#         if not result:
#             set_token(old)
#             # the.string = oldString
#             raise NoResult(to_source(block))
#         return result
#     except EndOfDocument:
#         verbose("EndOfDocument")
#     except EndOfLine:
#         verbose("EndOfLine")
#     except GivingUp as e:
#         raise e
#     except NotMatching:
#         verbose("NotMatching")
#         # retry
#     except IgnoreException as e:
#         verbose("Error in %s" % to_source(block))
#         error(e)
#
#     if result: verbose("Succeeded with any #{to_source(block)}")
#     # if verbose and not result: string_pointer()
#     last_token = pointer_string()  # if not last_token:
#     if check_rollback_allowed():
#         set_token(old)
#         # the.string = oldString
#     throwing = was_throwing
#     # throwing[level]=True
#     # level=level-1
#     if result: return result
#     raise NotMatching(to_source(block))
#     # throw "Not matching #{to_source(block)}"


def read_source(x):
    if last_pattern or not x: return last_pattern
    # proc=block.to_source(:strip()_enclosure => True) except "Sourcify::MultipleMatchingProcsPerLineError"
    res = x.source_location[0] + ":" + x.source_location[1].to_s + "\n"
    lines = IO.readlines(x.source_location[0])
    i = x.source_location[1] - 1
    while True:
        res += lines[i]
        if i >= len(lines) or lines[i].match("}") or lines[i].match("end"): break
        i = i + 1
    return res


def caller_depth():
    # c= depth #if angel.use_tree doesn't speed up:
    # if angel.use_tree: c= depth
    c = len(caller())
    if c > max_depth:
        raise SystemStackError("depth overflow")
    return c
    # filter_stack(caller).count #-1


def allow_rollback(n=0):
    if n < 0: the.rollback_depths = []
    depth = caller_depth() - 1
    if len(the.rollback_depths) > 0:
        the.no_rollback_depth = the.rollback_depths[-1]
        while the.rollback_depths[-1] > depth:
            the.no_rollback_depth =the.rollback_depths.pop()
            if len(the.rollback_depths)==0: break
    else:
        the.no_rollback_depth = -1

def no_rollback():
    depth = caller_depth() - 1
    the.no_rollback_depth=depth
    the.rollback_depths.append(depth)

def adjust_rollback(depth=-10):
    try:
        if depth == -10: depth = caller_depth()
        if depth <= the.no_rollback_depth:
            allow_rollback()
    except (Exception, Error) as e:
        error(e)


# todo ? trial and error -> evidence based 'parsing' ?
def invalidate_obsolete(old_nodes):
    # DANGER RETURNING false as VALUE!! use RAISE ONLY todo
    # (nodes - old_nodes).each(lambda n: n.invalid())
    for fuck in old_nodes:
        if fuck in nodes:
            nodes.remove(fuck)
    for n in nodes:
        n.invalid()
        n.destroy()

# start_block INCLUDED!! (optional !?!)
def beginning_of_line():
    return the.current_type==_token.INDENT or the.current_token[2][1]==0

def block(multiple=False):  # type):
    global last_result, original_string
    from english_parser import statement, end_of_statement, end_block
    maybe_newline() or not "=>" in the.current_line and maybe_tokens(english_tokens.start_block_words)  # NEWLINE ALONE / OPTIONAL!!!???
    start = pointer()
    statements = [statement()]
    # content = pointer() - start
    end_of_block = maybe(end_block)  # ___ done_words
    if multiple or not end_of_block and not checkEndOfFile():
        end_of_statement()  # danger might act as block end!
        if multiple: maybe_newline()
        # star(end_of_statement)

        def lamb():
            try:
                # print_pointer(True)
                maybe_indent()
                s = statement()
                statements.append(s)
            except NotMatching as e:
                if starts_with(english_tokens.done_words):
                    return False # ALL GOOD
                print("Giving up block")
                print_pointer(True)
                raise Exception(str(e) + "\nGiving up block\n" + pointer_string())
            # content = pointer() - start
            return end_of_statement()

        star(lamb,giveUp=True)
        # maybe(end_of_statement)
        end_block()

    the.last_result = the.result
    if interpreting(): return statements[-1]
    # if angle.debug:print_pointer(True)
    return statements  # content
    # if angel.use_tree:
    # p=parent_node()
    # if p: p.content=content
    #   p
    #


def maybe(expression):
    global original_string, last_node, current_value, depth, current_node, last_token
    if not callable(expression):  # duck!
        return maybe_tokens(expression)
    the.current_expression=expression
    depth = depth + 1
    if (depth > angle.max_depth): raise SystemStackError("len(nodes)>max_depth)")
    old = current_token
    try:
        result = expression()  # yield <<<<<<<<<<<<<<<<<<<<<<<<<<<<
        adjust_rollback()
        if angle._debug and (callable(result)):
            raise Exception("returned CALLABLE " + str(result))
        if result or result == 0:
            verbose("GOT result from " + str(expression) + " : " + str(result))
        else:
            verbose("No result from " + str(expression))
            set_token(old)
            # the.string = old
        last_node = current_node
        return result
    except (NotMatching, EndOfLine) as e:
        if verbose: verbose("Tried %d %s %s" % (the.current_offset , the.current_word, expression))
        adjust_interpret()  # remove the border, if above border
        # if verbose: verbose(e)
        # if verbose: string_pointer()
        cc = caller_depth()
        rb = the.no_rollback_depth
        if cc >= rb:
            set_token(old)  # OK
            current_value = None
        if cc < rb:  # and not cc+2<rb # not check_rollback_allowed:
            error("NO ROLLBACK, GIVING UP!!!")
            # if angle._verbose:
            #     print(last_token)
            # print_pointer()  # ALWAYS!
            # if angle.use_tree:
            #     import TreeBuilder
            #     TreeBuilder.show_tree()  # Not reached
            ex = GivingUp(to_source(expression) + "\n" + pointer_string())
            raise ex, None, sys.exc_info()[2]
            # error e #exit
            # raise SyntaxError(e)
    except EndOfDocument as e:
        set_token(old)
        verbose("EndOfDocument")
        # raise e
        return False
        # return True
        # except GivingUp as e:
        # the.string=old #to mark??
        # maybe => OK !?
        # error(e)
        # if not check_rollback_allowed:
        #     if rollback[len(caller)-1]!="NO" #:
    except IgnoreException as e:  # NoMethodError etc
        set_token(old)
        error(e)
        verbose(e)
    except Error as e:
        error(e)
        raise e
    finally:
        depth=depth-1
    # except Exception as e:
    #     error(block)
    #     import traceback
    #     traceback.print_stack() # backtrace
    #     error(e)
    #     error(block)
    #     print("-------------------------")
    #     quit()
    # finally:
    adjust_rollback()
    set_token(old)  # if rollback:
    return False


def one_or_more(expressions):
    all = [expressions()]
    more = star(expressions)
    if more:
        all.append(more)
    return all

def to_source(block):
    return str(block)


# def many(block): # see star
#     global  old_tree,result
#     while True:
#         try:
#             maybe(comment)
#             old_tree = list(nodes)#.clone
#             result = block() # yield
#             # puts "------------------"
#             #puts nodes-old_tree
#             if(not the.string or len(the.string)==0 ):break  # TODO! loop criterion too week: break
#             if not result or result == []:
#                 raise NotMatching(to_source(block) + "\n" + string_pointer_s())
#         except IgnoreException as e:
#             import traceback
#             traceback.print_stack() # backtrace
#             error(e)

# GETS FUCKED UP BY the.string.strip()! !!! ???
def pointer():
    return current_token[2]
    # global parser
    # if not lines or line_number >= len(lines): return Pointer(line_number, 0, parser)
    # # line_number copy by ref?????????
    # line = lines[line_number] + "$$$"
    # offset = line.find(the.string + "$$$")  # len(original_string)-(the.string or "").length
    # return Pointer(line_number, offset or 0,parser)


def isnumeric(start):
    return start.isdigit()
    # isinstance(start)


def app_path():
    pass
    # File.expand_path(File.dirname(__FILE__)).to_s


class IgnoreException(Exception):
    pass


def parse(s, target_file=None):
    global last_result, result
    if not s: return
    source_file='file' # python speak for in-line code
    # string
    verbose("PARSING")
    try:
        import english_parser
        if isinstance(s, file):
            source_file = str(s)
            target_file = source_file+".pyc"
            s = s.readlines()
        if not isinstance(s, str) and not isinstance(s, list):
            the.result = s
            return english_parser.interpretation()  # result, hack
        allow_rollback()
        init(s)
        the.result = english_parser.rooty()
        if isinstance(the.result , nodes.FunctionCall):
            the.result =english_parser.do_execute_block(the.result )
        if the.result in ['True', 'true']: the.result = True
        if the.result in ['False', 'false']: the.result = False
        import ast
        if angle.use_tree:
            import emitters
            emitters.pyc_emitter.eval_ast(the.result,{},source_file,target_file)
        else:
            if isinstance(the.result,ast.Num): the.result =  the.result.n
            if isinstance(the.result,ast.Str): the.result =  the.result.s
        the.last_result = the.result
    except Exception as e:
        error(target_file)
        print_pointer(True)
        raise e, None, sys.exc_info()[2]
    # except NotMatching as e:
    #     import traceback
    #     traceback.print_stack() # backtrace
    #     the.last_result = the.result = None
    #     e=filter_backtrace(e)
    #     error(e)
    #     print_pointer(True)
    except IgnoreException as e:
        pass

    verbose("PARSED SUCCESSFULLY!!")
    # show_tree()
    # puts svg
    return english_parser.interpretation()  # # result

    # def start_parser:
    #   a=ARGV[0]  or  app_path+"/../examples/test.e"
    #   if (File.exists? a):
    #     lines=IO.readlines(a)
    #   else:
    #     lines=a.split("\n")
    #
    #   parse lines[0]


def token(t):  # _new
    if isinstance(t, list):
        return tokens(t)
    raiseEnd()
    if current_word == t:
        next_token()
        return t
    else:
        # verbose('expected ' + str(result))  #
        # print_pointer()
        raise NotMatching(t + "\n" + pointer_string())


def tokens(tokenz):
    raiseEnd()
    ok = maybe_tokens(tokenz)
    if (ok): return ok
    raise NotMatching(str(tokenz) + "\n" + pointer_string())



def escape_token(t):
    z = re.sub(r'([^\w])', "\\\\\\1", t)
    return z


def starts_with(tokenz):
    if checkEndOfLine(): return False
    if isinstance(tokenz,str):
        return tokenz == the.current_word
    for t in tokenz:
        if t == the.current_word:
            return t
    return False


def raiseNewline():
    if checkEndOfLine(): raise EndOfLine()

# see checkEndOfLine
def checkNewline():
    return checkEndOfLine()
    # if (current_type == _token.NEWLINE):
    #     return english_tokens.NEWLINE
    # return False

def checkEndOfLine():
    return current_type == _token.NEWLINE or \
           current_type == _token.ENDMARKER or \
           the.current_word=='' or \
           the.token_number >= len(the.tokenstream)
    # if the.string.blank? # no:try,try,try  see raiseEnd: raise EndOfDocument.new
    # return not the.string or len(the.string)==0


def checkEndOfFile():
    return current_type == _token.ENDMARKER or the.token_number >= len(the.tokenstream)
    # return line_number >= len(lines) and not the.string


def maybe_newline():
    return newline(doraise=False)


def newline(doraise=False):
    if the.current_word=='':return True
    if checkNewline() == english_tokens.NEWLINE or the.current_word==';':
        next_token()
        if (the.current_type == 54):
            next_token()  # ??? \r\n ? or what is this, python?
        while (the.current_type == _token.INDENT):
            next_token()  # IGNORE FOR NOW!!!!
        return english_tokens.NEWLINE
    found = maybe_tokens(english_tokens.newline_tokens)
    if found: return found # todo CLEANUP!!!
    if checkNewline() == english_tokens.NEWLINE:  # get new line: return NEWLINE
        next_token()
        return found
    if not found and doraise: raise_not_matching("no newline")
    return False


def newlines():
    # one_or_more{newline)
    return star(newline)


def NL():
    return tokens('\n', '\r')


def NLs():
    return tokens('\n', '\r')


def rest_of_statement():
    current_value = re.search(r'(.*?)([\r\n;]|done)', the.string)[1].strip()
    the.string = the.string[len(current_value):-1]
    return current_value


# todo merge ^> :
def rest_of_line():
    rest = ""
    while not checkEndOfLine():
        rest += next_token(False) + " "
    return rest


def comment_block():
    token('/')
    token('*')
    while True:
        if the.current_word == '*':
            next_token()
            if the.current_word == '/':
                return True
        next_token()


@Starttokens(['//', '#', '\'', '--', '/'])
def check_comment():
    if the.current_word == None: return
    l = len(the.current_word)
    if l == 0: return
    if the.current_type == tokenize.COMMENT:
        next_token()
    # if the.current_word[0]=="#": ^^ OK!
    #        return rest_of_line()
    if (l > 1):
        # if current_word[0]=="#": rest_of_line()
        if the.current_word[0:2] == "--": return rest_of_line()
        if the.current_word[0:2] == "//": return rest_of_line()
        # if current_word[0:2]=="' ": rest_of_line() and ...
        # the.string = the.string.replace(r' -- .*', '')
        # the.string = the.string.replace(r'\/\/.*', '')  # todo
        # the.string = the.string.replace(r'#.*', '')
        # if not the.string: checkNewline()


def raise_not_matching(msg=None):
    raise NotMatching(msg)


_try = maybe


def number():
    return maybe(real) or maybe(fraction) or maybe(integer) or maybe(number_word) or raise_not_matching("number")


def number_word():
    n = tokens(english_tokens.numbers)
    return extensions.xstr(n).parse_number()  # except NotMatching.new "no number"


def fraction():
    f = maybe(integer) or 0
    m = starts_with(["¼", "½", "¾", "⅓", "⅔", "⅕", "⅖", "⅗", "⅘", "⅙", "⅚", "⅛", "⅜", "⅝", "⅞"])
    if not m:
        # if f==ZERO: return 0 NOT YET!
        if f != 0:
            return f
        raise NotMatching()
    else:
        next_token()
        m = m.parse_number()
    the.result = float(f) + m
    return the.result

# maybe(complex)  or
ZERO = '0'


def integer():
    match = re.search(r'^\s*(-?\d+)', the.string)
    if match:
        current_value = int(match.groups()[0])
        next_token()
        # "E20": kast.Pow(10,20),
        import ast
        # if not interpreting(): return ast.Num(current_value)
        if current_value == 0:
            current_value = ZERO
        return current_value
    raise NotMatching("no integer")
    # plus{tokens('1','2','3','4','5','6','7','8','9','0'))


def real():
    ## global the.string
    match = re.search(r'^\s*(-?\d*\.\d+)', the.string)
    if match:
        current_value = float(match.groups()[0])
        next_token()
        return current_value
    # return false
    raise NotMatching("no real (unreal)")


def complex():
    s = the.string.strip().replace("i", "j")  # python!
    match = re.search(r'^(\d+j)', s)  # 3i
    if not match: match = re.search(r'^(\d*\.\d+j)', s)  # 3.3i
    if not match: match = re.search(r'^(\d+\s*\+\s*\d+j)', s)  # 3+3i
    if not match: match = re.search(r'^(\d*\.\d+\s*\+\s*\d*\.\d+j)', s)  # 3+3i
    if match:
        the.current_value = complex(match[0].groups())
        next_token()
        return current_value
    return False


def maybe_indent():
    while the.current_type==_token.INDENT or the.current_word==' ':
        next_token()


def method_allowed(meth):
    if len(meth)<2: return False
    if meth in ["evaluate","eval","int","True","False","true","false","the","Invert","char"]:return False
    if meth in english_tokens.keywords: return False
    return True

def load_module_methods():

    import warnings
    warnings.filterwarnings("ignore", category=UnicodeWarning)

    try:
        import cPickle as pickle
    except:
        import pickle
    # static, load only once, create with module_method_map.py
    the.methodToModulesMap = pickle.load(open("data/method_modules.bin"))
    the.moduleMethods = pickle.load(open("data/module_methods.bin"))
    the.moduleNames = pickle.load(open("data/module_names.bin"))
    the.moduleClasses = pickle.load(open("data/module_classes.bin"))
    import english_parser

    for mo, mes in the.moduleMethods.items():
        if not method_allowed(mo):continue
        the.token_map[mo] = english_parser.method_call
        for meth in mes:
            if method_allowed(meth):
                the.token_map[meth] = english_parser.method_call
    for mo, cls in the.moduleClasses.items():
        for meth in cls:  # class as CONSTRUCTOR
            if method_allowed(meth):
                the.token_map[meth] = english_parser.method_call


    # if not the.method_names: # todo pickle
    constructors = the.classes.keys() + english_tokens.type_names
    the.method_names = the.methods.keys()  + c_methods + methods.keys() + core_methods + builtin_methods + the.methodToModulesMap.keys()
    # for c in constructors:
    #     if not c in the.method_names: the.method_names.append(c)
    for x in dir(extensions):
        the.method_names.append(x)
    for _type in angle.extensionMap:
        ex = angle.extensionMap[_type]
        for method in dir(ex):
            # if not method in the.method_names: #the.methods:
            #     the.methods[method]=getattr(ex,method)
            # else:
            #     pass # TODOOO!
            the.method_names.append(method)

    the.method_names = [meth for meth in the.method_names if method_allowed(meth)]
            # if method_allowed(method):
            # the.token_map[method] = english_parser.method_call
            # try:
            #     the.methods[method]=getattr(ex,method).im_func #wow, as function!
            # except:
            #     print("wrapper_descriptor not a function %s"%method)

