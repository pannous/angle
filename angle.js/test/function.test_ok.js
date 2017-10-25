#!/usr/bin/env python;

// var angle = require('angle');






p=(x)=>{
	console.log(x);
}

class FunctionTestOK extends(ParserBaseTest) {
	setUp() {
		if ('use_tree' in process.env) {
			console.log('NO FunctionTest in interpreter mode (yet)');
			skip();
		}
	}
	test_fibonacci(){
		dir = 'samples/';
		code = File.read(dir + ('fibonacci.e'));
		code = self.fix_encoding(code);
		p(code);
		console.log((parse(code)));
		fib = functions['fibonacci'];
		console.log(fib);
		// assert fib.args[0].name=='number'
		// assert(equals('number', name(args[0], )))
		// UNPARSABLE! <Call name='name'>
		// 					<Call name='[]'>
		// 						<Call name='args'>
		// 							<LocalVar name='fib'/>
		// 							<List/>
		// 						</Call>
		// 						<Args>
		// 							<Fixnum value='0'/>
		// 						</Args>
		// 					</Call>
		// 					<List/>
		// 				</Call>

		f10 = fib.call(10);
		console.log(f10);
		assert_equals(f10, 55);
		assert_equals(parse(`fibonacci of 10`), 55);
		console.log((parse(`assert fibonacci of 10 is 55`)));
	}
	test_identity(){
		identity0 = parse(`def identity(x):return x`);
		assert_equals(identity0.call(5), 5);
		// assert_result_is('identity(5)',5)
		// assert('identity(5) is 5')
	}
	test_identity1(){
		dir = 'samples/';
		code = File.read(dir + ('identity.e'));
		code = fix_encoding(code);
		p(code);
		console.log((parse(code)));
		identity = functions['identity'];
		assert (equals('x', identity.args[0].name));
		console.log(identity);
		console.log((identity.call(5)));
		assert (equals(5, identity.call(5)));
		console.log((parse(`identity(5)`)));
		assert ('identity(5) is 5');
	}
	test_factorial(){
		parse(/* \n
								define the factorial of an integer i as
										if i is 0 then return 1
										i * factorial(i-1)
										# i times factorial of i minus one
								end
								assert factorial of 5 is 120 */);
	}
	test_samples() {
		dir = 'samples/';
		for (file in File.ls(dir)) {
			code = read(File.open(dir + (file), 'rb', {'binary': true, 'encoding': 'UTF-8',}));
			code = fix_encoding(code);
			p(code);
			console.log((parse(code)));
			fib = functions['fibonacci'];
			console.log(fib);
			console.log((fib.call(5)));
			parse(`fibonacci(5)`);
		}
	}
	test_basic_syntax(){
		assert_result_is(`print 'hi'`, 'nill');
		assert_result_is(`print 'hi'`, 'nill');
	}
	test_complex_syntax(){
		init('here is how to define a method: done');
		init('here is how to define a method: done');
	}
	test_block(){
		variables['x'] = [1, ];
		variables['y'] = [2, ];
		assert_equals(count(parser.variables(), ), 2);
		z = parse(`x+y;`);
		assert_equals(z, 3);
	}
	test_params(){
		parse(`how to increase x by y: x+y;`);
		g = functions['increase'];
		args = [Argument.new({'name': 'x', 'preposition': null, 'position': 1, }),
						Argument.new({'preposition': 'by', 'name': 'y', 'position': 2, })];
		f = FunctionDef.new({'body': 'x+y;', 'name': 'increase', 'arguments': args, });
		assert_equals(f, g);
		assert_equals(parser.call_function(f, {'x': 1, 'y': 2, }), 3);
	}
	test_function_object(){
		parse(`how to increase a number x by y: x+y;`);
		g = functions['increase'];
		arg1 = Argument.new({'type': 'number', 'position': 1, 'name': 'x', 'preposition': null, });
		arg2 = Argument.new({'preposition': 'by', 'name': 'y', 'position': 2, });
		f = FunctionDef.new({'name': 'increase', 'body': 'x+y;', 'arguments': arg2, 'object': arg1, });
		assert_equals(f, g);
		assert_equals(parser.call_function(f, {'x': 1, 'y': 2, }), 3);
	}
	test_blue_yay(){
		assert_result_is(`def test{puts 'yay'};test`, 'yay');
		assert_result_is(`def test{puts 'yay'};test`, 'yay');
	}
	test_class_method(){
		parse(`how to list all numbers smaller x: [1..x]`);
		g = functions['list'];
		f = FunctionDef.new({'body': '[1..x]', 'name': 'list', 'arguments': arg2(), 'object': arg1(), });
		assert_equals(f, g);
		assert_equals(parser.call_function(f, 4), [1, 2, 3]);
	}
	test_simple_parameters(){
		parse(`puts 'hi'`);
		parse(`puts 'hi'`);
	}


	test_svg(){
		skip();
		parse(`svg <circle cx="$x" cy="50" r="$radius" stroke="black" fill="$color" id="circle"/>`);
		parse(`what is that`);
	}
	test_java_style(){
		parse(`1.add(0)`);
		parse(`1.add(0)`);
	}
	test_dot(){
		parse(`x='hi'`);
		assert_result_is(`reverse of x`, 'ih');
		assert_result_is(`x.reverse`, 'ih');
		assert_result_is(`reverse x`, 'ih');
	}
	test_rubyThing(){
		parse(`Math.hypot (3,3)`);
		parse(`Math.sqrt 8`);
		parse(`Math.sqrt( 8 )`);
		parse(`Math.ancestors`);
	}
	test_x_name(){
		variables['x'] = [Variable.new({'value': 7, 'name': 'x', }), ];
		init('x');
		assert_equals(name(parser.nod(), ), 'x');
	}
	test_add_to_zero(){
		parse(`counter is zero; repeat three times: increase counter by 1; done repeating;`);
		assert_equals(variables['counter'], 3);
	}
	test_var_check(){
		variables['counter'] = [Variable.new({'name': 'counter', 'value': 3, }), ];
		assert ('the counter is 3');
	}
	test_array_arg(){
		assert_equals(parse(`rest of [1,2,3]`), [2, 3]);
		assert_equals(parse(`rest of [1,2,3]`), [2, 3]);
	}
	test_array_index(){
		assert_equals(parse(`x=[1,2,3];x[2]`), 3);
		assert_equals(parse(`x=[1,2,3];x[2]=0;x`), [1, 2, 0]);
	}
	test_natural_array_index(){
		parse(`x=[1,2,3]`);
		assert_equals(parse(`second element in [1,2,3]`), 2);
		assert_equals(parse(`third element in x`), 3);
		assert_equals(parse(`set third element in x to 8`), 8);
		assert_equals(parse(`x`), [1, 2, 8]);
	}
	test_array_arg(){
		assert_equals(parse(`rest of [1,2,3]`), [2, 3]);
		assert_equals(parse(`rest of [1,2,3]`), [2, 3]);
	}


	test_add(){
		parse(`counter is one; repeat three times: increase counter; done repeating;`);
		assert_equals(variables['counter'], 4);
	}
	_test_svg_dom(){
		init('<svg><circle cx="$x" cy="50" r="$radius" stroke="black" fill="$color" id="circle"/></svg>');
		// print(svg(parser.interpretation(), ))
		parse(`circle.color=green`);
		assert_equals('circle.color', 'green');
	}
	test_incr(){
		assert ('increase 1 == 2');
		assert ('increase 1 == 2');
	}


}
