#!/usr/bin/env python
from tests.parser_test_helper import *

# context.use_tree = False
context.use_tree = True


class HashTest(ParserBaseTest):

	# def test_hash_symbol_invariance_extension(self):
	#     a = {'a': 1, }
	#     assert_equals(a['a'], a[:a])
	#     h = parse('{"SuperSecret" : "kSecValueRef"}')
	#     assert_equals(h['SuperSecret'], 'kSecValueRef')

	# def setUp(self):
	#

	def test_simple0(self):
		init('{a:1}')
		val=self.parser.hash_map()
		assert_equals(val, {'a': 1})

	def test_simple(self):
		assert_equals(parse('{a:1}'), {'a': 1})

	def test_invariance(self):
		assert_result_is('{a:"b"}', {'a': 'b' })

	def test_invariance2(self):
		assert_equals(parse('{a{b:"b",c:"c"}}'), {'a': {'c': 'c', 'b': 'b', }, })
		assert_equals(parse('{a{b:"b";c:"c"}}'), {'a': {'b': 'b', 'c': 'c', }, })
		assert_equals(parse('{a:"b"}'), parse('{"a":"b"}'))
		assert_equals(parse('{a:{b:"b";c:"c"}}'), {'a': {'b': 'b', 'c': 'c', }, })

	def test_simple_ruby(self):
		skip()
		assert_equals(parse('{:a => "b"}'), {'a': 'b', })

	def test_invariance_ruby_style(self):
		skip()
		assert_equals(parse('{:a => {b:"b";c:"c"}}'), {'a': {'b': 'b', 'c': 'c', }, })


	def test_immediate_hash(self):
		assert_equals(parse('a{b:"b",c:"c"}'), {'a': {'b': 'b', 'c': 'c', }, })

	def test_immediate_hash2(self):
		# skip('test_immediate_hash NO, because of blocks!')
		assert_equals(parse('a:{b:"b",c:"c"}'), {'a': {'b': 'b', 'c': 'c', }, })

	def test_hash_index(self):
		x={'a': {'b': 'b', 'c': 'c'}}
		# x=parse('x=a:{b:"b",c:"c"}')
		the.variables['x']=x
		assert_equals(x, {'a': {'b': 'b', 'c': 'c'}})

	def test_hash_index1(self):
		# parse("x={a:3}")
		parse("x={'a':3}")
		assert_equals(the.variables['x' ], {'a': 3})
		assert_equals(parse("x['a']"), 3)

	def test_hash_map(self):
		skip() # nice future:
		parse("x maps a to 3, b to 5")
		assert_equals(parse("x['a']"), 3)
		assert_equals(parse("x[a]"), 3)
		assert_equals(parse("x.a"), 3)
		assert_equals(parse("a of x"), 3)

	def test_json_data(self):
		init('{a{b:"b";c:"c"}}')
		self.parser.hash_map()
