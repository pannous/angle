context.use_tree = false;

class ListTest extends (ParserBaseTest) {
	setUp(){
		parser.clear();
	// 	# context.use_tree=False
	// 	parser.do_interpret()
	// 	super(ListTest, self).setUp()
	// 	super(ParserBaseTest, self).setUp()
	}

	test_natural_array_index(){
		assert_equals(parse(`second element in [1,2,3]`), 2);
	}
	test_natural_array_index_var(){
		parse(`x=[1,2,3]`);
		assert_equals(parse(`third element in x`), 3);
	}
	test_lists(){
		x = parse(`1 , 2 , 3`);
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
	test_type0(){
		init('1 , 2 , 3');
		assert_equals(parser.liste(), [1, 2, 3]);
		init('1,2,3');
		assert_equals(parser.liste(), [1, 2, 3]);
		init('[1,2,3]');
		assert_equals(parser.liste(), [1, 2, 3]);
		init('{1,2,3}');
		assert_equals(parser.liste(), [1, 2, 3]);
		init('1,2 and 3');
		assert_equals(parser.liste(), [1, 2, 3]);
		init('[1,2 and 3]');
		assert_equals(parser.liste(), [1, 2, 3]);
		init('{1,2 and 3}');
		assert_equals(parser.liste(), [1, 2, 3]);
	}
	test_list_methods(){
		parse(`invert [1,2,3]`);
		assert_equals(result(), [3, 2, 1]);
	}
	test_error(){
		assert_has_error(`first item in 'hi,'you' is 'hi'`);
		assert_has_error(`first item in 'hi,'you' is 'hi'`);
	}
	test_last(){
		assert_that(`last item in 'hi','you' is equal to 'you'`);
		assert_that(`last item in 'hi','you' is equal to 'you'`);
	}
	test_select2(){
		assert_that(`first item in 'hi','you' is 'hi'`);
		assert_that(`second item in 'hi','you' is 'you'`);
		assert_that(`last item in 'hi','you' is 'you'`);
	}
	test_select3(){
		assert_equals(parse(`1st word of 'hi','you'`), 'hi');
		assert_that(`1st word of 'hi','you' is 'hi'`);
		assert_that(`2nd word of 'hi','you' is 'you'`);
		assert_that(`3rd word of 'hi','my','friend' is 'friend'`);
	}
	test_select4(){
		assert_that(`first word of 'hi','you' is 'hi'`);
		assert_that(`second word of 'hi','you' is 'you'`);
		assert_that(`last word of 'hi','you' is 'you'`);
	}
	test_select5(){
		skip();
		assert_that(`numbers are 1,2,3. second number is 2`);
		assert_that(`my friends are a,b and c. my second friend is b`);
	}
	test_select6(){
		assert_that(`last character of 'howdy' is 'y'`);
		assert_that(`first character of 'howdy' is 'h'`);
		assert_that(`second character of 'howdy' is 'o'`);
	}
	test_list_syntax(){
		assert_that(`1,2 is [1,2]`);
		assert_that(`1,2 is {1,2}`);
		assert_that(`1,2 == [1,2]`);
		assert_that(`[1,2] is {1,2}`);
		assert_that(`1,2 = [1,2]`);
	}
	test_list_syntax2(){
		assert_that(`1,2,3 is the same as [1,2,3]`);
		assert_that(`1,2 and 3 is the same as [1,2,3]`);
		assert_that(`1,2 and 3 are the same as [1,2,3]`);
		assert_that(`1,2 and 3 is [1,2,3]`);
	}
	test_concatenation() {
		parse(`x is 1,2,3;y=4,5,6`);
		assert(equals([1, 2, 3], the.variableValues['x'],));
		assert(equals(3, len(the.variableValues['y'],),));
		init('x + y');
		z = parser.algebra();
		if (context.use_tree) {
			z = parser.eval_ast(z);
			assert_equals(len(z), 6);
			z = parse(`x + y`);
			assert_equals(len(z), 6);
			assert_equals(len(result(),), 6);
			z = parse(`x plus y`);
			assert_equals(len(z), 6);
		}
	}
	test_concatenation_plus(){
		parse(`x is 1,2;y=3,4`);
		z = parse(`x plus y`);
		assert_equals(z, [1, 2, 3, 4]);
	}
	test_concatenation2(){
		parse(`x is 1,2,3;y=4,5,6`);
		parse(`x + y`);
		assert (equals(6, len(result(), )));
		parse(`z is x + y`);
		assert_equals(the.variables['z'], [1, 2, 3, 4, 5, 6]);
	}
	test_concatenation2c(){
		// raise Exception("SERIOUS BUG: LOOP!")
		// skip()
		parse(`x is 1,2\n       y is 3,4\n       z is x + y`);
		assert_equals(the.variables['z'], [1, 2, 3, 4]);
	}
	test_concatenation3(){
		variables['x'] = [1, 2];
		variables['y'] = [3, 4];
		init('x + y == 1,2,3,4');
		parser.condition();
		assert ('x + y == 1,2,3,4');
		assert_equals(parse(`x plus y`), [1, 2, 3, 4]);
		assert ('x plus y == [1,2,3,4]');
	}
	test_concatenation4(){
		assert ('1,2 and 3 == 1,2,3');
		assert ('1,2 and 3 == 1,2,3');
	}
	test_type1(){
		init('class of 1,2,3');
		parser.evaluate_property();
		assert_equals(result(), list);
		init('class of [1,2,3]');
		parser.expression();
		assert_equals(result(), list);
		skip();
		parse(`class of 1,2,3`);
		assert_equals(result(), list);
	}
	test_type2(){
		parse(`x=1,2,3;class of x`);
		assert_equals(result(), list);
	}
	test_type(){
		setUp();
		parse(`x=1,2,3;`);
		assert ('type of x is Array');
	}
	test_type3(){
		parse(`x be 1,2,3;y= class of x`);
		assert (equals(list, the.variables['y'].value));
		assert (isinstance(the.variables['x'].value, list));
		assert_equals(the.variables['x'].type, list);
	}
	test_type3b(){
		parse(`x be 1,2,3;y= class of x`);
		assert_equals(type(the.variableValues['x']), list);
		// assert_equals(kind(the.variableValues['x'], list)
		assert_equals(the.variables['y'].value, list);
		assert_that(`y is a Array`);
		assert_that(`y is an Array`);
		assert_that(`y is Array`);
		assert_that(`Array == class of x`);
		assert_that(`class of x is Array`);
		assert_that(`kind of x is Array`);
		assert_that(`type of x is Array`);
	}
	test_type4(){
		variables['x'] = Variable({'name': 'x', 'value': [1, 2, 3], });
		assert_that(`class of x is Array`);
		assert_that(`kind of x is Array`);
		assert_that(`type of x is Array`);
	}
	test_len(){
		variables['xs'] = Variable({'value': [1, 2, 3], 'name': 'xs', });
		assert_that(`length of xs is 3`);
		assert_that(`size of xs is 3`);
		assert_that(`count of xs is 3`);
	}
	test_map(){
		// parse("def square x:x*x")
		assert_equals(parse(`square [2,3,4]`), [4, 9, 16]);
		assert_equals(parse(`square [1,2 and 3]`), [1, 4, 9]);
	}
	test_and(){
		skip();
		assert_that(`square of 1,2 and 3 == 1,4,9`);
		assert_equals(parse(`square 1,2,3`), [1, 4, 9]);
		assert_equals(parse(`square 1,2 and 3`), [1, 4, 9]);
	}
	test_and2(){
		skip();
		// parse("def square x:x*x")
		// parse("def square(x:int)->int:x*x")
		// parse("def square(xs:list)->list:square all in xs")
		assert_result_is(`square 1,2 and 3`, [1, 4, 9]);
		assert_that(`square of [1,2 and 3] equals 1,4,9`);
	}
	test_and3(){
		skip();
		parse(`assert square of [1,2 and 3] equals 1,4,9`);
	}
	test_and4(){
		skip();
		assert_that(`square 1,2 and 3 == 1,4,9`);
	}
	test_every_selector(){
		// DAMN PLURAL!
		assert_result_is(`all letter in 1,"a",2,"c",3`, ['a', 'c']);
		assert_that(`(all letter in 1,"a",2,"c",3) == "a","c"`);
	}
	// assert_result_is('all letters in 1,"a",2,"c",3',["a","c"])
	// assert_that('(all letters in 1,"a",2,"c",3) == "a","c"')
	test_every_selector2(){
		assert_that(`(all number in 1,"a",2,3) == 1,2,3`);
		assert_that(`(all numbers in 1,"a",2,3) == 1,2,3`);
		assert_that(`(every number in 1,"a",2,3) == 1,2,3`);
	}
	test_every_selector_no_braces(){
		assert_that(`all number in 1,"a",2,3 == 1,2,3`);
		assert_that(`all numbers in 1,"a",2,3 == 1,2,3`);
		assert_that(`every number in 1,"a",2,3 == 1,2,3`);
	}
	test_map3(){
		skip();
		assert_that(`square every number in 1,"a",2,3 == 1,4,9`);
		// wrong operator precedence:
		// square(number, [1,"a",2,3])  vs
		// square(numbers in [1,"a",2,3])
	}

	test_map4(){
		skip() // too hard
		assert_that(`add one to every number in 1,2,3 ==2,3,4`);
		assert_that(`square every number in 1,'a',3 ==1,9`);
	}
	test_hasht(){
		init('{1,2,3}');
		assert_equals(parser.liste(), [1, 2, 3]);
		init('{a:1,b:2,c:3}');
		assert_equals(parser.hash_map(), {'b': 2, 'a': 1, 'c': 3, });

	}
}
register(ListTest, module)
