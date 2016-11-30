#!/usr/local/bin/python
import ast
import os
# from ast import *
from kast import *
# from angle import english_parser
# from angle.nodes import Argument
from astor import codegen
try:
	execfile("out/inline.ast")
	source=codegen.to_source(inline_ast)
	print(source) # => CODE
	my_ast=ast.fix_missing_locations(inline_ast)
	code=compile(inline_ast, "out/inline", 'exec')
except Exception as e:
	print e
	# raise

