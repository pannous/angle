// require('./angle_base_test') // include in test files
// parser=
// let {parse}=
let {setVerbose,clear} = require('../angle_parser')
let parser = require('../angle_parser')
// console.log(parser) // setVerbose,
// parser.dont_interpret=()=>dont_interpret() // why??
// parser.clear=()=>clear() // why??
setVerbose(1)
ParserBaseTest = class ParserBaseTest {
	result_be(a, b) {
		// console.log("this.result_be OK")
	}

	// skip(){}
	setUp() {
		context.testing = true;
		// 	context.use_tree=False
		parser.clear();
	}

	constructor() {
		// register(this)
	}
}

class SkipException extends Error {
}

class TestError extends Error {
}

skip = (msg = "") => {
	throw msg// new SkipException(msg);
}
assert_result_emitted = (prog, val) => {
	let result = parse(prog);
	assert(result == val)
	console.log(prog)
	console.log(val)
}
assert_has_no_error = (prog) => {
	x = parse(prog)
	console.log(x)
}

// module.exports.assert_has_error =
function assert_has_error(prog, type = "") {
	try {
		parse(prog)
	} catch (ex) {
		console.log(prog)
		console.log("OK, exception raised: " + (ex.message || ex.name))
		prog.done()
		return
	}
	throw new TestError("should have raised [" + type.name + "]: " + the.current_line)
}


function assert_that(test, message) {
	var ok=0
	let {condition}= require('../expressions')
	try{
		// ok=condition(test).result
		ok=parse(test).result
	}catch(ex){
		console.error(trimStack(ex,2))
	}
	if (!ok) {
		message = "Assertion failed: " + (message || readCallerLine());
		throw trimStack(new Error(message),3);
	}
	else return true
}

// function assert_equals(result,val) {
// 	assert(result == val, prog + " == " + val)
// 	console.log(prog + " ==== " + val + "   ... OK!")
// }

// module.exports.assert_result_is =
function assert_result_is(prog, val) {
	let result = parse(prog).result
	let condition = result == val || json(result)==json(val)
	assert(condition, prog + " == " + pretty(val)+", got "+pretty(result))
	console.log(prog + " ==== " + val + "   ... OK!")
}

result_be = function (a, b) {
	console.log("this.result_be OK!!!")
}
// ParserBaseTest=ParserBaseTest
// export default ParserBaseTest
// module.exports={ParserBaseTest:ParserBaseTest}

registered = {}
// module.exports.register =
register = function (instance, modul) {
	if (instance instanceof Function) {
		clazz = instance
		instance = new clazz() //.constructor()
	}
	// if(registered[instance+""]) return
	// registered[instance+""]=1
	console.log("\n------------------------------")
	console.log(instance)
	console.log("------------------------------\n")
	clazz = Object.getPrototypeOf(instance)
	modulus = modul || arguments[2].children[0] || arguments[2].parent
	for (let test of Object.getOwnPropertyNames(clazz)) {
		try {
			if (!test.match(/test/)) continue
			if (test.match(/^_test/)) continue
			if (test.match(/^ignore_/)) continue
			if (test.match(/^skip_/)) continue
			if (test.match(/^no_/i)) continue
			if (test.match(/^dont/i)) continue
			console.log("++++++++++++++++++++++++++++++")
			console.log(test)
			modulus.exports[test] = ok => {
				try {
					clear();
					instance[test](ok);
					ok.done()
				} catch (ex) {
					console.log("" + instance[test] + " THREW")
					trimStack(ex)
					if (ex instanceof SkipException)
						console.log("SKIPPING:") && console.log(clazz)
					ok.done(ex)
				}
			}
		} catch (ex) {
			trimStack(ex)
			console.error(ex)
		}
	}
}

function register_tests() {
	for (mod of module.parent.children.slice(5)) {
		if (mod.exports.length > 0)
			console.log(mod.exports)
	}
}

setTimeout(() => register_tests(), 100)
module.exports = {assert_has_error,register, assert_that, assert_result_is, parser, init: parser.init,clear:parser.clear}
