![ENGLISH SCRIPT](English_script.png)

**[Angle](https://github.com/pannous/angle/)** is the Python implementation of [English](https://github.com/pannous/english-script) as a programming language.
The main purpose of this language is to facilitate programming computers via voice.
**[Angle](https://github.com/pannous/angle/)** is the first speakable programing language and thus makes programing accessible to many more people.

🖥 INSTALL
----------

`pip install angle`
<!-- `pip install anglang` -->

OR from source:

`git clone --recursive git@github.com:pannous/angle.git`

`cd angle`

`./install.sh`

Start the shell : `./bin/angle` 

📓 Examples
-----------
Here are some of our favorite working examples from the [tests](tests):

`assert two minus 1½ equals 0.5`

`beep three times`
(There will be a generation of programmers who will shake their heads that there ever was a programming language which did not interpret that sentence correctly.)

`assert square of [1,2 and 3] equals 1,4,9`

`assert 3rd word in 'hi my friend' is 'friend'`

`x is 2; if all 0,2,4 are smaller 5 then increase x; assert x equals 3 `

`beep every three seconds`

`last item in 'hi','you' is equal to 'you'`


```
While Peter is online on Skype
	make a beep
	sleep for 10 seconds
Done
```

```
To check if person is online on Skype:
	Skype.checkStatus(person)
	if result is "online": return yes 
	else return no
End
```

Status:
-----------

ALPHA, partly usable, some [tests](tests) not yet passing: 
[![Build Status](https://travis-ci.org/pannous/angle.png)](https://travis-ci.org/pannous/angle)

Operators:
--------------
`|` pipe : output of last command as input for next command. `ls ~ | sort`
`,` list : turn two nodes into a list. Append if one is a list. 'cons' in lisp
`:` pair : turn two nodes into a pair, `a:3` (hashed+symbolic). almost identical to:
`=` value : turn two nodes into a variable pair, `a=3`
`;` list : end expressions/statements, list inside a block. if 1 : 0 ;
`., of, in` selection: garden of house == house.garden
space acts as comma in lists
newline, dedent: acts as comma in lists or closing 'bracket' if matching block start

usual math operators `add` `plus` `times` `^` … and logical `and` `or` `xor` `not`

brackets: content of () is evaluated, {} is deferred (block/lambda)

angle uses **mark** as data and code format:

```
cat{
    size:3
    color:{r=1 g=0 b=0}
    form{
        dimensions=3,size*2
    }
}

All code is data and all data can be 'executed':
cat().dimensions returns (3,6) because last statement == return value
cat(!) returns cat fully evaluated: cat{size:3,…,form:dimensions:{3,6}}

print(size) // prints value of size()
print{size} // prints function size
colors={red green blue}
colors=(red green blue)
sort{.size} // ok
sort{it.size} // ok
sort{it's size} // ok
sort(size) // error unless value of size() returns lambda
sort{size} // todo: read as it.size
sort by size  // todo

[] is evaluated as property index/match or deferred if assigned:
cat[size] = 3
cat[size:3] = true
pattern=[size:3]
cat[pattern] = true
difference to cat.size : in cat[size], size can be a variable. to be sure use symbol or string cat[#size] cat['size']

switch takes a usual hash in which keys can be patterns:
switch :: a -> { b -> c } -> c()
switch(time){
    5pm: read
    [hour<5am]: sleep
    [it.minute=0]: smoke
    other: work
}
switch(time,my_block)
my_block[time()]

fallthrough must be forced with … if desired

how to force evaluation inside deferred block:
cat{
    born:=time()  // deferred
    born:time()  // deferred
    born=time()  // instant
}

blocks can be given 'arguments' when evaluated:
cat(time:5pm) == cat{born:5pm}
same rules apply: arguments can be values or blocks
cat(time:calculate()) == cat{born:calculate()}
cat(time=calculate()) == cat{born:5pm}


```

⏳ In progress
--------------

<!-- `add one to every odd number in 1,2,3 == 2,2,4` -->

Angles implicit list filter '**that**' applies a selection criterion to all elements:

`delete all files in my home folder that end with 'bak'` 

translates to ruby:

`folder(:home).files.select{|that|that.end_with?("bak")}.each{|file| file.delete}`


Implicit lambda variable '**it**' 

`for all mails by peter: mark it as read if its subject contains 'SPAM'` 

translates to ruby:

`mails(by: Peter).each{|it| it.mark(:read) if it.subject.match('SPAM')}`


The last example also illustrates what we call **matching by type name**.
```
To delete mail:
  move that mail to trash folder
End
```
Here 'mail' acts as argument name and argument type at once.
No more Java style Mail mail=new Mail().getMail();


<!-- Self documenting code is not about the "how", it's about the "what". Ex: A method name should be FilterOutOddNumbers(). Not MapModulo2Predicate(). -->

🐁 EXPERIMENT
-------------
Run it and see yourself!

**experiment** by typing

`angle "6 plus six"`

`angle examples/test.e`

`angle` (no args to start the shell)

`⦠ 1/4`

`⦠ 6 plus six`

`⦠ beep three times`

`⦠ x is 2; if all 0,2,4 are smaller 5 then increase x`

`⦠ ls | item 2`

📑 Language Specification
-------------------------
Angle is a multi-paradigm programming language with [gradual typing](https://en.m.wikipedia.org/wiki/Gradual_typing).

Read the [DOSSIER](https://github.com/pannous/english-script/blob/master/DOSSIER.md) for a more complete [**language specification**](https://github.com/pannous/english-script/blob/master/DOSSIER.md), vision and some background. 

The grammar is not meant to be linguistically complete, but [functionality complete](https://en.wikipedia.org/wiki/Functional_completeness) and easily extendable.
"Premature optimization is the root of all evil." Many programming languages 'optimize' on the syntax level in order to optimize the resulting applications. Maybe [this](http://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html) is a mistake.

To check out the current capabilities of English Script have a look at the [tests](https://github.com/pannous/angle/tree/master/tests),
[keywords](https://github.com/pannous/angle/blob/master/core/english_tokens.py) and
[grammar](https://github.com/pannous/angle/blob/master/core/english_parser.py)

🕶 Future
---------
English Script / Angle is currently running in the 
* [ruby](https://github.com/pannous/english-script) and [python](https://github.com/pannous/angle) environment, but will soon compile to the 
* WEB and **natively** thanks to [WebAssembly](https://github.com/WebAssembly/design)
* Pure [JavaScript](https://github.com/pannous/angle.js) version as intermediate.

Having a [self-hosted "bootstrapped" compiler](https://en.wikipedia.org/wiki/Bootstrapping_%28compilers%29) is an important mid-term goal.

<!--
**precedence**
One very hot idea is to allow modifying the language grammar on the fly, at least to a limited extend.
One first step would be to enable setting the precedence of functions.
This would yield very natural and sweet mathematical expressions, especially combined with Unicode names:
```
class Complex alias ℂ (re, im)
	to add number x
		ℂ(this.real+x.real, this.im+x.im)
	end
	alias '+' = add
end	
ℂ.add.precedence=Number.add.precedence-1
ī := √-1
ī + 3ī == 4ī
```
This would run against the goal to avoid sigil special chars though.
-->


Why the new implementation in python🐍?
------------------------------------
We can **compile** English script / [Angle](https://github.com/pannous/angle/) directly to python byte-code:
As opposed to Ruby, Python(3) comes with a very nice and clean abstract syntax tree as well as byte code capabilities preinstalled.
Compiling is so much nicer & faster than interpreted code.
Also the Python execution model is a bit more friendly than the Ruby VM, but both have their [advantages and drawbacks](https://github.com/pannous/cast/blob/master/ruby-vs-python.txt). The biggest advantage of Python is that objects can be given attributes at any time o.x='y'! However pythons limited block/lamda capabilities are a painful limitation. 


"There should be one-- and preferably only one --obvious way to do it"
Beautiful is better than ugly.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.			

For a background story/vision/philosophy/future of this project read the [DOSSIER](https://github.com/pannous/english-script/tree/master/DOSSIER.md)

Also check out: [Program Synthesis from Natural Language
Using Recurrent Neural Networks](https://github.com/TellinaTool/tellina)
