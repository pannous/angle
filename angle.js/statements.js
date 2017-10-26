let {starts_with,checkNewline,maybe_indent,maybe,must_contain_before_,maybe_tokens}=require('./power_parser')
let {quick_expression}= require('./expressions')
let {articles}=require('./angle_parser')
statement=function statement (doraise = true) {
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
	mod = mod || maybe(modifier);
	var_ = var_ || variable(a, ast.Store);
	if (current_word === "[") {
		return evaluate_index(var_);
	}
	setta = maybe_tokens(["to"]) || be();
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

function end_of_statement(){
	return beginning_of_line() ||
		maybe_newline() ||
		starts_with(done_words) ||
		the.current_offset === 0 ||
		the.current_word === ";" ||
		the.previous_word === ";" ||
		the.previous_word === "\n" ||
		check_end_of_statement()
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

module.exports={
	statement,
	end_of_statement,
}


function typeNameMapped() {
	let name = typeName();
	if (name.in(the.classes)) return the.classes[name];
	return mapType(name);
}
