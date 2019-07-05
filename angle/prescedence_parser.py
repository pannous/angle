from english_tokens import operators
from power_parser import parse_tokens
from english_parser import quick_expression
import context as the

def node():
  def __init__(self, *args, **kwargs):

    self.name=args['name'] if 'name' in args else None
    self.token=None

    self.parent=None

    # self.next=None
    # self.prev=None

    self.next_token=None
    self.prev_token=None

    self.next_node=None
    self.prev_node=None

    self.left=None
    self.right=None

    self.value=None # func params block params=args,return
    # super(CLASS_NAME, self).__init__(*args, **kwargs)




def build_token_map(nodes):
  token_map={}
  # for token in tokens:
  for node in nodes:
    token=node.token.name
    if token in token_map:
      list= token_map[token]
    else:
      list=[]
    list+=[node]
    token_map[token]=list
  return token_map


def apply(op, token_tree,token_map):
  occurences=token_map[op]
  for node in occurences:
    if(node.name in the.token_map):
      handler=the.token_map[node.name]
      set_pointer(node.token)
      result=handler()



    quick_expression



def prepare_token_tree(tokenlist):
  nodelist=[]
  root = node(name='root')
  prev_token = None
  prev_node = None
  for token in tokenlist:
    current = node(token=token,parent=root, prev_token=prev_token,prev_node=prev_node)
    if prev_node:
      prev_node.next_node=current
      prev_node.next_token = token
    prev_node=current
    prev_token=token
    nodelist+=[current]
    if not root.right: root.right= current
  # root.content=nodelist
  root.value=nodelist
  token_tree=root
  return token_tree


def parse(code):
  operators_and_functions = operators+["yo"]
  tokenlist=parse_tokens(code)
  nodelist=prepare_token_tree(tokenlist).value
  token_map=build_token_map(nodelist)
  for op in operators_and_functions:
    if op in token_map:
      token_tree=apply(op,token_tree,token_map)

if __name__ == '__main__':
    parse("if 1 > 0 \n if yo hu and add 12 to ( 1 / 2 ) then go '")