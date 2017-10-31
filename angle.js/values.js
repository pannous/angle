// values / end-nodes vs expression!
let {verbose} = require("./power_parser")

let {Variable, Argument} = require('./nodes')
let {
	block,
	checkNewline,
	raiseNewline,
	raiseEnd,
	dont_interpret,
	look_1_ahead,
	maybe,
	maybe_indent,
	must_not_start_with,
	must_contain_before_,
	must_contain_before,
	maybe_tokens,
	next_token,
	one_or_more,
	starts_with,
	tokens,
	token
}=require('./power_parser')

let {
	adjective,
	adverb,
	attribute,
	drop_plural,
	noun,
	preposition,
	pronoun,
	verb,
	wordnet_is_adverb,
} = require('./english_parser')

function value() {
	let current_value, typ;
	if (the.current_type === _token.STRING) {
		return quote();
	}
	if (the.current_type === _token.NUMBER) {
		return number();
	}
	current_value = null;
	must_not_start_with(keywords_except_values)
	the.result =
		maybe(bracelet) ||
		maybe(special_blocks) ||
		maybe(quote) ||
		maybe(nill) ||
		maybe(number) ||
		maybe(known_variable) ||
		maybe(boole) ||
		maybe(constant) ||
		maybe(it) ||
		maybe(nod) ||
		raise_not_matching("Not a value");
	if (maybe_tokens(["as"])) {
		typ = typeNameMapped();
		the.result = call_cast(the.result, typ);
	}
	return the.result;
}

function it() {
	tokens(result_words);
	return the.last_result;
}


function nod() {
	return maybe(number) ||
		maybe(quote) ||
		maybe(regexp) ||
		maybe(known_variable)
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
let word_regex = "^\s*[a-zA-Z]+[\w_]*";

function word(include = null) {
	let current_value, match;
	maybe_tokens(article_words);
	must_not_start_with(keywords, include);
	raiseNewline();
	match = the.current_word.match(word_regex);
	if (match) {
		current_value = the.current_word;
		next_token(false);
		return current_value;
	}
	raise_not_matching("word");
}



function bracelet() {
	tokens("(");
	let a = expression();
	tokens(")");
	return a;
}

function quote() {
	raiseEnd();
	if (the.current_type === _token.STRING || the.current_word[0] === "'" || the.current_word[0] === "\"") {
		// the.result = the.current_word.slice(1, (-1));
		the.result = the.current_word
		next_token(false);
		if (!interpreting()) the.result = new ast.Str(the.current_word);
		return the.result;
	}
	raise_not_matching("no quote");
}

function nill() {
	if (tokens(nill_words)) {
		return NILL;
	}
}

function known_variable(node = true) {
	let v, v0, vars;
	vars = keys(the.variables);
	if (vars.length === 0) {
		throw new NotMatching(known_variable);
	}
	v0 = tokens(vars);
	if (!interpreting()) {
		return name(v0);
	}
	v = the.variables[v0];
	return v;
}

function boole() {
	let b;
	b = tokens(boolean_words);
	the.result = (b == "True" || b == "true" || b == "yes" || b == "ok") && TRUE || FALSE;
	return the.result;
}

function constant() {
	return constantMap[tokens(constants)];
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


function no_keyword(except) {
	must_not_start_with(keywords, except);
}

function current_context() {
	return module
	// return todo("current_context")
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
	if (node instanceof Array) {
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


function new_variable(name,typ,ctx=ast.Store) {
	if (name.in(the.variables)) return the.variables[name];
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

function variable(a = null, ctx = ast.Load, isParam = false) {
	let all, name, oldVal, p, param, typ;
	a = (a || maybe_tokens(article_words));
	if(a&&the.current_word.in(be_words))return new_variable(a)
	no_keyword()
	must_not_start_with(the.method_names)// unless overwrite!!
	typ = maybe(typeNameMapped);
	p = maybe_tokens(possessive_pronouns);
	no_keyword();
	all = one_or_more(word);
	if (empty(all)) raise_not_matching();
	name = " ".join(all);
	if (!typ && all.length > 1 && isType(all[0])) {
		name = all.slice(1, (-1)).join(" ");
	}
	if (p) name = ((p + " ") + name);
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
		return new_variable(name,typ)
	}
	throw new Error("Unknown variable context " + ctx);
}



let number = () => maybe(real) || maybe(fraction) || maybe(integer) || maybe(number_word) || raise_not_matching("number")

function number_word() {
	let n;
	n = tokens(numbers);
	return xstr(n).parse_number();
}

function fraction() {
	let f, m;
	f = maybe(integer) || 0;
	m = starts_with(["\u00bc", "\u00bd", "\u00be", "\u2153", "\u2154", "\u2155", "\u2156", "\u2157", "\u2158", "\u2159", "\u215a", "\u215b", "\u215c", "\u215d", "\u215e"]);
	if (!m) {
		if (f !== 0) return f;
		throw new NotMatching(fraction);
	} else {
		m = xstr(m).parse_number();
	}
	the.result = (f + m);
	return the.result;
}

let ZERO = "0";

function integer() {
	let current_value, match;
	match = the.string.match(/^\s*(-?\d+)/i)
	if (match) {
		current_value = parseInt(match[0]);
		next_token(false);
		if (context.use_tree) {
			return new kast.Num(current_value);
		}
		if (current_value === 0) {
			current_value = ZERO;
		}
		return current_value;
	}
	throw new NotMatching("no integer");
}

function real() {
	let current_value, match;
	match = the.string.match(/^\s*(-?\d*\\.\d+)/i)
	if (match) {
		current_value = parseFloat(match.groups()[0]);
		next_token(false);
		return current_value;
	}
	throw new NotMatching("no real (unreal)");
}

function complex() {
	let match, s;
	s = the.string.strip().replace("i", "j");
	match = s.match(/^(\d+j)/i)
	if (!match) {
		match = s.match(/^(\d*\\.\d+j)/i)
	}
	if (!match) {
		match = s.match(/^(\d+\s*\\+\s*\d+j)/i)
	}
	if (!match) {
		match = s.match(/^(\d*\\.\d+\s*\\+\s*\d*\\.\d+j)/i)
	}
	if (match) {
		the.current_value = complex(match[0].groups());
		next_token(false);
		return current_value;
	}
	return false;
}


function classConstDefined() {
	let c;
	try {
		c = the.current_word.capitalize();
		if (!const_defined(c)) {
			throw new NotMatching("Not a class Const");
		}
	} catch (e) {
		if (e instanceof IgnoreException) {
			throw new NotMatching(classConstDefined);
		} else {
			throw e;
		}
	}
	next_token()
	if (interpreting()) {
		c = do_get_class_constant(c);
	}
	if (!c) {
		throw new NotMatching(classConstDefined);
	}
	return c;
}


function typeName() {
	return maybe_tokens(type_names) || classConstDefined();
}

function typeNameMapped() {
	maybe_tokens(article_words)
	let name = typeName();
	if (name.in(the.classes)) return the.classes[name];
	return mapType(name);
}

function mapType(x0) {
	if(the.classes[x0]) return the.classes[x0]
	let x = x0.lower();
	if(the.classes[x0]) return the.classes[x0]
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


function parse_integer(x) {
	if (!x) return 0
	if(!x.replace)
		return x
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



function special_blocks() {
	return (maybe(html_block) || maybe(ruby_block) || javascript_block());
}

let _=token
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



module.exports = {
	boole,
	bracelet,
	constant,
	complex,
	do_evaluate_property,
	fraction,
	integer,
	known_variable,
	nill,
	// nod,
	quote,
	typeName,
	typeNameMapped,
	value,
	variable,
	word,
	number,
	number_word,
	parse_integer,
	real,
	special_blocks,// DATA!
}