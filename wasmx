#!/usr/bin/env node
// /me/dev/script/shell/wasmx
// export NODE_PATH=/usr/lib/node_modules
module.paths.push("/usr/lib/node_modules/"); // WHY??
let {TextEncoder, TextDecoder} = require('text-encoding')
exec = x => require('child_process').execSync(x).toString()

// test="/me/dev/script/wasm/wasp/wasp.wast"
// test="/me/dev/script/kotlin/a.out.wasm"
// test="/me/dev/script/kotlin/test.wasm"
// test="/me/dev/script/wasm/test.wasm"
test = "/me/dev/script/wasm/mark/mark.wasm"

file = arg = process.argv[2] || test
func = process.argv[3] || "main"
if (!file.match(/\./)) file = file + ".wasm"
if (file.match("wasmx")) file = test
if (file.match(".wat")) {
	cmd = "/opt/wasm/wabt/bin/wat2wasm --debug-names " + file
	file = file.replace(".wat", ".wasm")
	require('child_process').execSync(cmd + " -o " + file)
}
if (file.match(".wast")) {
	cmd = "wasm-as " + file
	file = file.replace(".wast", ".wasm")
	require('child_process').execSync(cmd + " -o " + file)
}
console.log(file)
pure = file.replace(".wasm", "")
backtrace = function (print = 1) {
	try {
		throw new Error()
	} catch (ex) {
		if (print) console.error(trimStack(ex, 1)); else return trimStack(ex)
	}
}
todo = x => console.log("TODO ", x)
demangle = function (line) {
	// return line
	if (!line.match("at ")) return line
	// name=line.match(/at ([a-zA-Z0-9.]*)/)[1]
	var [at, name, fun] = line.trim().split(' ')
	if (!name) return line
	if (name[0] !== '_') return line
	console.log("c++filt >>>>>>>>>>>>>>>>>>", name);
	console.log(exec("c++filt " + name))
	type = name.match(/E(.*)/)
	type = type || name.match(/PK(.*)/)
	type = type ? type[1] || "" : ""
	name = name.replace(/plE/g, 'E')// constructor
	name = name.replace(/E.*?$/g, '')
	name = name.replace(/PK.*?$/g, '')
	name = name.replace(/_Z\d/, '')
	name = name.replace(/v$/, '')
	name = name.replace(/_ZN\d/, '')
	name = name.replace(/\d/g, '.')
	name = name.replace("_", "")
	// if(!type)
	// return "	at "+name
	type = type.replace("v", "")
	type = type.replace("PK", "*")
	type = type.replace("i", "int,")
	type = type.replace("f", "float,")
	type = type.replace("c", "char,")
	type = type.replace("S_", 'string')
	type = type.replace(/,$/, '')
	return file.replace(".wasm", " ") + name + "(" + type + ")"
}

trimStack = function (ex, more = 0) {
	let keep = true
	let stack = ex.stack ? ex.stack.split("\n") : (ex.message || "").split("\n")
	let caller = trimStack.caller.name;
	ex.stack = stack.filter(x => {
		if (caller && x.match(caller)) return 0
		if (caller && x.match("trace")) return 0
		if (x.match("Object.<anonymous>")) keep = false
		if (x.match("Module._compile")) keep = false
		if (x.match("modulus.exports")) keep = false// todo
		if (!keep && x.match("at ")) more--
		return keep || more > 0
	}).map(demangle).join("\nin ")//.replace(/at _/g,"at ")
	return ex
}


// console.log(file)
// console.log()

// memory = new WebAssembly.Memory({initial: 16384, maximum: 65536});
// table = new WebAssembly.Table({initial: 256 * 4, element: "anyfunc"});

memory = new WebAssembly.Memory({initial: 256, maximum: 256});
table = new WebAssembly.Table({initial: 662, maximum: 662, element: "anyfunc"});

nop = x => 0
log = x => console.log(x)

function new_string(str) {
	s = STACK
	// buffer=Buffer.from(memory.buffer)
	buffer = new Uint8Array(memory.buffer, 0, memory.length);
	for (c of str) {
		buffer[STACK++] = c
	}
	return s
}

const utf8_encoder = new TextDecoder('utf8');
const utf16encoder = new TextDecoder('utf-16le');
const utf8_decoder = new TextDecoder('utf8');
const utf16denoder = new TextDecoder('utf-16le');

string = function (pointer, length = -1, format = 'utf8') {
	if (length <= 0) { // auto length
		while (buffer[pointer + ++length]) ;
		if (format != 'utf8') while (buf[pointer + ++length] || buf[pointer + length + 1]) ;
	}
	if (typeof(TextDecoder) != 'undefined') {// WEB, text-encoding, Node 11
		let decoder = format == 'utf8' ? utf8_decoder : utf16denoder
		let arr = new Uint8Array(buffer.subarray(pointer, pointer + length));
		return decoder.decode(arr)
	} else { // fallback
		buf = Buffer.from(memory.buffer) // node only!
		buf = buf.slice(pointer, pointer + length)
		s = buf.toString(format)// utf8 or 'utf16le'
		return s
	}
}


string2 = (offset, length = -1) => {
	var str = '';
	for (var i = offset; (buffer[i] || buffer[i + 1] || length-- > 0) && i < buffer.length; i++)
		str += String.fromCharCode(buffer[i]);
	return str
}

log16 = function (pointer) {
	console.log(string(pointer, -1, 'utf16le'))
}


str = function (x, len = -1) {
	buf = Buffer.from(memory.buffer)
	if (len <= 0) while (buf[x + ++len]) ;
	return buf.slice(x, x + len).toString('utf16le')
	// return buf.slice(x,x+len).toString('utf8')
}
arry = (offset) => {
	var arr = [];
	for (var i = offset; buffer[i] && i < buffer.length; i++)
		arr.push(buffer[i])
	return arr
}
parse = (x, type) => {
	if (!type) return x // raw value: int/bool/null
	switch (type % 16) {
		case 0:
			return x
		case 1:
			return x
		case 3:
			return x // float double
		case 4:
			return parsePson(x)
		case 5:
			return json5(string(x))
		case 9:
			return string(x)
		default:
			console.log(hex(type))
			console.log(hex(x))
			break
	}
}


// missing_dependency = x => console.log("missing_dependency " + x)
truenames = {}
missing_dependency = (module, fun) => function (x, y, z, a) {
	true_name = truenames[fun]
	if (!true_name) {
		true_name = exec('c++filt ' + fun)
		truenames[fun] = true_name
	}
	console.log("missing dependency " + module + "." + fun + "(", x || '' + y || '' + z || '' + a || '', ") : ", true_name)
}

function load_wasm_dependencies(_wasm, imports) {
	try {
		parser = require('@webassemblyjs/wasm-parser') // pure JavaScript the others are compiled c ++
		prog = parser.decode(_wasm);
		prog.body[0].metadata
		fields = prog.body[0].fields
		dependencies = fields.filter(it => it.type == 'ModuleImport')
		for (dep of dependencies) {
			modul = dep.module
			fun = dep.name
			// console.log(dep)
			// console.log("dependency "+modul+" . "+fun)
			if (!imports[modul]) imports[modul] = {}
			if (!imports[modul][fun] && 0 !== imports[modul][fun]) {
				console.log("missing dependency " + modul + " . " + fun)
				imports[modul][fun] = imports['env'][fun] || missing_dependency(modul, fun) || nop
			}
		}
	} catch (x) {
		console.log(x.message)
	}
}


printBacktrace = x => console.error(backtrace())
_hex = hex = x => x >= 0 ? x.toString(16) : (0xFFFFFFFF + x + 1).toString(16) // '0x' + not for xdotool
_logp = logp = (p, type) => console.log(parse(p, type))
_logc = logc = x => process.stdout.write(x > 0 ? String.fromCodePoint(x) : x ? "⛋" : "\n"),
	_logs = logs = (x, len) => console.log(string(x, len))
_logx = logx = x => console.log(hex(x))
_logi = logi = x => console.log(x)
_log = log
dummy = log


kotlin_imports = {
	nullFunc_X: nop,
	nullFunc_ii: nop,// kotlin
	nullFunc_iiii: nop,// kotlin
	nullFunc_vi: nop,// kotlin
	nullFunc_viiii: nop,// kotlin
	nullFunc_viiiii: nop,// kotlin
	nullFunc_viiiiii: nop,// kotlin
	Konan_abort: dummy,
	Konan_heap_grow: dummy,
	Konan_heap_lower: dummy,
	Konan_heap_upper: dummy,
	Konan_js_allocateArena: dummy,
	Konan_date_now: Date.now,
	Konan_js_arg_size: dummy,
	Konan_js_fetch_arg: dummy,
	write: dummy,// kotlin
	___lock: dummy,
	___unlock: dummy,
	_abort: dummy,
	___setErrNo: dummy,
	_emscripten_memcpy_big: dummy,// kotlin
	___syscall140: dummy,
	___syscall146: dummy,
	___syscall54: dummy,
	___syscall6: dummy,// kotlin
	enlargeMemory: log,
	getTotalMemory: log,
	abortOnCannotGrowMemory: log,// kotlin
}

const writeStr = (ptr, str) => {
	// buffer = new Uint32Array(memory.buffer);
	buffer = new Uint8Array(memory.buffer);
	for (let i = 0; i < str.length; ++i) {
		buffer[ptr + i] = str.codePointAt(i);
	}
}

function Utf8ArrayToStr(array) {
	var out, i, len, c, char2, char3;
	out = "";
	len = array.length;
	i = 0;
	while (i < len) {
		c = array[i++];
		switch (c >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				out += String.fromCharCode(c); // 0xxxxxxx
				break;
			case 12:
			case 13: // 110x xxxx   10xx xxxx
				char2 = array[i++];
				out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
				break;
			case 14: // 1110 xxxx  10xx xxxx  10xx xxxx
				char2 = array[i++];
				char3 = array[i++];
				out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
				break;
		}
	}
	return out;
}

const readStr = (ptr, len) => {
	let str = "";
	for (let i = 0; i < len; ++i) {
		str += String.fromCodePoint(memory[ptr + i]);
	}
	return str;
}

function debug(what, stack = true) {
	return function (a, b, c, x, y, z) {
		inspect(what, a, b, c, x, y, z)
		if (stack) printBacktrace()
	}

}

function inspect(a, b, c, x, y, z) {
	let whom = arguments.callee.caller.name || inspect.caller.name
	console.log("inspect ", whom, a, b, c, x, y, z);
}

print = (val) => process.stdout.write(string(val));// no \n newline
printf = (format, val) => process.stdout.write(string(format).replace("%s", string(val)).replace("%i", val))

raise = x => {
	throw new Error(string(x))
}
memset = function (ptr, value, num) {
	console.log('todo("memset")', ptr, value, num)
}
malloc = function (amount) {
	todo("malloc " + amount)
	STACK += amount;
	imports.env.memoryBase += amount // ?
}

imports = {
	global: {NaN: 0, Infinity, Math},
	js:{print_ln:log,perf_counter:nop},// wasmfun
	env: {
		memory,
		table,
		memoryBase: 256 * 8 * 8, // todo
		tableBase: 0, // how to set generically for emcc compiled stuff?
		DYNAMICTOP_PTR: 0,
		STACKTOP: 0,
		tempDoublePtr: 0,
		abortStackOverflow: raise,
		// ^^ emcc


		// _raise:x=>{throw new Error(string(x))},
		// print_ln:logs,
		_log, _logx, _logc, _logs, _logp, _logi, log16, //emcc
		log, logc, logs, logx, logi: log, puts: logs, printf, print, putchar: logc, puts: logs, println: printf,
		backtrace: debug("backtrace"),
		raise,
		fetch: url => new_string(fetch(url)),
		// ^^ mine

		memset,//debug("memset",false),
		// _Znam: malloc, // operator new[](unsigned long)
		// _Znaj: malloc, // operator new[](unsigned int)
		// _Znwj: malloc, // operator new(unsigned int)
		// _Znwm: malloc, // operator new(unsigned long) //  c++filt
		__cxa_throw: debug("__cxa_throw"),
		__cxa_allocate_exception: debug("__cxa_allocate_exception"),
		// _Z6printfPKci: logs,// WHY? printf(char const*, int)
//  ^^ gcc

		// _printf:printf,
		// ABORT: 2,
		// STACKTOP,
		// STACK_MAX:100000,
		// test: x=>42,
		// inspect,
		// _backtrace:printBacktrace,
		// __linear_memory:memory,// why?
		// __indirect_function_table:table,
		// __cxa_guard_acquire:nop,// static ref &a
		// __cxa_guard_release:nop,// static ref &a
		// abort:nop,
// ^^ other

		// g$_xxx:x=>{console.log("JAAA"+x); return 0x34;},
		//  	get: function(obj, prop) {
		//     if (prop.startsWith('g$')) {// a global. the g$ function returns the global address.
		//      var name = prop.substr(2); // without g$ prefix
		//      console.log("GGG"+prop)
		//      return 444
		//    }
		// },
		// ^^ without -no-stdlib option!
	},
	console: {log, logx, logc, logs, logp, logi, log16, raise},
}
Object.assign(imports.env, kotlin_imports)
imports[pure] = imports // stupid AssemblyScript wrapping module in file_name

is_string = isString = (s) => s && s.constructor == String

new_string = (s) => {
	if (!s) return -1 //0 // 0 = 0 MAKE SURE!
	current = STACK
	var uint8array = new TextEncoder("utf-8").encode(s);
	// buf = new Uint8Array(buffer, current , s.length);
	buffer.set(uint8array, current);
	STACK += uint8array.length + 1
	return current
}

function wasmx(file) {
	try {
		let binary = file
		if (isString(file)) binary = require('fs').readFileSync(file);

		load_wasm_dependencies(binary, imports)

		args = process.argv.slice(func != "main" ? 4 : 3, process.argv.length)

		module = new WebAssembly.Module(binary)
		instance = new WebAssembly.Instance(module, imports)
		exports = instance.exports
		memory = exports.memory || exports._memory || memory
		buffer = new Uint8Array(memory.buffer, 0, memory.length);
		HEAP = exports.__heap_base // ~68000
		DATA_END = exports.__data_end // ~1100
		STACK = HEAP || DATA_END
		imports.env.memoryBase = DATA_END // too late
		i = 0
		while (i < DATA_END && !buffer[i++]&&i<2**32) ;
		console.log("FIRST DATA ", i, " DATA_END ", DATA_END, " HEAP ", HEAP)
		console.log("first data:")
		logs(i, 100)
		// for (let k of keys(instance.exports.globals))
		// 	console.log(k,instance.globals[k])

		// writeStr(0,"HOHOäß∂𐋣HOH")
		args = {argc: process.argv.length, argv: process.argv, arg: {test: "abc123𐋣OK"}}
		arg = new_string(JSON.stringify(args))
		// arg=0;
		// console.log(exports)
		for (ex of Object.keys(exports)) {
			plain = ex.replace(/^_*/, '')
			// if(!exports[plain]) instance.exports[plain]=exports[ex] DOESNT WORK WY
			// if (!ex.match("__"))
			console.log(ex)//.replace(/^_/,''))
		}
		// arg=parseInt(args[0])
		let main = exports.main || exports._main/*cpp*/ || exports.run/*go*/ || exports[func]
		/* bash arg */
		main = main || exports.___emscripten_environ_constructor || exports.Konan_main
		if (main) result = main(arg) // process.argc,args) doesnt work that way:(
		else result = "NO MAIN! Entry function main not found."
		console.log(">>>", result)

		HEAP = exports.__heap_base
		DATA_END = exports.__data_end
		STACK = HEAP || DATA_END
		i = 0
		while (i < DATA_END && !buffer[i++] && i<2**32) ;
		console.log("FIRST DATA ", i, " DATA_END ", DATA_END, " HEAP ", HEAP)

		return result
	} catch (ex) {
		console.error(trimStack(ex));
	}
}

if (file) wasmx(file) // else used as library
else console.log("wasmx used as library")
module.exports = {wasmx}


