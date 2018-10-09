package com.pannous.angle

import com.pannous.extensions.not
import kotlin.collections.ArrayList
import kotlin.collections.Iterable
import kotlin.collections.List
import kotlin.collections.Map
import kotlin.collections.MutableMap
import kotlin.collections.MutableSet
import kotlin.collections.addAll
import kotlin.collections.get
import kotlin.collections.listOf
import kotlin.collections.plus
import kotlin.collections.set
import kotlin.reflect.KClass
import kotlin.collections.mutableMapOf as map

// LISP: EVERYTHING IS A LIST
// ANGLE: LISP with sugar, map is list of pairs

interface Statement
//open class Statement // Any wrapped or unwrapped?
typealias Statements = ArrayList<Any> // ~ non-nullable types (Object + primitives - null)  vs Any?
//typealias Statements = ArrayList<Nothing> ==
//typealias Statements = ArrayList<*> == ~ Unit = void (BAD NAME --)

// ARE THESE THREE THE SAME??
//typealias Statements = MutableList<Statement>
//typealias Statements = ArrayList<Statement>


//typealias Context0 = MutableMap<Any, Statement> // variables
//typealias Arguments = Context
typealias Items = MutableSet<MutableMap.MutableEntry<Any, Statement>>

typealias Context = Block

//abstract class Context: Block
class Value(value: Any?) : Statement   // Any wrapped or unwrapped?
class Symbol(symbol: Any?) : Statement   // Any wrapped or unwrapped?
typealias Arguments = Block
class Block(parent: Block?) : Statements() , Statement {
	constructor(parent: Block?, items: Iterable<Any>?) : this(parent) {
		if(!!items)
			this.addAll(items!!)
	}
//	fun equals(other: Map<String,Any>): Boolean {
//		return false
//	}
//
	fun equals(other: Map<Any,Any>): Boolean {
		var good=0
		if(this.size != other.size)return false
		for (i in this){
			if(i is Pair<*,*>)
				if(other[i.first]==i.second)
					good++
				else return false
			if(i is Entry)
				if(other[i.key]==i.value)
					good++
				else return false
		}
		return good==other.size && this.size == other.size

	}
//
	override fun equals(other: Any?): Boolean {
		if(other is Map<*,*>) return this.equals(other as Map<Any, Any>)
		return super<java.util.ArrayList>.equals(other)
	}

	//	override operator fun equals(other: Any?): Boolean { return true }

//	override operator fun equals(other: Any?): Boolean {
//
//	}
	//	constructor(parent: Block?){
//
//	}
	operator fun get(key: String): Any? {
		for (s in this)
			if (s is Entry && s.key == key) return s.value
			else if (s is Member && s.name == key) return s.value
		return null
	}
//	infix fun or(root: Block?): Block {
//		if (!!root) return root!! else return this
//	}
}
//class Arguments(var context: Block?): Block(context)
// a method applies one block 'Arguments' to another block 'body'

class Nop : Statement
data class Comment(val text: String) : Statement {}
data class Entry(val key: Any, var value: Any?) : Statement//,Pair<String,Statement> {} // JSON { "a":"b"} map{1:7}
data class Member(val name: String, var value: Any?, var modifiers: List<*>? = null, var type: KClass<*>? = null) : Statement {
	// public variable x = {…}
// VARIABLE / Property
}


// params have 'parent' = method definition context block ... explicit?
data class Method(val name: String, val params: Arguments, val body: Block) : Statement {
	companion object {
		var names = listOf<String>()
		var methods = map<String, Method>()

		init {
			names += "print"
		}
	}

	init {
		names += name
		methods[name] = this
	}

	override fun toString(): String {
		return this.name + "(" + params + ")" + body
	}
}

data class Operator(val name: String, val left: Statement, val right: Statement, val body: Block) : Statement {
	companion object {
		var names = listOf<String>()
		var operators = map<String, Operator>()

		init {
			names += "print"
		}
	}

	init {
		names += name
		operators[name] = this
	}

	override fun toString(): String {
		return "(" + left + " " + name + " " + right + ")" + body
	}
}

/*
{
// method definition context block
	var context0
	fun test(args){
		// method block
		this.context0
	}
}

{
// method calling context block
test(params)
}

 */

data class Call(val name: String, val params: Arguments, val context: Context? = null, var method: Method? = null) : Statement {
	init {
//		if(!method)method=Method.methods[name]
	}

	fun call(args: Context? = null) {
//		params.evaluate(args!!, this)
		if (name == "print")
			println(args ?: params ?: "")//?:"")
		else if (name in Operator.names)
			interpret(Operator.operators[name]!!.body, params)
		else if (name in Method.names)
			interpret(Method.methods[name]!!.body, params)
//		else method.invoke(args)
	}
}

