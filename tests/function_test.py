#!/usr/bin/env python
from parser_test_helper import *
# from parser_test_helper import ParserBaseTest
# from extensions import *



class FunctionTest(ParserBaseTest):

	def setUp(self):
		context.use_tree=True

	# context._verbose = True never set manually here!

	def test_identity2(self):
		parse("define identity number n\n\tn\nassert identity(1) is 1")
		# parse("define identity number n\nn\nend\nassert identity(1) is 1")

	def test_add2(self):
		parse("define add2 number n\nn+2\nend\nassert add2(1) is 3")
		# parse("define add number n\nn+2\nend\nassert add(1,2) is 3")
		# parse("define add number n to number m\nn+2\nend\nassert add(1,2) is 3")
		# parse("define add number n to number m\nn+m\nend\nassert add(1,2) is 3")

	def test_assert(self):
		self.assert_that("assert 2 + 4 is 6")

	def test_add3(self):
		parse("define add number n to number m\nn+m\nend\nassert add 2 to 4 is 6")


	def test_opencv(self):
		i=parse("to create a fullscreen window with name n: return cv2.namedWindow(n, cv.CV_WINDOW_FULLSCREEN)")
		fbody=[]
		f=FunctionDef(name="create fullscreen window", arguments=[Argument(name="n")], body=fbody)
		assert_equals(the.result,f)
		parse("create a fullscreen window with name \"test\"")

	def test_dedent(self):
		parse("define identity number n\n\tn\nassert identity(1) is 1")

		# parse("define fibonacci number n\nn+1\nend\nassert fibonacci(1) is 2")

	def test_fibonacci_0(self):
		parse("define fibonacci number n\nif n<2 then 1 else fibonacci(n-1)+ fibonacci(n-2)\nend\n assert fibonacci(5) is 8")
		# parse("define fibonacci number n\nif n<2 then 1 else fibonacci n-1 + fibonacci n-2\nend")



	def test_fibonacci(self):
		dir = 'samples/'
		code = read(dir + ('fibonacci.e'))
		code = fix_encoding(code)
		print(code)
		print(parse(code))
		fib = the.methods['fibonacci']
		print(fib)
		assert (equals('n', fib.arguments[0].name))  # name(args[0], )))
		# assert (equals('number', fib.arguments[0].name))  # name(args[0], )))
		assert_equals(parse('fibonacci of 10'), 89)
		print(parse('assert fibonacci of 10 is 89')) # 55
		# f10 = fib.call(10)
		# print(f10)
		# assert_equals(f10, 89)

	def test_identity(self):
		dir = 'samples/'
		code = read(dir + ('identity.e'))
		code = fix_encoding(code)
		print (code)
		print(parse(code))
		identity = the.methods['identity']
		assert (equals('x', identity.arguments[0].name))
		print(identity)
		print(identity.call(5))
		print(identity(5))
		assert (equals(5, identity(5)))
		print(parse('identity(5)'))
		assert ('identity(5) is 5')

	def test_basic_syntax(self):
		assert_result_is("print 'hi'", 'hi')
		assert_result_is("print 'hi'", 'hi')

	def test_complex_syntax(self):
		init('here is how to define a method: done')

	def test_block(self):
		the.variables['x'] = Variable(name='x',value=1)
		the.variables['y'] = Variable(name='x',value=2)
		z = parse('x+y;')
		assert_equals(len(self.parser.variables), 2)
		assert_equals(z, 3)

	def test_go_threads(self):
		parse('go print "hi"')
	# Module([Import([alias('threading', None)]), Assign([Name('t', Store())], Call(Attribute(Name('threading', Load()), 'Thread', Load()), [], [keyword('target', Name('a', Load()))], None, None)), Expr(Call(Attribute(Name('t', Load()), 'start', Load()), [], [], None, None))])

	# Module([Import([alias('threading', None)]), Assign([Name('_t', Store())], Call(Attribute(Name('threading', Load()), 'Thread', Load()), [keyword('target', Name('_tmp', Load()))], [], None, None)), Assign([Name('it', Store())], Call(Attribute(Name('_t', Load()), 'start', Load()), [], [], None, None)), Print(None, [Name('it', Load())], True)])


	def test_params(self):
		parse('how to increase x by y: x+y;')
		g = the.methods['increase']
		#  big python headache: starting from position 0 or 1 ?? (self,x,y) etc
		# args = [Argument({'name': 'x', 'preposition': None, 'position': 1, }),
		#		 Argument({'preposition': 'by', 'name': 'y', 'position': 2, })]
		args = [Argument({'name': 'x', 'preposition': None, 'position': 0, }),
				Argument({'preposition': 'by', 'name': 'y', 'position': 1, })]
		f = FunctionDef({'body': 'x+y;', 'name': 'increase', 'arguments': args, })
		assert_equal(f, g)
		return f

	def test_params_call(self):
		f=self.test_params()
		assert_equals(self.parser.do_send(f, {'x': 1, 'y': 2, }), 3)

	def test_function_object(self):
		parse('how to increase a number x by y: x+y;')
		g = the.methods['increase']
		arg1 = Argument({'type': 'number', 'position': 1, 'name': 'x', 'preposition': None, })
		arg2 = Argument({'name': 'y', 'preposition': 'by', 'position': 2, })
		body='x+y;'
		body=ast.BinOp(left=ast.Name('x'),op=ast.Add,right=ast.Name('y'))
		f = FunctionDef({'arguments': arg2, 'name': 'increase', 'body': body, 'object': arg1, })
		assert_equal(f, g)
		assert_equals(self.parser.do_call_function(f, {'x': 1, 'y': 2, }), 3)

	def test_blue_yay(self):
		self.parser.do_interpret()
		assert_result_is("def test{puts 'yay'};test", 'yay')
		assert_result_is("def test{puts 'yay'};test", 'yay')

	def test_class_method(self):
		# parse('how to list all numbers smaller x: [1..x]')
		# parse('to get numbers smaller x: [1..x]')
		parse('to get numbers smaller x: return 1 to x - 1')
		g = the.methods['get']
		# g = the.methods['get numbers smaller eeek']
		f = FunctionDef({'body': '[1..x]', 'name': 'list'})  # , 'arguments': arg2(), 'object': arg1(), })
		assert_equal(f, g)
		assert_equals(self.parser.call_function(f, 4), [1, 2, 3])

	def test_simple_parameters(self):
		parse("puts 'hi'")

	def test_to_do_something(self):
		pass

	def test_svg(self):
		skip()
		parse('svg <circle cx="$x" cy="50" r="$radius" stroke="black" fill="$color" id="circle"/>')
		parse('what is that')

	def test_java_style(self):
		parse('1.add(0)')
		assert_result_is('3.add(4)',7)

	def test_dot(self):
		parse("x='hi'")
		# assert_result_is('reverse of x', 'ih')
		assert_result_is('x.reverse', 'ih')
		# assert_result_is('reverse x', 'ih')

	def test_rubyStyle(self):
		parse('Math.hypot(3,4)')
		parse('Math.sqrt 8')
		parse('Math.sqrt( 8 )')
		# parse('Math.e ~= 2.71828')

	def test_x_name(self):
		variables['x'] = Variable(name='x',value=7)
		init('x')
		assert_equals(name(self.parser.nod(), ), 'x')

	def test_add_to_zero(self):
		parse('counter is zero; repeat three times: increase counter by 1; done repeating;')
		assert_equals(variables['counter'], 3)

	def test_var_check(self):
		variables['counter'] =Variable(name='counter',value=3)
		assert ('the counter is 3')

	def test_array_arg(self):
		assert_equals(parse('rest of [1,2,3]'), [2, 3])

	def test_array_index(self):
		assert_equals(parse('x=[1,2,3];x[2]'), 3)

	def test_array_index_set(self):
		assert_equals(parse('x=[1,2,3];x[2]=0;x'), [1, 2, 0])

	def test_x(self):
		the.variables['x']=Variable(name='x',value=1)
		assert_equals(parse('x'), 1)

	def test_natural_array_index(self):
		parse('x=[1,2,3]')
		assert_equals(parse('second element in [1,2,3]'), 2)
		assert_equals(parse('third element in x'), 3)


	def test_natural_array_index_setter(self):
		parse('x=[1,2,3]')
		assert_equals(parse('set third element in x to 8'), 8)
		assert_equals(parse('x'), [1, 2, 8])

	def test_array_arg(self):
		assert_equals(parse('rest of [1,2,3]'), [2, 3])
		assert_equals(parse('rest of [1,2,3]'), [2, 3])

	def test_add_time(self):
		pass

	def test_increase(self):
	# todo:  copying method invocation logic to AST
		parse('counter is one; repeat three times: increase counter; done repeating;')
		assert_equals(the.variableValues['counter'], 4)

	def _test_svg_dom(self):
		init('<svg><circle cx="$x" cy="50" r="$radius" stroke="black" fill="$color" id="circle"/></svg>')
		# print(svg(self.parser.interpretation(), ))
		parse('circle.color=green')
		assert_equals('circle.color', 'green')

	def test_incr(self):
		assert ('increase 1 == 2')
		assert ('increase 1 by 1 == 2')
		assert ('x=1; x+1 == 2')
		assert ('x=1; ++x == 2')
		# assert ('1++ == 2')
