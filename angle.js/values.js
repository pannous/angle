// values / end-nodes vs expression!
let {next_token,starts_with,must_not_start_with,checkNewline,raiseNewline,maybe_indent,maybe,must_contain_before_,maybe_tokens}=require('./power_parser')

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
}=require('./english_parser')

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
function nod() {
	return maybe(number) ||
		maybe(quote) ||
		maybe(regexp) ||
		maybe(known_variable) ||
		maybe(true_param) ||
		the_noun_that() // english!
}


let word_regex = "^\s*[a-zA-Z]+[\w_]*";
function word(include = null) {
	let current_value, match;
	maybe_tokens(article_words);
	must_not_start_with(keywords,include);
	raiseNewline();
	match = the.current_word.match(word_regex);
	if (match) {
		current_value = the.current_word;
		next_token();
		return current_value;
	}
	raise_not_matching("word");
}


function bracelet() {
	let a;
	_("(");
	a = expression();
	_(")");
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
		throw new NotMatching();
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
	b = tokens(["True", "False", "true", "false"]);
	the.result = b === "True" || b === "true" && TRUE || FALSE;
	return the.result;
}

function constant() {
	return constantMap.get(tokens(constants));
}


function typeName() {
	return maybe_tokens(type_names) || classConstDefined();
}

function typeNameMapped() {
	let name = typeName();
	if (name.in(the.classes)) return the.classes[name];
	return mapType(name);
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


module.exports = {
	boole,
	bracelet,
	constant,
	known_variable,
	nill,
	nod,
	quote,
	typeName,
	typeNameMapped,
	value,
	word,
}

