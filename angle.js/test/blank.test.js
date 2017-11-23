#!/usr/bin/env python;
let {register,assert_has_error,assert_result_is}=require('./angle_base_test');

class BlankTest extends (ParserBaseTest) {

	test_ok(){
		assert_contains([1],1);

	}
}
