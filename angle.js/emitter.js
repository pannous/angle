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
let drop=wasm.drop

function vari(id) {
	return wasm.getLocal(id)
}

wasm.addFunctionImport("logi", "console", "logi", iV);
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


function index(name) {
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

// call=wasm.callIndirect()
call=wasm.call
logi=x=>wasm.callImport("logi", [x], Binaryen.None)

function toS(buffer,size=-1,index=0) {
	let s = "";
	//TextDecoder.decode()
	for (let i = index; i < index + size && buffer[i]; ++i)
		s += String.fromCharCode(buffer[i]);
	return s
}

class Visitor{

	visit_number(n){
		// if(isInt
		return int(n)
	}

	visit(code){
		let kind=typeof code
		let visitorMethod = this["visit_"+kind];
		if(! visitorMethod )
			throw new Error("UNKNOWN KIND "+kind)
		else
			return visitorMethod(code)
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
			log:x=>console.log(toS(x)),
			logi:x=>console.log(x),
			logc:x=>console.log(char(x))
		},
		imports: {
			getInt: _ => 42,
		},
	};
	const instance = new WebAssembly.Instance(compiled, imports);// starts main!
}

emit=function emit(code){
	visitor=new Visitor();
	block=visitor.visit(code)
	main=wasm.addFunction("main", _void_, [],
		wasm.block("", [logi(block),])
	);

	wasm.addExport("main", "main");
	wasm.setStart(main);
// console.log(wasm.validate());// USELESS!!!
// wasm.autoDrop();
// wasm.optimize();
	console.log(wasm.emitText());
	run(wasm);
}

module.exports={emit}
