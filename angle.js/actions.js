"use strict"
let {Variable, Argument} = require('./nodes')
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
	must_contain_before_,
	must_contain_before,
	maybe_tokens,
	next_token,
	one_or_more,
	raiseEnd,
	skip_comments,
	starts_with,
	tokens,
} = require('./power_parser')
let {variable} = require('./values')
function action() {
	 // extends expression
	let start = pointer();
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

function plusPlus(v = null) {
	let pre, start;
	// must_contain_substring("++");
	// start = pointer();
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
	// must_contain_substring("--");
	pre = maybe_token("--")||(maybe_token("-") && token("-"));
	v = (v || variable());
	(pre ||maybe_token("--")|| (_("-") && token("-")));
	if (!interpreting()) {
		return new Assign([store(v.name)], new BinOp(name(v.name), new Sub(), num(1)));
	}
	the.result = (do_evaluate(v, v.type) + 1);
	variableValues[v] = v.value = the.result;
	return the.result;
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

// todo move


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

function map_list(x) {
	let function_ = findMethod(x, method0, null);
	if (function_ instanceof FunctionCall) {
		return pyc_emitter.evalast(function_, args);
	}
	if (!(function_ instanceof Function)) {
		throw new Error("DONT KNOW how to apply %s to %s".format(method0, args0));
	}
	return function_();
}


function do_call(obj0, method0, args0 = [], method_name0 = 0) {
	let args, bound, is_builtin, is_first_self, method, method_name, number_of_arguments, obj;
	method_name = method_name0 || (method instanceof Function) && method.name || method0;
	if (!method0) throw new Error("NO METHOD GIVEN %s %s".format(obj0, args0));
	if (!interpreting()) {
		return new FunctionCall({
			func: method0,
			arguments: args0,
			object: obj0
		});
	}
	if (method_name.in(be_words) && (obj0 === args0)) {
		return true;
	}
	args = eval_args(args0);
	method = findMethod(obj0, method0, args);
	if (method === "of") {
		return evaluate_property(args0, obj0);
	}
	is_builtin = false
	bound = is_bound(method);
	if (self_modifying(method)) {
		obj = obj0;
	} else {
		obj = do_evaluate(obj0);
	}
	args = align_args(args, obj, method);
	number_of_arguments = has_args(method, obj, (!(!args)));
	is_first_self = first_is_self(method);
	if (method instanceof ast.FunctionDef) {
		the.result = do_execute_block(method.body, args);
		return the.result;
	}
	console.log("CALLING %s %s with %s".format((obj || ""), method, args));
	if (!args && !(method instanceof Function) && method.in(dir(obj))) {
		return obj.__getattribute__(method);
	}
	try {
		if ((!(method instanceof Function) && (args instanceof list))) {
			// noinspection JSAnnotator
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


function align_function_args(args, clazz, method) {
	let newArgs;
	newArgs = {};
	if ((args instanceof dict) || (args instanceof tuple) || (args instanceof list) && method.arguments.length === 1) {
		let key = method.arguments[0].name;
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
	if (obj0) _type = Object.getPrototypeOf(obj0);
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

function do_math(a, op, b) {
	a = do_evaluate(a) || 0;
	b = do_evaluate(b) || 0;
	if (a instanceof Variable) a = a.value;
	if (b instanceof Variable) b = b.value;
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
	if (op === 'else') return a || b // x = nil else 1
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
	return method.in(operators);
}


function is_bound(method) {
	let _is_bound = ("im_self".in(dir(method)) && method.__self__);
	_is_bound = (_is_bound || "bound".in(method.toString()));
	return _is_bound;
}

function is_unbound(method) {
	return ("im_class" in method) && (method.__self__ === null);
}

function instance(bounded_method) {
	return bounded_method.__self__;
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
	if ((x instanceof Array) && (x.length === 1)) {
		return do_evaluate(x[0]);
	}
	if (x instanceof Array) {
		return Array(map(do_evaluate, x));
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
		if (_type && (_type === Number)) {
			return Number(x);
		}
		return x;
	}
	if (!interpreting()) {
		return x;
	}
	// if (x instanceof ast.AST) {
	// 	return pyc_emitter.evalast([x]);
	// }
	// if ((x instanceof list) && (x[0] instanceof ast.AST)) {
	// 	return pyc_emitter.evalast(x);
	// }
	return x;
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

function selfModify() {
	return (maybe(self_modify) || maybe(plusPlus) || minusMinus());
}

module.exports = {
	action,
	// action_if,
	// align_args,
	// align_function_args,
	// bash_action,
	// call_unbound,
	// do_call,
	do_evaluate,
	// do_math,
	// do_self_modify,
	// english_to_math,
	// eval_args,
	// evaluate,
	// fileName,
	// instance,
	// is_bound,
	// is_math,
	// is_unbound,
	// jeannie,
	// findMethod,
	// linuxPath,
	// map_list,
	// minusMinus,
	// plusPlus,
	selfModify,
	// self_modify,
	// self_modifying,
	// start_xml_block,
}
