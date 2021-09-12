#from angle import english_parser
#url = 'https://raw.githubusercontent.com/jbardin/scp.py/master/scp.py'
#r=download(url)
#print(r)
import sys

sys. path.append('tests')
#safari(url)
#english_parser.parse("1+2")
#import micropip
#pip install importlib-metadata
#python3 -m pytest --runxfail --disable-warnings tests
import unittest
#help(unittest)
tests = unittest.defaultTestLoader.discover('tests',pattern='*test.py')

testRunner = unittest.runner.TextTestRunner()
testRunner.run(tests)

#import pytest
#help(pytest)
