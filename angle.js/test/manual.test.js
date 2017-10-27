require('./angle_base_test')

exports.test_variable_type_syntax3 = test => {
	parse(`int i;i=3`);
	test.done()
}