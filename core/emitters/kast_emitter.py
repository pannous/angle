import ast
# import kast
# import kast.kast
from kast import kast #grrr
import power_parser

__author__ = 'me'

# see resolve eval_maybe(the.string)??
def wrap_value(val):
    if val==None:return kast.none
    if isinstance(val,ast.AST):return val
    if isinstance(val,str):return kast.Str(val)
    if isinstance(val,int):return kast.Num(val)
    if isinstance(val,float):return kast.Num(val)
    if isinstance(val,list):return kast.List(map(wrap_value,val),ast.Load())
    t=type(val)
    raise Exception("UNKNOWN TYPE %s : %s !"%(val,t))
