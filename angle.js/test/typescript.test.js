// @ts-check
/*
TypeScript 2.3 and later support type-checking and reporting errors in .js files with --checkJs.

You can skip checking some files by adding
// @ts-nocheck comment to them; conversely, you can choose to check only a few .js files by adding a
// @ts-check comment to them without setting --checkJs. You can also ignore errors on specific lines by adding
// @ts-ignore on the preceding line.
 */

// https://github.com/Microsoft/TypeScript/wiki/Type-Checking-JavaScript-Files
/**
 * Foo
 * @param {String} a
 * @param {Number} b
 * @returns {Number} jsdoc doesnt work with flow WTF
 */
function foo(a, b) {
	// function body...
}

foo(1, "b");

/** @type {number} */
var x;

x = 0;      // OK
x = false;  // Error: boolean is not assignable to number
