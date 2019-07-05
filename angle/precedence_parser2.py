from collections import namedtuple

from english_tokens import operators
from power_parser import parse_tokens
from english_parser import quick_expression
from english_parser import set_token
from english_parser import maybe
import context as the
import re
# https://eli.thegreenplace.net/2012/08/02/parsing-expressions-by-precedence-climbing
# precedence climbing and TDOP are pretty much the same algorithm, formulated a bit differently. I tend to agree, and also note that Shunting Yard is again the same algorithm, except that the explicit recursion is replaced by a stack.

def parse_error(param):
  raise Exception(param)

from enum import Enum #py 3.7
# class TokenTypes(Enum):
LEFTPAREN = 'LEFTPAREN'
RIGHTPAREN = 'RIGHTPAREN'
QUOTE = 'QUOTE'
LEFTQUOTE = 'LEFTQUOTE'
RIGHTQUOTE= 'RIGHTQUOTE'
NUMBER = 'NUMBER'
BINOP = 'BINOP'
def compute_atom(tokenizer):
  tok = tokenizer.cur_token
  if tok.name == LEFTPAREN:
    tokenizer.get_next_token()
    val = compute_expr(tokenizer, 1)
    if tokenizer.cur_token.name != RIGHTPAREN:
      parse_error('unmatched "("')
    tokenizer.get_next_token()
    return val
  elif tok is None:
    parse_error('source ended unexpectedly')
  elif tok.name == BINOP:
    parse_error('expected an atom, not an operator "%s"' % tok.value)
  else:
    assert tok.name == NUMBER
    tokenizer.get_next_token()
    return int(tok.value)


LEFT='LEFT'  # associativity
RIGHT='RIGHT'# associativity

# For each operator, a (precedence, associativity) pair.
OpInfo = namedtuple('OpInfo', 'prec assoc')

OPINFO_MAP = {
    '+':    OpInfo(1, LEFT),
    '-':    OpInfo(1, LEFT),
    '*':    OpInfo(2, LEFT),
    '/':    OpInfo(2, LEFT),
    '^':    OpInfo(3, RIGHT),
}


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
        if cur.name != BINOP:
          break
        value__prec = OPINFO_MAP[cur.value].prec
        if value__prec < min_prec:
          break

        # Inside this loop the current token is a binary operator
        assert cur.name == BINOP

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


Tok = namedtuple('Tok', 'name value')


class Tokenizer(object):
    """ Simple tokenizer object. The cur_token attribute holds the current
        token (Tok). Call get_next_token() to advance to the
        next token. cur_token is None before the first token is
        taken and after the source ends.
    """
    TOKPATTERN = re.compile("\s*(?:(\d+)|(.))")

    def __init__(self, source):
        self._tokgen = self._gen_tokens(source)
        self.cur_token = None

    def get_next_token(self):
        """ Advance to the next token, and return it.
        """
        try:
            # self.cur_token = self._tokgen.next() # FUCK PY3
            self.cur_token = next(self._tokgen)
        except StopIteration:
            self.cur_token = None
        return self.cur_token

    def _gen_tokens(self, source):
        for number, operator in self.TOKPATTERN.findall(source):
            if number: yield Tok(NUMBER, number)
            elif operator == '(': yield Tok(LEFTPAREN, '(')
            elif operator == ')':yield Tok(RIGHTPAREN, ')')
            elif operator == '{':yield Tok(LEFTPAREN, '{')
            elif operator == '}':yield Tok(RIGHTPAREN, '}')
            elif operator == '[':yield Tok(LEFTPAREN, '[')
            elif operator == ']':yield Tok(RIGHTPAREN, ']')
            elif operator == "'":yield Tok(QUOTE, "'")
            elif operator == '"':yield Tok(QUOTE, '"')
            elif operator == '`':yield Tok(QUOTE, '`')
            elif operator == '‘':yield Tok(LEFTQUOTE, '‘')
            elif operator == '’':yield Tok(RIGHTQUOTE, '’')
            elif operator == '“':yield Tok(LEFTQUOTE, '“')
            elif operator == '”':yield Tok(RIGHTQUOTE, '”')
            elif operator == '«':yield Tok(LEFTQUOTE, '«')
            elif operator == '»':yield Tok(RIGHTQUOTE, '»')
            else: yield Tok(BINOP, operator)

if __name__ == '__main__':
  tokenizer=Tokenizer("3+((3+[1+1]))*3+1")
  tokenizer.get_next_token()
  expr = compute_expr(tokenizer,0)
  print(expr)
