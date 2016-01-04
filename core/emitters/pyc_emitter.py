import ast
import sys

import __builtin__

import angle
import english_parser
from kast.kast import Print,setter
from kast import kast
import nodes
import the

class Reflector(object): # Implements list interface is
    def __getitem__(self, name):
        if name=="__tracebackhide__":
            return False # for py.test
        print("Reflector __getitem__ %s" % str(name))
        if name in the.params:
            the.result= english_parser.do_evaluate(the.params[name])
        elif name in the.variables:
            the.result= english_parser.do_evaluate(the.variables[name].value)
        elif name in the.methods:
            return the.methods[name]
        elif name in locals():
            return locals()[name]
        elif name in globals():
            return globals()[name]
        elif __builtin__.hasattr(__builtin__,name): # name in __builtin__:
            return __builtin__.getattr(__builtin__,name)
        else:
            print("UNKNOWN ITEM %s" % name)
            return name# kast.name(name)
            # raise Exception("UNKNOWN ITEM %s" % name)
        return the.result

    def __setitem__(self, key, value):
        import the
        print("Reflector __setitem__ %s %s" % (key, value))
        if key in the.variables:
            the.variables[key].value = value
        else:
            the.variables[key] = nodes.Variable(name=key, value=value)
        the.variableValues[key] = value
        the.result = value



class PrepareTreeVisitor(ast.NodeTransformer):
    def generic_visit(self, node):
        self.parent=node
        if not isinstance(node,ast.AST):
            return node
        for field, old_value in ast.iter_fields(node):
            old_value = getattr(node, field, None)
            if isinstance(old_value, list):
                new_values = []
                for value in old_value:
                    value = self.visit(value)
                    if value is None:
                        continue
                    elif not isinstance(value, ast.AST):
                        # new_values.extend(value)
                        new_values.append(value)
                        continue
                    new_values.append(value)
                old_value[:] = new_values
                setattr(node, field, old_value)
            else:
                new_node = self.visit(old_value)
                # if new_node is None: new_node is Delete  no, keep starargs=None etc!
                # if new_node is Delete
                #     delattr(node, field)
                # else:
                if new_node is not None:
                    setattr(node, field, new_node)
        return node

        # emitters.kast_emitter.wrap_value(val)
    def visit_list(self, x): # conflict: if isinstance(old_value, list): wrap before!
        return ast.List(x,ast.Load())
        # return kast.List(map(wrap_value,val),ast.Load())
    def visit_float(self, x):
        return ast.Num(x)
    def visit_Name(self, x):
        return x # and done!
    # def visit_Print(self, x):
    #     return ast.Expr(x)
    def visit_BinOp(self, node):
        if not isinstance(self.parent,ast.Expr):
            return ast.Expr(value=self.generic_visit(node)) #
        else: return node
    def visit_Str(self, x):
        return x # against:
    def visit_str(self, x):
        if isinstance(self.parent,ast.Str):
            return x
        if isinstance(self.parent,ast.FunctionDef):
            return x
        return ast.Str(x)
    def visit_int(self, x):
        return ast.Num(x)
    def visit_Pass(self, x):
        return ast.Expr(x)
    def visit_Variable(self, x):
        return ast.Name(x.name,ast.Load())
    def visit_Function(self,x):
        x.args=ast.arguments(args=[], vararg=None, kwarg=None, defaults=[])
        x.decorator_list=x.decorators or [] # for now!!
        # x.name=ast.Name(id=x.name)
        return self.generic_visit(x)
        # return x
    def visit_Argument(self, x):
        if isinstance(x.value, nodes.Variable):
            return self.visit_Variable(x)
        return self.generic_visit(x.value)
        # x.ctx=ast.Load()
        # return x
        # def generic_visit(self, node):
    def visit_FunctionCall(self, node):
        skip_assign=True
        if skip_assign:
            return node.value #skip_assign
        else: return node


def print_ast(my_ast):
    try:
        x=ast.dump(my_ast, annotate_fields=True, include_attributes=True)
        print(x)
        print("")
    except: pass
    try:
        x=ast.dump(my_ast, annotate_fields=False, include_attributes=False)
        print(x)
        print("")
    except: pass

def run_ast(my_ast,source_file="(String)"):
        code = compile(my_ast, source_file, 'exec')
        # TypeError: required field "lineno" missing from expr NONO,
        # this as a documentation bug, this error can mean >>anything<< except missing line number!!! :) :( :( :(
        # eval can't handle arbitrary python code (eval("import math") ), and
        # exec() doesn't return the results.
        ret = eval(code, the.params, Reflector())
        # ret = eval(code, the.params)
        ret = ret or the.result
        print("GOT RESULT %s" % ret)
        return ret

# Module(body=[Expr(value=Num(n=1, lineno=1, col_offset=0), lineno=1, col_offset=0)])
# Module([Expr(Num(1))])
def eval_ast(my_ast, args={}, source_file='file',target_file=None):
    import codegen
    import ast
    import the

    try:  # todo args =-> SETTERS!
        # context_variables=variableValues.copy()+globals()+locals()
        the.params = the.variableValues.copy()
        the.params.update(args)
        # context_variables.update(globals())
        # context_variables.update(locals())

        # gotta wrap: 1 => Module(body=[Expr(value=[Num(n=1)])])
        if not type(my_ast) == ast.Module:
            # my_ast = flatten(my_ast)
            if not isinstance(my_ast,list):
                my_ast=[my_ast]
            def wrap_stmt(s):
                if not isinstance(s,ast.stmt) and not isinstance(s,ast.Expr):
                    return ast.Expr(s)
                else: return s
            # my_ast = map(wrap_stmt,my_ast)
            my_ast = ast.Module(body=my_ast)
        PrepareTreeVisitor().visit(my_ast)
        my_ast.body[-1]= setter("__result__",my_ast.body[-1])
        # my_ast.body.append(Print(dest=None, values=[name("__result__")], nl=True)) # call symbolically!

        print(my_ast.body)
        source = codegen.to_source(my_ast)
        print(source)  # => CODE
        my_ast = ast.fix_missing_locations(my_ast)
        print_ast(my_ast)
        code = compile(my_ast, source_file, 'exec')
        # TypeError: required field "lineno" missing from expr NONO,
        # this as a documentation bug,
        # this error can mean >>anything<< except missing line number!!! :) :( :( :(

        # code=compile(my_ast, 'file', 'exec')
        # eval can't handle arbitrary python code (eval("import math") ), and
        # exec() doesn't return the results.
        if target_file:
            import ast_export
            ast_export.emit_pyc(code,target_file)
        if angle.use_tree:
            the.result=my_ast
            return my_ast# code #  Don't evaluate here

        ret = eval(code, the.params, Reflector())
        ret = ret or the.result
        print("GOT RESULT %s" % ret)
        # err= sys.stdout.getvalue()
        # if err: raise err
        # z=exec (code)
        the.params.clear()
        return ret
    except Exception as e:
        print(my_ast)
        info_ = sys.exc_info()[2]
        try:
            print_ast(my_ast)
        except:
            print("CAN'T DUMP ast %s",my_ast)
            pass
        raise e, None, info_
