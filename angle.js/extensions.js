// ln /Users/me/dev/script/javascript/extensions.js 
// <script src="extensions.js" type="text/javascript" charset="utf-8"></script>
// require('./extensions.js')()
// require('/Users/me/dev/script/javascript/extensions.js')
function extension(url = 'http://pannous.net/extensions.js') {
  var script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
}; //extension()
extensions_version = "1.2.4"
JSON5 = require('json5'); // !!! http://json5.org/

function trace(x) {
  console.log(x)
}

π = pi = Math.PI
ı = true
ƒ = false
ø = []
ℕ = function* () {
  i = 1;
  while (ı) {
    yield i;
    i += 1
  }
}
// ∞ error
ထ = Infinity //max_number=Number.MAX_VALUE
တ = max_int = Number.MAX_SAFE_INTEGER // 1/တ 1.11e-16
ε = epsilon = Number.MIN_VALUE // BAD, practically zero! 5e-324 < 1/max_number = 5e-309 ! 

// rsync --update -auz extensions.js pannous.net:/public/
// document.head.innerHTML+="<script src='http://pannous.net/extensions.js'></script>";
// all_extensions=require('/me/dev/script/javascript/extensions.js')
// all_extensions()

// import('/me/dev/script/javascript/extensions.js')
// .load /me/dev/script/javascript/extensions.js
// delete require.cache['/me/dev/script/javascript/extensions.js'] // DOESNT! 

// import will be supported in v8+6 / node.js 7
// document.head.innerHTML+="<script src='http://pannous.net/extensions.js'></script>";
function error(x) {
  console.error(x);
}

function cl(x) {
  console.log(x);
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}
// loadScript("http://pannous.net/extensions.js");
fullscreen = x => document.getElementsByTagName('html')[0].mozRequestFullScreen()
// setTimeout(callback, delay[, arg][, ...])
// setInterval(callback, delay[, arg][, ...])#Schedules repeated execution of callback every delay milliseconds. Returns a intervalObject for possible
ignore = nop = pass = () => {}
p = puts = log = echo = console.log
hex = x => x.toString(16)
print = p = function (x) {
  console.log(x);
  return x
};
dir = function (x) {
  return Object.getOwnPropertyNames(x)
}
// dir=xs=>{for(key in xs){if (!xs.hasOwnProperty(key))continue;console.log(key+":"+xs[key])}}
all = (xs) => {
  for (key in xs) console.log(key + ":" + xs[key])
}
// map=(f,xs)=>xs.map(f)  
map = (f, xs) => {
  for (key in xs) {
    if (xs.hasOwnProperty(key)) xs[key] = f(xs[key])
  }
}
do_map = (f, xs) => {
  for (key in xs) {
    if (xs.hasOwnProperty(key)) xs[key] = f(xs[key])
  }
}
is_file = exists = (path) => {
  try {
    return fs.existsSync(path)
  } catch (x) {
    return 0
  }
}


keys = function (x) {
  return Object.keys(x)
}
len = function (x) {
  console.log("use .length");
  return x.length
}
rand = random = function (x) {
  return x ? int(Math.random() * x) : Math.random()
}
randi = randint = function (x) {
  return x ? int(random(x)) : int(random(Number.MAX_SAFE_INTEGER))
}
hasChars = x => len(x.replace(/[^a-zA-Z]/g, "")) > 0
isNumber = n => !isNaN(parseFloat(n)) && isFinite(n); // parseInt() "SHOULD NOT BE USED".
nil = null

// puts=function(x){console.log(x);return x};
// puts=function(x){console.log("NOO"+x);return "OK"};
puts_hack = function (x) {
  alert("NOO" + x);
  return "OK"
};
int = x => parseInt(x)
float = x => parseFloat(x)
str = x => x.toString()
asc = x => x.charCodeAt(0) // asc('A')=65
ord = x => x.charCodeAt(0) // ord('A')=65
chr = x => String.fromCodePoint(x) // chr(65)='A' char DONT USE fromCharCode (only for ascii)!
ascii = x => String.fromCodePoint(x) // chr(65)='A' char nee
unicode = x => String.fromCodePoint(x) // chr(65)='A' char nee
string = x => x.toString()
help = x => {
  try {} catch (e) {};
  p(x);
  p(typeof x);
  if (typeof x == 'function')
    p(Function.getArguments(x)) // see :
  p(x.toString()); // !!! prints function body !!! ++ 
  p(Object.getOwnPropertyDescriptor(x))
  p(Object.keys(x))
  // p(Object.getKeys(x))
  p(dir(x))
}

//Reflection


Function_Extensions = {
  getArguments(func) {
    func = func || this
    var symbols = func.toString()
    var start, end, register;
    start = symbols.indexOf('function');
    if (start !== 0 && start !== 1) return ['ERROR', symbols] //undefined;
    start = symbols.indexOf('(', start);
    end = symbols.indexOf(')', start);
    var args = [];
    symbols.substr(start + 1, end - start - 1).split(',').forEach(function (argument) {
      args.push(argument);
    });
    return args;
  }
};
// Function.prototype.getExpectedReturnType = function () { /*ToDo*/ }


// for([key, value] of map){NO} // WTFFFFFFFFF [Symbol.iterator] is not a function ===> FIX:
Object.prototype[Symbol.iterator] = function* () {
  for (kv of Object.entries(this)) yield kv
} // enables:
// for([key, value] of map) {}

Object_Extensions = { // FUCKS UP SEQUALIZE and ACE !! and probably others
  // to_map(){return new Map(Object.entries(this));},//entriesArray
  // in(xs){return xs.indexOf(this)>=0},
  // is_a(x){return this instanceof x},
  // keys(){return Object.keys(this)}, // NO Map/Dict type :(
  // methods(){return Object.getOwnPropertyNames(this)},
  // toJson(){return JSON.stringify(this)}
  // select(){return Object.keys(this)}
}



function removeXfromArrayXS(x, xs) {
  index = xs.indexOf(x);
  if (index > -1) xs.splice(index, 1);
  return xs
} // selfmodifying! 
Array.prototype.remove = function (x) {
  i = this.indexOf(x);
  if (i > -1) this.splice(i, 1);
  return this
} // THIS NOT AVAILABLE FOR LAMDA!

// > Object.values(x)
// [ 'a', 'b' ]
// > Object.keys(x)
// [ '0', '1' ] # string !?!
// > Object.entries(x)
// [ [ '0', 'a' ], [ '1', 'b' ] ]


function stack() {
  // return arguments.callee.caller
  var _stack = [];
  var maxStackSize = 30;
  var curr = arguments.callee;
  while (curr && stack.length < maxStackSize) {
    var c = curr.toString()
    var m = c.match("function ([a-zA-Z0-9_]*).*")
    if (m) _stack.push(m[1])
    else _stack.push(c)
    try {
      curr = curr.caller;
    } catch (e) {
      break
    }
  }
  return _stack;
}

// Object.assign DOES NOT assign PROPERTIES (getters / setters ) !
Array_Extensions = {
  g(x) {
    return this.filter(a => a == x || ("" + a).match(x))
  },
  grep(x) {
    return this.filter(a => a == x || ("" + a).match(x))
  },
  matches(x) {
    all = this.filter(a => a == x || ("" + a).match(x) || x.match("" + a));
    return len(all) > 0 ? all : false
  },
  match(x) {
    all = this.filter(a => a == x || ("" + a).match(x) || x.match("" + a));
    return len(all) > 0
  },
  has(x) {
    return this.indexOf(x) >= 0
  },
  removex(x) {
    i = this.indexOf(x);
    if (i > -1) this.splice(i, 1);
    return this
  }, // selfmodifying! delete array[index];

  minus(xs) {
    return this.filter(y => !xs.has(y))
  },
  intersection(xs) {
    return this.filter(y => !xs.has(y))
  },
  conjunction(xs) {
    return xs.concat(this)
  },
  add(x) {
    echo('use push');
    log(stack());
    this[this.len] = (x);
    return this
  },
  append(x) {
    echo('use push');
    log(stack());
    this[this.len] = (x);
    return this
  }, //  selfmodifying! (vs concat)
  insert(x) {
    echo('use push');
    log(stack());
    this[this.len] = (x);
    return this
  }, // push, 
  merge(xs) {
    trace('merge is selfmodifying (unlike concat)');
    for (x of xs) this.push(x)
  }, // [1]+[2] '12' WTF!!!
  // join danger ~ like python!! [1,2,3].join('0') == 10203 !!!

  strip() {
    return this.filter(x => x.length > 0)
  },
  sub(x, y) {
    echo('use slice');
    return this.slice(x, y)
  }, // substring  cannot handle negative values!!
  values(x) {
    return this
  }, // WHY??? ~ clone?  <> Object.values(x)
  clone() {
    return this.slice()
  },
  each(x) {
    return this.forEach(x)
  },
  deduplicate() {
    return this.filter((item, pos) => this.indexOf(item) == pos)
  },
  dedupe() {
    return this.filter((item, pos) => this.indexOf(item) == pos)
  },
  unique() {
    return this.filter((item, pos) => this.indexOf(item) == pos)
  },
  shuffle() {
    return shuffle(this)
  },
  // join(x){if(x instanceof String){return old join }else return this.concat(x)},
  // contains(x){return this.indexOf(x)>=0},
  contains(x) {
    return this.includes(x)
  }, // ES7 OK!!
  random() {
    return this[int(Math.random() * this.length)]
  },
  last() {
    return this[this.length - 1]
  },
  first() {
    return this[0]
  }, // << shorter!
  // select(x){return this.filter(x)}
  // arr=[1,2,3,4];arr.filter(v => v % 2 == 0) // [6, 0, 18] // select / grep
}

String_Extensions = { // StringExtensions
  capitalizeFirstLetter() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  capitalize() {
    return this[0].toUpperCase() + this.slice(1)
  },
  in (xs) {
    return xs.indexOf(this) >= 0
  },
  endswith(x) {
    return this.match(x + "$")
  },
  has(x) {
    return this.match(x)
  },
  unicode_length() {
    return Array.from(this).length
  },
  chars() {
    return Array.from(this)
  }, // unicode OK
  charsASCII() {
    return this.split('')
  }, // ascii
  at(i) {
    return unicode(this.codePointAt(i))
  },
  grep(x) {
    return this.split("\n").grep(x)
  },
  g(x) {
    return this.split("\n").grep(x)
  },
  sub(x, y) {
    return this.slice(x, y)
  }, // substring  cannot handle negative values!!
  words() {
    return this.split(" ")
  },
  lines() {
    return this.split("\n")
  },
  // last(){return this.split("\n ").last()},
  // first(){return this.split("\n ")[0]},
  contains(x) {
    return this.match(x)
  },
  template() {
    return eval('`' + this + '`')
  },
  strip() {
    return this.trim()
  },
  toUpper() {
    return this.toUpperCase()
  },
  toLower() {
    return this.toLowerCase()
  },
  // upper(){return this.toUpperCase()},
  // lower(){return this.toLowerCase()},
  uppercase() {
    echo("toUpperCase!");
    return this.toUpperCase()
  },
  lowercase() {
    echo("toLowerCase!");
    return this.toLowerCase()
  },
  replaceAll(a, b) {
    return this.replace(new RegExp(a, "gi"), b)
  },
  hasChars() {
    return len(this.replace(/[^a-zA-Z]/g, "")) > 0
  },
  reverse() {
    return Array.from(this.normalize()).reverse().join("")
  }
}
HTMLCollection_Extensions = {
  filter(l) {
    return this.to_a().filter(l);
  },
  to_a() {
    return Array.prototype.slice.call(this);
  }
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API ALSO IN NODE.JS!!
// https://github.com/estree/estree  Babel+Flow intend to target estree as well.
Reflect_Extensions = { //_Extensions
  toSource() {
    return Reflect.stringify(this, "  ");
  }, // AST to source !!
  eval() {
    return eval(Reflect.stringify(this, "  "))
  },
  run() {
    return eval(Reflect.stringify(this, "  "))
  },
}

var all = all_extensions = function () {
  // Object.assign DOES NOT assign PROPERTIES (getters / setters ) !
  Object.assign(Object.prototype, Object_Extensions) // merge into!
  Object.assign(Array.prototype, Array_Extensions)
  Object.assign(Function.prototype, Function_Extensions)
  try {
    Object.assign(String.prototype, String_Extensions)
  } catch (exc) {} //error(exc)}}
  try {
    Object.assign(HTMLCollection.prototype, HTMLCollection_Extensions)
  } catch (exc) {} //error(exc)}

  // use Properties carefully otherwise they can get very annoying:
  // IMPORTANT: configurable:true FOR RELOADS!!
  // Object.defineProperty(Array.prototype,'last', {get(){return this[this.length-1]},configurable:true});
  Object.defineProperty(Array.prototype, 'len', {
    get() {
      return this.length
    },
    configurable: true /* READ-ONLY*/
  });
  Object.defineProperty(Array.prototype, 'count', {
    get() {
      return this.length
    },
    configurable: true /* READ-ONLY*/
  });
  Object.defineProperty(String.prototype, 'len', {
    get() {
      return Array.from(this).length
    },
    configurable: true /* READ-ONLY*/
  }); // UNICODE CONFORM!
  Object.defineProperty(String.prototype, 'length_unicode', {
    get() {
      return Array.from(this).length
    },
    configurable: true /* READ-ONLY*/
  }); // UNICODE CONFORM!
  Object.defineProperty(String.prototype, 'ls', {
    get() {
      return this.split("\n")
    },
    configurable: true
  });
  Object.defineProperty(String.prototype, 'up', {
    get() {
      return this.toUpperCase()
    },
    configurable: true
  });
  Object.defineProperty(String.prototype, 'down', {
    get() {
      return this.toLowerCase()
    },
    configurable: true
  });
  Object.defineProperty(String.prototype, 'upper', {
    get() {
      return this.toUpperCase()
    },
    configurable: true
  });
  Object.defineProperty(String.prototype, 'lower', {
    get() {
      return this.toLowerCase()
    },
    configurable: true
  });
  // Object.defineProperty(Object.prototype,'kind', { get(){p('use typeof ');return typeof(this)},configurable:true });
  // Object.defineProperty(Object.prototype,'kind', { get(){p('use typeof ');return typeof this});
  // Object.defineProperty(Object.prototype,'class', { get(){p('use typeof ');return typeof this}});
  // Object.defineProperty(Object.prototype,'type', { get(){p('use typeof ');return typeof this},configurable:true});Conflicts with os.js:14 exports.type = binding.getOSType;
  // Object.defineProperty(Object.prototype,'to_json', { get(){return JSON.stringify(this)}});
  Object.defineProperty(Object.prototype, 'to_s', {
    get() {
      p('use str()');
      return this.toString()
    },
    configurable: true
  });
  // Object.defineProperty(Object.prototype,'type', {
  //     get(){p('use typeof ');return typeof(this)},
  //     set(x){p("NOOO use typeof "+x)},
  //     configurable:true 
  //    });
  console.log(`extensions ${extensions_version} loaded`)
  return this
}
try {
  module.exports = all // node.js
} catch (exc) {
  all_extensions() // browser
}

function loadScript(url, callback) {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onreadystatechange = callback;
  script.onload = callback;
  head.appendChild(script);
}

// export const 
sqrt = Math.sqrt;
// export function square(x) {
//     return x * x;
// }
// export function diag(x, y) {
//     return sqrt(square(x) + square(y));
// }

// // ------ main.js ------
// import { square, diag } from 'lib';
// console.log(square(11)); // 121
// console.log(diag(4, 3)); // 5


function ForwardingHandler(obj) {
  this.target = obj;
}
ForwardingHandler.prototype = {
  has: function (name) {
    return name in this.target;
  },
  get: function (rcvr, name) {
    return this.target[name];
  },
  set: function (rcvr, name, val) {
    this.target[name] = val;
    return true;
  },
  delete: function (name) {
    return delete this.target[name];
  },
  enumerate: function () {
    var props = [];
    for (name in this.target) {
      props.push(name);
    };
    return props;
  },
  iterate: function () {
    var props = this.enumerate(),
      i = 0;
    return {
      next: function () { // nice, on the fly objects!!
        if (i === props.length) throw StopIteration;
        return props[i++];
      }
    }
  },
  keys: function () {
    return Object.keys(this.target);
  },
};
// Proxy.wrap = (obj) => Proxy.create(new ForwardingHandler(obj),Object.getPrototypeOf(obj));
// x

try {
  // SERVER STUFF, NOT BROWSER STUFF

  getIp = function getIp() {
    var interfaces = require('os').networkInterfaces();
    for (var k in interfaces)
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal)
          return (address.address);
      }
  }

  curl = require('request');
  sleeps = require('sleep').sleep // Seconds; blocking, there is no way around this !! setTimeout just ADDS to cycles!
  sleep = x => require('sleep').usleep(x * 1000) //  ms blocking there is no way around this !! setTimeout just ADDS to cycles!
  // execSync=require('execSync')
  // var child_process=require('child_process') 
  spawn = require('child_process').spawn;
  execAsync = x => child_process.exec(x) && "OK" // suppress stupid return object
  run = exec = execSync = sys = system = x => require('child_process').execSync(x).toString().split('\n')
  // conflict sys{ ls: [Function],
  // print=process.stdout.write
  fs = require("fs")
  o = open = x => execAsync('open ' + (x || '')) // danger: read!!
  my = path => path.replace("~", "/Users/me")
  r = read = load = path => fs.readFileSync(my(path)).toString()
  w = wb = write = save = dump = (file, data) => fs.writeFileSync(file, new Buffer(data))
  json5 = parse_json5 = (js5) => JSON5.parse(js5);
  load_json5 = read_json5 = (file) => JSON5.parse(read(file));
  dump_json5 = write_json5 = save_json5 = (file, obj) => save(file, JSON5.stringify(obj));
  ap = append = (file, text) => fs.appendFileSync(file, text + "\n") // , err=>{p(err)}
  rl = read_lines = read_list = cat = read_array = lines = path => fs.readFileSync(my(path)).toString().split('\n')
  rb = read_buffer = read_binary = load_binary = open_rb = path => fs.readFileSync(my(path))
  read_csv = load_csv = x => read_lines(x).map(x => x.split(","))
  read_tsv = load_csv = x => read_lines(x).map(x => x.split("\t"))

} catch (ex) {
  console.log(ex); // ex
  console.log("file system extensions only supported on client");
  r = extension;
  rr = reload = () => {
    location.reload();
    extension()
  }
}

function* range(start = 0, end, step = 1) {
  if (!end) {
    end = start;
    start = 0;
  }
  if (stop < start) step = -Math.abs(step)
  for (let i = start; i < end; i += step) yield i;
}
next = gen => gen.next().value

function yield(gen) {
  return gen.next().value
}

// range=(start, stop, step=1)=>{
function range(start, stop, step = 1) {
  if (!stop) {
    stop = start;
    start = 0
  }
  if (stop < start) step = -Math.abs(step)
  return Array.from(new Array(int((stop - start) / step)), (x, i) => start + i * step)
}
// range=(start, stop, step=1)=>{
//   if(!stop){stop=start; start=1; }
//   var a=[start], b=start;
//   while(b<stop){b+=step;a.push(b)}
//   return a;
// };

downloadFile = (url, dest) => {
  var http = require('http');
  var fs = require('fs');
  var file = fs.createWriteStream(dest);
  var request = http.get(url, response => response.pipe(file));
}

try {
  readFileAsync = require('fs-readfile-promise');
  fetch = require('node-fetch')
  wget = require('deasync')(require('node-fetch'))
} catch (ex) {
  console.log("extensions  browser  mode")
}

// console.log(wget("http://mimi.com"));
// await fetch("http://mimi.com");

urlify = url => url.startsWith('http') ? url : "http://" + url

downloadSync = wget = (url) => {
  ret = undefined
  fetch(urlify(url)).then(response => response.text().then(data => ret = data))
  while (ret === undefined) {
    require('deasync').runLoopOnce();
  }
  return ret
}

browse = (url = "") => exec(`open -a /Applications/Firefox.app ${url}`)


// fetch=(url)=>{
//   if(url.startsWith(".")||url.startsWith("/")) 
//     return readFileAsync(url);//Async
//   else 
//     return require('node-fetch')(url);
// }
split = x => x.split()
// console.log('extensions.js loaded');
// Wasm.load=(wasm,imports)=>Wasm.instantiateModule(fs.readFileSync(wasm),imports)
// Wasm.load=(wasm,imports)=>WebAssembly.compile(fs.readFileSync(wasm),imports)

mail_me = (subject, txt) => run(`echo "${txt}" | mail -s '${subject}' info@pannous.com`) // echse only!

// function fast_array_to_buffer(stdlib, foreign, buffer){
//     "use asm" // faster loop!!
//     key=key|0
//     // todo
// }

to_buffer = bytes => {
  return Uint8Array(bytes)
  // slow/egal
  // buffer=new ArrayBuffer(bytes) nope WTF JS!?!
  // buffer=new ArrayBuffer(bytes.length)
  // for(key in bytes) if (bytes.hasOwnProperty(key)) buffer[key]=bytes[key]
  // return buffer
}

wasm = (wasm, imports) => {
  if (is_file(wasm)) wasm = fs.readFileSync(wasm)
  else wasm = new Uint8Array(wasm)
  // return await(WebAssembly.compile(wasm,imports))
  return new WebAssembly.Module(wasm)
  // return WebAssembly.compile(wasm,imports).then(m => {
  //   new WebAssembly.Instance(m, imports)
  // })
}
// Wasm.load('a.out',printInt)
//or just  import add from 'add.wasm' !!! +++
printBytesHex = printHexes = buffer => {
  for (b of buffer) {
    s += "0x" + b.toString(16) + ", "
  }
  console.log(s)
}

// downloadAsync=async function(url) {// ES7
//   let result = await fetch(url||"http://hi.net");//somethingThatReturnsAPromise();
//   console.log("OK"); 
//   // console.log(result); // cool, we have a result, THANK GOD!!!!!! 
//   it=result // nice, get result via side effect lol
//   return result // PROMISE!!! NOOO! still a promise WTF HOW CAN THIS BE? what if we modify result?
// }
// await=async function(promise){
//   result=await promise // available in REPL via side effect (workaround)
//   return result // still PROMISE in return, but ok otherwise 
// }
// await=promise=>promise.then(x=>it=x)

// await=promise=>{
//   ret = undefined
//   promise.then(response=>ret=response)
//   while(ret === undefined) {require('deasync').runLoopOnce();}
//   return ret
// }
exp = Math.pow
exponent = Math.pow
exponential = Math.pow
abs = Math.abs
absolute = Math.abs
norm = Math.abs
pow = Math.pow
power = Math.pow
log = Math.log
logarithm = Math.log
sin = Math.sin
sine = Math.sin
cos = Math.cos
cosine = Math.cos
pi = Math.pi
E = Math.e

// extend(Object,Math) !! exp log sin cos tan asin acos atan atan2
// process.on('warning', warning => {
// common.mustCall(...) /* check the warning in here */
// });
cl = console.log


function simulate_keypress(char, keyCode = 0, ctrl = 0, alt = 0, shift = 0, bubbles = 1, cancelable = 1) {
  var keyboardEvent = document.createEvent("KeyboardEvent");
  var initMethod = keyboardEvent.initKeyboardEvent ? "initKeyboardEvent" : "initKeyEvent";
  keyboardEvent[initMethod]("keypress", true, true, window, ctrl, alt, shift, ctrl, keyCode, char);
  return document.dispatchEvent(keyboardEvent);
}

assert = function (condition, message) {
  message = message || "Assertion failed";
  if (!condition)
    throw (typeof Error !== "undefined") ? new Error(message) : message;
}

// try{require('netbase')}catch(x){
// try{require('./nodes.js')}catch(y){console.log(y) } }

"the quick brown fox jumped over the lazy dog"


function rgb(r, g, b, a = 1) { // what the actual fuck, es6 !
  // return "rgb("+r+","+g+","+b+")";
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function rgba(r, g, b, a = 1) { // what the actual fuck, es6 !
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

// doesn't work : 'this' 
// function defineGetters(object,getters) {
//   Object.keys(getters).forEach(function(prop){
//     Object.defineProperty(Object.getPrototypeOf(object), prop, {
//         get:()=>{return getters[prop]();}// has to be wrapped
//     });
//   });
// }
// defineGetters(Image.prototype,{width(){return this.bitmap.width}})
try {
  Canvas = require('canvas') // node.js
  Image = Canvas.Image // require("jimp");
  Image.prototype.constructor = (path) => this.src = read_binary(path)
} catch (ex) {}
// Image.__proto__ = SmartImage.prototype; // expansive hack
// Object.setPrototypeOf(object, SmartObject.prototype); // expansive 

// try{
// Image = require("jimp");
// Object.defineProperty(Image.prototype,'data', {get(){return this.bitmap.data;}})
// Object.defineProperty(Image.prototype,'width', {
//   get(){return this.bitmap.width;},
//   set(width){this.resize(width,this.bitmap.height) }})
// Object.defineProperty(Image.prototype,'height', {
//   get(){return this.bitmap.height;},
//   set(height){this.resize(this.bitmap.width,height)}})
// Object.defineProperty(Image.prototype,'size',{
//   get(){return [this.bitmap.width,this.bitmap.height];},
//   set([width,height]){this.resize(width,height)}})
// Image_Extensions={
//   save(path){this.write(path)},
//   show(){path="/tmp/image.jpg";this.write(path);Sys.preview(path)},
//   load(path){img=new Image(path);img.src=path;return img},
// }
// Image_Globals={
//   load(path){img=new Image(path);img.src=path;return img},
// }
// Object.assign(Image.prototype,Image_Extensions) // merge into!
// Object.assign(Image,Image_Globals) // merge into!

// x=new Image('image-1116947-galleryV9-hufk-1116947.jpeg')
// }catch(ex){console.log(ex)}

imageToDataUri = function (image) {
  var canvas
  try {
    canvas = document.createElement('canvas');
  } catch (ex) {
    canvas = new Canvas()
  }
  canvas.width = image.width; // or 'naturalWidth' if you want a special/scaled size
  canvas.height = image.height; // or 'naturalHeight' if you want a special/scaled size
  canvas.getContext('2d').drawImage(image, 0, 0);
  return canvas.toDataURL('image/png')
  // Get raw image data :  dataUrl.replace(/^data:image\/(png|jpg);base64,/, ''));
}

File = class File {} // todo