//import Extensions.append
//import Extensions.read
//import Extensions.write
//import git.pannous.extensions.Extensions.append
//import git.pannous.extensions.Extensions.read
//import git.pannous.extensions.Extensions.write
import com.pannous.extensions.*
import java.math.BigDecimal
import kotlin.collections.List
import kotlin.collections.MutableMap
import kotlin.collections.contains
import kotlin.collections.filter
import kotlin.collections.listOf
import kotlin.collections.map
import kotlin.collections.plus
import kotlin.collections.set
import kotlin.io.println
import kotlin.collections.mutableListOf as list
import kotlin.collections.mutableMapOf as map
import kotlin.io.println as puts
//typealias list = mutableListOf;
//
//class list {
//
//}

fun x() : Int { return 10 }
val y : () -> Int = ::x
val z : () -> Int = { 10 }
val z2 : (Int) -> Int = { it*it }

fun main(args: Array<String>) {

	println(::x)// kotlin.Int wtf ugly // <- ONE WAY TO DISTINGUISH call from symbol
	println(y)
	println(z)
//	if( "numbers" is List<*>)
	val numbers = listOf(1, 2, 3)
	val more = list(4, 5, 6,7)
	val all=numbers wow more
	val first=1 of more
	assert(first==2)
//	all.sortedBy { a, b -> a - b  }
//	all.sortedWith(compareBy(z2))
	val ja:bool = numbers is Listo
	assert(numbers is List)
//	val no:bool = "numbers" is List<*>
//	dir(::wow)
	puts(all)
//	NICE SYMBOLS!
//	dir(::isOdd)// Introspecting local functions… not yet fully supported. OK

//	fun isOdd(x: Int):Boolean = x % 2 != 0 // inferred:
	fun isOdd(x: Int) = x % 2 != 0
	println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)
//	println(numbers.filter(isOdd)) // refers to isOdd(x: Int)

//	dir(::println)// overload resolution ambiguity
//	dir(::dir)// not enough information to infer parameter
//	dir(::main)
//	dir(::isOdd) Introspecting local functions, lambdas, anonymous functions and local variables is not yet fully supported

	var map = map<String,Int>("a" to 1, "b" to 3) // wow you can use a symbol for a function AND a variable!?
	var map2 = map<String,Int>("d" to 1, "b" to 2, "a" to 1) // wow you can use a symbol for a function AND a variable!
	puts(map+map2)// first wins
	puts(map - map2)// first wins
//	::length.invoke(all)

	fun length(x: MutableMap<*,*>) = x.size
	var loo = ::length.invoke(map)
//	println(loo)
//	not yet fully supported in Kotlin reflection
//	val laa = ::length of map
//	val laa = ::length of map - map2
//	puts(laa)
//	assert(laa==1)
	assert(false)
	assert(!0)
	assert(!!0)
	var big=BigDecimal(2)
	puts(big * big)
	puts(big.times(big))
	puts("a" of map)
	if("a" in map)
		puts(map["a"])
//		puts(map.a)
//	puts(not 1)
//	var da="a" of map
//	var weg="c" of map
	var da="a" in map
	var weg="c" in map
	if(!!da)puts("da")
	if(!weg)puts("weg")
	if(!da)throw Error("DA!")
	if(!!weg)throw Error("WEG!")
	assert(!0)
	assert(!!1)
	assert(!!1.1)
	assert(!list<Int>()) // check empty
	assert(!map<Int,Int>()) // check empty
	assert(!!map(1 to 1))
	assert(!!list(1))
	puts("a" of map)
	puts("a" in map)
	puts("b" !in map)
//	puts("a" is "a")
//	puts("a" equals 'a')
//	puts(1 equals 1)
	puts(3.square)
	val a = 'a' of map
//	puts(1 equals a)// WHY NOT??
//	puts(1.equals a)// WHY NOT??
	puts(1.equals(a))
	puts(1.equals('a' of map))
	puts(map has "a")
	val i:Int = map["a"]!!
	map["a"]= i + 2
	println(map["a"])
	println(map.len)
	var k = 1 to 2
	var k2 =Pair(1 ,2)
	print(true or false and false) // should be true
	assert(k==k2)
	println(k) // (1, 2)

	val oneToTen = 1..10
	val aToZ = "A".."z"
	if (5 in oneToTen) println("yeah")
	if ("h" in aToZ) println("good!!")
	assert(5 in oneToTen)
	assert("h" in aToZ)

	println(args.size)
	println("hilox")
//	var list=arrayOf(1,2,3) // EEEW!
	var liste = listOf(1, 2, 3,4,5,6) // EEEW!
	liste = liste.map { it * it } // <3
	liste = liste.filter { it % 2 == 0 }.map { it * it }
//	list[2]="HI"
//	list[2]=4 // WAAAA Error:(40, 6) Kotlin: No set method providing array access
//	var mulist = mutableListOf<Int>(1, 2, 3,4,5,6) // EEEW!
	var mulist = list(1, 2, 3,4,5,6) // better
	mulist[2]=4
	println(liste)
	println(liste[0..1])
	println(liste[0 to 1])
	val pi = 3.4
	println("templates pi = ${pi}")
	val file = "/tmp/test-kotlin"
	append(file,"// ok")
	write(file, lines = "ok", delete = true)
	var ok = read(file)
	assert(ok== listOf("ok"))
	for (r in read(file))
		println(r)
//	print(map.table)
//	print(map.)
	print("YAY REFLECTION: dir(map)=")
	dir(map)

//	for (r in  File.listRoots())
//		println(r)
//	println(dir(1))
//	[and, compareTo, dec, div, inc, inv, minus, mod, or, plus, rangeTo, rem, shl, shr, times, toByte, toChar, toDouble, toFloat, toInt, toLong, toShort, unaryMinus, unaryPlus, ushr, xor, equals, hashCode, toString]

//	println(dir("a"))// Reflection on built-in Kotlin types is not yet fully supported. No metadata found for public open val length: kotlin.Int

}
