let {parser}=require('./angle_base_test')
let {emit}=require('../emitter')

class EmitterTest extends (ParserBaseTest) {
	setUp() {
		if ('use_tree' in process.env) {
			console.log('NO FunctionTest in interpreter mode (yet)');
			skip();
			context.use_tree = true;
			context.interpret = false;
		}
	}

	assert_result_emitted(self, x, r){
		assert_equals(context.last_result(parser.parse_tree(x)), r);
	}

	test_emit() {
		emit(2);
	}

		test_basic(){
		assert_result_is(`2`, 2);
	}


	test_int(){
		// Module(body=[Print(dest=None, values=[Num(n=1, lineno=1, col_offset=6)], nl=True, lineno=1, col_offset=0)])
		// Module([Print(None, [Num(1)], True)])
		assert_result_is(`2`, 2);
	}
	test_float(){
		// Module(body=[Print(dest=None, values=[Num(n=1, lineno=1, col_offset=6)], nl=True, lineno=1, col_offset=0)])
		// Module([Print(None, [Num(1)], True)])
		assert_result_is(`2.3`, 2.3);
	}
	test_simple_math(){
		assert_result_is(`2+2`, 4);
	}

	test_variable_math(){
		assert_result_is(`x=3;x+1`, 4);
	}
	test_js_emitter() {
		// skip()
		if (context.use_tree == false) {
			assert_result_emitted('x=5;increase x', 6);
			// #skip()
		}
	}
	test_int_setter() {
		if (context.use_tree == false) {
			skip();
			assert_result_emitted('x=5;puts x', 5);
		}
	}
	test_type_cast23(){
		assert_result_is(`2.3 as int`, 2);
	}
	test_assert_result_emitted(){
		assert_result_emitted('int z is 2.3 as int', 2);
	}
	test_type_cast3(){
		// skip()
		assert_result_emitted('z2 is 2.3 as string', '2.3');
	}
	test_type_cast_error(){
		// skip()
		try {
			assert_result_emitted('int z is 2.3 as string', 2);
			throw Exception(`SHOULD RAISE WrongType: OLD: <type 'int'> None VS str [2.3] return_type: <type 'str'> `);
		} catch ( WrongType) {
			pass  // all good, did raise
		}
		// skip()
		parser.dont_interpret();
		parse(`printf 'hello world'`, false);
		// parser.full_tree();
	// result = emit(interpretation, {'run': True, }, WasmEmitter())
	// assert_equals(result, 'hello world')
	}
	
	test_printf_1(){
		// skip()
		assert_result_emitted(`printf  'hello world'` ,'hello world');
		assert_result_emitted(`printf  'hello world'` ,'hello world');
	}

	test_setter(){
		// skip()
		assert_result_emitted('i=7', 7);
	}
	test_setter2(){
		// skip()
		parser.dont_interpret();
		assert_result_emitted(`x='ho';puts x`, 'ho');
	}

	test_function_call(){
		assert_result_emitted('i=7;i minus one', 6);
	}


	test_function_defs(){
		skip()  // FUCKUP
		parse(`def test{pass}`);
		parse(`def test{pass};test`);
		parse(`def test{puts 'yay'}`);
		parse(`def test{puts 'yay'};test`);
	}
	test_function_def(){
		// #skip()
		parse(`def test{puts 'yay'}`);
	}
	// parse("def test{puts 'yay'};test")
	// Module([FunctionDef('test', arguments([], None, None, []), [Print(None, [Str('yay')], True)], [])])
	// Module(body=[FunctionDef(name='test', args=arguments(args=[], vararg=None, kwarg=None, defaults=[]), body=[Print(dest=None, values=[Str(s='yay', lineno=1, col_offset=17)], nl=True, lineno=1, col_offset=11)], decorator_list=[], lineno=1, col_offset=0)])

	test_function(){
		// #skip()
		// parse("def test():puts 'yay'\ntest()")
		assert_result_emitted(`def test{puts 'yay'};test()`, 'yay');
	}
	// assert_result_emitted("def test{puts 'yay'};test", 'yay')

	test_function_body2(){
		// #skip()
		add1 = parse(`to add1 to x return x+1 if x bigger 4 else x-1`)  // todo
	}
	test_function_body(){
		// todo: wrap def dummy():if x bigger 4 then x+1 else x-1     return dummy()
		add1 = parse(`to add1 to x return if x bigger 4 then x+1 else x-1`);
		assert_result_is(`add1(3)`, 2);
	}
	// assert_result_is('add1(5)',6)

	test_function_args(){
		// skip()
		// add1=parse("def add1(x):return x+1")
		add1 = parse(`to add1 to x do x+1`);
		assert_result_is(`add1(5)`, 6);
	}
	test_identity(){
		// skip()
		identity0 = parse(`def identity(x):return x`);
		assert_result_is(`identity(5)`, 5);
	}
	// assert_equals(identity0.call(5),5)
	// assert('identity(5) is 5')

	test_beep_import(){
		// skip()
		pyc_emitter.get_ast('beep()');
		assert_equals(parse(`beep`), 'beeped');
	}
	test_deep_in_loop(){
		// skip()
		exec((compile('c=0\nwhile c<3:\n c+=1\n if c>1:beep()', '', 'exec')), {'beep': beep});
		py_ast = pyc_emitter.get_ast('c=0\nwhile c<3:\n c+=1\n if c>1:beep()');
		pyc_emitter.run_ast(py_ast)  // WHOOT??  expected some sort of expr, but got <_ast.While object at 0x111a48c10>
	}
	// pyc_emitter.get_ast("c+=1\nif c>1:beep()")
	// assert_equals(parse('c=0;while c<3:c++;if c>1 then beep;done'), 'beeped')
	//   If(Compare(Name('c', Load()), [Gt()], [Num(1)]), [Expr(Call(Name('beep', Load()), [], [], None, None))], [])])

	//   If(Compare(Name('c', Load()), [Gt()], [Num(1)]), [Expr(Call(Name('beep', Load()), [], [], None, None))], [])])

	// Module([FunctionDef('test', arguments([], None, None, []), [Print(None, [Str('yay')], True)], []), Expr(Call(Name('test', Load()), [], [], None, None))])

	// Module(body=[FunctionDef(name='test', args=arguments(args=[], vararg=None, kwarg=None, defaults=[]), body=[Print(dest=None, values=[Str(s='yay', lineno=1, col_offset=17)], nl=True, lineno=1, col_offset=11)], decorator_list=[], lineno=1, col_offset=0), Expr(value=Call(func=Name(id='test', ctx=Load(), lineno=2, col_offset=0), args=[], keywords=[], starargs=None, kwargs=None, lineno=2, col_offset=0), lineno=2, col_offset=0)])


	// Module(body=[Function(name='test', args=arguments(args=[], vararg=None, kwarg=None, defaults=[]), body=[Assign(targets=[Name(id='result', ctx=Store())], value=Print(dest=None, values=[Str(s='yay')], nl=True))], decorator_list=[]), Call(func=Name(id='test', ctx=Load()), args=[], keywords=[], starargs=None, kwargs=None)])

	test_learnt_function2(){
		// skip()
		parse(`samples/factorial.e`);
		assert_result_emitted('factorial 6', 720);
	}
	test_if_then(){
		// skip()
		// assert_result_emitted('if (3 > 0):1\nelse:0', 1)
		assert_result_emitted('if 3 > 0 then 1 else 0', 1);
	}
	// Module([Assign([Name('it', Store())], If(Condition(Num(3), [Gt()], [Num(0)]), [Num(1)], [Num(0)]))])

	test_array(){
		// skip()
		// assert_result_emitted('xs=[1,4,7];xs.reverse()', [7, 4, 1])
		assert_result_emitted('xs=[1,4,7];reverse xs', [7, 4, 1]);
	}

	test_array2(){
		// skip()
	assert_result_emitted(`def invert(x){x.reverse;return x;}\nxs=[1,4,7];invert xs`, [7, 4, 1]);
	assert_result_emitted(`def invert(x){x.reverse;\nreturn x;}\nxs=[1,4,7];invert xs`, [7, 4, 1]);
	}

	test_if_in_loop(){
		// skip()
		// pyc_emitter.get_ast("c+=1\nif c>1:beep()")
		assert_equals(parse(`c=0;\nwhile c<3:\nc++;\nif c>1 then beep;\ndone`), 'beeped')
	}
}
exports.test_type_cast_error=new EmitterTest().test_emit
// exports.test_type_cast_error=new EmitterTest().test_type_cast_error
