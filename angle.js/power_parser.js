// import * as sys from 'sys';
// import * as readline from 'readline';
// import * as tokenize from 'tokenize';
// import * as english_tokens from 'english_tokens';
// import * as re from 're';
// import * as _token from 'token';
// import * as collections from 'collections';
// import * as context from 'context';
// import * as extensions from 'extensions';
// import {*} from 'exceptionz';
// import {is_string} from 'extension_functions';
// import {Argument, Variable, Compare, FunctionCall, FunctionDef} from 'nodes';
// import * as the from 'context';
// import {*} from 'context';
// import * as io from 'io';

the = require("./context")
// console.log(the);
require("./context.js")
require("./english_tokens.js")
require("./ast.js")
require("./extension_functions.js")
// extensions = require("./js")
// File = File

class StandardError extends Error {
    constructor(message) {
        super(message);
        this.name = 'StandardError';
    }
}
list = Array
class NameError extends StandardError {}
class Starttokens {
    constructor(starttokens) {
        if ((!(starttokens instanceof list))) {
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
        let t, c = 0;
        const a = this.starttokens, b = a.length;
        for (;
            (c < b); c += 1) {
            t = a[c];
            if (_in(t, the.token_map)) {
                verbose(("ALREADY MAPPED \"%s\" to %s, now %s" % [t, the.token_map[t], original_func]));
            }
            the.token_map[t] = original_func;
        }
        return original_func;
    }
}

function app_path() {
    return "./";
}

function dictionary_path() {
    (app_path() + "word-lists/");
}

function isnumeric(start) {
    return ((((typeof start) === "number") || (start instanceof Number)) || (((typeof start) === "number") || (start instanceof Number)));
}

function star(lamb, giveUp = false) {
    let good, match, max, old, old_state;
    if ((depth > max_depth)) {
        throw new SystemStackError("if(len(nodes)>max_depth)");
    }
    good = [];
    old = current_token;
    old_state = current_value;
    try {
        while ((!checkEndOfLine())) {
            match = lamb();
            if ((!match)) {
                break;
            }
            old = current_token;
            good.append(match);
            if ((the.current_word === ")")) {
                break;
            }
            max = 20;
            if ((good.length > max)) {
                throw new Error((" too many occurrences of " + to_source(lamb)));
            }
        }
    } catch (e) {
        if ((e instanceof GivingUp)) {
            if (giveUp) {
                throw e;
            }
            verbose("GivingUp ok in star");
            set_token(old);
            return good;
        } else {
            if ((e instanceof NotMatching)) {
                set_token(old);
                if ((very_verbose && (!good))) {
                    verbose(("NotMatching star " + e.toString()));
                }
            } else {
                if ((e instanceof EndOfDocument)) {
                    verbose("EndOfDocument");
                } else {
                    if ((e instanceof IgnoreException)) {
                        error(e);
                        error(("error in star " + to_source(lamb)));
                    } else {
                        throw e;
                    }
                }
            }
        }
    }
    if ((good.length === 1)) {
        return good[0];
    }
    if (good) {
        return good;
    }
    set_token(old);
    return old_state;
}

function ignore_rest_of_line() {
    while ((!checkEndOfLine())) {
        next_token();
    }
}

function pointer_string() {
    let filep, l, lineNo, offset;
    if ((!the.current_token)) {
        offset = the.current_line.length;
        l = 3;
    } else {
        offset = the.current_offset;
        l = (the.current_token[3][1] - offset);
    }
    lineNo = the.current_token[2][0];
    filep = ((the.current_file !== "(String)") ? (((("  File \"" + the.current_file) + "\", line ") + lineNo.toString()) + "\n") : "");
    return (((((((the.current_line.slice(offset) + "\n") + the.current_line) + "\n") + (" " * offset)) + ("^" * l)) + "\n") + filep);
}

function print_pointer(force = false) {
    if ((the.current_token && (force || the._verbose))) {
        console.log(the.current_token);
        console.log(pointer_string());
    }
    return OK;
}

function error(e, force = false) {
    if ((e instanceof GivingUp)) {
        throw e;
    }
    if ((e instanceof NotMatching)) {
        throw e;
    }
    if (is_string(e)) {
        console.log(e);
    }
    if ((e instanceof Exception)) {
        print_pointer();
    }
}

function warn(e) {
    console.log(e);
}

function caller() {
    return arguments.callee.caller.caller
}

function verbose(info) {
    if (context._verbose) {
        console.log(info);
    }
}

function debug(info) {
    if (context._debug) {
        console.log(info);
    }
}

function info(info) {
    if (the._verbose) {
        console.log(info);
    }
}

function to_source(block) {
    return block.toString();
}

function filter_backtrace(e) {
    return e;
}

function tokens(tokenz) {
    let ok;
    raiseEnd();
    ok = maybe_tokens(tokenz);
    if (ok) {
        return ok;
    }
    throw new NotMatching(result);
}

function maybe_tokens(tokens0) {
    var old, t;
    for (var t, c = 0, a = tokens0, b = a.length;
        (c < b); c += 1) {
        t = a[c];
        if (((t === the.current_word) || (t.lower() === the.current_word.lower()))) {
            next_token();
            return t;
        }
        if (_in(" ", t)) {
            old = the.current_token;
            let to, f = 0;
            const d = t.split(" "), e = d.length;
            for (;
                (f < e); f += 1) {
                to = d[f];
                if ((to !== the.current_word)) {
                    t = null;
                    break;
                } else {
                    next_token();
                }
            }
            if ((!t)) {
                set_token(old);
                continue;
            }
            return t;
        }
    }
    return false;
}

function __(x) {
    return tokens(x);
}

function next_token(check = true) {
    let token;
    the.token_number = (the.token_number + 1);
    if ((the.token_number >= the.tokenstream.length)) {
        if ((!check)) {
            return new EndOfDocument();
        }
        throw new EndOfDocument();
    }
    token = the.tokenstream[the.token_number];
    the.previous_word = the.current_word;
    return set_token(token);
}

function set_token(token) {
    let current_line, current_token, current_type, current_word, end_pointer, token_number;
    the.current_token = current_token = token;
    the.current_type = current_type = token[0];
    the.current_word = current_word = token[1];
    [the.line_number, the.current_offset] = token[2];
    end_pointer = token[3];
    the.current_line = current_line = token[4];
    the.token_number = token_number = token[5];
    the.string = current_word;
    return token[1];
}

const Tokenizer = require('tokenizer');

function parse_tokens(s) {
    // import * as tokenize from 'tokenize';
    let _lines, i;
    the.tokenstream = [];

    function token_eater(token_type, token_str, start_row_col, end_row_col, line) {
        the.tokenstream.append([token_type, token_str, start_row_col, end_row_col, line, the.tokenstream.length]);
    }
    s = s.replace("\u29a0", "");
    _lines = s.split("\n");
    i = (-1);

    function readlines() {
        i += 1;
        while (((i < _lines.length) && (_lines[i].startswith("#") || _lines[i].startswith("//")))) {
            i += 1;
        }
        if ((i < _lines.length)) {
            return _lines[i];
        } else {
            return "";
        }
    }

    const tokenizer = new Tokenizer(token_eater);
    tokenizer.write(s)
    // tokenize.tokenize(readlines, token_eater);
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
    let token, c = 0;
    const a = the.tokenstream, b = a.length;
    for (;
        (c < b); c += 1) {
        token = a[c];
        is_beginning_of_line = (token[2][1] === 0);
        str = token[1];
        token_type = token[0];
        if (((str === "//") || (str === "#"))) {
            x_comment(token);
            in_comment_line = true;
        } else {
            if ((str === "\n")) {
                in_comment_line = false;
            } else {
                if (((prev === "*") && str.endswith("/"))) {
                    x_comment(token);
                    in_comment_block = false;
                } else {
                    if ((in_comment_block || in_comment_line)) {
                        x_comment(token);
                    } else {
                        if (((prev === "/") && str.startswith("*"))) {
                            i = (i - 1);
                            x_comment(prev_token);
                            x_comment(token);
                            in_comment_block = true;
                        } else {
                            the.tokenstream[i] = [token[0], token[1], token[2], token[3], token[4], i];
                            i = (i + 1);
                        }
                    }
                }
            }
        }
        prev = str;
        prev_token = token;
    }
}

function init(strings) {
    let comp, left, right;
    if ((!the.moduleMethods)) {
        load_module_methods();
    }
    the.no_rollback_depth = (-1);
    the.rollback_depths = [];
    the.line_number = 0;
    if ((strings instanceof list)) {
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
    drop_comments();
    the.tokens_len = the.tokenstream.length;
    the.token_number = (-1);
    next_token(false);
    the.string = the.lines[0].strip();
    the.original_string = the.string;
    the.root = null;
    the.nodes = [];
    the.depth = 0;
    left = right = comp = null;
    let nr, c = 0;
    const a = english_tokens.numbers, b = a.length;
    for (;
        (c < b); c += 1) {
        nr = a[c];
        the.token_map[nr] = number;
    }
}

function error_position() {}

function raiseEnd() {
    if ((current_type === _token.ENDMARKER)) {
        throw new EndOfDocument();
    }
    if ((the.token_number >= the.tokenstream.length)) {
        throw new EndOfDocument();
    }
}

function remove_tokens(...tokenz) {
    while (_in(the.current_word, tokenz)) {
        next_token();
    }
}

function must_contain(args, do_raise = true) {
    let old, pre;
    if ((args.slice((-1))[0] instanceof dict)) {
        return must_contain_before(args.slice(0, (-2)), args.slice((-1))[0]["before"]);
    }
    if (is_string(args)) {
        args = [args];
    }
    old = current_token;
    pre = the.previous_word;
    while ((!checkEndOfLine())) {
        let x, c = 0;
        const a = args, b = a.length;
        for (;
            (c < b); c += 1) {
            x = a[c];
            if ((current_word === x)) {
                set_token(old);
                return x;
            }
        }
        next_token();
        if ((do_raise && ((current_word === ";") || (current_word === "\n")))) {
            break;
        }
    }
    set_token(old);
    the.previous_word = pre;
    if (do_raise) {
        throw new NotMatching(("must_contain " + args.toString()));
    }
    return false;
}

function must_contain_before(args, before) {
    let good, old;
    old = current_token;
    good = null;
    while ((!(checkEndOfLine() || (_in(current_word, before) && (!_in(current_word, args)))))) {
        if (_in(current_word, args)) {
            good = current_word;
            break;
        }
        next_token();
    }
    set_token(old);
    if ((!good)) {
        throw NotMatching;
    }
    return good;
}

function must_contain_before_old(before, ...args) {
    var args, good, sub;
    raiseEnd();
    good = false;
    if ((before && is_string(before))) {
        before = [before];
    }
    if (before) {
        before = (flatten(before) + [";"]);
    }
    args = flatten(args);
    for (var x, c = 0, a = flatten(args), b = a.length;
        (c < b); c += 1) {
        x = a[c];
        if (re.search("^\\s*\\w+\\s*$", x)) {
            good = (good || re.search(("[^\\w]%s[^\\w]" % x), the.string));
            if ((Object.getPrototypeOf(good).__name__ === "SRE_Match")) {
                good = good.start();
            }
            if ((((good && before) && _in(good.pre_match, before)) && before.index(good.pre_match))) {
                good = null;
            }
        } else {
            good = (good || re.search(escape_token(x), the.string));
            if ((Object.getPrototypeOf(good).__name__ === "SRE_Match")) {
                good = good.start();
            }
            sub = the.string.slice(0, good);
            if ((((good && before) && _in(sub, before)) && before.index(sub))) {
                good = null;
            }
        }
        if (good) {
            break;
        }
    }
    if ((!good)) {
        throw NotMatching;
    }
    for (var nl, c = 0, a = english_tokens.newline_tokens, b = a.length;
        (c < b); c += 1) {
        nl = a[c];
        if (_in(nl, good.toString())) {
            throw NotMatching;
        }
    }
    return OK;
}

function starts_with(param) {
    return maybe(() => {
        return starts_with(param);
    });
}

function starts_with(tokenz) {
    if (checkEndOfLine()) {
        return false;
    }
    if (is_string(tokenz)) {
        return (tokenz === the.current_word);
    }
    if (_in(the.current_word, tokenz)) {
        return the.current_word;
    }
    return false;
}

function look_1_ahead(expect_next, doraise = false, must_not_be = false, offset = 1) {
    let token;
    if ((the.current_word === "")) {
        return false;
    }
    if (((the.token_number + 1) >= the.tokens_len)) {
        console.log("BUG: this should not happen");
        return false;
    }
    token = the.tokenstream[(the.token_number + offset)];
    if ((expect_next === token[1])) {
        return true;
    } else {
        if (((expect_next instanceof list) && _in(token[1], expect_next))) {
            return true;
        } else {
            if (must_not_be) {
                return OK;
            }
            if (doraise) {
                throw new NotMatching(doraise);
            }
            return false;
        }
    }
}

function _(x) {
    return token(x);
}

function lastmaybe(stack) {
    let s, c = 0;
    const a = stack, b = a.length;
    for (;
        (c < b); c += 1) {
        s = a[c];
        if (re.search("try", s)) {
            return s;
        }
    }
}

function caller_name() {
    return caller();
}

function adjust_interpret() {
    let depth;
    depth = caller_depth();
    if ((context.interpret_border > (depth - 2))) {
        context.interpret = context.did_interpret;
        context.interpret_border = (-1);
        do_interpret();
    }
}

function do_interpret() {
    if ((context.did_interpret !== context.interpret)) {
        context.did_interpret = context.interpret;
    }
    context.interpret = true;
}

function dont_interpret() {
    let depth;
    depth = caller_depth();
    if ((context.interpret_border < 0)) {
        context.interpret_border = depth;
        context.did_interpret = context.interpret;
    }
    context.interpret = false;
}

function interpreting() {
    if (context.use_tree) {
        return false;
    }
    return context.interpret;
}

function check_rollback_allowed() {
    let c, level, throwing;
    c = caller_depth;
    throwing = true;
    level = 0;
    return ((c < no_rollback_depth) || (c > (no_rollback_depth + 2)));
}

function read_source(x) {
    let i, lines, res;
    if ((last_pattern || (!x))) {
        return last_pattern;
    }
    res = (((x.source_location[0] + ":") + x.source_location[1].to_s) + "\n");
    lines = IO.readlines(x.source_location[0]);
    i = (x.source_location[1] - 1);
    while (true) {
        res += lines[i];
        if ((((i >= lines.length) || lines[i].match("}")) || lines[i].match("end"))) {
            break;
        }
        i = (i + 1);
    }
    return res;
}

function caller_depth() {
    let c;
    c = caller().length;
    if ((c > max_depth)) {
        throw new SystemStackError("depth overflow");
    }
    return c;
}

function no_rollback() {
    let depth;
    depth = (caller_depth() - 1);
    the.no_rollback_depth = depth;
    the.rollback_depths.append(depth);
}

function adjust_rollback(depth = (-1)) {
    try {
        if ((depth === (-1))) {
            depth = caller_depth();
        }
        if ((depth <= the.no_rollback_depth)) {
            allow_rollback(1);
        }
    } catch (e) {
        error(e);
    }
}

function allow_rollback(n = 0) {
    let depth;
    if ((n < 0)) {
        the.rollback_depths = [];
    }
    depth = ((caller_depth() - 1) - n);
    if ((the.rollback_depths.length > 0)) {
        the.no_rollback_depth = the.rollback_depths.slice((-1))[0];
        while ((the.rollback_depths.slice((-1))[0] >= depth)) {
            the.no_rollback_depth = the.rollback_depths.pop();
            if ((the.rollback_depths.length === 0)) {
                if ((the.no_rollback_depth >= depth)) {
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
    for (var fuck, c = 0, a = old_nodes, b = a.length;
        (c < b); c += 1) {
        fuck = a[c];
        if (_in(fuck, nodes)) {
            nodes.remove(fuck);
        }
    }
    for (var n, c = 0, a = nodes, b = a.length;
        (c < b); c += 1) {
        n = a[c];
        n.invalid();
        n.destroy();
    }
}

function beginning_of_line() {
    let previous_offset;
    if ((the.token_number > 1)) {
        previous_offset = the.tokenstream[(the.token_number - 1)][2][1];
        if ((previous_offset > the.current_offset)) {
            return true;
        }
    }
    return ((the.current_type === _token.INDENT) || (the.current_offset === 0));
}

function block(multiple = false) {
    // import {
    //     statement,
    //     end_of_statement,
    //     end_block
    // } from 'english_parser';
    let end_of_block, start, statement0, statements;
    (maybe_newline() || ((!_in("=>", the.current_line)) && maybe_tokens(english_tokens.start_block_words)));
    start = pointer();
    statement0 = statement(false);
    statements = (statement0 ? [statement0] : []);
    end_of_block = maybe(end_block);
    while (((multiple || (!end_of_block)) && (!checkEndOfFile()))) {
        end_of_statement();
        no_rollback();
        if (multiple) {
            maybe_newline();
        }

        function lamb() {
            let s;
            try {
                maybe_indent();
                s = statement();
                statements.append(s);
            } catch (e) {
                if ((e instanceof NotMatching)) {
                    if ((starts_with(english_tokens.done_words) || checkNewline())) {
                        return false;
                    }
                    console.log("Giving up block");
                    print_pointer(true);
                    throw new Error(((e.toString() + "\nGiving up block\n") + pointer_string()));
                } else {
                    throw e;
                }
            }
            return end_of_statement();
        }
        star(lamb, {
            giveUp: true
        });
        end_of_block = end_block();
        if ((!multiple)) {
            break;
        }
    }
    the.last_result = the.result;
    if (interpreting()) {
        return statements.slice((-1))[0];
    }
    if ((statements.length === 1)) {
        statements = statements[0];
    }
    if (context.use_tree) {
        the.result = statements;
    }
    return statements;
}

function maybe(expr) {
    let cc, current_value, depth, ex, last_node, old, rb, result;
    if ((!(expr instanceof collections.Callable))) {
        return maybe_tokens(expr);
    }
    the.current_expression = expr;
    depth = (depth + 1);
    if ((depth > context.max_depth)) {
        throw new SystemStackError("len(nodes)>max_depth)");
    }
    old = current_token;
    try {
        result = expr();
        adjust_rollback();
        if (((context._debug && (result instanceof collections.Callable)) && (!(result instanceof type)))) {
            throw new Error(("BUG!? returned CALLABLE " + result.toString()));
        }
        if ((result || (result === 0))) {
            verbose(((("GOT result " + expr.toString()) + " : ") + result.toString()));
        } else {
            verbose(("No result " + expr.toString()));
            set_token(old);
        }
        last_node = current_node;
        return result;
    } catch (e) {
        if ((e instanceof EndOfLine)) {
            todo(NotMatching);
            if (verbose) {
                verbose(("Tried %d %s %s, got %s" % [the.current_offset, the.current_word, expr, e]));
            }
            adjust_interpret();
            cc = caller_depth();
            rb = the.no_rollback_depth;
            if ((cc >= rb)) {
                set_token(old);
                current_value = null;
            }
            if ((cc < rb)) {
                error("NO ROLLBACK, GIVING UP!!!");
                ex = new GivingUp(((((e.toString() + "\n") + to_source(expr)) + "\n") + pointer_string()));
                throw ex;
            }
        } else {
            if ((e instanceof EndOfDocument)) {
                set_token(old);
                verbose("EndOfDocument");
                return false;
            } else {
                if ((e instanceof IgnoreException)) {
                    set_token(old);
                    error(e);
                    verbose(e);
                } else {
                    error(e);
                    throw e;
                }
            }
        }
    } finally {
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
    if (more) {
        all.append(more);
    }
    return all;
}

function to_source(block) {
    return block.toString();
}

function pointer() {
    return current_token[2];
}

function isnumeric(start) {
    return start.isdigit();
}

function app_path() {}

function clear() {
    let variableValues, variables;
    verbose("clear all variables, methods, ...");
    variables = {};
    variableValues = {};
    context.testing = true;
    the.variables.clear();
    the.variableTypes.clear();
    the.variableValues.clear();
    context.in_hash = false;
    context.in_list = false;
    context.in_condition = false;
    context.in_args = false;
    context.in_params = false;
    context.in_pipe = false;
    if ((!context.use_tree)) {
        do_interpret();
    }
}
// try {
//     File = [file, xfile, io.IOBase];
// } catch (e) {
//     if ((e instanceof NameError)) {
//         File = [io.IOBase];
//     } else {
//         throw e;
//     }
// }

parse = function parse(s, target_file = null) {
    let got_ast, source_file;
    if ((!s)) {
        return;
    }
    if ((s instanceof File)) {
        source_file = s.name;
        s = s.readlines();
    } else {
        if ((s.endswith(".e") || s.endswith(".an"))) {
            target_file = (target_file || (s + ".pyc"));
            source_file = s;
            s = open(s).readlines();
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
        console.log(("  File \"%s\", line 1" % source_file));
    }
    if ((s.length < 1000)) {
        verbose("--------PARSING:---------");
        verbose(s);
        verbose("-------------------------");
    }
    try {
        english_parser = require("./english_parser.js")
        if ((s instanceof File)) {
            source_file = s.toString();
            target_file = (source_file + ".pyc");
            s = s.readlines();
        }
        allow_rollback();
        init(s);
        the.result = english_parser.rooty();
        if ((the.result instanceof FunctionCall)) {
            the.result = english_parser.do_execute_block(the.result);
        }
        if (_in(the.result, ["True", "true"])) {
            the.result = true;
        }
        if (_in(the.result, ["False", "false"])) {
            the.result = false;
        }
        if ((the.result instanceof Variable)) {
            the.result = the.result.value;
        }
        // import * as ast from 'ast';
        got_ast = (the.result instanceof ast.AST);
        if (((the.result instanceof list) && (the.result.length > 0))) {
            got_ast = (the.result[0] instanceof ast.AST);
        }
        if ((context.use_tree && got_ast)) {
            // import * as pyc_emitter from 'pyc_emitter';
            the.result = pyc_emitter.eval_ast(the.result, {}, source_file, target_file, {
                run: true
            });
        } else {
            if ((the.result instanceof ast.Num)) {
                the.result = the.result.n;
            }
            if ((the.result instanceof ast.Str)) {
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
    return english_parser.interpretation();
}

function token(t, expected = "") {
    if ((t instanceof list)) {
        return tokens(t);
    }
    raiseEnd();
    if ((current_word === t)) {
        next_token();
        return t;
    } else {
        throw new NotMatching(((((expected + " ") + t) + "\n") + pointer_string()));
    }
}

function tokens(tokenz) {
    let ok;
    raiseEnd();
    ok = maybe_tokens(tokenz);
    if (ok) {
        return ok;
    }
    throw new NotMatching(((tokenz.toString() + "\n") + pointer_string()));
}

function escape_token(t) {
    let z;
    z = re.sub("([^\\w])", "\\\\\\1", t);
    return z;
}

function raiseNewline() {
    if (checkEndOfLine()) {
        throw new EndOfLine();
    }
}

function checkNewline() {
    return checkEndOfLine();
}

function checkEndOfLine() {
    return (((((current_type === _token.NEWLINE) || (current_type === _token.ENDMARKER)) || (the.current_word === "\n")) || (the.current_word === "")) || (the.token_number >= the.tokenstream.length));
}

function checkEndOfFile() {
    return ((current_type === _token.ENDMARKER) || (the.token_number >= the.tokenstream.length));
}

function maybe_newline() {
    return (checkEndOfFile() || newline({
        doraise: false
    }));
}

function newline(doraise = false) {
    let found;
    if ((((checkNewline() === english_tokens.NEWLINE) || (the.current_word === ";")) || (the.current_word === ""))) {
        next_token();
        if ((the.current_type === 54)) {
            next_token();
        }
        while ((the.current_type === _token.INDENT)) {
            next_token();
        }
        return english_tokens.NEWLINE;
    }
    found = maybe_tokens(english_tokens.newline_tokens);
    if (found) {
        return found;
    }
    if ((checkNewline() === english_tokens.NEWLINE)) {
        next_token();
        return found;
    }
    if (((!found) && doraise)) {
        raise_not_matching("no newline");
    }
    return false;
}

function newlines() {
    return star(newline);
}

function NL() {
    return tokens("\n", "\r");
}

function NLs() {
    return tokens("\n", "\r");
}

function rest_of_statement() {
    let current_value;
    current_value = re.search("(.*?)([\\r\\n;]|done)", the.string)[1].strip();
    the.string = the.string.slice(current_value.length, (-1));
    return current_value;
}

rest_of_line=function () {
    let rest;
    rest = "";
    while (((!checkEndOfLine()) && (!(current_word === ";")))) {
        rest += (current_word + " ");
        next_token(false);
    }
    return rest.strip();
}

function comment_block() {
    token("/");
    token("*");
    while (true) {
        if ((the.current_word === "*")) {
            next_token();
            if ((the.current_word === "/")) {
                return true;
            }
        }
        next_token();
    }
}
new Starttokens(["//", "#", "'", "--"]);

function skip_comments() {
    let l;
    if ((the.current_word === null)) {
        return;
    }
    l = the.current_word.length;
    if ((l === 0)) {
        return;
    }
    if ((the.current_type === tokenize.COMMENT)) {
        next_token();
    }
    if ((l > 1)) {
        if ((the.current_word.slice(0, 2) === "--")) {
            return rest_of_line();
        }
        if ((the.current_word.slice(0, 2) === "//")) {
            return rest_of_line();
        }
    }
}

function raise_not_matching(msg = null) {
    throw new NotMatching(msg);
}
_try = maybe;

function number() {
    return ((((maybe(real) || maybe(fraction)) || maybe(integer)) || maybe(number_word)) || raise_not_matching("number"));
}

function number_word() {
    let n;
    n = tokens(english_tokens.numbers);
    return xstr(n).parse_number();
}

function fraction() {
    let f, m;
    f = (maybe(integer) || 0);
    m = starts_with(["\u00bc", "\u00bd", "\u00be", "\u2153", "\u2154", "\u2155", "\u2156", "\u2157", "\u2158", "\u2159", "\u215a", "\u215b", "\u215c", "\u215d", "\u215e"]);
    if ((!m)) {
        if ((f !== 0)) {
            return f;
        }
        throw new NotMatching();
    } else {
        next_token();
        m = xstr(m).parse_number();
    }
    the.result = (f + m);
    return the.result;
}
ZERO = "0";

function integer() {
    let current_value, match;
    match = re.search("^\\s*(-?\\d+)", the.string);
    if (match) {
        current_value = parseInt(match.groups()[0]);
        next_token(false);
        if (context.use_tree) {
            return new kast.Num(current_value);
        }
        if ((current_value === 0)) {
            current_value = ZERO;
        }
        return current_value;
    }
    throw new NotMatching("no integer");
}

function real() {
    let current_value, match;
    match = re.search("^\\s*(-?\\d*\\.\\d+)", the.string);
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
    match = re.search("^(\\d+j)", s);
    if ((!match)) {
        match = re.search("^(\\d*\\.\\d+j)", s);
    }
    if ((!match)) {
        match = re.search("^(\\d+\\s*\\+\\s*\\d+j)", s);
    }
    if ((!match)) {
        match = re.search("^(\\d*\\.\\d+\\s*\\+\\s*\\d*\\.\\d+j)", s);
    }
    if (match) {
        the.current_value = complex(match[0].groups());
        next_token(false);
        return current_value;
    }
    return false;
}

function maybe_indent() {
    while (((the.current_type === _token.INDENT) || (the.current_word === " "))) {
        next_token();
    }
}

function method_allowed(meth) {
    if ((meth.length < 2)) {
        return false;
    }
    if (_in(meth, ["print"])) {
        return true;
    }
    if (_in(meth, ["evaluate", "eval", "int", "True", "False", "true", "false", "the", "Invert", "char"])) {
        return false;
    }
    if (_in(meth, english_tokens.keywords)) {
        return false;
    }
    return true;
}

function load_module_methods() {
    // import * as warnings from 'warnings';
    // import * as english_parser from 'english_parser';
    let ex;
    warnings.filterwarnings("ignore", {
        category: UnicodeWarning
    });
    the.methodToModulesMap = pickle.load(open((context.home + "/data/method_modules.bin"), "rb"));
    the.moduleMethods = pickle.load(open((context.home + "/data/module_methods.bin"), "rb"));
    the.moduleNames = pickle.load(open((context.home + "/data/module_names.bin"), "rb"));
    the.moduleClasses = pickle.load(open((context.home + "/data/module_classes.bin"), "rb"));
    for (var mo_mes, c = 0, a = list(the.moduleMethods.items()), b = a.length;
        (c < b); c += 1) {
        mo_mes = a[c];
        if ((!method_allowed(mo))) {
            continue;
        }
        the.method_token_map[mo] = english_parser.method_call;
        for (var meth, f = 0, d = mes, e = d.length;
            (f < e); f += 1) {
            meth = d[f];
            if (method_allowed(meth)) {
                the.method_token_map[meth] = english_parser.method_call;
            }
        }
    }
    for (var mo_cls, c = 0, a = list(the.moduleClasses.items()), b = a.length;
        (c < b); c += 1) {
        mo_cls = a[c];
        for (var meth, f = 0, d = cls, e = d.length;
            (f < e); f += 1) {
            meth = d[f];
            if (method_allowed(meth)) {
                the.method_token_map[meth] = english_parser.method_call;
            }
        }
    }
    the.constructors = (list(the.classes.keys()) + english_tokens.type_names);
    the.method_names = (((((list(the.methods.keys()) + c_methods) + list(methods.keys())) + core_methods) + builtin_methods) + list(the.methodToModulesMap.keys()));
    for (var x, c = 0, a = dir(extensions), b = a.length;
        (c < b); c += 1) {
        x = a[c];
        the.method_names.append(x);
    }
    context.extensionMap = extensionMap;
    for (var _type, c = 0, a = context.extensionMap, b = a.length;
        (c < b); c += 1) {
        _type = a[c];
        ex = context.extensionMap[_type];
        for (var method, f = 0, d = dir(ex), e = d.length;
            (f < e); f += 1) {
            method = d[f];
            the.method_names.append(method);
        }
    }
    the.method_names = function () {
        const a = [],
            b = the.method_names;
        let c = 0;
        const d = b.length;
        for (; c < d; c += 1) {
            const meth = b[c];
            if (method_allowed(meth)) {
                a.push(meth);
            }
        }
        return a;
        }
        .call(this);
}

//# sourceMappingURL=power_parser.js.map
// module.exports.parse = parse
exports.parse = parse