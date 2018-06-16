let {parser,assert_result_is}=require('./angle_base_test')
let {emit}=require('../walt/emitter')
// let {emit}=require('../emitter')
let ast = require('../ast')


function assert_emit(prog, val) {
	// console.log(assert_emitted.caller)
	let result
	if (prog instanceof ast.AST) result = emit(prog)
	else result = emit(parse(prog));
	assert_equals(result, val)
	console.log(prog)
	console.log(val)
}
//
// function assert_emitted(block,result) {
// 	parser.init(block)
// 	let code=(parser.rooty())
// 	assert_result_is(emit(code),result);
// }
context.use_tree = true;

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

	test_math_ops() {
		assert_emit(new ast.BinOp(2, ast.Add, 3), 5)
		assert_emit(new ast.BinOp(2, ast.Sub, 4), -2)
		assert_emit(new ast.BinOp(35, ast.Div, 7), 5)
		assert_emit(new ast.BinOp(2, ast.Mult, 4), 8)
		assert_emit(new ast.BinOp(5, ast.Mod, 4), 1)
		assert_emit(new ast.BinOp(2, ast.And, 3), 2)
		assert_emit(new ast.BinOp(2, ast.BitOr, 4), 6)
		assert_emit(new ast.BinOp(2, ast.Or, 4), 6)
		assert_emit(new ast.BinOp(2, ast.Eq, 2), 1)
		// assert_emit(new ast.BinOp(2, ast.BitXor, 3), 5)
	}

	test_math() {
		assert_emit("2+3", 5)
		assert_emit("2*3", 6)
		assert_emit("2-3", -1)
		assert_emit("12/3", 4)
		assert_emit("12%5", 2)
		// assert_emit("2/3", 2/3)
	}

	test_primitives() {
		assert_emit(new ast.BinOp(2, ast.Add, 2), 4)
	}

	test_basic(){
		assert_emit(`2`, 2);
	}


	test_int(){
		// Module(body=[Print(dest=None, values=[Num(n=1, lineno=1, col_offset=6)], nl=True, lineno=1, col_offset=0)])
		// Module([Print(None, [Num(1)], True)])
		assert_emit(`2`, 2);
	}

	test_float(){
		// Module(body=[Print(dest=None, values=[Num(n=1, lineno=1, col_offset=6)], nl=True, lineno=1, col_offset=0)])
		// Module([Print(None, [Num(1)], True)])
		assert_emit(`2.3`, 2.3);
	}
	test_simple_math(){
		assert_emit(`2+2`, 4);
	}

	test_variable_math(){
		assert_emit(`x=3;x+1`, 4);
	}
	test_js_emitter() {
		// skip()
		if (context.use_tree == false) {
			assert_emit('x=5;increase x', 6);
			// #skip()
		}
	}
	test_int_setter() {
		if (context.use_tree == false)
			skip();
		assert_emit('x=5;puts x', 5);

	}
	test_type_cast23(){
		assert_emit(`2.3 as int`, 2);
	}
	test_assert_result_emitted(){
		assert_emit('int z is 2.3 as int', 2);
	}
	test_type_cast3(){
		// skip()
		assert_emit('z2 is 2.3 as string', '2.3');
	}
	test_type_cast_error(){
		// skip()
		try {
			assert_emit('int z is 2.3 as string', 2);
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
		assert_emit(`printf  'hello world'` ,'hello world');
		assert_emit(`printf  'hello world'` ,'hello world');
	}

	test_setter(){
		// skip()
		assert_emit('i=7', 7);
	}
	test_setter2(){
		// skip()
		parser.dont_interpret();
		assert_emit(`x='ho';puts x`, 'ho');
	}

	test_function_call(){
		assert_emit('i=7;i minus one', 6);
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
		assert_emit(`def test{puts 'yay'};test()`, 'yay');
	}
	// assert_result_emitted("def test{puts 'yay'};test", 'yay')

	test_function_body2(){
		// #skip()
		add1 = parse(`to add1 to x return x+1 if x bigger 4 else x-1`)  // todo
	}
	test_function_body(){
		// todo: wrap def dummy():if x bigger 4 then x+1 else x-1     return dummy()
		add1 = parse(`to add1 to x return if x bigger 4 then x+1 else x-1`);
		assert_emit(`add1(3)`, 2);
	}
	// assert_result_is('add1(5)',6)

	test_function_args(){
		// skip()
		// add1=parse("def add1(x):return x+1")
		add1 = parse(`to add1 to x do x+1`);
		assert_emit(`add1(5)`, 6);
	}
	test_identity(){
		// skip()
		identity0 = parse(`def identity(x):return x`);
		assert_emit(`identity(5)`, 5);
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
		assert_emit('factorial 6', 720);
	}
	test_if_then(){
		// skip()
		// assert_result_emitted('if (3 > 0):1\nelse:0', 1)
		assert_emit('if 3 > 0 then 1 else 0', 1);
	}
	// Module([Assign([Name('it', Store())], If(Condition(Num(3), [Gt()], [Num(0)]), [Num(1)], [Num(0)]))])

	test_array(){
		// skip()
		// assert_result_emitted('xs=[1,4,7];xs.reverse()', [7, 4, 1])
		assert_emit('xs=[1,4,7];reverse xs', [7, 4, 1]);
	}

	test_array2(){
		skip()
	assert_emit(`def invert(x){x.reverse;return x;}\nxs=[1,4,7];invert xs`, [7, 4, 1]);
	assert_emit(`def invert(x){x.reverse;\nreturn x;}\nxs=[1,4,7];invert xs`, [7, 4, 1]);
	}

	no_test_if_in_loop(){
		// skip()
		// pyc_emitter.get_ast("c+=1\nif c>1:beep()")
		assert_equals(parse(`c=0;\nwhile c<3:\nc++;\nif c>1 then beep;\ndone`), 'beeped')
	}
}

current = new EmitterTest().
	test_int_setter
	// test_math
// test_float
// test_primitives // ok
// test_basic

module.exports.test_current = ok => {
	current && current();
	ok.done()
}
// register(EmitterTest, module) // ALL tests
