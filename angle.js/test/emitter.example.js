Binaryen=require('binaryen')
// Binaryen.setAPITracing(true)
// Binaryen.setAPITracing(false)

let wasm = mod = new Binaryen.Module();
let int=wasm.i32.const
let float=wasm.f32.const
let f32 = Binaryen.f32;
const i32=Binaryen.i32
const int32=Binaryen.i32
const chars=Binaryen.i32
const I32=wasm.i32
const local=wasm.getLocal
// const fun=wasm.addFunction
const add = I32.add
const sub = I32.sub
let none = Binaryen.None;

str=(x)=>x.split('').map(function(x) { return x.charCodeAt(0) })
// const memory = new WebAssembly.Memory({ initial: 10 });
// const arrayBuffer = memory.buffer;
// const buffer = new Uint8Array(arrayBuffer);
wasm.setMemory(1, 256, "mem", [{
	offset: int(10),
	data: str("hello, world")
}]);

// Create a function type for  i32 (i32, i32)  (i.e., return i32, pass two
// i32 params)
// const iii = wasm.addFunctionType('iii', i32, [i32, i32]);
const _void_ = _v_ = wasm.addFunctionType("v", none, []);
const vI = wasm.addFunctionType("vI", i32, []);
const iV = wasm.addFunctionType("iV",none , [i32]);
// const i_ = wasm.addFunctionType("i_", none, [i32]);

// WTF NO DEBUG :(                                                                                   ^
// Assertion failed: curr, at: binaryen/src/wasm-traversal.h,78,visit at Error
function vari(id) {
	return wasm.getLocal(id)
}
// Start to create the function, starting with the contents: Get the 0 and
// 1 arguments, and add them, then return them
const left = local(0, i32);
const right = local(1, i32);
const added = I32.add(left, right);
const add2 = I32.add(added, I32.const(33));
const ret = wasm.return(add2);

// Note: no additional local variables (that's the [])
// wasm.addFunction('adder', iii, [], ret);
// wasm.addExport('adder', 'adder');


// wasm.callImport("print-i32", [ int(1234) ], Binaryen.None)
// wasm.addFunctionImport("log", "console", "log", i_);
// wasm.addFunctionImport("printi", "console", "printi", i_);
// wasm.addImport("log", "console", "log", i_);
// wasm.addImport("logi", "console", "logi", i_);
wasm.addFunctionImport("logi", "console", "logi", iV);
// wasm.addImport("logc", "console", "logc", i_);
// wasm.addFunctionImport("getInt", "imports", "getInt", _i);
// wasm.addFunctionImport("check", "wasm", "check", i_);
// getInt=wasm.callImport("getInt", [], i32)
// log=x=>wasm.callImport("log", [x], none)
// logi=x=>wasm.callImport("logi", [x], none)
// logc=x=>wasm.callImport("logc", [x], none)


// main=wasm.addFunction("test", _void_, [], wasm.return(I32.add(int(42), getInt)));
function _var(s, expr) {
	return expr
}
// _if=wasm.if
// function _if(condition,then,_else) {
// 	return wasm.if(condition,then,_else)
// }

drop=wasm.drop

function _while(condition,block) {
	label="while"
	body=wasm.if(condition,block,wasm.break(label));
	return wasm.loop(label,body)
}

const local_id={}
function _get(name) {
	let index = local_id[name];
	if(!index)throw new Error("unknown variable "+name)
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

function index() {
	const index = local_id[name];
	if(!index)throw new Error("unknown variable "+name)
	return index
}

function inc(name,amount=1) {
	_set(name,add(_get(name),int(amount)));
}

function dec(name,amount=1) {
	_set(name,sub(_get(name),int(amount)));
}

// I32.store(index(name),)

// locals["chars"]=0
// locals["length"]=1
// /* A utility function to reverse a string  */
// wasm.addFunction("reverse",none,[chars, int32/* length*/],[
// 	_var("start",int(0)),	//start
// 	_var("end",I32.sub(local(1,int32),1)),// end = length -1;
// 	_while(I32.lt_s(_get("start"),_get("end")),[
// 		// swap(*(str+start), *(str+end));
// 		// I32.xor()
// 		inc("start"),
// 		dec("end")
// 	])
// ])
// call=wasm.callIndirect()
call=wasm.call


logi=x=>wasm.callImport("logi", [x], Binaryen.None)

test=wasm.addFunction("test",_void_,[],wasm.block("",[
	logi(int(11))
]))

//
test2=wasm.addFunction("test2",vI,[],wasm.block("",[
	wasm.return(int(22))
]))

main=wasm.addFunction("main", _void_, [],
	wasm.block("", [
			// logi(wasm.i32.add(int(42), int(10)))
			// logi(int(10)),
			// logi(wasm.call("test2",[],_void_)),
			wasm.call("test",[],_void_)
		]
	)
);

wasm.addExport("main", "main");
wasm.setStart(main);
// console.log(wasm.validate());// USELESS!!!
// console.log("EEEE")
// wasm.autoDrop();
console.log(wasm.emitText());

// wasm.optimize();
// console.log('optimized:\n\n' + wasm.emitText());

const binary = wasm.emitBinary();
console.log('binary size: ' + binary.length);
console.log("========================================");
// wasm.dispose();

const compiled=new WebAssembly.Module(binary)
let imports = {
	console:{
		log:x=>console.log(toS(x)),
		logi:x=>console.log(x),
		logc:x=>console.log(char(x))
	},
	imports: {
		getInt: _ => 42,
	},
};
const instance = new WebAssembly.Instance(compiled, imports);// starts main!
// console.log(wasm); // prints something like "[object WebAssembly.Instance]"
console.log();

// Call the code!
// console.log('an addition: ' + wasm.exports.adder(40, 2));

function toS(buffer,size=-1,index=0) {
	let s = "";
	//TextDecoder.decode()
	for (let i = index; i < index + size && buffer[i]; ++i)
		s += String.fromCharCode(buffer[i]);
	return s
}
class Visitor{
	visit(code){
		kind=typeof code
		this.call("visit_"+kind)
	}

}
