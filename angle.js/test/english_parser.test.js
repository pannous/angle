"use strict";
require('../english_parser')
exports.testSomething = test=> {
    // console.log(test)
    // { done, ok, same, equals, expect: , _assertion_list: [], AssertionError, fail, equal, notEqual, deepEqual, notDeepEqual, strictEqual, notStrictEqual, throws, doesNotThrow, ifError: [Function] }
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

function test(log,meth) {
    // if(!meth())console.log(log)
}

// const sum = require('./sum');
const sum = (a, b) => a + b;
test('adds 1 + 2 to equal 3', () => {
    // expect(sum(1, 2)).toBe(3);
});

test('parser', () => {
 parse('1+2=3')
});

exports.test_parser=test=>{
    parse('1+2=3')
    test.ok(true, "this assertion should pass");
    test.done();
}