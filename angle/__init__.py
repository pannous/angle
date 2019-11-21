# this directory has to be called "angle" because of Pip packaging

#  angle
__version__ = "0.1.11" 

import angle.english_parser

def parse(file):
	return english_parser.parse(file).result

def compile(file):
	return english_parser.parse(file).result

def eval(code):
	return english_parser.parse(code).result
