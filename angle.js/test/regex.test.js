#!/usr/bin/env python;



class RegExpTest extends (ParserBaseTest) {
	test_match(){
		self.assert_that(`'beep' ~ r'ee'`);
	}
	test_match2(){
		self.assert_that(`'be4ep' ~ regex '\d' == 4`);
	}
	test_match3(){
		// skip()
		self.assert_that(`'be4ep' ~ '\d' == 4`);
	}

	test_match4(){
		// skip()
		self.assert_that(`'be4ep' ~ /\d/ == 4`);
	}
}

register(RegExpTest, module)