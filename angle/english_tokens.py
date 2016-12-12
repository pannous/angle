# encoding: utf-8
import ast
from tokenize import tokenize, untokenize, NUMBER, STRING, NAME, OP
from io import BytesIO
import os
import context
import extensions

##################/
# Lexemes = simple words
##################
# def __init__(self):
import kast.kast
from power_parser import *  # app_path, verbose
from extensions import xlist

true = True
false = False
TRUE = "True"
FALSE = "False"
NONE = "None"
NILL = "None"
Nil = "None"
nil = "None"
# Nill="None"
ZERO = '0'

bash_commands = ['ls', 'cd']

method_tokens = ['how to', 'function', 'definition for', 'definition of', 'define', 'method for', 'method',
                 'func', 'fn', 'def', 'in order to', 'to', '^to']  # <<< TO == DANGER!! to be or not to be
# ,'impl','implementation','algorithm','routine'
import_keywords = ['dependencies', 'dependency', 'depends on', 'depends', 'requirement', 'requirements', 'require',
                   'required', 'include', 'using', 'uses', 'needs', 'requires', 'import']
require_types = "javascript script js gcc ruby gem header c cocoa native".split()  # todo c++ c# not tokenized!

numbers = "1 2 3 4 5 6 7 8 9 0\
      -1 -2 -3 -4 -5 -6 -7 -8 -9 -0\
      1st 2nd 3rd 4th 5th 6th 7th 8th 9th 0th 10th\
      tenth ninth eighth seventh sixth fifth fourth third second first\
      ten nine eight seven six five four three two one zero".split()

special_chars = list("!@#$%^*()+_}{\":?><,./';][=-`'|\\")

NEWLINE = "NEWLINE"

# TODO : 'a' MESS !
articles = ['an', 'the', 'these', 'those', 'any', 'all', 'some', 'teh', 'that', 'every', 'each',
            'this']  # 'that' * 2 !!!

negative_quantifiers = ["nothing", "neither", "none", "no"]

all_quantifiers = ["all", "every", "everything", "the whole"]

any_quantifiers = ["any", "one", "some", "most", "many", "exists", "exist", "there is", "there are", "at least one",
                   "at most two"]

# "either", VS either of VS either or !!!!!
quantifiers = ["any", "all", "every", "one", "each", "some", "most", "many", "nothing", "neither", "none", "no",
               "everything", "the whole"]  # +number
# articles+):

result_words = ['it', 'they', 'result', 'its', 'that', 'the result', '_']

type_keywords = ["class", "interface", "module", "type", "kind"]

type_names = ["auto", "string", "int", "integer", "bool", "boolean", "list", "array", "hash", "float", "real", "double",
              "number", "set", "type", "str", "class", "object", "map", "dict", "dictionary",
              "char", "character", "letter", "word", "class", "type", "name", "label",
              'Auto', 'String', 'Int', 'Integer', 'Bool', 'Boolean', 'List', 'Array', 'Hash', 'Float', 'Real', 'Double',
              'Number', 'Set', 'Type', 'Str', "Object", "Map", "Dict", "Dictionary"
              ]
##danger(self): object,class ,class  ):
# from math import pi
import math

constantMap = {"True": TRUE, "false": FALSE, "yes": TRUE, "no": FALSE, "1": 1, "0": ZERO,
               "pi": math.pi, "π": math.pi, "†": 2 * math.pi, "τ": 2 * math.pi, "tau": 2 * math.pi, "e": math.e,
               "euler": math.e, "½": 1 / 2., "\xc2\xbd": 1 / 2.,}  # tau=twou*pi=2*pi

constants = list(
	constantMap.keys())  # ["True", "false", "yes", "no", "1", "0", "pi","tau","e","euler"] # tau=twou*pi=2*pi

question_words = ["when", "why", "where", "what", "who", "which", "whose", "whom",
                  "how"]  # ,"what's","how's","why's", "when's","who's",

prepositions = ["of", 'above', 'with or without', 'after', 'against', 'apart from', 'around', 'as', 'aside from', 'at',
                'before', 'behind', \
                'below', \
                'beneath', 'beside', 'between', 'beyond', 'by', 'considering', 'down', 'during', 'for', 'from', 'in', \
                'instead of', 'inside of', 'inside', 'into', 'like', 'near', 'on', 'onto', 'out of', 'over', 'outside', \
                'since', 'through', 'thru', 'to', 'till', 'with', 'up', 'upon', 'under', 'underneath', 'versus', 'via',
                'with', \
                'within', 'without', 'toward', 'towards', 'with_or_without']  # wow

# 'but',
all_prepositions = ['aboard', 'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'anti',
                    'around', 'as', \
                    'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'by', \
                    'concerning', 'considering', 'despite', 'down', 'during', 'except', 'excepting', 'excluding',
                    'following', \
                    'for', 'from', 'in', 'inside', 'into', 'like', 'minus', 'near', 'of', 'off', 'on', 'onto',
                    'opposite', \
                    'outside', 'over', 'past', 'per', 'pro', 'plus', 're', 'regarding', 'round', 'save', 'sans',
                    'since', 'than', \
                    'through', 'thru', 'thruout', 'throughout', 'to', 'till', \
                    'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'up', 'upon', 'versus', 'via',
                    'with', \
                    'within', 'without']

long_prepositions = ['by means of', 'for the sake of', 'in accordance with', 'in addition to', 'in case of', \
                     'in front of', \
                     'in lieu of', 'in order to', 'in place of', 'in point of', 'in spite of', 'on account of', \
                     'on behalf of', 'on top of', 'with regard to', 'with respect to', 'with a view to', 'as far as', \
                     'as long as', 'as opposed to', 'as soon as', 'as well as', 'by virtue of']

pair_prepositions = ['according to', 'ahead of', 'apart from', 'as for', 'as of', 'as per', 'as regards', 'aside from', \
                     'back to', 'because of', 'close to', 'due to', 'except for', 'far from', \
                     'in to', '(contracted as into)', 'inside of',
                     '(note that inside out is an adverb and not a preposition)', \
                     'instead of', 'left of', 'near to', 'next to', 'on to', '(contracted as onto)', 'out from',
                     'out of', 'outside of', \
                     'owing to', 'prior to', 'pursuant to', 'regardless of', 'right of', 'subsequent to', 'thanks to',
                     'that of', 'up to', \
                     'where as']  # ,'whereas'

postpositions = ['ago', 'apart', 'aside', 'away', 'hence', 'notwithstanding', 'on', 'through', 'withal', 'again']

conjunctions = ['and', 'or', 'but', 'yet', 'xor', 'nand']  # so for nor

correlative_conjunctions = ['either...or', 'not only...but (also)', 'neither...nor', 'neither...or', \
                            'both...and', 'whether...or', 'just as...so']

# ['isnt','isn\'t','is not','wasn\'t','was not',]
auxiliary_verbs = ['is', 'be', 'was', 'cannot', 'can not', 'can', 'could', 'has', 'have', 'had', 'may', 'might', 'must',
                   'shall', 'should', \
                   'will', 'would', 'do']

possessive_pronouns = ['my', 'your', 'their', 'his', 'her', 'hers', 'theirs']

pronouns = ['I', 'i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
            'yourself', 'you', \
            'your', 'yours', 'yourselves', 'he', 'him', 'his', 'himself', 'they', 'them', 'their', 'theirs',
            'themselves', 'she', \
            'her', 'hers', 'herself', 'it', 'its', 'itself', 'ye', 'thou', 'thee', 'thy', 'thine', 'thyself']

interjections = ['ah', 'aah', 'aha', 'ahem', 'ahh', 'argh', 'aw', 'bah', 'boo', 'brr', 'eek', 'eep', 'eh', 'eww', \
                 'gah', 'grr', 'hmm', 'huh', 'hurrah', 'meh', 'mhm', 'mm', 'muahaha', 'nah', 'nuh-uh', 'oh', 'ooh', \
                 'ooh-la-la', 'oomph', 'oops', 'ow', 'oy', 'oy', 'pff', 'phew', 'psst', 'sheesh', 'shh', 'tsk-tsk',
                 'uh-hu', \
                 'uh-uh', 'uh-oh', 'uhh', 'wee', 'whoa', 'wow', 'yeah', 'yahoo', 'yoo-hoo', 'yuh-uh', 'yuk', 'zing']

fillers = ["like", "y'know", "so", "actually", "literally", "basically", "right", "I'm tellin' ya", \
           "you know what I mean?", "ehm", "uh", "er"]

# danger: so,like,right!!

# Classifiers==#measure word="litre","cups","kernels","ears","bushels",

class_words = ['is an', 'is a', 'has type', 'is of type', 'has class', 'is of class', 'is instance of', 'is instance',
               'instance of']  # ...
subtype_words = ['inherits', 'inherits from', 'extends', 'is subtype of', 'is subtype', 'subtype of', 'is subclass of',
                 'is subclass', 'subclass of', 'has base class']

to_be_words = ['is', 'be', 'are', ':=', '=']
be_words = ['is', 'be', 'was', 'are', 'will be', 'were', 'have been', 'shall be', 'should be', ':=',
            '=', '==', 'equals', 'equal', \
            'is equal to', "consist of", "consists of", "is made up of", 'equal to', 'same', 'the same as', 'same as',
            'the same']
class_be_words = ['is an', 'is a', ]  # different!

# nicer, sweeter, ....
#  '=>' '<=', DANGER
# OR class_words
comparison_words = ['be', 'is of', 'is in', 'is a', 'is', \
                    'subset of', 'in', 'are', 'were', \
                    '>=', '==', '!=', '<=', '=<', '=', '>', '<', '≠', '≤', '≥', '~', '~=', '=~', '~~', 'gt', 'lt', 'eq', \
                    'identical to', 'smaller or equal', 'greater or equal', 'equal to', \
                    'bigger', 'greater', 'equals', 'smaller', 'less', 'more', 'the same as', \
                    'same as', 'similar', 'comes after', 'inherits from', 'implements' \
                                                                          'comes before', 'exact', 'exactly', '~>',
                    'at least', 'at most']

logic_operators = ["!", "&&", "&", "||", "|", "not", "and", "but", "or", "xor", "nor", "neither"]
math_operators = ["^", "^^", "**", "*", "/", "//", "+", "-", "%"]
english_operators = xlist(
	["power", "to the", "pow", "times", "divided by", "divide by", "plus", "minus", "add", "subtract", "mod",
	 "modulo", "print", ])
true_operators = math_operators + english_operators + logic_operators  # minus comparison_words
operators = math_operators + english_operators + comparison_words + logic_operators
# todo sorted by decreasing precedence
# DANGER! ambivalent!!   ,"and" 4 and 5 == TROUBLE!!! really? 4 and 5 == 9 ~= True OK lol
# just make sure that 4 and False = False  4 and True == True
# https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence


once_words = ['whenever', 'wherever', "as soon as", "once"]  # 'on the occasion that',

if_words = ['if']  # , 'in case that', 'provided that', 'assuming that', 'conceding that', 'granted that', \
# 'on the assumption that', 'supposing that', 'with the condition that']

#  NOT: '0','0.0','0,nix','zero',
nill_words = ['naught', 'nought', 'aught', 'oh', 'None', 'nil', 'nill', 'nul', 'nothing', 'not a thing', 'null',
              'undefined', \
              'zilch', 'nada', 'nuttin', 'nutting', 'zip', 'nix', 'cypher', 'cipher', 'leer', 'empty', 'nirvana',
              'void']  # 'love',

done_words = ['◊', 'Ω', ';;', '}', 'done', 'Ende', 'end', 'okay', 'ok', 'OK', 'O.K.', 'alright', 'alrighty',
              'that\'s it', 'thats it',
              "I'm done", "i'm done", \
              'fine', 'fi', 'fini', 'finish', 'fin', 'all set', 'finished', 'the end', 'over and out', 'over', 'q.e.d.',
              'qed', "<end>"]  # NL+ # NL verbium?]

false_words = ['false', 'FALSE', 'False', 'falsch', 'wrong', 'no', 'non', 'nix', 'nein', 'njet', 'niet']  # 'negative',

true_words = ['True', 'yes', 'ja', 'si']  # 'positive'

boolean_words = false_words + true_words

otherKeywords = ['and', 'as', 'assert', 'back', 'beginning', 'but', 'by', 'contain', 'contains', 'copy', 'def', 'div',
                 'does',
                 'eighth', 'else', \
                 'end', 'equal', 'equals', 'error', 'every', 'false', 'fifth', 'first', 'for', 'fourth', 'even',
                 'front', 'get', \
                 'given', 'global', 'if', 'ignoring', 'is', 'it', 'its', 'that', 'result', 'last', 'local', 'me',
                 'middle', 'mod', 'my', \
                 'ninth', 'not', 'sixth', 'some', 'tell', 'tenth', 'then', 'third', 'timeout', 'times', \
                 'transaction', 'True', 'try', 'where', 'whose', 'until', 'while', 'print', 'prop', 'property', 'put',
                 'ref',
                 'reference', \
                 'repeat', 'return', 'returning', 'script', 'second', 'set', 'seventh', 'otherwise']

const_words = ['constant', 'const', 'final', 'immutable', 'unchangeable']  # not: static

modifier_words = const_words + ['protected', 'private', 'public', 'static', 'void', 'default', 'initial', 'mut',
                                'mutable',
                                'variable', 'typed']
# ,'readable','read only','read-only','readonly','writable','write only','writeonly','changeable']

adverbs = ['often', 'never', 'joyfully', 'often', 'never', 'joyfully', 'quite', 'nearly', 'almost', 'definitely',
           'by any means', 'without a doubt']

let_words = ['let', 'set']  # ,'alias'

time_words = ['seconds', 'second', 'minutes', 'minute', 'a.m.', 'p.m.', 'pm', "o'clock", 'hours', 'hour']  # etc... !

event_kinds = ['in', 'at', 'every', 'from', 'between', 'after', 'before', 'until', 'till']

bla_words = ['tell me', 'hey', 'could you', 'give me', \
             'i would like to', 'can you', 'please', 'let us', "let's", 'can i', \
             'would you', 'i would', 'i ask you to', "i'd", \
             'love to', 'like to', 'i asked you to', 'could i', \
             'i tell you to', 'i told you to', 'come on', \
             'i wanna', 'i want to', 'i want', 'i need to', \
             'i need', 'either']
# either HAS MEANING! if x is either 3 or 4 != if x is 3 or 4 == if x is 3

attributes = ['sucks', 'default']

keywords = prepositions + modifier_words + be_words + comparison_words + fillers + nill_words + done_words + auxiliary_verbs + conjunctions + type_keywords + otherKeywords + numbers + operators

start_block_words = [';', ':', 'do', '{', 'begin', 'start', 'first you ', 'second you', 'then you', 'finally you']
#  with , then

flow_keywords = ['next', 'continue', 'break', 'stop']
eval_keywords = ['eval', 'what is', 'evaluate', 'how much', 'what are', 'calculate']
nonzero_keywords = ['nonzero', 'not null', 'defined', 'existing', 'existant', 'existent', 'available']
other_verbs = ['increase', 'decrease', 'square', 'invert', 'test']
special_verbs = ['evaluate', 'eval']
system_verbs = ['contains', 'contain'] + special_verbs + auxiliary_verbs
invoke_keywords = ['call', 'execute', 'run', 'start', 'evaluate', 'eval', 'invoke']  # not: go!
context_keywords = ['context', 'module', 'package']
self_modifying_operators = ['|=', '&=', '&&=', '||=', '+=', '-=', '/=', '^=', '%=', '#=', '*=', '**=', '<<', '>>']

newline_tokens = ["\n", "\r\n", ';', "\.\n", "\. "]

kast_operator_map = {
	# NOOO, astor can't handle kast:(
	"+": ast.Add(),
	"plus": ast.Add(),
	"add": ast.Add(),
	"-": ast.Sub(),
	"minus": ast.Sub(),
	"subtract": ast.Sub(),
	"*": ast.Mult(),
	"times": ast.Mult(),
	"mul": ast.Mult(),
	"multiplied": ast.Mult(),
	"multiplied with": ast.Mult(),
	"multiplied by": ast.Mult(),
	"multiply": ast.Mult(),
	"multiply with": ast.Mult(),
	"multiply by": ast.Mult(),
	"/": ast.Div(),
	"div": ast.Div(),
	"divided": ast.Div(),
	"divided with": ast.Div(),
	"divided by": ast.Div(),
	"divide": ast.Div(),
	"divide with": ast.Div(),
	"divide by": ast.Div(),
	"xor": ast.BitXor(),
	# "^": ast.BitXor(),
	"^": ast.Pow(),
	"^^": ast.Pow(),
	"**": ast.Pow(),
	"pow": ast.Pow(),
	"power": ast.Pow(),
	"to the": ast.Pow(),
	"to the power": ast.Pow(),
	"to the power of": ast.Pow(),
	"%": ast.Mod(),
	"mod": ast.Mod(),
	"modulo": ast.Mod(),
	"!": ast.Not(),
	"not": ast.Not(),
	"&": ast.And(),  # BitAnd ENGLISH: a & b ~== a and b
	"&&": ast.And(),
	"and": ast.And(),
	"|": ast.BitOr(),
	"||": ast.Or(),
	"or": ast.Or(),
	"does not equal": ast.NotEq(),
	"doesn't equal": ast.NotEq(),
	"not equal": ast.NotEq(),
	"is not": ast.NotEq(),
	"isn't": ast.NotEq(),
	"isnt": ast.NotEq(),
	"!=": ast.NotEq(),
	"≠": ast.NotEq(),
	"=": ast.Eq(),
	"==": ast.Eq(),
	"===": ast.Eq(),
	"~=": ast.Eq(),
	"is": ast.Eq(),
	"eq": ast.Eq(),
	"equal": ast.Eq(),
	"is equal": ast.Eq(),
	"equal to": ast.Eq(),
	"is equal to": ast.Eq(),
	"equals": ast.Eq(),
	"same": ast.Eq(),
	"same as": ast.Eq(),  # is the same as ... rely on compariton!!
	"identical": ast.Eq(),  # is identical to ... rely on compariton!!
	">": ast.Gt(),
	"bigger": ast.Gt(),
	"bigger than": ast.Gt(),
	"more": ast.Gt(),
	"more than": ast.Gt(),
	"greater": ast.Gt(),
	"greater than": ast.Gt(),
	">=": ast.GtE(),
	"bigger or equal": ast.GtE(),
	"more or equal": ast.GtE(),
	"greater or equal": ast.GtE(),
	"<": ast.Lt(),
	"less": ast.Lt(),
	"less than": ast.Lt(),
	"smaller": ast.Lt(),
	"smaller than": ast.Lt(),
	"<=": ast.Lt(),
	"less or equal": ast.Lt(),
	"less than or equal": ast.Lt(),
	"smaller or equal": ast.Lt(),
	"smaller than or equal": ast.Lt(),
}

kast_operator_map_min = {
	"+": ast.Add(),
	"-": ast.Sub(),
	"*": ast.Mult(),
	"/": ast.Div(),
	"xor": ast.BitXor(),
	# "^": ast.BitXor(),
	"^": ast.Pow(),
	"^^": ast.Pow(),
	"**": ast.Pow(),
	"pow": ast.Pow(),
	"power": ast.Pow(),
	"to the": ast.Pow(),
	"to the power": ast.Pow(),
	"to the power of": ast.Pow(),
	"%": ast.Mod(),
	"mod": ast.Mod(),
	"modulo": ast.Mod(),
	"!": ast.Not(),
	"not": ast.Not(),
	"&": ast.And(),  # BitAnd ENGLISH: a & b ~== a and b
	"&&": ast.And(),
	"and": ast.And(),
	"|": ast.BitOr(),
	"||": ast.Or(),
	"or": ast.Or(),
	"!=": ast.NotEq(),
	"≠": ast.NotEq(),
	"is": ast.Eq(),
	"=": ast.Eq(),
	"==": ast.Eq(),
	"===": ast.Eq(),
	"~=": ast.Eq(),
	"is": ast.Eq(),
	"eq": ast.Eq(),
	">": ast.Gt(),
	">=": ast.GtE(),
	"<": ast.Lt(),
	"<=": ast.Lt(),
	"in": ast.In(),
	"contains": ast.In(),  # ^-1
	"element of": ast.In(),
}
# safe_reductions={
# 'is bigger', 'is greater','is less','is smaller','is equal','are smaller','are bigger',
# }
#  only in the position of operators!! BUT HOW AFTER TOKENIZATION!?
reductions = {
	" div": '/',
	" divided": '/',
	" divided with": '/',
	" divided by": '/',
	" divide": '/',
	" divide with": '/',
	" divide by": '/',
	" times ": '*',
	" mul ": '*',
	" multiplied ": '*',
	" multiplied with ": '*',
	" multiplied by ": '*',
	" multiply ": '*',
	" multiply with ": '*',
	" multiply by ": '*',
	" plus ": '+',
	" add ": '+',
	" minus ": '-',
	" subtract ": '-',
	" substract ": '-',
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
	"isnt": "!=",
}
