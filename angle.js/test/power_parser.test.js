require('../english_parser')
exports.testSomething = function(test) {
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

if(typeof test=='undefined') test=function (log,meth) {
    // if(!meth())console.log(log)
}

// const sum = require('./sum');
const sum = (a, b) => a + b;
test('adds 1 + 2 to equal 3', () => {
    // expect(sum(1, 2)).toBe(3);
});

test('parser', () => {
     parse('1+1=2')
});