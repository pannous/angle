import sys

py2 = sys.version < '3'
py3 = sys.version >= '3'

# import context as context
# import context
# from context import *
# __all__ = ['context','english_parser']

import angle.english_parser 

def compile(file):
	english_parser.parse(file)

def eval(code):
	english_parser.parse(code)