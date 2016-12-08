#!/usr/local/bin/python



import ast
import os
# from ast import *
import ipython_genutils.py3compat
import sys

if 'TESTING' in os.environ:
	quit(1)
	# tests.parser_test_helper.skip()
	# raise Warning("Don't Test this")

# from kast import *
# import astor
# from angle import english_parser
# from angle.nodes import Argument
from astor import codegen

do_exec =False

if len(sys.argv) > 1:
	expr = arg = sys.argv[1]
	if expr.endswith(".py"):
		expr=open(expr).read()
		do_exec=True
	my_ast = ast.parse(expr)
	print(expr)
	print("")
	x = ast.dump(my_ast, annotate_fields=True, include_attributes=True)
	print(x)
	print("\n--------MEDIUM--------\n")
	x = ast.dump(my_ast, annotate_fields=True, include_attributes=False)
	print(x)
	print("\n--------SHORT--------\n")
	x = ast.dump(my_ast, annotate_fields=False, include_attributes=False)
	print(x)
	print("")
	if do_exec: exec(expr)
	exit(0)

try:
	inline_ast = "set in execfile:"
	ipython_genutils.py3compat.execfile("out/inline.ast", glob={})
	source = codegen.to_source(inline_ast)
	print(source)  # => CODE
	my_ast = ast.fix_missing_locations(inline_ast)
	code = compile(inline_ast, "out/inline", 'exec')
except Exception as e:
	print(e)
# raise
if do_exec:
	exec(code)
