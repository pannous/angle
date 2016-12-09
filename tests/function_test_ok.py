#!/usr/bin/env python
from tests.parser_test_helper import *
import angle

from tests.parser_test_helper import *
from extensions import *
from nodes import *


def p(x):
	print(x)


class FunctionTestOK(ParserBaseTest):
	def test_fibonacci(self):
		dir = 'samples/'
		code = File.read(dir + ('fibonacci.e'))
		code = self.fix_encoding(code)
		p(code)
		print((parse(code)))
		fib = functions['fibonacci']
		print(fib)
		# assert fib.args[0].name=='number'
		# assert(equals('number', name(args[0], )))
		# UNPARSABLE! <Call name='name'>
		# 					<Call name='[]'>
		# 						<Call name='args'>
		# 							<LocalVar name='fib'/>
		# 							<List/>
		# 						</Call>
		# 						<Args>
		# 							<Fixnum value='0'/>
		# 						</Args>
		# 					</Call>
		# 					<List/>
		# 				</Call>


		f10 = fib.call(10)
		print(f10)
		assert_equals(f10, 55)
		assert_equals(parse('fibonacci of 10'), 55)
		print((parse('assert fibonacci of 10 is 55')))

	def test_identity(self):
		identity0 = parse("def identity(x):return x")
		assert_equals(identity0.call(5), 5)
		# assert_result_is('identity(5)',5)
		# assert('identity(5) is 5')

	def test_identity1(self):
		dir = 'samples/'
		code = File.read(dir + ('identity.e'))
		code = fix_encoding(code)
		p(code)
		print((parse(code)))
		identity = functions['identity']
		assert (equals('x', identity.args[0].name))
		print(identity)
		print((identity.call(5)))
		assert (equals(5, identity.call(5)))
		print((parse('identity(5)')))
		assert ('identity(5) is 5')

	def test_factorial(self):
		parse("""\n
								define the factorial of an integer i as
										if i is 0 then return 1
										i * factorial(i-1)
										# i times factorial of i minus one
								end
								assert factorial of 5 is 120""")

	def test_samples(self):
		dir = 'samples/'
		for file in File.ls(dir):
			code = read(File.open(dir + (file), 'rb', {'binary': True, 'encoding': 'UTF-8', }))
			code = fix_encoding(code)
			p(code)
			print((parse(code)))
			fib = functions['fibonacci']
			print(fib)
			print((fib.call(5)))
			parse('fibonacci(5)')

	def test_basic_syntax(self):
		assert_result_is("print 'hi'", 'nill')
		assert_result_is("print 'hi'", 'nill')

	def test_complex_syntax(self):
		init('here is how to define a method: done')
		init('here is how to define a method: done')

	def test_block(self):
		variables['x'] = [1, ]
		variables['y'] = [2, ]
		assert_equals(count(self.parser.variables(), ), 2)
		z = parse('x+y;')
		assert_equals(z, 3)

	def test_params(self):
		parse('how to increase x by y: x+y;')
		g = functions['increase']
		args = [Argument.new({'name': 'x', 'preposition': None, 'position': 1, }),
						Argument.new({'preposition': 'by', 'name': 'y', 'position': 2, })]
		f = FunctionDef.new({'body': 'x+y;', 'name': 'increase', 'arguments': args, })
		assert_equals(f, g)
		assert_equals(self.parser.call_function(f, {'x': 1, 'y': 2, }), 3)

	def test_function_object(self):
		parse('how to increase a number x by y: x+y;')
		g = functions['increase']
		arg1 = Argument.new({'type': 'number', 'position': 1, 'name': 'x', 'preposition': None, })
		arg2 = Argument.new({'preposition': 'by', 'name': 'y', 'position': 2, })
		f = FunctionDef.new({'name': 'increase', 'body': 'x+y;', 'arguments': arg2, 'object': arg1, })
		assert_equals(f, g)
		assert_equals(self.parser.call_function(f, {'x': 1, 'y': 2, }), 3)

	def test_blue_yay(self):
		assert_result_is("def test{puts 'yay'};test", 'yay')
		assert_result_is("def test{puts 'yay'};test", 'yay')

	def test_class_method(self):
		parse('how to list all numbers smaller x: [1..x]')
		g = functions['list']
		f = FunctionDef.new({'body': '[1..x]', 'name': 'list', 'arguments': arg2(), 'object': arg1(), })
		assert_equals(f, g)
		assert_equals(self.parser.call_function(f, 4), [1, 2, 3])

	def test_simple_parameters(self):
		parse("puts 'hi'")
		parse("puts 'hi'")

	def test_to_do_something(self):
		pass

	def test_svg(self):
		skip()
		parse('svg <circle cx="$x" cy="50" r="$radius" stroke="black" fill="$color" id="circle"/>')
		parse('what is that')

	def test_java_style(self):
		parse('1.add(0)')
		parse('1.add(0)')

	def test_dot(self):
		parse("x='hi'")
		assert_result_is('reverse of x', 'ih')
		assert_result_is('x.reverse', 'ih')
		assert_result_is('reverse x', 'ih')

	def test_rubyThing(self):
		parse('Math.hypot (3,3)')
		parse('Math.sqrt 8')
		parse('Math.sqrt( 8 )')
		parse('Math.ancestors')

	def test_x_name(self):
		variables['x'] = [Variable.new({'value': 7, 'name': 'x', }), ]
		init('x')
		assert_equals(name(self.parser.nod(), ), 'x')

	def test_add_to_zero(self):
		parse('counter is zero; repeat three times: increase counter by 1; done repeating;')
		assert_equals(variables['counter'], 3)

	def test_var_check(self):
		variables['counter'] = [Variable.new({'name': 'counter', 'value': 3, }), ]
		assert ('the counter is 3')

	def test_array_arg(self):
		assert_equals(parse('rest of [1,2,3]'), [2, 3])
		assert_equals(parse('rest of [1,2,3]'), [2, 3])

	def test_array_index(self):
		assert_equals(parse('x=[1,2,3];x[2]'), 3)
		assert_equals(parse('x=[1,2,3];x[2]=0;x'), [1, 2, 0])

	def test_natural_array_index(self):
		parse('x=[1,2,3]')
		assert_equals(parse('second element in [1,2,3]'), 2)
		assert_equals(parse('third element in x'), 3)
		assert_equals(parse('set third element in x to 8'), 8)
		assert_equals(parse('x'), [1, 2, 8])

	def test_array_arg(self):
		assert_equals(parse('rest of [1,2,3]'), [2, 3])
		assert_equals(parse('rest of [1,2,3]'), [2, 3])

	def test_add_time(self):
		pass

	def test_add(self):
		parse('counter is one; repeat three times: increase counter; done repeating;')
		assert_equals(variables['counter'], 4)

	def _test_svg_dom(self):
		init('<svg><circle cx="$x" cy="50" r="$radius" stroke="black" fill="$color" id="circle"/></svg>')
		# print(svg(self.parser.interpretation(), ))
		parse('circle.color=green')
		assert_equals('circle.color', 'green')

	def test_incr(self):
		assert ('increase 1 == 2')
		assert ('increase 1 == 2')


class Argument:
	pass
