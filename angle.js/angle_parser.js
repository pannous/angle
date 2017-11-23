#!/usr/local/bin/node
// "use strict"
let {maybe_tokens} = require("./power_parser")

let result
let used_operators
let used_ast_operators

let parser=require("./power_parser")
let {block,do_interpret, init,tokens} = require("./power_parser")
require("./english_tokens")
require("./ast")
require("./loops")
let {Variable, Argument} = require('./nodes')
let extensions = require('./extensions')();
let exceptions = require('./exceptionz');
let context = require('./context');
let nodes = require('./nodes')
the = context
// let Variable = nodes.Variable
// let Argument = nodes.Argument



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




function end_expression() {
	return (checkEndOfLine() || token(";"));
}

function raiseSyntaxError() {
	throw new SyntaxError("incomprehensible input");
}

function rooty() {
	// power_parser.
	block(/*multiple:*/ true);
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



function isStatementOrExpression(b) {
	return (b instanceof ast.stmt) || (b instanceof ast.Expr);
}


function print_variables() {
	for (let [v, k] of variables.items()) {
		console.log(v + "=" + k);
	}
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
	if (!(args instanceof Object /*todo*/)) {
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
	if ((b instanceof Array) && (b[0] instanceof ast.AST)) {
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
		if (!(a instanceof Array)) {
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






function todo(x = "") {
	throw new NotImplementedError("NotImplementedError: " + x);
}

function toString(x) {
	if (x.toString) return x.toString()
	if (x.to_string) return x.to_string()
	if (x.to_s) return x.to_s()
	if (x.name) return x.name
	if (x.__str__) return x.__str__()
	if (x.__repr__) return x.__str__()
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

// for(q of quantifiers) the.token_map[q]=condition



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

function gerund() {
	let current_value, match, pr;
	match = the.string.match(/^\s*(\w+)ing/);
	if (!match) return false;
	pr = maybe_tokens(prepositions) && maybe(endNode);// todo?
	return match[1]
}


let match_path = x => x.match(/^\/\w+/)


function svg(x) {
	svg.append(x);
}

function be() {
	return tokens(be_words);
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
			console.error(e);
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
	init,
	setVerbose,
	clear:parser.clear,
	main,
	rooty,

	// TEST ONLY:
	// interpretation,
	articles,
	gerund,
	parser,
}
