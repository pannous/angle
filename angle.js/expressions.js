let {do_evaluate_property} = require("./values")

let {Variable, Argument} = require('./nodes')
let {endNoun, verb_comparison} = require("./english_parser")

let {
	block,
	checkNewline,
	raiseNewline,
	dont_interpret,
	look_1_ahead,
	maybe,
	maybe_indent,
	must_not_start_with,
	must_contain,
	must_contain_before,
	must_not_contain,
	maybe_tokens,
	method_allowed,
	next_token,
	no_rollback,
	one_or_more,
	pointer,
	pointer_string,
	raiseEnd,
	raise_not_matching,
	skip_comments,
	starts_with,
	star,
	token,
	tokens,
	action_or_expression
} = require('./power_parser')

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
	postjective
} = require('./english_parser')

let {
	action, do_evaluate, do_math, selfModify, method_call
} = require('./actions')

let {
	known_variable,
	mapType,
	number,
	parse_integer,
	quote,
	typeName,
	typeNameMapped,
	value,
	variable,
	word,
} = require('./values')
let _ = token

function expression(fallback = null, resolve = true) {
	let ex;
	// maybe(space)
	if (the.current_word === "") throw new EndOfLine()
	if (the.current_word === ";") throw new EndOfStatement()
	the.result = ex = maybe(quick_expression) || // again for not statements . Todo: not!
		maybe(nth_item) ||
		maybe(algebra) ||
		maybe(hash_map) ||
		maybe(evaluate_index) ||
		maybe(liste) ||
		maybe(evaluate_property) ||
		maybe(selfModify) ||
		maybe(true_param) ||
		maybe(the_noun_that) || // english!
		maybe(endNode) ||
		maybe(passing) ||
		raise_not_matching("Not an expression: " + pointer_string())
	ex = post_operations(ex) || ex;
	skip_comments()
	if (!interpreting())
		return ex;

	if ((resolve && ex) && interpreting()) {
		the.last_result = the.result = do_evaluate(ex)
	}
	if (the.result && !(the.result === SyntaxError && !(ex === SyntaxError)))
		ex = the.result;
	if (ex === ZERO) ex = 0;
	the.result = ex;
	return the.result;
}


let bracelet = function () {
	tokens("(")
	let a = expression()
	tokens(")")
	return a;
}

function algebra(val = null) {
	if (context.in_algebra) return false;
	if (!val) must_contain_before(operators, be_words)// + ["then", ",", ";", ":"])
	val = val || maybe(value) || bracelet()
	let stack = [val];

	// todo 1,2==[1,2] VS a>1,b==2,c>3
	function lamb() {
		let neg, op, va;
		if (the.current_word.in(be_words) && context.in_args) return false; // f(a=3) acts as micro variable
		op = (maybe(comparation) || operator())
		if (op === "=") throw NotMatching //see setter or comparison
		neg = maybe_token("not")
		va = (maybe(value) || maybe(bracelet))
		if (op.in(be_words)) // take everything on the right side of an equation as a full expression
			context.in_algebra = false
		else
			context.in_algebra = true;
		va = va || expression()
		if (va === ZERO) va = 0;
		stack.insert(op)
		neg && stack.insert(neg)
		stack.insert(va)
		return (va || true)
	}

	star(lamb)
	context.in_algebra = false;
	the.result = fold_algebra(stack)
	if (the.result === false) the.result = FALSE;
	if (the.result === null) the.result = NONE;
	return the.result;
}

function fold_algebra(stack) {
	let used_operators = operators.filter(x => x.in(stack))
	let used_ast_operators = Object.values(ast_operator_map).filter(x => stack.has(x))
	for (let op of used_operators.plus(used_ast_operators)) {
		let i = 0
		while (i < stack.length) {
			if (stack[i] == op)
				result = apply_op(stack, i, op)
			i += 1
		}
		stack = stack.filter(x => x) // compress
	}
	if ((stack.length > 1) && (used_operators.length > 0)) {
		throw new Error("Not all operators consumed in %s ,only %s".format(stack, used_operators))
	}
	return result//stack[0]
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
		replaceI12(stack, do_math(left, op, right) || FALSE)
	} else if ((op === "!") || (op === "not")) {
		result = ast.Not(right)
		stack[(i)] = [result];
		delete stack[i + 1];
		delete stack[i]
	} else {
		left = fix_context(left)
		right = fix_context(right)
		if (op instanceof ast.operator) {
			replaceI12(stack, new ast.BinOp(left, ast_operator(op), right))
		} else if (op.in(true_operators)) {
			replaceI12(stack, new ast.BinOp(left, ast_operator(op), right))
		} else if (op.in(comparison_words)) {
			replaceI12(stack, new ast.Compare(left, [ast_operator(op)], [right]))
		} else {
			replaceI12(stack, new ast.Compare(left, [ast_operator(op)], [right]))
		}
	}
	return result === 0 ? ZERO : result
}


function comparation() {
	let _not, comp, eq, start;
	eq = maybe_tokens(be_words)
	maybe_token("all")
	start = pointer()
	maybe_tokens(["either", "neither"])
	_not = maybe_tokens(["not"])
	maybe(adverb)
	if (eq) {
		comp = maybe_tokens(comparison_words)
	} else {
		comp = tokens(comparison_words)
		no_rollback()
	}
	if (eq) {
		maybe_token("to")
	}
	maybe_tokens(["and", "or", "xor", "nor"])
	maybe_tokens(comparison_words)
	maybe_token("than")
	comp = (comp || eq)
	if (context.use_tree) {
		comp = ast.operator_map[comp];
	}
	return comp
}


function operator() {
	return tokens(operators)
}

function isUnary(op) {
	todo("isUnary")
	return false;
}


function passing() {
	let ok;
	ok = tokens(["pass", ";"])
	return (interpreting() ? ok : new ast.Pass())
}

var article = x => maybe_tokens(article_words)

function endNode() {
	let po, x;
	raiseEnd()
	x = !context.in_list && maybe(liste) ||
		maybe(fileName) ||
		maybe(linuxPath) ||
		maybe(quote) ||
		maybe(article) && typeNameMapped() ||
		maybe(simpleProperty) ||
		maybe(evaluate_property) ||
		maybe(selectable) ||
		maybe(liste_selector) ||
		maybe(known_variable) ||
		maybe(ranger) ||
		maybe(value) ||
		maybe(typeNameMapped) ||
		maybe(variable) ||
		maybe(article) && word() ||
		maybe_token("a") ||
		maybe(word) || // any!
		raise_not_matching("Not an endNode")
	po = maybe(postjective)
	if (po && interpreting()) {
		x = do_call(x, po, null)
	}
	return x;
}

function is_a(x, type0) {
	let _type = mapType(type0)
	if (_type == String) return is_string(x)
	if (_type == Map) return true // in Javascript all objects are hashes
	if (_type == Object) return true // not by default!!
	if (_type == Boolean) return truthy(x)
	return typeof x == type0 || x instanceof _type
}

function nth_item(val = 0) {
	let l, n, set, type;
	set = maybe_token("set")
	n = val || tokens(number_selectors.plus(["last", "middle"]))
	n = parse_integer(n)
	if (n > 0) n = (n - 1)
	raiseEnd()
	maybe_tokens([".", "rd", "st", "nd"])
	type = maybe_tokens(["item", "element", "object", "word", "char", "character"])
	type = type || maybe_tokens(type_names)
	maybe_tokens(["in", "of"])
	l = (do_evaluate(maybe(known_variable) || maybe(liste)) || quote())
	if (type.match(/^char/)) {
		l = "".join(l)
		if (n < 0) n = l.length + n
		the.result = l[n]
		return the.result;
	}
	else if (is_string(l)) l = l.split(" ")
	if ((l instanceof Array) && type.in(type_names)) {
		l = l.filter(x => is_a(x, type))
	}
	if (n > l.length) throw new IndexError("%d > %d in %s[%d]".format(n, l.length, l, n))
	the.result = l.splice(n)[0]
	if (context.in_condition) return the.result;
	if (set && _("to")) {
		val = endNode()
		the.result = do_evaluate(val)
		l[n] = the.result;
	}
	return the.result;
}


function functionalselector() {
	let crit, xs;
	if (contains(",")) {
		return list()
	}
	if (contains(":")) {
		return hash()
	}
	_("{")
	xs = known_variable()
	crit = selector()
	_("}")
	return list(filter(xs, crit))
}

function liste(check = true, first = null) {
	let all, start_brace;
	if ((!first) && (the.current_word === ","))
		throw new NotMatching(liste)

	if (context.in_hash) must_not_contain(":")

	start_brace = maybe_tokens(["[", "{", "("])
	if (!start_brace && check) must_contain_before(",")
	if ((!start_brace) && (context.in_list || in_args))
		throw new NotMatching("not a deep list")

	context.in_list = true;

	first = (first || maybe(endNode))
	if (!first) context.in_list = false;
	if (!first) raise_not_matching()
	if (first instanceof Array) {
		all = first;
	} else {
		all = [first];
	}

	function lamb() {
		let e;
		tokens([",", "and"])
		e = endNode()
		// e = expression() todo
		if (e === ZERO) {
			e = 0;
		}
		all.append(e)
		return e;
	}

	star(lamb)
	if (start_brace === "[") {
		_("]")
	}
	if (start_brace === "{") {
		_("}")
	}
	if (start_brace === "(") {
		_(")")
	}
	context.in_list = false;
	if (context.use_tree) {
		return new ast.List(all, new ast.Load())
	}
	return all;
}

function swift_hash() {
	let h;
	_("[")
	h = {};

	function hashy() {
		let key;
		if (h.length > 0) {
			_(",")
		}
		maybe_tokens(["\"", "'"])
		key = word()
		maybe_tokens(["\"", "'"])
		_(":")
		context.context.in_list = true;
		h[key] = expression()
		the.result = {
			key: h[key]
		};
		return the.result;
	}

	star(hashy)
	_("]")
	context.context.in_list = false;
	return h;
}


function hash_map() {
	must_contain_before(hash_assign, ["}"])
	let z = (starts_with("{") ? regular_hash() : immediate_hash())
	return z;
}


function regular_hash() {
	let h;
	_("{")
	no_rollback()
	context.in_hash = true;
	(maybe_tokens(hash_assign) && no_rollback())
	h = {};

	function lamb() {
		let key, val;
		// if (len(h) > 0) tokens([";", ","])
		key = maybe(quote) || word()
		maybe_tokens(hash_assign) || starts_with("{")
		val = expression()
		h[key] = val;
		maybe_tokens([",", ";", " "])
		if (checkNewline()) next_token(false)
		return h
	}

	star(lamb)
	_("}")
	context.in_hash = false;
	if (!interpreting()) {
		return new Dict(keys(h)), list(h.values())
	}
	return h;
}

function immediate_hash() {
	let r, w;
	must_contain_before(hash_assign, "}")
	w = (maybe(quote) || word())
	if (maybe_tokens(hash_assign)) {
		r = expression()
	} else {
		if (starts_with("{") || _("=>")) {
			no_rollback()
			r = regular_hash()
		} else {
			raise_not_matching("no immediate_hash")
		}
	}
	if (interpreting()) {
		let dict = {}
		dict[w] = r
		return dict
	}
	return new ast.Dict([w], [r])
}

function subProperty(_context) {
	let ext, properties, property;
	must_contain(".")
	maybe_token(".")
	properties = dir(_context)
	let extensions = context.extensionMap;
	ext = extensions[_context] || extensions[typeof(_context)] || extensions[type(_context)]
	if (ext) properties += dir(ext)
	property = maybe_tokens(properties)
	if (!property || (property instanceof Function) || is_method(property)) {
		return [_context, property];
	}
	property = (maybe_token(".") && subProperty(property) || property)
	return [property, null];
}

// <> VS?
function evaluate_property(x = null) {
	let y;
	maybe_token("all")
	must_contain_before(property_selectors, "(")
	x = (x || endNoun(type_keywords))
	tokens(property_selectors)
	y = expression()
	// if (!interpreting())
	// 	return ast.BinOp()
	try {
		the.result = do_evaluate_property(x, y)
	} catch (e) {
		if (e instanceof SyntaxError) {
			verbose("ERROR do_evaluate_property")
		} else {
			throw e;
		}
	}
	return the.result;
}

function evaluate_index(obj = null) {
	let index, set, va;
	if (!obj) {
		must_not_start_with("[")
		must_contain(["[", "]"])
		obj = (maybe(variable) || endNode())
	}
	_("[")
	index = endNode()
	_("]")
	set = (maybe_token("=") || null)
	if (set) {
		set = expression()
	}
	if (interpreting()) {
		if (set !== null) {
			if (obj instanceof Variable) {
				the.result = obj.value[index] = set;
			} else {
				the.result = va[index] = set;
			}
		} else {
			va = do_evaluate(obj)
			the.result = va[index];
		}
	} else {
		the.result = new Subscript({
			value: get(obj),
			slice: new Index(index),
			ctx: new Load()
		})
		if (set !== null) {
			the.result = new Assign([new Subscript(get(obj), new Index(index), new Store())], set)
		}
	}
	return the.result;
}


function maybe_param(method, classOrModule) {
	// import * as inspect from 'inspect';
	let args, defaults, param, varargs, varkw;
	param = maybe(true_param)
	if (param) {
		return (param.value || param)
	}
	method = findMethod(classOrModule, method)
		[args, varargs, varkw, defaults] = inspect.getargspec(method)
	param = maybe_tokens(varkw + defaults)
	return param;
}

function true_param() {
	let v, vars;
	vars = keys(the.params)
	if (vars.length === 0) {
		throw new NotMatching("true_param")
	}
	v = tokens(vars)
	v = the.params[v];
	return v;
}

let articles = x => tokens(article_words)

function the_noun_that() {
	let criterium, n;
	maybe(articles)
	n = noun()
	if (!n) {
		raise_not_matching("no noun")
	}
	if (the.current_word === "that") {
		criterium = star(selector)
		if (criterium && interpreting()) {
			n = filter(n, criterium)
		} else {
			n = resolve_netbase(n)
		}
	} else {
		if (n.in(the.variables)) {
			return the.variables[n];
		}
		if (n.in(the.classes)) {
			return the.classes[n];
		}
		raise_not_matching("only 'that' filtered nouns for now!")
		throw new Error("Undefined: " + n)
	}
	return n;
}


function ranger(a = null) {
	let b;
	if (context.in_params || context.in_args) {
		return false;
	}
	must_contain("to")
	maybe_token("from")
	a = (a || number())
	_("to")
	b = number()
	if (context.use_tree) {
		return ast.call("range", [a, new ast.Num(b + 1)])
	}
	return list(range(a, (b + 1)))
}


function liste_selector() {
	let typ, xs;
	if (context.in_list) return false;
	tokens(["every", "all", "those"])
	typ = typeName()
	tokens(["in", "of"])
	xs = (maybe(variable) || liste())
	if (interpreting()) {
		if (xs instanceof Variable) {
			xs = xs.value;
		}
		console.log("FILTERING %s in %s".format(typ, xs))
		xs = xs.filter(x => is_a(x, typ))
		console.log(xs)
		return xs;
	}
	return todo("filter list")
}

function selectable() {
	let s, xs;
	must_contain(["that", "whose", "which"])
	maybe_tokens(["every", "all", "those"])
	xs = (do_evaluate(known_variable()) || endNoun())
	s = maybe(selector)
	if (interpreting()) {
		xs = filters(xs, s)
	}
	return xs;
}

function filters(liste, criterion) {
	let args, method, mylist;
	if (!criterion) {
		return liste;
	}
	mylist = do_evaluate(liste)
	if (context.use_tree) {
		method = ((criterion["comparative"] || criterion["comparison"]) || criterion["adjective"])
		args = ((criterion["endNode"] || criterion["endNoun"]) || criterion["expressions"])
	} else {
		method = criterion()
		args = right;
	}
	return mylist.select((i) => {
		return do_compare(i, method, args)
	})
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


function do_get_class_constant(c) {
	try {
		for (let module of sys.modules) {
			if (c in module) return module[c];
		}
	} catch (e) {
		console.error(e)
	}
}

function class_constant() {
	let c = word;
	return do_get_class_constant(c)
}


function simpleProperty() {
	let module, prop, x;
	must_contain_before(".", (special_chars + keywords))
	module = token(the.moduleNames)
	module = get_module(module)
	_(".")
	prop = word()
	if (interpreting()) {
		x = module[prop];
		return x;
	}
	return new ast.Attribute(new ast.Name(module, new ast.Load()), prop, new ast.Load())
}

function property(container) {
	let of_, properti, sett;
	must_contain_before(property_selectors, special_chars)
	container = container || variable().value;
	of_ = tokens(property_selectors)
	no_rollback()
	properti = word()
	if (of_ === "of") {
		[container, properti] = [properti, container];
	}
	sett = (maybe_token("=") && expression())
	if (sett) {
		if (interpreting()) {
			if (container instanceof Object /*todo*/) {
				container[properti] = sett;
			} else {
				container[properti] = sett;
			}
			return sett;
		}
		return new Assign([new Attribute(container, properti, (sett && new Store() || new Load())), sett])
	}
	if (interpreting()) {
		if (container instanceof Object /*todo*/) {
			return container[properti];
		} else {
			return container[properti];
		}
	}
	return new Attribute(container, properti, (sett && new Store() || new Load()))
}


function alias(var_ = null) {
	let aliaz, fun_def;
	if (!var_) {
		must_contain(["alias", ":="])
		aliaz = _("alias")
		var_ = variable(false, {
			ctx: new ast.Store()
		})
		if (look_1_ahead("(")) {
			return method_definition(var_.name)
		}
		aliaz || tokens(be_words)
	}
	dont_interpret()
	let rest = rest_of_line()
	add_variable(var_, rest)
	var_.type = "alias";
	if (context.use_tree) {
		fun_def = new FunctionDef({
			name: var_.name,
			body: rest
		})
		addMethodNames(fun_def)
		return fun_def;
	}
	return var_;
}


function fileName() {
	let match, path;
	raiseEnd()
	match = is_file(the.string, false)
	if (match) {
		path = match[0];
		path = (stem.util.system.is_mac() ? path.gsub("^/home", "/Users") : path)
		path = new extensions.File(path)
		next_token()
		the.current_value = path;
		return path;
	}
	return false;
}

function linuxPath() {
	let match, path;
	raiseEnd()
	match = the.string.match(/^(\/[w'.]+)/)
	if (match) {
		path = match[0];
		path = (stem.util.system.is_mac() ? path.gsub("^/home", "/Users") : path)
		path = new extensions.Dir(path)
		next_token()
		the.current_value = path;
		return path;
	}
	return false;
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


function condition() {
	let brace, comp, cond, filter, left, negate, negated, quantifier, right, start, use_verb;
	// start = pointer();
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
	if ((left instanceof Array) && (!(right instanceof Array))) {
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


quick_expression = function quick_expression() {
	let fun, result, z;
	result = false;
	let word = the.current_word;
	if (!word)
		throw new EndOfLine();
	if (word === ";")
		throw new EndOfStatement();
	if ((!context.in_params) && look_1_ahead(":"))
		return immediate_hash();
	if (word === "{") {
		if (look_1_ahead("}"))
			return empty_map();
		if (contains("=>") || contains(":"))
			return hash_map();
	}
	if (look_1_ahead([".", "'s", "of"]))
		return (maybe(method_call) || property());// method_call: a.b()
	if (look_1_ahead("=")) if (!context.in_condition)
		return setter();

	// if (type_names.has(word) || word.in(the.classes)) return require("./statements").declaration();
	if (word.in(all_operators) && the.current_word !== "~") return false;

	if (word === ",")
		result = liste(the.result);
	else if (!context.in_hash && look_1_ahead(","))
		result = liste();
	else if (word.in(number_selectors)) {
		result = nth_item()
	} else if (the.current_type === _token.NUMBER) {
		result = number();
		if (maybe_tokens(["st", "nd", "rd", "th", "nth"])) result = nth_item(result);
		// if (the.current_word.in(all_operators)) return condition()
	} else if (word.in(quantifiers)) {
		result = liste_selector() // both should work
		// result = condition()
		// result = maybe(condition)||liste_selector()
	} else if (word.startsWith("r'") || word.startsWith("/")) {
		result = regexp(word);
		next_token(false);
	} else if ((the.current_type === _token.STRING) || word.startsWith("'")) {
		result = quote();
	} else if (word.in(the.token_map)) {
		fun = the.token_map[word];
		debug("token_map: %s -> %s".format(word, fun.name));
		result = fun();
	} else if (word.in(the.method_token_map)) {
		fun = the.method_token_map[word];
		debug("method_token_map: %s -> %s".format(word, fun.name));
		result = fun();
	} else if (word.in(the.method_names)) {
		if (method_allowed(word)) {
			result = method_call();
		}
	} else if (word.in(the.params)) {
		result = true_param();
	} else if (word.in(the.variables)) {
		result = known_variable();
	} else if (word.in(type_names)) {
		return (maybe(setter) || method_definition());
	}
	if (look_1_ahead("of")) result = evaluate_property(result);
	if (!result) return false;
	while (true) {
		z = post_operations(result);
		if (!z || z === result) break;
		result = z;
	}
	return result;
}

post_operations = function post_operations(result) {
	if (!the.current_word || !result) {
		return result;
	}
	if (the.current_word === ";") {
		return result;
	}
	if (the.current_word === ".") {
		return method_call(result);
	}
	if (the.current_word === "," && !(context.in_args || context.in_params || context.in_hash)) {
		return liste(/*check:*/ false, /*first: */result);
	}
	if (the.current_word.in(self_modifying_operators)) {// += ..
		return self_modify(result);
	}
	if (the.current_word === "++" || the.current_word === "+" && look_1_ahead("+")) {
		return plusPlus(result);
	}
	if (the.current_word === "--" || the.current_word === "-" && look_1_ahead("-")) {
		return minusMinus(result);
	}
	if (the.current_word.in(be_words)) {
		if (!context.in_condition && !context.in_args && !context.in_params) {
			if (result instanceof Variable) {
				return setter(result);
			} else
			// return comparative(result)
				return algebra(result)
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
	if (the.current_word.in(property_selectors)) {
		return property(result)
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
	if (the.current_word === "if") {
		return (_("if") && condition() ? result : (maybe("else") && expression() || null));
	}
	if (the.current_line.endswith("times")) {
		return action_n_times(result);
	}
	if (the.current_word.in(be_words)) {
		return setter(result);
	}
	if (the.current_word.match(/ed$/)) {
		return method_call(result)
	}
	return false;
}

module.exports = {expression, subProperty, property, algebra, liste, evaluate_property, nth_item, hash_map, condition}
