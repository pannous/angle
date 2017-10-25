#!/usr/bin/env python;
// var angle = require('angle');
//;
//;



class JobTest extends (ParserBaseTest) {

		test_simple(){
			context.use_tree = false;
			assert_equals(parse(`do print 3`), 3) // the program waits for the job to finish
		}
		test_invariance(){
			skip();
			assert_result_is(`thread{print 3}`, 'go print 3');
		}
		test_complex(){
				skip();
				xs=parse(`xs=for i in 1 to 10: go print i`);
				// assert_that("elements in xs are 1 to 10, but order different")

		}
}
