// import * as extensions from 'extensions';
home = ".";
extensionMap = {};
EMPTY_MAP = {
    "EMPTY_MAP": 1
};
_verbose = false;
_debug = false;
testing = false;
very_verbose = _verbose;
current_expression = null;
use_tree = false;
use_wordnet = false;
in_pipe = false;
in_condition = false;
in_args = false;
in_hash = false;
in_list = false;
in_params = false;
in_algebra = false;
interpret = true;
did_interpret = false;
variables = {};
variableTypes = {};
variableValues = {};
params = {};
threads = {};
string = "";
tokenstream = [];
tokens_len = 0;
token_map = {};
method_token_map = {};
token_number = 0;
current_type = 0;
current_offset = 0;
current_word = "";
previous_word = "";
current_line = "";
current_token = null;
current_file = "(String)";
lines = [];
original_string = "";
string = "";
line_number = 0;
last_pattern = null;
moduleNames = [];
moduleClasses = {};
moduleMethods = {};
methodToModulesMap = {};
method_names = [];
constructors = [];
OK = "OK";
result = null;
last_result = null;
listeners = [];
rollback = [];
tree = [];
interpret_border = (-1);
no_rollback_depth = (-1);
rollback_depths = [];
max_depth = 160;
negated = false;
depth = 0;
current_node = null;
current_value = null;
needs_extensions = false;
// parser = globals();
function is_number(s) {
    return (((((typeof s) === "number") || (s instanceof Number)) || (((typeof s) === "number") || (s instanceof Number))) || (is_string(s) && s.isdigit()));
}
svg = [];

function parent_node() {
    return null;
}
extensions = require('./extensions.js')
core_methods = ["show", "now", "yesterday", "help", "print"];
methods = {
    "p": extensions.puts,
    "print": extensions.puts,
    "length": len,
    "size": len,
    "count": len,
    "beep": extensions.beep,
    "puts": extensions.puts,
    "printf": extensions.puts,
    "show": extensions.puts,
    "increase": extensions.increase
};
classes = {};
c_methods = ["printf"];
builtin_methods = ["puts", "print", "printf"];
nouns = ["window", "bug"];
adjectives = ["funny", "big", "small", "good", "bad"];
verbs = ["be", "have", "do", "get", "make", "want", "try", "buy", "take", "apply", "make", "get", "eat", "drink", "go", "know", "take", "see", "come", "think", "look", "give", "use", "find", "tell", "ask", "work", "seem", "feel", "leave", "call", "integrate", "print", "eat", "test", "say"];
emit = false;
version = "0.6.4";
starttokens_done = false;

//# sourceMappingURL=context.js.map
// EMPTY_MAP, OK, _debug, _verbose, adjectives, builtin_methods, c_methods, classes, constructors, core_methods, current_expression, current_file, current_line, current_node, current_offset, current_token, current_type, current_value, current_word, depth, did_interpret, emit, extensionMap, home, in_algebra, in_args, in_condition, in_hash, in_list, in_params, in_pipe, interpret, interpret_border, last_pattern, last_result, line_number, lines, listeners, max_depth, methodToModulesMap, method_names, method_token_map, methods, moduleClasses, moduleMethods, moduleNames, needs_extensions, negated, no_rollback_depth, nouns, original_string, params, previous_word, result, rollback, rollback_depths, starttokens_done, string, svg, testing, threads, token_map, token_number, tokens_len, tokenstream, tree, use_tree, use_wordnet, variableTypes, variableValues, variables, verbs, version, very_verbose
module.exports = {
    EMPTY_MAP: EMPTY_MAP,
    OK: OK,
    _debug: _debug,
    _verbose: _verbose,
    adjectives: adjectives,
    builtin_methods: builtin_methods,
    c_methods: c_methods,
    classes: classes,
    constructors: constructors,
    core_methods: core_methods,
    current_expression: current_expression,
    current_file: current_file,
    current_line: current_line,
    current_node: current_node,
    current_offset: current_offset,
    current_token: current_token,
    current_type: current_type,
    current_value: current_value,
    current_word: current_word,
    depth: depth,
    did_interpret: did_interpret,
    emit: emit,
    extensionMap: extensionMap,
    home: home,
    in_algebra: in_algebra,
    in_args: in_args,
    in_condition: in_condition,
    in_hash: in_hash,
    in_list: in_list,
    in_params: in_params,
    in_pipe: in_pipe,
    interpret: interpret,
    interpret_border: interpret_border,
    last_pattern: last_pattern,
    last_result: last_result,
    line_number: line_number,
    lines: lines,
    listeners: listeners,
    max_depth: max_depth,
    methodToModulesMap: methodToModulesMap,
    method_names: method_names,
    method_token_map: method_token_map,
    methods: methods,
    moduleClasses: moduleClasses,
    moduleMethods: moduleMethods,
    moduleNames: moduleNames,
    needs_extensions: needs_extensions,
    negated: negated,
    no_rollback_depth: no_rollback_depth,
    nouns: nouns,
    original_string: original_string,
    params: params,
    previous_word: previous_word,
    result: result,
    rollback: rollback,
    rollback_depths: rollback_depths,
    starttokens_done: starttokens_done,
    string: string,
    svg: svg,
    testing: testing,
    threads: threads,
    token_map: token_map,
    token_number: token_number,
    tokens_len: tokens_len,
    tokenstream: tokenstream,
    tree: tree,
    use_tree: use_tree,
    use_wordnet: use_wordnet,
    variableTypes: variableTypes,
    variableValues: variableValues,
    variables: variables,
    verbs: verbs,
    version: version,
    very_verbose: very_verbose,
}

interpreting=function interpreting() {
	if (context.use_tree) {
		return false;
	}
	return context.interpret;
}