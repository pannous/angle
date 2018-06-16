class AST {
}

class FunctionCall extends AST {
}

class Param extends AST {
}

class BinOp extends AST {
	constructor(left, op, right) {
		super()
		this.left = left
		this.op = op
		this.right = right
	}

	/** @field left */
	left() {
	} // field dummy

	/** @field op */
	op() {
	} // field dummy

// left:null // types are not supported
// left=null // ES7 syntax

	/** @field right*/
	right() {
	} // field dummy
}

// usage:  new BinOp(name(v.name), new Add(), num(1))
class Add extends AST {
}

class Sub extends AST {
}

class Mult extends AST {
}

class Div extends AST {
}

class BitXor extends AST {
}

class Pow extends AST {
}

class Mod extends AST {
}

class Not extends AST {
}

class And extends AST {
}

class Or extends AST {
}

class Gt extends AST {
}

class GtE extends AST {
}

class Lt extends AST {
}

class LtE extends AST {
}

class Eq extends AST {
}

class BitOr extends AST {
}

class NotEq extends AST {
}

class In extends AST {
}

class Num extends AST { // what for?
	constructor(value) {
		super();
		this.value = value
	}
}

class Str extends AST {
}

class Compare extends AST {
}

class FunctionDef extends AST {
}

class Assign extends AST {
	constructor(name,value){
		super();
		[this.name,this.value]=[name,value]
	}
}

class Name extends AST {
	constructor(name) {
		super();
		this.name=name
	}
}

class Load extends AST {
}

class Store extends AST {
}

class Print extends AST {
	constructor(expression) {
		super();
		this.expression = expression
	}
}
// module.exports = [Add]
module.exports = {
	Add,
	Sub,
	Mult,
	Div,
	Eq,
	Gt,
	Or,
	BitXor,
	NotEq,
	Mod,
	Not,
	And,
	BitOr,
	BinOp,
	Print,
	Pow,
	GtE,
	Lt,
	LtE,
	In,
	Name,
	Load,
	Store,
	Num,
	Str,
	Compare,
	FunctionDef,
	FunctionCall,
	Assign,
	Param,
	AST
}
