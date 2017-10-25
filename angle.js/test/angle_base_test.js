
parser=require('../english_parser')
parser.dont_interpret=()=>dont_interpret() // why??


ParserBaseTest=class ParserBaseTest{
	result_be(a,b){
		// console.log("this.result_be OK")
	}
	skip(){}
	setUp(){
		context.testing = true;
		// 	context.use_tree=False
		parser.clear();
	}

	constructor(){
		register(this)

	}
}

skip=()=>{
	// throw new Error("skip");
}
assert_result_emitted=(prog,val)=>{
	console.log(prog)
	console.log(val)
}

assert_result_is=(prog,val)=>{
	console.log(prog)
	console.log(val)
}
result_be=function (a,b){
	console.log("this.result_be OK!!!")
}
// ParserBaseTest=ParserBaseTest
// export default ParserBaseTest
// module.exports={ParserBaseTest:ParserBaseTest}

register=(instance,modul)=>{
	if(instance instanceof Function){
		clazz=instance
		instance=new clazz() //.constructor()
	}
	console.log("\n------------------------------")
	console.log(instance)
	console.log("------------------------------\n")
	clazz=Object.getPrototypeOf(instance)
	modulus=modul||arguments[2].children[0]||arguments[2].parent
	for (let test of Object.getOwnPropertyNames(clazz)) {
		if(!test.match(/test/))continue
		modulus.exports[test]=ok=>{
			instance[test](ok);
			ok.done()
		}
	}
}
function register_tests() {
	for(mod of module.parent.children.slice(5)){
		if(mod.exports.length>0)
			console.log(mod.exports)
	}
}

setTimeout(()=>register_tests(),100)