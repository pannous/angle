require('./angle_base_test');

class BashTest extends (ParserBaseTest) {

	test_ls(){
		g = parse(`ls | row 4`);
		f = parse(`ls | item 4`);
		assert_equals(g, f);
		assert_contains(f, '.');
	}
	test_ls_type(){
		x = parse(`bash 'ls -al' | column 1`);
		assert_equals(type(x),xlist);
	}
	test_pipe(){
		x = parse(`bash 'ls -al' | column 1| row 2`);
		if (!x) assert_contains(x, 'number');
	}
	// def test_pipe2(self):
	//     parse("def column n:n;bash 'ls -al' | column 1| row 2")
}
new BashTest()