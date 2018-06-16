#!/usr/bin/env node

file=arg=process.argv[2]
if(file.match("wasmx"))file="/me/dev/script/wasm/wasp/wasp.wast"
if(file.match(".wast")){
	cmd="wasm-as "+file
	file = file.replace(".wast",".wasm")
	require('child_process').execSync(cmd+" -o "+file)
}

backtrace=function (print=1){
	try{throw new Error()}catch(ex){if(print)console.error(trimStack(ex,1)); else return trimStack(ex)}
}

demangle=function (line){
	// return line
	if(!line.match("at "))return line
	// name=line.match(/at ([a-zA-Z0-9.]*)/)[1]
	var [at,name,fun]=line.trim().split(' ')
	if(!name)return line
	type=name.match(/E(.*)/)
	type=type||name.match(/PK(.*)/)
	type=type?type[1]||"":""
	name=name.replace(/plE/g,'E')// constructor
	name=name.replace(/E.*?$/g,'')
	name=name.replace(/PK.*?$/g,'')
	name=name.replace(/_Z\d/,'')
	name=name.replace(/_ZN\d/,'')
	name=name.replace(/\d/g,'.')
	name=name.replace("_","")
	// if(!type)
	// return "	at "+name
	type=type.replace("v","")
	type=type.replace("PK","*")
	type=type.replace("i","int,")
	type=type.replace("f","float,")
	type=type.replace("c","char,")
	type=type.replace(/,$/,'')
	return file.replace(".wasm"," ")+name+"("+type+")"
}

trimStack=function (ex,more=0) {
	let keep = true
	let stack = ex.stack?ex.stack.split("\n"):(ex.message||"").split("\n")
	let caller = trimStack.caller.name;
	ex.stack = stack.filter(x => {
		if(caller&&x.match(caller))return 0 
		if (x.match("Object.<anonymous>")) keep = false
		if (x.match("Module._compile")) keep = false
		if (x.match("modulus.exports")) keep = false// todo
		if(!keep && x.match("at "))more--
		return keep||more>0
	}).map(demangle).join("\n")//.replace(/at _/g,"at ")
	return ex
}


// console.log(file)
// console.log()
// memory = new WebAssembly.Memory({initial: 256, maximum: 256}); 
// table = new WebAssembly.Table({initial: 10, maximum:10, element: "anyfunc"});

memory = new WebAssembly.Memory({initial: 16384, maximum: 65536}); 
table = new WebAssembly.Table({initial: 256, element: "anyfunc"});
nop = x=>0
log = x => console.log(x)

if(typeof(TextDecoder)!='undefined'){// WEB
const encoder = new TextDecoder('utf-16le');
	string =function toUTF16StringA(pointer, size) {
    let arr = new Uint8Array(heap.subarray(pointer, pointer + size));
    console.log(encoder.decode(arr));
	}
}else{ // NODE
	string = function(pointer,length=-1){ 
		buf=new Buffer(memory.buffer) // node only!
		if(length<=0)while(buf[pointer+ ++length]);
		return buf.slice(pointer,pointer+length).toString('utf8')//16le')
	}
}

stringy=(offset)=>{
	var str = '';
	if(!buffer)return "NOT INITED"
	// return buffer.toString('utf8');
	// return buffer.toString('utf16le');
	// return new Buffer(buffer).toString('utf16le');
	// if(!buffer)buffer=new Uint8Array(instance.exports.memory.buffer,offset,1000);
	for (var i=offset;(buffer[i]||buffer[i+1]) && i<buffer.length; i++)
  str += String.fromCharCode(buffer[i]);
 return str
}
str = function(x,len=-1){
	buf=new Buffer(memory.buffer)
	if(len<=0)while(buf[x+ ++len]);
	return buf.slice(x,x+len).toString('utf16le')
	// return buf.slice(x,x+len).toString('utf8')
}
arry=(offset)=>{
	var arr = [];
	for (var i=offset;buffer[i] && i<buffer.length; i++)
		arr.push(buffer[i])
	return arr
}
parse=(x,type)=>{
	if(!type)return x // raw value: int/bool/null
	switch (type%16) {
  case 0: return x
  case 1: return x
  case 3: return x // float double
  case 4: return parsePson(x)
  case 5: return json5(stringy(x))
  case 9: return stringy(x)
  default:
			console.log(hex(type))
			console.log(hex(x))
  break
 }
}

hex = x => x>=0?x.toString(16):(0xFFFFFFFF+x+1).toString(16) // '0x' + not for xdotool
logp = (p,type) => console.log(parse(p,type))
logc = x => process.stdout.write(x?String.fromCodePoint(x):"\n"),
logs = (x,len) => console.log(string(x,len)) 
logx = x => console.log(hex(x))

imports={
	console:{
			log,logx,logc,logs,logp,logi:log,raise:x=>{throw new Error(string(x))}
		},
	global:{NaN,Infinity},
		env: {memory,table,abort:nop, nullFunc_X: log, abortStackOverflow:nop, 
			DYNAMICTOP_PTR: 100, 
			// STACKTOP:0,STACK_MAX:1000,enlargeMemory:log,getTotalMemory:log,abortOnCannotGrowMemory:log,
			tempDoublePtr: 0, ABORT: 2, memoryBase: 0, tableBase: 0,
			logi:log,logc,logs, _raise:x=>{throw new Error(string(x))},
			backtrace:x=>console.error(backtrace()),
		},
}
is_string =  isString =(s) => s && s.constructor == String
function wasmx(file) {
try{
	let binary=file
	if (isString(file)) binary = require('fs').readFileSync(file);
	module = new WebAssembly.Module(binary)
	instance= new WebAssembly.Instance(module,imports)
	args=process.argv.slice(3,process.argv.length)
	let main = instance.exports.main || instance.exports._main
	if (main) console.log(">>>", result=main(process.argc,args))
	return result
}catch(ex){console.error(trimStack(ex));}
}
if(file) wasmx(file) // else used as library

// console.log(Module.getValue(buffer+i*nByte, 'i32'));
module.exports={wasmx}
