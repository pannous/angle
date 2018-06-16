// import {Param} from "./ast"; ES7 node 10, .mjs only
// https://github.com/WebAssembly/binaryen/wiki/binaryen.js-API

if (Binaryen = require('binaryen')) 'ok' //node bug?
let wasm = mod = new Binaryen.Module()
let ast = require('./ast')
let {Add} = require('./ast')
// Binaryen.setAPITracing(true)
// Binaryen.setAPITracing(false)

let int=wasm.i32.const
// let float=wasm.f32.const
let float=wasm.f64.const
let f32 = Binaryen.f32;
let f64 = Binaryen.f64;
const i32=Binaryen.i32
const int32=Binaryen.i32
const chars=Binaryen.i32
const I32=wasm.i32
const F32=wasm.f32
const F64=wasm.f64
const local=wasm.getLocal
const get = wasm.getLocal
// const fun=wasm.addFunction
const add = I32.add
let drop = wasm.drop
let none = Binaryen.None;

str=(x)=>x.split('').map(function(x) { return x.charCodeAt(0) })
// const memory = new WebAssembly.Memory({ initial: 10 });
// const arrayBuffer = memory.buffer;
// const buffer = new Uint8Array(arrayBuffer);


// Create a function type for  i32 (i32, i32)  (i.e., return i32, pass two
// i32 params)
// const iii = wasm.addFunctionType('iii', i32, [i32, i32]);


function vari(id) {
	return wasm.getLocal(id)
}

// wasm.addImport("logc", "console", "logc", i_);
// getInt=wasm.callImport("getInt", [], i32)
// log=x=>wasm.callImport("log", [x], none)
// logi=x=>wasm.callImport("logi", [x], none)
// logc=x=>wasm.callImport("logc", [x], none)


function _while(condition,block) {
	label="while"
	body=wasm.if(condition,block,wasm.break(label));
	return wasm.loop(label,body)
}

const local_id={}

function getIndex(name) {
	let index = local_id[name];
	if (!index) throw new Error("unknown variable " + name)
	return index
}
function _get(name) {
	let index = getIndex(name)
	return wasm.getLocal(index)
}

function getType(name) {
	return i32 // todo
}

global=name=>wasm.getGlobal(name,getType(name))

function _set(name,val,type) {
	// if(!type)type=getType(val)
	let current_id = local_id.length;
	local_id[name]= current_id
	return wasm.setLocal(current_id,val)
}
_var=_set


function index(name) {
	const index = local_id[name];
	if(!index)throw new Error("unknown variable "+name)
	return index
}

function inc(name, amount=1) {
	_set(name,add(_get(name),int(amount)));
}

function dec(name, amount=1) {
	_set(name,sub(_get(name),int(amount)));
}

// call=wasm.callIndirect()
call=wasm.call
logi= x=>wasm.callImport("logi", [x], Binaryen.None)

function toS(buffer, size=-1, index=0) {
	let s = "";
	//TextDecoder.decode()
	for (let i = index; i < index + size && buffer[i]; ++i)
		s += String.fromCharCode(buffer[i]);
	return s
}

// advantage of short type constants:
// 1. shorter
// 2. can be used to index type table
// 3. modulo 0x10 gives type for extended: array_of_xyz, i60
// disadvantages:
// harder to read in memory 0x0000000C0000000A = \x0A
// harder to read in memory 0x0000000C0000000A = \x0A
let WasmTypes = {
	any: 0,// int per default: 0x00000000.00000001 == 1 !
	int: 1,// bool? border case: x=2 => x is true, x==true? BUT x-1 != true -1
	integer: 1,
	i32: 1,
	int32: 1,
	double: 2,
	int64: 2,
	i64: 2,
	json5: 5,
	float: 4,
	f32: 4,
	f64: 6,
	real: 6,
	// f64:    8,
	ref: 3,
	reference: 3,
	type: 7,
	pointer: 9,
	poi: 9,
	string: 0x08,
	array: 0x0A,
	big: 0x0B,
	char: 0x0C,
	data: 0x0D,
	error: 0x0E, // REF ?
	failure: 0x0F,
	utf16: 0x10, // 16
}

// don't try to be smart!
let WasmTypes2 = {
	i32: 0x00000000,// bool
	int: 0x10000000,
	double: 0x20000000,// double pointer to i64 in linear memory, see 0xB for big
	float: 0x40000000,
	real: 0x80000000,
	string: 0xC8000000, // utf-8
	string: 0x00EFBBBF,
	string: 0xFE00FEFF, // The byte order mark (BOM) is a Unicode character, U+FEFF byte order mark (BOM),
	string: 0xFFFFFEFF, // The byte order mark (BOM) is a Unicode character, U+FEFF byte order mark (BOM), -256 -0x100
	char: 0xC0000000,
	// char_array: 0xC000A000,
	array_char: 0xA000C000,
	array_int: 0xA0001000, // ...
	array: 0xA0000000,
	big_number: 0xB0000000,// 0's used for values!   i60 hack : i64 minus 4 bit 0xB header for BigNum
	arguments: 0xA000A000,// pointer to arguments map {order:'irrelevant',year:2018}
	data: 0xD0000000,//
	code: 0xC0DE0000,// block
	data: 0xDADA0000,// optimized map with strings as keys
	double: 0xD0000000,// double pointer to i64 in linear memory
	object: 0xE0000000,// 0's used for type 0xE0000012.DEADBEEF = pointer to object of user type 12
	// error:      0xE0000000,// 0's used for type 0xE0000012.DEADBEEF = pointer to failure of user type 12
	failure: 0xF0000000,// 0's used for type 0xE0000012.DEADBEEF = pointer to failure of user type 12
}


class Visitor{
	constructor(){
		this.data = new Buffer(0)// current
		this.current = 0
		this.lastIndex = 0 // LOCAL variable index todo
	}

	insert_reference(memory, type, name, pointer) {
		this.current = this.data.length
		let marker = new Buffer(0xFFFFFEDE) // 0xFFFFDADA 0x0000DADA
		//Buffers are always of fixed size
		this.data = Buffer.concat([memory, marker, mapWasmType(type), new Buffer(name), new Buffer([pointer, 0])])
		return this.current
	}

	insert_global_string(s) {
		return insert_reference(memory, WasmTypes.string, s)
		// wasm.addGlobal(name,i32,this.current) // (global $a-global i32 (i32.const 7))
	}

	visit_number(n){
		if(isInt(n)) return int(n)
		else return float(n)
	}

	visit_string(s){
		let current = this.insert_global_string(s)
		return wasm.getGlobal(current)

		// wasm.setGlobal(s,s)
		// todo('visit_string: '+s);
	}


	/** @param c Add*/
	visit_Add(c) {
		return I32.add(this.visit(c.left), this.visit(c.right))
	}

	visit_Sub(c) {
		return I32.sub(this.visit(c.left), this.visit(c.right))
	}

	visit_Mult(c) {
		return I32.mul(this.visit(c.left), this.visit(c.right))
	}

	visit_Mod(c) {
		return I32.sub(this.visit(c.left), I32.mul(this.visit(c.right), I32.div_u(this.visit(c.left), this.visit(c.right))));
	}

	visit_Div(c) {
		return I32.div_s(this.visit(c.left), this.visit(c.right))
	}

	visit_And(c) {
		return I32.and(this.visit(c.left), this.visit(c.right))
	}

	visit_Eq(c) {
		return I32.eq(this.visit(c.left), this.visit(c.right))
	}

	visit_BitOr(c) {
		return I32.or(this.visit(c.left), this.visit(c.right))
	}

	visit_Or(c) {
		return I32.or(this.visit(c.left), this.visit(c.right))
	}

	visit_Assign(c) {
		// return I32.store16()

		let name = c.name;
		if (is_array(name)) name = name[0] // why?
		if(is_a(name,ast.Name))name=name.name

		let index1 = this.lastIndex++ // todo PER FUNCTION/BLOCK!!!
		// let set= wasm.setLocal(index1,this.visit(c.value)) // fuck binaryen: can be named in wast!!!
		let set = wasm.setLocal(index1, I32.const(42))
		if (isFinite(set)) throw new Error("should be expression! " + set)
		return set
	}

	visit_Ge(c) {
		return I32.ge_s(this.visit(c.left), this.visit(c.right))
	}// ...

	visit_BinOp(c) {
		let visitorMethod = this["visit_" + c.op.name];
		if (!visitorMethod)
			throw new Error("UNKNOWN BinOp " + c.op.name)
		else
			return visitorMethod.bind(this)({left: c.left, right: c.right});
	}

	visit_function(f){
		todo("visit_function")
	}

	visit_Array(arr) {
		todo("visit_Array")
	}

	visit_Object(o) {
		if (o.name) return get(o.name)
		todo("visit_Object " + o)
	}

	visit_Argument(a) {
		return this.visit(a.value)
	}

	visit_Print(code) {
		return wasm.call_import("logi", [this.visit(code.expression)], i32)
		// return wasm.call("log",i64,code)
	}

	visit(code){
		// that=this
		if(!code)
			return // how?
		let kind=typeof code
		if (kind == "object") kind = code.constructor.name
		let visitorMethod = this["visit_"+kind];
		if(! visitorMethod )
			throw new Error("UNKNOWN KIND visit_" + kind)
		else
			return visitorMethod.bind(this)(code)
	}

	visit_Interpretation(i){
		let code = i.result;
		if(isArray(code)) {
			let last
			let block = []
			for (let c of code) {
				last = this.visit(c)
				block.push(last)
			}
			return block;
		}
		return this.visit(code)
	}

}

run = function run(wasm){
	const binary = wasm.emitBinary? wasm.emitBinary():wasm;
	console.log('binary size: ' + binary.length);
	console.log("========================================");
// wasm.dispose();

	const compiled=new WebAssembly.Module(binary)
	let imports = {
		console:{
			log: x=>console.log(toS(x)),
			logi: x=>console.log(x),
			logc: x=>console.log(char(x))
		},
		imports: {
			getInt: _ => 42,
		},
	};
	const instance = new WebAssembly.Instance(compiled, imports);// starts main!
	return instance.exports.main()
}
function cast(block,type){
	//i32.trunc_s/f32
	if (type == int && block.type == float)
		return I32.trunc_u.f64(block) // i32.trunc_u(block)
	else return block
}
emit=function emit(code){
	let wasm = mod = new Binaryen.Module()
	if(!wasm.defaults) {
		const _void_ = _v_ = wasm.addFunctionType("v", none, []);
		vI = wasm.addFunctionType("vI", i32, []);
		const iV = wasm.addFunctionType("iV", none, [i32]);
		// wasm.addFunctionType("main_type", i32, [])
// const i_ = wasm.addFunctionType("i_", none, [i32]);
		wasm.addFunctionImport("logi", "console", "logi", iV);
		wasm.defaults=true
	}
	visitor=new Visitor();
	wasm.setMemory(1, visitor.data.length+16, "mem", [{
		offset: int(10),
		data: visitor.data
	}]);
	block=visitor.visit(code)
	if(!block)throw new Error("No code block")
	// if(!block)throw "No code block"
	if(block.type!=int)
		block=cast(block,int)
	// main=wasm.addFunction("main", _void_, [],
	main = wasm.addFunction("main", wasm.addFunctionType("main_type", i32, []), [],
		wasm.block("main_block", [wasm.return(block),])
	);

	wasm.addExport("main", "main");
	// wasm.setStart(main);
// console.log(wasm.validate());// USELESS!!!
// wasm.autoDrop();
// wasm.optimize();
	console.log(wasm.emitText());
	return run(wasm);
}

module.exports={emit}
