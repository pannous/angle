import _ast
from _ast import *

# DO NOT INCLUDE IN PYC_EMITTER!!!
#  otherwise the visual AST output will not be correct

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
