from collections import namedtuple

from english_tokens import operators
from power_parser import parse_tokens
from english_parser import quick_expression
from english_parser import set_token
from english_parser import maybe
import context as the

# https://eli.thegreenplace.net/2012/08/02/parsing-expressions-by-precedence-climbing
# precedence climbing and TDOP are pretty much the same algorithm, formulated a bit differently. I tend to agree, and also note that Shunting Yard is again the same algorithm, except that the explicit recursion is replaced by a stack.

def Node():
  def __init__(self, *args, **kwargs):
    self.name = args['name'] if 'name' in args else None
    self.token = None
    self.parent = None
    # self.next=None
    # self.prev=None
    self.next_token = None
    self.prev_token = None

    self.next_node = None
    self.prev_node = None

    self.left = None
    self.right = None

    self.value = None  # func params block params=args,return
    # super(CLASS_NAME, self).__init__(*args, **kwargs)


def build_token_map(nodes):
  token_map = {}
  # for token in tokens:
  for node in nodes:
    token = node.token.name
    if token in token_map:
      liste = token_map[token]
    else:
      liste = []
    liste += [node]
    token_map[token] = liste
  return token_map


def apply(op, token_tree, token_list_,token_map):
  occurences = token_map[op]
  node: Node
  for node in occurences:
    # if (node.name in the.token_map): MUST BE by construction
      offset=node.token[5]
      # node.left=node_list[:offset]
      # node.right=node_list[offset:]
      handler = the.token_map[node.name]
      set_token(node.token)
      result = maybe(handler)
      if result: node.value=result
      # else: node.value=node_list[node.right:node:left]

    quick_expression


def parse_error(param):
  raise Exception(param)


def prepare_token_tree(tokenlist):
  nodelist = []
  root = Node(name='root')
  prev_token = None
  prev_node = None
  for token in tokenlist:
    current = Node(token=token, parent=root, prev_token=prev_token, prev_node=prev_node)
    if prev_node:
      prev_node.next_node = current
      prev_node.next_token = token
    prev_node = current
    prev_token = token
    nodelist += [current]
    if not root.right: root.right = current
  # root.content=nodelist
  root.value = nodelist
  token_tree = root
  return token_tree

def compute_atom(tokenizer):
  tok = tokenizer.cur_token
  if tok.name == 'LEFTPAREN':
    tokenizer.get_next_token()
    val = compute_expr(tokenizer, 1)
    if tokenizer.cur_token.name != 'RIGHTPAREN':
      parse_error('unmatched "("')
    tokenizer.get_next_token()
    return val
  elif tok is None:
    parse_error('source ended unexpectedly')
  elif tok.name == 'BINOP':
    parse_error('expected an atom, not an operator "%s"' % tok.value)
  else:
    assert tok.name == 'NUMBER'
    tokenizer.get_next_token()
    return int(tok.value)


LEFT='LEFT'  # associativity
RIGHT='RIGHT'# associativity

# For each operator, a (precedence, associativity) pair.
OpInfo = namedtuple('OpInfo', 'prec assoc')

OPINFO_MAP = {
    '+':    OpInfo(1, 'LEFT'),
    '-':    OpInfo(1, 'LEFT'),
    '*':    OpInfo(2, 'LEFT'),
    '/':    OpInfo(2, 'LEFT'),
    '^':    OpInfo(3, 'RIGHT'),
}
#
#
# # For each operator, a (precedence, associativity) pair.
# OPINFO_MAP = {
#     '+':    (1, LEFT),
#     '-':    (1, LEFT),
#     '*':    (2, LEFT),
#     '/':    (2, LEFT),
#     '^':    (3, RIGHT),
# }


def compute_op(op, lhs, rhs):
  lhs = int(lhs);
  rhs = int(rhs)
  if op == '+':
    return lhs + rhs
  elif op == '-':
    return lhs - rhs
  elif op == '*':
    return lhs * rhs
  elif op == '/':
    return lhs / rhs
  elif op == '^':
    return lhs ** rhs
  else:
    parse_error('unknown operator "%s"' % op)


def compute_expr(tokenizer, min_prec):
    atom_lhs = compute_atom(tokenizer)

    while True:
        cur = tokenizer.cur_token
        if cur is None:
          break
        if cur.name != 'BINOP':
          break
        value__prec = OPINFO_MAP[cur.value].prec
        if value__prec < min_prec:
          break

        # Inside this loop the current token is a binary operator
        assert cur.name == 'BINOP'

        # Get the operator's precedence and associativity, and compute a
        # minimal precedence for the recursive call
        op = cur.value
        prec, assoc = OPINFO_MAP[op]
        next_min_prec = prec + 1 if assoc == LEFT else prec

        # Consume the current token and prepare the next one for the
        # recursive call
        tokenizer.get_next_token()
        atom_rhs = compute_expr(tokenizer, next_min_prec)

        # Update lhs with the new value
        atom_lhs = compute_op(op, atom_lhs, atom_rhs)

    return atom_lhs

def parse(code):
  operators_and_functions = operators + ["yo"]
  tokenlist = parse_tokens(code)
  # atoms = parse_atoms(tokenlist)#are either numbers or parenthesized expressions
  nodelist = prepare_token_tree(tokenlist).value
  token_map = build_token_map(nodelist)
  for op in operators_and_functions:
    if op in token_map:
      token_tree = apply(op, token_tree, token_map)


if __name__ == '__main__':
  parse("if 1 > 0 \n if yo hu and add 12 to ( 1 / 2 ) then go '")
