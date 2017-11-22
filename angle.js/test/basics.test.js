let {register,assert_has_error,assert_result_is}=require('./angle_base_test');

class BasicsTest extends (ParserBaseTest) {

	test_now(){

		assert_result_is("x=1+2*3",7)
		assert_result_is("x=1+2*3;x",7)
		assert_result_is("x=1+2*3;x*2",14)
		assert_result_is("x=1+2*3;2+x*2+1",17)
		console.log("ALL OK")
	}
	test_ok() {
		assert_result_is("i=3;i", 3)
		assert_result_is("1+1", 2)
		assert_result_is("2*2", 4)
		assert_result_is("2-2", 0)
		assert_result_is("9/3", 3)
		assert_result_is("9.0/3.0", 3)
		assert_result_is("1", 1)
		assert_result_is("ok", true)
		assert_result_is("int i=3.2", 3)
		assert_result_is("yes",1)
		assert_result_is("False",0)
		assert_result_is("'a'",'a')
		assert_result_is("`a`",'a')
		assert_result_is("\"a\"",'a')
		assert_result_is("'a'+'b'",'ab')
		assert_result_is("1+2*3",7)
	}
	test_logic(){
		assert_result_is("0 and 0",0)
		assert_result_is("1 and 0",0)
		assert_result_is("0 and 1",0)
		assert_result_is("1 and 1",1)
		assert_result_is("0 or 0",0)
		assert_result_is("1 or 0",1)
		assert_result_is("0 or 1",1)
		assert_result_is("1 or 1",1)
		assert_result_is("0 xor 0",0)
		assert_result_is("1 xor 0",1)
		assert_result_is("0 xor 1",1)
		assert_result_is("1 xor 1",0)
	}

	test_logic2(){
		assert_result_is("false and false",false)
		assert_result_is("true and false",false)
		assert_result_is("false and true",false)
		assert_result_is("true and true",true)
		assert_result_is("false or false",false)
		assert_result_is("true or false",true)
		assert_result_is("false or true",true)
		assert_result_is("true or true",true)
		assert_result_is("false xor false",false)
		assert_result_is("true xor false",true)
		assert_result_is("false xor true",true)
		assert_result_is("true xor true",false)
	}

	no_ok() {
		assert_result_is("'a' 'b'",'ab')
		assert_result_is("'⦠'", '⦠')//filtered ok
	}
}
register(BasicsTest,module)
// module.exports.test=		x=>assert_result_is("1 xor 1",0)
// module.exports.test=		x=>assert_result_is("false and true",false)
