![ENGLISH SCRIPT](English script.png "ENGLISH SCRIPT")

**Angle** is the Python implementation of [English](https://github.com/pannous/english-script) as a programming language.
The main purpose of this language is to make programming accessible to many more people, more fun and to facilitate programming computers via voice.

ALPHA, partly usable

Examples
--------
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

In progress
-----------
`add one to every odd number in 1,2,3 == 2,2,4`


The implicit list filter '**that**' applies a selection criterion to all elements. 

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


Language Specification
----------------------
Angle is a multi-paradigm programming language with [gradual typing](https://en.m.wikipedia.org/wiki/Gradual_typing).

Read the [DOSSIER](https://github.com/pannous/english-script/blob/master/DOSSIER.md) for a more complete [**language specification**](https://github.com/pannous/english-script/blob/master/DOSSIER.md), vision and some background. 

The grammar is not meant to be linguistically complete, but [functionality complete](https://en.wikipedia.org/wiki/Functional_completeness) and easily extendable. It is currently running in the 
* [ruby](https://github.com/pannous/english-script) and [python](https://github.com/pannous/angle) environment, but will soon compile to the 
* JVM thanks to [Mirah](https://github.com/mirah/mirah), [zippy](https://bitbucket.org/ssllab/zippy/overview) and [truffle](https://github.com/OracleLabs/Truffle)
* [.Net/CLR/DLR](https://en.wikipedia.org/wiki/Dynamic_Language_Runtime) (via [Cecil](https://github.com/jbevain/cecil), maybe Mirah too), 
* JavaScript (via EMScripten?) and 
* As a final aim: run **natively**, maybe similar to [Crystal](https://github.com/manastech/crystal), [Vala](https://en.wikipedia.org/wiki/Vala_%28programming_language%29) or RPython

Having a [self-hosted "bootstrapped" compiler](https://en.wikipedia.org/wiki/Bootstrapping_%28compilers%29) is an important mid-term goal.

"Premature optimization is the root of all evil." Many programming languages 'optimize' on the syntax level in order to optimize the resulting applications. Maybe [this](http://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html) is a mistake.

To check out the current capabilities of English Script have a look at the [tests](https://github.com/pannous/angle/tree/master/tests),
[keywords](https://github.com/pannous/angle/blob/master/core/english_tokens.py) and
[grammar](https://github.com/pannous/angle/blob/master/core/english_parser.py)

INSTALL
-------
`git clone --recursive git@github.com:pannous/angle.git`

`cd angle`

`./install.sh`

ALPHA, partly usable, some [tests](tests) not yet passing: 
[![Build Status](https://travis-ci.org/pannous/angle.png)](https://travis-ci.org/pannous/angle)

Start the shell : `./bin/angle` 

EXPERIMENT
----------
Run it and see yourself!

**experiment** by typing

`./bin/angle "6 plus six"`

`./bin/angle examples/test.e`

`./bin/angle` (no args to start the shell)

`⦠ 1/4`

`⦠ 6 plus six`

`⦠ beep three times`

`⦠ x is 2; if all 0,2,4 are smaller 5 then increase x`

Why the python implementation
-----------------------------
We can **compile** English script / Angle directly to python byte-code:
As opposed to Ruby, Python comes with a very nice and clean abstract syntax tree as well as byte code capabilities preinstalled.
A compiler is so much nicer (==faster) than an interpreter.
Also the Python execution model is a bit more friendly than the Ruby VM, but both have their [advantages and drawbacks](https://github.com/pannous/cast/blob/master/ruby-vs-python.txt). The biggest advantage of Python is that objects can be given attributes at any time o.x='y'! However pythons limited lamda capabilities are a painful limitation. 


For a background story/vision/philosophy/future of this project read the [DOSSIER](https://github.com/pannous/english-script/tree/master/DOSSIER.md)

