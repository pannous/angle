require('./angle_base_test')
"use strict"
class SetterTest extends (ParserBaseTest) {
	setUp(){
		parser.clear();
	}
	est_samples(){
		let x=parse(`samples/basics.e`);
		assert(x==6)
	}
	test_a_setter_article_vs_variable(){
		skip();
		// dont_
		parse(`a=green`);
		assert_equals(variables['a'], 'green');
		parse(`a dog=green`);
		assert_equals(variables['dog'], 'green');
	}
	test_alias(){
		skip('aliases sit between methods and variables. do we really want them?');
		parse(`alias x=y*y`);
		parse(`z:=y*y`);
		parse(`y=8`);
		assert_result_is(`x`,64);
		assert_result_is(`z`,64);
	}

	test_variable_type_syntax(){
		parse(`int i=3`);
		parse(`an integer i;i=3`);
		parse(`int i;i=3`);
	}
	test_variable_type_cast(){
		parse(`int i;i=3.2 as int`);
	}
	test_variable_range(){
		let j = parse(`list i is 5 to 10`);
		let i = parse(`i is 5 to 10`);
		assert_equals(i,j);
		assert_equals(i, list(range(5, 10 + 1)))  // count from 1 to 10 => 10 INCLUDED, thus +1!
	}
	test_variable_type_cast2(){
		skip();
		parse(`int i;i=int(3.2)`);
		parse(`int i;i=int(float("3.2"))`);
		parse(`int i;i=float("3.2") as int`);
		parse(`int i;i=int("3.2")`);
	}
	test_guard_value(){
		assert_result_is(`x=nil or 'c'`,'c') //  value side to guard!
		assert_result_is(`x=nil else 'c'`,'c')//  assignment side guard!
		assert_result_is(`char x=3 else 'c'`,'c');
	}
	test_guard_value_setter(){
		skip();
		assert_result_is(`x=nil else x='c'`,'c');
		assert_result_is(`char x=3 else x='c'`,'c');
	// =>  why not use 'else' as 'or' operator?
	// if x=1: nil else 1  MISSLEADING!
	}
	test_guard_action(){
		skip();
		parse(`x=nil else return`);
		parse(`x=nil else print 'ok'`);
	}
	test_guard_rescue(){
		assert_result_is(`x=1/0 rescue 2`, 2);
		assert_result_is(`x=1 rescue 2/0`, 1);
	}
	test_guard_rescue2(){
		assert_result_is(`try x=1/0 rescue 2`, 2);
		assert_result_is(`x=2;try x=x/0`, 2);
	}
	test_guard_block(){
		parse(`x=nil else { print 'nevermind' }`);
		parse(`guard let x=nil else { print 'nevermind' }`);
		parse(`x=nil else { print 'ok' }`);
	}
	test_variable_type_syntax2(){
		parse(`char x='c'`);
		parse(`char x;x='c'`);
		parse(`char x;x=3 as char`)// ambiguous : x='3' or x=chr(3) == '\x03' ?
		// all error free
	}
	test_variable_type_safety_a(){
		assert_has_no_error(`typed i="hi";i='ho'`);
	}
	test_variable_type_safety_b(){
		assert_has_error('typed i="hi";i=3', WrongType);
		// Especially useful if we get the return value of a function with unknown type but mutable value
	}
	test_variable_type_safety0(){
		let x=parse(`string i=3`);
		if(x=='3')console.log('auto casted it to string');
		assert_has_error('string i=3', WrongType);
		assert_has_error('int i="hi"', WrongType);
		assert_has_error('integer i="hi"', WrongType);
	}
	test_variable_type_safety1(){
		assert_has_error('an integer i;i="hi"', WrongType);
		assert_has_error('typed i="hi";i=3', WrongType);
	}
	test_variable_immutable(){
		assert_has_error('const i=1;i="hi"', WrongType);
		assert_has_error('const i="hi";i="ho"', WrongType);
		assert_has_error('const i=1;i=2', ImmutableVaribale);
	}
	test_variable_type_declaration_safety(){
		assert_has_error('int i;string i', WrongType);
		assert_has_error('i=1;string i', WrongType);
		assert_has_error('int i;i="hi"', WrongType);

	}
}
// register(SetterTest ,module)
// register(new SetterTest(),module)
// exports.o=x=>{parse(`int i=3`);x.done()}
exports.quick_test=x=>{
	// parse(`int i=3`);
	// assert_has_error('int i;string i', WrongType);
	assert_has_no_error(`typed i="hi";i='ho'`);
	x.done()
}
