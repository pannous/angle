#!/usr/bin/env python;
// var angle = require('angle');




class FutureTest extends ParserBaseTest {
	dont_yet_test_false_returns() {
		assert_result_is(`if 1<2 then false else 4`, 'false');
		assert_result_is(`if 1<2 then false else 4`, false);
	}

	test_if_statement() {
		init('if x is smaller than three then everything is fine;');
		parser.if_then();
		assert_equals(variables['everything'], 'fine');
		parse(`x=2;if x is smaller than three then everything is good;`);
		console.log((variables['everything']));
		assert_equals(variables['everything'], 'good');
	}

	test_repeat_until() {
		parse(`repeat until x>4: x++`);
		assert_equals(variables['x'], 5);
	}

	test_try_until() {
		parse(`try until x>4: x++`);
		assert_equals(variables['x'], 5);
		parse(`try while x<4: x++`);
		assert_equals(variables['x'], 4);
		parse(`try x++ until x>4`);
		assert_equals(variables['x'], 5);
		parse(`try x++ while x<4`);
		assert_equals(variables['x'], 4);
		parse(`increase x until x>4`);
		assert_equals(variables['x'], 5);
	}

	test_property_setter() {
		parse(`new circle;circle.color=green`);
		assert_equals('circle.color', 'green');
	}

	test_local_variables_changed_by_subblocks() {
		parse(`x=2;def test\nx=1\nend\ntest`);
		init('x=2 or x=1');
		assert(parser.condition_tree());
		assert('x=2');
		parse(`x=1;x=2;`);
		assert('x=2');
		parse(`x=1;while x<2 do x=2;`);
		assert('x=2');
	}

	test_loops() {
		parse(`beep three times`);
		parse(`repeat three times: beep; okay`);
		parse(`repeat three times: beep`);
	}

	test_action_n_times() {
		parse(`2 times say 'hello'`);
		parse(`say 'hello' 2 times`);
		parse(`puts 'hello' 2 times`);

	}
}
