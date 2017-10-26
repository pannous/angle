let {look_1_ahead} = require('./power_parser')

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

function expression(fallback = null, resolve = true) {
	let ex;
	maybe(space);
	if (the.current_word === "") throw new EndOfLine();
	if (the.current_word === ";") throw new EndOfStatement();
	the.result = ex = maybe(quick_expression) ||
		maybe(listselector) ||
		maybe(algebra) ||
		maybe(hash_map) ||
		maybe(evaluate_index) ||
		maybe(liste) ||
		maybe(evaluate_property) ||
		maybe(selfModify) ||
		maybe(endNode) ||
		maybe(passing) ||
		raise_not_matching("Not an expression: " + pointer_string());
	ex = post_operations(ex) || ex;
	skip_comments();
	if (!interpreting())
		return ex;

	if ((resolve && ex) && interpreting()) {
		the.last_result = the.result = do_evaluate(ex);
	}
	if (the.result && !(the.result === SyntaxError && !(ex === SyntaxError)))
		ex = the.result;
	if (ex === ZERO) ex = 0;
	the.result = ex;
	return the.result;
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
	if (!the.current_word.in)
		console.log("HO")

	if (type_names.has(the.current_word) || the.current_word.in(the.classes)) {
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
		debug("token_map: %s -> %s".format(the.current_word, fun));
		result = fun();
	} else if (the.current_word.in(the.method_token_map)) {
		fun = the.method_token_map[the.current_word];
		debug("method_token_map: %s -> %s".format(the.current_word, fun));
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

function selfModify() {
	return (maybe(self_modify) || maybe(plusPlus) || minusMinus());
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

function evaluate_index(obj = null) {
	let index, set, va;
	if (!obj) {
		must_not_start_with("[");
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
		console.log("FILTERING %s in %s".format(typ, xs));
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

module.exports={quick_expression,expression}