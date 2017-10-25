#!/usr/bin/env python;
// var angle = require('angle');

class ErrorTest extends (ParserBaseTest) {

	setUp(){
		parser.clear();
	}
	test_type(){
		assert_has_error(`x=1,2,y;`);
		assert_has_error(`x=1,2,y;`);
	}
	test_variable_type_safety_errors2(){
		assert_has_no_error(`char i='c'`);
		assert_has_no_error(`char i;i='c'`);
	}
	test_variable_type_safety_no_errors(){
		assert_has_no_error(`an integer i;i=3`);
	}
	test_variable_type_safety_no_errors2(){
		assert_has_no_error(`int i=3`);
		assert_has_no_error(`int i;i=3`);
	}
	test_variable_type_safety_errors(){
		assert_has_error(`const i=1;i=2`);
		assert_has_error(`string i=3`);
		assert_has_error(`int i='hi'`);
		assert_has_error(`integer i='hi'`);
		assert_has_error(`an integer i;i='hi'`);
		assert_has_error(`const i=1;i='hi'`);
		assert_has_error(`const i='hi';i='ho'`);
	}
	test_assert_has_error() {
		try {
			assert_has_no_error(`dfsafdsa ewdfsa}{P}{P;@#%`);
		} catch(ex) {
			puts('OK');
		}
	}
	test_type3(){
		assert_has_error(`x be 1,2,3y= class of x`);
		assert_has_error(`x be 1,2,3y= class of x`);
	}
	test_map(){
		assert_has_error(`square 1,2 andy 3`);
		assert_has_error(`square 1,2 andy 3`);
	}
	// test_x = unittest.expectedFailure(test_x);
	test_x(){
		parse(`x`);
	}
	test_endNode_as(){
		init('as');
		try {
			parser.arg();
			assert_has_error(`as`);
		} catch (x){}
	}//

	test_rollback(){
		assert_has_error(`if 1>0 then else`);
		assert_has_error(`if 1>0 then else`);
		}
	test_endNode(){
		assert_has_error(`of`);
		assert_has_error(`of`);
	}
	test_list_concatenation_unknownVariable(){
		variables['x'] = ['hi', ];
		variables['y'] = ['world', ];
		assert_has_error(`z=x ' ' w`);
	}
}
