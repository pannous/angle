import _ast
import ast
import sys
import collections

import context

py3 = sys.version >= '3'
if py3:
	import builtins as __builtin__
else:
	import __builtin__  # py2

# https://github.com/flier/pyv8

# truffle on graal JVM has faster runs, but sloooooow startup 6SECONDS for HELLOWTF
# https://stackoverflow.com/questions/31901940/why-is-ruby-irb-iteration-so-slow/31906922#31906922

# python+truffle = zippy

# talk at PyCon 2015 about Jython 2.7, including new features: https://www.youtube.com/watch?v=hLm3garVQFo

# PyV8 is a python wrapper for Google V8 engine, it act as a bridge between the Python and JavaScript objects, and support to hosting Google's v8 engine in a python script.
#
# >>> import PyV8
# >>> js = PyV8.JSContext()          # create a context with an implicit global object
# >>> js.enter()                     # enter the context (also support with statement)
# >>> js.eval("1+2")                 # evalute the javascript expression
# 3                                    # return a native python int
# >>> class Global(PyV8.JSClass):      # define a compatible javascript class
# ...   def hello(self):               # define a method
# ...     print "Hello World"
# ...
# >>> js2 = PyV8.JSContext(Global()) # create another context with the global object
# >>> js2.enter()
# >>> js2.eval("hello()")            # call the global object from javascript
# Hello World                          # the output from python script



# import __builtin__

# import codegen
import astor as codegen  # https://pypi.python.org/pypi/astor
from astor.codegen import SourceGenerator as sourcegen

sourcegen.visit_Function = sourcegen.visit_FunctionDef  # Love Python <3 !!
sourcegen.visit_function = sourcegen.visit_FunctionDef  # ???
sourcegen.visit_FunctionCall = sourcegen.visit_Call
sourcegen.visit_Variable = sourcegen.visit_Name
sourcegen.visit_Argument = sourcegen.visit_Name
sourcegen.visit_Condition = sourcegen.visit_Compare
# import english_parser
from kast.kast import Print, assign, name
from kast import kast
import nodes
import context as the

to_inject = []
to_provide = {}  # 'global' params for exec


class Reflector(object):  # Implements list interface is
	def __getitem__(self, name):
		import english_parser
		if name == "__tracebackhide__":
			return False  # for py.test
		print(("Reflector __getitem__ %s" % str(name)))
		if name in the.params:
			the.result = english_parser.do_evaluate(the.params[name])
		elif name in the.variables:
			the.result = english_parser.do_evaluate(the.variables[name].value)
		elif name in locals():
			return locals()[name]
		elif name in globals():
			return globals()[name]
		elif __builtin__.hasattr(__builtin__, name):  # name in __builtin__:
			return __builtin__.getattr(__builtin__, name)
		elif name == 'reverse':
			return list.reverse
		elif name in the.methods:
			m = the.methods[name]
			if isinstance(m, nodes.FunctionDef):
				raise Exception("%s must be declared or imported before!" % m)
				m = m.body  # INJECT!
			return m
		else:
			print(("UNKNOWN ITEM %s" % name))
			return name  # kast.name(name)
			# raise Exception("UNKNOWN ITEM %s" % name)
		return the.result

	def __setitem__(self, key, value):
		print(("Reflector __setitem__ %s %s" % (key, value)))
		if key in the.variables:
			the.variables[key].value = value
		else:
			the.variables[key] = nodes.Variable(name=key, value=value)
		the.variableValues[key] = value
		the.result = value


class PrepareTreeVisitor(ast.NodeTransformer):
	parents = []

	def __repr__(self):
		return "<PrepareTreeVisitor>"

	def generic_visit(self, node, wrap=False):
		self.parents.append(node)
		self.current = node
		if not isinstance(node, (ast.AST,_ast.AST)):
			if wrap:
				return wrap_value(node)
			else:
				return node  # None->Name('None') NOT HERE!
		for field, old_value in ast.iter_fields(node):
			old_value = getattr(node, field, None)
			new_node = self.visit(old_value)
			# if new_node is None: new_node is Delete  no, keep starargs=None etc!
			# if new_node is Delete
			#     delattr(node, field)
			# else:
			if new_node is not None and new_node != old_value:
				setattr(node, field, new_node)
		self.parents.pop()
		return node

	def parent(self):
		return self.parents[-1]


	# def visit_list(self, x):
	# 	if len(x) == 1: return [self.generic_visit(x[0])]  # bad workaround!
	# 	print("WHAT to do about lists? " + str(x))
	# 	return x  #
	def visit_list(self, xs):  # conflict: if isinstance(old_value, list): wrap before!
		new_values = []
		for value in xs:
			value = self.visit(value)
			if value is None:
				continue
			elif not isinstance(value, ast.AST):
				# new_values.extend(value)
				new_values.append(value)
				continue
			new_values.append(value)
		# new_nodes[:] = new_values
		return new_values
		# parent = self.parent()
		# if isinstance(parent, ast.Module):
		#     return xs
		# else:
		#     return ast.List(xs, ast.Load())

	def visit_xlist(self, x):
		# return kast.List(x,ast.Load())
		return kast.List(self.visit_list(x), ast.Load())

	def visit_float(self, x):
		return ast.Num(x)

	def visit_Num(self, x):
		return x  # and done!

	def visit_function(self, x):
		return name(x.__name__)  # assign method via name

	def visit_Name(self, x):
		return x  # and done!

	def visit_Print(self,x):
		return None# _ast.Pass()
	# def visit_Print(self, x):
	#     return ast.Expr(x)

	def visit_Call(self, x):
		return x  # and done!

	def visit_BinOp(self, node):
		if isinstance(node.left , nodes.Variable):
			# node.left.context =_ast.Load()
			node.left=kast.name(node.left.name)
		if isinstance(node.right, nodes.Variable):
			node.right.context=_ast.Load()
		#
		# node.right=wrap_value(node.right) #why here?
		# node.left=wrap_value(node.left) #why here?
		return node
	#     return self.generic_visit(node)
	#     if not isinstance(self.parent,(ast.Expr,ast.Assign)):
	#         return ast.Expr(value=self.generic_visit(node)) #
	#     else: return self.generic_visit(node)
	def visit_Str(self, x):
		return x  # against:

	def visit_str(self, x):
		if x == '0': return _ast.Num(0)
		if x == 'False': return kast.false
		if isinstance(self.current, (ast.Str, ast.Name, ast.FunctionDef, ast.Attribute, ast.alias, ast.keyword)):
			return x  # todo: whitelist!!
		return ast.Str(x)

	def visit_int(self, x):
		return ast.Num(x)

	def visit_Assign(self, x):
		return self.generic_visit(x)

	def visit_Pass(self, x):
		return ast.Expr(x)

	def visit_Variable(self, x):  # codegen doesn't like inheritance
		return ast.Name(x.name, x.ctx)
		# return ast.Name(x.name,ast.Load())

	def visit_arguments(self, x):
		return x  # WHY???

	def visit_Function(self, x):  # old:
		return self.visit_FunctionDef(x)

	def visit_FunctionDef(self, x):
		x.body = list(map(self.generic_visit, x.body))
		x.body = fix_block(x.body)
		if not x in to_inject:
			to_inject.append(x);
		x.args = ast.arguments(args=map_values(x.arguments), vararg=None, kwarg=None, defaults=[])
		x.decorator_list = x.decorators or []  # for now!!
		return x

	def visit_Argument(self, x):
		if isinstance(x.value, nodes.Variable):
			return self.visit_Variable(x)
		return self.generic_visit(x.value)
		# x.ctx=ast.Load()
		# return x
		# def generic_visit(self, node):

	def visit_FunctionCall(self, node):
		if node.name in the.methods:
			function_def = the.methods[node.name]
			if isinstance(function_def, ast.FunctionDef):
				to_inject.append(function_def)
			elif isinstance(function_def, collections.Callable):
				to_provide[node.name] = function_def
			else:
				print("HUH")
			print(("NEED TO IMPORT %s ??" % function_def))
		skip_assign = True
		node.value.args = map_values(node.value.args)
		if skip_assign:
			# return node.value
			return self.generic_visit(node.value)  # skip_assign
		else:
			node.name = kast.name(node)
			node.value = wrap_value(node.value)
			return node


# Module(body=[Expr(value=Num(n=1, lineno=1, col_offset=0), lineno=1, col_offset=0)])
# Module([Expr(Num(1))])
def fix_ast_module(my_ast, fix_body=True):
	# gotta wrap: 1 => Module(body=[Expr(value=[Num(n=1)])])
	if not type(my_ast) == ast.Module:
		# my_ast = flatten(my_ast)
		if not isinstance(my_ast, list):
			my_ast = [my_ast]

		def wrap_stmt(s):
			if not isinstance(s, ast.stmt) and not isinstance(s, ast.Expr):
				return ast.Expr(s)
			else:
				return s

		# my_ast = map(wrap_stmt,my_ast)
		my_ast = ast.Module(body=my_ast)

	PrepareTreeVisitor().visit(my_ast)

	if fix_body:
		# my_ast.body.insert(0, kast.setter(name('it'), kast.none))  # save here, unlike in block!
		# my_ast.body.insert(0, ast.Global(names=['it']))
		# my_ast.body.insert(0, ast.Import([name('angle.extensions')]))
		# my_ast.body.insert(0, ast.Import([name('extensions')]))
		# my_ast.body.insert(0, ast.Import([ast.alias('extensions', None)]))
		# my_ast.body.insert(0, ast.Import([ast.alias('extension_functions', None)]))
		# ImportFrom(module='ast', names=[alias(name='*', asname=None)], level=0)
		# my_ast.body.insert(0, ast.ImportFrom(module='extension_functions', names=[ast.alias(name='*',  asname=None)],level= 0))
		# my_ast.body.insert(0, ast.ImportFrom('extension_functions', [str('*')], 0))
		# my_ast.body.insert(0, ast.ImportFrom('angle', [ast.alias('extensions', None)], 0))
		my_ast.body.insert(0, ast.ImportFrom('angle.extensions', [ast.alias('*', None)], 0))
		for s in to_inject:
			if not s in my_ast.body:
				my_ast.body.insert(0, s)
		fix_block(my_ast.body, returns=False, prints=True)
	my_ast = ast.fix_missing_locations(my_ast)
	print_ast(my_ast)
	return my_ast


def fix_block(body, returns=True, prints=False):
	# if not isinstance(body[0], ast.Global):
	body.insert(0, ast.Global(names=['it']))
	# body.insert(1, kast.setter(name('it'),kast.none))
	last_statement = body[-1]
	if isinstance(last_statement, list) and len(last_statement) == 1:
		last_statement = last_statement[0]
		print("HOW??")
	if not isinstance(last_statement, (ast.Assign, ast.If, nodes.FunctionDef, ast.Return, ast.Assert)):
		if isinstance(last_statement, kast.Print):
			body[-1] = (assign("it", last_statement.values[0]))
			last_statement.values[0] = name("it")
			body.append(last_statement)
		else:
			body[-1] = (assign("it", last_statement))
	if isinstance(last_statement, ast.Assign):
		if not "it" in [x.id for x in last_statement.targets]:
			last_statement.targets.append(name("it"))
	if returns and not isinstance(body[-1], ast.Return):
		body.append(ast.Return(name("it")))
	# if prints:
	# 	if py3:pass#body.append(kast.call("print", name("it")))
		# else:body.append(Print(dest=None, values=[name("it")], nl=True))  # call symbolically!
	return body


def get_globals(args):
	my_globals = {}  # # context_variables=variableValues.copy()+globals()+locals()
	my_globals.update(the.variableValues.copy())
	my_globals.update(the.params)
	my_globals.update(the.methods)
	my_globals.update(globals())
	if isinstance(args, dict):
		the.params.update(args)
	else:
		print("What the hell do you think you're doing, I need a dictionary as args (not a list)")
	return my_globals


def get_ast(python, source='out/inline.py', _context='exec'):
	py_ast = compile(python, source, _context, ast.PyCF_ONLY_AST)  # 'eval' only for ONE Expr!!
	print_ast(py_ast)
	return py_ast


def print_ast(my_ast, source_file='out/inline'):
	try:
		x = ast.dump(my_ast, annotate_fields=True, include_attributes=True)
		open(source_file + ".ast", 'wt').write("from ast import *\ninline_ast=" + x.replace('(', '(\n'))
		print(x)
		print("")
		x = ast.dump(my_ast, annotate_fields=False, include_attributes=False)
		open(source_file + ".short.ast", 'wt').write("short_ast=" + x)
		print(x)
		print("")
	except Exception as e:
		print(e)
		print(("CAN'T DUMP ast / print_ast %s" % my_ast))
		if not isinstance(my_ast, list):
			print((my_ast.body))


def print_source(my_ast, source_file='out/inline'):
	try:
		source = codegen.to_source(my_ast)
		open(source_file + ".py", 'wt').write(source)
		print(source)  # => CODE
	except:
		# raise
		print("SOURCE NOT STANDARD CONFORM")
		import traceback
		traceback.print_exc()  # backtrace


def eval_ast(my_ast, args={}, source_file='out/inline', target_file=None, run=False, fix_body=True, _context='exec'):
	try:  # todo args =-> SETTERS!
		while len(to_inject) > 0: to_inject.pop()  # clear
		my_ast = fix_ast_module(my_ast, fix_body=fix_body)
		# The mode must be 'exec' to compile a module, 'single' to compile a
		# single (interactive) statement, or 'eval' to compile a SINGLE expression.
		print("///////////////")
		print(my_ast)
		code = compile(my_ast, source_file, 'exec')  # regardless!
		# TypeError: required field "lineno" missing from expr NONONO!
		# this as a documentation bug, this error can mean >>anything<< except missing line number!!! :) :( :( :(
		if context.use_tree and not run:
			the.result = my_ast
			return my_ast  # code #  Don't evaluate here, run_ast() later!

		print_source(my_ast, source_file)

		emit_pyc(code, target_file or source_file + ".pyc")

		ret = run_ast(my_ast, source_file, args, fix=False, code=code, _context=_context)  #
		# ret = run_ast(my_ast, source_file, args, fix=False, code=code, context='eval')
		# err= sys.stdout.getvalue()
		# if err: raise err
		# z=exec (code)
		the.params.clear()
		return ret
	# except NameError as e:
	except Exception as e:
		print(e)
		print(my_ast)
		print_ast(my_ast, source_file)
		print_source(my_ast, source_file)
		info_ = sys.exc_info()[2]
		# if py3: raise e from e # py3 WTF WTF , how to do both??
		raise# e.with_traceback(info_)


class Namespace():
	def __init__(self, variables):
		self.variables = variables


def run_ast(my_ast, source_file="(String)", args=None, fix=True, _context='', code=None):
	if not args: args = {}
	if fix: my_ast = fix_ast_module(my_ast)
	if not code: code = compile(my_ast, source_file, 'exec')
	# TypeError: required field "lineno" missing from expr:
	# NONONO this as a documentation bug, this error can mean >>anything<< except missing line number!!! :) :( :( :(

	# eval can't handle arbitrary python code (eval("import math") ), and
	# exec() doesn't return the results directly, BUT via namespace YAY!
	if _context == 'eval':
		my_globals = get_globals(args)
		ret = eval(code, my_globals, Reflector())  # in _context
	else:
		# http://lucumr.pocoo.org/2011/2/1/exec-in-python/
		args.update(to_provide)  # globals
		namespace = context.variables
		namespace.update(args) # << GIVE AND RECEIVE GLOBALS!!
		namespace['it'] = None  # better than ast.global
		# namespace=Namespace(namespace)
		exec(code, namespace)  # self contained!
		ret = namespace['it']  # set internally via dict_set_item_by_hash_or_entry # crash !?
	ret = ret or the.result
	# verbose("GOT RESULT %s" % ret)
	return ret


def map_values(val):
	return list(map(wrap_value, val))


def wrap_value(val):
	if not val:
		return kast.none
	import nodes
	if isinstance(val, nodes.Argument):
		if val.name:
			return ast.Name(id=val.name, ctx=_ast.Load())  # if FunctionCall
			# return ast.Name(id=val.name, ctx=_ast.Param()) # if FunctionDef
		else:
			return wrap_value(val.value)
	if isinstance(val, ast.AST): return val
	if isinstance(val, str): return kast.Str(val)
	if isinstance(val, int): return kast.Num(val)
	if isinstance(val, float): return kast.Num(val)
	if isinstance(val, tuple): return kast.Tuple(list(map(wrap_value, val)), ast.Load())
	if isinstance(val, list): return kast.List(list(map(wrap_value, val)), ast.Load())
	if isinstance(val, dict): return kast.Dict(list(map(wrap_value, val)), ast.Load())
	t = type(val)
	raise Exception("UNKNOWN TYPE %s : %s !" % (val, t))


def emit_pyc(code, fileName='output.pyc'):
	import marshal
	import py_compile
	import time
	with open(fileName, 'wb') as fc:
		fc.write(b'\0\0\0\0')
		# py_compile.wr_long(fc, int(time.time()))
		marshal.dump(code, fc)
		fc.flush()
		fc.seek(0, 0)
		# fc.write(py_compile.MAGIC)
		print(("WRITTEN TO " + fileName))
