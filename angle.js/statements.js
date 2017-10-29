// "use strict"
let {
	adjust_interpret,
	block,
	checkNewline,
	raiseNewline,
	do_interpret,
	dont_interpret,
	look_1_ahead,
	maybe,
	maybe_indent,
	must_not_start_with,
	must_contain_before_,
	must_contain_before,
	must_not_contain,
	must_contain,
	maybe_token,
	maybe_tokens,
	next_token,
	no_rollback,
	one_or_more,
	skip_comments,
	starts_with,
	tokens,
}=require('./power_parser')
let {action,do_evaluate}= require('./actions')
let {Variable, Argument} = require('./nodes')
let {expression,algebra}= require('./expressions')
let {articles}=require('./angle_parser')
let {loops} = require('./loops')
let {
	boole,
	bracelet,
	constant,
	known_variable,
	nill,
	number,
	nod,
	quote,
	typeName,
	typeNameMapped,
	value,
	variable,
} = require('./values')

statement =function statement (doraise = true) {
	let x;
	if (starts_with(done_words) || checkNewline())
		return !doraise || raise_not_matching("end of block ok")
	if (checkNewline()) return NEWLINE;
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
		maybe(piped_actions) ||
		maybe(declaration) ||
		maybe(neu) ||
		maybe(action) ||
		maybe(returns) ||
		maybe(expression) ||
		raise_not_matching("Not a statement %s".format(pointer_string()));
	context.in_condition = false;
	the.result = x;
	the.last_result = x;
	skip_comments();
	adjust_interpret();
	return the.result;
}

quick_expression=function quick_expression() {
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
		if (!context.in_condition) return setter();
	}
	if (type_names.has(the.current_word) || the.current_word.in(the.classes)) {
		return declaration();
	}
	if (the.current_word.in(all_operators)) {
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
		debug("token_map: %s -> %s".format(the.current_word, fun.name));
		result = fun();
	} else if (the.current_word.in(the.method_token_map)) {
		fun = the.method_token_map[the.current_word];
		debug("method_token_map: %s -> %s".format(the.current_word, fun.name));
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

post_operations=function post_operations(result) {
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

function isType(x) {
	return is_type(x) || type_names.has(x)
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
	if(types_match)return
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


function get_type(val) {
	return Object.getPrototypeOf(val)
	 // val.prototype
	// return mapType(typeof val) // Stupid js?
}

function add_variable(var_, val, mod = null, _type = null) {
	if (!(var_ instanceof Variable)) {
		console.log("NOT a Variable: %s" % var_);
		return var_;
	}
	var_.typed = ((_type || var_.typed) || ("typed" === mod)) && true; // redundant? no: autotype vs 'typed!'
	if(!_type)_type=get_type(val)
	if (val instanceof ast.FunctionCall) {
		assure_same_type(var_, val.returns);
	} else {
		assure_same_type(var_, _type);
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


function setter(var_ = null) {
	let _cast, _let, _type, guard, mod, setta, val;
	must_contain_before_({
		args: ["is", "be", "are", ":=", "=", "set", "to"],
		before: [">", "<", "+", "-", "|", "/", "*", ";"]
	});
	_let = maybe_tokens(let_words);
	if (_let) no_rollback();
	let a = maybe(articles);
	mod = maybe_tokens(modifier_words);
	_type = maybe(typeNameMapped);
	maybe_tokens(["var", "val", "value of"]);
	mod = mod || maybe_tokens(modifier_words);
	var_ = var_ || variable(a, ast.Store);
	if (current_word === "[") {
		return evaluate_index(var_);
	}
	setta = maybe_tokens(["to"]) || tokens(be_words);
	if (!setta) throw new NotMatching("BE!?");
	if (setta === ":=" || _let === "alias") return alias(var_);
	if (maybe_tokens(["a", "an"]) && !_type) {
		_type = typeNameMapped();
		val = _type();
		return add_variable(var_, val, mod, _type);
	}
	/////////////////////
	val = expression() // <<<<<< TODO: debug
	/////////////////////
	_cast = maybe_tokens(["as", "cast", "cast to", "cast into", "cast as"]) && typeNameMapped();
	guard = maybe_token("else") && value();
	if (_cast) {
		if (interpreting()) {
			val = do_cast(val, _cast);
		} else {
			_type = _cast;
		}
	}
	val = do_evaluate(val) || do_evaluate(guard);
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

	function argumentz() {
		let a;
		if (the.current_offset === 0) {
			raise_not_matching("BLOCK START");
		}
		a = param(args.length);
		maybe_token(",");
		args.append(a);
		return a;
	}

	star(argumentz);
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
let _=tokens
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
		verbose(the.result);
		return the.result;
	} else {
		return OK;
	}
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


function declaration() {
	let a, mod, type, val, var_;
	must_not_contain(be_words);
	a = maybe(articles)
	mod = maybe_tokens(modifier_words);
	type = typeNameMapped();
	maybe_tokens(["var", "val", "let"]);
	mod = (mod || maybe_tokens(modifier_words));
	var_ = maybe(known_variable) || variable(a, ast.Store);
	try {
		val = Object.getPrototypeOf();// ???
	} catch (e) {
		val = null;
	}
	var_ = add_variable(var_, val, mod, type);
	if (var_.type) {
		assure_same_type(var_, type);
	} else {
		var_.type = type;
	}
	var_.final = const_words.has(mod)
	var_.modifier = mod;
	the.variableTypes[var_.name] = var_.type;
	return var_;
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


module.exports = {
	add_variable,
	assert_that,
	assure_same_type,
	assure_same_type_overwrite,
	declaration,
	if_then,
	if_then_else,
	imports,
	isType,
	method_definition,
	module,
	piped_actions,
	returns,
	setter,
	quick_expression,
	statement
}