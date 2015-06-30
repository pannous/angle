import ast
import kast
import kast.kast
import power_parser

__author__ = 'me'

# see resolve eval_maybe(the.string)??
def wrap_value(val):
    t=type(val)
    if isinstance(val,str):return ast.Str(val)
    if isinstance(val,int):return ast.Num(val)
    if isinstance(val,float):return ast.Num(val)
    raise Exception("UNKNOWN TYPE %s : %s !"%(val,t))

