#!/usr/bin/env python

from parser_test_helper import *


class BashTest(ParserBaseTest):

	def test_ls(self):
		g = parse("ls | row 4")
		f = parse("ls | item 4")
		assert_equals(g, f)
		assert_contains(f, '.')

	def test_ls_type(self):
		x = parse("bash 'ls -al' | column 1")
		assert_equals(type(x),xlist)

	def test_pipe(self):
		x = parse("bash 'ls -al' | column 1| row 2")
		if not x: assert_contains(x, "number")

	# def test_pipe2(self):
	#     parse("def column n:n;bash 'ls -al' | column 1| row 2")
