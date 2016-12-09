#GLOBAL NAMESPACE FOR ANGLE / ENGLISH SCRIPT PARSER RUNTIME
import extensions
home="."
extensionMap ={} # str->xstr
# import extensions

global string, last_node, current_value, nodes, depth,rollback_depths,OK
global _verbose,use_wordnet,result,last_result
global tokenstream,current_token,current_type,current_word,current_line
global in_condition,in_pipe,in_args,line_number, in_list

_verbose = False# True # False angel.verbose() and not angel.raking()  # false
_debug = False
testing = False
very_verbose = _verbose
current_expression=None
use_tree=False
use_wordnet=False

# state!
in_pipe=False
in_condition=False
in_args = False
in_hash=False
in_list=False
in_params=False
in_algebra=False

interpret=True #False
did_interpret = False

javascript = ''
variables = {}
variableTypes = {}
variableValues = {}  # ={nill: None)
params = {} # Temporary parameters in calling context, Delete them after return
threads = {} # todo : also compiled

string=""
tokenstream=[] # tuple:
tokens_len=0 # len(tokenstream)
token_map={} # directly map tokens to their functions
method_token_map={} # directly map tokens to functions
token_number=0
current_type=0
current_offset=0
current_word=''
previous_word=''
current_line=''
current_token=None
current_file='(String)'

lines = []
original_string = ""  # for string_pointer ONLY!!
string = ""
line_number = 0
last_pattern = None
moduleNames=[]
moduleClasses={} # reuse module->Classes  class->modules !
moduleMethods={}
methodToModulesMap={}
method_names=[]

OK = 'OK'
# result = ''
result=None
last_result=None
listeners = []
# nodes = []

rollback = []
tree = []
interpret_border = -1
no_rollback_depth = -1
rollback_depths = []
max_depth = 160  # world this method here to resolve the string
negated=False
depth=0
current_node=None
current_value=None
needs_extensions=False # until ...
parser=globals()
def is_number(s):            #isint isnum
    return isinstance(s,int) or isinstance(s,float) or is_string(s) and s.isdigit() # is number isnumeric

svg = []


def parent_node():
    return None

# print_function
core_methods = ['show', 'now', 'yesterday', 'help','print']  # maybe(difference)
# SEE typeNameMapped!
methods = {
    'p':extensions.puts,
    'print':extensions.puts,
    'length': len,
    'size': len,
    'count': len,
    'beep': extensions.beep,
    'puts':extensions.puts,
    'printf':extensions.puts, #todo
    'show':extensions.puts,
    'increase':extensions.increase
    # 'reverse':extensions.xstr.reverse
}  # name->method-node

#add later!
classes = {
  # 'Math': extensions.Math,
  # 'list': extensions.xlist,
  # 'int':extensions.xint,
  # 'integer':extensions.xint
}
c_methods = ['printf']
builtin_methods = ['puts', 'print']  # "puts"=>x_puts !!!
# bash_methods=["say"]
nouns=['window','bug']
adjectives=['funny', 'big', 'small', 'good', 'bad']
verbs=['be', 'have', 'do', 'get', 'make', 'want', 'try', 'buy', 'take', 'apply', 'make', 'get', 'eat', 'drink',
               'go', 'know', 'take', 'see', 'come', 'think', 'look', 'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel',
               'leave', 'call', 'integrate', 'print', 'eat', 'test','say']


emit=False

version="0.6.4"


global starttokens_done
starttokens_done=False
