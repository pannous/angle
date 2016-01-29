#!/usr/bin/env ruby

//         Unknown
//           |   \____________
//           |                |
//      Primitive       Non-primitive
//           |   \_______     |
//           |           |    |
//        Number       String |
//         /   \         |    |
//    Double  Integer32  |   /
//        |      |      /   /
//        |     Smi    /   /
//        |      |    / __/
//        Uninitialized.

# https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API

https://github.com/WebAssembly/design/blob/master/AstSemantics.md
EEK The nop, if, br, br_if, case, and return constructs do not yield values

# Recent builds of the standalone SpiderMonkey shell include a reflection of the SpiderMonkey parser, made available as a JavaScript API.
ast=Reflect.parse("obj.foo + 42")
> var expr = ast.body[0].expression
Components.utils.import("resource://gre/modules/reflect.jsm")
# Note: Expression closures are SpiderMonkey-specific. !!!!!!! :(

// YAY, STANDARD ! https://github.com/estree/estree ALMOST :) :(
var Reflect=require('esprima')
// require('acorn') ?? sometimes faster YAWN http://nick.balestra.ch/2015/pick-your-parsing/
// https://github.com/angelozerr/tern.java/issues/210
// Esprima runs on many popular web browsers, as well as other ECMAScript platforms such as Rhino, Nashorn, and Node.js.
//require('jsparse') alpha -> DONT
// ONLINE http://esprima.org/demo/parse.html

esprima.tokenize(code, options); // !!!!!!!!!!!!!!!!
var walk = require( 'esprima-walk' )
walk( ast, function ( node ) { types.push( node.type ) } )

With the latest 6th edition of ECMA-262 (also known as ES2015 or ES6), it is important to distinguish parsing a script vs parsing a module. This is achieved by using the sourceType option (default to 'script'), as illustrated in the following example:

// Parsing a script
esprima.parse('var answer = 42', { sourceType: 'script' });

// Parsing a module
esprima.parse('export var answer = 42', { sourceType: 'module' });

BAD!  everything is a literal !!! :(
	esprima.parse('"use strict"').body[0]
{ type: 'ExpressionStatement',
  expression:
   { type: 'Literal',
     value: 'use strict',
     raw: '"use strict"' },
  directive: true }

   var estraverse = require('estraverse');

    var functionsStats = {}; //1
    var addStatsEntry = function(funcName) { //2
    if (!functionsStats[funcName]) {
      functionsStats[funcName] = {calls: 0, declarations:0};
    }
    };

    var filename = process.argv[2];
    console.log('Processing', filename);
    var ast = esprima.parse(fs.readFileSync(filename));
    estraverse.traverse(ast, {
     enter: function(node) {
     if (node.type === 'FunctionDeclaration') {
       addStatsEntry(node.id.name); //4
       functionsStats[node.id.name].declarations++;
     } else if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
      addStatsEntry(node.callee.name);
      functionsStats[node.callee.name].calls++; //5
    }
   }
   });

# EXTENDABLE! https://stackoverflow.com/questions/20762338/how-would-i-extend-the-javascript-language-to-support-a-new-operator/20764137#20764137
require('escodegen')
`-- sweet.js@0.7.4 // http://sweetjs.org/
  +-- escodegen@1.6.1
  | +-- esprima@1.2.5
  | +-- estraverse@1.9.3
  | +-- esutils@1.1.6
  | +-- optionator@0.5.0
  | | +-- deep-is@0.1.3
  | | +-- fast-levenshtein@1.0.7
  | | +-- levn@0.2.5
  | | +-- prelude-ls@1.1.2
  | | `-- type-check@0.3.2
  | `-- source-map@0.1.43
  |   `-- amdefine@1.0.0
  +-- escope@1.0.3
  | `-- estraverse@2.0.0
  +-- optimist@0.3.7
  | `-- wordwrap@0.0.3
  +-- resolve@0.6.3
  `-- underscore@1.3.3


# http://jointjs.com/demos/javascript-ast

# Linters like JSLint, JSHint, eslint use an Abstract Tree Parser. UglifyJS
# esprima
# s-expressions !

# mac OSX OSA:
# https://developer.apple.com/library/prerelease/mac/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/index.html

# truffle on graal JVM has faster runs, but sloooooow startup
# https://stackoverflow.com/questions/31901940/why-is-ruby-irb-iteration-so-slow/31906922#31906922

# python+truffle = zippy

# talk at PyCon 2015 about Jython 2.7, including new features: https://www.youtube.com/watch?v=hLm3garVQFo

# PyV8 is a python wrapper for Google V8 engine, it act as a bridge between the Python and JavaScript objects, and support to hosting Google's v8 engine in a python script.
#
# >>> import PyV8
# >>> js = PyV8.JSContext()          # create a context with an implicit global object
# >>> js.enter()                     # enter the context (also support with statement)
# >>> js.eval("1+2")                 # evalute the javascript expression
# 3                                    # return a native python int
# >>> class Global(PyV8.JSClass):      # define a compatible javascript class
# ...   def hello(self):               # define a method
# ...     print "Hello World"
# ...
# >>> js2 = PyV8.JSContext(Global()) # create another context with the global object
# >>> js2.enter()
# >>> js2.eval("hello()")            # call the global object from javascript
# Hello World                          # the output from python script


# import opal NOO
# Opal code is 264 times slower than the raw JS code!!!
# VIA LLVM -> emscripten (mruby)
# OR DIRECTLY!

# APIS:
# contacts,mail,... Google's API Node JS Client
# https://github.com/unconed/TermKit


# https://www.npmjs.com/package/node-go2js wtf
"" "
<!DOCTYPE html>
<html>
  <head>
    <META HTTP-EQUIV='CONTENT-TYPE' CONTENT='text/html; charset=UTF-8'>
    <script src='opal.js'></script>
    <script src='app.js'></script>
    <script src='english-script.js'></script>
  </head>
</html>
" ""
# f.puts Opal.compile("puts 'wow'")
# f.puts Opal.compile("x = (1..3).map do |n| n * n * n  end.reduce(:+); puts x")
# Opal::Builder.build('opal')

class JavascriptEmitter < Emitter
  import json

  def setter(var,val):
    command="var #{var}=result=#{val};"

  def map_method(meth):
    if meth=="increase": return "++"
    meth

  def list(context, node):
    l=node.value
    # if not l.contains_a TreeNode: return l
    mapped=l.map{|i| descend context,i}.join(",")
    return mapped

  def json_hash(context, node):
    # node=TreeNode.new
    e=node.content
    # DEBUG ^^
    l=node.value
    mapped=l.map_values{|i| descend context,i}
    return mapped.to_json

  def emit_method_call(obj,meth,params,native=false):
    if obj: params=[obj]+params
    set=EnglishParser.self_modifying(meth) ? params[0]+"=result=" : "result="
    command="#{set}#{meth}(#{params.join(",")})"

  def emit(interpretation, root,do_run=false):
    root||=interpretation.root
    self.file=File.open("../../build/app.js", "w") except None# ./test/unit/
    # self.file=File.open("../../../build/app.js", "w");
    # self.file=File.open("build/app.js", "w");
    if not self.file: self.file=File.open("app.js", "w")
    descend interpretation, root
    self.file.puts("console.log(result)")
    self.file.flush
    if do_run #danger 1: result=`node #{self.file}`.strip
    result=eval result except result #danger 1
    # exit 0
    return result


function addLogging(code) {
    var ast = esprima.parse(code);
    estraverse.traverse(ast, {
        enter: function(node, parent) {
            if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
                addBeforeCode(node);
            }
        }
    });
    return escodegen.generate(ast);
}
function addBeforeCode(node) {
    var name = node.id ? node.id.name : '<anonymous function>';
    var beforeCode = "console.log('Entering " + name + "()');";
    var beforeNodes = esprima.parse(beforeCode).body;
    node.body.body = beforeNodes.concat(node.body.body);
}

// Today we're announcing the deprecation of react-tools and JSTransform.
// As many people have noticed already, React and React Native have both switched their respective build systems to make use of Babel. This replaced JSTransform, the source transformation tool that we wrote at Facebook.

https://github.com/int3/pyesprima  two orders of magnitude slower
https://github.com/int3/js2py
https://github.com/int3/js2py/blob/master/js2py.coffee coffee script interesting


http://dev.clojure.org/display/design/JavaScript+AST
The ClojureScript compiler currently directly prints JavaScript source code strings. It is desirable to instead produce a JavaScript Abstract Syntax Tree to simplify code generation, emit source maps, and to enable higher level optimizations.
Target the Google Closure AST

<script src="livescript.js"></script>
<script type="text/ls">
    console.log "^^^^^^ !!!!!!BOOM #{window.location}"
</script>
<script>require("livescript").go()</script>

//GWT 2.6.1 	May 10, 2014
// GWT 2.7.0 	November 20, 2014 No more development?
