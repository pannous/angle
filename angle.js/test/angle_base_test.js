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

	skip(msg) {
		msg = msg || "SKIPPING " + (skip.callee || '')
		throw new SkipException(msg);
		// throw msg// new SkipException(msg);
	}

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

skip = (msg) => {
	msg = msg || "SKIPPING " + (skip.callee||'')
	throw new SkipException(msg);
	// throw msg// new SkipException(msg);
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


function callerFile() {
		var err = new Error();
		var callerfile;
		var currentfile;
		Error.prepareStackTrace = function (err, stack) { return stack; };
		currentfile = err.stack.shift().getFileName();
		while (err.stack.length) {
			let line = err.stack.shift();
			callerfile = line.getFileName();
			// if(line.match("unit"))continue
			if(currentfile !== callerfile) return line;
		}
}
var callsite= require('callsite');
registered = {}
// module.exports.register =
registerTest = function (instance,test, modulus) {
	console.log("++++++++++++++++++++++++++++++")
	console.log(test)
	modulus.exports[test] = function(ok) {
		try {
			clear();
			console.log(`   at ${test} ${file}`)
			// throw new Error("WHAAT?")
			instance[test](ok);
			ok.done()
			console.log("OK")
		} catch (exc) {

			if (exc instanceof SkipException)
				return console.log(exc.message + " " + test) || ok.done(exc)

			console.error(exc.message)
			let keep=1
			exc.stack.forEach(function(site){
				// if (site.match("anonymous")) keep = false
					let functionName = site.getFunctionName();
				if(!functionName) keep=false;
				if(keep) console.error('  at \033[36m%s\033[90m (%s:%d)\033[0m', functionName, site.getFileName(), site.getLineNumber());
			});
			console.error(trimStack(exc))
			// exc= trimStack(exc)
			ok.done(exc)
			// 	// console.log(trimStack(ex));
			// 		throw exc
		}
	}
}
register = function (instance, modul) {
	if (instance instanceof Function) {
		clazz = instance
		instance = new clazz() //.constructor()
	}
	// if(registered[instance+""]) return
	// registered[instance+""]=1
	file=callerFile()
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
			registerTest(instance,test,modulus)
		} catch (ex) {
			console.log("CAUGHT")
			console.error("WHERE???")
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
module.exports = {assert_has_error,register, assert_that,assert_result_is, parser, init: parser.init,clear:parser.clear}
