require('./angle_base_test')

// require('../english_parser')
// setVerbose()
// parse(`1+2=3`)

exports.test_guard_value_else = test => {
	assert_result_is(`x=nil else 'c'`, 'c')//  assignment side guard!
	// assert_result_is(`char x=3 else 'c'`, 'c');
	test.done()
}