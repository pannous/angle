#!/usr/bin/env python;


class SamplesTest extends (ParserBaseTest) {
	setUp() {
		// super(SamplesTest, self).setUp();
		parser.clear();
	}

	// context._verbose = True

	test_addition() {
		x = parse(`samples/addition.e`);
		assert(x, 'parsed')
		assert_result_is(`add 7 to 3`, '10');
	}

	test_hello_world() {
		x = parse(`samples/hello-world.e`);
		assert_equals(x, 'hello world');
	}
}
register(SamplesTest, module)
