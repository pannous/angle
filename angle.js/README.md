[Angle script](https://github.com/pannous/angle.js)  browser variant of the [angle](https://github.com/pannous/angle) programming language inspired by [XTalk](https://en.wikipedia.org/wiki/XTalk)

lisp with optional sigils `[({;$})]`

unified expressions
everything acts as an

unified architecture blocks and lists and maps:

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
unbound code gets executed on the spot
```
{if(x<3)x++;x+x}
{1,2,3} == 3 !!!
{1,2,f} == f() !!!
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

methods can be referenced via proceeding 'to' keyword
```
my_result=test // 'ok'
my_funk=to test // the method
methods are passed as symbols to functions that expect  acts or blocks
bigger={$1>$0}
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
a=x+x
b:=x+x
c={x+x}
d={x+x}()
x=3
a == 4
b == 6
c == 6
d == 4
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
classes
```
x={a:1}
y<x
y.a == 1

Circle={number radius,area:radius*radius}

```
