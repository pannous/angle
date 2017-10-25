#!/usr/bin/env python;




context.use_tree = false;


class LoopTest extends (ParserBaseTest) {
	_test_forever(){
		init('beep forever');
		english_parser.loops();
		parse(`beep forever`);
	}
	test_while_return(){
		assert_equals(parse(`c=0;while c<1:c++;beep;done`), 'beeped');
	}
	test_while_loop(){
		parse(`c=0;while c<3:c++;beep;done`);
		assert_equals(3, the.variables['c'].value);
	}
	test_increment_expressions(){
		parse(`counter=1`);
		assert_equals(1, parse(`counter`));
		parse(`counter++`);
		assert_equals(2, parse(`counter`));
		parse(`counter+=1`);
		assert_equals(3, parse(`counter`));
		parse(`counter=counter+counter`);
		assert_equals(6, parse(`counter`));
	}
	test_repeat() { // increase acting on Variable, not on value! hard for AST?
		parse(`counter =0; repeat three times: increase the counter; okay`);
		counter_ = the.variables['counter'];
		assert_equals(counter_.value, 3);
		self.assert_that(`counter==3`);
	}
	test_repeat3(){
		console.log('I DONT GET IT');
		// TypeError: unsupported operand type(s) for +: 'BinOp' and 'int' why??
		assert_result_is(`counter =0; repeat three times: counter=counter+1; okay`, 3);
	}
	test_repeat4(){
		assert_result_is(`counter =0; repeat while counter < 3: counter=counter+1; okay`, 3);
	}
	test_increment(){
		assert_result_is(`counter=1;counter+=2;`,3);
	}
	test_repeat1(){
		parse(`counter =0; repeat three times: counter+=1; okay`);
		self.assert_that(`counter =3`);
	}
	test_repeat2(){
		parse(`counter =0; repeat three times: counter++; okay`);
		counter = the.variableValues['counter'];
		self.assert_that(`counter =3`);
		assert(counter == 3);
	}
	test_forever(){
		skip('we don`t have time forever');
		parser.s('beep forever');
		parser.loops();

	};

}
