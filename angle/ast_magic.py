import _ast
# from _ast import *
import sys

from extensions import xstr, xint, xfloat

sys.path.append( "..") # for cast
import kast
from kast import kast
from kast.kast import *  # someone hates python3 imports

# DO NOT INCLUDE IN PYC_EMITTER!!!
#  otherwise the visual AST output will not be correct


# Python 3.4 introduced a new node of type NameConstant for True,False & None.
none = name("None")
nil = name("None")
null = name("None")
false = name("False")
true = name("True")
Self = name('self')
zero = Num(0)

BinOp.__repr__ = lambda self: "%s %s %s " % (self.left, self.op, self.right)
Compare.__repr__ = lambda self: "%s %s %s " % (self.left, self.ops, self.comparators)
operator.__repr__ = lambda self: self.__class__.__name__
# operator.__repr__ = lambda self: self.name
Num.__repr__ = lambda self: "%d" % (self.n)
# Num.__eq__ = lambda self,other: if other is Num: "%d" % (self.n)
Eq.__repr__ = lambda self: "=="  # lambda self:self.num
Assert.__repr__ = lambda self: self.msg


def comp_str(self, other):
  if isinstance(other, Str):
    return self.s == other.s
  else:
    return self.s == other


Str.__eq__ = comp_str


def wrap_value(val, ctx=_ast.Load()):
  if not val:
    return kast.none
  import nodes
  if isinstance(val, nodes.Argument):
    if val.name:
      return ast.Name(id=str(val.name), ctx=ctx)  # if FunctionCall
    # return ast.Name(id=val.name, ctx=_ast.Param()) # if FunctionDef
    else:
      return wrap_value(val.value)
  if isinstance(val, ast.AST): return val
  if isinstance(val, xstr): return kast.Str(str(val))
  if isinstance(val, xint): return kast.Num(int(val))
  if isinstance(val, xfloat): return kast.Num(float(val))
  if isinstance(val, str): return kast.Str(val)
  if isinstance(val, int): return kast.Num(val)
  if isinstance(val, float): return kast.Num(val)
  if isinstance(val, tuple): return kast.Tuple(list(map(wrap_value, val)), ast.Load())
  if isinstance(val, list): return kast.List(list(map(wrap_value, val)), ast.Load())
  if isinstance(val, dict): return kast.Dict(list(map(wrap_value, val)), ast.Load())
  t = type(val)
  raise Exception("UNKNOWN TYPE %s : %s !" % (val, t))


# NEED TO HACK op_util how??
def get_op_precedence(obj, precedence_data, type=type):
  typo = type(obj)
  if typo in precedence_data:
    return precedence_data[typo]
  elif type in precedence_data:
    return precedence_data[type]
  else:
    for base in typo.__bases__:
      if base in precedence_data:
        return precedence_data[base]
  raise Exception("get_op_precedence WRONG TYPE " + typo)



# FIX for unhelpful astor codegen
def precedence_setter2(AST=ast.AST, get_op_precedence=get_op_precedence,
                      isinstance=isinstance, list=list):
    """ This only uses a closure for performance reasons,
        to reduce the number of attribute lookups.  (set_precedence
        is called a lot of times.)
    """

    def set_precedence(value, *nodes):
        """Set the precedence (of the parent) into the children.
        """
        if isinstance(value, AST):
            value = get_op_precedence(value)
        for node in nodes:
            if isinstance(node, AST):
                node._pp = value
            elif isinstance(node, list):
                set_precedence(value, *node)
            else:
                if not node is None:
                    print("Only AST, list and None allowed as visitor return types")
                    print("But %s was given"%node)
                assert node is None, node

    return set_precedence


# set_precedence = precedence_setter2()