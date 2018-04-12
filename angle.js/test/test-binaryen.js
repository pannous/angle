Binaryen=require('../binaryen')
// Binaryen.setAPITracing(true)
// Binaryen.setAPITracing(false)
module = new Binaryen.Module();
int=module.i32.const

const _void_  = module.addFunctionType("v", Binaryen.None, []);
const iv = module.addFunctionType("iv", Binaryen.None, [Binaryen.i32]);

module.addFunctionImport("logi", "console", "log", iv);
logi=x=>module.callImport("logi", [x], Binaryen.None)

test=module.addFunction("test", _void_ ,[],module.block("",[
	logi(module.i32.const(10))
]))

main=module.addFunction("main", _void_, [], module.block("",[
	// logi(module.i32.const(10)), // works
	module.call("test",[],_void_), // breaks
]));

log=x=>console.log(x)
module.setStart(main);
module.validate().catch(log);// starts main!
const binary = module.emitBinary();
const compiled=new WebAssembly.Module(binary)
let imports = {console:{log}};
const wasm = new WebAssembly.Instance(compiled, imports)
