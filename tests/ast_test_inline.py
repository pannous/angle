#!/usr/local/bin/python
import ast
import os
import ipython_genutils.py3compat
import sys
from astor import codegen

if 'TESTING' in os.environ:
	quit(1)

ast_file = "out/inline.ast"
do_exec = False
arg = None
if len(sys.argv) > 1:
	arg = sys.argv[1]

if arg and ".ast" in arg:
	ast_file = arg
elif arg:
	if arg.endswith(".py"):
		expr = open(arg).read()
		do_exec = True
	my_ast = ast.parse(arg)
	print(arg)
	print("")
	x = ast.dump(my_ast, annotate_fields=True, include_attributes=True)
	print(x)
	print("\n--------MEDIUM-------- (ok)\n")
	x = ast.dump(my_ast, annotate_fields=True, include_attributes=False)
	print(x)
	print("\n--------SHORT-------- (view-only)\n")
	x = ast.dump(my_ast, annotate_fields=False, include_attributes=False)
	print(x)
	print("")
	if do_exec: exec(expr)
	exit(0)

try:
	inline_ast = "set in execfile:"
	exec(open(ast_file).read())
	try:
		source = codegen.to_source(inline_ast)
		print(source)  # => CODE
	except Exception as ex:
		print(ex)
	my_ast = ast.fix_missing_locations(inline_ast)
	code = compile(inline_ast, "out/inline", 'exec')
	# if do_exec:
	exec(code)
except Exception as e:
	raise
