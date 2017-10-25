#!/usr/bin/env python
# encoding: utf-8
# for stderr

# from TreeBuilder import show_tree
# from english_parser import result, comment, condition, root
import sys

import readline

py2 = sys.version < '3'
py3 = sys.version >= '3'
import tokenize
import english_tokens
import re
import token as _token
import collections  # py3
import context
import extensions
from exceptionz import *
from extension_functions import is_string
# import nodes
from nodes import Argument, Variable, Compare, FunctionCall, FunctionDef
# from nodes import *
import context as the
from context import * #NOO! 2 different!


# Beware of decorator classes. They don't work on methods unless you manually reinvent the logic of instancemethod descriptors.
class Starttokens(object):
	def __init__(self, starttokens):
		if not isinstance(starttokens, list):
			starttokens = [starttokens]
		self.starttokens = starttokens

	def __call__(self, original_func):
		decorator_self = self
		if context.starttokens_done:
			return original_func
		for t in self.starttokens:
			if t in the.token_map:
				verbose("ALREADY MAPPED \"%s\" to %s, now %s" % (t, the.token_map[t], original_func))
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
#
# class StandardError(Exception):
#   pass
#
#
# class Error(Exception):
#   pass
#
#
# class MethodMissingError(StandardError):
#   pass
#
#
# class InternalError(StandardError):
#   pass
#
#
# class NotMatching(StandardError):
#   pass
#
#
# class UnknownCommandError(StandardError):
#   pass
#
#
# class SecurityError(StandardError):
#   pass
#
#
# # NotPassing = Class.new StandardError
# class NotPassing(StandardError):
#   pass
#
#
# class NoResult(NotMatching):
#   pass
#
#
# class EndOfDocument(StandardError):
#   pass
#
#
# class EndOfLine(NotMatching):
#   pass
#
#
# class EndOfStatement(EndOfLine):
#   pass
#
#
# class MaxRecursionReached(StandardError):
#   pass
#
#
# class EndOfBlock(NotMatching):
#   pass
#
#
# class GivingUp(StandardError):
#   pass
#
#
# class MustNotMatchKeyword(NotMatching):
#   pass
#
#
# class KeywordNotExpected(NotMatching):
#   pass
#
#
# class UndefinedRubyMethod(NotMatching):
#   pass
#
#
# class WrongType(StandardError):
#   pass
#
#
# class ImmutableVaribale(StandardError):
#   pass
#
#
# class SystemStackError(StandardError):
#   pass


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

def star(lamb, giveUp=False):
	if (depth > max_depth): raise SystemStackError("if(len(nodes)>max_depth)")
	good = []
	old = current_token
	old_state = current_value  # ?
	try:
		while not checkEndOfLine():  # many statements, so ';' is ok! but: MULTILINE!?!
			match = lamb()  # yield  # <------!!!!!!!!!!!!!!!!!!!
			if not match: break
			old = current_token
			good.append(match)
			if (the.token == ')'): break
			max = 20  # no list of >100 ints !?! WOW exclude lists!! TODO OOO!
			if len(good) > max:
				raise Exception(" too many occurrences of " + to_source(lamb))
	except GivingUp as e:
		if giveUp:
			raise
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
	lineNo = the.current_token[2][0]
	filep = '  File "' + the.current_file + '", line ' + str(lineNo) + "\n" if the.current_file != "(String)" else ""
	return the.current_line[offset:] + "\n" + the.current_line + "\n" + " " * (offset) + "^" * l + "\n" + filep


def print_pointer(force=False):
	if the.current_token and (force or the._verbose):
		print(the.current_token)  # , file=sys.stderr)
		print(pointer_string())  # , file=sys.stderr)
		# print(the.current_token, file=sys.stderr)
		# print(pointer_string(), file=sys.stderr)
	return OK


def error(e, force=False):
	if isinstance(e, GivingUp): raise e  # hand through!
	if isinstance(e, NotMatching): raise e
	if is_string(e): print(e)
	if isinstance(e, Exception):
		# print(e.str(clazz )+" "+e.str(message))
		# print(clean_backtrace e.backtrace)
		# print(e.str( class )+" "+e.str(message))
		print_pointer()
		# if context.use_tree:
		#     import TreeBuilder
		#     TreeBuilder.show_tree()
		if not context._verbose:
			raise


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
	if context._verbose:
		print(info)


def debug(info):
	if context._debug:
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
		if t == the.token or t.lower() == the.token.lower():
			next_token()
			return t
		if " " in t:  # EXPENSIVE
			old = the.current_token
			for to in t.split(" "):
				if to != the.token:
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
		if not check: return EndOfDocument()
		raise EndOfDocument()
	token = the.tokenstream[the.token_number]
	the.previous_word = the.token
	return set_token(token)


def set_token(token):
	global current_token, current_type, current_word, current_line, token_number
	the.current_token = current_token = token
	the.current_type = current_type = token[0]
	the.token = current_word = token[1]
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

	def token_eater(token_type, token_str, start_row_col, end_row_col, line):
		if py3 and token_type == tokenize.ENCODING: return
		# if token_type != tokenize.COMMENT \
		#   and not line.startswith("#") and not line.startswith("//"):
		the.tokenstream.append((token_type, token_str, start_row_col, end_row_col, line, len(the.tokenstream)))

	s = s.replace("⦠", "")
	global done

	if py2:
		_lines = s.decode('utf-8').split('\n')
	else:
		_lines = s.split('\n')
	global i
	i = -1

	def readlines():
		global i
		i += 1
		while i < len(_lines) and (_lines[i].startswith("#") or _lines[i].startswith("//")):
			i += 1 # remove comments early!  BAD: /*////*/ !!
		if i < len(_lines):
			if py2:
				return _lines[i]
			else:
				return str.encode(_lines[i])  # py3 wants bytes wtf
		else:
			return b''

	if py2:
		tokenize.tokenize(readlines, token_eater)  # tokenize the string
	else:
		[token_eater(*t) for t in tokenize.tokenize(readlines)]
	# else: map(token_eater,tokenize.tokenize(readline))
	return the.tokenstream


def x_comment(token):
	drop = True  # False # keep comments?
	if drop:
		the.tokenstream.remove(token)
	else:
		token[0] = tokenize.COMMENT  # TypeError: 'tuple' object does not support item assignment
	# the.tokenstream[i]=(token[0],token[1],token[2],token[3],token[4],i) #renumber!!


#  '#' DONE BY TOKENIZER! (54, '\n', (1, 20), (1, 21), '#!/usr/bin/env angle\n', 0)
#  rest done here: // -- /*
def drop_comments():
	in_comment_block = False
	in_comment_line = False
	i = 0
	prev = ""
	for token in extensions.xlist(the.tokenstream):
		is_beginning_of_line = token[2][1] == 0  # 1??
		# line = token[4]
		str = token[1]
		token_type = token[0]
		if str == "//" or str == "#":
			x_comment(token)
			in_comment_line = True
		elif str == '\n':
			in_comment_line = False
		elif prev == "*" and str.endswith("/"):
			x_comment(token)
			in_comment_block = False
		elif in_comment_block or in_comment_line:
			x_comment(token)
		elif prev == "/" and str.startswith("*"):
			i = i - 1  # drop prev_token too!!
			x_comment(prev_token)  # '/' too ;)
			x_comment(token)
			in_comment_block = True
		else:
			# token[-1] =i #renumber!! 'tuple' object does not support item assignment
			the.tokenstream[i] = (token[0], token[1], token[2], token[3], token[4], i)  # renumber!!
			i = i + 1
		prev = str
		prev_token = token


def init(strings):
	# global is ok within one file but do not use it across different files
	global no_rollback_depth, rollback_depths, line_number, original_string, root, lines, depth, left, right, comp
	if not the.moduleMethods:
		load_module_methods()
	the.no_rollback_depth = -1
	the.rollback_depths = []
	the.line_number = 0
	if isinstance(strings, list):
		the.lines = strings
		if (strings[0].endswith("\n")):
			parse_tokens("".join(strings))
		else:
			parse_tokens("\n".join(strings))
	if is_string(strings):
		the.lines = strings.split("\n")
		parse_tokens(strings)
	drop_comments()

	the.tokens_len = len(the.tokenstream)
	the.token_number = -1
	next_token()
	the.string = the.lines[0].strip()  # Postpone angel.problem
	the.original_string = the.string
	the.root = None
	the.nodes = []
	the.depth = 0
	left = right = comp = None
	for nr in english_tokens.numbers:
		the.token_map[nr] = number


def error_position():
	pass


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
	while (the.token in tokenz):
		next_token()
		# for t in flatten(tokenz):
		#     the.string = the.string.replace(r' *%s *' % t, " ")


def must_contain(args, do_raise=True):  # before ;\n
	if isinstance(args[-1], dict):
		return must_contain_before(args[0:-2], args[-1]['before']) # BAD style!!
	if is_string(args): args = [args]
	old = current_token
	pre = the.previous_word
	while not (checkEndOfLine()):
		for x in args:
			if current_word == x:
				set_token(old)
				return x
		next_token()
		if do_raise and (current_word == ';' or current_word == '\n'):
			break
	set_token(old)
	the.previous_word = pre
	if do_raise:
		raise NotMatching("must_contain " + str(args))
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
	if not good: raise NotMatching
	return good


def must_contain_before_old(before, *args):  # ,before():None
	raiseEnd()
	good = False
	if before and is_string(before): before = [before]
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

	if not good: raise NotMatching
	for nl in english_tokens.newline_tokens:
		if nl in str(good): raise NotMatching  # ;while
		# if nl in str(good.pre_match): raise (NotMatching(x))  # ;while
	return OK


def starts_with_(param):
	return maybe(lambda: starts_with(param))

# ~ look_ahead 0
def starts_with(tokenz):
	if checkEndOfLine(): return False
	if is_string(tokenz):
		return tokenz == the.token
	if the.token in tokenz:
		return the.token
	# for t in tokenz:
	#     if t == the.current_word:
	#         return t
	return False


# NOT starts_with!!!
# expect_next token(s)
def look_1_ahead(expect_next, doraise=False, must_not_be=False, offset=1):
	if the.token == '': return False
	if the.token_number + 1 >= the.tokens_len:
		print("BUG: this should not happen")
		return False
	token = the.tokenstream[the.token_number + offset]
	if expect_next == token[1]:
		return True
	elif isinstance(expect_next, list) and token[1] in expect_next:
		return True
	else:
		if must_not_be:
			return OK  # NOT FOUND
		if doraise:
			raise NotMatching(doraise)
		return False


def _(x):
	return token(x)


def lastmaybe(stack):
	for s in stack:
		if re.search("try", s):
			return s


def caller_name():
	return caller()


# remove the border, if above border
def adjust_interpret():
	depth = caller_depth()
	if (context.interpret_border > depth - 2):
		context.interpret = context.did_interpret
		context.interpret_border = -1  # remove the border
		do_interpret()


def do_interpret():
	if context.use_tree: return
	if (context.did_interpret != context.interpret):
		context.did_interpret = context.interpret
	context.interpret = True


def dont_interpret():
	depth = caller_depth()
	if context.interpret_border < 0:
		context.interpret_border = depth
		context.did_interpret = context.interpret
	context.interpret = False


def interpreting():
	if context.use_tree: return False
	return context.interpret


def check_rollback_allowed():
	c = caller_depth
	throwing = True  # []
	level = 0
	return c < no_rollback_depth or c > no_rollback_depth + 2


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


def no_rollback():
	depth = caller_depth() - 1
	the.no_rollback_depth = depth
	the.rollback_depths.append(depth)


def adjust_rollback(depth=-1):
	try:
		if depth == -1: depth = caller_depth()
		if depth <= the.no_rollback_depth:
			allow_rollback(1)  # 1 extra depth for this method!
	except Exception as e:
			error(e)
	except Error as e:
		error(e)


def allow_rollback(n=0):
	if n < 0: the.rollback_depths = []
	depth = caller_depth() - 1 - n
	if len(the.rollback_depths) > 0:
		the.no_rollback_depth = the.rollback_depths[-1]
		while the.rollback_depths[-1] >= depth:
			the.no_rollback_depth = the.rollback_depths.pop()
			if len(the.rollback_depths) == 0:
				if the.no_rollback_depth >= depth:
					the.no_rollback_depth = -1
				break
	else:
		the.no_rollback_depth = -1


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
	# if previous_word
	if the.token_number > 1:
		previous_offset = the.tokenstream[the.token_number - 1][2][1]
		if previous_offset > the.current_offset:
			return True
	return the.current_type == _token.INDENT or the.current_offset == 0


def block(multiple=False):  # type):
	global last_result, original_string
	from english_parser import statement, end_of_statement, end_block
	maybe_newline() or not "=>" in the.current_line and maybe_tokens(english_tokens.start_block_words)  # NEWLINE ALONE / OPTIONAL!!!???
	start = pointer()
	# maybe(comment_block)
	statement0 = statement(False)
	statements = [statement0] if statement0 else []
	# content = pointer() - start
	end_of_block = maybe(end_block)  # ___ done_words
	while (multiple or not end_of_block) and not checkEndOfFile():
		end_of_statement()  # danger, might act as block end!
		no_rollback()  # if ...
		if multiple: maybe_newline()

		# star(end_of_statement)

		def lamb():
			try:
				# print_pointer(True)
				maybe_indent()
				s = statement()
				statements.append(s)
			except NotMatching as e:
				if starts_with(english_tokens.done_words) or checkNewline():
					return False  # ALL GOOD
				print("Giving up block")
				print_pointer(True)
				raise Exception(str(e) + "\nGiving up block\n" + pointer_string())
			# content = pointer() - start
			return end_of_statement()

		star(lamb, giveUp=True)
		# maybe(end_of_statement)
		end_of_block = end_block()
		if not multiple: break

	the.last_result = the.result
	if interpreting(): return statements[-1]
	if len(statements)==1:statements=statements[0]
	if context.use_tree:
		the.result = statements  #
	# if context.debug:print_pointer(True)
	return statements  # content
	# if angel.use_tree:
	# p=parent_node()
	# if p: p.content=content
	#   p


def maybe(expr):
	global original_string, last_node, current_value, depth, current_node, last_token
	if not isinstance(expr, collections.Callable):  # duck!
		return maybe_tokens(expr)
	the.current_expression = expr
	depth = depth + 1
	if (depth > context.max_depth): raise SystemStackError("len(nodes)>max_depth)")
	old = current_token
	try:
		result = expr()  # yield <<<<<<<<<<<<<<<<<<<<<<<<<<<<
		adjust_rollback()
		if context._debug and (isinstance(result, collections.Callable)) and not isinstance(result, type):
			raise Exception("BUG!? returned CALLABLE " + str(result))
		if result or result == 0:  # and result!='False'
			verbose("GOT result " + str(expr) + " : " + str(result))
		else:
			verbose("No result " + str(expr))
			set_token(old)
			# the.string = old
		last_node = current_node
		return result
		# except (NotMatching, EndOfLine) as e:
	except EndOfLine as e:
		if verbose: verbose("Tried %d %s %s, got %s" % (the.current_offset, the.token, expr, e))
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
			# if context._verbose:
			#     print(last_token)
			# print_pointer()  # ALWAYS!
			# if context.use_tree:
			#     import TreeBuilder
			#     TreeBuilder.show_tree()  # Not reached
			ex = GivingUp(str(e) + "\n" + to_source(expr) + "\n" + pointer_string())
			raise ex
			# error e #exit
			# raise SyntaxError(e)
	except EndOfDocument as e:
		set_token(old)
		verbose("EndOfDocument")
		# error(e)
		# raise e,None, sys.exc_info()[2]
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
	except Exception as e:
		error(e)
		raise  # reraise!!! with traceback backtrace !!!!
	except Error as e:
		error(e)
		raise  # reraise!!! with traceback backtrace !!!!
	finally:
		depth = depth - 1
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
	more = the.current_offset and star(expressions)
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


def clear():
	global variables, variableValues
	verbose("clear all variables, methods, ...")
	variables = {}
	variableValues = {}
	# the._verbose=True # False
	context.testing = True
	the.variables.clear()
	the.variableTypes.clear()
	the.variableValues.clear()
	context.in_hash = False
	context.in_list = False
	context.in_condition = False
	context.in_args = False
	context.in_params = False
	context.in_pipe = False
	if not context.use_tree:
		do_interpret()


import io

try:
	file_types = (extensions.file, extensions.xfile, io.IOBase)
except NameError:
	file_types = (io.IOBase,)  # py3 --

# noinspection PyTypeChecker
def parse(s, target_file=None):
	global last_result, result
	if not s: return
	# verbose("PARSING " + s)
	if (isinstance(s, file_types)):
		source_file = s.name
		s = s.readlines()
	elif s.endswith(".e") or s.endswith(".an"):
		target_file = target_file or s + ".pyc"
		source_file = s
		s = open(s).readlines()
	else:
		source_file = 'out/inline'
		try:open(source_file, 'wt').write(s)
		except:debug("no out directory")
	if context._debug:
		print("  File \"%s\", line 1" % source_file)
	if (len(s) < 1000):
		verbose("--------PARSING:---------")
		verbose(s)
		verbose("-------------------------")
	try:
		import english_parser
		if isinstance(s, file_types):
			source_file = str(s)
			target_file = source_file + ".pyc"
			s = s.readlines()
		if not is_string(s) and not isinstance(s, list):
			the.result = s
			return english_parser.interpretation()  # result, hack
		allow_rollback()
		init(s)
		the.result = english_parser.rooty()
		if isinstance(the.result, FunctionCall):
			the.result = english_parser.do_execute_block(the.result)
		if the.result in ['True', 'true']: the.result = True
		if the.result in ['False', 'false']: the.result = False
		if isinstance(the.result, Variable): the.result = the.result.value
		import ast
		got_ast = isinstance(the.result, ast.AST)
		if isinstance(the.result, list) and len(the.result) > 0:
			got_ast = isinstance(the.result[0], ast.AST)
		if context.use_tree and got_ast:
			import pyc_emitter
			the.result = pyc_emitter.eval_ast(the.result, {}, source_file, target_file, run=True)
		else:
			if isinstance(the.result, ast.Num): the.result = the.result.n
			if isinstance(the.result, ast.Str): the.result = the.result.s
		the.last_result = the.result
	except Exception as e:
		error(target_file)
		print_pointer(True)
		raise  # blank reraises e with stacktrace
	# except NotMatching as e:
	#     import traceback
	#     traceback.print_stack() # backtrace
	#     the.last_result = the.result = None
	#     e=filter_backtrace(e)
	#     error(e)
	#     print_pointer(True)
	except IgnoreException as e:
		pass

	verbose("PARSED SUCCESSFULLY!")
	if context._debug:
		print("  File \"%s\", line 1" % source_file)
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


def token(t, expected=''):  # _new
	if isinstance(t, list):
		return tokens(t)
	raiseEnd()
	if current_word == t:
		next_token()
		return t
	else:
		# verbose('expected ' + str(result))  #
		# print_pointer()
		raise NotMatching(expected + " " + t + "\n" + pointer_string())


def tokens(tokenz):
	raiseEnd()
	ok = maybe_tokens(tokenz)
	if (ok): return ok
	raise NotMatching(str(tokenz) + "\n" + pointer_string())


def escape_token(t):
	z = re.sub(r'([^\w])', "\\\\\\1", t)
	return z

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
	       the.token == '\n' or \
	       the.token == '' or \
				 the.token_number >= len(the.tokenstream)
	# if the.string.blank? # no:try,try,try  see raiseEnd: raise EndOfDocument.new
	# return not the.string or len(the.string)==0


def checkEndOfFile():
	return current_type == _token.ENDMARKER or the.token_number >= len(the.tokenstream)
	# return line_number >= len(lines) and not the.string


def maybe_newline():
	return checkEndOfFile() or newline(doraise=False)


def newline(doraise=False):
	if checkNewline() == english_tokens.NEWLINE or the.token == ';' or the.token == '':
		next_token()
		if (the.current_type == 54):
			next_token()  # ??? \r\n ? or what is this, python?
		while (the.current_type == _token.INDENT):
			next_token()  # IGNORE FOR NOW!!!!
		return english_tokens.NEWLINE
	found = maybe_tokens(english_tokens.newline_tokens)
	if found: return found  # todo CLEANUP!!!
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
	while not checkEndOfLine() and not current_word == ';':
		rest += current_word + " "
		next_token(False)
	return rest.strip()


def comment_block():
	token('/')
	token('*')
	while True:
		if the.token == '*':
			next_token()
			if the.token == '/':
				return True
		next_token()


@Starttokens(['//', '#', '\'', '--']) # , '/' regex!
def skip_comments():
	if the.token is None: return
	l = len(the.token)
	if l == 0: return
	if the.current_type == tokenize.COMMENT:
		next_token()
	# if the.current_word[0]=="#": ^^ OK!
	#        return rest_of_line()
	if l > 1:
		# if current_word[0]=="#": rest_of_line()
		if the.token[0:2] == "--": return rest_of_line()
		if the.token[0:2] == "//": return rest_of_line()
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

@Starttokens(u'\xbd') # todo python2 wtf
def fraction():
	f = maybe(integer) or 0
	m = starts_with(["¼", "½", "¾", "⅓", "⅔", "⅕", "⅖", "⅗", "⅘", "⅙", "⅚", "⅛", "⅜", "⅝", "⅞"])
	# m = m or starts_with(["\xc2\xbc", "\xc2\xbd", "\xc2\xbe", "\xe2\x85\x93", "\xe2\x85\x94", "\xe2\x85\x95", "\xe2\x85\x96", "\xe2\x85\x97", "\xe2\x85\x98", "\xe2\x85\x99", "\xe2\x85\x9a", "\xe2\x85\x9b", "\xe2\x85\x9c", "\xe2\x85\x9d", "\xe2\x85\x9e"])
	# m = m or starts_with(['\xc2'])
	if not m:
		# if f==ZERO: return 0 NOT YET!
		if f != 0:
			return f
		raise NotMatching()
	else:
		next_token()
		# AttributeError: 'unicode' object has no attribute 'parse_number'
		from extensions import xstr
		m = xstr(m).parse_number()
	the.result = float(f) + m
	return the.result


# maybe(complex)  or
ZERO = '0'


def integer():
	match = re.search(r'^\s*(-?\d+)', the.string)
	if match:
		current_value = int(match.groups()[0])
		next_token(False)  # Advancing by hand, its not a regular token
		# "E20": kast.Pow(10,20),
		# if not interpreting(): return ast.Num(current_value)
		# import kast.kast
		from kast import kast
		# import ast
		if context.use_tree: return kast.Num(current_value)
		# if context.use_tree: return ast.Num(current_value)
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
		next_token(False)
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
		next_token(False)
		return current_value
	return False


def maybe_indent():
	while the.current_type == _token.INDENT or the.token == ' ':
		next_token()


def method_allowed(meth):
	if len(meth) < 2: return False
	if meth in ["print"]: return True
	if meth in ["evaluate", "eval", "int", "True", "False", "true", "false", "the", "Invert", "char"]: return False
	if meth in english_tokens.keywords: return False
	return True


def load_module_methods():
	import warnings
	warnings.filterwarnings("ignore", category=UnicodeWarning)

	try:
		import pickle as pickle
	except:
		import pickle
	# static, load only once, create with module_method_map.py
	the.methodToModulesMap = pickle.load(open(context.home + "/data/method_modules.bin", 'rb'))
	the.moduleMethods = pickle.load(open(context.home + "/data/module_methods.bin", 'rb'))
	the.moduleNames = pickle.load(open(context.home + "/data/module_names.bin", 'rb'))
	the.moduleClasses = pickle.load(open(context.home + "/data/module_classes.bin", 'rb'))
	import english_parser

	for mo, mes in list(the.moduleMethods.items()):
		if not method_allowed(mo): continue
		the.method_token_map[mo] = english_parser.method_call
		for meth in mes:
			if method_allowed(meth):
				the.method_token_map[meth] = english_parser.method_call
	for mo, cls in list(the.moduleClasses.items()):
		for meth in cls:  # class as CONSTRUCTOR
			if method_allowed(meth):
				the.method_token_map[meth] = english_parser.method_call

	# if not the.method_names: # todo pickle
	the.constructors = list(the.classes.keys()) + english_tokens.type_names
	the.method_names = list(the.methods.keys()) + c_methods + list(
		methods.keys()) + core_methods + builtin_methods + list(the.methodToModulesMap.keys())
	# for c in constructors:
	#     if not c in the.method_names: the.method_names.append(c)
	for x in dir(extensions):
		the.method_names.append(x)
	context.extensionMap = extensions.extensionMap
	for _type in context.extensionMap:
		ex = context.extensionMap[_type]
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

# context.starttokens_done=True
