let {register, assert_has_error, assert_result_is, init, parser} = require('./angle_base_test');
let {hash_map} = require('../expressions')
// context.use_tree = False
// context.use_tree = true;

class HashTest extends (ParserBaseTest) {

	// def test_hash_symbol_invariance_extension(self):
	//     a = {'a': 1, }
	//     assert_equals(a['a'], a[:a])
	//     h = parse('{"SuperSecret" : "kSecValueRef"}')
	//     assert_equals(h['SuperSecret'], 'kSecValueRef')
	// def setUp(self):
	//;

	test_simple0() {
		init('{a:1}');
		let val = hash_map();
		assert_equals(val, {'a': 1});
	}

	test_simple() {
		assert_equals(parse(`{a:1}`), {'a': 1});
	}

	test_invariance() {
		assert_result_is(`{a:"b"}`, {'a': 'b'});
	}

	test_invariance1() {
		assert_equals(parse(`{a{b:"b",c:"c"}}`), {'a': {'b': 'b', 'c': 'c'},});
	}

	test_invariance2() {
		assert_equals(parse(`{a:{b:"b" c:"c"}}`), {'a': {'b': 'b', 'c': 'c',},});

	}

	test_invariance3() {
		assert_equals(parse(`{a:{b:"b" c:"c"}}`), {'a': {'b': 'b', 'c': 'c',},});

	}

	test_invariance4() {
		assert_equals(parse(`a to {b to "b" c to "c"}`), {'a': {'b': 'b', 'c': 'c',},});
	}

	test_invariance5() {
		assert_equals(parse(`{a{b:"b";c:"c"}}`), {'a': {'b': 'b', 'c': 'c',},});
		assert_equals(parse(`{a:{b:"b";c:"c"}}`), {'a': {'b': 'b', 'c': 'c',},});
	}

	test_simple_ruby() {
		skip();
		assert_equals(parse(`{:a => "b"}`), {'a': 'b',});
	}

	test_invariance_ruby_style() {
		skip();
		assert_equals(parse(`{:a => {b:"b";c:"c"}}`), {'a': {'b': 'b', 'c': 'c',},});
	}

	test_immediate_hash() {
		assert_equals(parse(`a{b:"b",c:"c"}`), {'a': {'b': 'b', 'c': 'c',},});
	}

	test_immediate_hash2() {
		// skip('test_immediate_hash NO, because of blocks!')
		assert_equals(parse(`a:{b:"b",c:"c"}`), {'a': {'b': 'b', 'c': 'c',},});
	}

	test_hash_index() {
		let x = {'a': {'b': 'b', 'c': 'c'}};
		// x=parse('x=a:{b:"b",c:"c"}')
		the.variables['x'] = x;
		assert_equals(x, {'a': {'b': 'b', 'c': 'c'}});
	}

	test_hash_index1() {
		// clear()
		// parse("x={a:3}")
		parse(`x={'a':3}`);
		assert_equals(the.variables['x'], {'a': 3});
		assert_equals(parse(`x['a']`), 3);
	}

	test_hash_map() {
		skip() // nice future:
		parse(`x maps a to 3, b to 5`);
		assert_equals(parse(`a of x`), 3);
		assert_equals(parse(`x['a']`), 3);
		assert_equals(parse(`x.a`), 3);
		// assert_equals(parse(`x[a]`), 3);
	}

	test_json_data() {
		init('{a{b:"b";c:"c"}}');
		hash_map();

	}
}

register(HashTest, module)
// module.exports.test=new HashTest().test_invariance5
// try{
// 	new HashTest().test_invariance4b()
// }catch(ex){
// 	trimStack(ex,2)
// console.error(ex)
// }
// module.exports.test=new HashTest().test_invariance4b
