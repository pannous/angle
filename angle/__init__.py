import sys

__version__="0.1.10",

py2 = sys.version < '3'
py3 = sys.version >= '3'

# import context as context
# import context
# from context import *
# __all__ = ['context','english_parser']

import angle.english_parser 

def compile(file):
	return english_parser.parse(file).result

def eval(code):
	return english_parser.parse(code).result
