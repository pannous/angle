#!/usr/local/bin/node
// "use strict"
let result
let used_operators
let used_ast_operators

the = require("./context");
require("./power_parser")
let {block,tokens} = require("./power_parser")
require("./english_tokens")
require("./ast")
require("./loops")
let extensions = require('./extensions')();
let exceptions = require('./exceptionz');
let context = require('./context.js');
let nodes = require('./nodes')
let {Variable, Argument} = require('./nodes')
// let Variable = nodes.Variable
// let Argument = nodes.Argument

function raise_not_matching(msg = null) {
	throw new NotMatching(msg)
}


function get(name) {
	if (name instanceof Name) {
		name = name.id;
	}
	if (name instanceof nodes.Variable) {
		name = name.name;
	}
	return new ast.Name({
		id: name,
		ctx: new Load()
	});
}

function parent_node() {
}


class Todo {
}

function _(x) {
	return token(x);
}

function __(x) {
	return tokens(x);
}


let remove_hash = {};

function remove_from_list(keywords0, excepty) {
	let good;
	good = keywords0;
	for (let x of excepty) {
		while (x.in(good)) {
			good = good.remove(x);
		}
	}
	return good;
}

function no_keyword_except(excepty = null) {
	let bad;
	if (!excepty) {
		excepty = [];
	}
	bad = remove_from_list(keywords, excepty);
	return must_not_start_with(bad);
}

function no_keyword() {
	return no_keyword_except([]);
}


function it() {
	tokens(result_words);
	return the.last_result;
}


class Interpretation {
}

function interpretation() {
	let i = new Interpretation();
	i.result = the.result;
	i.tree = the.result;
	i.error_position = error_position();
	i.methods = the.methods;
	i.ruby_methods = builtin_methods;
	i.variables = the.variables;
	i.svg = svg;
	return i;
};

function end_expression() {
	return (checkEndOfLine() || token(";"));
}

function raiseSyntaxError() {
	throw new SyntaxError("incomprehensible input");
}

function rooty() {
	// power_parser.
	block({
		multiple: true
	});
	return the.result;
}

function set_context(_context) {
	context = _context;
}

function packages() {
	tokens("package context gem library".split());
	return set_context(rest_of_line());
}

function javascript_require(dependency) {
	dependency = dependency.replace(".* ", "");
	return dependency;
}

function includes(dependency, type, version) {
	if (the.current_word.match(/\\.js$/)) {
		return javascript_require(dependency);
	}
	if (type && type.in("javascript script js".split())) {
		return javascript_require(dependency);
	}
}

function regexp(val = 0) {
	if (!val) {
		tokens(["regex", "regexp", "regular expression"]);
		val = the.string;
	}
	if (val.startsWith("r'")) {
		return new RegExp(val.slice(2, -1))
	} else if (val.startsWith("'")) {
		return new RegExp(val.slice(1, -1))
	} else if (val.startsWith("/")) {
		return new RegExp(val.slice(1, -1))
	}
	return new RegExp(val);
}

function package_version() {
	let c;
	maybe_token("with");
	c = maybe_tokens(comparison_words);
	tokens(["v", "version"]);
	c = (c || maybe_tokens(comparison_words));
	the.result = (c + " ") + regex_match("\\d(\\.\\d)*", the.string);
	maybe_tokens("or later");
	return the.result;
}


function operator() {
	return tokens(operators);
}

function isUnary(op) {
	todo("isUnary");
	return false;
}

function ast_operator(op) {
	if ((op instanceof cmpop) || (op instanceof BinOp)) {
		return op;
	}
	return ast.operator_map[op];
}

function fix_context(x) {
	if (x instanceof Variable) {
		x = ast.name(x.name);
	}
	return x;
}

function apply_op(stack, i, op) {
	let left, right;
	right = stack[(i + 1)];
	left = stack[(i - 1)];

	function replaceI12(stack, result0) {
		result = result0;
		stack[i + 1] = result;
		delete stack[i - 1];
		delete stack[i]
	}

	if (interpreting()) if ((op === "!") || (op === "not")) {
		stack[i] = [(!do_evaluate(right))];
		delete stack[i + 1]
	} else {
		replaceI12(stack, do_math(left, op, right))
	} else if ((op === "!") || (op === "not")) {
		result = ast.Not(right);
		stack[(i)] = [result];
		delete stack[i + 1];
		delete stack[i]
	} else {
		left = fix_context(left);
		right = fix_context(right);
		if (op instanceof ast.operator) {
			replaceI12(stack, new ast.BinOp(left, ast_operator(op), right));
		} else if (op.in(true_operators)) {
			replaceI12(stack, new ast.BinOp(left, ast_operator(op), right));
		} else if (op.in(comparison_words)) {
			replaceI12(stack, new ast.Compare(left, [ast_operator(op)], [right]));
		} else {
			replaceI12(stack, new ast.Compare(left, [ast_operator(op)], [right]));
		}
	}
	return result
}

function fold_algebra(stack) {

	used_operators = operators.filter(x => x.in(stack))
	used_ast_operators = Object.values(ast_operator_map).filter(x => stack.has(x))
	for (op of used_operators.plus(used_ast_operators)) {
		let i = 0
		while (i < stack.length) {
			if (stack[i] == op)
				result = apply_op(stack, i, op)
			i += 1
		}
	}
	stack = stack.filter(x => x)
	if ((stack.length > 1) && (used_operators.length > 0)) {
		throw new Error("NOT ALL OPERATORS CONSUMED IN %s ONLY %s".format(stack, used_operators));
	}
	return result//stack[0]
}

function algebra(val = null) {
	if (context.in_algebra) return false;
	if (!val) must_contain_before_({
		args: operators,
		before: (be_words + ["then", ",", ";", ":"])
	});
	val = val || maybe(value) || bracelet();
	let stack = [val];

	function lamb() {
		let neg, op, va;
		if (the.current_word.in(be_words) && context.in_args) return false;
		op = (maybe(comparation) || operator());
		// if (op === "=") {
		// 	throw NotMatching;
		// }
		neg = maybe_token("not");
		va = (maybe(value) || maybe(bracelet));
		context.in_algebra = true;
		va = (va || expression());
		if (va === ZERO) va = 0;
		stack.append(op);
		(neg ? stack.append(neg) : 0);
		stack.append(va);
		return (va || true);
	}

	star(lamb);
	context.in_algebra = false;
	the.result = fold_algebra(stack);
	if (the.result === false) the.result = FALSE;
	if (the.result === null) the.result = NONE;
	return the.result;
}

function read_block(type = null) {
	let block = [];
	_(type);
	while (true) {
		if (maybe(() => {
				return end_block(type);
			})) {
			break;
		}
		block.append(rest_of_line());
	}
	return block;
}

function read_xml_block(t = null) {
	let b;
	_("<");
	t = (t || word());
	if (maybe_token("/")) {
		return _(">");
	}
	_(">");
	b = read_xml_block();
	_("</");
	token(t);
	_(">");
	return b;
}

function html_block() {
	return read_xml_block("html");
}

function javascript_block() {
	let block;
	block = (maybe(read_block("script") || maybe(read_block("js"))) || read_block("javascript"));
	javascript.append(block.join(";\n"));
	return block;
}

function ruby_block() {
	return read_block("ruby");
}

function special_blocks() {
	return (maybe(html_block) || maybe(ruby_block) || javascript_block());
}

function is_a(x, type0) {
	let _type;
	_type = mapType(type0);
	debug(_type);
	if (is_string(_type)) {
		throw new Error("BAD TYPE %s" % type0);
	}
	if (x instanceof _type) {
		return true;
	}
	if ((x instanceof unicode) && (_type === types.StringType)) {
		return true;
	}
	if ((x instanceof unicode) && _type === xchar && x.length === 1) {
		return true;
	}
	if ((x instanceof unicode) && (_type === str)) {
		return true;
	}
	return (xx(x) instanceof _type);

}

function parse_integer(x) {
	if (!x) return 0
	x = x.replace(/([a-z])-([a-z])/, "$1+$2")  // WHOOOT???
	x = x.replace("last", "-1")  // index trick
	// x = x.replace("last", "0")  // index trick
	x = x.replace("first", "1")  // index trick
	x = x.replace("tenth", "10")
	x = x.replace("ninth", "9")
	x = x.replace("eighth", "8")
	x = x.replace("seventh", "7")
	x = x.replace("sixth", "6")
	x = x.replace("fifth", "5")
	x = x.replace("fourth", "4")
	x = x.replace("third", "3")
	x = x.replace("second", "2")
	x = x.replace("first", "1")
	x = x.replace("zero", "0")

	x = x.replace("4th", "4")
	x = x.replace("3rd", "3")
	x = x.replace("2nd", "2")
	x = x.replace("1st", "1")
	x = x.replace("(\d+)th", "\\1")
	x = x.replace("(\d+)rd", "\\1")
	x = x.replace("(\d+)nd", "\\1")
	x = x.replace("(\d+)st", "\\1")

	x = x.replace("a couple of", "2")
	x = x.replace("a dozen", "12")
	x = x.replace("ten", "10")
	x = x.replace("twenty", "20")
	x = x.replace("thirty", "30")
	x = x.replace("forty", "40")
	x = x.replace("fifty", "50")
	x = x.replace("sixty", "60")
	x = x.replace("seventy", "70")
	x = x.replace("eighty", "80")
	x = x.replace("ninety", "90")

	x = x.replace("ten", "10")
	x = x.replace("eleven", "11")
	x = x.replace("twelve", "12")
	x = x.replace("thirteen", "13")
	x = x.replace("fourteen", "14")
	x = x.replace("fifteen", "15")
	x = x.replace("sixteen", "16")
	x = x.replace("seventeen", "17")
	x = x.replace("eighteen", "18")
	x = x.replace("nineteen", "19")

	x = x.replace("ten", "10")
	x = x.replace("nine", "9")
	x = x.replace("eight", "8")
	x = x.replace("seven", "7")
	x = x.replace("six", "6")
	x = x.replace("five", "5")
	x = x.replace("four", "4")
	x = x.replace("three", "3")
	x = x.replace("two", "2")
	x = x.replace("one", "1")
	x = x.replace("dozen", "12")
	x = x.replace("couple", "2")

	// x = x.replace("½", "+.5");
	x = x.replace("½", "+1/2.0");
	x = x.replace("⅓", "+1/3.0");
	x = x.replace("⅔", "+2/3.0");
	x = x.replace("¼", "+.25");
	x = x.replace("¼", "+1/4.0");
	x = x.replace("¾", "+3/4.0");
	x = x.replace("⅕", "+1/5.0");
	x = x.replace("⅖", "+2/5.0");
	x = x.replace("⅗", "+3/5.0");
	x = x.replace("⅘", "+4/5.0");
	x = x.replace("⅙", "+1/6.0");
	x = x.replace("⅚", "+5/6.0");
	x = x.replace("⅛", "+1/8.0");
	x = x.replace("⅜", "+3/8.0");
	x = x.replace("⅝", "+5/8.0");
	x = x.replace("⅞", "+7/8.0");

	x = x.replace(" hundred thousand", " 100000")
	x = x.replace(" hundred", " 100")
	x = x.replace(" thousand", " 1000")
	x = x.replace(" million", " 1000000")
	x = x.replace(" billion", " 1000000000")
	x = x.replace("hundred thousand", "*100000")
	x = x.replace("hundred ", "*100")
	x = x.replace("thousand ", "*1000")
	x = x.replace("million ", "*1000000")
	x = x.replace("billion ", "*1000000000")
	return x
}

function nth_item(val = 0) {
	let l, n, set, type;
	set = maybe_token("set");
	n = (val || tokens(number_selectors + ["first", "last", "middle"]));
	n = parse_integer(n);
	if (n > 0) {
		n = (n - 1);
	}
	raiseEnd();
	maybe_tokens([".", "rd", "st", "nd"]);
	type = maybe_tokens(["item", "element", "object", "word", "char", "character"] + type_names);
	maybe_tokens(["in", "of"]);
	l = (do_evaluate(maybe(known_variable) || maybe(liste)) || quote());
	if (type.match(/^char/)) {
		the.result = "".join(l).__getitem__(n);
		return the.result;
	}
	else {
		if (is_string(l)) {
			l = l.split(" ");
		}
	}
	if ((l instanceof list) && type.in(type_names)) {
		l = l.map(x => is_a(x, type))
	}
	if (n > l.length) {
		throw new IndexError("%d > %d in %s[%d]".format(n, l.length, l, n));
	}
	the.result = l[n];
	if (context.in_condition) {
		return the.result;
	}
	if (set && _("to")) {
		val = endNode();
		the.result = do_evaluate(val);
		l[n] = the.result;
	}
	return the.result;
}


function must_contain_substring(param) {
	let current_statement = the.current_line.slice(the.current_offset).split([';', ':', '\n'])[0]
	if (!param.in(current_statement)) raise_not_matching("must_contain_substring(%s)" % param);
}


function close_bracket() {
	return _(")");
}

function empty_map() {
	_("{");
	_("}");
	if (interpreting()) {
		return EMPTY_MAP;
	}
	return new Expr(new Dict([], []));
}

let hash_assign = [":", "to", "=>", "->"];

function hash_map() {
	must_contain_before_({
		args: hash_assign,
		before: ["}"]
	});
	let z = (starts_with("{") ? regular_hash() : immediate_hash());
	return z;
}


function maybe_cast(_context) {
	let typ;
	if (!maybe_token("as")) {
		return false;
	}
	typ = typeNameMapped();
	return call_cast(_context, typ);
}

function maybe_algebra(_context) {
	let op, z;
	op = maybe_tokens(operators);
	if (!op) {
		return false;
	}
	z = expression();
	return do_call(_context, op, z);
}

function contains(token) {
	return token.in(the.current_line);
}

function contains_any(tokens) {
	for (let token of tokens) {
		if (token.in(the.current_line)) {
			return true;
		}
	}
}


function space() {
	if ((token(" ") || token("") !== null)) {
		return OK;
	} else {
		return false;
	}
}

function addMethodNames(f) {
	let args, f2, name, obj;
	if (f.arguments.length > 0) {
		obj = f.arguments[0];
		if (obj.name.length === 1) {
			return f;
		}
		if (!obj.preposition) {
			name = ((f.name + " ") + obj.name);
			args = f.arguments.slice(1);
			f2 = new FunctionDef({
				name: name,
				arguments: args,
				return_type: f.return_type,
				body: f.body
			});
			the.methods[name] = f2;
			the.method_names.insert(0, name);
			addMethodNames(f2);
			return f2;
		}
	}
	return f;
}


function execute(command) {
	// import * as os from 'os';
	return os.popen(command).read();
}


function isStatementOrExpression(b) {
	return (b instanceof ast.stmt) || (b instanceof ast.Expr);
}


function future_event() {
	if (the.current_word.endswith("ed")) {
		return word();
	}
}

function once_trigger() {
	let b, c;
	tokens(once_words);
	no_rollback();
	dont_interpret();
	c = (maybe(future_event) || condition());
	maybe_token("then");
	b = action_or_block();
	return interpretation.add_trigger(c, b);
}

function _do() {
	return maybe(() => {
		return _("do");
	});
}

function action_once() {
	let b, c;
	if (!_do()) {
		must_contain(once_words);
	}
	no_rollback();
	maybe_newline();
	b = action_or_block();
	tokens(once_words);
	c = condition();
	end_expression();
	interpretation.add_trigger(c, b);
}

function once() {
	return (maybe(once_trigger) || action_once());
}

function verb_node() {
	let v;
	v = verb;
	nod;
	if (!v.in(methods)) {
		throw new UnknownCommandError("no such method: " + v);
	}
	return v;
}

function spo() {
	let o, p, s;
	if (!use_wordnet) {
		return false;
	}
	if (!use_wordnet) {
		throw new NotMatching("use_wordnet==false");
	}
	s = endNoun;
	p = verb;
	o = nod;
	if (interpreting()) {
		return do_call(s, p, o);
	}
}

function print_variables() {
	for (let [v, k] of variables.items()) {
		console.log(v + "=" + k);
	}
}

function is_object_method(method_name) {
	let object_method;
	if (!method_name.toString().in(global)) {
		return false;
	}
	object_method = global[method_name.toString()];
	return object_method;
}

function has_object(m) {
	return m.toString().in(global);
}

function get_module(module) {
	try {
		return sys.modules[module];
	} catch (e) {
		// import * as importlib from 'importlib';
		importlib.import_module(module);
		return sys.modules[module];
	}
}

function first_is_self(method) {
	let args, defaults, varargs, varkw;
	try {
		[args, varargs, varkw, defaults] = inspect.getargspec(method);
		return (args[0] === "self");
	} catch (e) {
		return false;
	}
}

function has_args(method, clazz = object, assume = 0) {
	if (!method) raise_not_matching("method has_args")
	let alle, args, convention, defaults, doku, is_builtin, num, varargs, varkw;
	if (method instanceof Function) return method.length
	if (method instanceof FunctionDef) return method.length
	if (method.in(["increase", "++", "--"])) return 0;
	method = findMethod(clazz, method);
	try {
		is_builtin = (Object.getPrototypeOf(method) === types.BuiltinFunctionType) || (Object.getPrototypeOf(method) === types.BuiltinMethodType);
		if (is_builtin) {
			doku = method.__doc__;
			if (doku) {
				convention = doku.split("\n")[0];
				num = convention.split(",").length;
				return num;
			}
			warn("BuiltinMethodType => no idea about the method arguments!");
			return assume;
		}
		[args, varargs, varkw, defaults] = inspect.getargspec(method);
		alle = (args.length + ((defaults && defaults.length) || 0) + (varkw && varkw.length) || 0);
		return alle;
	} catch (e) {
		return (assume || 0);
	}
}

function c_method() {
	return tokens(c_methods);
}

function builtin_method() {
	let m, w;
	w = word;
	if (!w) {
		raise_not_matching("no word");
	}
	m = is_object_method(w);
	return m;
}

function is_method(name) {
	return (name.in(the.method_names) || maybe(verb));
}

function import_module(module_name) {
	let module, moduleMethods;
	try {
		console.log("TRYING MODULE " + module_name);
		// import * as importlib from 'importlib';
		importlib.import_module(module_name);
		module = sys.modules[module_name];
		moduleMethods = the.moduleMethods[module_name];
		return [module, moduleMethods];
	} catch (e) {
		throw e;
	}
}

function subProperty(_context) {
	let ext, properties, property;
	maybe_token(".");
	properties = dir(_context);
	if (_context && Object.getPrototypeOf(_context).in(context.extensionMap)) {
		ext = context.extensionMap[Object.getPrototypeOf(_context)];
		properties += dir(ext);
	}
	property = maybe_tokens(properties);
	if (!property || (property instanceof Function) || is_method(property)) {
		return [_context, property];
	}
	property = (maybe_token(".") && subProperty(property) || property);
	return [property, null];
}

function true_method(obj = null) {
	let ex, longName, module, moduleMethods, name, property, variable, xmodule, xvariable;
	ex = english_operators;
	must_not_start_with(keyword_except_english_operators)
	must_not_start_with(auxiliary_verbs);
	xmodule = maybe_tokens(the.moduleNames);
	xvariable = maybe_token(keys(the.variables));
	if (xmodule) {
		[module, moduleMethods] = import_module(xmodule);
		[obj, name] = subProperty(module);
		if (obj) {
			moduleMethods += dir(obj);
		}
		if (!name) {
			name = maybe_tokens(moduleMethods);
		}
	} else if (xvariable) {
		variable = the.variables[xvariable];
		if (variable.value instanceof Function) {
			name = variable.value.__name__;
		} else {
			if (!(typeof variable.value === "string" || (variable.value instanceof String))) {
				raise_not_matching("not a method: %s" % variable.value);
			}
			name = findMethod(nil, variable.value);
			if (!name) [obj, name] = subProperty(variable.value);
		}
	} else {
		[obj, property] = subProperty(obj);
		name = (maybe_tokens(the.method_names) || maybe(verb));
	}
	if (!name) throw new NotMatching("no method found");
	if (maybe_tokens(article_words)) {
		obj = " ".join(one_or_more(word));
		longName = ((name + " ") + obj);
		if (longName.in(the.method_names)) {
			name = longName;
		}
		if (obj.in(the.variables)) {
			obj = the.variables[obj];
		}
	}
	return [xmodule, obj, name];
}

function method_call(obj = null) {
	let args, assume_args, method, method_name, modul, more, start_brace;
	[modul, obj, method_name] = true_method(obj);
	if (!method_name) raise_not_matching("no method_call")
	context.in_algebra = false;
	start_brace = maybe_tokens(["(", "{"]);
	if (start_brace) {
		no_rollback();
	}
	if ((modul || obj) || is_object_method(method_name)) {
		obj = (obj || null);
	} else {
		maybe_token("of");
		obj = maybe(the.classes) || maybe(the.moduleNames);
		if (!context.in_args) {
			obj = (obj || maybe(liste));
		}
		maybe_token(",");
	}
	method = findMethod(obj, method_name);
	assume_args = true;
	args = null;
	if (has_args(method, (modul || obj), assume_args)) {
		context.in_args = true;
		args = [];

		// noinspection JSAnnotator
		function call_args() {
			let arg;
			if (args.length > 0) {
				maybe_tokens([",", "and"]);
			}
			if (starts_with(";")) {
				return false;
			}
			arg = call_arg();
			if (arg instanceof list) {
				args.extend(arg);
			} else {
				args.append(arg);
			}
			return args;
		}

		star(call_args);
		if (!args && !context.use_tree && !self_modifying(method)) {
			if (context.use_tree) {
				args = obj;
			} else {
				args = do_evaluate(obj);
			}
			obj = null;
		}
	} else {
		more = maybe_token(",");
		if (more) {
			obj = ([obj] + liste(false));
		}
	}
	method = findMethod(obj, method, args);
	if (!method && interpreting()) raise_not_matching("no such method: " + method_name)
	context.in_args = false;
	if (start_brace === "(") {
		_(")");
	}
	if (start_brace === "[") {
		_("]");
	}
	if (start_brace === "{") {
		_("}");
	}
	if (!interpreting()) {
		if ((method_name === "puts") || (method_name === "print")) {
			return new ast.Print({
				dest: null,
				values: args,
				nl: true
			});
		}
		return new nodes.FunctionCall({
			func: method,
			arguments: args,
			object: obj
		});
	}
	the.result = do_call(obj || null, method, args || null, method_name);
	return the.result;
}

function bla() {
	return tokens(bla_words);
}

function applescript() {
	// import * as platform from 'platform';
	let app;
	_("tell");
	tokens(["application", "app"]);
	no_rollback();
	app = quote;
	the.result = ("tell application \"%s\"" % app);
	if (maybe_token("to")) {
		the.result += (" to " + rest_of_line());
	} else {
		while (the.string && (!the.current_line.contains("end tell"))) {
			the.result += (rest_of_line() + "\n");
		}
	}
	if (!(platform.system() === "Darwin")) {
		throw new Error("tell application ");
	}
	if (interpreting()) {
		the.result = execute("/usr/bin/osascript -ss -e $'%s'" % the.result);
	}
	return the.result;
}


function argumentz() {
	return star(param);
}

function maybe_token(x) {
	if (x === the.current_word) {
		next_token();
		return x;
	}
	return false;
}


function neu() {
	let clazz;
	maybe_tokens(["create", "init"]);
	maybe(articles)
	_("new");
	clazz = class_constant();
	return do_call(clazz, "__init__", arguments());
}


function breaks() {
	return tokens(flow_keywords);
}


function action_or_expression(fallback = null) {
	let ok = maybe(action);
	if (ok) return ok;
	return expression(fallback);
}

function expression_or_block() {
	return action_or_block();
}

function action_or_block(started = false) {
	let _start, ab;
	_start = (maybe_tokens(start_block_words) || started);
	if (_start) {
		if (maybe_newline() || must_contain(done_words, false)) {
			ab = block();
		} else {
			ab = action_or_expression();
		}
	} else {
		if (maybe_newline()) {
			ab = block();
		} else {
			maybe_indent();
			ab = action_or_expression();
		}
	}
	if ((_start === "then") && (the.current_word === "else")) {
		return ab;
	}
	(maybe_newline() || end_block(_start));
	return ab;
}

function close_tag(type) {
	_("</");
	_(type);
	_(">");
	return type;
}

function prepare_named_args(args) {
	// import * as copy from 'copy';
	let context_variables, v;
	context_variables = copy.copy(the.variables);
	if (!(args instanceof dict)) {
		return {
			"arg": args
		};
	}
	for (let arg of args.items()) {
		if (arg.in(context_variables)) {
			v = context_variables[arg];
			if (v instanceof Variable) {
				v.value = val;
			}
			context_variables[arg.toString()] = val;
		} else {
			context_variables[arg.toString()] = val;
		}
	}
	return context_variables;
}

function evalast(b, args = {}) {
	args = prepare_named_args(args);
	the.result = pyc_emitter.evalast(b, args, {
		run: true
	});
	return the.result;
}

function do_execute_block(b, args = {}) {
	let block_parser, variableValues;
	if (!interpreting()) {
		return;
	}
	if (!b) {
		return false;
	}
	if (b === true) {
		return true;
	}
	if (b instanceof Function) {
		return do_call(null, b, args);
	}
	if (b instanceof FunctionCall) {
		return do_call(b.object, b.name, (args || b.arguments));
	}
	if (b instanceof ast.AST) {
		return evalast(b, args);
	}
	if ((b instanceof list) && (b[0] instanceof ast.AST)) {
		return evalast(b, args);
	}
	if (!is_string(b)) {
		return b;
	}
	block_parser = new EnglishParser();
	block_parser.variables = variables;
	block_parser.variableValues = variableValues;
	try {
		console.log("using old interpretation recursion");
		the.result = block_parser.parse(b);
	} catch (e) {
		error(traceback.extract_stack());
	}
	variableValues = block_parser.variableValues;
	return the.result;
}

function datetime() {
	let _kind, _to, _unit, n;
	must_contain(time_words);
	_kind = tokens(event_kinds);
	no_rollback();
	maybe_tokens(["around", "about"]);
	n = (maybe(number) || 1);
	_to = maybe(() => {
		return tokens(["to", "and"]);
	});
	if (_to) {
		_to = number();
	}
	_unit = tokens(time_words);
	_to = (_to || maybe_tokens(["to", "and"]));
	if (_to) {
		_to = (_to || maybe(number));
	}
}

function collection() {
	return (maybe(ranger) || maybe(known_variable) || action_or_expression());
}

function for_i_in_collection() {
	let b, c, v;
	must_contain("for");
	maybe_token("repeat");
	maybe_tokens(["for", "with"]);
	maybe_token("all");
	v = variable();
	maybe_tokens(["in", "from"]);
	c = collection();
	b = action_or_block();
	for (let i of c) {
		v.value = i;
		the.result = do_execute_block(b);
	}
	return the.result;
}

function assure_same_type(var_, _type) {
	let oldType;
	if (var_.name.in(the.variableTypes)) {
		oldType = (the.variableTypes[var_.name] || var_.value && Object.getPrototypeOf(var_.value));
	} else {
		if (var_.type) {
			oldType = var_.type;
		} else {
			oldType = null;
		}
	}
	let types_match = !oldType || !_type || oldType == _type || oldType == _type.prototype || oldType.prototype == _type
	if (_type === "Unknown")
		return;
	if (_type instanceof ast.AST) {
		warn("TYPE AST");
		return;
	}
	if (!isType(oldType)) {
		warn("NOT A TYPE %s" % oldType);
		return;
	}
	if (oldType == String) {
	}
	if (_type == ast.AST) {
		console.log("skipping type check for AST expressions (for now)!");
		return;
	}
	if (oldType && _type && !(oldType == _type)) {
		throw new WrongType(var_.name + " has type " + oldType.name + ", can't set to " + _type);
	}
	if (oldType && var_.type && !(oldType == var_.type)) {
		throw new WrongType(var_.name + " has type " + oldType.name + ", cannot set to " + var_.type.name);
	}
	if (_type && var_.type && !(var_.type == _type || _type == var_.type)) {
		throw new WrongType(var_.name + " has type " + var_.type.name + ", Can't set to " + _type);
	}
	var_.type = _type;
}

function assure_same_type_overwrite(var_, val, auto_cast = false) {
	let oldType, oldValue, wrong_type;
	if (!val) {
		return;
	}
	oldType = var_.type;
	oldValue = var_.value;
	let val_type = val && Object.getPrototypeOf(val) || null
	if (val instanceof ast.FunctionCall) {
		if ((val.return_type !== "Unknown") && (val.return_type !== oldType))
			throw new WrongType("OLD: %s %s VS %s return_type: %s ".format(oldType, oldValue, val, val.return_type));
	} else if (oldType) {
		try {
			wrong_type = new WrongType("OLD: %s %s VS %s %s".format(oldType, oldValue, val_type, val));
			let types_match = (oldType == val_type || oldType == val_type.prototype || oldType.prototype == val_type);
			if (!types_match) {
				if (auto_cast) return do_cast(val, oldType);
				throw wrongType;
			}
		} catch (e) {
			if (!(val_type == ast.AST)) {
				throw wrong_type;
			} else {
				console.log("skipping type check for AST expressions (for now)!");
			}
		}
	}
	if ((var_.final && var_.value) && (!(val === var_.value))) {
		throw new ImmutableVaribale("OLD: %s %s VS %s %s".format(oldType, oldValue, val_type, val));
	}
	var_.value = val;
}

function do_get_class_constant(c) {
	try {
		for (let module of sys.modules) {
			if (c in module) return module[c];
		}
	} catch (e) {
		console.log(e);
	}
}

function class_constant() {
	let c;
	c = word;
	return do_get_class_constant(c);
}

function get_obj(o) {
	if (!o) {
		return false;
	}
	eval(o);
}

function simpleProperty() {
	let module, prop, x;
	must_contain_before(".", (special_chars + keywords));
	module = token(the.moduleNames);
	module = get_module(module);
	_(".");
	prop = word();
	if (interpreting()) {
		x = module[prop];
		return x;
	}
	return new ast.Attribute(new ast.Name(module, new ast.Load()), prop, new ast.Load());
}

function property() {
	let container, of_, properti, sett;
	must_contain_before([".", "'s", "of"], special_chars);
	let var_ = variable();
	container = var_.value;
	of_ = __`.`;
	no_rollback();
	properti = word();
	if (of_ === "of") {
		[container, properti] = [properti, container];
	}
	sett = (maybe_token("=") && expression());
	if (sett) {
		if (interpreting()) {
			if (container instanceof dict) {
				container[properti] = sett;
			} else {
				container[properti] = sett;
			}
			return sett;
		}
		return new Assign([new Attribute(container, properti, (sett && new Store() || new Load())), sett]);
	}
	if (interpreting()) {
		if (container instanceof dict) {
			return container[properti];
		} else {
			return container[properti];
		}
	}
	return new Attribute(container, properti, (sett && new Store() || new Load()));
}


function alias(var_ = null) {
	let a, ali, f;
	if (!var_) {
		must_contain(["alias", ":="]);
		ali = _("alias");
		var_ = variable(false, {
			ctx: new ast.Store()
		});
		if (look_1_ahead("(")) {
			return method_definition(var_.name);
		}
		(ali || be());
	}
	dont_interpret();
	a = rest_of_line();
	add_variable(var_, a);
	var_.type = "alias";
	if (context.use_tree) {
		f = new FunctionDef({
			name: var_.name,
			body: a
		});
		addMethodNames(f);
		return f;
	}
	return var_;
}

function add_variable(var_, val, mod = null, _type = null) {
	if (!(var_ instanceof Variable)) {
		console.log("NOT a Variable: %s" % var_);
		return var_;
	}
	var_.typed = (_type || var_.typed) || ("typed" === mod);
	if (val instanceof ast.FunctionCall) {
		assure_same_type(var_, val.returns);
	} else {
		assure_same_type(var_, (_type || val && Object.getPrototypeOf(val)));
		assure_same_type_overwrite(var_, val);
	}
	if ((!var_.name.in(keys(variableValues)) || (mod !== "default"))) {
		the.variableValues[var_.name] = val;
		the.variables[var_.name] = var_;
		var_.value = val;
	}
	the.token_map[var_.name] = known_variable;
	var_.type = (_type || val && Object.getPrototypeOf(val));
	var_.final = const_words.has(mod)
	var_.modifier = mod;
	the.variableTypes[var_.name] = var_.type;
	return var_;
}

function go_thread() {
	let a, body, thread;
	tokens(["go", "start", "thread"]);
	must_not_start_with(prepositions);
	dont_interpret();
	a = action_or_block();
	if (interpreting()) {
		// import * as threading from 'threading';
		thread = new threading.Thread({
			target: do_execute_block,
			args: [a]
		});
		the.threads.append(thread);
		thread.start();
	} else {
		body = [];
		if (!(a instanceof list)) {
			a = [a];
		}
		body.append(new ast.Import([ast.alias({
			name: "threading",
			asname: null
		})]));
		body.append(new FunctionDef({
			name: "_tmp",
			body: a
		}));
		body.append(ast.assign("_t", ast.call_attribute("threading", "Thread", {
			target: ast.name("_tmp")
		})));
		body.append(ast.call_attribute("_t", "start"));
		return body;
	}
	return OK;
}

function isType(x) {
	return is_type(x) || type_names.has(x)
}

function current_node() {
}

function current_context() {
}

function variable(a = null, ctx = ast.Load, isParam = false) {
	let all, name, oldVal, p, param, typ;
	a = (a || maybe_tokens(article_words));
	if (a !== "a") a = null;
	must_not_start_with(keywords);
	must_not_start_with(the.method_names)
	typ = maybe(typeNameMapped);
	p = maybe_tokens(possessive_pronouns);
	no_keyword();
	all = one_or_more(word);
	if (empty(all)) raise_not_matching();
	name = " ".join(all);
	if (!typ && all.length > 1 && isType(all[0])) {
		name = all.slice(1, (-1)).join(" ");
	}
	if (p) {
		name = ((p + " ") + name);
	}
	name = name.strip();
	if (!name) throw new NotMatching("no variable")
	if (isParam || (ctx instanceof ast.Param)) {
		param = new Variable({
			name: name,
			type: (typ || null),
			ctx: ctx
		});
		the.params[name] = param;
		return param;
	}
	if (ctx instanceof ast.Load || ctx == ast.Load) {
		if (name.in(the.variables)) {
			return the.variables[name];
		}
		if (name.in(the.params)) {
			return the.params[name];
		} else {
			throw new UndeclaredVariable("Unknown variable " + name);
		}
	}
	if (ctx instanceof ast.Store || ctx == ast.Store) {
		if (name.in(the.variables)) {
			return the.variables[name];
		}
		oldVal = null;
		the.result = new Variable({
			name: name,
			type: (typ || null),
			scope: null,
			module: current_context(),
			value: oldVal,
			ctx: ctx
		});
		the.variables[name] = the.result;
		return the.result;
	}
	throw new Error("Unknown variable context " + ctx);
}

let word_regex = "^\s*[a-zA-Z]+[\w_]*";

function word(include = null) {
	let current_value, match;
	maybe_tokens(article_words);
	if (!include) {
		include = [];
	}
	no_keyword_except(include);
	raiseNewline();
	match = the.current_word.match(word_regex);
	if (match) {
		current_value = the.current_word;
		next_token();
		return current_value;
	}
	raise_not_matching("word");
}

function flatten(words) {
	// todo("flatten")
	return words
}

function must_not_contain(words, before = ";") {
	let old;
	old = the.current_token;
	words = flatten(words);
	while (!checkEndOfLine() && the.current_word !== ";" && the.current_word !== before) {
		for (let w of words)
			if (w === the.current_word)
				throw new MustNotMatchKeyword(w);
		next_token();
	}
	set_token(old);
	return OK;
}


function todo(x = "") {
	throw new NotImplementedError("NotImplementedError: " + x);
}

function toString(x) {
	if (x.toString) return x.toString()
	if (x.to_string) return x.to_string()
	if (x.to_s) return x.to_s()
	if (x.name) return x.name
	if (x.__str__) return x.__str__()
	if (x.__repr__) return x.__repr__()
	return `${x}`
}

function do_cast(x, typ) {
	if (!typ) return x
	if (typeof typ === "number" || (typ instanceof Number) || typ == Number || typ == Number.prototype) {
		return float_(x);
	}
	// if (typ === "int") {}
	typ = typ.toLowerCase()
	if (typ == String || typ == String.prototype) return toString(x)();
	if (typ === "int") return int(x);
	if (typ === "integer") return int(x);
	if (typ === "double") return int(x);
	if (typ === "float") return parseFloat(x);
	if (typ === "real") return parseFloat(x);
	if (typ === "str") return toString(x)();
	if (typ === "string") return toString(x)();
	throw new WrongType("CANNOT CAST: %s (%s) TO %s ".format(x, Object.getPrototypeOf(x), typ));
}

function call_cast(x, typ) {
	if (interpreting()) {
		return do_cast(x, typ);
	}
	if (typ instanceof type) {
		typ = typ.__name__;
	}
	return new FunctionCall({
		name: typ,
		arguments: x
	});
}


function article() {
	tokens(article_words);
}

function number_or_word() {
	(maybe(number) || word());
}

function param(position = 1) {
	let a, pre;
	pre = (maybe_tokens(prepositions) || null);
	a = variable({
		a: null,
		isParam: true
	});
	return new Argument({
		preposition: pre,
		name: a.name,
		type: a.type,
		position: position
	});
}

function call_arg(position = 1) {
	let name, pre, type, value;
	pre = (maybe_tokens(prepositions) || "");
	maybe_tokens(article_words);
	type = maybe(typeNameMapped);
	if (look_1_ahead("=")) {
		name = maybe(word);
		maybe_token("=");
	} else {
		name = null;
	}
	value = expression({
		fallback: null,
		resolve: false
	});
	if (value instanceof Variable) {
		name = value.name;
		type = (type || value.type);
	}
	return new Argument({
		"preposition": pre,
		"name": name,
		"type": type,
		"position": position,
		"value": value
	});
}

function compareNode() {
	let c, right;
	c = comparison_word();
	if (!c) {
		throw new NotMatching("NO comparison");
	}
	if (c === "=") {
		throw new NotMatching("compareNode = not allowed");
	}
	right = endNode();
	return right;
}

function whose() {
	_("whose");
	endNoun();
	return compareNode();
}

function that_do() {
	let comp, s;
	tokens(["that", "who", "which"]);
	star(adverb);
	comp = verb;
	maybe_token("s");
	s = star(() => {
		return (maybe(adverb) || maybe(preposition) || maybe(endNoun));
	});
	return comp;
}

function more_comparative() {
	tokens(["more", "less", "equally"]);
	return adverb();
}

function as_adverb_as() {
	let a;
	_("as");
	a = adverb();
	_("as");
	return a;
}


function null_comparative() {
	let c;
	verb();
	c = comparative();
	endNode();
	if (c.startsWith("more") || c.ends_with("er")) {
		return c;
	}
}

function than_comparative() {
	comparative();
	_("than");
	return (maybe(adverb) || endNode());
}

function comparative() {
	let c, comp;
	c = (maybe(more_comparative) || adverb);
	if ((c.startsWith("more") || maybe(() => {
			return c.ends_with("er");
		}))) {
		comp = c;
	}
	return c;
}

function that_are() {
	let comp;
	tokens(["that", "which", "who"]);
	be();
	comp = maybe(adjective);
	(comp || maybe(compareNode) || gerund());
	return comp;
}

function that_object_predicate() {
	let s;
	tokens(["that", "which", "who", "whom"]);
	(maybe(pronoun) || endNoun());
	verbium();
	s = star(() => {
		return (maybe(adverb) || maybe(preposition) || maybe(endNoun));
	});
	return s;
}

function that() {
	let filter;
	filter = (maybe(that_do) || maybe(that_are) || whose());
	return filter;
}

function where() {
	tokens(["where"]);
	return condition();
}

function selector() {
	let x;
	if (checkEndOfLine()) {
		return;
	}
	x = maybe(compareNode) || maybe(where) || maybe(that) || maybe(token("of") && endNode) || preposition && nod;
	if (context.use_tree) {
		return parent_node();
	}
	return x;
}

function verb_comparison() {
	let comp;
	star(adverb);
	comp = verb();
	maybe(preposition);
	return comp;
}

function comparison_word() {
	let comp;
	comp = (maybe(verb_comparison) || comparation());
	return comp;
}

function comparation() {
	let _not, comp, eq, start;
	eq = maybe_tokens(be_words);
	maybe_token("all");
	start = pointer();
	maybe_tokens(["either", "neither"]);
	_not = maybe_tokens(["not"]);
	maybe(adverb);
	if (eq) {
		comp = maybe_tokens(comparison_words);
	} else {
		comp = tokens(comparison_words);
		no_rollback();
	}
	if (eq) {
		maybe_token("to");
	}
	maybe_tokens(["and", "or", "xor", "nor"]);
	maybe_tokens(comparison_words);
	maybe_token("than");
	comp = (comp || eq);
	if (context.use_tree) {
		comp = ast.operator_map[comp];
	}
	return comp
}

function either_or() {
	let v;
	maybe_tokens(["be", "is", "are", "were"]);
	tokens(["either", "neither"]);
	maybe(comparation);
	v = value();
	maybe_tokens(["or", "nor"]);
	maybe(comparation);
	return v;
}

function is_comparator(c) {
	let ok;
	ok = c.in(comparison_words);
	ok = (ok || c.in(class_words));
	ok = (ok || (c instanceof ast.cmpop));
	return ok;
}

function check_list_condition(quantifier, left, comp, right) {
	let count, min, negated;
	try {
		count = 0;
		comp = comp.strip();
		for (let item of left) {
			if (is_comparator(comp)) {
				the.result = do_compare(item, comp, right);
			}
			if (!is_comparator(comp)) {
				the.result = do_call(item, comp, right);
			}
			if ((!the.result) && quantifier.in(["all", "each", "every", "everything", "the whole"])) {
				break;
			}
			if (the.result && quantifier.in(["either", "one", "some", "few", "any"])) {
				break;
			}
			if (the.result && quantifier.in(["no", "not", "none", "nothing"])) {
				negated = (!negated);
				break;
			}
			if (the.result) {
				count = (count + 1);
			}
		}
		min = (left.length / 2);
		if ((quantifier === "most") || (quantifier === "many")) {
			the.result = (count > min);
		}
		if (quantifier === "at least one") {
			the.result = (count >= 1);
		}
		if (negated) {
			the.result = (!the.result);
		}
		if (!the.result) {
			verbose("List condition not met %s %s %s".format(left, comp, right));
		}
		return the.result;
	} catch (e) {
		if (e instanceof IgnoreException) {
			error(e);
		} else {
			throw e;
		}
	}
	return false;
}

function check_condition(cond = null, negate = false) {
	let comp, left, right;
	if ((cond === true) || (cond === "True")) {
		return true;
	}
	if ((cond === false) || (cond === "False")) {
		return false;
	}
	if (cond instanceof ast.BinOp) {
		cond = new Compare({
			left: cond.left,
			comp: cond.op,
			right: cond.right
		});
	}
	if (cond instanceof Variable) {
		return cond.value;
	}
	if ((cond === null) || (!(cond instanceof Compare))) {
		throw new InternalError("NO Condition given! %s" % cond);
	}
	try {
		left = cond.left;
		right = cond.right;
		comp = cond.comp;
		if (!comp) {
			return false;
		}
		if (left && is_string(left)) {
			left = left.strip();
		}
		if (right && is_string(right)) {
			right = right.strip();
		}
		if (is_string(comp)) {
			comp = comp.strip();
		}
		if (is_comparator(comp)) {
			the.result = do_compare(left, comp, right);
		} else {
			the.result = do_call(left, comp, right);
		}
		if (negate) {
			the.result = (!the.result);
		}
		if (!the.result) {
			verbose("condition not met %s %s %s".format(left, comp, right));
		}
		verbose("condition met %s %s %s".format(left, comp, right));
		return the.result;
	} catch (e) {
		if (e instanceof IgnoreException) {
			error(e);
		} else {
			throw e;
		}
	}
	return false;
}

function element_in() {
	let n;
	must_contain_before(["of", "in"], special_chars);
	n = maybe(noun);
	tokens(["in", "of"]);
	return n;
}

function get_type(object1) {
	todo("get_type");
}

function method_dir(left) {
	let object1;
	object1 = do_evaluate(left);
	if (interpreting()) {
		return dir(object1);
	}
	return get_type(object1).__dict__;
}

function condition_new() {
	let c;
	context.in_condition = true;
	maybe_token("either");
	c = expression();
	context.in_condition = false;
	return c;
}

function condition() {
	let brace, comp, cond, filter, left, negate, negated, quantifier, right, start, use_verb;
	start = pointer();
	brace = maybe_token("(");
	maybe_token("either");
	negated = maybe_token("not");
	if (negated) {
		brace = (brace || maybe_token("("));
	}
	quantifier = maybe_tokens(quantifiers);
	filter = null;
	if (quantifier) {
		filter = (maybe(element_in) || maybe_tokens(["of", "in"]));
	}
	context.in_condition = true;
	left = action_or_expression(quantifier);
	if (left instanceof ast.BinOp) {
		left = new Compare({
			left: left.left,
			comp: left.op,
			right: left.right
		});
	}
	if (starts_with("then")) {
		if (quantifier.in(negative_quantifiers)) {
			return (!left);
		}
		return left;
	}
	comp = use_verb = maybe(verb_comparison);
	if (!use_verb) {
		comp = maybe(comparation);
	}
	if (comp) {
		right = action_or_expression(null);
	}
	if (brace) {
		_(")");
	}
	context.in_condition = false;
	if (!comp) {
		return left;
	}
	negate = negated;
	if ((left instanceof list) && (!(right instanceof list))) {
		quantifier = (quantifier || "all");
	}
	cond = new Compare({
		left: left,
		comp: comp,
		right: right
	});
	if (interpreting()) {
		if (quantifier) {
			if (negate) {
				return (!check_list_condition(quantifier, left, comp, right));
			} else {
				return check_list_condition(quantifier, left, comp, right);
			}
		}
		if (negate) {
			return (!check_condition(cond));
		} else {
			return check_condition(cond);
		}
	} else {
		return cond;
	}
}

function condition_tree(recurse = true) {
	let brace, c, cs, negate;
	brace = maybe_token("(");
	maybe_token("either");
	negate = maybe_token("neither");
	if (brace) {
		c = condition_tree(false);
	} else {
		c = condition();
	}
	cs = [c];

	function lamb() {
		let c2, op;
		op = tokens(["and", "or", "nor", "xor", "nand", "but"]);
		if (recurse) {
			c2 = condition_tree(false);
		}
		if (!interpreting()) {
			return current_node;
		}
		if (op === "or") {
			cs[0] = (cs[0] || c2);
		}
		if ((op === "and") || (op === "but")) {
			cs[0] = (cs[0] && c2);
		}
		if (op === "nor") {
			cs[0] = (cs[0] && (!c2));
		}
		return (cs[0] || false);
	}

	star(lamb);
	if (brace) {
		_(")");
	}
	return cs[0];
}

function otherwise() {
	let e, pre;
	maybe_newline();
	must_contain(["else", "otherwise"]);
	pre = maybe_tokens(["else", "otherwise"]);
	maybe_token(":");
	e = expression();
	(!pre) || (maybe_tokens(["else", "otherwise"]) && newline());
	return e;
}

function loveHateTo() {
	maybe_tokens(["would", "wouldn't"]);
	maybe_tokens(["do", "not", "don't"]);
	tokens(["want", "like", "love", "hate"]);
	return _("to");
}

function gerundium() {
	return the.current_word.endswith("ing");
}

function verbium() {
	return (maybe(comparison_word) || (verb() && adverb()));
}

function resolve_netbase(n) {
	return n;
}

function the_noun_that() {
	let criterium, n;
	maybe(articles);
	n = noun();
	if (!n) {
		raise_not_matching("no noun");
	}
	if (the.current_word === "that") {
		criterium = star(selector);
		if (criterium && interpreting()) {
			n = filter(n, criterium);
		} else {
			n = resolve_netbase(n);
		}
	} else {
		if (n.in(the.variables)) {
			return the.variables[n];
		}
		if (n.in(the.classes)) {
			return the.classes[n];
		}
		raise_not_matching("only 'that' filtered nouns for now!");
		throw new Error("Undefined: " + n);
	}
	return n;
}

function const_defined(c) {
	if (c === "Pass") {
		return false;
	}
	if (c.in(context.moduleClasses)) {
		return true;
	}
	return false;
}

function classConstDefined() {
	let c;
	try {
		c = word().capitalize();
		if (!const_defined(c)) {
			throw new NotMatching("Not a class Const");
		}
	} catch (e) {
		if (e instanceof IgnoreException) {
			throw new NotMatching();
		} else {
			throw e;
		}
	}
	if (interpreting()) {
		c = do_get_class_constant(c);
	}
	if (!c) {
		throw new NotMatching();
	}
	return c;
}

function mapType(x0) {
	let x = x0.lower();
	if (x === "str") return String
	if (x === "string") return String;
	if (x === "char") return String
	if (x === "character") return String
	if (x === "letter") return String
	if (x === "word") return String
	if (x === "name") return String
	if (x === "label") return String
	if (x === "lable") return String
	if (x === "type") return Function // todo
	if (x === "int") return Number;
	if (x === "integer") return Number;
	if (x === "long") return Number;
	if (x === "double") return Number;
	if (x === "real") return Number;
	if (x === "float") return Number;
	if (x === "number") return Number;
	if (x === "fraction") return Number;
	if (x === "rational") return Number;
	if (x === "object") return Object;
	if (x === "dict") return Object;// damn JS!
	if (x === "dictionary") return Object;
	if (x === "map") return Object;
	if (x === "hash") return Object;
	if (x === "hashmap") return Object;
	if (x === "hashtable") return Object;
	if (x === "vector") return Array;
	if (x === "array") return Array;
	if (x === "list") return Array;
	if (x === "set") return Array;
	if (x === "tubple") return Array;
	if (x === "length") return Number;
	if (x === "class") return Function
	if (x === "kind") return Function
	if (x === "type") return Function
	if (x === "function") return Function
	throw new NotMatching("not a known type:" + x);
	return x0;
}


function typeName() {
	return (maybe_tokens(type_names) || classConstDefined());
}

function gerund() {
	let current_value, match, pr;
	match = the.string.match(/^\s*(\w+)ing/);
	if (!match) {
		return false;
	}
	the.string = the.string.slice(match.end());
	pr = maybe_tokens(prepositions);
	if (pr) {
		maybe(endNode);
	}
	current_value = match.group(1);
	return current_value;
}

function postjective() {
	let current_value, match, pr;
	match = the.string.match(/^\s*(\w+)ed/);
	if (!match) {
		return false;
	}
	the.string = the.string.slice(match.end());
	pr = (!checkEndOfLine() && maybe_tokens(prepositions));
	if (pr && (!checkEndOfLine())) {
		maybe(endNode);
	}
	current_value = match.group(1);
	return current_value;
}

function get_class(x) {
	if (x instanceof Variable) {
		return x.type;
	}
	return Object.getPrototypeOf(x);
}

function do_evaluate_property(attr, node) {
	if (!attr) {
		return false;
	}
	verbose("do_evaluate_property '" + attr + "' in " + node);
	// verbose("do_evaluate_property '" + attr.toString() + "' in " + node.toString());
	the.result = null;
	if (attr.in(dir(node))) {
		return node.__getattribute__(attr);
	}
	if (attr.in(["type", "class", "kind"])) {
		return get_class(node);
	}
	if (node instanceof list) {
		return node.map(x => do_evaluate_property(attr, x))
	}
	if (attr instanceof ast.AST) {
		return todo("do_evaluate_property");
	}
	try {
		the.result = do_call(node, attr);
		return the.result;
	} catch (e) {
		verbose("do_send(node,attr) failed");
	}
}

let match_path = x => x.match(/^\/\w+/)

function check_end_of_statement() {
	return (checkEndOfLine() || (the.current_word === ";") || maybe_tokens(done_words));
}

function svg(x) {
	svg.append(x);
}

function be() {
	return tokens(be_words);
}

function modifier() {
	return tokens(modifier_words);
}


function nonzero() {
	return tokens(nonzero_keywords);
}


function bla() {
	return tokens(["hey"]);
}

function articles() {
	return tokens(article_words);
}

function the_() {
	maybe_tokens(article_words);
}


async function real_raw_input() {
	try {
		return await input.question("\u29a0 ").then(console.log).catch(console.log)
	} catch (ex) {
		console.error(ex)
	}
	return 0
}

async function ask(rl) {
	return new Promise((resolve, reject) =>
		rl.question('⦠ ', input0 => {
			// readline.write_history_file(home + "/.english_history");
			try {
				result = parse(input0, null).result;
				// result = new Array(result )[0]
				result = result[2]
				if (!result) {
					reject()
					return
				}
				console.log(result);
				resolve()
			} catch (e) {
				switch (e.constructor) {
					case NotMatching:
					case GivingUp:
					// case NameError:
					case SyntaxError:
						console.log("Syntax Error");
					case IgnoreException:
						break
					default:
						throw e
				}
			}
		}))
}

async function start_shell(args = []) {
	// process.on('unhandledRejection', () => {console.log("FUCK")});
	// process.on('rejectionHandled', () => {console.log("FUCK")});
// import * as readline from 'readline';
	let home, input0, interpretation;
	let readline = require('readline')
	// let readline=require('readline-history')
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		path: "/me/.angle_history",
		info: {next: x => x}
	})
	rl.setPrompt("\u29a0 ")// '⦠ '
	context._debug = (context._debug || "ANGLE_DEBUG".in(process.env));
	home = "~" //expanduser("~");
	// readline.read_history_file(home + "/.english_history");\\
	while (1) {
		await ask(rl)
	}
	// console.log("Bye.");
// exit(1);
	// process.stdin.on("keypress",console.log)

	// rl.on("line",line=>{

}


function main() {
	let ARGV, a, interpretation, target_file;
	the._verbose = false;
	ARGV = process.argv;
	context.home = process.env["ANGLE_HOME"];
	if (ARGV.length === 2) {
		console.log("Angle english programming language v1.2");
		console.log("usage:");
		console.log("\t./angle 6 plus six");
		console.log("\t./angle samples/test.e");
		console.log("\t./angle (no args for shell)");
		return start_shell();
	}
	a = ARGV[2].toString();
	console.log(">>> %s" % a);
	if (a === "--version" || a === "-version" || a === "-v") {
		console.log(the.version);
		return;
	}
	if (a === "--verbose") {
		context._verbose = true;
	}
	target_file = null;
	try {
		interpretation = parse(a, target_file);
		if (context.use_tree) {
			console.log(interpretation.tree);
		}
		if ((the.result && (!(!the.result)) && (!(the.result === Nil)))) {
			console.log(the.result);
		}
		if (!target_file) {
			start_shell();
		}
	} catch (e) {
		if (e instanceof NotMatching) {
			console.log(e);
			console.log("Syntax Error");
		} else if (e instanceof KeyboardInterrupt) {

		} else if (e instanceof GivingUp) {
			console.log("Syntax Error");
			// } else if (e instanceof EndOfDocument) {
			//     console.log("EndOfDocument??")
		} else {
			throw e;
		}
	}
	console.log("");
}

// main("test/");
let english_parser_imported = true;
context.starttokens_done = true;

// module.exports.parse = parse
// exports.parse = parse
//// sourceMappingURL=js.map
let setVerbose = (ok = 1) => context._verbose = ok;

module.exports = {
	setVerbose,
	main,
	rooty,
	interpretation,
	articles,
}
