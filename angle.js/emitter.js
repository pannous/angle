Binaryen=require('./binaryen')
Binaryen.setAPITracing(true)

// "hello world" type example: create a function that adds two i32s and
// returns the result

// Create a module to work on
var module = mod = new Binaryen.Module();
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
const iii = module.addFunctionType('iii', i32, [i32, i32]);
const _void_ = _v_ = module.addFunctionType("v", none, []);
const i_ = module.addFunctionType("i_", none, [i32]);
const _i = module.addFunctionType("_i", i32, []);

// WTF NO DEBUG :(                                                                                   ^
// Assertion failed: curr, at: binaryen/src/wasm-traversal.h,78,visit at Error



// Start to create the function, starting with the contents: Get the 0 and
// 1 arguments, and add them, then return them
const left = local(0, i32);
const right = local(1, i32);
const added = I32.add(left, right);
const add2 = I32.add(added, I32.const(33));
const ret = module.return(add2);

// Note: no additional local variables (that's the [])
module.addFunction('adder', iii, [], ret);
module.addExport('adder', 'adder');


// module.callImport("print-i32", [ int(1234) ], Binaryen.None)
// module.addFunctionImport("log", "console", "log", i_);
// module.addFunctionImport("printi", "console", "printi", i_);
module.addFunctionImport("log", "imports", "log", i_);
module.addFunctionImport("getInt", "imports", "getInt", _i);
// module.addFunctionImport("check", "module", "check", i_);
getInt=module.callImport("getInt", [], i32)
log=x=>module.callImport("log", [x], none)


// main=module.addFunction("test", _void_, [], module.return(I32.add(int(42), getInt)));
function _var(s, expr) {
	return expr
}

function _if(condition,then,_else) {
	var relooper = new Binaryen.Relooper();
	var block0 = relooper.addBlock(then);
	var block1 = relooper.addBlock(_else);
	relooper.addBranch(then, _else, null, makeDroppedInt32(33));
	var body = relooper.renderAndDispose(block0, 0, module);
	return body
}

drop=x=>module.drop(module.i32.const(x));

function _while(condition,block) {
	var relooper = new Binaryen.Relooper();
	log1=relooper.addBlock(log(1))
	// log2=relooper.addBlock(log(2))
	// var block0 = relooper.addBlock(drop(10));
	// var block1 = relooper.addBlock(block);
	// var check = relooper.addBlock(condition);
	// I32.eqz()
	// console.log("O")
	// relooper.addBranch(block0, block1, null, int(33));
	// console.log("O")
	// relooper.addBranch(block1, block0, null, int(-66));
	// block0= relooper.addBranch(log(2), log(3), condition, block);
	block0= log1//relooper.addBranch(log1, log2, null, null);
	// block0= relooper.addBranch(relooper.addBlock(log(2), log(3), null, block);
	// console.log("O")
	var body = relooper.renderAndDispose(block0, 0/*label*/, module);
	// console.log("K")
	return body
}


const locals={}
function _get(name) {
	var index=locals[name]
	if(!index)throw new Error("unknown variable "+name)
	return module.getLocal(index)
}

function getType(name) {
	return i32 // todo
}
global=name=>module.getGlobal(name,getType(name))

function _set(name,val,type) {
	// if(!type)type=getType(val)
	locals[name]=locals.length
	return module.setLocal(locals.length,val)
}
_var=_set

function index() {
	const index = locals[name];
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

module.addFunction("nostop",_void_,[],[
	// _while(int(0),[]),
	log(int(10))
	// _while(int(1),[log(int(1))])
])

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

main=module.addFunction("main", _void_, [], [
	log(I32.add(int(42), getInt))
]);
module.addExport("main", "main");
module.setStart(main);

module.autoDrop();
console.log(module.validate());
console.log(module.emitText());
module.optimize();
// console.log('optimized:\n\n' + module.emitText());

const binary = module.emitBinary();
console.log('binary size: ' + binary.length);
console.log();

// We don't need the Binaryen module anymore, so we can tell it to
// clean itself up
module.dispose();

const compiled=new WebAssembly.Module(binary)
const wasm = new WebAssembly.Instance(compiled, {
	imports: {
		getInt: _ => 42,
		log:x=>console.log(x)
	},
});
console.log(wasm); // prints something like "[object WebAssembly.Instance]"
console.log();

// Call the code!
console.log('an addition: ' + wasm.exports.adder(40, 2));

function toS(buffer,size=-1,index=0) {
	let s = "";
	//TextDecoder.decode()
	for (let i = index; i < index + size; ++i){
		s += String.fromCharCode(buffer[i]);
		if(buffer[i]==0)break
	}
	return s
}
