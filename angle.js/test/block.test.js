require('./angle_base_test');

class BlockTest extends (ParserBaseTest) {

	test_block(){
		assert_result_is("{1}", 1)
	}

	test_ruby_block() {
		skip()  // old ruby stuff
		assert_result_is(parse(`begin 1.times do 1 end end`), 1);
	}

	test_ruby_block_returns() {
		skip()  //;
		assert_result_is(parse(`print begin 1.times do 1 end end`), 1);

	}
}
new BlockTest()
