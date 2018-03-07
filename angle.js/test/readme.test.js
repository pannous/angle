#!/usr/bin/env python;



class ReadmeTest extends (ParserBaseTest) {
	test_Readme(){
		parse("README.md")
	}
}

register(ReadmeTest, module)
