#!/usr/bin/env python;
// var angle = require('angle');



class MethodTest extends (ParserBaseTest) {
	test_result() {
		parse(`alias show = puts;show 3`);
		assert_equals(result(), '3');
		parse(`how to test:show 3;ok`);
		assert(bigger_than(0, len(methods(),)));
		assert_equals(body(methods['test'],), 'show 3;');
		parse(`test`);
		assert_equals(result(), '3');
	}
}