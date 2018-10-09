package com.pannous.angle

// SETTINGS -> Librarries -> Kotlin -> ADD TO MODULE

import com.pannous.extensions.*
import java.lang.Double.isFinite
import kotlin.collections.Map
import kotlin.collections.MutableList
import kotlin.collections.mapOf
import kotlin.collections.set
import kotlin.collections.mutableListOf as list
import kotlin.collections.mutableMapOf as map

val NULL: Char = 0.toChar()// Char.(0)// Char.MIN_SURROGATE //  '\\0'

//class Word:String()// final
//data class Word(val word:String)// final
data class Quote(val string: String) : Statement

data class MarkParser(var json: String) {
	var root = Block(null) // first: root
	var parent = root
	var index = 0
	var len: Int
	var cur: Char = '?'
	var prev: Char = '?'

	init {
		len = json.length
		cur = json[0]
	}

	fun data(): Map<String, Any?> {
		val map = map<String, Any?>()
		white(true)
		token('{')
		while (!peek('}')) {
			white(true)
			var key: String = key()
			var value: Any? = null
			white(true)
			var assign = maybe(':')
			if (!assign) assign = maybe('=')
			if (!!assign) {
				value = value() // what to do with fun calls print(a,b,c)?  #:call{meth:print,params:{...}} ?? --
			} else {
				value = list(key, value())
				key = "$" + map.size
			}
			white(true)
			maybe(',')
			map[key] = value
		}
		if (!endOfFile()) next()
		return map

		if (json[index] != '{') throw Exception("expect")
	}

	fun string(quote: Char): Quote {
		var s = ""
		token(quote)
		var escape = false
		while (cur != quote || escape) {
			escape = cur == '\\'
			s += next()
		}
		next()
		return Quote(s)
	}

	private fun values(): Liste? {
		return liste(brace0 = NULL)
	}

	fun liste(brace0: Char = '['): MutableList<Any> {
		var brace = brace0
		var l = list<Any>()
		if (!brace)
			brace = maybe('[') //||maybe('(')// ?
		if (!brace)
			brace = maybe('(')
		else token(brace)
		while (brace == '[' && cur != ']' || brace == '(' && cur != ')') {
			val value = value()
			if (!!value)
				l.add(value!!)
			if (!white(true) and !maybe(',')) {// allow lists with space only!
//	brace already consumed not so good
				if (brace == '(')
					token(')')
				if (brace == '[')
					token(']')
				break
			}
		}

		pointer()
//		next()
		return l
	}

	fun block(parent: Block?): Block {
		var vars = map<Any, Statement>()
		var items = Block(parent or root)
		var brace = maybe("{")
		while (cur != '}' && !endOfFile()) {
			newline()
			val element = statement()
			if (!element || element is Nop)
				break
			items.add(element!!)
			newline()
		}
		if (brace) token("}")
		return items
	}

	fun words(): strings {
		var items = list<String>()
		while (isNameChar(cur)) {
			items.add(word())
			white(false)
		}
		return items
	}


	//	class members and methods are stored in a dict. This basically affects all python code?
	fun method(): Method {// declaration
		maybe("to")
		white()
		val name = word()
		val args = args()
		val body = block(parent)
		return Method(name, args, body)
	}

	private fun args(): Arguments {
		return Arguments(parent, values())//words())
	}

	private fun statement(): Statement {
		white(false)
		if (cur == '{') return block(parent)
		if (peek('"')) return Value(quote('"'))
		if (peek('`')) return Value(quote('`'))
		if (peek('\'')) return Value(quote('\''))
		if (peek("#")) return comment("\n")
		if (peek("//"))
			return comment("\n")
		if (peek("(!--")) return comment(")")
		if (peek("<!--")) return comment("--!>")
		if (peek("/*")) return comment("*/")

		if (cur == '[' || cur == '(')
			return Value(liste(cur))
		if (peek("to")) return method()
		if (peek("prescedence")) return prescedence()
		var w = word()
		if (peek(':') or peek('=')) {
			next()
			return Member(w, value())
		}
		if (w in Method.names)
			return Call(w, Arguments(parent, values()))
		if (!!w) return Symbol(w)
//		if(!!w)return Value(w)
		if (endOfFile()) return Nop() //
//		if(!data)
//		throw Throwable("unknown statement " + word()) // Error("unknown statement "+word()) WTF kotlin 1.3
		return Nop()
	}

	private fun comment(closing: String? = null): Statement {
		if (!!closing) /* */
			while (!maybe(closing!!))
				next()
		else
			while (cur != '\n')
				next()
		return Comment(line)
	}


	private fun prescedence(): Statement {
		token("prescedence")
		var op1 = word()
		token('>')
		var op2 = word()
		return Prescedence(op1, op2)
	}

	private fun peek(s: String, do_restore: bool = false): Boolean {
		return maybe(s, true)
	}

	private fun token(s: String): Boolean {
		return maybe(s) || throw Error("not matching " + s)
	}

	private fun maybe(s: String, do_restore: bool = false): Boolean {
		if(endOfFile())return false
		var ok = true
		val start = index
		for (c in s) {
			if (endOfFile() || !peek(c)) {
				ok = false;break
			}
			next()
		}
		if (!ok || do_restore)
			restore(start) // always when peek'ing
		white(false)
		return ok
	}


	private fun restore(start: Int) {
		index = start
		cur = json[index]
	}


// a b c{d e f:g}=

	fun value(): Any? {
		white()
		if (endOfFile()) return null
		if (peek('[')) return liste('[')
		if (peek('(')) return liste('(')
		if (peek('{')) return data()
		if (peek('"')) return string('"')
		if (peek('`')) return string('`')
		if (peek('\''))
			return string('\'')
		if (isNameStart(current())) return word()
		if (isNumber(current())) return number()
		return null
	}

	private fun number(): Number {

		var number: Number
		var sign = NULL
		var string = ""
		var is_float = false

		if (cur == '-' || cur == '+')
			sign = next()

		if (cur == '0') string += next() else {
			while (cur >= '0' && cur <= '9') string += next()
			if (cur == '.') {
				is_float = true
				string += '.'
				while (cur >= '0' && cur <= '9') string += next()
			}
			if (cur == 'e' || cur == 'E') {
				string += next()
				if (cur == '-' || cur == '+') string += next()
				while (cur >= '0' && cur <= '9') string += next()
			}
		}
		number = string.toLong().toInt()
		if (is_float) number = string.toDouble()

		if (sign == '-')
			when (number) {
				is Double -> number = -number
				is Long -> number = -number
			}

		if (!isFinite(number.toDouble()))
			throw Exception("Bad number")
		return number
	}


	private fun newline() {
		while (cur == ' ' || cur == ';' || cur == '\n') next()
	}

	private fun white(newline: bool = false): Boolean {
		var w = index
		while (cur == ' ' || cur == '\t' || newline && cur == '\n') next()
		return index > w
	}

	private fun key(): String {
		val quot = maybe('"') or maybe('\'') or maybe('`')
		val word = word(quot as Char)
		return word
	}

	private fun quote(quoted: Char): String {
		var w = ""
		white()
		token(quoted)
		while (cur != quoted && prev != '\\') {
			w += cur
			next()
		}
		if (!!quoted)
			token(quoted)
		return w
	}


	private fun word(quoted: Char = NULL): String {
		var w = ""
		white()
		if (!quoted && !isNameStart(current()))
			throw Exception("Invalid name start " + current())
		if (!!quoted) maybe(quoted)
		while (isNameChar(cur)) {
			w += cur
//			if (endOfFile()) break
			next()
		}
		if (!!quoted)
			token(quoted)
		return w
	}

	private fun current(): Char {
		return json[index]
	}

	fun isNumber(c: Char): Boolean { // todo : -0x.75E12
		return ('0' <= c && c <= '9')
	}

	fun isNameChar(c: Char): Boolean {
		return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9') ||
				c == '_' || c == '.' || c == '-'
	}

	fun isNameStart(c: Char): Boolean {
		return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || c == '_'
	}


	private fun peek(c: Char): Boolean {
		return cur == c
	}

	private fun maybe(c: Char): Char {
		if (cur == c) {
			next()
			return c
		}
		return NULL
	}

	private lateinit var line: String

	private fun next(): Char {
		val c = json[index++]
		prev = cur
		cur = if (index < len) json[index] else NULL
		this.line = pointer()
		return c
	}

	fun pointer(): String {
		var line = ""
		var pos = 0
		var i = index
		while (i < json.length && json[i++] != '\n')pos--
		while (i > 0 && json[--i] != '\n') {
			pos++
			line = json[i] + line
		}
		warn(line)
		if(pos>0)
		warn(" ".repeat(pos-1) + "^^^")
		return line
	}


	private fun token(c: Char): Char {
		if (endOfFile()) throw Exception("endOfFile")
		if (json[index] != c) throw Exception("expected " + c + "\n" + pointer())
		index++
		if (!endOfFile())
			cur = json[index]
		else
			cur = NULL // or so
		return c // tested token, not 'next'!
	}

	//	val endOfFile:()->Boolean={index>=len}
	val endOfFile = { index >= len }
//
}


fun warn(x: Any) {
	println(x)
}


fun interpret(code: Block, context: Block) {
	for (s in code) {
		when (s) {
			is Call -> s.call(context)
			is Quote -> s.string
//			is Method -> s.call();
		}
	}
}


fun parse(json: String): Block {
	val data = MarkParser(json).block(null)
	return data
}
//
//fun testPython() {
//	val parser = sma.smython.Parser(sma.smython.Scanner("x=42"))
//	val suite = parser.parseFileInput()
//	val stmts = suite.stmts
//	for (s: sma.smython.Stmt in stmts)
//		println(s)
////	stmts.
//}

var mark_sample = """{form                // object type-name 'form'
  (!--comment)                          // Mark pragma, like HTML comment
  {div class:"form-group"               // nested Mark object
    {label for:"email"                  // object with property 'for'
      "Email address:"                  // text needs to be quoted
    }
    {input type:"email" id:"email"}     // object without any contents
  }
  {div class:"form-group"
    {label for:"pwd" "Password"}
    {input type:"password" id:"pwd"}    // comma is optional
  }
  {button class:['btn' 'btn-info']      // property with complex values
    'Submit'                            // text quoted with single quote
  }
}"""

fun main(args: Array<String>) {
//	val json = parse("{a:b:{c:d e=1 f}}") // shorthand for:
	val json = parse("{a:{b:{c:d e=1 f}}}")

//	testPython()
//	parse RAW SYMBOLS or modified SYMBOLS:
//  left op right megaop  // not arranged / ranked
//	public static void bla() arranged / ranked / applied / combined symbol
//	html{  {html backward flag for mark (no whitespace : default ok)
	val mark0 = parse(mark_sample)
	val mark = parse("html{ body{ style={color:red} div{'bla'} input{type=button} } }")
	val map = mapOf<String, Any>("html" to ("body" to "1"))
	assert(mark == map as Any) // why as Any ???

//	mark.toMap()==map
//	IDENTICAL SYNONYMs:
//	style={color:red}
//	style={color=red}
//	style:{color:red}
//	style:color=red
//	style.color=red  synonym in data context
//	style{color:red} synonym outside of xml context

//	style={color=red green} // danger

//	style={color=red,green} // danger
//	style={color=red,green} // danger
//	style={color=(red green)} // danger: functional vs list
//	style={color=(red,green)} // unambiguous
//	(style color red) functional!



//	color:red type=button for attributes tag{ } for tags
	val code = parse("to put{ print(it)};put('ja')")
	println(code)
	val global = Block(null)
	interpret(code, global)
}
