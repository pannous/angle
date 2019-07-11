#!/usr/bin/env python
# encoding: utf-8

import angle

from parser_test_helper import *


class MacTest(ParserBaseTest,unittest.TestCase):
    

    def test_mail(self):
        pass


    def test_bash2(self):
        parse('exec ls')
        parse('bash ls')
        parse('ls "."')
        parse('ls')
        parse('x=ls')

    def test_bash(self):
        assert_result_is("½*2",1)

    # parse('x=ls\na=x[1]')
        # parse('x=ls;a=x[1]')#// messed up a=
        # parse('`ls`')


    def test_applescript(self):
        if (ENV['APPLE']): skip()
        parse('Tell application "Finder" to open home')

    def test_files(self):
        if (ENV['APPLE']): skip()
        variables['x'] = ['/Users/me', ]
        variables['my home folder'] = ['/Users/me', ]
        assert('/Users/me == x')
        assert('my home folder == /Users/me')
        assert('my home folder == x')

    def test_files3(self):
        if (ENV['APPLE'], ):
            skip()
        skip()
        init('my home folder = Dir.home')
        parser.setter()
        init('my home folder == /Users/me')
        parser.condition()
        init('/Users/me/.bashrc ok')
        p = parser.linuxPath()
        init('Dir.home')
        r = parser.rubyThing()
        parse('x := /Users/me ')
        assert('my home folder == /Users/me')
        assert('/Users/me == x')
        assert('my home folder == x')

    def test_variable_transitivity(self):
        if (ENV['APPLE'], ):
            skip()
        parse('my home folder = Dir.home ')
        parse('xs= my home folder ')
        assert('xs = /Users/me')

    def test_contains_file(self):
        if (ENV['APPLE'], ):
            skip()
        parse('xs= all files in Dir.home')
        p(variables['xs'])
        assert('xs contains .bashrc')
        parse('xs= Dir.home')
        assert('xs contains .bashrc')
        parse('xs=/Users/me')
        assert('xs contains .bashrc')
        parse('my home folder = Dir.home')
        parse('my home folder is Dir.home')
        p(variables())
        p(variableValues())
        assert()

    def test_contains_file2(self):
        if (ENV['APPLE'], ):
            skip()
        parse('my home folder = Dir.home')
        parse('xs = my home folder ')
        parse('xs = files in my home folder ')
        assert('xs contains .bashrc')
        skip()
        parse('xs = all files in my home folder ')
        parse('xs shall be all files in my home folder ')
