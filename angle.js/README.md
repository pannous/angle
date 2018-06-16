[Angle script](https://github.com/pannous/angle.js) is the browser variant of the [angle](https://github.com/pannous/angle) programming language, interpreting a modern syntax in javascript, compiling to native webassembly.

Angle is **optionally speakable**:  
`assert two minus 1½ equals 0.5`

Angle is **optionally typed**:  
  `x=1;number y=π²;int y=2; assert x,y,z are numbers`
  `string s;s=3;s=="3"` save, because int x=cast "3" or throw

Angle has **semantic indexing**:  
`assert 3rd word in 'hi my friend' is 'friend'`

Angle does what we call **matching by type name**  
```
To delete mail:
  move that mail to trash folder
end
```
Here 'mail' acts as argument name and argument type at once.  
No more Java style `Mail mail=new Mail().getMail();` never again with angle!  


Angle has **contextual keywords** *it* …:
```
for all mails by peter: 
   if its subject contains 'SPAM':
      mark it as read 
```
the last example translates to ruby:  
`mails(by: Peter).each{|it| it.mark(:read) if it.subject.match('SPAM')}`


Angle uses **[mark](https://github.com/henry-luo/mark)** as data and code format:
```
cat{
    size:3
    color:{r=1 g=0 b=0}
    form{
        dimensions = (3,size*2)
    }
    eat(){
      size++
    }
    hunger{
      strike=true #local variable is basically key:value pair
      if(strike)
        size--
    }
}
```
All code is data and all data can be 'executed':
`cat.eat().dimensions is (3,8)` normal
`cat.size=5; cat.dimensions=(3,size*2)` bound but not yet evaluated
`cat().dimensions == cat.dimensions() is (3,10)` innovation



classes are maps of keys/names to properties/fields/functions/variable-references!
symbols are names to references
maps are lists of pairs (duples), implicit triples: (index,name?,value?)
lists are maps of index to value
g = “I'm a global”
hash={
  1 to 'a'
  2 : 'b' # careful with ints as keys!
  var c = '3' 
  d = '4' # no need for 'var': keys are local variables by default
  global e = 5 # relatively ugly by design
  set f = 6
  g = 7 # hmmm ...
  if(g>6)
    kill! #only invoked when hash! is invoked
  8:return 'blocks are just maps of (hidden) line-numbers to statements
  goto 2 # oh yes;)

}
hash()
e == 5
f   // error, not predefined
g == 7  // now ok, but before??

internal block representation of hash == [
(0,1,'a')
(1,2,'b')
(2,c,'3')
(3,d,'4')
(4,e,5) # where are modifiers? global(e) wrapper?
(5,ø,set(f,6))
(6,ø,if(g>6,kill!))
(7,8,return)
]
hash[2]==hash.c=='3'

*constant* data is evaluated ('reduced') immediately.

These are the basics, some future refinements can be read [[later.md]]

Speakable lisp with less parentheses, brackets and optional sigils `[({;$})]`
inspired by [XTalk](https://en.wikipedia.org/wiki/XTalk)

everything acts is an expressions
everything acts is an object

unified architecture combines blocks and lists and maps:

blocks `{x+y,x>1}` `{1,2,3}` are evaluated lazily

lists or tuples are evaluated immediately `x=2;[1,2,x+x]==[1,2,4]`

blocks are evaluated when used  `x=2;{1,2,x+x}==[1,2,4]`

Why? simplicity is good in itself

maps look different to JavaScript!
```
(a:1,b:2,c:3)
(a=1,b=2,c=3)
{a:1,b:2,c:3}  // evaluated lazily, as ”code“!
(a,b,c)==(0:a,1:b,2:c) // like js 'objects'
(a,b,c)==[a,b,c] iff a,b,c are constant
```

blocks can be applied to blocks or evaluated via 'argument' maps:
```
a={x+x}
b={x=2}
c=(x=2)

a(b)=4
a(c)=4
a(x=2)=4
a{x=2}=4
```
blocks can be defined via ':='
```
a:=x+x
b={x+x}
a == b
```
when applying blocks all variables must be bound via context or arguments:
```
a(y=2) undefind / error unless x is available in the context
a(2) undefind / error unless 'it' keyword in block
a[2] acts as selector, not as evaluator !
```

the arguments of the cooling block can be accessed by name or number or 'it'
```
{print b}(a:1,b:2) == 2
{print $b}(a:1,b:2) == 2
{print $1}('a','b') == 'b'
{print it*2}(2) == 4
```

methods get evaluated immediately without brackets
```
to test:
    print 'ok'
test == 'ok'
```

methods can be (de)referenced via proceeding 'to' keyword, similar to #symbol in ruby or method.name in python
```
my_result=test // 'ok', invoked
my_funk=to test // the method
```
methods are passed as symbols to functions that expect acts or blocks
```
bigger = { $1 > $0 }
to sort array by block{…}
sort([3,2,1],bigger)
```

```
to act in number n seconds:
    sleep n
    act
```

what is the difference between functions, blocks, methods and acts? None really, just different names for synonyms.

keep in mind that blocks can be parameterized with arguments (see above). those are usually called methods or functions but that's just convention.

one nice way to think about 'blocks' is that they are blocking execution until needed:
```
x=2
a=x+x // eval on the spot
b:=x+x
c={x+x}
d={x+x}()

a == 4
b == ${x+x} == 4  // soft symbol
c == {x+x} // symbolical
c() == 4
d == 4

x=3
b == 6 // eval on the spot
c() == 6
```

```
e=(x=5){x+x}
e == 10
e(1) == 2
```
optional arguments give strictness to code
```
f=(){x+x}  error x is neither an argument nor a global
f2(){x+x}  error x is neither an argument nor a global
g={x+x}  // ok for now
```
all objects can act as classes (like js, really?)
```
x={a:1}
y extends x
y.a == 1
y.b = 2

Circle={number radius,area:radius*radius}
Circle(radius=3).area == 9 # no 'new'

```



Preferably '=' should be used for leaves and ':' for nodes with children.
color=blue color:{blue dark}
As in js, even lists and entity/maps can be unified:
```
[a b c]={1:a 2:b 3:c}
{a:1 b:2 c:3}=[a:1 b:2 c:3] // todo hash as list of pairs as in kotlin
{a b c}=[a b c]
```
A list is just a special entity/map in which its keys are numbers
A map is just a special list in which its entries are pairs.
