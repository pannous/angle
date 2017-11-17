// var angle = require('angle');
let {setVerbose} = require("../angle_parser")

let {gerund} = require("../angle_parser")
let {evaluate_property} = require("../expressions")
let {do_interpret, init} = require("../power_parser")
let {register} = require("./angle_base_test")
let {result, variableValues} = require("../context")
let {postjective} = require("../english_parser")
let {} = require("../statements")
let the = require("../context")
let {setter} = require("../statements")
let {algebra} = require("../expressions")
let {expression} = require("../expressions")
let {assert_result_is} = require("./angle_base_test")
let parser = require("../angle_parser")
var angle = require('./angle_base_test');

setVerbose(0)
let assert_that = angle.assert_that

class StringTest extends (ParserBaseTest) {
	test_string_methods() {
		parse(`invert "hi"`);
		assert_equals(the.result, 'ih');
	}

	test_string_methods2() {
		assert_that("invert 'hi' is 'ih'") // todo HIGHER BINDING OF CALL!
	}

	test_string_methods3() {
		assert_that(`invert("hi") is 'ih'`);
	}

	test_nth_word() {
		assert_that(`3rd word in 'hi my friend !!!' is 'friend'`);
		assert_that(`3rd word in 'hi my friend !!!' is 'friend'`);
	}

	_test_advanced_string_methods() {
		parse(`x="hi" inverted`);
		assert_equals(the.result, ('ih'));
		assert_equals('ih', variableValues['x']);
	}

	test_select_character() {
		assert_that(`last character of "hi" is 'i'`);
		assert_that(`first character of "hi" is 'h'`);
		assert_that(`second character of "hi" is 'i'`);
	}

	_test_select_word() {
		assert_that(`first word of 'hi you' is "hi"`);
	}

	_test_select_word2() {
		assert_that(`second word of 'hi you' is 'you'`);
	}

	_test_select_word3() {
		assert_that(`last word of 'hi you' is 'you'`);
	}

	test_gerunds() {
		init('gerunding');
		let x = gerund();
		init('gerunded');
		x = postjective();
		x;
	}

	test_concatenation() {
		do_interpret();
		parse(`z is "Hi" plus "World"`);
		assert_equals(the.variables['z'], 'HiWorld');
	}

	test_concatenation2a() {
		do_interpret();
		parse(`x is "Hi"; y is "World";z is x plus y`);
		assert_equals(the.variables['z'], 'HiWorld');
	}

	test_concatenation_b() {
		init('x is "hi"');
		setter();
		assert_equals("hi", the.variables['x']);
		init(`x + ' world'`);
		r = algebra();
		assert_equals(r, 'hi world');
		parse(`x + ' world'`);
		assert_equals(the.result, 'hi world');
		parse(`y is ' world'`);
		parse(`z is x + y`);
		assert_equals(the.variables['z'], 'hi world');
	}

	test_concatenation_b0() {
		parse(`x is "hi"`);
		parse(`y is ' you'\n       z is x + y`);
		// parse("y is ' you'\nz is x + y")
		assert_equals(the.variables['z'], 'hi you');
	}

	test_concatenation_b1() {
		init('x is "hi"');
		setter();
		assert_equals("hi", the.variables['x']);
		init('x + " world"');
		r = algebra();
		assert_equals(r, 'hi world');
		parse(`x + ' world'`);
		assert_equals(the.result, 'hi world');
		parse(`y is ' world'`);
		parse(`z is x + y`);
		assert_equals(the.variables['z'], 'hi world');
	}

	test_concatenation_c() {
		parse(`x is "hi"`);
		parse(`y is ' you'`);
		parse(`z is x + y`);
		assert_equals(the.variables['z'], 'hi you');
	}

	test_newline_statements() {
		parse(`x is "hi";\n           z='ho'`);
		assert_equals(the.variables['z'], 'ho');
	}

	test_concatenation_c3() {
		parse(`x is "hi"`);
		parse(`y is ' you';z is x + y`);
		assert_equals(the.variables['z'], 'hi you');
	}

	DONT_test_concatenation_by_and() {
		parse(`z = x and y`);
		assert_equals('hi world', the.variables['z']);
		assert_that(`x and y == 'hi world'`);
		parse(`z is x and ' ' and y`);
		assert_that(`type of z is string or list`);
	}

	dont_test_list_concatenation() {
		init('"hi" " " "world"');
		z = expression();
		assert_equals(z, 'hi world');
		the.variables['x'] = ["hi",];
		the.variables['y'] = ["world",];
		init(`z=x ' ' y`);
		z = setter();
		assert_equals(z, 'hi world');
		parse(`x is "hi"; y is "world";z is x ' ' y`);
		assert_that(`type of z is string or type of z is list`);
		assert_that(`type of z is string or list`);
		assert_equals(the.variables['z'], 'hi world');
		assert_that(`z is 'hi world' OR z is "hi",' ',"world"`);
	}

	test_concatenation2() {
		parse(`x is "hi"; y = ' world'`);
		assert_equals(the.variables['x'], "hi");
		assert_equals(the.variables['y'], ' world');
		assert_equals(parse(`x + y`), `hi world`);
		assert_that(`x plus y == 'hi world'`);
	}

	test_concatenation2b() {
		assert_equals(parse(`"hi"+ ' '+"world"`), `hi world`);
		assert_result_is(`"hi"+ ' '+"world"`, 'hi world');
		parse(`x is "hi"; y is "world";z is x plus ' ' plus y`);
		// console.log("the.variables['z']" , the.variables['z'])
		assert_equals(the.variables['z'], 'hi world');
		assert_that(`z is 'hi world'`);
	}

	test_type() {
		parse(`x="hi"`);
		assert_result_is(`type of x`, String);
		assert_that(`type of x is string`);
	}

	test_type3() {
		parse(`x be 'hello world';`);
		assert_that(`x is a string`);
		assert_that(`type of x is string`);
		assert_that(`class of x is string`);
		assert_that(`kind of x is string`);
		parse(`yy= class of x`);
		assert_equals(str, the.variables['yy'].value);
		// assert_equals(Quote, the.variables['y'])
		assert_that(`yy is string`);
		parse(`yy is type of x`);
		assert_that(`yy is string`);
	}

	test_type1() {
		init('class of "hi"');
		let result = evaluate_property();
		assert_equals(result, String);
		// assert_equals(result, Quote)
		init('class of "hi"');
		expression();
		assert_equals(the.result, String);
		// assert_equals(result, Quote)
		parse(`class of "hi"`);
		assert_equals(the.result, String);
		// assert_equals(result, Quote)
	}

	test_type2b() {
		parse(`x="hi";\n      class of x`);
		let result = parse(`x="hi";class of x`);
		assert_equals(result, String);
		// assert_equals(result, Quote)
	}

	test_result() {
		parse(`x be 'hello world';show x;x; class of x`);
		assert_that(`type of x is string`);
		assert_that(`class of x is string`);
		parse(`yy is type of x`);
		assert_that(`yy is string`);

	}
}

setVerbose()
// register(StringTest, module)
// module.exports=StringTest.prototype
// module.exports.test_string_methods=new StringTest().test_string_methods3
module.exports.test_current = new StringTest()._test_select_word3
