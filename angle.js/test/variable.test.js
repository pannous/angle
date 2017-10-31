// var angle = require('angle');
context.use_tree = false;

class VariableTest extends (ParserBaseTest) {

	setUp(){
		parser.clear();
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
		skip();
		//todo('alias as function def++++');
		context.use_tree=false;
		parse(`z:=y*y`);
		parse(`y=8`);
		assert_result_is(`z`,64);
	}
	test_alias_keyword(){
		skip();
		parse(`alias x=y*y`);
		assert_result_is(`x`,64);
	}

	test_variableTypes(){
		init('an integer i');
		parser.variable(null, ast.Store());
	}
	test_variable_type_syntax(){
		parse(`int i=3`);
		parse(`an integer i;i=3`);
		parse(`int i;i=3`);
	}
	test_variable_type_cast(){
		parse(`int i;i=3.2 as int`);
	}
	test_variable_range_with_type(){
		skip();
		i = parse(`list i is 5 to 10`);
		assert_equals(i, list(range(5, 10 + 1)))  // count from 1 to 10 => 10 INCLUDED, thus +1!
	}
	test_variable_range2(){
		i = parse(`i is 5 to 10`);
		assert_equals(i, list(range(5, 10 + 1)))  // count from 1 to 10 => 10 INCLUDED, thus +1!
	}
	test_variable_type_cast2(){
		skip();
		parse(`int i;i=int(3.2)`);
		parse(`int i;i=int(float("3.2"))`);
		parse(`int i;i=float("3.2") as int`);
		parse(`int i;i=int("3.2")`);
	}
	test_variable_type_syntax2(){
		parse(`char x='c'`);
		parse(`char x;x='c'`);
		// parse("char x;x=3 as char")
		// character
		// all error free
	}
	test_variable_type_safety_auto(){
		assert_has_no_error(`typed i=3;i='ho'`);
	}

	test_variable_type_safety0(){
		assert_has_error('string i=3', WrongType);
		assert_has_error('int i="hi"', WrongType);
		assert_has_error('integer i="hi"', WrongType);
	}
	test_auto_cast(){
		skip();
		assert_result_is(`auto string i=3`, '3');
		assert_result_is(`auto int i="hi"`, 0);
		assert_result_is(`auto integer i="hi"`, 0);
	}
	test_variable_type_as_overwrite(){
		assert_result_is(`i=3 as string`, '3');
		assert_result_is(`i=4.3 as int`, 4);
	}
	test_variable_type_as1(){
		assert_result_is(`i=3 as string`, '3');
		assert_result_is(`i=3 as string;i.type`, String);
		assert_result_is(`i=3 as string;type of i`, String);
	}
	test_variable_type_as(){
		assert_result_is(`i=4.3 as int`, 4);
		assert_result_is(`i=4.3 as int;type of i`, Number);
		// assert_result_is("i=4.3 as int;i.type", int)
	}
	test_variable_type_as_bad_cast(){
		assert_result_is(`i="hi" as int`, 0);
		assert_result_is(`i="hi" as int;i.type`, Number);
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
	test_variable_scope(){
		skip();
		parse(/* def cycle
										i = 1
										while i > 10
										i += 1
										end
										i
										 */);
		// end""") # IndentationError: unindent does not match any outer indentation level TOKENIZER WTF
		assert_result_is(1, the.variableValues['i']);
	}
	test_var_condition_unmodified(){
		the.variables['counter'] = Variable({'name': 'counter', 'value': 3,});
		init('counter=2');
		assert_equals(parser.condition(), false);
		self.do_assert('counter=3');
	}
	test_vars(){
		the.variables['counter'] = Variable({'name': 'counter', 'value': 3,});
		parse(`counter=2`);
		assert_equals(the.variableValues['counter'], 2);

	}
}
register(VariableTest, module)
