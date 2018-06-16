let {parser,assert_result_is}=require('./angle_base_test')
// require('/me/dev/js/extensions.js')()
require('../extensions.js')()
// require('extensions')()


class ExtensionsTest extends (ParserBaseTest) {
	setUp() {
	}

	test_dump(){
		let data=[{hi:5,name:'jo'},{hi:3,name:'ann'}]
		save(data,'test.bin')
		let data2=load('test.bin')
		assert_equals(data,data2)
	}

	test_csv(){
		let data=[{hi:5,name:'jo'},{hi:3,name:'ann'}]
		save_csv(data,'test.csv')
		let data2=csv_to_map(load_csv('test.csv'))
		assert_equals(data,data2)
	}
}

current = new ExtensionsTest().test_dump
// test_csv

module.exports.test_current = ok => {
	current && current();
	ok.done()
}

// register(ExtensionsTest, module) // ALL tests
