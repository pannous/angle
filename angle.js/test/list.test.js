let context = require("../context")
context.use_tree = false;
require("../statements")
let {assert_result_is, assert_has_error, assert_that, parser, init, clear} = require("./angle_base_test")

class ListTest extends (ParserBaseTest) {
	setUp() {
		parser.clear();
		// 	# context.use_tree=False
		// 	parser.do_interpret()
		// 	super(ListTest, self).setUp()
		// 	super(ParserBaseTest, self).setUp()
	}

	test_natural_array_index() {
		assert_equals(parse(`second element in [1,2,3]`), 2);
	}

	test_natural_array_index_var() {
		parse(`x=[1,2,3]`);
		assert_equals(parse(`third element in x`), 3);
	}

	test_lists() {
		let x = parse(`1 , 2 , 3`);
		assert_equals(x, [1, 2, 3]);
		x = parse(`1,2,3`);
		assert_equals(x, [1, 2, 3]);
		x = parse(`[1,2,3]`);
		assert_equals(x, [1, 2, 3]);
		x = parse(`{1,2,3}`);
		assert_equals(x, [1, 2, 3]);
		x = parse(`1,2 and 3`);
		assert_equals(x, [1, 2, 3]);
		x = parse(`[1,2 and 3]`);
		assert_equals(x, [1, 2, 3]);
		x = parse(`{1,2 and 3}`);
		assert_equals(x, [1, 2, 3]);
	}

	test_type0() {
		let {liste} = require('../expressions')
		init('1 , 2 , 3');
		assert_equals(liste(), [1, 2, 3]);
		init('1,2,3');
		assert_equals(liste(), [1, 2, 3]);
		init('[1,2,3]');
		assert_equals(liste(), [1, 2, 3]);
		init('{1,2,3}');
		assert_equals(liste(), [1, 2, 3]);
		init('1,2 and 3');
		assert_equals(liste(), [1, 2, 3]);
		init('[1,2 and 3]');
		assert_equals(liste(), [1, 2, 3]);
		init('{1,2 and 3}');
		assert_equals(liste(), [1, 2, 3]);
	}

	test_list_methods() {
		parse(`invert [1,2,3]`);
		assert_equals(the.result, [3, 2, 1]);
	}

	why_test_error() {
		// assert_has_error(`first int in 'hi,'you' is 'hi'`);
	}

	test_last() {
		assert_that(`last item in 'hi','you' is equal to 'you'`);
		assert_that(`last item in 'hi','you' is equal to 'you'`);
	}

	test_select2() {
		assert_that(`first item in 'hi','you' is 'hi'`);
		assert_that(`second item in 'hi','you' is 'you'`);
		assert_that(`last item in 'hi','you' is 'you'`);
	}

	test_select3() {
		assert_equals(parse(`1st word of 'hi','you'`), 'hi');
		assert_that(`1st word of 'hi','you' is 'hi'`);
		assert_that(`2nd word of 'hi','you' is 'you'`);
		assert_that(`3rd word of 'hi','my','friend' is 'friend'`);
	}

	test_select4() {
		assert_that(`first word of 'hi','you' is 'hi'`);
		assert_that(`second word of 'hi','you' is 'you'`);
		assert_that(`last word of 'hi','you' is 'you'`);
	}

	test_select5() {
		skip();
		assert_that(`numbers are 1,2,3. second number is 2`);
		assert_that(`my friends are a,b and c. my second friend is b`);
	}

	test_select6() {
		assert_that(`last character of 'howdy' is 'y'`);
		assert_that(`first character of 'howdy' is 'h'`);
		assert_that(`second character of 'howdy' is 'o'`);
	}

	test_list_syntax() {
		assert_that(`1,2 is [1,2]`);
		assert_that(`1,2 is {1,2}`);
		assert_that(`1,2 == [1,2]`);
	}

	test_list_syntax3() {
		assert_that(`[1,2] is {1,2}`);
		// assert_that(`1,2 = [1,2]`);
	}

	test_list_syntax2() {
		assert_that(`1,2,3 is the same as [1,2,3]`);
		assert_that(`1,2 and 3 is the same as [1,2,3]`);
		assert_that(`1,2 and 3 are the same as [1,2,3]`);
		assert_that(`1,2 and 3 is [1,2,3]`);
	}

	test_concatenation() {
		parse(`x is 1,2,3;y=4,5,6`);
		assert_equals([1, 2, 3], the.variableValues['x']);
		assert_equals(3, len(the.variableValues['y']));
		let z = parse(`x + y`).result
		assert_equals(len(z), 6);
		assert_equals(z, [1, 2, 3, 4, 5, 6]);
		z = parse(`x plus y`).result
		assert_equals(len(z), 6);
		assert_equals(z, [1, 2, 3, 4, 5, 6]);
	}

	test_concatenation_plus() {
		parse(`x is 1,2;y=3,4`);
		let z = parse(`x plus y`);
		assert_equals(z, [1, 2, 3, 4]);
	}

	test_concatenation2() {
		parse(`x is 1,2,3;y=4,5,6`);
		parse(`x + y`);
		assert_equals(6, len(the.result));
		parse(`z is x + y`);
		assert_equals(the.variables['z'], [1, 2, 3, 4, 5, 6]);
	}

	test_concatenation2c() {
		// raise Exception("SERIOUS BUG: LOOP!")
		// skip()
		parse(`x is 1,2\n       y is 3,4\n       z is x + y`);
		assert_equals(the.variables['z'], [1, 2, 3, 4]);
	}

	test_concatenation3() {
		variables['x'] = [1, 2];
		variables['y'] = [3, 4];
		init('x + y == 1,2,3,4');
		let {condition} = require('../expressions')
		condition();
		assert('x + y == 1,2,3,4');
		assert_equals(parse(`x plus y`), [1, 2, 3, 4]);
		assert('x plus y == [1,2,3,4]');
	}

	test_concatenation4() {
		assert('1,2 and 3 == 1,2,3');
		assert('1,2 and 3 == 1,2,3');
	}

	test_type1() {
		init('class of 1,2,3');
		let {evaluate_property, expression} = require('../expressions')
		evaluate_property();
		assert_equals(the.result, Array)
		init('class of [1,2,3]');
		expression();
		assert_equals(the.result, Array)
	}

	skip_test_type1b() {
		// skip();
		parse(`class of 1,2,3`);
		assert_equals(the.result, Array)
	}

	test_type2() {
		parse(`x=1,2,3;class of x`);
		assert_equals(the.result, Array)
	}

	test_type() {
		parse(`x=1,2,3;`);
		assert('type of x is Array');
	}

	test_type3() {
		parse(`x be 1,2,3;y= class of x`);
		assert_equals(the.variables['y'].value, Array);
		assert(the.variables['x'].value instanceof Array)
		assert_equals(the.variables['x'].type, Array)
	}

	test_type3b() {
		clear()
		parse(`x be 1,2,3;y= class of x`);
		assert_equals(type(the.variableValues['x']), Array)
		// assert_equals(kind(the.variableValues['x'], list)
		assert_equals(the.variables['y'].value, Array)
		assert_that(`y is a Array`);
		assert_that(`y is an Array`);
		assert_that(`y is Array`);
		assert_that(`Array == class of x`);
		assert_that(`class of x is Array`);
		assert_that(`kind of x is Array`);
		assert_that(`type of x is Array`);
	}

	test_type4() {
		let {Variable} = require("../nodes")
		variables['x'] = new Variable({'name': 'x', 'value': [1, 2, 3],});
		assert_that(`class of x is Array`);
		assert_that(`kind of x is Array`);
		assert_that(`type of x is Array`);
	}

	test_len() {
		let {Variable} = require("../nodes")
		variables['xs'] = new Variable({'value': [1, 2, 3], 'name': 'xs',});
		assert_that(`length of xs is 3`);
		assert_that(`size of xs is 3`);
		assert_that(`count of xs is 3`);
	}

	test_map() {
		// parse("def square x:x*x")
		assert_equals(parse(`square [2,3,4]`).result, [4, 9, 16]);
		assert_equals(parse(`square [1,2 and 3]`).result, [1, 4, 9]);
	}

	test_and() {
		skip();
		assert_that(`square of 1,2 and 3 == 1,4,9`);
		assert_equals(parse(`square 1,2,3`), [1, 4, 9]);
		assert_equals(parse(`square 1,2 and 3`), [1, 4, 9]);
	}

	test_and2() {
		skip();
		// parse("def square x:x*x")
		// parse("def square(x:int)->int:x*x")
		// parse("def square(xs:list)->list:square all in xs")
		assert_result_is(`square 1,2 and 3`, [1, 4, 9]);
		assert_that(`square of [1,2 and 3] equals 1,4,9`);
	}

	test_and3() {
		skip();
		parse(`assert square of [1,2 and 3] equals 1,4,9`);
	}

	test_and4() {
		skip();
		assert_that(`square 1,2 and 3 == 1,4,9`);
	}

	test_every_selector() {
		// DAMN PLURAL!
		assert_result_is(`all letter in 1,"a",2,"c",3`, ['a', 'c']);
		assert_that(`(all letter in 1,"a",2,"c",3) == "a","c"`);
	}

	// assert_result_is('all letters in 1,"a",2,"c",3',["a","c"])
	// assert_that('(all letters in 1,"a",2,"c",3) == "a","c"')
	test_every_selector2() {
		assert_that(`(all number in 1,"a",2,3) == 1,2,3`);
		assert_that(`(all numbers in 1,"a",2,3) == 1,2,3`);
		assert_that(`(every number in 1,"a",2,3) == 1,2,3`);
	}

	test_every_selector_no_braces() {
		assert_that(`all number in 1,"a",2,3 == 1,2,3`);
		assert_that(`all numbers in 1,"a",2,3 == 1,2,3`);
		assert_that(`every number in 1,"a",2,3 == 1,2,3`);
	}

	test_map3() {
		skip();
		assert_that(`square every number in 1,"a",2,3 == 1,4,9`);
		// wrong operator precedence:
		// square(number, [1,"a",2,3])  vs
		// square(numbers in [1,"a",2,3])
	}

	test_map4() {
		skip() // too hard
		assert_that(`add one to every number in 1,2,3 ==2,3,4`);
		assert_that(`square every number in 1,'a',3 ==1,9`);
	}

	test_hasht() {
		init('{1,2,3}');
		let {hash_map, liste} = require('../expressions')
		assert_equals(liste(), [1, 2, 3]);
		init('{a:1,b:2,c:3}');
		assert_equals(hash_map(), {'a': 1, 'b': 2, 'c': 3,});
	}
}

register(ListTest, module)
module.exports.test_current=new ListTest().test_every_selector2
// test_every_selector_no_braces
