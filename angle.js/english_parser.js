#!/usr/local/bin/node

power_parser = require('./power_parser.js');
extensions = require('./extensions.js')();
exceptions = require('./exceptionz');
context = require('./context.js');
nodes = require('./nodes.js')
Variable = nodes.Variable
Argument = nodes.Argument

function get(name) {
	if (name instanceof Name) {
		name = name.id;
	}
	if (name instanceof nodes.Variable) {
		name = name.name;
	}
	return new _ast.Name({
		id: name,
		ctx: new Load()
	});
}

function parent_node() {
}

function do_self_modify(v, mod, arg) {
	let val;
	val = v.value;
	if (mod === "|=") the.result = (val | arg);
	if (mod === "||=") the.result = (val || arg);
	if (mod === "&=") the.result = (val & arg);
	if (mod === "&&=") the.result = (val && arg);
	if (mod === "+=") the.result = (val + arg);
	if (mod === "-=") the.result = (val - arg);
	if (mod === "*=") the.result = (val * arg);
	if (mod === "**=") the.result = Math.pow(val, arg);
	if (mod === "/=") the.result = (val / arg);
	if (mod === "%=") the.result = (val % arg);
	if (mod === "^=") the.result = (val ^ arg);
	if (mod === "<<") the.result = (val << arg);
	if (mod === ">>") the.result = (val >> arg);
	v.value = the.result;
	return the.result;
}

class Todo {
}

function _(x) {
	return token(x);
}

function __(x) {
	return tokens(x);
}

function nill() {
	if (tokens(nill_words)) {
		return NILL;
	}
}

function boole() {
	let b;
	b = tokens(["True", "False", "true", "false"]);
	the.result = b === "True" || b === "true" && TRUE || FALSE;
	return the.result;
}

function should_not_start_with(words) {
	let bad;
	bad = starts_with(words);
	if (!bad) {
		return OK;
	}
	if (bad) {
		info("should_not_match DID match %s" % bad);
	}
	if (bad) {
		throw new NotMatching("should_not_match DID match %s" % bad);
	}
}

remove_hash = {};

function remove_from_list(keywords0, excepty) {
	let good;
	good = keywords0;
	for (let x of excepty) {
		while (x.in(good)) {
			good=good.remove(x);
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
	return should_not_start_with(bad);
}

function no_keyword() {
	return no_keyword_except([]);
}

function constant() {
	return constantMap.get(tokens(constants));
}

function it() {
	tokens(result_words);
	return the.last_result;
}

function value() {
	let current_value, typ;
	if (the.current_type === _token.STRING) {
		return quote();
	}
	if (the.current_type === _token.NUMBER) {
		return number();
	}
	current_value = null;
	no_keyword_except(constants + numbers + result_words + nill_words + ["+", "-"]);
	the.result = maybe(bracelet) || maybe(quote) || maybe(nill) || maybe(number) || maybe(known_variable) || maybe(boole) || maybe(constant) || maybe(it) || maybe(nod) || raise_not_matching("Not a value");
	if (maybe_tokens(["as"])) {
		typ = typeNameMapped();
		the.result = call_cast(the.result, typ);
	}
	return the.result;
}

class Interpretation {
}

interpretation = function interpretation() {
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

rooty = function () {
	// power_parser.
	block({
		multiple: true
	});
	return the.result;
}

function set_context(_context) {
	context = _context;
}

function package() {
	tokens("package context gem library".split());
	return set_context(rest_of_line());
}

function javascript_require(dependency) {
	dependency = dependency.replace(".* ", "");
	return dependency;
}

function includes(dependency, type, version) {
	if (the.current_word.match(/\\.js$/))
	{
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

function imports() {
	let _type, dependency, version;
	_type = maybe_tokens(require_types);
	tokens(import_keywords);
	_type = (_type || maybe_tokens(require_types));
	maybe_tokens("file script header source src".split());
	maybe_tokens(["gem", "package", "library", "module", "context"]);
	_type = (_type || maybe_tokens(require_types));
	dependency = maybe(quote);
	no_rollback();
	dependency = (dependency || word());
	version = maybe(package_version);
	if (interpreting()) {
		includes(dependency, _type, version);
	}
	the.result = {
		"dependency": {
			"type": _type,
			"package": dependency,
			"version": version
		}
	};
	return the.result;
}

function module() {
	let _context;
	tokens(context_keywords);
	_context = word();
	newlines();
	block();
	done();
	return _context;
}

function bracelet() {
	let a;
	_("(");
	a = expression();
	_(")");
	return a;
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
	let left, result, right;
	right = stack[(i + 1)];
	left = stack[(i - 1)];

	function replaceI12(stack, result0) {
		result = result0;
		stack[i + 1] = result;
		delete stack[i - 1];
		delete stack[i]
	}

	if (interpreting()) {
		if ((op === "!") || (op === "not")) {
			stack[i] = [(!do_evaluate(right))];
			delete stack[i + 1]
		} else {
			replaceI12(stack, do_math(left, op, right))
		}
	} else if ((op === "!") || (op === "not")) {
		result = ast.Not(right);
		stack[(i)] = [result];
		delete stack[i + 1];
		delete stack[i]
	} else {
		left = fix_context(left);
		right = fix_context(right);
		if (op instanceof _ast.operator) {
			replaceI12(stack, new ast.BinOp(left, ast_operator(op), right));
		} else if (op.in(true_operators)) {
			replaceI12(stack, new ast.BinOp(left, ast_operator(op), right));
		} else if (op.in(comparison_words)) {
			replaceI12(stack, new ast.Compare(left, [ast_operator(op)], [right]));
		} else {
			replaceI12(stack, new ast.Compare(left, [ast_operator(op)], [right]));
		}
	}
}

function fold_algebra(stack) {
	used_operators = operators.filter(x => x.in(stack))
	used_ast_operators = Object.values(ast.operator_map).filter(x => stack.has(x))
	for (op of used_operators.plus(used_ast_operators)) {
		i = 0
		while (i < stack.length) {
			if (stack[i] == op)
				apply_op(stack, i, op)
			i += 1
		}
	}
	stack = Array(stack)
	if ((stack.length > 1) && (used_operators.length > 0)) {
		throw new Error("NOT ALL OPERATORS CONSUMED IN %s ONLY %s" % [stack, used_operators]);
	}
	return stack[0]
}

function algebra(val = null) {
	let stack;
	if (context.in_algebra) {
		return false;
	}
	if (!val) {
		must_contain_before({
			args: operators,
			before: (be_words + ["then", ",", ";", ":"])
		});
	}
	stack = [];
	val = (val || maybe(value) || bracelet());
	stack.append(val);

	function lamb() {
		let neg, op, va;
		if (the.current_word.in(be_words) && context.in_args) {
			return false;
		}
		op = (maybe(comparation) || operator());
		// if (op === "=") {
		// 	throw NotMatching;
		// }
		neg = maybe_token("not");
		va = (maybe(value) || maybe(bracelet));
		context.in_algebra = true;
		va = (va || expression());
		if (va === ZERO) {
			va = 0;
		}
		stack.append(op);
		(neg ? stack.append(neg) : 0);
		stack.append(va);
		return (va || true);
	}

	star(lamb);
	context.in_algebra = false;
	the.result = fold_algebra(stack);
	if (the.result === false) {
		the.result = FALSE;
	}
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
	if (type.match(/^char/))
	{
		the.result = "".join(l).__getitem__(n);
		return the.result;
	}
else
	{
		if (is_string(l)) {
			l = l.split(" ");
		}
	}
	if ((l instanceof list) && type.in(type_names)) {
		l = l.map(x => is_a(x, type))
	}
	if (n > l.length) {
		throw new IndexError("%d > %d in %s[%d]" % [n, l.length, l, n]);
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

function listselector() {
	return maybe(nth_item);
}

function functionalselector() {
	let crit, xs;
	if (contains(",")) {
		return list();
	}
	if (contains(":")) {
		return hash();
	}
	_("{");
	xs = known_variable();
	crit = selector();
	_("}");
	return list(filter(xs, crit));
}

function liste(check = true, first = null) {
	let all, start_brace;
	if ((!first) && (the.current_word === ",")) {
		throw new NotMatching();
	}
	if (context.in_hash) {
		must_not_contain(":");
	}
	if (check) {
		must_contain_before(",", (be_words + operators) + ["of"]);
	}
	start_brace = maybe_tokens(["[", "{", "("]);
	if ((!start_brace) && (context.in_list || in_args)) {
		throw new NotMatching("not a deep list");
	}
	context.in_list = true;
	first = (first || maybe(endNode));
	if (!first) {
		context.in_list = false;
	}
	if (!first) {
		raise_not_matching();
	}
	if (first instanceof list) {
		all = first;
	} else {
		all = [first];
	}

	function lamb() {
		let e;
		tokens([",", "and"]);
		e = endNode();
		if (e === ZERO) {
			e = 0;
		}
		all.append(e);
		return e;
	}

	star(lamb);
	if (start_brace === "[") {
		_("]");
	}
	if (start_brace === "{") {
		_("}");
	}
	if (start_brace === "(") {
		_(")");
	}
	context.in_list = false;
	if (context.use_tree) {
		return new ast.List(all, new ast.Load());
	}
	return all;
}

function must_contain_substring(param) {
	let current_statement = the.current_line.slice(the.current_offset).split([';', ':', '\n'])[0]
	if (!param.in(current_statement)) raise_not_matching("must_contain_substring(%s)" % param);
}

function plusPlus(v = null) {
	let pre, start;
	must_contain_substring("++");
	start = pointer();
	pre = (maybe_token("+") && token("+"));
	v = (v || variable());
	(pre || (_("+") && token("+")));
	if (!interpreting()) {
		return new Assign([store(v.name)], new BinOp(name(v.name), new Add(), num(1)));
	}
	the.result = (do_evaluate(v, v.type) + 1);
	the.variableValues[v.name] = v.value = the.result;
	return the.result;
}

function minusMinus(v = null) {
	let pre;
	must_contain_substring("--");
	pre = (maybe_token("-") && token("-"));
	v = (v || variable());
	(pre || (_("-") && token("-")));
	if (!interpreting()) {
		return new Assign([store(v.name)], new BinOp(name(v.name), new Sub(), num(1)));
	}
	the.result = (do_evaluate(v, v.type) + 1);
	variableValues[v] = v.value = the.result;
	return the.result;
}

function selfModify() {
	return (maybe(self_modify) || maybe(plusPlus) || minusMinus());
}

function self_modify(v = null, exp = null) {
	let arg, mod, op;
	must_contain(self_modifying_operators);
	v = (v || variable());
	mod = tokens(self_modifying_operators);
	exp = (exp || expression());
	if (!interpreting()) {
		op = operator_equals(mod);
		return new Assign([store(v.name)], new BinOp(name(v.name), new Add(), ast_magic.wrap_value(exp)));
	} else {
		arg = do_evaluate(exp, v.type);
		the.result = do_self_modify(v, mod, arg);
		the.variableValues[v.name] = the.result;
		v.value = the.result;
		return the.result;
	}
}

function swift_hash() {
	let h;
	_("[");
	h = {};

	function hashy() {
		let key;
		if (h.length > 0) {
			_(",");
		}
		maybe_tokens(["\"", "'"]);
		key = word();
		maybe_tokens(["\"", "'"]);
		_(":");
		context.context.in_list = true;
		h[key] = expression();
		the.result = {
			key: h[key]
		};
		return the.result;
	}

	star(hashy);
	_("]");
	context.context.in_list = false;
	return h;
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

hash_assign = [":", "to", "=>", "->"];

function hash_map() {
	let z;
	must_contain_before({
		args: hash_assign,
		before: ["}"]
	});
	z = (starts_with("{") ? regular_hash() : immediate_hash());
	return z;
}

function regular_hash() {
	let h;
	_("{");
	context.in_hash = true;
	(maybe_tokens(hash_assign) && no_rollback());
	h = {};

	function lamb() {
		let key, val;
		if (h.length > 0) {
			tokens([";", ","]);
		}
		key = (maybe(quote) || word());
		(maybe_tokens(hash_assign) || starts_with("{"));
		val = expression();
		h[key] = val;
		return {
			key: val
		};
	}

	star(lamb);
	_("}");
	context.in_hash = false;
	if (!interpreting()) {
		return new Dict(keys(h)), list(h.values());
	}
	return h;
}

function immediate_hash() {
	let r, w;
	must_contain_before(hash_assign, "}");
	w = (maybe(quote) || word());
	if (maybe_tokens(hash_assign)) {
		r = expression();
	} else {
		if (starts_with("{") || _("=>")) {
			no_rollback();
			r = regular_hash();
		} else {
			raise_not_matching("no immediate_hash");
		}
	}
	if (interpreting()) {
		return {
			w: r
		};
	}
	return new ast.Dict([w], [r]);
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

function quick_expression() {
	let fun, result, z;
	result = false;
	if (!the.current_word) {
		throw new EndOfLine();
	}
	if (the.current_word === ";") {
		throw new EndOfStatement();
	}
	if (the.current_word === ",") {
		return liste({
			first: the.result
		});
	}
	if ((!context.in_params) && look_1_ahead(":")) {
		return immediate_hash();
	}
	if (the.current_word === "{") {
		if (look_1_ahead("}")) {
			return empty_map();
		}
		if (contains("=>") || contains(":")) {
			return hash_map();
		}
	}
	if (look_1_ahead([".", "'s", "of"])) {
		return (maybe(method_call) || property());
	}
	if (look_1_ahead("=")) {
		if (!context.in_condition) {
			return setter();
		}
	}
	if (the.current_word.in(type_names) || the.current_word.in(the.classes)) {
		return declaration();
	}
	if (the.current_word.in(operators + special_chars)) {
		if (the.current_word !== "~") {
			return false;
		}
	}
	if (the.current_type === _token.NUMBER) {
		result = number();
		if (maybe_tokens(["rd", "nd", "th"])) {
			result = nth_item(result);
		}
	} else if (the.current_word.startsWith("r'")) {
		result = regexp(the.current_word);
		next_token(false);
	} else if ((the.current_type === _token.STRING) || the.current_word.startsWith("'")) {
		result = quote();
	} else if (the.current_word.in(the.token_map)) {
		fun = the.token_map[the.current_word];
		debug("token_map: %s -> %s" % [the.current_word, fun]);
		result = fun();
	} else if (the.current_word.in(the.method_token_map)) {
		fun = the.method_token_map[the.current_word];
		debug("method_token_map: %s -> %s" % [the.current_word, fun]);
		result = fun();
	} else if (the.current_word.in(the.method_names)) {
		if (method_allowed(the.current_word)) {
			result = method_call();
		}
	} else if (the.current_word.in(the.params)) {
		result = true_param();
	} else if (the.current_word.in(the.variables)) {
		result = known_variable();
	} else if (the.current_word.in(type_names)) {
		return (maybe(setter) || method_definition());
	}
	if (look_1_ahead("of")) {
		result = evaluate_property(result);
	}
	if (!result) {
		return false;
	}
	while (true) {
		z = post_operations(result);
		if ((!z) || (z === result)) {
			break;
		}
		result = z;
	}
	return result;
}

function post_operations(result) {
	if (the.current_word === "") {
		return result;
	}
	if (the.current_word === ";") {
		return result;
	}
	if (the.current_word === ".") {
		return method_call(result);
	}
	if ((the.current_word === ",") && (!((context.in_args || context.in_params) || context.in_hash))) {
		return liste({
			check: false,
			first: result
		});
	}
	if (the.current_word.in(self_modifying_operators)) {
		return self_modify(result);
	}
	if ((the.current_word === "+") && look_1_ahead("+")) {
		return plusPlus(result);
	}
	if ((the.current_word === "-") && look_1_ahead("-")) {
		return minusMinus(result);
	}
	if (the.current_word.in(be_words)) {
		if (!context.in_condition) {
			if (result instanceof Variable) {
				return setter(result);
			}
		} else {
			if (the.current_word === "are") {
				return false;
			}
		}
	}
	if (the.current_word === "|") {
		return piped_actions(result || the.last_result);
	}
	if (the.current_word.in(operators)) {
		return algebra(result);
	}
	if (the.current_word === "[") {
		return evaluate_index(result);
	}
	if (the.current_word.in((operators + special_chars) + ["element", "item"])) {
		return false;
	}
	if (result && (the.current_word === "to")) {
		return ranger(result);
	}
	if (result && (the.current_word === "if")) {
		return action_if(result);
	}
	if (the.current_line.endswith("times")) {
		return action_n_times(result);
	}
	if (the.current_word.in(be_words)) {
		return setter(result);
	}
	if (the.current_word === "if") {
		return (_("if") && condition() ? result : (maybe("else") && expression() || null));
	}
	if (the.current_word === "as") {
		return maybe_cast(result);
	}
	return false;
}

function passing() {
	let ok;
	ok = tokens(["pass", ";"]);
	return (interpreting() ? ok : new ast.Pass());
}

function space() {
	if ((token(" ") || token("") !== null)) {
		return OK;
	} else {
		return false;
	}
}

function expression(fallback = null, resolve = true) {
	let ex;
	maybe(space);
	if ((the.current_word === "") || (the.current_word.length === 0)) {
		throw new EndOfLine();
	}
	if (the.current_word === ";") {
		throw new EndOfStatement();
	}
	the.result = ex = maybe(quick_expression) || maybe(listselector) || maybe(algebra) || maybe(hash_map) || maybe(evaluate_index) || maybe(liste) || maybe(evaluate_property) || maybe(selfModify) || maybe(endNode) || maybe(passing) || raise_not_matching("Not an expression: " + pointer_string());
	ex = (post_operations(ex) || ex);
	skip_comments();
	if (!interpreting()) {
		return ex;
	}
	if ((resolve && ex) && interpreting()) {
		the.last_result = the.result = do_evaluate(ex);
	}
	if ((!the.result) || ((the.result === SyntaxError) && (!(ex === SyntaxError)))) {
	} else {
		ex = the.result;
	}
	if (ex === ZERO) {
		ex = 0;
	}
	the.result = ex;
	return the.result;
}

function piped_actions(a = false) {
	let args, name, obj, xmodule;
	if (context.in_pipe) {
		return false;
	}
	must_contain(["|", "pipe"]);
	context.in_pipe = true;
	a = (a || statement());
	tokens(["|", "pipe"]);
	no_rollback();
	[xmodule, obj, name] = (true_method() || bash_action());
	args = star(call_arg);
	context.in_pipe = false;
	if (name instanceof Function) {
		args = [args, new Argument({
			value: a
		})];
	}
	if (interpreting()) {
		the.result = do_call(a, name, args);
		console.log(the.result);
		return the.result;
	} else {
		return OK;
	}
}

statement = function (doraise = true) {
	let x;
	if (starts_with(done_words) || checkNewline()) {
		if (doraise) {
			raise_not_matching("end of block ok");
		} else {
			return false;
		}
	}
	if (checkNewline()) {
		return NEWLINE;
	}
	maybe_indent();
	x = maybe(quick_expression) ||
		maybe(setter) ||
		maybe(returns) ||
		maybe(imports) ||
		maybe(method_definition) ||
		maybe(assert_that) ||
		maybe(breaks) ||
		maybe(loops) ||
		maybe(if_then_else) ||
		maybe(once) ||
		maybe(piped_actions) ||
		maybe(declaration) ||
		maybe(nth_item) ||
		maybe(neu) ||
		maybe(action) ||
		maybe(expression) ||
		raise_not_matching("Not a statement %s".format(pointer_string()));
	context.in_condition = false;
	the.result = x;
	the.last_result = x;
	skip_comments();
	adjust_interpret();
	return the.result;
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

function method_definition(name = null, return_type = null) {
	let args, b, brace, f, f2, modifiers;
	if (!name) {
		modifiers = maybe_tokens(modifier_words);
		return_type = maybe(typeName);
		tokens(method_tokens);
		no_rollback();
		name = word({
			include: english_operators
		});
	}
	brace = maybe_token("(");
	context.in_params = true;
	args = [];

	function arguments() {
		let a;
		if (the.current_offset === 0) {
			raise_not_matching("BLOCK START");
		}
		a = param(args.length);
		maybe_token(",");
		args.append(a);
		return a;
	}

	star(arguments);
	context.in_params = false;
	if (brace) {
		token(")");
	}
	return_type = (return_type || (maybe_tokens(["as"]) && maybe(typeNameMapped)) || null);
	return_type = (maybe_tokens(["returns", "returning", "=>", "->"]) && maybe(typeNameMapped) || return_type);
	maybe_tokens(["return", "="]);
	dont_interpret();
	f = new FunctionDef({
		name: name,
		arguments: args,
		return_type: return_type,
		body: "allow pre-recursion"
	});
	the.methods[name] = f;
	the.method_names.insert(0, name);
	f2 = addMethodNames(f);
	b = action_or_block();
	look_1_ahead("return", "Return statement out of method {block}, are you missing curlies?", {
		must_not_be: true
	});
	if (!(b instanceof list)) {
		b = [b];
	}
	if (!((b.slice((-1)[0] instanceof ast.Print) || (b.slice(-1)[0] instanceof ast.Return)))) {
		b.slice(-1)[0] = ast.assign("it", b.slice(-1)[0]);
	}
	f.body = b;
	f2.body = b;
	the.params.clear();
	return f;
}

function execute(command) {
	// import * as os from 'os';
	return os.popen(command).read();
}

function bash_action() {
	let command, ok;
	if (starts_with("`") && beginning_of_line()) {
		throw new DidYouMean("shell <bash command ...>");
	}
	ok = starts_with(["bash", "exec", "`"] + bash_commands);
	if (!ok) {
		raise_not_matching("no bash commands");
	}
	no_rollback();
	maybe_tokens(["execute", "exec", "command", "commandline", "run", "shell", "shellscript", "script", "bash"]);
	command = maybe(quote);
	command = (command || rest_of_line());
	if (interpreting()) {
		try {
			console.log("Going to execute " + command);
			the.result = execute(command);
			console.log("the.result:");
			console.log(the.result);
			if (the.result) {
				return the.result.split("\n");
			} else {
				return true;
			}
		} catch (e) {
			console.log("error (e)xecuting bash_action");
		}
	}
	return false;
}

function if_then_else() {
	let o, ok;
	ok = if_then();
	adjust_rollback();
	o = (maybe(otherwise) || FALSE);
	if (context.use_tree) {
		if (ok instanceof ast.IfExp) {
			ok.orelse = (o || []);
		} else {
			if (o) {
				ok.orelse = [new ast.Expr(o)];
			} else {
				ok.orelse = [];
			}
		}
		return ok;
	}
	if ((ok !== "OK") && (ok !== false)) {
		the.result = ok;
	} else {
		the.result = o;
	}
	return the.result;
}

function action_if(a) {
	let c;
	if (!a) {
		must_not_start_with("if");
	}
	must_contain("if");
	a = (a || action_or_expression());
	_("if");
	c = condition();
	if (interpreting()) {
		if (check_condition(c)) {
			return do_execute_block(a);
		} else {
			return OK;
		}
	}
	return a;
}

function isStatementOrExpression(b) {
	return (b instanceof ast.stmt) || (b instanceof ast.Expr);
}

function if_then() {
	let b, c, started;
	tokens(if_words);
	no_rollback();
	c = condition();
	if (c === null) {
		throw new InternalError("no condition_tree");
	}
	started = maybe_token("then");
	if (c !== true) {
		dont_interpret();
	}
	adjust_rollback();
	b = action_or_block(started);
	maybe_newline();
	adjust_interpret();
	if ((c === false) || (c === FALSE)) {
		return false;
	}
	if (c === true) {
		return b;
	}
	if (interpreting() && (c !== true)) {
		if (check_condition(c)) {
			return do_execute_block(b);
		} else {
			return OK;
		}
	} else {
		if ((b instanceof ast.Num) || (b instanceof ast.Str)) {
			return new ast.IfExp({
				test: c,
				body: b,
				orelse: []
			});
		} else {
			if (!(b instanceof list)) {
				b = [b];
			}
			if (!((b.slice((-1)[0] instanceof ast.Expr) || (b.slice(-1)[0] instanceof ast.Return)))) {
				b.slice(-1)[0] = new ast.Expr(b.slice(-1)[0]);
			}
			return new ast.If({
				test: c,
				body: b,
				orelse: []
			});
		}
	}
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
	if(!method)raise_not_matching("method has_args")
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
	should_not_start_with(keyword_except_english_operators)
	should_not_start_with(auxiliary_verbs);
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
	if (maybe_tokens(articles)) {
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
	the.result = do_call(obj || null), method, (args || null);
	return the.result;
}

function tokens(tokens0) {
	ok=maybe_tokens(tokens0)
	if(!ok)throw new NotMatching(result)
	return ok
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

function assert_that() {
	let s;
	_("assert");
	maybe_token("that");
	no_rollback();
	do_interpret();
	s = expression();
	if (interpreting()) {
		_pj._assert(check_condition(s), s);
	}
	if (context.use_tree) {
		return new ast.Assert({
			test: s,
			msg: s.toString()
		});
	}
	return s;
}

function arguments() {
	return star(param);
}

function maybe_token(x) {
	if (x === the.current_word) {
		next_token();
		return x;
	}
	return false;
}

function constructor() {
}

function neu() {
	let clazz;
	maybe_tokens(["create", "init"]);
	the_();
	_("new");
	clazz = class_constant();
	return do_call(clazz, "__init__", arguments());
}

function returns() {
	tokens(["return", "returns"]);
	no_rollback();
	the.result = maybe(expression);
	if (interpreting()) {
		// todo("the.params.clear();?")
	}
	if (context.use_tree) {
		return new ast.Return({
			value: the.result
		});
	}
	return the.result;
}

function breaks() {
	return tokens(flow_keywords);
}

function action() {
	let start;
	start = pointer();
	maybe(bla);
	the.result = maybe(quick_expression) ||
		maybe(special_blocks) ||
		maybe(applescript) ||
		maybe(bash_action) ||
		maybe(evaluate) ||
		maybe(returns) ||
		maybe(selfModify) ||
		maybe(method_call) ||
		maybe(spo) ||
		raise_not_matching("Not an action");
	return the.result;
}

function action_or_expression(fallback = null) {
	let ok;
	ok = maybe(action);
	if (ok) {
		return ok;
	}
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

function eval_ast(b, args = {}) {
	args = prepare_named_args(args);
	the.result = pyc_emitter.eval_ast(b, args, {
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
		return eval_ast(b, args);
	}
	if ((b instanceof list) && (b[0] instanceof ast.AST)) {
		return eval_ast(b, args);
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
		oldType = (the.variableTypes[var_.name] || Object.getPrototypeOf(var_.value));
	} else {
		if (var_.type) {
			oldType = var_.type;
		} else {
			oldType = null;
		}
	}
	if (_type === "Unknown") {
		return;
	}
	if (_type instanceof ast.AST) {
		warn("TYPE AST");
		return;
	}
	if (!isType(oldType)) {
		warn("NOT A TYPE %s" % oldType);
		return;
	}
	if (oldType && (oldType.prototype instanceof str)) {
		if (_type.prototype instanceof extensions.xchar) {
			return;
		}
	}
	if (_type.prototype instanceof _ast.AST) {
		console.log("skipping type check for AST expressions (for now)!");
		return;
	}
	if ((oldType && _type) && (!(oldType.prototype instanceof _type))) {
		throw new WrongType(var_.name + " has type " + oldType.toString() + ", can't set to " + _type.toString());
	}
	if ((oldType && var_.type) && (!(oldType.prototype instanceof var_.type))) {
		throw new WrongType(var_.name + " has type " + oldType.toString() + ", cannot set to " + var_.type.toString());
	}
	if ((_type && var_.type) && (!((var_.type.prototype instanceof _type) || (_type.prototype instanceof var_.type)))) {
		throw new WrongType(var_.name + " has type " + var_.type.toString() + ", Can't set to " + _type.toString());
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
	if (val instanceof FunctionCall) {
		if ((val.return_type !== "Unknown") && (val.return_type !== oldType)) {
			throw new WrongType("OLD: %s %s VS %s return_type: %s " % [oldType, oldValue, val, val.return_type]);
		}
	} else if (oldType) {
		try {
			wrong_type = new WrongType("OLD: %s %s VS %s %s" % [oldType, oldValue, Object.getPrototypeOf(val), val]);
			if (!(val instanceof oldType) && !(oldType.prototype instanceof Object.getPrototypeOf(val))) {
				if (auto_cast) return do_cast(val, oldType);
				throw wrongType;
			}
		} catch (e) {
			if (!(Object.getPrototypeOf(val).prototype instanceof _ast.AST)) {
				throw wrong_type;
			} else {
				console.log("skipping type check for AST expressions (for now)!");
			}
		}
	}
	if ((var_.final && var_.value) && (!(val === var_.value))) {
		throw new ImmutableVaribale("OLD: %s %s VS %s %s" % [oldType, oldValue, Object.getPrototypeOf(val), val]);
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
	var_ = variable();
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

function declaration() {
	let a, mod, type, val, var_;
	must_not_contain(be_words);
	a = the_();
	mod = maybe_tokens(modifier_words);
	type = typeNameMapped();
	maybe_tokens(["var", "val", "let"]);
	mod = (mod || maybe_tokens(modifier_words));
	var_ = (maybe(known_variable) || variable(a, {
		ctx: new ast.Store()
	}));
	try {
		val = Object.getPrototypeOf();
	} catch (e) {
		val = null;
	}
	var_ = add_variable(var_, val, mod, {
		_type: type
	});
	if (var_.type) {
		assure_same_type(var_, type);
	} else {
		var_.type = type;
	}
	var_.final = mod.in(const_words);
	var_.modifier = mod;
	the.variableTypes[var_.name] = var_.type;
	return var_;
}

function setter(var_ = null) {
	let _cast, _let, _type, a, guard, mod, setta, val;
	must_contain_before({
		args: ["is", "be", "are", ":=", "=", "set", "to"],
		before: [">", "<", "+", "-", "|", "/", "*", ";"]
	});
	_let = maybe_tokens(let_words);
	if (_let) {
		no_rollback();
	}
	a = maybe(_the);
	mod = maybe_tokens(modifier_words);
	_type = maybe(typeNameMapped);
	maybe_tokens(["var", "val", "value of"]);
	mod = (mod || maybe(modifier));
	var_ = (var_ || variable(a, {
		ctx: new ast.Store()
	}));
	if (current_word === "[") {
		return evaluate_index(var_);
	}
	setta = (maybe_tokens(["to"]) || be());
	if (!setta) {
		throw new NotMatching("BE!?");
	}
	if ((setta === ":=") || (_let === "alias")) {
		return alias(var_);
	}
	if (maybe_tokens(["a", "an"]) && (!_type)) {
		_type = typeNameMapped();
		val = _type();
		return add_variable(var_, val, mod, _type);
	} else {
		val = expression();
	}
	_cast = (maybe_tokens(["as", "cast", "cast to", "cast into", "cast as"]) && typeNameMapped());
	guard = (maybe_token("else") && value());
	if (_cast) {
		if (interpreting()) {
			val = do_cast(val, _cast);
		} else {
			_type = _cast;
		}
	}
	val = (do_evaluate(val) || do_evaluate(guard));
	if (setta.in(["are", "consist of", "consists of"])) {
		val = flatten(val);
	}
	try {
		add_variable(var_, val, mod, _type);
	} catch (e) {
		if (guard) {
			val = guard;
			add_variable(var_, guard, mod, _type);
		} else {
			throw e;
		}
	}
	if (!interpreting()) {
		return new ast.Assign([new ast.Name(var_.name, new ast.Store())], val);
	}
	if (interpreting() && (val !== 0)) {
		return val;
	}
	return var_;
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
	if (val instanceof FunctionCall) {
		assure_same_type(var_, val.returns);
	} else {
		assure_same_type(var_, (_type || Object.getPrototypeOf(val)));
		assure_same_type_overwrite(var_, val);
	}
	if ((!var_.name.in(keys(variableValues)) || (mod !== "default"))) {
		the.variableValues[var_.name] = val;
		the.variables[var_.name] = var_;
		var_.value = val;
	}
	the.token_map[var_.name] = known_variable;
	var_.type = (_type || Object.getPrototypeOf(val));
	var_.final = mod.in(const_words);
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
	if (x instanceof type) {
		return true;
	}
	if (x.in(type_names)) {
		return true;
	}
	return false;
}

function current_node() {
}

function current_context() {
}

function variable(a = null, ctx = new ast.Load(), isParam = false) {
	let all, name, oldVal, p, param, typ;
	a = (a || maybe_tokens(articles));
	if (a !== "a") {
		a = null;
	}
	must_not_start_with(keywords);
	must_not_start_with(the.method_names)
	typ = maybe(typeNameMapped);
	p = maybe_tokens(possessive_pronouns);
	no_keyword();
	all = one_or_more(word);
	if ((!all) || (all[0] === null)) {
		raise_not_matching();
	}
	name = " ".join([]);
	if (!typ && all.length > 1 && isType(all[0])) {
		name = all.slice(1, (-1)).join(" ");
	}
	if (p) {
		name = ((p + " ") + name);
	}
	name = name.strip();
	if(!name)throw new NotMatching("no variable")
	if (isParam || (ctx instanceof ast.Param)) {
		param = new Variable({
			name: name,
			type: (typ || null),
			ctx: ctx
		});
		the.params[name] = param;
		return param;
	}
	if (ctx instanceof ast.Load) {
		if (name.in(the.variables)) {
			return the.variables[name];
		}
		if (name.in(the.params)) {
			return the.params[name];
		} else {
			throw new UndeclaredVariable("Unknown variable " + name);
		}
	}
	if (ctx instanceof ast.Store) {
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

word_regex = "^\s*[a-zA-Z]+[\w_]*";

function word(include = null) {
	let current_value, match;
	maybe_tokens(articles);
	if (!include) {
		include = [];
	}
	no_keyword_except(include);
	raiseNewline();
	match =  the.current_word.match(word_regex);
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
		for (let w of words) if (w === the.current_word) throw new MustNotMatchKeyword(w);
		next_token();
	}
	set_token(old);
	return OK;
}

function must_not_start_with(words) {
	should_not_start_with(words);
}

function todo(x = "") {
	throw new NotImplementedError("NotImplementedError: "+x);
}

function do_cast(x, typ) {
	if (typeof typ === "number" || (typ instanceof Number)) {
		return float_(x);
	}
	if (typeof typ === "number" || (typ instanceof Number)) {
		return int_(x);
	}
	if (typ === int_) {
		return int_(x);
	}
	if (typ === xint) {
		return int_(x);
	}
	if (typ === "int") {
		return int_(x);
	}
	if (typ === "integer") {
		return int_(x);
	}
	if (typ === str) {
		return x.toString();
	}
	if (typ === str) {
		return x.toString();
	}
	if (typ === unicode) {
		return x.toString();
	}
	if (typ === "str") {
		return x.toString();
	}
	if (typ === "string") {
		return x.toString();
	}
	if ((typ === extensions.xchar) && (x.length === 1)) {
		return extensions.xchar(x[0]);
	}
	throw new WrongType("CANNOT CAST: %s (%s) TO %s " % [x, Object.getPrototypeOf(x), typ]);
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

function nod() {
	return maybe(number) || maybe(quote) || maybe(regexp) || maybe(known_variable) || maybe(true_param) || the_noun_that();
}

function article() {
	tokens(articles);
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
	maybe_tokens(articles);
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

function endNode() {
	return maybe(endNode);
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
			verbose("List condition not met %s %s %s" % [left, comp, right]);
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
			verbose("condition not met %s %s %s" % [left, comp, right]);
		}
		verbose("condition met %s %s %s" % [left, comp, right]);
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
	maybe(_the);
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
	let x;
	x = x0.lower();
	if (x === "char") {
		return xchar;
	}
	if (x === "character") {
		return xchar;
	}
	if (x === "letter") {
		return xchar;
	}
	if (x === "type") {
		return type;
	}
	if (x === "word") {
		return str;
	}
	if (x === "int") {
		return int_;
	}
	if (x === "integer") {
		return int_;
	}
	if (x === "long") {
		return int_;
	}
	if (x === "double") {
		return int_;
	}
	if (x === "str") {
		return str;
	}
	if (x === "string") {
		return str;
	}
	if (x === "real") {
		return float_;
	}
	if (x === "float") {
		return float_;
	}
	if (x === "number") {
		return float_;
	}
	if (x === "fraction") {
		return float_;
	}
	if (x === "rational") {
		return float_;
	}
	if (x === "hash") {
		return dict;
	}
	if (x === "hashmap") {
		return dict;
	}
	if (x === "hashtable") {
		return dict;
	}
	if (x === "dict") {
		return dict;
	}
	if (x === "dictionary") {
		return dict;
	}
	if (x === "map") {
		return dict;
	}
	if (x === "object") {
		return object;
	}
	if (x === "array") {
		return list;
	}
	if (x === "set") {
		return set;
	}
	if (x === "list") {
		return list;
	}
	if (x === "tuple") {
		return tuple;
	}
	if (x === "name") {
		return str;
	}
	if (x === "label") {
		return str;
	}
	if (x === "length") {
		return int_;
	}
	if (x === "label") {
		return str;
	}
	if (x === "class") {
		throw new NotMatching("class is not a type");
	}
	throw new NotMatching("not a known type:" + x);
	return x0;
}

function typeNameMapped() {
	let x;
	x = typeName();
	if (x.in(the.classes)) {
		return the.classes[x];
	}
	return mapType(x);
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
	verbose("do_evaluate_property '" + attr.toString() + "' in " + node.toString());
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
	if (attr instanceof _ast.AST) {
		return todo("do_evaluate_property");
	}
	try {
		the.result = do_call(node, attr);
		return the.result;
	} catch (e) {
		verbose("do_send(node,attr) failed");
	}
}

function do_evaluate(x, _type = null) {
	if ((x === ZERO) || (x === 0)) {
		return 0;
	}
	if (x === TRUE) {
		return true;
	}
	if (x === FALSE) {
		return FALSE;
	}
	if (x === NILL) {
		return null;
	}
	if (!x) {
		return null;
	}
	if (x instanceof Function) {// and Type !!!
		return x;
	}
	if (x instanceof ast.Num) {
		return x.n;
	}
	if (x instanceof ast.Str) {
		return x.s;
	}
	if (x instanceof Variable) {
		return do_evaluate(x.value);
	}
	if (x instanceof Argument) {
		return do_evaluate(x.value);
	}
	if (x instanceof extensions.File) {
		return x.to_path;
	}
	if ((x instanceof list) && (x.length === 1)) {
		return do_evaluate(x[0]);
	}
	if (x instanceof list) {
		return list(map(do_evaluate, x));
	}
	if (is_string(x)) {
		if (_type && (_type instanceof extensions.Numeric)) {
			return float_(x);
		}
		if (x.in(the.variableValues)) {
			return the.variableValues[x];
		}
		if (match_path(x)) {
			return do_evaluate(x);
		}
		if (_type && (_type === float_)) {
			return float_(x);
		}
		if (_type && (_type === int_)) {
			return int_(x);
		}
		return x;
	}
	if (!interpreting()) {
		return x;
	}
	// if (x instanceof ast.AST) {
	// 	return pyc_emitter.eval_ast([x]);
	// }
	// if ((x instanceof list) && (x[0] instanceof ast.AST)) {
	// 	return pyc_emitter.eval_ast(x);
	// }
	return x;
}

function self_modifying(method) {
	if ((method instanceof Function) || ((typeof method) === "function")) {
		method = method.__name__;
	}
	if (is_string(method)) {
		return ((method === "increase") || (method === "decrease") || method.endswith("!"));
	}
	return false;
}

function is_math(method) {
	let ok;
	ok = method.in(operators);
	return ok;
}

function do_math(a, op, b) {
	a = (do_evaluate(a) || 0);
	b = (do_evaluate(b) || 0);
	if (a instanceof Variable) {
		a = a.value;
	}
	if (b instanceof Variable) {
		b = b.value;
	}


	if (op === '+') return a + b
	if (op === 'plus') return a + b
	if (op === 'add') return a + b
	if (op === '-') return a - b
	if (op === 'minus') return a - b
	if (op === 'substract') return a - b
	if (op === '/') return a / float(b)
	if (op === 'devided') return a / float(b)
	if (op === 'devided by') return a / float(b)
	if (op === '%') return a % b
	if (op === 'modulo') return a % b
	if (op === '*') return a * b
	if (op === 'times') return a * b
	if (op === 'multiplied by') return a * b

	if (op === '**') return a ** b
	if (op === 'to the power of') return a ** b
	if (op === 'to the power') return a ** b
	if (op === 'to the') return a ** b
	if (op === 'power') return a ** b
	if (op === 'pow') return a ** b
	if (op === '^^') return a ** b
	if (op === '^') return a ** b
	// if(op == '^') return a ^ b
	if (op === 'xor') return a ^ b
	if (op === 'and') return a && b || FALSE
	if (op === '&&') return a && b
	if (op === 'but not')
		return a && !b
	if (op === 'nor')
		return !a && !b
	if (op === 'neither')
		return !a && !b
	if (op === 'but')
		if (isinstance(a, list))
			return a.remove(b)
		else
			return a && b
	// if(op == '&') return a and b
	if (op === '&') return a & b
	if (op === '|') return a | b
	if (op === '||') return a | b
	if (op === 'or') return a || b
	if (op === '<') return a < b
	if (op === 'smaller') return a < b
	if (op === '>') return a > b
	if (op === 'bigger') return a > b
	if (op === '<=') return a <= b
	if (op === '>=') return a >= b
	if (op === '==') return a == b
	if (op === '=') return a == b
	if (op === '~') return regex_match(a, b)
	if (op === '~=') return regex_match(a, b)
	if (op === '=~') return regex_match(a, b)
	if (op === '~~') return regex_match(a, b)
	if (op === 'is') return a === b  // NOT the same as python a is b)
	if (op === 'be') return a === b
	if (op === 'equal to') return a === b
	if (op === 'is identical') return a === b  // python ===
	if (op === 'is exactly') return a === b
	if (op === 'same as') return a === b  // weaker than 'exactly'!
	if (op === 'the same as') return a === b
	if (op === 'equals') return a === b
	if (op === '!=') return a != b
	if (op === '≠') return a != b
	if (op === 'is not') return a !== b
	if (op === 'isn\'t') return a !== b
	if (op === '===') return a === b
	if (op === '!==') return a !== b
	if (op in class_words) return isinstance(a, b) || is_a(a, b)
	if (op in subtype_words) return issubclass(a, b) || is_(a, b)

	throw new Error("UNKNOWN OPERATOR " + op);
}

function is_bound(method) {
	let _is_bound;
	_is_bound = ("im_self".in(dir(method)) && method.__self__);
	_is_bound = (_is_bound || "bound".in(method.toString()));
	return _is_bound;
}

function is_unbound(method) {
	return ("im_class" in method) && (method.__self__ === null);
}

function instance(bounded_method) {
	return bounded_method.__self__;
}

function findMethod(obj0, method0, args0 = null, bind = true) {
	let _type, ex, function_, method;
	method = method0;
	if (method instanceof Function) {
		return method;
	}
	if (method instanceof ast.FunctionDef) {
		return method;
	}
	if (!obj0 && (args0 instanceof list) && args0.length === 1) {
		obj0 = args0[0];
	}
	if(obj0)  _type = Object.getPrototypeOf(obj0);
	if (obj0 instanceof Variable) {
		_type = obj0.type;
		obj0 = obj0.value;
	}
	if (obj0 instanceof Argument) {
		_type = obj0.type;
		obj0 = obj0.value;
	}
	if (args0 instanceof Argument) {
		args0 = args0.value;
	}
	if (method.in(the.methods)) {
		return the.methods[method];
	}
	// if (method.in(locals())) {// geht nicht in js!!!
	// 	return locals()[method];
	// }
	if (method.in(global)) {
		return global[method];
	}
	if (method.in(dir(obj0))) {
		return obj0[method];
	}
	if (_type && _type.in(context.extensionMap)) {
		ex = context.extensionMap[_type];
		if (method.in(dir(ex))) {
			method = ex[method];
			if (bind) {
				method = method.__get__(obj0, ex);
			}
			return method;
		}
	}
	if ((obj0 instanceof type) && method.in(obj0.__dict__)) {
		method = obj0.__dict__[method];
		if (bind) {
			method.__get__(null, obj0);
		}
		return method;
	}
	if (!(method instanceof Function) && (args0 instanceof list) && args0.length > 0) {
		function_ = findMethod((obj0 || args0[0]), method0, args0[0], {
			bind: false
		});
		return function_;
	}
	return method;
}

function align_function_args(args, clazz, method) {
	let newArgs;
	newArgs = {};
	if ((args instanceof dict) || (args instanceof tuple) || (args instanceof list) && method.arguments.length === 1) {
		key = method.arguments[0].name;
		return {
			key: args
		};
	}
	if (!((args instanceof dict) || (args instanceof list))) {
		args = [args];
	}
	for (let param of method.arguments) {
		if (args instanceof dict) {
			if (param.name.in(args)) {
				param.value = args[param.name];
			} else {
				if (param.default) {
					param.value = param.default;
				} else {
					throw new Error("MISSING ARGUMENT %s" % param.name);
				}
			}
		} else {
			if (args instanceof list) {
				if (param.position < args.length) {
					param.value = args[param.position];
				} else {
					if (param.default) {
						param.value = param.default;
					} else {
						throw new Error("MISSING ARGUMENT %s" % param.name);
					}
				}
			}
		}
		newArgs[param.name] = param.value;
	}
	return newArgs;
}

function eval_args(args) {
	if (!args) {
		return [];
	}
	if ((args instanceof list) || (args instanceof tuple)) {
		args = map(do_evaluate, args);
	} else {
		if (args instanceof dict) {
		} else {
			args = [do_evaluate(args)];
		}
	}
	return args;
}

function align_args(args, clazz, method) {
	let aa, defaults, expect, is_bound, margs, varargs, varkw;
	is_bound = ("im_self".in(dir(method)) && method.__self__);
	if (is_bound) {
		if (method.__self__ === args) {
			args = null;
		}
		if ((args && (args instanceof list) && (args.length > 0))) {
			if (method.__self__ === args[0]) {
				args.remove(args[0]);
			}
		}
		return args;
	}
	try {
		if (method instanceof FunctionDef) {
			expect = method.args.length;
		} else {
			[margs, varargs, varkw, defaults] = inspect.getargspec(method);
			expect = (margs.length - ((defaults && defaults.length) || 0) + (varkw && varkw.length) || 0);
		}
		if (!((args instanceof list) || (args instanceof list) || (args instanceof dict))) {
			args = [args];
		}
		if (args instanceof list) {
			if ((args.length > expect) && (args.length > 1)) {
				args = [args];
			}
		}
		if (method instanceof FunctionDef) {
			for (let i = 0; i < expect; i += 1) {
				aa = method.args[i];
				if (aa instanceof Argument) {
					if (aa.name.in(args)) {
						the.params[aa] = args[aa.name];
						the.params[aa.name] = args[aa.name];
					} else {
						the.params[aa] = args[i];
						the.params[aa.name] = args[i];
					}
				} else {
					if (aa.in(args)) {
						the.params[aa] = args[aa];
					} else {
						the.params[aa] = args[i];
					}
				}
			}
			args = the.params;
		}
		return args;
	} catch (e) {
		return args;
	}
}

function call_unbound(method, args, number_of_arguments) {
	let arg0, bound_method, obj_type;
	if (args instanceof dict) {
		try {
			the.result = (method({
				None: args
			}) || NILL);
		} catch (e) {
			the.result = (method(...list(args.values())) || NILL);
		}
	}
	if ((args instanceof list) || (args instanceof tuple)) {
		if ((is_unbound(method) && (args.length === 1) && (number_of_arguments === 1))) {
			// import * as types from 'types';
			arg0 = args[0];
			obj_type = Object.getPrototypeOf(arg0);
			if (method.__self__.__class__.in(extensionMap.values())) {
				the.result = (method(xx(arg0)) || NILL);
			} else {
				bound_method = new types.MethodType(method, obj_type, xx(args[0]));
				the.result = bound_method(args.slice(1));
			}
		} else {
			if ((is_bound(method) && (args.length >= 1) && (method.__self__ === args[0]))) {
				args = args.slice(1);
			}
			the.result = (method(...args) || NILL);
		}
	} else {
		the.result = (method(args) || NILL);
	}
	return the.result;
}

function do_call(obj0, method0, args0 = []) {
	let args, bound, is_builtin, is_first_self, method, method_name, number_of_arguments, obj;
	if (!method0) {
		throw new Error("NO METHOD GIVEN %s %s" % [obj0, args0]);
	}
	if (!interpreting()) {
		return new FunctionCall({
			func: method0,
			arguments: args0,
			object: obj0
		});
	}
	if (method0.in(be_words) && (obj0 === args0)) {
		return true;
	}
	args = eval_args(args0);
	method = findMethod(obj0, method0, args);
	method_name = (method instanceof Function) && method.__name__ || method0;
	if (method === "of") {
		return evaluate_property(args0, obj0);
	}
	is_builtin = (Object.getPrototypeOf(method) === types.BuiltinFunctionType) || (Object.getPrototypeOf(method) === types.BuiltinMethodType);
	bound = is_bound(method);
	if (self_modifying(method)) {
		obj = obj0;
	} else {
		obj = do_evaluate(obj0);
	}
	args = align_args(args, obj, method);
	number_of_arguments = has_args(method, obj, (!(!args)));
	is_first_self = first_is_self(method);
	if (method instanceof FunctionDef) {
		the.result = do_execute_block(method.body, args);
		return the.result;
	}
	console.log("CALLING %s %s with %s" % [(obj || ""), method, args]);
	if (!args && !(method instanceof Function) && method.in(dir(obj))) {
		return obj.__getattribute__(method);
	}
	try {
		if ((!(method instanceof Function) && (args instanceof list))) {
			function map_list(x) {
				function_ = findMethod(x, method0, null);
				if (function_ instanceof FunctionCall) {
					return pyc_emitter.eval_ast(function_, args);
				}
				if (!(function_ instanceof Function)) {
					throw new Error("DONT KNOW how to apply %s to %s" % [method0, args0]);
				}
				return function_();
			}

			the.result = map(map_list, args);
			verbose("GOT RESULT %s " % the.result);
			return the.result;
		}
	} catch (e) {
		console.log(e);
		verbose("CAN'T CALL ARGUMENT WISE");
	}
	if (!(method instanceof Function)) {
		throw new MethodMissingError(Object.getPrototypeOf(obj), method, args);
	}
	if (is_math(method_name)) {
		return do_math(obj, method_name, args);
	}
	if (!obj) {
		if (args && (number_of_arguments > 0)) {
			the.result = call_unbound(method, args, number_of_arguments);
		} else {
			the.result = method();
		}
	} else {
		if (!args || number_of_arguments === 0 || number_of_arguments === 1 && is_first_self) {
			if (bound || is_builtin) {
				the.result = (method() || NILL);
			} else {
				the.result = (method(obj) || NILL);
			}
		} else {
			if (has_args(method, obj, true)) {
				if (bound || is_builtin) {
					call_unbound(method, args, number_of_arguments);
				} else {
					if ((args instanceof list) && (args.length === 1)) {
						args = args[0];
					}
					the.result = (method(obj, args) || NILL);
				}
			} else {
				the.result = MethodMissingError;
			}
		}
	}
	if (the.result === MethodMissingError) {
		throw new MethodMissingError(obj, method, args);
	}
	verbose("GOT RESULT %s " % the.result);
	return the.result;
}

function do_compare(a, comp, b) {
	a = do_evaluate(a)  // NOT) "a=3; 'a' is 3" !!!!!!!!!!!!!!!!!!!!   Todo ooooooo!!
	b = do_evaluate(b)
	if (isinstance(b, float) && a.match(/^\+?\-?\.?\d/)) a = float(a)
	if (isinstance(a, float) && b.match(/^\+?\-?\.?\d/)) b = float(b)
	if (isinstance(b, int) && a.match(/^\+?\-?\.?\d/)) a = int(a)  // EEK PHP STYLE !? REALLY??
	if (isinstance(a, int) && b.match(/^\+?\-?\.?\d/)) b = int(b)  // EEK PHP STYLE !? REALLY??
	if (is_string(comp)) comp = comp.strip()
	if (comp === 'smaller' || comp === 'tinier' || comp === 'comes before' || comp === '<' || isinstance(comp, ast.Lt))
		return a < b
	else if (comp === 'bigger' || comp === 'larger' || comp === 'greater' || comp === 'comes after' || comp === '>' || isinstance(
			comp, ast.Gt))
		return a > b
	else if (comp === 'smaller || equal' || comp === '<=' || isinstance(comp, ast.LtE))
		return a <= b
	else if (comp === 'bigger || equal' || comp === '>=' || isinstance(comp, ast.GtE))
		return a >= b
	else if (comp in ['!=', 'is not'] || isinstance(comp, ast.NotEq))
		return a === b
	else if (comp in ['in', 'element of'] || isinstance(comp, ast.In))
		return a in b
	else if (comp in subtype_words)
		return issubclass(a, b)
	else if (comp in class_words) {
		if (a === b || isinstance(a, b)) return True
		if (isinstance(a, Variable)) return issubclass(a.type, b) || isinstance(a.value, b)
		if (isinstance(a, type)) return issubclass(a, b) // issubclass? a bird is an animal OK
		return false
	}
	else if (comp === 'equal' || comp === 'the same' || comp === 'the same as' || comp === 'the same as' || comp === '=' || comp === '==')
		return a === b  //// Redundant
	else if (comp === 'not equal' || comp === 'not the same' || comp === 'different' || comp === '!=' || comp === '≠')
		return a !== b  //// Redundant
	else if (comp in be_words || isinstance(comp, (ast.Eq, ast.Eq)) || 'same' in comp)
		return a === b || isinstance(b, type) && isinstance(a, b)
	else
		try {
			return a.send(comp, b) // // raises!
		} catch (ex) {
			error('ERROR COMPARING ' + str(a) + ' ' + str(comp) + ' ' + str(b))
			// return a.send(comp + '?', b)
		}
}

function drop_plural(x) {
	if (x.endswith("s")) {
		return x.slice(0, (-1));
	}
	return x;
}

function liste_selector() {
	let typ, xs;
	if (context.in_list) {
		return false;
	}
	tokens(["every", "all", "those"]);
	typ = typeName();
	tokens(["in", "of"]);
	xs = (maybe(variable) || liste());
	if (interpreting()) {
		if (xs instanceof Variable) {
			xs = xs.value;
		}
		console.log("FILTERING %s in %s" % [typ, xs]);
		xs = filter((x => {
			return is_a(x, typ);
		}, xs));
		console.log(xs);
		return xs;
	}
	return todo("filter list");
}

function selectable() {
	let s, xs;
	must_contain(["that", "whose", "which"]);
	maybe_tokens(["every", "all", "those"]);
	xs = (do_evaluate(known_variable()) || endNoun());
	s = maybe(selector);
	if (interpreting()) {
		xs = filters(xs, s);
	}
	return xs;
}

function filters(liste, criterion) {
	let args, method, mylist;
	if (!criterion) {
		return liste;
	}
	mylist = do_evaluate(liste);
	if (context.use_tree) {
		method = ((criterion["comparative"] || criterion["comparison"]) || criterion["adjective"]);
		args = ((criterion["endNode"] || criterion["endNoun"]) || criterion["expressions"]);
	} else {
		method = criterion();
		args = right;
	}
	return mylist.select((i) => {
		return do_compare(i, method, args);
	});
}

function ranger(a = null) {
	let b;
	if (context.in_params || context.in_args) {
		return false;
	}
	must_contain("to");
	maybe_token("from");
	a = (a || number());
	_("to");
	b = number();
	if (context.use_tree) {
		return ast.call("range", [a, new ast.Num(b + 1)]);
	}
	return list(range(a, (b + 1)));
}

function endNode() {
	let po, x;
	raiseEnd();
	x = maybe(liste) ||
		maybe(fileName) ||
		maybe(linuxPath) ||
		maybe(quote) ||
		maybe(regexp) ||
		maybe(() => maybe(article) && typeNameMapped()) ||
		maybe(simpleProperty) ||
		maybe(evaluate_property) ||
		maybe(selectable) ||
		maybe(liste_selector) ||
		maybe(known_variable) ||
		maybe(article) && word() ||
		maybe(ranger) ||
		maybe(value) ||
		maybe(typeNameMapped) ||
		maybe(variable) ||
		maybe_token("a") ||
		raise_not_matching("Not an endNode");
	po = maybe(postjective);
	if (po && interpreting()) {
		x = do_call(x, po, null);
	}
	return x;
}

function endNoun(included = null) {
	let adjs, obj;
	if (!included) {
		included = [];
	}
	maybe(article);
	adjs = star(adjective);
	obj = maybe(() => {
		return noun(included);
	});
	if (!obj) {
		if (adjs && adjs.join(" ").is_noun) {
			return adjs.join(" ");
		} else {
			throw new NotMatching("no endNoun");
		}
	}
	if (context.use_tree) {
		return obj;
	}
	if (adjs && (adjs instanceof list)) {
		todo("adjectives in endNoun");
		return ((" " + " ".join(adjs) + " ") + obj.toString());
	}
	return obj.toString();
}

function start_xml_block(type) {
	_("<");
	if (type) {
		_(type);
	} else {
		type = word();
	}
	_(">");
	return type;
}

function check_end_of_statement() {
	return (checkEndOfLine() || (the.current_word === ";") || maybe_tokens(done_words));
}

end_of_statement = () => {
	return beginning_of_line() ||
		maybe_newline() ||
		starts_with(done_words) ||
		the.current_offset === 0 ||
		the.current_word === ";" ||
		the.previous_word === ";" ||
		the.previous_word === "\n" ||
		check_end_of_statement()
}

function english_to_math(s) {
	s = str(s);
	s = s.replace_numerals();
	s = s.replace(" plus ", "+");
	s = s.replace(" minus ", "-");
	s = s.replace("(\\d+) multiply (\\d+)", "\\1 * \\2");
	s = s.replace("multiply (\\d+) with (\\d+)", "\\1 * \\2");
	s = s.replace("multiply (\\d+) by (\\d+)", "\\1 * \\2");
	s = s.replace("multiply (\\d+) and (\\d+)", "\\1 * \\2");
	s = s.replace("divide (\\d+) with (\\d+)", "\\1 / \\2");
	s = s.replace("divide (\\d+) by (\\d+)", "\\1 / \\2");
	s = s.replace("divide (\\d+) and (\\d+)", "\\1 / \\2");
	s = s.replace(" multiplied by ", "*");
	s = s.replace(" times ", "*");
	s = s.replace(" divided by ", "/");
	s = s.replace(" divided ", "/");
	s = s.replace(" with ", "*");
	s = s.replace(" by ", "*");
	s = s.replace(" and ", "+");
	s = s.replace(" multiply ", "*");
	return s;
}

function evaluate_index(obj = null) {
	let index, set, va;
	if (!obj) {
		should_not_start_with("[");
		must_contain(["[", "]"]);
		obj = (maybe(variable) || endNode());
	}
	_("[");
	index = endNode();
	_("]");
	set = (maybe_token("=") || null);
	if (set) {
		set = expression();
	}
	if (interpreting()) {
		if (set !== null) {
			if (obj instanceof Variable) {
				the.result = obj.value[index] = set;
			} else {
				the.result = va[index] = set;
			}
		} else {
			va = do_evaluate(obj);
			the.result = va[index];
		}
	} else {
		the.result = new Subscript({
			value: get(obj),
			slice: new Index(index),
			ctx: new Load()
		});
		if (set !== null) {
			the.result = new Assign([new Subscript(get(obj), new Index(index), new Store())], set);
		}
	}
	return the.result;
}

function evaluate_property(x = null) {
	let y;
	maybe_token("all");
	must_contain_before(["of", "in", "."], "(");
	x = (x || endNoun({
		included: type_keywords
	}));
	tokens(["of", "in"]);
	y = expression();
	if (!interpreting()) {
		return parent_node();
	}
	try {
		the.result = do_evaluate_property(x, y);
	} catch (e) {
		if (e instanceof SyntaxError) {
			verbose("ERROR do_evaluate_property");
		} else {
			throw e;
		}
	}
	return the.result;
}

function jeannie(request) {
	let jeannie_api, params;
	jeannie_api = "https://weannie.pannous.com/api";
	params = "login=test-user&out=simple&input=";
}

function evaluate() {
	let the_expression;
	tokens(eval_keywords);
	no_rollback();
	the_expression = rest_of_line;
	try {
		the.result = eval(english_to_math(the_expression));
	} catch (e) {
		the.result = jeannie(the_expression);
	}
	return the.result;
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

function attribute() {
	return tokens(attributes);
}

function preposition() {
	return tokens(prepositions);
}

function pronoun() {
	return tokens(pronouns);
}

function nonzero() {
	return tokens(nonzero_keywords);
}

function wordnet_is_adverb() {
}

function adverb() {
	let found_adverb;
	no_keyword_except(adverbs);
	found_adverb = maybe_tokens(adverbs);
	if (!found_adverb) {
		raise_not_matching("no adverb");
	}
	return found_adverb;
}

function verb() {
	let found_verb;
	// no_keyword_except(remove_from_list(system_verbs, be_words));
	found_verb = maybe_tokens(((other_verbs + system_verbs + the.verbs) - be_words) - ["do"]);
	if (!found_verb) {
		raise_not_matching("no verb");
	}
	return found_verb;
}

function adjective() {
	return tokens(the.adjectives);
}

function quote() {
	raiseEnd();
	if (the.current_type === _token.STRING || the.current_word[0] === "'" || the.current_word[0] === "\"") {
		the.result = the.current_word.slice(1, (-1));
		if (!interpreting()) {
			the.result = new ast.Str({
				s: the.result
			});
		}
		next_token();
		return the.result;
	}
	raise_not_matching("no quote");
}

function maybe_param(method, classOrModule) {
	// import * as inspect from 'inspect';
	let args, defaults, param, varargs, varkw;
	param = maybe(true_param);
	if (param) {
		return (param.value || param);
	}
	method = findMethod(classOrModule, method);
	[args, varargs, varkw, defaults] = inspect.getargspec(method);
	param = maybe_tokens(varkw + defaults);
	return param;
}

function true_param() {
	let v, vars;
	vars = keys(the.params);
	if (vars.length === 0) {
		throw new NotMatching();
	}
	v = tokens(vars);
	v = the.params[v];
	return v;
}

function known_variable(node = true) {
	let v, v0, vars;
	vars = keys(the.variables);
	if (vars.length === 0) {
		throw new NotMatching();
	}
	v0 = tokens(vars);
	if (!interpreting()) {
		return name(v0);
	}
	v = the.variables[v0];
	return v;
}

function noun(include = []) {
	let a;
	a = maybe_tokens(articles);
	if (!a) {
		should_not_start_with(list(keywords) - include);
	}
	if (!context.use_wordnet) {
		return word(include);
	}
	if (the.current_word.in(the.nouns)) {
		return the.current_word;
	}
	raise_not_matching("noun");
}

function bla() {
	return tokens(["hey"]);
}

function _the() {
	return tokens(articles);
}

function the_() {
	maybe_tokens(articles);
}

function fileName() {
	let match, path;
	raiseEnd();
	match = is_file(the.string, false);
	if (match) {
		path = match[0];
		path = (stem.util.system.is_mac() ? path.gsub("^/home", "/Users") : path);
		path = new extensions.File(path);
		next_token();
		the.current_value = path;
		return path;
	}
	return false;
}


function linuxPath() {
	let match, path;
	raiseEnd();
	match = the.string.match(/^(\/[w'.]+)/)
	if (match) {
		path = match[0];
		path = (stem.util.system.is_mac() ? path.gsub("^/home", "/Users") : path);
		path = new extensions.Dir(path);
		next_token();
		the.current_value = path;
		return path;
	}
	return false;
}

function loops() {
	return maybe(repeat_every_times) || maybe(repeat_n_times) || maybe(n_times_action) || maybe(action_n_times) || maybe(for_i_in_collection) || maybe(repeat_with) || maybe(while_loop) || maybe(looped_action) || maybe(looped_action_until) || maybe(repeat_action_while) || maybe(as_long_condition_block) || maybe(forever) || raise_not_matching("Not a loop");
}

function repeat_with() {
	(maybe_token("for") || (_("repeat") && _("with")));
	no_rollback();
	let v = variable();
	_("in");
	let c = collection();
	let b = action_or_block();
	if (interpreting()) {
		c.map(i => do_execute_block(b, i))
		return the.result;
	}
	return new ast.For({
		target: v,
		iter: c,
		body: b
	});
}

function while_loop() {
	maybe_tokens(["repeat"]);
	tokens(["while", "as long as"]);
	no_rollback();
	dont_interpret();
	let c = condition();
	allow_rollback();
	maybe_tokens(["repeat"]);
	maybe_tokens(["then"]);
	dont_interpret();
	let b = action_or_block();
	let r = false;
	adjust_interpret();
	if (!interpreting()) {
		return new ast.While({
			test: c,
			body: b
		});
	}
	while (check_condition(c)) {
		r = do_execute_block(b);
	}
	return r;
}

function until_loop() {
	maybe_tokens(["repeat"]);
	tokens(["until", "as long as"]);
	dont_interpret();
	no_rollback();
	let c = condition();
	maybe_tokens(["repeat"]);
	let b = action_or_block();
	let r = false;
	if (interpreting()) {
		while (!check_condition(c)) {
			r = do_execute_block(b);
		}
	}
	return r;
}

function repeat_every_times() {
	must_contain(time_words);
	dont_interpret();
	maybe_tokens(["repeat"]);
	action_or_block();
	let interval = datetime();
}

function repeat_action_while() {
	let b, c;
	_("repeat");
	if (the.current_word.match(/\s*while/))
	{
		raise_not_matching("repeat_action_while != repeat_while_action", the.string);
	}
	b = action_or_block();
	_("while");
	c = condition();
	if (!interpreting()) {
		return new ast.While({
			test: c,
			body: b
		});
	}
	while (check_condition(c)) {
		the.result = do_execute_block(b);
	}
	return the.result;
}

function looped_action() {
	let a, c, r;
	must_not_start_with("while");
	must_contain(["as long as", "while"]);
	dont_interpret();
	maybe_tokens(["do", "repeat"]);
	a = action();
	tokens(["as long as", "while"]);
	c = condition();
	r = false;
	if (!interpreting()) {
		return a;
	}
	if (interpreting()) {
		while (check_condition(c)) {
			r = do_execute_block(a);
		}
	}
	return r;
}

function looped_action_until() {
	let a, b, c, r;
	must_contain("until");
	b = maybe_tokens(["do", "repeat"]);
	dont_interpret();
	a = (b ? action_or_block("until") : action());
	_("until");
	c = condition();
	r = false;
	if (!interpreting()) {
		return a;
	}
	if (interpreting()) {
		while (!check_condition(c)) {
			r = do_execute_block(a);
		}
	}
	return r;
}

function is_number(n) {
	return (str(n).parse_number() !== 0);
}

function action_n_times(a = null) {
	let n;
	must_contain("times");
	dont_interpret();
	maybe_tokens(["do"]);
	a = (a || action());
	n = number();
	_("times");
	end_block();
	if (interpreting()) {
		int_(n).times(() => {
			return do_evaluate(a);
		});
	} else {
		todo("action_n_times");
	}
	return a;
}

function n_times_action() {
	let a, n;
	must_contain("times");
	n = number();
	_("times");
	no_rollback();
	maybe_tokens(["do", "repeat"]);
	dont_interpret();
	a = action_or_block();
	if (interpreting()) {
		xint(n).times_do(() => {
			return do_evaluate(a);
		});
	}
	return a;
}

function repeat_n_times() {
	let b, n;
	_("repeat");
	n = number();
	_("times");
	dont_interpret();
	no_rollback();
	b = action_or_block();
	adjust_interpret();
	if (interpreting()) {
		the.result = xint(n).times_do(() => {
			return do_execute_block(b);
		});
	} else {
		return new For(store("i"), call("range", [zero, n]), [assign("it", b)]);
	}
	return the.result;
}

function forever(a = null) {
	must_contain("forever");
	a = (a || action());
	_("forever");
	if (interpreting()) {
		// noinspection InfiniteLoopJS
		while (true) {
			do_execute_block(a);
		}
	}
}

function as_long_condition_block() {
	let a, c;
	_("as long as");
	c = condition();
	if (!c) {
		dont_interpret();
	}
	a = action_or_block();
	if (interpreting()) {
		while (check_condition(c)) {
			do_execute_block(a);
		}
	}
}

function ruby_action() {
	_("ruby");
	exec(action || quote);
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

setVerbose = (ok = 1) => context._verbose = ok;

main = function () {
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
english_parser_imported = true;
context.starttokens_done = true;

//// sourceMappingURL=english_parser.js.map
module.exports = {
	main: main,
	rooty: rooty,
	interpretation: interpretation,
	// dont_interpret:power_parser.dont_interpret
};
exports = module.exports