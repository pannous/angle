Binaryen=require('binaryen')
// Binaryen.setAPITracing(true)
// Binaryen.setAPITracing(false)

module = mod = new Binaryen.Module();
let int=module.i32.const
let float=module.f32.const
let f32 = Binaryen.f32;
const i32=Binaryen.i32
const int32=Binaryen.i32
const chars=Binaryen.i32
const I32=module.i32
const local=module.getLocal
// const fun=module.addFunction
const add = I32.add
const sub = I32.sub
let none = Binaryen.None;

str=(x)=>x.split('').map(function(x) { return x.charCodeAt(0) })
// const memory = new WebAssembly.Memory({ initial: 10 });
// const arrayBuffer = memory.buffer;
// const buffer = new Uint8Array(arrayBuffer);
module.setMemory(1, 256, "mem", [{
	offset: int(10),
	data: str("hello, world")
}]);

// Create a function type for  i32 (i32, i32)  (i.e., return i32, pass two
// i32 params)
// const iii = module.addFunctionType('iii', i32, [i32, i32]);
const _void_ = _v_ = module.addFunctionType("v", none, []);
const vI = module.addFunctionType("vI", i32, []);
const iV = module.addFunctionType("iV",none , [i32]);
// const i_ = module.addFunctionType("i_", none, [i32]);

// WTF NO DEBUG :(                                                                                   ^
// Assertion failed: curr, at: binaryen/src/wasm-traversal.h,78,visit at Error
function vari(id) {
	return module.getLocal(id)
}
// Start to create the function, starting with the contents: Get the 0 and
// 1 arguments, and add them, then return them
const left = local(0, i32);
const right = local(1, i32);
const added = I32.add(left, right);
const add2 = I32.add(added, I32.const(33));
const ret = module.return(add2);

// Note: no additional local variables (that's the [])
// module.addFunction('adder', iii, [], ret);
// module.addExport('adder', 'adder');


// module.callImport("print-i32", [ int(1234) ], Binaryen.None)
// module.addFunctionImport("log", "console", "log", i_);
// module.addFunctionImport("printi", "console", "printi", i_);
// module.addImport("log", "console", "log", i_);
// module.addImport("logi", "console", "logi", i_);
module.addFunctionImport("logi", "console", "logi", iV);
// module.addImport("logc", "console", "logc", i_);
// module.addFunctionImport("getInt", "imports", "getInt", _i);
// module.addFunctionImport("check", "module", "check", i_);
// getInt=module.callImport("getInt", [], i32)
// log=x=>module.callImport("log", [x], none)
// logi=x=>module.callImport("logi", [x], none)
// logc=x=>module.callImport("logc", [x], none)


// main=module.addFunction("test", _void_, [], module.return(I32.add(int(42), getInt)));
function _var(s, expr) {
	return expr
}
// _if=module.if
// function _if(condition,then,_else) {
// 	return module.if(condition,then,_else)
// }

drop=module.drop

function _while(condition,block) {
	label="while"
	body=module.if(condition,block,module.break(label));
	return module.loop(label,body)
}

const local_id={}
function _get(name) {
	let index = local_id[name];
	if(!index)throw new Error("unknown variable "+name)
	return module.getLocal(index)
}

function getType(name) {
	return i32 // todo
}
global=name=>module.getGlobal(name,getType(name))

function _set(name,val,type) {
	// if(!type)type=getType(val)
	let current_id = local_id.length;
	local_id[name]= current_id
	return module.setLocal(current_id,val)
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
// module.addFunction("reverse",none,[chars, int32/* length*/],[
// 	_var("start",int(0)),	//start
// 	_var("end",I32.sub(local(1,int32),1)),// end = length -1;
// 	_while(I32.lt_s(_get("start"),_get("end")),[
// 		// swap(*(str+start), *(str+end));
// 		// I32.xor()
// 		inc("start"),
// 		dec("end")
// 	])
// ])
// call=module.callIndirect()
call=module.call


logi=x=>module.callImport("logi", [x], Binaryen.None)

test=module.addFunction("test",_void_,[],module.block("",[
	logi(int(11))
]))

//
test2=module.addFunction("test2",vI,[],module.block("",[
	module.return(int(22))
]))

main=module.addFunction("main", _void_, [],
	module.block("", [
			// logi(module.i32.add(int(42), int(10)))
			// logi(int(10)),
			// logi(module.call("test2",[],_void_)),
			module.call("test",[],_void_)
		]
	)
);

module.addExport("main", "main");
module.setStart(main);
// console.log(module.validate());// USELESS!!!
// console.log("EEEE")
// module.autoDrop();
console.log(module.emitText());

// module.optimize();
// console.log('optimized:\n\n' + module.emitText());

const binary = module.emitBinary();
console.log('binary size: ' + binary.length);
console.log("========================================");
// module.dispose();

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
const wasm = new WebAssembly.Instance(compiled, imports);// starts main!
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
