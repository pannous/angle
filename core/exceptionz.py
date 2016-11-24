# encoding: utf-8

# ImportError: cannot import name a_class
# AttributeError: 'module' object has no attribute
# I have also seen this error when inadvertently naming a module with the same name as one of the standard Python modules.
# YEP: exceptionz works!!!

# import minitest
  # DONT ROLLBACK StandardError
  # DO ROLLBACK all NotMatching
global NotMatching
global DidYouMean
# global GivingUp

#if py3
class StandardError(Exception):
    pass



class InternalError(StandardError):
    pass

class NoMethodError(StandardError):
    pass

class InternalError(StandardError):
    pass

class NotMatching(StandardError):
    pass

class UndeclaredVariable(StandardError):
    pass

class DidYouMean(StandardError):
    pass

class UnknownCommandError(StandardError):
    pass

class SecurityError(StandardError):
    pass

# NotPassing = Class.new StandardError
class NotPassing(StandardError):
    pass

class NoResult(NotMatching):
    pass

class EndOfDocument(StandardError):
    pass

class EndOfLine(NotMatching):
    pass

class MaxRecursionReached(StandardError):
    pass

class EndOfBlock(NotMatching):
    pass

class GivingUp(StandardError):
    pass

class ShouldNotMatchKeyword(NotMatching):
    pass

class KeywordNotExpected(NotMatching):
    pass

class UndefinedRubyMethod(NotMatching):
    pass

class EndOfStatement(NotMatching):
    pass

class MustNotMatchKeyword(NotMatching):
    pass


class MethodMissingError(StandardError):
    pass

class WrongType(StandardError):
    pass

class ImmutableVaribale(StandardError):
    pass

class SystemStackError(StandardError):
    pass


class IgnoreException(Exception):
  pass

try:
    class Error(Exception):
        pass
except:
    pass


