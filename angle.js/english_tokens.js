// var FALSE, NEWLINE, NILL, NONE, Nil, TRUE, ZERO, adverbs, all_prepositions, all_quantifiers, any_quantifiers, articles, attributes, auxiliary_verbs, bash_commands, be_words, bla_words, boolean_words, class_be_words, class_words, comparison_words, conjunctions, const_words, constantMap, constants, context_keywords, correlative_conjunctions, done_words, english_operators, eval_keywords, event_kinds, false, false_words, fillers, flow_keywords, if_words, import_keywords, interjections, invoke_keywords, kast_operator_map, kast_operator_map_min, keywords, let_words, logic_operators, long_prepositions, math_operators, method_tokens, modifier_words, negative_quantifiers, newline_tokens, nil, nill_words, nonzero_keywords, number_selectors, numbers, once_words, operators, otherKeywords, other_verbs, pair_prepositions, possessive_pronouns, postpositions, prepositions, pronouns, quantifiers, question_words, reductions, require_types, result_words, self_modifying_operators, special_chars, special_verbs, start_block_words, subtype_words, system_verbs, time_words, to_be_words, true, true_operators, true_words, type_keywords, type_names;
// import * as ast from 'ast';
// import {tokenize, untokenize, NUMBER, STRING, NAME, OP} from 'tokenize';
// import {BytesIO} from 'io';
// import * as os from 'os';
// import * as context from 'context';
// import * as extensions from 'extensions';
// import * as kast.kast from 'kast/kast';
// import {*} from 'power_parser';
// import {list} from 'extensions';
ast = require("./ast")
extensions = require('./extensions')();

function list(xs) { // Only in this context  don't make it global
	if (xs instanceof String) return xs.split("")
	return new Array(xs)
}

True = true;
False = false;
TRUE = "True";
FALSE = "False";
None = class None{}
NONE = None
NILL = None
Nil = None
nil = None
ZERO = "0";
OK = "OK"
bash_commands = ["ls", "cd"];
method_tokens = ["how to", "function", "definition for", "definition of", "define", "method for", "method", "func", "fn", "def", "in order to", "to", "^to"];
import_keywords = ["dependencies", "dependency", "depends on", "depends", "requirement", "requirements", "require", "required", "include", "using", "uses", "needs", "requires", "import"];
require_types = "javascript script js gcc ruby gem header c cocoa native".split();
numbers = "1 2 3 4 5 6 7 8 9 0      -1 -2 -3 -4 -5 -6 -7 -8 -9 -0           ten nine eight seven six five four three two one zero".split();
number_selectors = " 1st 2nd 3rd 4th 5th 6th 7th 8th 9th 0th 10th      tenth ninth eighth seventh sixth fifth fourth third second first".split();
special_chars = "!@#$%^*()+_}{\":?><,./';][=-`'|\\".split("");
NEWLINE = "NEWLINE";
article_words = ["an", "the", "these", "those", "any", "all", "some", "teh", "that", "every", "each", "this"];
negative_quantifiers = ["nothing", "neither", "none", "no"];
all_quantifiers = ["all", "every", "everything", "the whole"];
any_quantifiers = ["any", "one", "some", "most", "many", "exists", "exist", "there is", "there are", "at least one", "at most two"];
quantifiers = ["any", "all", "every", "one", "each", "some", "most", "many", "nothing", "neither", "none", "no", "everything", "the whole"];
result_words = ["it", "they", "result", "its", "that", "the result", "_"];
type_keywords = ["class", "interface", "module", "type", "kind"];
type_names = ["auto", "string", "int", "integer", "bool", "boolean", "list", "array", "hash", "float", "real", "double", "number", "set", "type", "str", "class", "object", "map", "dict", "dictionary", "char", "character", "letter", "word", "class", "type", "name", "label", "Auto", "String", "Int", "Integer", "Bool", "Boolean", "List", "Array", "Hash", "Float", "Real", "Double", "Number", "Set", "Type", "Str", "Object", "Map", "Dict", "Dictionary"];
constantMap = {
	"True": TRUE,
	"false": FALSE,
	"yes": TRUE,
	"no": FALSE,
	"1": 1,
	"0": ZERO,
	"pi": Math.pi,
	"\u03c0": Math.pi,
	"\u2020": (2 * Math.pi),
	"\u03c4": (2 * Math.pi),
	"tau": (2 * Math.pi),
	"e": Math.e,
	"euler": Math.e,
	"\u00bd": (1 / 2.0),
	"\u00c2\u00bd": (1 / 2.0)
};
constants = Object.keys(constantMap);
question_words = ["when", "why", "where", "what", "who", "which", "whose", "whom", "how"];
prepositions = ["of", "above", "with or without", "after", "against", "apart from", "around", "as", "aside from", "at", "before", "behind", "below", "beneath", "beside", "between", "beyond", "by", "considering", "down", "during", "for", "from", "in", "instead of", "inside of", "inside", "into", "like", "near", "on", "onto", "out of", "over", "outside", "since", "through", "thru", "to", "till", "with", "up", "upon", "under", "underneath", "versus", "via", "with", "within", "without", "toward", "towards", "with_or_without"];
all_prepositions = ["aboard", "about", "above", "across", "after", "against", "along", "amid", "among", "anti", "around", "as", "at", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "by", "concerning", "considering", "despite", "down", "during", "except", "excepting", "excluding", "following", "for", "from", "in", "inside", "into", "like", "minus", "near", "of", "off", "on", "onto", "opposite", "outside", "over", "past", "per", "pro", "plus", "re", "regarding", "round", "save", "sans", "since", "than", "through", "thru", "thruout", "throughout", "to", "till", "toward", "towards", "under", "underneath", "unlike", "until", "up", "upon", "versus", "via", "with", "within", "without"];
long_prepositions = ["by means of", "for the sake of", "in accordance with", "in addition to", "in case of", "in front of", "in lieu of", "in order to", "in place of", "in point of", "in spite of", "on account of", "on behalf of", "on top of", "with regard to", "with respect to", "with a view to", "as far as", "as long as", "as opposed to", "as soon as", "as well as", "by virtue of"];
pair_prepositions = ["according to", "ahead of", "apart from", "as for", "as of", "as per", "as regards", "aside from", "back to", "because of", "close to", "due to", "except for", "far from", "in to", "(contracted as into)", "inside of", "(note that inside out is an adverb and not a preposition)", "instead of", "left of", "near to", "next to", "on to", "(contracted as onto)", "out from", "out of", "outside of", "owing to", "prior to", "pursuant to", "regardless of", "right of", "subsequent to", "thanks to", "that of", "up to", "where as"];
postpositions = ["ago", "apart", "aside", "away", "hence", "notwithstanding", "on", "through", "withal", "again"];
conjunctions = ["and", "or", "but", "yet", "xor", "nand"];
correlative_conjunctions = ["either...or", "not only...but (also)", "neither...nor", "neither...or", "both...and", "whether...or", "just as...so"];
auxiliary_verbs = ["is", "be", "was", "cannot", "can not", "can", "could", "has", "have", "had", "may", "might", "must", "shall", "should", "will", "would", "do"];
possessive_pronouns = ["my", "your", "their", "his", "her", "hers", "theirs"];
pronouns = ["I", "i", "me", "my", "mine", "myself", "we", "us", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "you", "your", "yours", "yourselves", "he", "him", "his", "himself", "they", "them", "their", "theirs", "themselves", "she", "her", "hers", "herself", "it", "its", "itself", "ye", "thou", "thee", "thy", "thine", "thyself"];
interjections = ["ah", "aah", "aha", "ahem", "ahh", "argh", "aw", "bah", "boo", "brr", "eek", "eep", "eh", "eww", "gah", "grr", "hmm", "huh", "hurrah", "meh", "mhm", "mm", "muahaha", "nah", "nuh-uh", "oh", "ooh", "ooh-la-la", "oomph", "oops", "ow", "oy", "oy", "pff", "phew", "psst", "sheesh", "shh", "tsk-tsk", "uh-hu", "uh-uh", "uh-oh", "uhh", "wee", "whoa", "wow", "yeah", "yahoo", "yoo-hoo", "yuh-uh", "yuk", "zing"];
fillers = ["like", "y'know", "so", "actually", "literally", "basically", "right", "I'm tellin' ya", "you know what I mean?", "ehm", "uh", "er"];
class_words = ["is an", "is a", "has type", "is of type", "has class", "is of class", "is instance of", "is instance", "instance of"];
subtype_words = ["inherits", "inherits from", "extends", "is subtype of", "is subtype", "subtype of", "is subclass of", "is subclass", "subclass of", "has base class"];
to_be_words = ["is", "be", "are", ":=", "="];
be_words = ["is", "be", "was", "are", "will be", "were", "have been", "shall be", "should be", ":=", "=", "==", "equals", "equal", "is equal to", "consist of", "consists of", "is made up of", "equal to", "same", "the same as", "same as", "the same"];
class_be_words = ["is an", "is a"];
comparison_words = ["be", "is of", "is in", "is a", "is", "subset of", "in", "are", "were", ">=", "==", "!=", "<=", "=<", "=", ">", "<", "\u2260", "\u2264", "\u2265", "~", "~=", "=~", "~~", "gt", "lt", "eq", "identical to", "smaller or equal", "greater or equal", "equal to", "bigger", "greater", "equals", "smaller", "less", "more", "the same as", "same as", "similar", "comes after", "inherits from", "implementscomes before", "exact", "exactly", "~>", "at least", "at most"];
logic_operators = ["!", "&&", "&", "||", "|", "not", "and", "but", "or", "xor", "nor", "neither"];
math_operators = ["^", "^^", "**", "*", "/", "//", "+", "-", "%"];
english_operators = ["power", "to the", "pow", "times", "divided by", "divide by", "plus", "minus", "add", "subtract", "mod", "modulo", "print"];
true_operators = math_operators.plus(english_operators).plus(logic_operators);
operators = true_operators.plus(comparison_words)
once_words = ["whenever", "wherever", "as soon as", "once"];
if_words = ["if"];
nill_words = ["None", "nil", "empty", "void", "nill", "nul", "nothing", "null", "undefined", "naught", "nought"];
done_words = ["\u25ca", "\u03a9", ";;", "}", "done", "Ende", "end", "okay", "ok", "OK", "O.K.", "alright", "that's it", "thats it", "I'm done", "i'm done", "fine", "fi", "fini", "finish", "fin", "all set", "finished", "the end", "over and out", "over", "q.e.d.", "qed", "<end>"];
false_words = ["false", "FALSE", "False", "falsch", "wrong", "No", "no", "non", "nix", "nein", "njet", "niet"];
true_words = ["True", "true", "yes", "ja", "si"];
boolean_words = false_words.plus(true_words);
otherKeywords = ["and", "as", "assert", "back", "beginning", "but", "by", "contain", "contains", "copy", "def", "div", "does", "eighth", "else", "end", "equal", "equals", "error", "every", "false", "fifth", "first", "for", "fourth", "even", "front", "get", "given", "global", "if", "ignoring", "is", "it", "its", "that", "result", "last", "local", "me", "middle", "mod", "my", "ninth", "not", "sixth", "some", "tell", "tenth", "then", "third", "timeout", "times", "transaction", "True", "try", "where", "whose", "until", "while", "print", "prop", "property", "put", "ref", "reference", "repeat", "return", "returning", "script", "second", "set", "seventh", "otherwise"];
const_words = ["constant", "const", "final", "immutable", "unchangeable"];
modifier_words = const_words.plus(["protected", "private", "public", "static", "void", "default", "initial", "mut", "mutable", "variable", "typed"]);
adverbs = ["often", "never", "joyfully", "often", "never", "joyfully", "quite", "nearly", "almost", "definitely", "by any means", "without a doubt"];
let_words = ["let", "set"];
time_words = ["seconds", "second", "minutes", "minute", "a.m.", "p.m.", "pm", "o'clock", "hours", "hour"];
event_kinds = ["in", "at", "every", "from", "between", "after", "before", "until", "till"];
bla_words = ["tell me", "hey", "could you", "give me", "i would like to", "can you", "please", "let us", "let's", "can i", "would you", "i would", "i ask you to", "i'd", "love to", "like to", "i asked you to", "could i", "i tell you to", "i told you to", "come on", "i wanna", "i want to", "i want", "i need to", "i need", "either"];
attributes = ["sucks", "default"];
keywords = prepositions.plus(modifier_words).plus(be_words).plus(comparison_words).plus(fillers).plus(nill_words).plus(done_words).plus(auxiliary_verbs).plus(conjunctions).plus(type_keywords).plus(otherKeywords).plus(numbers).plus(operators);
start_block_words = [";", ":", "do", "{", "begin", "start", "first you ", "second you", "then you", "finally you"];
flow_keywords = ["next", "continue", "break", "stop"];
eval_keywords = ["eval", "what is", "evaluate", "how much", "what are", "calculate"];
nonzero_keywords = ["nonzero", "not null", "defined", "existing", "existant", "existent", "available"];
other_verbs = ["increase", "decrease", "square", "invert", "test"];
special_verbs = ["evaluate", "eval"];
system_verbs = ((["contains", "contain"] ).plus(special_verbs) ).plus(auxiliary_verbs);
invoke_keywords = ["call", "execute", "run", "start", "evaluate", "eval", "invoke"];
context_keywords = ["context", "module", "package"];
self_modifying_operators = ["|=", "&=", "&&=", "||=", "+=", "-=", "/=", "^=", "%=", "#=", "*=", "**=", "<<", ">>"];
newline_tokens = ["\n", "\r\n", ";", "\\.\n", "\\. "];
ast_operator_map = {
	"+": new ast.Add(),
	"plus": new ast.Add(),
	"add": new ast.Add(),
	"-": new ast.Sub(),
	"minus": new ast.Sub(),
	"subtract": new ast.Sub(),
	"*": new ast.Mult(),
	"times": new ast.Mult(),
	"mul": new ast.Mult(),
	"multiplied": new ast.Mult(),
	"multiplied with": new ast.Mult(),
	"multiplied by": new ast.Mult(),
	"multiply": new ast.Mult(),
	"multiply with": new ast.Mult(),
	"multiply by": new ast.Mult(),
	"/": new ast.Div(),
	"div": new ast.Div(),
	"divided": new ast.Div(),
	"divided with": new ast.Div(),
	"divided by": new ast.Div(),
	"divide": new ast.Div(),
	"divide with": new ast.Div(),
	"divide by": new ast.Div(),
	"xor": new ast.BitXor(),
	"^": new ast.Pow(),
	"^^": new ast.Pow(),
	"**": new ast.Pow(),
	"pow": new ast.Pow(),
	"power": new ast.Pow(),
	"to the": new ast.Pow(),
	"to the power": new ast.Pow(),
	"to the power of": new ast.Pow(),
	"%": new ast.Mod(),
	"mod": new ast.Mod(),
	"modulo": new ast.Mod(),
	"!": new ast.Not(),
	"not": new ast.Not(),
	"&": new ast.And(),
	"&&": new ast.And(),
	"and": new ast.And(),
	"|": new ast.BitOr(),
	"||": new ast.Or(),
	"or": new ast.Or(),
	"does not equal": new ast.NotEq(),
	"doesn't equal": new ast.NotEq(),
	"not equal": new ast.NotEq(),
	"is not": new ast.NotEq(),
	"isn't": new ast.NotEq(),
	"isnt": new ast.NotEq(),
	"!=": new ast.NotEq(),
	"\u2260": new ast.NotEq(),
	"=": new ast.Eq(),
	"==": new ast.Eq(),
	"===": new ast.Eq(),
	"~=": new ast.Eq(),
	"is": new ast.Eq(),
	"eq": new ast.Eq(),
	"equal": new ast.Eq(),
	"is equal": new ast.Eq(),
	"equal to": new ast.Eq(),
	"is equal to": new ast.Eq(),
	"equals": new ast.Eq(),
	"same": new ast.Eq(),
	"same as": new ast.Eq(),
	"the same as": new ast.Eq(),
	"identical": new ast.Eq(),
	">": new ast.Gt(),
	"bigger": new ast.Gt(),
	"bigger than": new ast.Gt(),
	"more": new ast.Gt(),
	"more than": new ast.Gt(),
	"greater": new ast.Gt(),
	"greater than": new ast.Gt(),
	">=": new ast.GtE(),
	"bigger or equal": new ast.GtE(),
	"more or equal": new ast.GtE(),
	"greater or equal": new ast.GtE(),
	"<": new ast.Lt(),
	"less": new ast.Lt(),
	"less than": new ast.Lt(),
	"smaller": new ast.Lt(),
	"smaller than": new ast.Lt(),
	"<=": new ast.LtE(),
	"less or equal": new ast.LtE(),
	"less than or equal": new ast.LtE(),
	"smaller or equal": new ast.LtE(),
	"smaller than or equal": new ast.LtE()
};
kast_operator_map_min = {
	"+": new ast.Add(),
	"-": new ast.Sub(),
	"*": new ast.Mult(),
	"/": new ast.Div(),
	"xor": new ast.BitXor(),
	"^": new ast.Pow(),
	"^^": new ast.Pow(),
	"**": new ast.Pow(),
	"pow": new ast.Pow(),
	"power": new ast.Pow(),
	"to the": new ast.Pow(),
	"to the power": new ast.Pow(),
	"to the power of": new ast.Pow(),
	"%": new ast.Mod(),
	"mod": new ast.Mod(),
	"modulo": new ast.Mod(),
	"!": new ast.Not(),
	"not": new ast.Not(),
	"&": new ast.And(),
	"&&": new ast.And(),
	"and": new ast.And(),
	"|": new ast.BitOr(),
	"||": new ast.Or(),
	"or": new ast.Or(),
	"!=": new ast.NotEq(),
	"\u2260": new ast.NotEq(),
	"is": new ast.Eq(),
	"=": new ast.Eq(),
	"==": new ast.Eq(),
	"===": new ast.Eq(),
	"~=": new ast.Eq(),
	"eq": new ast.Eq(),
	">": new ast.Gt(),
	">=": new ast.GtE(),
	"<": new ast.Lt(),
	"<=": new ast.Lt(),
	"in": new ast.In(),
	"contains": new ast.In(),
	"element of": new ast.In()
};
reductions = {
	" div": "/",
	" divided": "/",
	" divided with": "/",
	" divided by": "/",
	" divide": "/",
	" divide with": "/",
	" divide by": "/",
	" times ": "*",
	" mul ": "*",
	" multiplied ": "*",
	" multiplied with ": "*",
	" multiplied by ": "*",
	" multiply ": "*",
	" multiply with ": "*",
	" multiply by ": "*",
	" plus ": "+",
	" add ": "+",
	" minus ": "-",
	" subtract ": "-",
	" substract ": "-",
	" or equal ": "=",
	" is equal ": "=",
	" equal ": "=",
	" equals ": "==",
	" is identical ": "==",
	" identical ": "==",
	" same as ": "==",
	"= to ": "=",
	" less ": " <",
	" smaller ": " <",
	" greater ": " >",
	" bigger ": " <",
	" more ": " <",
	" than ": "",
	"does not equal": "!=",
	"doesn't equal": "!=",
	"not equal": "!=",
	"is not": "!=",
	"isn't": "!=",
	"isnt": "!="
};

//# sourceMappingURL=english_tokens.js.map


// export
_token = {
	NEWLINE: "NEWLINE",
	ENDMARKER: "ENDMARKER",
	NUMBER: "NUMBER",
	STRING: "STRING",
	COMMENT: "COMMENT",
	WORD: "WORD",
	OPERATOR: "OPERATOR",
	BRACE: "BRACE",
	UNKNOWN: "UNKNOWN",
	INDENT: "INDENT",
	DEDENT: "DEDENT",
	BLOCK: "BLOCK",
	KEYWORD: "KEYWORD",
}
keyword_except_english_operators=keywords.minus(english_operators)
keywords_except_values=keywords.minus(constants.plus(constants).add(numbers).add(result_words).add(nill_words).add(["+", "-"]))
