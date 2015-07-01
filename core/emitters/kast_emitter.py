import ast
# import kast
# import kast.kast
from kast import kast #grrr
import power_parser

__author__ = 'me'

# see resolve eval_maybe(the.string)??
def wrap_value(val):
    t=type(val)
    if isinstance(val,str):return kast.Str(val)
    if isinstance(val,int):return kast.Num(val)
    if isinstance(val,float):return kast.Num(val)
    if val==None:return kast.none
    raise Exception("UNKNOWN TYPE %s : %s !"%(val,t))

