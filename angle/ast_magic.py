import _ast
# from _ast import *
import kast
from kast import kast
from kast.kast import * #someone hates python3 imports

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

BinOp.__repr__=lambda self: "%s %s %s " % (self.left,self.op,self.right)
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
			return ast.Name(id=val.name, ctx=ctx)  # if FunctionCall
		# return ast.Name(id=val.name, ctx=_ast.Param()) # if FunctionDef
		else:
			return wrap_value(val.value)
	if isinstance(val, ast.AST): return val
	if isinstance(val, str): return kast.Str(val)
	if isinstance(val, int): return kast.Num(val)
	if isinstance(val, float): return kast.Num(val)
	if isinstance(val, tuple): return kast.Tuple(list(map(wrap_value, val)), ast.Load())
	if isinstance(val, list): return kast.List(list(map(wrap_value, val)), ast.Load())
	if isinstance(val, dict): return kast.Dict(list(map(wrap_value, val)), ast.Load())
	t = type(val)
	raise Exception("UNKNOWN TYPE %s : %s !" % (val, t))

