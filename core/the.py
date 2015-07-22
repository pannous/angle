#GLOBAL NAMESPACE FOR ANGLE / ENGLISH SCRIPT PARSER RUNTIME

extensionMap ={} # str->xstr
import extensions

global string, last_node, current_value, nodes, depth,rollback_depths,OK
global _verbose,use_wordnet,result,last_result
global tokenstream,current_token,current_type,current_word,current_line
global in_condition,in_pipe,in_args,extensions,line_number
_verbose =  True # False angel.verbose() and not angel.raking()  # false
testing = False
very_verbose = _verbose
current_expression=None
use_tree=False
use_wordnet=False
in_pipe=False
in_condition=False
in_args = False
interpret=True #False
did_interpret = False
javascript = ''
context = ''
variables = {}
variableTypes = {}
variableValues = {}  # ={nill: None)
params = {} # Temporary parameters in calling context, Delete them after return

string=""
tokenstream=[] # tuple:
token_map={} # directly map tokens to their functions
token_number=0
current_type=0
current_offset=0
current_word=''
previous_word=''
current_line=''
current_token=None

lines = []
original_string = ""  # for string_pointer ONLY!!
string = ""
line_number = 0
last_pattern = None
emit=False
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
in_params=0
depth=0
current_node=None
current_value=None
parser=globals()
context=None
def is_number(s):            #isint isnum
    return isinstance(s,int) or isinstance(s,float) or isinstance(s,str) and s.isdigit() # is number isnumeric
debug=False # True

svg = []


def parent_node():
    return None

# print_function
core_methods = ['show', 'now', 'yesterday', 'help']  # maybe(difference)
# SEE typeNameMapped!
methods = {
    'length': len,
    'size': len,
    'count': len,
    'beep': extensions.beep,
    'puts':extensions.puts,
    'p':extensions.puts,
    'print':extensions.puts,
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

in_hash=False
