let {assert_has_error}=require('./angle_base_test')
// "use strict"
// class SetterTest extends (ParserBaseTest) {
no_exports = nexports = {}//IGNORE
no_exports.test_samples = test => {
	let x = parse(`samples/basics.e`);
	assert(x == 6)
	test.done()
}

exports.test_a_setter_article_vs_variable = test => {
	assert_has_error(`a=green`, UndeclaredVariable)
	test.done()
}

nexports.test_a_setter_article_vs_variable_ANY = test => {
	parse(`a=green`);
	test.equals(variables['a'], 'green');
	assert_equals(variables['a'], 'green');
	test.done()
}


exports.test_a_setter_article_vs_variable2 = test => {
	assert_has_error(`a dog=green`,UndeclaredVariable)
	test.done()
}
// vs
no_exports.test_a_setter_article_vs_variable2 = test => {
	parse(`a dog=green`);
	assert_equals(variables['dog'], 'green');
	test.done()
}

exports.test_alias = test => {
	skip('aliases sit between methods and variables. do we really want them?');
	parse(`alias x=y*y`);
	parse(`z:=y*y`);
	parse(`y=8`);
	assert_result_is(`x`, 64);
	assert_result_is(`z`, 64);
	test.done()
}

exports.test_variable_type_syntax = test => {
	parse(`int i=3`);
	test.done()
}
exports.test_variable_type_syntax2 = test => {
	parse(`an integer i;i=3`);
	test.done()
}

exports.test_variable_type_syntax3 = test => {
	parse(`int i;i=3`);
	test.done()
}
exports.test_variable_type_cast = test => {
	parse(`int i;i=3.2 as int`);
	test.done()
}
exports.test_variable_range = test => {
	let j = parse(`list i is 5 to 10`);
	let i = parse(`i is 5 to 10`);
	assert_equals(i, j);
	assert_equals(i, list(range(5, 10 + 1)))  // count from 1 to 10 => 10 INCLUDED, thus +1!
	test.done()
}
exports.test_variable_type_cast2 = test => {
	// skip();
	parse(`int i;i=int(3.2)`);
	parse(`int i;i=int(float("3.2"))`);
	parse(`int i;i=float("3.2") as int`);
	parse(`int i;i=int("3.2")`);
	test.done()
}
exports.test_guard_value = test => {
	assert_result_is(`x=nil or 'c'`, 'c') //  value side to guard!
	test.done()
}
exports.test_guard_value_else = test => {
	assert_result_is(`x=nil else 'c'`, 'c')//  assignment side guard!
	test.done()
}
exports.test_guard_value_else2 = test => {
	assert_result_is(`char x=3 else 'c'`, 'c');
	test.done()
}
exports.test_guard_value_setter = test => {
	skip();
	assert_result_is(`x=nil else x='c'`, 'c');
	assert_result_is(`char x=3 else x='c'`, 'c');
	// =>  why not use 'else' as 'or' operator?
	// if x=1: nil else 1  MISSLEADING!
	test.done()
}
exports.test_guard_action = test => {
	skip();
	parse(`x=nil else return`);
	parse(`x=nil else print 'ok'`);
	test.done()
}

exports.test_guard_rescue_nan = test => {
	assert_result_is(`x=1/0 or 2`, 2);
	assert_result_is(`x=1/0 else 2`, 2);
	test.done()
}

exports.test_guard_rescue = test => {
	assert_result_is(`x=1/0 rescue 2`, 2);
	assert_result_is(`x=1 rescue 2/0`, 1);
	test.done()
}

exports.test_guard_rescue2 = test => {
	assert_result_is(`try x=1/0 rescue 2`, 2);
	assert_result_is(`x=2;try x=x/0`, 2);
	test.done()
}
exports.test_guard_block = test => {
	parse(`x=nil else { print 'nevermind' }`);
}
exports.test_guard_block2 = test => {
	parse(`guard let x=nil else { print 'nevermind' }`);
	parse(`x=nil else { print 'ok' }`);
	test.done()
}
exports.test_variable_type_syntax2 = test => {
	parse(`char x='c'`);
	parse(`char x;x='c'`);
	parse(`char x;x=3 as char`)// ambiguous : x='3' or x=chr(3) == '\x03' ?
	// all error free
	test.done()
}
exports.test_variable_type_safety_a = test => {
	assert_has_no_error(`typed i="hi";i='ho'`);
	test.done()
}
exports.test_variable_type_safety_b = test => {
	assert_has_error('typed i="hi";i=3', WrongType);
	// Especially useful if we get the return value of a function with unknown type but mutable value
	test.done()
}

exports.test_variable_type_safety_autocast = test => {
	let x = parse(`string i=3`);
	if (x == '3') console.log('auto casted it to string');
	test.done()
}
exports.test_variable_type_safety_no_autocast = test => {
	assert_has_error('string i=3', WrongType);
	todo("Todo: disable autocast!?")
	test.done()
}

exports.test_variable_type_safety_NaN = test => {
	if (!assert_result_is('int i="hi"', NaN))
		assert_has_error('int i="hi"', WrongType);
}
exports.test_variable_type_safety0 = test => {
	assert_has_error('int i="hi"', WrongType);
	assert_has_error('integer i="hi"', WrongType);
	test.done()
}

exports.test_variable_type_safety1 = test => {
	assert_has_error('an integer i;i="hi"', WrongType);
	assert_has_error('typed i="hi";i=3', WrongType);
	test.done()
}
exports.test_variable_immutable = test => {
	assert_has_error('const i=1;i="hi"', WrongType);
	assert_has_error('const i="hi";i="ho"', WrongType);
	assert_has_error('const i=1;i=2', ImmutableVaribale);
	test.done()
}
exports.test_variable_type_declaration_safety = test => {
	assert_has_error('int i;string i', WrongType);
	assert_has_error('i=1;string i', WrongType);
	assert_has_error('int i;i="hi"', WrongType);

	test.done()
}

exports.quick_test = x => {
	assert_result_is(`x=nil or 'c'`, 'c') //  value side to guard!
	// assert_result_is(`x=nil else 'c'`,'c')//  assignment side guard!
	// assert_result_is(`char x=3 else 'c'`,3);
	x.done()
}

// register(SetterTest, module)
