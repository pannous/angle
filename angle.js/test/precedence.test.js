#!/usr/bin/env python;
let {register,assert_has_error,assert_result_is}=require('./angle_base_test');

class PrecedenceTest extends (ParserBaseTest) {
	test_ok(){
		assert_contains([1],1);
	}
	test_mix(){
		assert_result_is("1≤1",true)
		assert_result_is("1≤1 and 0≤0",true)
	}
}

register(PrecedenceTest, module)
