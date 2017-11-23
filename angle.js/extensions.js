/*
require('/me/dev/js/extensions.js')()
ln /me/dev/script/javascript/extensions.js 
require('./extensions.js')()
// loadScript("http://pannous.net/extensions.js");

*/
// "use strict"
// <script src="extensions.js" type="text/javascript" charset="utf-8"></script>
function extension(url = 'http://pannous.net/extensions.js') {
	const script = document.createElement('script');
	script.src = url;
	document.head.appendChild(script);
}; //extension()
extensions_version = "1.2.6"
print = x => process.stdout.write(x) // supports \r
// print=process.stdout.write // supports \r
const util = require('util') // NODE.JS extensions 

array_empty = a => !+a // YAY
object_empty = x => !+Object.keys(x)
falsey = x => !x || !Object.keys(x).length
truthy = x => !(!x || typeof x == 'object' && !Object.keys(x).length)
empty = falsy = falsey
not_empty = truthy
Int = Integer = Float = Real = Number

// If we wrap our code, we can use await expressions anywhere in our codebase.
// (async () => {await (2 + 3)})()
try {
	JSON5 = require('json5'); // !!! http://json5.org/
	json = JSON5.parse
	stringify = serialize = serial = JSON5.stringify
} catch (x) {
	json = JSON.parse
	stringify = serialize = serial = JSON.stringify
}

json = (x) => {
	if (is_string(x)) return json5(x)// JSON.parse
	else return JSON.stringify(x)
}

log_levels = {
	"ERROR": "ERROR",
	"WARN": "WARN",
	"INFO": "INFO",
	"TRACE": "TRACE"
}
let log_level = log_levels.INFO

function trace(x) {
	if (log_level == log_levels.TRACE)
		console.log(x)
}

π = pi = Math.pi = Math.PI
ı = true
ƒ = false
ø = []
ℕ = function* () {
	let i = 1;
	while (ı) {
		yield i;
		i += 1
	}
}
// ∞ error
ထ = Infinity //max_number=Number.MAX_VALUE
တ = max_int = Number.MAX_SAFE_INTEGER // 1/တ 1.11e-16
ε = epsilon = Number.MIN_VALUE // BAD, practically zero! 5e-324 < 1/max_number = 5e-309 ! 


defined = (x) => typeof x !== "undefined"

// rsync --update -auz extensions.js pannous.net:/public/
// document.head.innerHTML+="<script src='http://pannous.net/extensions.js'></script>";
// all_extensions=require('/me/dev/script/javascript/extensions.js')
// all_extensions()

// import('/me/dev/script/javascript/extensions.js')
// .load /me/dev/script/javascript/extensions.js
// delete require.cache['/me/dev/script/javascript/extensions.js'] // DOESNT! 

// import will be supported in v8+6 / node.js 7
// document.head.innerHTML+="<script src='http://pannous.net/extensions.js'></script>";
function error(x) {
	console.error(x);
}

cl = x => console.log(x)


function shuffle(a) {
	let j, x, i;
	for (let i = a.length; i; i -= 1) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
	return a;
}

fullscreen = x => document.getElementsByTagName('html')[0].mozRequestFullScreen()
ignore = nop = pass = () => {
}
p = puts = log = echo = console.log

hex = x => x.toString(16) // '0x' + not for xdotool

dir = function (x) {
	if (!x) return []
	return Object.getOwnPropertyNames(x)
}
// dir=xs=>{for(key in xs){if (!xs.hasOwnProperty(key))continue;console.log(key+":"+xs[key])}}
all = (xs) => {
	for (let key in xs) console.log(key + ":" + xs[key])
}
// map=(f,xs)=>xs.map(f)
map = (f, xs) => {
	if (xs instanceof Array) return xs.map(f)
	for (let key in xs) {
		if (xs.hasOwnProperty(key)) xs[key] = f(xs[key])
	}
}
do_map = (f, xs) => {
	for (let key in xs) {
		if (xs.hasOwnProperty(key)) xs[key] = f(xs[key])
	}
}
is_file = isfile = exists = (path) => {
	try {
		return fs.existsSync(path)
	} catch (x) {
		return 0
	}
}


keys = function (x) {
	if (!x) return []
	return Object.keys(x)
}
len = function (x) {
	if (!x) return -1
	if(!x.length)return keys(x).length
	console.log("use .length");
	return x.length
}
length = function (x) {
	console.log("use .length");
	return x.length
}
rand = random = function (x) {
	return x ? int(Math.random() * x) : Math.random()
}
randi = randint = function (x) {
	return x ? int(random(x)) : int(random(Number.MAX_SAFE_INTEGER))
}
hasChars = x => len(x.replace(/[^a-zA-Z]/g, "")) > 0
isNumber = n => !isNaN(parseFloat(n)) && isFinite(n); // parseInt() "SHOULD NOT BE USED".
toNumber = s => +s // !! +"34" === 34    +new Date()===millis!
nil = null

// puts=function(x){console.log(x);return x};
// puts=function(x){console.log("NOO"+x);return "OK"};
puts_hack = function (x) {
	alert("NOO" + x);
	return "OK"
};
int = x => parseInt(x)
float = x => parseFloat(x) //x.replace(",", "."))
a_to_s = xs => console.log("[" + xs.join(",") + "]")
// Uint8Array.prototype.to_s= xs => console.log("["+xs.join(",")+"]")
str = x => x.toString()
asc = x => x.charCodeAt(0) // asc('A')=65
ord = x => x.charCodeAt(0) // ord('A')=65
chr = char = x => String.fromCodePoint(x) // chr(65)='A' char DONT USE fromCharCode (only for ascii)!
ascii = x => String.fromCodePoint(x) // chr(65)='A' char nee
unicode = x => String.fromCodePoint(x) // chr(65)='A' char nee
string = x => x.toString()

// const { StringDecoder } = require('string_decoder');
// const decoder = new StringDecoder('utf8');
try {
	TextEncoder = window.TextEncoder || require('text-encoding').TextEncoder // node.js vs window.TextEncoder
	TextDecoder = window.TextDecoder || require('text-encoding').TextDecoder // node.js vs window.TextDecoder
	decoder = new TextDecoder('utf-8')
	encoder = new TextEncoder('utf-8')
} catch (x) {
}

help = x => {
	p(x);
	p(typeof x);
	if (typeof x == 'function')
		p(Function.getArguments(x)) // see :
	p(x.toString()); // !!! prints function body !!! ++
	p(Object.getOwnPropertyDescriptor(x))
	p(Object.keys(x))
	// p(Object.getKeys(x))
	p(dir(x))
}

//Reflection


Function_Extensions = {
	getArguments(func) {
		func = func || this
		const symbols = func.toString();
		let start, end, register;
		start = symbols.indexOf('function');
		if (start !== 0 && start !== 1) return ['ERROR', symbols] //undefined;
		start = symbols.indexOf('(', start);
		end = symbols.indexOf(')', start);
		const args = [];
		symbols.substr(start + 1, end - start - 1).split(',').forEach(function (argument) {
			args.push(argument);
		});
		return args;
	}
};
// Function.prototype.getExpectedReturnType = function () { /*ToDo*/ }


// for([key, value] of map){NO} // WTFFFFFFFFF [Symbol.iterator] is not a function ===> FIX:
Object.prototype[Symbol.iterator] = function* () {
	for (let kv of Object.entries(this)) yield kv
} // enables:
// for([key, value] of map) {}

join=(a,b)=>Object.assign(a,b)
assign=(a,b)=>Object.assign(a,b)
// use keys(o) or x in map
Object_Extensions_DONT_USE = { // DONT USE!! EVERY ENTRY FUCKS UP STUFF!! because not native? SEQUALIZE and ACE and Web3 probably others
	// to_map(){return new Map(Object.entries(this));},//entriesArray
	// keys(){return Object.keys(this)}, // NO Map/Dict type :(
	// values(){return Object.entries(this);},//entriesArray
	// join(map) {return Object.assign(this, map) }
	// entries(){return new Map(Object.entries(this));},//entriesArray
	// in(xs){return xs.indexOf(this)>=0},
	// is_a(x){return this instanceof x},
	// methodNames(){return Object.getOwnPropertyNames(this)},
	// methodsDescriptors(){return Object.getOwnPropertyDescriptors(this)},
	// methods(){return Object.getOwnPropertyDescriptors(this)},
	// toJson(){return JSON.stringify(this)}
	// select(){return Object.keys(this)}
}


function removeXfromArrayXS(x, xs) {
	let index = xs.indexOf(x);
	if (index > -1) xs.splice(index, 1);
	return xs
} // selfmodifying!

// > Object.values(x)
// [ 'a', 'b' ]
// > Object.keys(x)
// [ '0', '1' ] # string !?!
// > Object.entries(x)
// [ [ '0', 'a' ], [ '1', 'b' ] ]


function stack() {
	// return arguments.callee.caller
	const _stack = [];
	const maxStackSize = 30;
	let curr = arguments.callee;
	while (curr && stack.length < maxStackSize) {
		const c = curr.toString();
		const m = c.match("function ([a-zA-Z0-9_]*).*");
		if (m) _stack.push(m[1])
		else _stack.push(c)
		try {
			curr = curr.caller;
		} catch (e) {
			break
		}
	}
	return _stack;
}

isList = Array.isArray
isArray = Array.isArray
is_array = Array.isArray

Object.assign(RegExp.prototype, {
	match(x) {
		return x.match(this);
	}
})
add = (x, y) => x + y

// Object.assign DOES NOT assign PROPERTIES (getters / setters ) !
Array_Extensions = {
	item(number){
		return this[number]
	},
	row(number){
		return this[number]
	},
	column(number){
		if(!is_string(this[0]) && !is_array(this[0]))throw new Error("column needs [string] or [list], got ["+typeof this[0]+"]")
		if(is_string(this[0])){
			let sep=this[0].detect_separator()
			return this.map(ro=>ro.columns(sep)[number])
		}
		return this.map(ro=>ro[number])
	},
	equals( array ) {
		return this.length == array.length && this.every((j,i)=>j== array[i]) // !!++
	},
	g(x) {
		return this.filter(a => a == x || ("" + a).match(x))
	},
	clear() {
		while (this.length > 0) this.pop()
	},
	fold(fun, prim) {
		let a = prim
		for (let i of this) a = fun(i, a)
		return a
	},
	grep(x) {
		return this.filter(a => a == x || ("" + a).match(x))
	},
	gv(x) {
		return this.filter(a => !("" + a).match(x))
	},
	matches(x) {
		all = this.filter(a => a == x || ("" + a).match(x) || x.match("" + a));
		return len(all) > 0 ? all : false
	},
	removeAt(i) { // delete leaves holes!!
		this.splice(i, 1)
		return this
	},
	match(x) {
		all = this.filter(a => a == x || ("" + a).match(x) || x.match("" + a));
		return len(all) > 0
	},
	has(x) {
		return this == x || this.indexOf(x) >= 0
	},
	// delete(x){}
	remove(...xs) {
		for (let x of xs) {
			if (Array.isArray(x)) {
				for (let a in x) {
					let i = this.indexOf(a);
					if (i > -1) this.splice(i, 1);
				}
			}
			let i = this.indexOf(x);
			if (i > -1) this.splice(i, 1);
		}
		return this
	}, // selfmodifying like delete array[index] (leaves holes)
	minus(xs) {
		return this.filter(y => !xs.has(y))
	},
	invert() {
		return this.reverse()
	},
	without(...xs) {// not selfmodifying
		return this.filter(x => !xs.has(x))
	},
	intersection(xs) {
		return this.filter(y => !xs.has(y))
	},
	conjunction(xs) {
		return xs.concat(this)
	},
	add(x) { // better than push  : returns MODIFYIED list!
		if (isList(x)) this.merge(x)
		else this[this.len] = (x);
		return this
	},
	plus(x) { // NON MODIFYING  -> chainable!
		if (!isList(x)) x = [x]
		return this.concat(x)
	},
	append(x) {
		if (isList(x)) this.merge(x)
		else this[this.len] = (x);
		return this
	}, //  selfmodifying! (vs concat)
	insert(x) { // at=this.len
		this[this.len] = (x);
		return this
	}, // push,
	merge(xs) {
		trace('merge is selfmodifying (unlike concat)');
		for (let x of xs) this.push(x)
		return this
	}, // [1]+[2] '12' WTF!!!
	// DONT USE join!! danger ~ like python!! [1,2,3].join('0') == 10203 !!!

	strip() {
		return this.filter(x => x.length > 0)
	},
	sub(x, y = 0) {
		echo('use slice');
		return y ? this.slice(x, y) : this.slice(x)
	}, // substring  cannot handle negative values!!
	values(x) {
		return this
	}, // WHY??? ~ clone?  <> Object.values(x)
	clone() {
		return this.slice()
	},
	each(x) {
		return this.forEach(x)
	},
	collect(fun) {
		console.log("USE map(transform) or filter(select)")
		return this.map(fun)
	},
	select(fun) {
		console.log("USE map(transform) or filter(select)")
		return this.filter(fun)
	},
	deduplicate() {
		return this.filter((item, pos) => this.indexOf(item) == pos)
	},
	dedupe() {
		return this.filter((item, pos) => this.indexOf(item) == pos)
	},
	dedup() {
		return this.filter((item, pos) => this.indexOf(item) == pos)
	},
	unique() {
		return this.filter((item, pos) => this.indexOf(item) == pos)
	},
	shuffle() {
		return shuffle(this)
	},
	// join(x){if(x instanceof String){return old join }else return this.concat(x)},
	// contains(x){return this.indexOf(x)>=0},
	contains(x) {
		return this.includes(x)
	}, // ES7 OK!!
	random() {
		return this[int(Math.random() * this.length)]
	},
	tail(n = 100) {
		return this.slice(-n)
	},
	last(n = 0) {
		if (n) return this.slice(-n)
		return this[this.length - 1]
	},
	head(n = 100) {
		return this.slice(0, n)
	},
	first(n = 0) {
		if (n) return this.slice(0, n)
		return this[0]
	}, // << shorter!
	// select(x){return this.filter(x)}
	// arr=[1,2,3,4];arr.filter(v => v % 2 == 0) // [6, 0, 18] // select / grep
}
Buffer_Extensions = {
	toHex() {
		return bytesToHex(this);
	}
}
String_Extensions = { // StringExtensions
	at(i) {
		return unicode(this.codePointAt(i))
	},
	join(xs) {// python style
		if (is_string(xs)) return this + xs
		if (is_array(xs)) return xs.join(this)
		this + xs
	},
	capitalizeFirstLetter() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	},
	capitalize() {
		return this[0].toUpperCase() + this.slice(1)
	},
	chars() {
		return Array.from(this)
	}, // unicode OK
	charsASCII() {
		return this.split('')
	}, // ascii
	endswith(x) {
		return this.match(x + "$")
	},
	format(a = "", b = "", c = "", d = "", e = "", f = "", g = "") {
		return util.format(this + "", a, b, c, d, e, f, g).strip()// Todo WHY +"" NECCESSARY????
	},
	grep(x) {
		return this.split("\n").grep(x)
	},
	g(x) {
		return this.split("\n").grep(x)
	},
	has(x) {
		return this.match(x)
	},
	hasChars() {
		return len(this.replace(/[^a-zA-Z]/g, "")) > 0
	},
	in(xs) {
		if (!xs || empty(xs)) return false
		if (is_array(xs)) return xs.includes(this + "")
		if (xs.indexOf) return xs.indexOf(this + "") >= 0
		if (this in xs) return true
		if (this + "" in xs) {
			if (!this in xs)
				console.log("TODO WTF WHY +\"\" NECCESSARY????")
			return true
		}
		return false
	},
	next() {
		todo("next")
		return this.replace(/\w*\s*/, "")
	},
	sub(x, y) {
		return this.slice(x, y)
	}, // substring  cannot handle negative values!!
	words() {
		return this.split(" ")
	},
	columns(separator=null) {
		return this.split(separator||this.detect_separator())
	},
	detect_separator() {
		if(this.contains("\t")) return "\t"
		if(this.indexOf("|")>0) return "|"
		if(this.contains(",")) return ","
		if(this.contains(";")) return ";"
		if(this.contains("\n")) return "\n"
		if(this.contains(" ")) return " "
		return false
	},
	lines() {
		return this.split("\n")
	},
	map(fun) {
		return Array.from(this).map(fun).join("")
	}, // unicode OK
	// first(){return this.split("\n ")[0]},
	contains(x) {
		return this.match(x)
	},
	template() {
		return eval('`' + this + '`')
	},
	strip() {
		return this.trim()
	},
	toBuffer() {
		return new Buffer(this.toBytes())
	},
	toBytes() {
		if (this[0] == '0' && this[1] == 'x')
			return hexToBytes(this)
		return this.chars().map(ord)
	},
	toUpper() {
		return this.toUpperCase()
	},
	toLower() {
		return this.toLowerCase()
	},
	upper() {
		return this.toUpperCase()
	},
	lower() {
		return this.toLowerCase()
	},
	uppercase() {
		echo("toUpperCase!");
		return this.toUpperCase()
	},
	lowercase() {
		echo("toLowerCase!");
		return this.toLowerCase()
	},
	replaceAll(a, b) {
		return this.replace(new RegExp(a, "gi"), b)
	},
	// last(){return this.split("\n ").last()},
	unicode_length() {
		return Array.from(this).length
	},
	reverse() {
		return Array.from(this.normalize()).reverse().join("")
	},
	invert() {
		return Array.from(this.normalize()).reverse().join("")
	}
}
HTMLCollection_Extensions = {
	filter(l) {
		return this.to_a().filter(l);
	},
	to_a() {
		return Array.prototype.slice.call(this);
	}
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API ALSO IN NODE.JS!!
// https://github.com/estree/estree  Babel+Flow intend to target estree as well.
Reflect_Extensions = { //_Extensions
	toSource() {
		return Reflect.stringify(this, "  ");
	}, // AST to source !!
	eval() {
		return eval(Reflect.stringify(this, "  "))
	},
	run() {
		return eval(Reflect.stringify(this, "  "))
	},
}

var all = all_extensions = function () { // needs to be assigned per context !?
	// Object.assign DOES NOT assign PROPERTIES (getters / setters ) !
	Object.assign(Array.prototype, Array_Extensions) // join / merge into!
	Object.assign(Function.prototype, Function_Extensions)
	Object.assign(Buffer.prototype, Buffer_Extensions)
	// Object.assign(Object.prototype, Object_Extensions) DONT USE!
	try {
		Object.assign(String.prototype, String_Extensions)
	} catch (exc) {
	} //error(exc)}}
	try {
		Object.assign(HTMLCollection.prototype, HTMLCollection_Extensions)
	} catch (exc) {
	} //error(exc)}

	// use Properties carefully otherwise they can get very annoying:
	// IMPORTANT: configurable:true FOR RELOADS!!
	// Object.defineProperty(Array.prototype,'last', {get(){return this[this.length-1]},configurable:true});
	Object.defineProperty(Array.prototype, 'len', {
		get() {
			return this.length
		},
		configurable: true /* READ-ONLY*/
	});
	Object.defineProperty(Array.prototype, 'count', {
		get() {
			return this.length
		},
		configurable: true /* READ-ONLY*/
	});
	Object.defineProperty(String.prototype, 'len', {
		get() {
			return Array.from(this).length
		},
		configurable: true /* READ-ONLY*/
	}); // UNICODE CONFORM!
	Object.defineProperty(String.prototype, 'length_unicode', {
		get() {
			return Array.from(this).length
		},
		configurable: true /* READ-ONLY*/
	}); // UNICODE CONFORM!
	Object.defineProperty(String.prototype, 'ls', {
		get() {
			return this.split("\n")
		},
		configurable: true
	});
	Object.defineProperty(String.prototype, 'up', {
		get() {
			return this.toUpperCase()
		},
		configurable: true
	});
	Object.defineProperty(String.prototype, 'down', {
		get() {
			return this.toLowerCase()
		},
		configurable: true
	});
	// Object.defineProperty(String.prototype, 'upper', {
	//   get() {
	//     return this.toUpperCase()
	//   },
	//   configurable: true
	// });
	// Object.defineProperty(String.prototype, 'lower', {
	//   get() {
	//     return this.toLowerCase()
	//   },
	//   configurable: true
	// });
	// Object.defineProperty(Object.prototype,'kind', { get(){p('use typeof ');return typeof(this)},configurable:true });
	// Object.defineProperty(Object.prototype,'kind', { get(){p('use typeof ');return typeof this});
	// Object.defineProperty(Object.prototype,'class', { get(){p('use typeof ');return typeof this}});
	// Object.defineProperty(Object.prototype,'type', { get(){p('use typeof ');return typeof this},configurable:true});Conflicts with os.js:14 exports.type = binding.getOSType;
	// Object.defineProperty(Object.prototype,'to_json', { get(){return JSON.stringify(this)}});
	// Object.defineProperty(Object.prototype, 'to_s', {
	//   get() {
	//     console.log('use str()');
	//     return this.toString()
	//   },
	//   configurable: true
	// });
	// Object.defineProperty(Object.prototype,'type', {
	//     get(){p('use typeof ');return typeof(this)},
	//     set(x){p("NOOO use typeof "+x)},
	//     configurable:true
	//    });
	if (!extensions_version.match("!"))
	// console.info(`extensions ${extensions_version} loaded\n`)
		extensions_version += "!"
	return this
}
try {
	module.exports = all // node.js
} catch (exc) {
	all_extensions() // browser
}

function loadScript(url, callback) {
	const head = document.getElementsByTagName('head')[0];
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	script.onreadystatechange = callback;
	script.onload = callback;
	head.appendChild(script);
}

// export const 
sqrt = Math.sqrt;
function square(x) {
    return x * x;
}
// export function diag(x, y) {
//     return sqrt(square(x) + square(y));
// }

// // ------ main.js ------
// import { square, diag } from 'lib';
// console.log(square(11)); // 121
// console.log(diag(4, 3)); // 5


function ForwardingHandler(obj) {
	this.target = obj;
}

ForwardingHandler.prototype = {
	has: function (name) {
		return name in this.target;
	},
	get: function (rcvr, name) {
		return this.target[name];
	},
	set: function (rcvr, name, val) {
		this.target[name] = val;
		return true;
	},
	delete: function (name) {
		return delete this.target[name];
	},
	enumerate: function () {
		const props = [];
		for (let name in this.target) {
			props.push(name);
		}
		;
		return props;
	},
	iterate: function () {
		const props = this.enumerate();
		let i = 0;
		return {
			next: function () { // nice, on the fly objects!!
				if (i === props.length) throw StopIteration;
				return props[i++];
			}
		}
	},
	keys: function () {
		return Object.keys(this.target);
	},
};
// Proxy.wrap = (obj) => Proxy.create(new ForwardingHandler(obj),type(obj));
// x


getIp = function getIp() {
	const interfaces = require('os').networkInterfaces();
	for (let k in interfaces)
		for (let k2 in interfaces[k]) {
			const address = interfaces[k][k2];
			if (address.family === 'IPv4' && !address.internal)
				return (address.address);
		}
}


if (typeof(window) == 'undefined') {
	try {
		window = self = global // = this IN NODE.JS!
		window.WebSocket = require('websocket').w3cwebsocket
		// SERVER STUFF, NOT BROWSER STUFF
		curl = require('request');
		spawn = require('child_process').spawn;
		runAsync = execAsync = x => require('child_process').exec(x) && "OK" // suppress stupid return object
		runSync = execSync = run = exec = sys = system = x => require('child_process').execSync(x).toString() // raw output
		run = exec = sys = system = x => require('child_process').execSync(x).toString().split('\n')
		// execSync=require('execSync')
		// conflict sys{ ls: [Function],
		// print=process.stdout.write
		fs = require("fs")
		o = open = x => execAsync('open ' + (x || '')) // danger: read!!
		my = path => path.replace("~", "/Users/me")
		r = read = load = path => fs.readFileSync(my(path)).toString()
		w = wb = write = save = dump = (file, data) => fs.writeFileSync(file, new Buffer(data))
		json5 = parse_json5 = (js5) => JSON5.parse(js5);
		load_json5 = read_json5 = (file) => JSON5.parse(read(file));
		dump_json5 = write_json5 = save_json5 = (file, obj) => save(file, JSON5.stringify(obj));
		ap = append = (file, text) => fs.appendFileSync(file, text + "\n") // , err=>{p(err)}
		rl = read_lines = readlines = read_list = cat = loads = read_array = lines = function (path) {
			return fs.readFileSync(my(path)).toString().split('\n')
		}
		rb = read_buffer = read_binary = load_binary = open_rb = path => fs.readFileSync(my(path))
		read_csv = load_csv = (x, sep = ',') => read_lines(x).map(x => x.split(sep))
		read_tsv = load_csv = x => read_lines(x).map(x => x.split("\t"))
		try {
			sleeps = require('sleep').sleep // Seconds; blocking, there is no way around this !! setTimeout just ADDS to cycles!
			sleep = x => require('sleep').usleep(x * 1000) //  ms blocking there is no way around this !! setTimeout just ADDS to cycles!
		} catch (ex) {
			console.log('npm install sleep')
		}
	} catch (ex) {
		console.log(ex); // ex
		console.log("file system extensions only supported on client");
		r = extension;
		rr = reload = () => {
			location.reload();
			extension()
		}
	}
}

// optimised for long iterations but ranger(1,30)[10] NOT OK
ranger = function* (start = 0, end, step = 1) {
	if (!end) {
		end = start;
		start = 0;
	}
	if (end < start) step = -Math.abs(step)
	for (let i = start; i < end; i += step) yield i;
}
next = gen => gen.next().value

function yield(gen) {
	return gen.next().value
}

range = (start, stop, step = 1) => {
	if (!stop) {
		stop = start;
		start = 0
	}
	if (stop < start) step = -Math.abs(step)
	return Array.from(new Array(int((stop - start) / step)), (x, i) => start + i * step)
}

// range=(start, stop, step=1)=>{
//   if(!stop){stop=start; start=1; }
//   var a=[start], b=start;
//   while(b<stop){b+=step;a.push(b)}
//   return a;
// };

downloadFile = (url, dest) => {
	const http = require('http');
	const fs = require('fs');
	const file = fs.createWriteStream(dest);
	const request = http.get(url, response => response.pipe(file));
}


// let response = await fetch(url).text()


if (typeof(fetch) == 'undefined') {
	fetch = require('node-fetch')
	try {
		readFileAsync = require('fs-readfile-promise');
	} catch (ex) {
		console.log("npm install fs-readfile-promise  for readFileAsync")
	}
	// wget = require('deasync')(require('node-fetch'))
}
try {
	wget = url => string(require('sync-request')('GET', url).body)
} catch (ex) {
	console.log(ex)
}
// console.log(wget("http://mimi.com"));
// await fetch("http://mimi.com");

urlify = url => url.startsWith('http') ? url : "http://" + url

download = async (url) => {
	let response = await fetch(url)
	let data = await response.text()
	return data
}
curl = download


downloadSync2 = wget2 = (url) => {
	ret = undefined// global hack
	fetch(urlify(url)).then(response => response.text().then(data => ret = data))
	while (ret === undefined) {
		require('deasync').runLoopOnce();
	}
	return ret
}


browse = (url = "") => exec(`firefox ${url}`)


// fetch=(url)=>{
//   if(url.startsWith(".")||url.startsWith("/")) 
//     return readFileAsync(url);//Async
//   else 
//     return require('node-fetch')(url);
// }
split = (x, sep = ' ') => x.split(sep)
// console.log('extensions.js loaded');


mail_me = (subject, txt) => run(`echo "${txt}" | mail -s '${subject}' info@pannous.com`) // echse only!

// function fast_array_to_buffer(stdlib, foreign, buffer){
//     "use asm" // faster loop!!
//     key=key|0
//     // todo
// }

// Convert a hex string to a byte array
hexToBytes = (hex) => {
	for (let bytes = [], c = 0; c < hex.length; c += 2) {
		if (c == 0 && hex[1] == 'x') continue
		bytes.push(parseInt(hex.substr(c, 2), 16));
	}
	return bytes;
}

// Convert a byte array to a hex string
bytesToHex = (bytes) => {
	for (let hex = [], i = 0; i < bytes.length; i++) {
		hex.push((bytes[i] >>> 4).toString(16));
		hex.push((bytes[i] & 0xF).toString(16));
	}
	return hex.join("");
}

to_buffer = bytes => {
	if (is_string(bytes)) bytes = hexToBytes(bytes)
	return new Buffer(bytes)
	return new Uint8Array(bytes)
	// slow/egal
	// buffer=new ArrayBuffer(bytes) nope WTF JS!?!
	// buffer=new ArrayBuffer(bytes.length)
	// for(key in bytes) if (bytes.hasOwnProperty(key)) buffer[key]=bytes[key]
	// return buffer
}

// is_string= (s)=>typeof(s) === 'string' || s instanceof String; // new String().valueOf();
is_string = (s) => s && s.constructor == String


is_int = parseInt

globalize = clazz => {
	for (let k of keys(clazz)) global[k] = clazz[k]
}
is_empty = object => !Object.keys(object).length || len(object) == 0


// wast2wasm simple.wat -o simple.wasm
// wast2wasm simple.wat -v // show assembly
wat = `(module
  (func $i (import "imports" "imported_func") (param i32))
  (func (export "exported_func")
    i32.const 42
    call $i
  )
)`

wasm = async (_wasm, imports = {}) => {
	const memory = new WebAssembly.Memory({initial: 16384, maximum: 65536}); //  Property value 100000000 is above the upper bound wtf
	const table = new WebAssembly.Table({initial: 2, element: "anyfunc"});
	// if (imports == {} ) // if(imports.length==0)
	if (!Object.keys(imports).length) imports = {
		util: {
			printi: (x) => console.log(x)
		},
		env: {
			DYNAMICTOP_PTR: 0, tempDoublePtr: 0, ABORT: 100, memoryBase: 0, tableBase: 0, abortStackOverflow: (x => {
				throw "stack overflow:" + x
			}), memory: memory, table: table
		},
		global: {NaN: NaN, Infinity: Infinity}
	}
	// if(is_string(wasm)) wasm =
	if (is_file(_wasm)) _wasm = fs.readFileSync(_wasm)
	else _wasm = new Uint8Array(_wasm)
	module = await WebAssembly.compile(_wasm)// global
	instance = await WebAssembly.instantiate(module, imports)
	global.instance = instance
	// for([k,v] of instance.exports){console.log(k)}// TypeError: undefined is not a function WTF!?!
	for (let k of keys(instance.exports)) {
		if (k == '__post_instantiate') continue
		if (k == 'runPostSets') continue
		console.log(k)
		global[k] = instance.exports[k]
	}
	if (instance.exports.main)
		console.log(">>>", instance.exports.main())
	if (instance.exports._main) // extern "C"
		console.log(">>>", instance.exports._main())
	return instance
}

// Wasm.load=(wasm,imports)=>Wasm.instantiateModule(fs.readFileSync(wasm),imports)
// Wasm.load=(wasm,imports)=>WebAssembly.compile(fs.readFileSync(wasm),imports)

// Wasm.load('a.out',printInt)

function wast(input) {
	Binaryen = require('binaryen.js')
	module = new Binaryen.Module(input)

	const parser = require('wast-parser'); // NON-OFFICIAL TOY!
	let ast = parser.parse(input)

	wasm_buffer = Binaryen.compileWast(wast)
	// module=await WebAssembly.compile(wasm_buffer)
	// instance=await WebAssembly.instantiate(module)
	// instance.exports.addTwo(1,2)
}

//or just  import add from 'add.wasm' !!! +++
printBytesHex = printHexes = buffer => {
	let s = ""
	for (let b of buffer) s += "0x" + b.toString(16) + ", "
	console.log(s)
}

// downloadAsync=async function(url) {// ES7
//   let result = await fetch(url||"http://hi.net");//somethingThatReturnsAPromise();
//   console.log("OK"); 
//   // console.log(result); // cool, we have a result, THANK GOD!!!!!! 
//   it=result // nice, get result via side effect lol
//   return result // PROMISE!!! NOOO! still a promise WTF HOW CAN THIS BE? what if we modify result?
// }
// await=async function(promise){
//   result=await promise // available in REPL via side effect (workaround)
//   return result // still PROMISE in return, but ok otherwise 
// }
// await=promise=>promise.then(x=>it=x)

// await=promise=>{
//   ret = undefined
//   promise.then(response=>ret=response)
//   while(ret === undefined) {require('deasync').runLoopOnce();}
//   return ret
// }
exp = Math.pow
exponent = Math.pow
exponential = Math.pow
abs = Math.abs
absolute = Math.abs
norm = Math.abs
pow = Math.pow
power = Math.pow
log = Math.log
logarithm = Math.log
sin = Math.sin
sine = Math.sin
cos = Math.cos
cosine = Math.cos
pi = Math.pi
E = Math.e

// extend(Object,Math) !! exp log sin cos tan asin acos atan atan2
// process.on('warning', warning => {
// common.mustCall(...) /* check the warning in here */
// });
cl = console.log


function simulate_keypress(char, keyCode = 0, ctrl = 0, alt = 0, shift = 0, bubbles = 1, cancelable = 1) {
	const keyboardEvent = document.createEvent("KeyboardEvent");
	const initMethod = keyboardEvent.initKeyboardEvent ? "initKeyboardEvent" : "initKeyEvent";
	keyboardEvent[initMethod]("keypress", true, true, window, ctrl, alt, shift, ctrl, keyCode, char);
	return document.dispatchEvent(keyboardEvent);
}

readCallerLine=function () {
	let err;
	try {
		throw Error('')
	} catch (err0) {
		err = err0
	}
	const caller_line = err.stack.split("\n")[3];
	if (caller_line.match(/repl/)) return ""
	const index = caller_line.indexOf("(") || caller_line.indexOf("at ");
	const to = caller_line.indexOf(")") || caller_line.length;
	const clean = caller_line.slice(index + 1, to);
	var [file, line, col] = clean.split(":")
	const text = read_lines(file)[line - 1];
	return text
}

function getCallerLine() {
	let err;
	try {
		throw Error('')
	} catch (err0) {
		err = err0
	}
	const caller_line = err.stack.split("\n")[3];
	const index = caller_line.indexOf("at ");
	const clean = caller_line.slice(index + 2, caller_line.length);
	return clean
}

assert_equals = function assert_equals(left, right) {
	if (!left && !right) return true
	// if(left instanceof Interpretation)left=left.result
	// if(right instanceof Interpretation)right=right.result
	if (left) {
		left = left.result || left
		left = left.value || left
	}
	if (right) {
		right = right.result || right
		right = right.value || right
	}

	let are_equal = left == right;
	are_equal = left instanceof Array? left.equals(right) : are_equal
	are_equal = are_equal || json(left)==json(right)
	if (!are_equal) {

		left=util.inspect(left, {showHidden: false, depth: null})
		right=util.inspect(right, {showHidden: false, depth: null})
		let message = `Assertion failed:\n${readCallerLine().strip()}   \n${left} != ${right}`
		throw (typeof Error !== "undefined") ? trimStack(new Error(message),4) : message;
	}
	else return true // console.log("assert_equals OK")||
}

assert = function assert(condition, message) {
	// err.stack
	if (!condition) {
		message = "Assertion failed: " + (message || readCallerLine());
		throw (typeof Error !== "undefined") ? new Error(message) : message;
	}
	else return true
	// else if (message) console.log("assertion ok: "+message)
}
pretty=function (obj) {
	return util.inspect(obj, {showHidden: false, depth: null})
}
pp=(x)=>console.log(pretty(x))
// try{require('netbase')}catch(x){
// try{require('./nodes.js')}catch(y){console.log(y) } }

"the quick brown fox jumped over the lazy dog"


function rgb(r, g, b, a = 1) { // what the actual fuck, es6 !
	// return "rgb("+r+","+g+","+b+")";
	return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function rgba(r, g, b, a = 1) { // what the actual fuck, es6 !
	return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

// doesn't work : 'this' 
// function defineGetters(object,getters) {
//   Object.keys(getters).forEach(function(prop){
//     Object.defineProperty(type(object), prop, {
//         get:()=>{return getters[prop]();}// has to be wrapped
//     });
//   });
// }
// defineGetters(Image.prototype,{width(){return this.bitmap.width}})
try {
	Canvas = require('canvas') // node.js
	Image = Canvas.Image // require("jimp");
	Image.prototype.constructor = (path) => this.src = read_binary(path)
} catch (ex) {
}
// Image.__proto__ = SmartImage.prototype; // expansive hack
// Object.setPrototypeOf(object, SmartObject.prototype); // expansive 

// try{
// Image = require("jimp");
// Object.defineProperty(Image.prototype,'data', {get(){return this.bitmap.data;}})
// Object.defineProperty(Image.prototype,'width', {
//   get(){return this.bitmap.width;},
//   set(width){this.resize(width,this.bitmap.height) }})
// Object.defineProperty(Image.prototype,'height', {
//   get(){return this.bitmap.height;},
//   set(height){this.resize(this.bitmap.width,height)}})
// Object.defineProperty(Image.prototype,'size',{
//   get(){return [this.bitmap.width,this.bitmap.height];},
//   set([width,height]){this.resize(width,height)}})
// Image_Extensions={
//   save(path){this.write(path)},
//   show(){path="/tmp/image.jpg";this.write(path);Sys.preview(path)},
//   load(path){img=new Image(path);img.src=path;return img},
// }
// Image_Globals={
//   load(path){img=new Image(path);img.src=path;return img},
// }
// Object.assign(Image.prototype,Image_Extensions) // merge into!
// Object.assign(Image,Image_Globals) // merge into!

// x=new Image('image-1116947-galleryV9-hufk-1116947.jpeg')
// }catch(ex){console.log(ex)}

imageToDataUri = function (image) {
	let canvas;
	try {
		canvas = document.createElement('canvas');
	} catch (ex) {
		canvas = new Canvas()
	}
	canvas.width = image.width; // or 'naturalWidth' if you want a special/scaled size
	canvas.height = image.height; // or 'naturalHeight' if you want a special/scaled size
	canvas.getContext('2d').drawImage(image, 0, 0);
	return canvas.toDataURL('image/png')
	// Get raw image data :  dataUrl.replace(/^data:image\/(png|jpg);base64,/, ''));
}

File = class File {
} // todo

function parseHex(b) {
	return parseInt(b, 16)
}


// setTimeout(callback, delay[, arg][, ...])
// setInterval(callback, delay[, arg][, ...])#Schedules repeated execution of callback every delay milliseconds. Returns a intervalObject for possible
exit = function () {
	throw "END OF UNIVERSE REACHED"
}

// FAKE jQuery in one line!
// select a list of matching elements, context is optional
function $(selector, context) {
	return (context || document).querySelectorAll(selector);
}

// select the first match only, context is optional
function $1(selector, context) {
	return (context || document).querySelector(selector);
}

// try{
//   var beep = require('beepbeep');
//   var beep = require('node-beep');
//   beep(1);
// }catch(ex){
// function beep() {console.log("\007");console.log("\u0007"); process.stdout.write("\x07");}
// }

function beep() {
	const player = require('play-sound')(/*opts =*/ {});
	player.play('/data/bell.wav')
}

// function next(word) {
//   return word.replace(/\w\s/,"")
// }

js = JSON.stringify
mkdir = path => {
	try {
		fs.mkdirSync(path, 1)
	} catch (ex) {
	}
}
module.exports.puts = puts

is_type = x => x instanceof Function && x.constructor && true
proto = x => type(x)
type = x => x.constructor
// proto2=x=>x.prototype
// function type(x) {
// 	console.log("use typeof")
// 	return typeof x
// }



todo = x => console.log("TODO", x)
warn = x => console.log(x)
debug = x => console.log(x)


// return new Promise((ok,no)=>no)// NOT A CALL!
// return new Promise((ok,no)=>no())
// test_promise_rejector=new Promise((ok,no)=>ok())
// return new Promise((ok,no)=>setTimeout(ok,1000))

var wait = ms => new Promise((r, j) => setTimeout(r, ms))
// sleep in async functions
// await wait(2000)
keys = Object.keys


trimStack=function (ex,more=0) {
	let keep = true
	let stack = ex.stack?ex.stack.split("\n"):(ex.message||"").split("\n")
	let caller = trimStack.caller.name;
	ex.stack = stack.filter(x => {
		if(caller&&x.match(caller))keep=false
		if (x.match("Module._compile")) keep = false
		if (x.match("modulus.exports")) keep = false// todo
		if(!keep && x.match("at "))more--
		return keep||more>0
	}).join("\n")
	return ex
}

assert_contains=function assert_contains(string,pattern) {
	assert(string.contains(pattern),string+" should contain "+pattern)
}
