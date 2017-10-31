// "use strict"
context =  require('./context')
let the = context
let nodes = require('./nodes')

var current_word;
var current_token;
var current_type;
var current_line;
var token_number;

let list = Array

class Starttokens {
	constructor(starttokens) {
		if (!(starttokens instanceof list)) {
			starttokens = [starttokens];
		}
		this.starttokens = starttokens;
	}

	__call__(original_func) {
		let decorator_self;
		decorator_self = this;
		if (context.starttokens_done) {
			return original_func;
		}
		for (let t of this.starttokens) {
			if (t.in(the.token_map)) {
				verbose("ALREADY MAPPED \"%s\" to %s, now %s".format(t, the.token_map[t], original_func));
			}
			the.token_map[t] = original_func;
		}
		return original_func;
	}
}

let app_path = () => "./"

let dictionary_path = () => (app_path() + "word-lists/")

let isnumeric = (start) => (((typeof start) == "number") || (start instanceof Number) || ((typeof start) == "number") || (start instanceof Number))

function star(lamb, giveUp = false) {
	let good, match, max, old, old_state;
	if (depth > max_depth) {
		throw new SystemStackError("if(len(nodes)>max_depth)");
	}
	good = [];
	old = current_token;
	old_state = current_value;
	try {
		while (!checkEndOfLine()) {
			match = lamb();
			if (!match) break;
			old = current_token;
			good.append(match);
			if (the.current_word == ")") {
				break;
			}
			max = 20;
			if (good.length > max) {
				throw new Error(" too many occurrences of " + lamb.name);// to_source(
			}
		}
	} catch (e) {
		if (e instanceof GivingUp) {
			if (giveUp) {
				throw e;
			}
			verbose("GivingUp ok in star");
			set_token(old);
			return good;
		} else {
			if (e instanceof NotMatching) {
				set_token(old);
				if (very_verbose && (!good)) {
					verbose("NotMatching star " + e.toString());
				}
			} else {
				if (e instanceof EndOfDocument) {
					verbose("EndOfDocument");
				} else {
					if (e instanceof IgnoreException) {
						error(e);
						error("error in star " + to_source(lamb));
					} else {
						throw e;
					}
				}
			}
		}
	}
	if (good.length == 1) {
		return good[0];
	}
	if (good) {
		return good;
	}
	set_token(old);
	return old_state;
}

function ignore_rest_of_line() {
	while (!checkEndOfLine()) {
		next_token();
	}
}

function pointer_string() {
	let filep, l, lineNo, offset;
	if (!the.current_token) {
		offset = the.current_line.length;
		l = 3;
	} else {
		offset = the.current_offset;
		l=the.current_word.length
	}
	lineNo = the.current_token[2][0];
	filep = the.current_file != "(String)" ? "  File \"" + the.current_file + "\", line " + lineNo.toString() + "\n" : "";
	// the.current_line.slice(offset) + "\n" +
	var poo= the.current_line + "\n" + " ".repeat(offset)+ "^".repeat(l) + "\n" + filep;
	return poo
}

function print_pointer(force = false) {
	if (the.current_token && (force || the._verbose)) {
		console.log(the.current_token);
		console.log(pointer_string());
	}
	return OK;
}

function error(e, force = false) {
	if (e instanceof GivingUp) {
		throw e;
	}
	if (e instanceof NotMatching) {
		throw e;
	}
	if (is_string(e)) {
		console.log(e);
	}
	if (e instanceof Exception) {
		print_pointer();
	}
}


let caller = () => arguments.callee.caller.caller

function verbose(info) {
	context._verbose && console.log(info);
}

function debug(info) {
	context._debug && console.log(info);
}

function info(info) {
	if (the._verbose) {
		console.log(info);
	}
}

let to_source = (block) => block.toString()

let filter_backtrace = (e) => e


function tokens(tokenz) {
	raiseEnd();
	let ok = maybe_tokens(tokenz);
	if (ok) return ok;
	throw new NotMatching("token"+tokenz+" "+result);
	// throw new NotMatching(tokenz.toString() + "\n" + pointer_string());
}

function maybe_tokens(tokens0) {
	if (checkEndOfLine()) return false
	if(!is_array(tokens0)) return maybe_token(tokens0)
	for (var t of tokens0) {
		if ((t == the.current_word) || (t.lower() == the.current_word.lower())) {
			next_token(false);
			return t;
		}
		if (" ".in(t)) {
			let old = the.current_token;
			for (let to of t.split(" ")) {
				if (to !== the.current_word) {
					t = null;
					break;
				} else {
					next_token(false);
				}
			}
			if (!t) {
				set_token(old);
				continue;
			}
			return t;
		}
	}
	return false;
}

// let __ = (x) =>tokens(x)

function next_token(check = true) {
	let token;
	the.token_number = (the.token_number + 1);
	token = the.tokenstream[the.token_number];
	the.previous_word = the.current_word;
	if (the.token_number >= the.tokenstream.length) {
		the.current_word = "<EndOfDocument>"
		if (!check) return new EndOfDocument();
		throw new EndOfDocument();
	}
	return set_token(token);
}

function set_token(token) {
	the.current_token = current_token = token;
	the.current_type = current_type = token[0];
	the.current_word = current_word = token[1];
	if (!the.current_word.in)
		console.log("DFFD")
			[the.line_number, the.current_offset] = token[2];
	let end_pointer = token[3];

	the.current_line = current_line = token[4];
	the.token_number = token_number = token[5];
	the.string = current_word;
	return token[1];
}

// const Tokenizer = require('tokenizer');
const tokenizer = require('string-tokenizer');

function parse_tokens(s) {
	// import * as tokenize from 'tokenize';
	let _lines, i;
	let line_nr = 1
	the.tokenstream = [];
	// function token_helper(token_type, token_str, start_row_col, end_row_col, line) {
	let token_indices = {}

	function token_helper(tok, line0, pattern) {
		let index = tok.index
		if (token_indices[index]) return
		let val = tok[0]
		let val2 = tok[1]
		let line = tok.input
		let end_row_col = val.length // + index
		if (val !== val2) console.log("val!=val2", val, val2)
		if (line !== line0) console.log("line!=line0", line, line0)
		let token = [_token.UNKNOWN, val, [line_nr, index], end_row_col, line, the.tokenstream.length]
		token_indices[index] = token
		// console.log(token)
		the.tokenstream.push(token);
		// return true
		return false
	}

	function token_eater2(type, value, match) {
		console.log(arguments)
	}

	function token_eater(type, value, strange_number, matches) {
		let length = the.tokenstream.length;
		if (length == 0) return
		the.tokenstream[length - 1][0] = type;
		the.tokenstream[length - 1][1] = value;
		if (type == _token.NEWLINE)
			line_nr++
		// console.log(type, value, strange_number, matches)
	}

	s = s.replace("⦠", "");// ⦠ \u29a0
	_lines = s.split("\n");
	i = (-1);
	let tokenz = tokenizer().input(s)
		.token(_token.NUMBER, /\d*\.\d+/u, token_helper)
		.token(_token.NUMBER, /\d+/u, token_helper)
		.token(_token.WORD, /\w+/u, token_helper)
		.token(_token.STRING, /"(.*?)"/u, token_helper)// no UTF8 wtf
		.token(_token.STRING, /`(.*?)`/u)
		.token(_token.STRING, /'(.*?)'/u)
		.token(_token.COMMENT, /#.*/)
		.token(_token.NEWLINE, /;/)
		.token(_token.NEWLINE, /:/)
		.token(_token.NEWLINE, /\n/, token_helper)
		.token(_token.COMMENT, /\/\/.*/)
		.token(_token.COMMENT, /\/\*(.*)\*\//u)
		.token(_token.COMMENT, /<!--(.*)-->/u)
		.token(_token.OPERATOR, /[=\+\-\*\/]/u, token_helper)
		.walk(token_eater)
	var tokens = tokenz.resolve()//.debug()
	// .tokens('operators', math_operators)// logic_operators

	// const tokenizer = new Tokenizer(token_eater);
	// tokenizer.write(s)
	// tokenize.tokenize(readlines, token_eater);
	// console.log(tokens)
	// console.log(the.tokenstream)
	return the.tokenstream;
}

function x_comment(token) {
	let drop;
	drop = true;
	if (drop) {
		the.tokenstream.remove(token);
	} else {
		token[0] = tokenize.COMMENT;
	}
}

function drop_comments() {
	let i, in_comment_block, in_comment_line, is_beginning_of_line, prev, prev_token, str, token_type;
	in_comment_block = false;
	in_comment_line = false;
	i = 0;
	prev = "";
	for (let token of the.tokenstream) {
		is_beginning_of_line = (token[2][1] == 0);
		str = token[1];
		token_type = token[0];
		if ((str == "//") || (str == "#")) {
			x_comment(token);
			in_comment_line = true;
		} else if (str == "\n") {
			in_comment_line = false;
		} else if ((prev == "*") && str.endswith("/")) {
			x_comment(token);
			in_comment_block = false;
		} else if (in_comment_block || in_comment_line) {
			x_comment(token);
		} else if ((prev == "/") && str.startswith("*")) {
			i = (i - 1);
			x_comment(prev_token);
			x_comment(token);
			in_comment_block = true;
		} else {
			the.tokenstream[i] = [token[0], token[1], token[2], token[3], token[4], i];
			i = (i + 1);
		}
		prev = str;
		prev_token = token;
	}
}

function init(strings) {
	let{number}= require('./values')
	let comp, left, right;
	if (!the.moduleMethods || !the.moduleMethods.length)
		load_module_methods();
	the.no_rollback_depth = (-1);
	the.rollback_depths = [];
	the.line_number = 0;
	if (strings instanceof list) {
		the.lines = strings;
		if (strings[0].endswith("\n")) {
			parse_tokens("".join(strings));
		} else {
			parse_tokens("\n".join(strings));
		}
	}
	if (is_string(strings)) {
		the.lines = strings.split("\n");
		parse_tokens(strings);
	}
	// drop_comments();
	the.tokens_len = the.tokenstream.length;
	the.token_number = (-1);
	next_token(false);
	the.string = the.lines[0].strip();
	the.original_string = the.string;
	the.root = null;
	the.nodes = [];
	the.depth = 0;
	left = right = comp = null;
	for (let nr of numbers) {
		the.token_map[nr] = number;
	}
}

function error_position() {
}

function raiseEnd() {
	if (current_type == _token.ENDMARKER) {
		throw new EndOfDocument();
	}
	if (the.token_number >= the.tokenstream.length) {
		throw new EndOfDocument();
	}
}

function remove_tokens(...tokenz) {
	while (the.current_word.in(tokenz)) {
		next_token();
	}
}

function must_contain(args, do_raise = true) {
	let old, pre;
	if (args.last) {
		return must_contain_before(args.slice(0, -2), args.last()["before"]);
	}
	if (is_string(args)) {
		args = [args];
	}
	old = current_token;
	pre = the.previous_word;
	while (!checkEndOfLine()) {
		for (let x of args) {
			if (current_word == x) {
				set_token(old);
				return x;
			}
		}
		next_token();
		if (do_raise && ((current_word == ";") || (current_word == "\n"))) {
			break;
		}
	}
	set_token(old);
	the.previous_word = pre;
	if (do_raise) {
		throw new NotMatching("must_contain " + args.toString());
	}
	return false;
}

function must_contain_before_({args, before}) {
	return must_contain_before(args, before)
}

function must_contain_before(args, before) {
	let good, old;
	old = current_token;
	good = null;
	while (!checkEndOfLine() && !current_word.in(before)) {
		if (current_word.in(args)) {
			good = current_word;
			break;
		}
		next_token();
	}
	set_token(old);
	if (!good) throw NotMatching;
	return good;
}

function must_contain_before_old(before, ...args) {
	var args, good, sub;
	raiseEnd();
	good = false;
	if (before && is_string(before)) {
		before = [before];
	}
	if (before) {
		before = (flatten(before) + [";"]);
	}
	for (let x of flatten(args)) {
		if (x.match(/^\s*\w+\s*$/i)) {
			good = (good || the.string.match("[^\w]%s[^\w]".format(x)))
			if (Object.getPrototypeOf(good).__name__ == "SRE_Match") {
				good = good.start();
			}
			if (((good && before) && good.pre_match.in(before) && before.index(good.pre_match))) {
				good = null;
			}
		} else {
			good = (good || the.string).match(escape_token(x))
			if (Object.getPrototypeOf(good).__name__ == "SRE_Match") {
				good = good.start();
			}
			sub = the.string.slice(0, good);
			if (((good && before) && sub.in(before) && before.index(sub))) {
				good = null;
			}
		}
		if (good) {
			break;
		}
	}
	if (!good) {
		throw NotMatching;
	}
	for (let nl of newline_tokens) {
		if (nl.in(good.toString())) {
			throw NotMatching;
		}
	}
	return OK;
}

function flatten(words) {
	// todo("flatten")
	return words
}


function must_not_contain(words, before = ";") {
	let old = the.current_token;
	words = flatten(words);
	while (!checkEndOfLine() && the.current_word != ";" && the.current_word !== before) {
		for (let w of words)
			if (w == the.current_word)
				throw new MustNotMatchKeyword(w);
		next_token();
	}
	set_token(old);
	return OK;
}


let starts_with = function starts_with(tokenz) {
	if (checkEndOfLine()) {
		return false;
	}
	if (is_string(tokenz)) {
		return (tokenz == the.current_word);
	}
	if (the.current_word.in(tokenz)) {
		return the.current_word;
	}
	return false;
}

function look_1_ahead(expect_next, doraise = false, must_not_be = false, offset = 1) {
	let token;
	if (the.current_word == "") {
		return false;
	}
	if (the.token_number + 1 >= the.tokens_len)
		return false
	token = the.tokenstream[(the.token_number + offset)];
	if (expect_next == token[1]) {
		return true;
	} else {
		if ((expect_next instanceof list) && token[1].in(expect_next)) {
			return true;
		} else {
			if (must_not_be) {
				return OK;
			}
			if (doraise) {
				throw new NotMatching("look_1_ahead");
			}
			return false;
		}
	}
}

// let _ = (x) =>token(x)

function lastmaybe(stack) {
	let s, c = 0;
	const a = stack, b = a.length;
	for (let s of a) {
		if (s.match(/try/i)) return s;
	}
}

let caller_name = () => caller()

function adjust_interpret() {
	let depth;
	depth = caller_depth();
	if (context.interpret_border > (depth - 2)) {
		context.interpret = context.did_interpret;
		context.interpret_border = (-1);
		do_interpret();
	}
}

function do_interpret() {
	if (context.did_interpret !== context.interpret) {
		context.did_interpret = context.interpret;
	}
	context.interpret = true;
}

function dont_interpret() {
	let depth;
	depth = caller_depth();
	if (context.interpret_border < 0) {
		context.interpret_border = depth;
		context.did_interpret = context.interpret;
	}
	context.interpret = false;
}


function check_rollback_allowed() {
	let c, level, throwing;
	c = caller_depth;
	throwing = true;
	level = 0;
	return (c < no_rollback_depth) || (c > (no_rollback_depth + 2));
}

function read_source(x) {
	let i, lines, res;
	if (last_pattern || (!x)) {
		return last_pattern;
	}
	res = (((x.source_location[0] + ":") + x.source_location[1].to_s) + "\n");
	lines = IO.readlines(x.source_location[0]);
	i = (x.source_location[1] - 1);
	while (i < lines.length && !lines[i].match(/}/u) && !lines[i].match(/end/i)) {
		res += lines[i];
		i = (i + 1);
	}
	return res;
}

function caller_depth() {
	let c = arguments.callee.caller.length;
	if (c > max_depth) throw new SystemStackError("depth overflow");
	return c;
}

function no_rollback() {
	let depth = (caller_depth() - 1);
	the.no_rollback_depth = depth;
	the.rollback_depths.append(depth);
}

function adjust_rollback(depth = (-1)) {
	try {
		if (depth == (-1)) {
			depth = caller_depth();
		}
		if (depth <= the.no_rollback_depth) {
			allow_rollback(1);
		}
	} catch (e) {
		error(e);
	}
}

function allow_rollback(n = 0) {
	let depth;
	if (n < 0) {
		the.rollback_depths = [];
	}
	depth = ((caller_depth() - 1) - n);
	if (the.rollback_depths.length > 0) {
		the.no_rollback_depth = the.rollback_depths.slice(-1)[0];
		while (the.rollback_depths.slice((-1)[0] >= depth)) {
			the.no_rollback_depth = the.rollback_depths.pop();
			if (the.rollback_depths.length == 0) {
				if (the.no_rollback_depth >= depth) {
					the.no_rollback_depth = (-1);
				}
				break;
			}
		}
	} else {
		the.no_rollback_depth = (-1);
	}
}

function invalidate_obsolete(old_nodes) {
	for (let fuck of old_nodes) {
		if (fuck.in(nodes)) {
			nodes.remove(fuck);
		}
	}
	for (let n of nodes) {
		n.invalid();
		n.destroy();
	}
}

function beginning_of_line() {
	let previous_offset;
	if (the.token_number > 1) {
		previous_offset = the.tokenstream[(the.token_number - 1)][2][1];
		if (previous_offset > the.current_offset) {
			return true;
		}
	}
	return (the.current_type == _token.INDENT) || (the.current_offset == 0);
}


function end_block(type = null) {
	return done(type);
}

function done(_type = null) {
	let ok;
	if (checkEndOfFile()) return OK;
	if (the.current_line == "\n") return OK;
	if (the.current_type == _token.DEDENT) return OK;
	if (the.current_line == "end\n") {
		next_token();
		return OK;
	}
	checkNewline();
	ok = maybe_tokens(done_words);
	if (_type && (!_type.in(start_block_words))) token(_type);
	if (_type && (the.previous_word == ";")) return OK;
	return ok;
}


function block(multiple = false) {
	// let {statement} = require('./statements')
	let end_of_block, start, statement0, statements;
	maybe_newline() || !"=>".in(the.current_line) && maybe_tokens(start_block_words);
	start = pointer();
	statement0 = statement(false);
	statements = (statement0 ? [statement0] : []);
	end_of_block = maybe(end_block);
	while ((multiple || !end_of_block) && !checkEndOfFile()) {
		end_of_statement();
		no_rollback();
		if (multiple) maybe_newline();
		function block_lambda() {
			try {// todo undo
			let s;
				maybe_indent();
				s = statement();
				statements.append(s);
			} catch (e) {
				if (e instanceof NotMatching || e==NotMatching) {
					if (starts_with(done_words) || checkNewline())
						return false;
					// console.log("Giving up block");
					// print_pointer(true);
					throw new Error(e + "\nGiving up block\n") + pointer_string();
				}
				throw e;
			}
			return end_of_statement();
		}

		star(block_lambda, /*giveUp:*/ true);
		end_of_block = end_block();
		if (!multiple) {
			break;
		}
	}
	the.last_result = the.result;
	if (interpreting()) {
		return statements.slice(-1)[0];
	}
	if (statements.length == 1) {
		statements = statements[0];
	}
	if (context.use_tree) {
		the.result = statements;
	}
	return statements;
}


function end_of_statement(){
	return (beginning_of_line() ||
		maybe_newline() ||
		starts_with(done_words) ||
		the.current_offset == 0 ||
		the.current_word == ";" ||
		the.previous_word == ";" ||
		the.previous_word == "\n" ||
		check_end_of_statement()) && next_token(false)
}



var depth;

function maybe(expr) {
	let cc, current_value, ex, last_node, old, rb, result;
	if (!(expr instanceof Function)) return maybe_tokens(expr);
	if(checkEndOfLine())return false
	depth = (depth + 1);
	if (depth > context.max_depth) throw new SystemStackError(">max_depth)");
	try {
		old = current_token;
		result = expr();
		adjust_rollback();
		if (context._debug && (result instanceof Function) && !(result instanceof type)) {
			throw new Error("BUG!? returned CALLABLE " + result.toString());
		}
		if (result || result === 0) { // || result==None  not:false!
			verbose((("GOT result " + expr.name + " : ") + result.toString()));
		} else {
			verbose("No result " + expr.name);
			set_token(old);
		}
		last_node = current_node;
		return result;
	} catch (e) {
		if (!(e instanceof NotMatching))
			switch (e.constructor) {
				case MustNotMatchKeyword: // does not inherit!! :(
				case NotMatching:
					break; /*maybe: all good depth = (depth - 1) in FINALLY!*/
				case EndOfDocument:
					set_token(old);
					// verbose("EndOfDocument");
					return false;
				case EndOfLine:
					verbose("Tried %d '%s' as %s, got %s".format(the.current_offset, the.current_word, expr.name, e.stack));
					adjust_interpret();
					cc = caller_depth();
					rb = the.no_rollback_depth;
					if (cc >= rb) {
						set_token(old);
						current_value = null;
					}
					if (cc < rb) {
						error("NO ROLLBACK, GIVING UP!!!");
						ex = new GivingUp((((e.toString() + "\n") + to_source(expr) + "\n") + pointer_string()));
						throw ex;
					}
					break;
				case IgnoreException:
					set_token(old);
					// error(e);
					verbose(e);
					break;
				default:
					error(e);
					throw e;
			}
	} finally {
		// NotMatching
		depth = (depth - 1);
	}
	adjust_rollback();
	set_token(old);
	return false;
}

function one_or_more(expressions) {
	let all, more;
	all = [expressions()];
	more = (the.current_offset && star(expressions));
	if (more) all.append(more);
	return all;
}

// let to_source = (block) =>block.toString()

function pointer() {
	if (!current_token) throw new Exception("END")
	return current_token[2];
}

// let isnumeric = (start) =>start.isdigit()


function clear() {
	let variableValues, variables;
	verbose("clear all variables, methods, ...");
	variables = {};
	variableValues = {};
	context.testing = true;
	the.variables = {}//.clear();
	the.variableTypes = {}//.clear();
	the.variableValues = {}//.clear();
	context.in_hash = false;
	context.in_list = false;
	context.in_condition = false;
	context.in_args = false;
	context.in_params = false;
	context.in_pipe = false;
	if (!context.use_tree) {
		do_interpret();
	}
}

// try {
//     File = [file, xfile, io.IOBase];
// } catch (e) {
//     if (e instanceof NameError) {
//         File = [io.IOBase];
//     } else {
//         throw e;
//     }
// }


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

parse = function (s, target_file = null, clean = true) {
	if (clean) clear()
	let got_ast, source_file;
	if (!s) return;
	if (is_array(s)) s = " ".join(s) // Todo
	if (s instanceof File) {
		source_file = s.name;
		s = readlines(s);
	} else {
		if (s.endswith("\\.e") || s.endswith("\.an")) {
			target_file = (target_file || (s + ".pyc"));
			source_file = s;
			s = readlines(s);
		} else {
			source_file = "out/inline";
			try {
				open(source_file, "wt").write(s);
			} catch (e) {
				debug("no out directory");
			}
		}
	}
	if (context._debug) {
		console.log("  File \"%s\", line 1" % source_file);
	}
	if (s.length < 1000) {
		verbose("--------PARSING:---------");
		verbose(s);
		verbose("-------------------------");
	}
	try {
		english_parser = require("./angle_parser")
		if (s instanceof File) {
			source_file = s.toString();
			target_file = (source_file + ".pyc");
			s = s.readlines();
		}
		allow_rollback();
		init(s);
		the.result = english_parser.rooty();
		// the.result = rooty();
		if (the.result instanceof nodes.FunctionCall) {
			the.result = do_execute_block(the.result);
		}
		if (the.result == "True" || the.result == "true") the.result = true;
		if (the.result == "False" || the.result == "false") the.result = false;
		if (the.result instanceof nodes.Variable) the.result = the.result.value;
		// import * as ast from 'ast';
		// got_ast = (the.result instanceof ast.AST);
		// if ((the.result instanceof list) && (the.result.length > 0)) {
		// 	got_ast = (the.result[0] instanceof ast.AST);
		// }
		if (context.use_tree && got_ast) {
			// import * as pyc_emitter from 'pyc_emitter';
			the.result = pyc_emitter.eval_ast(the.result, {}, source_file, target_file, {
				run: true
			});
		} else {
			if (the.result instanceof ast.Num) {
				the.result = the.result.n;
			}
			if (the.result instanceof ast.Str) {
				the.result = the.result.s;
			}
		}
		the.last_result = the.result;
	} catch (e) {
		error(target_file);
		print_pointer(true);
		throw e;
	}
	verbose("PARSED SUCCESSFULLY!!");
	verbose("RESULT = " + the.result);
	return interpretation();
}

function token(t, expected = "") {
	if (t instanceof list) {
		return tokens(t);
	}
	raiseEnd();
	if (current_word == t) {
		next_token();
		return t;
	} else {
		throw new NotMatching() //(((expected + " ") + t) + "\n") + pointer_string());
	}
}

function escape_token(t) {
	return t.replace(/([^\w])/u, "\\1");
}

function raiseNewline() {
	if (checkEndOfLine()) throw new EndOfLine();
}

let checkNewline = () => checkEndOfLine()

let checkEndOfLine = () =>
	current_type == _token.NEWLINE ||
	current_type == _token.ENDMARKER ||
	the.current_word == "\n" ||
	the.current_word == "" ||
	the.token_number >= the.tokenstream.length

let maybe_newline = () => (checkEndOfFile() || newline(/*doraise*/ false))

function newline(doraise = false) {
	let found;
	if (((checkNewline() == NEWLINE) || (the.current_word == ";") || (the.current_word == ""))) {
		next_token();
		if (the.current_type == 54) {
			next_token();
		}
		while (the.current_type == _token.INDENT) {
			next_token();
		}
		return NEWLINE;
	}
	found = maybe_tokens(newline_tokens);
	if (found) {
		return found;
	}
	if (checkNewline() == NEWLINE) {
		next_token();
		return found;
	}
	if ((!found) && doraise) {
		raise_not_matching("no newline");
	}
	return false;
}

let newlines = () => star(newline);

let checkEndOfFile = () => (current_type == _token.ENDMARKER) || (the.token_number >= the.tokenstream.length)

let NL = () => tokens("\n", "\r");

let NLs = () => tokens("\n", "\r");

function rest_of_statement() {
	let current_value;
	current_value = the.string[1].strip.match(/(.*?)([\r\n;]|done)/i)
	the.string = the.string.slice(current_value.length, (-1));
	return current_value;
}

function rest_of_line() {
	let rest;
	rest = "";
	while ((!checkEndOfLine() && (!(current_word == ";")))) {
		rest += (current_word + " ");
		next_token(false);
	}
	return rest.strip();
}

function comment_block() {
	token("/");
	token("*");
	while (true) {
		if (the.current_word == "*") {
			next_token();
			if (the.current_word == "/") {
				return true;
			}
		}
		next_token();
	}
}

new Starttokens(["//", "#", "'", "--"]);

function skip_comments() {
	let l;
	if (the.current_word == null) {
		return;
	}
	l = the.current_word.length;
	if (l == 0) {
		return;
	}
	if (the.current_type == _token.COMMENT) {
		next_token();
	}
	if (l > 1) {
		if (the.current_word.slice(0, 2) == "--") {
			return rest_of_line();
		}
		if (the.current_word.slice(0, 2) == "//") {
			return rest_of_line();
		}
	}
}

function raise_not_matching(msg = null) {
	throw new NotMatching(msg)
}

let _try = maybe;

function maybe_indent() {
	while ((the.current_type == _token.INDENT) || (the.current_word == " ")) {
		next_token();
	}
}

function method_allowed(meth) {
	if (meth.length < 2) {
		return false;
	}
	if (meth.in(["print"])) {
		return true;
	}
	if (meth.in(["evaluate", "eval", "int", "True", "False", "true", "false", "the", "Invert", "char"])) {
		return false;
	}
	if (meth.in(keywords)) {
		return false;
	}
	return true;
}

function load_module_methods() {
	return []
	let pickle = require('pickle')
	// import * as warnings from 'warnings';
	let ex;
	// warnings.filterwarnings("ignore", {category: UnicodeWarning});
	the.methodToModulesMap = pickle.loads(open(context.home + "/data/method_modules.bin"), "rb") || {}
	the.moduleMethods = pickle.loads(open(context.home + "/data/module_methods.bin"), "rb") || {}
	the.moduleNames = pickle.loads(open(context.home + "/data/module_names.bin"), "rb") || []
	the.moduleClasses = pickle.loads(open(context.home + "/data/module_classes.bin"), "rb") || {}
	for (let [mo, mes] of the.moduleMethods) {
		if (!method_allowed(mo)) {
			continue;
		}
		the.method_token_map[mo] = method_call;
		for (let meth of mes) {
			if (method_allowed(meth)) {
				the.method_token_map[meth] = method_call;
			}
		}
	}
	for (let [mo, cls] of the.moduleClasses) {
		for (let meth of cls) {
			if (method_allowed(meth)) {
				the.method_token_map[meth] = method_call;
			}
		}
	}
	the.constructors = (keys(the.classes)) + type_names;
	let moduleKeys = keys(the.methodToModulesMap);
	the.method_names = keys(the.methods).plus(c_methods).add(keys(methods))
	the.method_names.add(core_methods).add(builtin_methods).add(moduleKeys)
	for (let x of dir(extensions)) {
		the.method_names.append(x);
	}
	context.extensionMap = extensionMap;
	for (let _type of context.extensionMap) {
		ex = context.extensionMap[_type];
		for (let method of dir(ex)) {
			the.method_names.append(method);
		}
	}
	let all = []
	for (let meth of the.method_names) {
		if (method_allowed(meth))
			all.push(meth);
	}
	return all;
}


function is_number(n) {
	return (str(n).parse_number() !== 0);
}

function must_not_start_with(words,whitelist) {
	let bad = starts_with(words);
	if (!bad) return OK
	if(bad.in(whitelist)) return OK
	if (bad) info("should_not_match DID match %s" % bad);
	if (bad) throw new NotMatching("should_not_match DID match %s" % bad);
}


function no_keyword_except(excepty = null) {
	return must_not_start_with(keywords,excepty);
}

function no_keyword() {
	return must_not_start_with(keywords);
}

function space() {
	if ((token(" ") || token("") !== null)) {
		return OK;
	} else {
		return false;
	}
}


maybe_token=function maybe_token(x) {
	if (x == the.current_word) {
		next_token(false);
		return x;
	}
	return false;
}

module.exports = {
	adjust_interpret,
	block,
	checkNewline,
	raiseNewline,
	dont_interpret,
	do_interpret,
	init,
	look_1_ahead,
	maybe,
	maybe_indent,
	must_not_start_with,
	must_contain_before_,
	must_contain_before,
	must_not_contain,
	maybe_token,
	maybe_tokens,
	must_contain,
	next_token,
	no_rollback,
	one_or_more,
	pointer,
	pointer_string,
	raiseEnd,
	star,
	starts_with,
	skip_comments,
	tokens,
	token,
	Interpretation,
	verbose
}

