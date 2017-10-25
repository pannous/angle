#!/usr/bin/env python;

class ParserTest{//} extends (unittest.TestCase){  // PASS ParserBaseTest): #EnglishParser
	// ,EnglishParser   --> TypeError: Error when calling the metaclass bases
	// metaclass conflict: the metaclass of a derived class must be a (non-strict) subclass of the metaclasses of all its bases

	test_all_samples_syntactically_ok() {
		path = '../samples/';
		for (f in ls(path)) {
			if (f.startswith('.')) continue;
			console.log(('parsing %s!' % f));
			try {
				parse(open(path + f));
			} catch (e) {
				console.log('ERROR in ' + f);
				console.log(e);
				console.log(('OK, parsed %s successfully!' % f));
			}
		}
	}
	test_block_comment(){
		assert_result_is(`x=10 /*ok*/`, 10);
		assert_result_is(`x=/*ok*/9 `, 9);
	}
	test_comment(){
		assert_result_is(`x=11# ok`, 11);
		assert_result_is(`x=13 //ok`, 13);
		assert_result_is(`# a b \n # c d\nx=12# ok`, 12);
	}
	test_comment2(){
		parse(`#ok`);
	}
	test_substitute_variables(){
		self.variableValues = {'x': 3, };
		assert (equals(interpretation.substitute_variables(' #{x} ')));
		assert (equals(interpretation.substitute_variables('"#{x}"')));
		assert (equals(interpretation.substitute_variables(' $x ')));
		assert (equals(interpretation.substitute_variables('#{x}')));
		assert ();
	}
	test_default_setter_dont_overwrite(){
		s(`set color to blue; set default color to green`);
		setter();
		assert (equals('blue', self.variableValues['color']));
	}
	test_default_setter(){
		s(`set the default color to green`);
		setter();
		assert (self.variableValues.contains('color'));
	}
	test_method(){
		s(`how to integrate a bug do test done`);
		assert (method_definition());
	}
	test_method2(){
		s(`how to print: eat a sandwich; done`);
		assert (method_definition());
	}
	test_method3(){
		s(`how to integrate a bug\ntest\nok`);
		assert (method_definition());
	}
	test_method4(){
		// s('how to integrate a bug\n      test\n    ok')
		s(`to integrate a bug\n      test\nok`);
		assert (method_definition());
	}
	test_expression(){
		eat=(x)=> {
			console.log('eaten: ' + x)  //;
		}
		context.methods['eat'] = eat;
		s(`eat a sandwich;`);
		assert (action());
	}
	raise_test(){
		throw ('test');
		throw ('test');
	}
	test_block(){
		s(`let the initial value of I be x;\nstep size is the length of the interval,\ndivided by the number of steps\nvar x = 8;`);
		block();
	}
	test_quote(){
		s(`msg = "heee"`);
		setter();
	}
	test_while(){
		allow_rollback();
		s(`while i is smaller or less then y do\n evaluate the function at point I\n add the result to the sum\n increase I by the step size\ndone`);
		self.looper();
	}
	test_setter3(){
		s(`step size is the length of the interval, divided by the number of steps`);
		setter();
	}
	test_setter2(){
		s(`var x = 8;`);
		setter();
	}
	test_setter(){
		s(`let the initial value of I be x`);
		setter();
	}
	test_looper(){
		s(`while i is smaller or less then y do\nyawn\nend`);
		parser.looper();
	}
	test_method_call(){
		s(`evaluate the function at point I`);
		method_call();
	}
	test_verb(){
		s(`help`);
		verb();
	}
	test_comment2(){
		s(`#ok`);
		skip_comments();
		// comment()
		// statement()
		s(`z3=13 //ok`);
		assert (statement());
		s(`z6=/* dfsfds */3 `);
		assert (statement());
		s(`z5=33 # ok`);
		assert (statement());
		s(`z4=23 -- ok`);
		assert (statement());
	}
	test_js(){
		skip();
		s(`js alert('hi')`);
		assert (javascript());
	}
	test_ruby_method_call(){
		parse(`NOW CALL via english`);
		s(`call ruby_block_test 'yeah'`);
	}
	// assert(extern_method_call())

	test_ruby_def(){
		s(`def ruby_block_test x='yuhu'\n  puts x\n  return x+'yay'\nend`);
	}
	test_ruby_all(){
		s(`\ndef ruby_block_test x='yuhu'\n  puts x\n  return x+'yay'\nend\ncall ruby_block_test 'yeah'\n`);
	}
	test_ruby_variables(){
		s(`x=7;puts x;x+1;`);
	}
	test_ruby(){
		s(`def ruby_block_test\n  puts 'ooooo'\n  return 'yay'\nend`);
	}
	test_algebra(){
		init('2* ( 3 + 10 ) ');
		tree = algebra();
		assert (tree);
	}
	// def do_assert(self,x, block):
	//     if not x and block and callable(block):
	//         x= block()
	//     if not x :
	//         raise ScriptError(to_source(block))
	//     print(x)
	//     print('!!OK!!')

	test_args(){
		s(`an mp3`);
		assert (endNode());
	}
	test(){
		console.log('Starting tests!');
		try {
			self.test_method3();
			self.test_method4();
			assert (endNode());
			self.test_ruby_variables();
			self.test_args();
			self.test_algebra();
			self.test_ruby();
			self.test_ruby_def();
			self.test_ruby_method_call();
			self.test_ruby_all();
			self.test_js();
			self.test_verb();
			self.test_setter2();
			self.test_setter3();
			self.test_comment();
			self.test_block();
			self.test_quote();
			self.test_while();
			self.test_method_call();
			self.show_tree();
			console.log('++++++++++++++++++\nPARSED successfully!');
		} catch (ex) {
			s(`a bug`);

		}
	}
}