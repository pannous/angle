require('./angle_base_test');

class BashTest extends (ParserBaseTest) {

	test_ls(){
		let g = parse(`ls | row 4`);
		assert_contains(g, '.');
		let f = parse(`ls | item 4`);
		assert_equals(g, f);
		assert_contains(f, '.');
	}
	test_ls_type(){
		let x = parse(`bash 'ls -al' | column 1`);
		assert_equals(type(x),Array);
	}
	// don't go down the Rabbit Hole of trying to format strings from bash !
	test_pipe(){
		let x = parse(`bash 'ls -al' | column 1| row 2`);
		if (!x) assert_contains(x, 'number');
	}
	// def test_pipe2(self):
	//     parse("def column n:n;bash 'ls -al' | column 1| row 2")
}
// register(new BashTest(), module)
// module.exports.test_current=new BashTest().test_ls
module.exports.test_current=new BashTest().test_ls_type
// module.exports.test_current=new BashTest().test_pipe
