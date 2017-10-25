require('./angle_base_test');

class CommentTest extends ParserBaseTest{

	test_python_comment(){
        result_be(`1 # 3`, 1);
    }
    test_java_comment(){
        this.result_be(`1 // 3`, 1);
    }
    test_java_block_comment(){
        this.result_be(`1 /*3*/ +3`, 4);
    }
    test_bad_comment(){
        this.skip();
        this.result_be(`1\n--no comment`, 1);

    }
}

exports.test_parser=test=>{
	// parse(`1+2=3`)
	test.ok(true, "this assertion should pass");
	test.done();
}

register(CommentTest,module)
