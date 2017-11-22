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
	no_ok() {
		assert_result_is("'a' 'b'",'ab')
		assert_result_is("'⦠'", '⦠')//filtered ok
	}
}
register(BasicsTest,module)
