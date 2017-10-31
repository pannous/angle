// var angle = require('angle');
context.use_tree = true;

class TreeTest extends (ParserBaseTest) {

	test_num(){
		assert_result_emitted('1', kast.kast.Num(1));
	}
	test_method4(){
		// init('how to integrate a bug\n      test\n    ok')
		init('how to integrate a bug\n      test\nok');
		assert (parser.method_definition());
	}
	_test_block(){
		init('let the initial value of I be x;\n\n' +
			'     step size is the length of the interval,\n' +
			'      divided by the number of steps\n\n' +
			'      var x = 8;');
		parser.block();
	}
	_test_while(){
		parse(`i=0;y=5;while i is smaller or less then y do\n        increase i by 4;\n      done`);
		assert_equals(the.variableValues['i'], 8);
	}
	_test_while2(){
		init('while i is smaller or less then y do\n' +
			' evaluate the function at point I\n' +
			' add the result to the sum\n' +
			' increase I by the step size\n' +
			'done');
		parser.looper();
	}
	_test_setter3(){
		init('step size is the length of the interval, divided by the number of steps');
		parser.setter();
	}
	test_looper(){
		skip();
		parse(`i=1;y=2;`);
		init('while i is smaller or equal y do\ni++\nend');
		parser.loops();
		init('while i is smaller or equal than y do\ni++\nend');
		parser.loops();
	}
	test_then_typo(){
		skip();
		parse(`while i is smaller or equal y then do\nyawn\nend`);
		skip();
		parse(`while i is smaller or equal then y do\nyawn\nend`);
	}
	test_method_call(){
		skip();
		init('evaluate the function at point I');
	}
	test_algebra_NOW(){
		// skip('test_algebra_NOW, DONT SKIP!')
		assert_result_is(`1+3/4.0`, 1.75);
		assert_result_is(`1.0+3/4.0`, 1.75);
		assert_result_is(`1.0+3/4`, 1.75);
		assert_result_is(`1+3/4`, 1.75);
	}
	test_fraction(){
		skip();
		assert_result_is(`1 3/4`, 1.75);
	}
	test_algebra(){
		init('2*(3+10)');
		ok = parser.algebra();
		console.log(('Parsed input as %s !' % ok));
		assert_equals(ok, 26);

	}
}
register(TreeTest, module)
