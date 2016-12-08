import _ast
from _ast import *

# DO NOT INCLUDE IN PYC_EMITTER!!!
#  otherwise the visual AST output will not be correct

BinOp.__repr__=lambda self: "%s %s %s " % (self.left,self.op,self.right)
Compare.__repr__ = lambda self: "%s %s %s " % (self.left, self.ops, self.comparators)
operator.__repr__ = lambda self: self.__class__.__name__
# operator.__repr__ = lambda self: self.name
Num.__repr__ = lambda self: "%d" % (self.n)
Eq.__repr__ = lambda self: "=="  # lambda self:self.num
Assert.__repr__ = lambda self: self.msg
