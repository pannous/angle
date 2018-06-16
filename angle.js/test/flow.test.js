// @flow
// language=Flow JS

function tee(b /*:number*/) {
	return b+b
}
console.log(tee(1));
// console.log(tee("hi"));
let {emit}=require("../walt/emitter")
emit("OK")

// import test from "ava";
// import opcode, { opcodeMap, textMap } from "../opcode";

// test("opcode is a list of opcodes", t => t.is(1+1,2));

/**
 * Foo
 * @param {String} a
 * @param {Number} b
 * @returns {Number} jsdoc doesnt work with flow WTF
 */
/* not : (x: string, y: number): boolean */
//https://github.com/facebook/flow/issues/358
function foo(a, b) {
	// function body...
}
foo(1, "b");
