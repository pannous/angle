
class FunctionTest extends (ParserBaseTest) {
	// TURNED INTO EMITTER TEST, cause BODY is better done via AST!!
	setUp() {
		parser.clear();
		if ('use_tree' in process.env) {
			console.log('NO FunctionTest in interpreter mode (yet)');
			skip();
			context.use_tree = true;
			context.interpret = false;
			// context._verbose = True never set manually here!
		}
	}
	test_identity2(){
		parse(`define identity number n\n\tn\nassert identity(1) is 1`);
	// parse("define identity number n\nn\nend\nassert identity(1) is 1")
	}

	test_assert(){
		self.assert_that(`assert 1+1==2`);
		self.assert_that(`1+1==2`);
		parse(`assert 1+1==2`);
	}
	test_assert2(){
		self.assert_that(`assert 2 + 4 is 6`);
	}
	test_add2(){
		parse(`define add2 number n\nn+2\nend\nassert add2(1) is 3`);
		parse("define add number n\nn+2\nend\nassert add(1,2) is 3")
		parse("define add number n to number m\nn+2\nend\nassert add(1,2) is 3")
		parse("define add number n to number m\nn+m\nend\nassert add(1,2) is 3")
	}

	test_add3(){
		parse(`define add number n to number m\nn+m\nend\nassert add 2 to 4 is 6`);
	}
	test_opencv(){
		i = parse(`to create a fullscreen window with name n: return cv2.namedWindow(n, cv.CV_WINDOW_FULLSCREEN)`);
		fbody = [];
		f = FunctionDef(name='create fullscreen window', argus=[Argument(name='n')], body=fbody);
		assert_equals(the.result, f);
		parse(`create a fullscreen window with name \"test\"`);
	}
	test_dedent(){
		parse(`define identity number n\n\tn\nassert identity(1) is 1`);
	}
	// parse("define fibonacci number n\nn+1\nend\nassert fibonacci(1) is 2")

	test_fibonacci_0(){
		parse('define fibonacci number n\nif n<2 then 1 else fibonacci(n-1)+ fibonacci(n-2)\nend\n assert fibonacci(5) is 8');
	}
	// parse("define fibonacci number n\nif n<2 then 1 else fibonacci n-1 + fibonacci n-2\nend")



	test_fibonacci(){
		dir = 'samples/';
		code = read(dir + ('fibonacci.e'));
		code = fix_encoding(code);
		console.log(code);
		console.log((parse(code)));
		copy_variables();
		fib = the.methods['fibonacci'];
		console.log(fib);
		assert (equals('n', fib.arguments[0].name))  // name(args[0], )))
		// assert (equals('number', fib.arguments[0].name))  # name(args[0], )))
		assert_equals(parse(`fibonacci of 10`), 89);
		console.log((parse(`assert fibonacci of 10 is 89`)))  // 55
	}
	// f10 = fib.call(10)
	// print(f10)
	// assert_equals(f10, 89)

	test_identity(){
		dir = 'samples/';
		code = read(dir + ('identity.e'));
		code = fix_encoding(code);
		console.log(code);
		console.log((parse(code)));
		identity = the.methods['identity'];
		assert (equals('x', identity.arguments[0].name));
		console.log(identity);
		console.log((identity.call(5)));
		console.log((identity(5)));
		assert (equals(5, identity(5)));
		console.log((parse(`identity(5)`)));
		assert ('identity(5) is 5');
	}
	test_basic_syntax(){
		assert_result_is(`print 'hi'`, 'hi');
		assert_result_is(`print 'hi'`, 'hi');
	}
	test_complex_syntax(){
		init('here is how to define a method: done');
	}
	test_block(){
		the.variables['x'] = Variable(name='x', value=1);
		the.variables['y'] = Variable(name='y', value=2);
		z = parse(`x+y;`);
		assert_equals(z, 3);
		console.log(parser.variables);
		assert_equals(len(parser.variables), 2+2) // it,__builtins__ !?
	}
	test_go_threads(){
		parse(`go print "hi"`);
	}
	// Module([Import([alias('threading', None)]), Assign([Name('t', Store())], Call(Attribute(Name('threading', Load()), 'Thread', Load()), [], [keyword('target', Name('a', Load()))], None, None)), Expr(Call(Attribute(Name('t', Load()), 'start', Load()), [], [], None, None))])

	// Module([Import([alias('threading', None)]), Assign([Name('_t', Store())], Call(Attribute(Name('threading', Load()), 'Thread', Load()), [keyword('target', Name('_tmp', Load()))], [], None, None)), Assign([Name('it', Store())], Call(Attribute(Name('_t', Load()), 'start', Load()), [], [], None, None)), Print(None, [Name('it', Load())], True)])


	test_params(){
		parse(`how to increase x by y: x+y;`);
		g = the.methods['increase'];
		//  big python headache: starting from position 0 or 1 ?? (self,x,y) etc
		// args = [Argument({'name': 'x', 'preposition': None, 'position': 1, }),
		//		 Argument({'preposition': 'by', 'name': 'y', 'position': 2, })];
		args = [Argument({'name': 'x', 'preposition': null, 'position': 0, }),
		        Argument({'preposition': 'by', 'name': 'y', 'position': 1, })];
		f = FunctionDef({'body': 'x+y;', 'name': 'increase', 'arguments': args, });
		assert_equals(f, g);
		return f;
	}
	test_params_call(){
		f = self.test_params();
		assert_equals(parser.do_send(f, {'x': 1, 'y': 2, }), 3);
	}
	test_function_object(){
		parse(`how to increase a number x by y: x+y;`);
		g = the.methods['increase'];
		arg1 = Argument({'type': 'number', 'position': 1, 'name': 'x', 'preposition': null, });
		arg2 = Argument({'name': 'y', 'preposition': 'by', 'position': 2, });
		body = 'x+y;';
		body = ast.BinOp(left=ast.Name('x'), op=ast.Add, right=ast.Name('y'));
		f = FunctionDef({'arguments': arg2, 'name': 'increase', 'body': body, 'object': arg1, });
		assert_equals(f, g);
		assert_equals(parser.do_call_function(f, {'x': 1, 'y': 2, }), 3);
	}
	test_blue_yay(){
		parser.do_interpret();
		assert_result_is(`def test{puts 'yay'};test`, 'yay');
		assert_result_is(`def test{puts 'yay'};test`, 'yay');
	}
	test_class_method(){
		// parse('how to list all numbers smaller x: [1..x]')
		// parse('to get numbers smaller x: [1..x]')
		parse(`to get numbers smaller x: return 1 to x - 1`);
		g = the.methods['get'];
		// g = the.methods['get numbers smaller eeek']
		f = FunctionDef({'body': '[1..x]', 'name': 'list'})  // , 'arguments': arg2(), 'object': arg1(), })
		assert_equals(f, g);
		assert_equals(parser.call_function(f, 4), [1, 2, 3]);
	}
	test_simple_parameters(){
		parse(`puts 'hi'`);
	}
	test_svg(){
		skip();
		parse(`svg <circle cx="$x" cy="50" r="$radius" stroke="black" fill="$color" id="circle"/>`);
		parse(`what is that`);
	}
	test_java_style(){
		parse(`1.add(0)`);
		assert_result_is(`3.add(4)`, 7);
	}
	test_dot(){
		parse(`x='hi'`);
		// assert_result_is('reverse of x', 'ih')
		assert_result_is(`x.reverse`, 'ih');
	}
	// assert_result_is('reverse x', 'ih')
	test_rubyStyle(){
		parse(`Math.hypot(3,4)`);
		parse(`Math.sqrt 8`);
		parse(`Math.sqrt( 8 )`);
	}
	// parse('Math.e ~= 2.71828')

	test_x_name(){
		variables['x'] = nodes.Variable(name='x', value=7);
		init('x');
		assert_equals(name(parser.nod(), ), 'x');
	}
	test_add_to_zero(){
		context.use_tree = false  // not yet
		parser.do_interpret();
		parse(`counter is zero; repeat three times: increase counter by 1; done repeating;`);
		assert_equals(variables['counter'], 3);
	}
	test_var_check(){
		variables['counter'] = Variable(name='counter', value=3);
		assert ('the counter is 3');
	}
	test_array_arg(){
		assert_equals(parse(`rest of [1,2,3]`), [2, 3]);
	}
	test_array_index(){
		assert_equals(parse(`x=[1,2,3];x[2]`), 3);
	}
	test_array_index_set(){
		parser.clear();
		assert_equals(parse(`x=[1,2,3];x[2]=0;x`), [1, 2, 0]);
	}
	test_x(){
		the.variables['x'] = Variable(name='x', value=1);
		assert_equals(parse(`x`), 1);
	}
	test_natural_array_index_setter(){
		parse(`x=[1,2,3]`);
		assert_equals(parse(`set third element in x to 8`), 8);
		assert_equals(parse(`x`), [1, 2, 8]);
	}
	test_array_arg(){
		assert_equals(parse(`rest of [1,2,3]`), [2, 3]);
		assert_equals(parse(`rest of [1,2,3]`), [2, 3]);
	}
	test_add_time() {
	}

	test_increase(){
		// todo:  copying method invocation logic to AST
		parse(`counter is one; repeat three times: increase counter; done repeating;`);
		assert_equals(the.variableValues['counter'], 4);
	}
	_test_svg_dom(){
		init('<svg><circle cx="$x" cy="50" r="$radius" stroke="black" fill="$color" id="circle"/></svg>');
		// print(svg(parser.interpretation(), ))
		parse(`circle.color=green`);
		assert_equals('circle.color', 'green');
	}
	test_incr(){
		assert ('increase 1 == 2');
		assert ('increase 1 by 1 == 2');
		assert ('x=1; x+1 == 2');
		assert ('x=1; ++x == 2');
	}
	// assert ('1++ == 2')

	}
