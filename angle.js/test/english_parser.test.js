"use strict";
require('../english_parser')
exports.testSomething = test=> {
    // console.log(test)
    // { done, ok, same, equals, expect: , _assertion_list: [], AssertionError, fail, equal, notEqual, deepEqual, notDeepEqual, strictEqual, notStrictEqual, throws, doesNotThrow, ifError: [Function] }
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

// test=(log,meth)=> {
    // if(!meth())console.log(log)
// }

// test('parser', () => {
//  parse(`1+2=3`)
// });

exports.test_parser=test=>{
    // parse(`1+2=3`)
    test.ok(true, "this assertion should pass");
    test.done();
}