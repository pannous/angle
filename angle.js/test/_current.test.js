let {UndeclaredVariable} =require( "../exceptionz")
let {assert_has_error}=require('./angle_base_test')


exports.test_a_setter_article_vs_variable = test => {
	parse(`a=green`);
	test.equals(variables['a'], 'green');
	assert_equals(variables['a'], 'green');
	test.done()
}
