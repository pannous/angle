"use strict";
require('../english_parser')
exports.testSomething = function(test) {
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

// const sum = require('./sum');
const sum = (a, b) => a + b;
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

test('parser', () => {

});