import _ast
import ast

import emitters.pyc_emitter
import kast.kast
import the
from kast import kast
from the import *
import sys #

# if angle.use_tree:
#         c=ast.Compare(left=Num(n=3, lineno=1, col_offset=3), ops=[Gt()], comparators=[
class Condition(ast.Compare):#todo: BinOp ?
    def __init__(self, *args, **kwargs): #ruby : initialize
        super(Condition, self).__init__(*args, **kwargs)
        self.left = kwargs['left']
        self.comp= kwargs['comp']
        self.right = kwargs['right']
        self.left=self.left
        self.ops=[self.comp]
        self.comparators=[self.right]
    def __repr__(self):
        return "%s %s %s"%(self.left,self.comp,self.right)
#             return "%s %s %s"%(extensions.xx(self.left), self.comp, extensions.xx(self.right))

# extensions.xstr
class teee:
    pass
class Quote(teee,ast.Str):
    def is_a(className):
        # if isinstance(className,type): isinstance(return,className)
        if isinstance(className,str): className=className.lower()
        if className=="quote": return True
        return className=="string"

    def isa(self, x):
        if str(x).lower()=="string": return True
        if str(x).lower()=="quote": return True
        False

    # todont!!
    def __eq__(self, x):
        # if x.name==String: True
        if str(x)=="str": return True
        if str(x)=="String": return True
        if str(x)=="Quote": return True
        return False

    def value(self):
        return self.quoted()

class Function(kast.FunctionDef):
    #attr_accessor :name, :arguments, :return_type, :scope, :module, :clazz, :object, :body

    # def args(self):return self.arguments

    def __init__(self,*margs, **args):
        if not args:
            args=margs[0] # ruby style hash args
        self.name     =args['name']
        self.body     =args['body']
        self.clazz    =None # dangling ... NOT type(object) as in ruby!
        self.object   =None # in Python ist dies bis zum Aufruf nicht bekannt!?!
        self.modifier =None
        self.arguments =[]
        self.decorators=[]
        self.scope     =args['scope']   if 'scope' in args   else None
        self.object    =args['owner']   if 'owner' in args   else None
        self.object    =args['object']  if 'object' in args  else None
        self.clazz   =args['clazz']     if 'clazz' in args   else None #1st param: self
        self.modifier=args['modifier']  if 'modifier' in args   else None# public etc
        self.decorators =args['decorators'] if 'decorators' in args   else [] # @annotation functions
        self.arguments  =args['arguments']  if 'arguments'  in args   else None # as [Argument]
        self.arguments  =args['args']  if 'args'  in args   else self.arguments # as [Argument]
        self.return_type=args['return_type']if 'return_type' in args   else None # as [Argument]
        if not self.arguments :self.arguments=[]
        # self.args       =self.arguments
        # todo: later
        args = ast.arguments(args=emitters.pyc_emitter.map_values(self.arguments), vararg=None, kwarg=None, defaults=[])
        super(kast.FunctionDef,self).__init__(name=self.name,args=args,body=self.body,decorator_list=self.decorators)


        # self.scope    =args['scope'] # == class??

    def __repr__(self):

        if self.clazz:
            return "<Function %s %s>"%(self.clazz,self.name)
        return "<Function %s>"%(self.name)
        # return str(self.name) # (...)
        # integrate a function between x and y => object = a function (class)
        # if(self.arguments.count>0 and not self.object)
        #   if(arguments[0].preposition.empty?)
        #     self.object=arguments[0]
        #     arguments.shift
        #
        #
        # scope.variables[name]=self

    def is_classmethod(self):
        return self.clazz!=None or self.modifier=="classmethod"
    def is_staticmethod(self):
        return self.clazz!=None and self.modifier=="staticmethod"

    def argc(self):
        return    self.arguments.count

    def __str__(self):
        if self.clazz:
            return "<Function %s %s>"%(self.clazz,self.name)
        return "<Function %s>"%(self.name)

    def __eq__(self, other):
        if isinstance(other,Function):
            ok=        self.name  == other.name
            ok= ok and self.scope == other.scope
            ok= ok and self.clazz == other.clazz
            ok= ok and self.object== other.object
            ok= ok and self.arguments== other.arguments
            body_ok =  self.body     == other.body
            return ok # and body_ok
        if isinstance(other,ast.FunctionDef):
            return self.name==other.name and \
                self.arguments==other.args
        return False
    def __name__(self):
        return self.name
    #
    # def __call__(self, *args, **kwargs):
    #     return emitters.pyc_emitter.eval_ast(FunctionCall(self.name, args))

    def call(self,args):
        import english_parser
        import emitters.pyc_emitter
        args= english_parser.align_args( args, self.object or self.scope,self)
        # return english_parser.do_call(self.name, args)
        return emitters.pyc_emitter.eval_ast([self,FunctionCall(self.name, args)], args)
        # return emitters.pyc_emitter.eval_ast(FunctionCall(self, args))

        # def call(*args):
        # self.parser. self.context.
        #    EnglishParser.call_function self,args

# NEEDS TO BE WRAPPED! Expr(Call(Name('beep', Load()), [], [], None, None))
# class FunctionCall(ast.Expr):
# class AssignmentFunctionCall(ast.Assign):
class FunctionCall(ast.Assign): # todo: bad name

    def __init__(self, func=None, arguments=None, object=None, *margs, **args):
        super(FunctionCall, self).__init__(*margs, **args)
        # self.args = []
        # self.keywords = []
        # self.kwargs = self.starargs = None
        if callable(func):func=func.__name__#lulwoot  keep self.method=func?
        if isinstance(func,Function): func=func.name #eek name->func!

        func = args['func'] if 'func' in args else func
        func = args['name'] if 'name' in args else func
        self.name = func
        self.arguments = args['arguments'] if 'arguments' in args else arguments
        self.object =object
        # self. = args['object'] if 'object' in args else object NOOO, MESSES
        # if 'object' in args and args['object']: self.object = args['object']
        if 'scope' in args: self.scope = args['scope']
        # if 'return_type' in args: self.returns = args['return_type']
        if 'class' in args: self.clazz = args['class']
        if 'module' in args: self.clazz = self.clazz or args['module']
        # AST CONTENT:
        if isinstance(func,str): func=kast.name(func)
        if not isinstance(func,kast.Name):
            raise Exception("NO NAME %s"%func)
        self.targets=[kast.Name(id="it",ctx=ast.Store())]
        if self.arguments==None:self.arguments=[]
        elif not isinstance(self.arguments,(list,dict)):self.arguments=[self.arguments]
        # if not isinstance(self.arguments,dict):
        # self.arguments=map(emitters.kast_emitter.wrap_value,self.arguments)
        if 'returns' in args: self.returns = self.return_type = args['returns'] # = self.return_typeS plural?
        else: self.returns = self.return_type = self.resolve_return_type()
        if(self.object): # x.y(z)
            self.value=kast.call_attribute(kast.name(self.object), func.id, self.arguments)# ast.Call(func=name,
        else: # y(z)
            self.value=kast.call(func,self.arguments)# ast.Call(func=name,

    def __repr__(self):
        return str(self.name)+" "+str(self.arguments) #  for more beautiful debugging

    def resolve_return_type(self):
        if self.name=="int": return int
        if self.name=="str": return str
        if self.name=="string": return str
        return "Unknown" # None # Unknown

    # def invoke(self):
    #     do_send


class Argument(kast.arg):
    #attr_accessor :name, :type, :position, :default, :preposition, :value
    def __init__(self, *margs, **args):
        if not args:args=margs[0] # ruby style hash args
        # super(Argument, self).__init__(*margs, **args)
        # super().__init__(self, *margs, **args)
        # self.ctx= _ast.Param()
        # self.id=self.name
        self.name       =args['name']       if 'name'    in args else None
        self.preposition=args['preposition']if'preposition'in args else None
        #  big python headache: starting from 0 or 1 ?? (self,x,y) etc
        self.position   =args['position']   if 'position'in args else 0
        self.type       =args['type']       if 'type'    in args else None
        self.default    =args['default']    if 'default' in args else None
        self.value      =args['value']      if 'value'   in args else None


        # scope.variables[name]=self

    def __repr__(self):
        if(self.value):
            if not (self.name):
                return str(self.value)
            return str(self.name)+str(self.value)
        return str(self.name)

    def __eq__(self,other):
        if not other:
            # print >> sys.stderr, "missing argument %s "%self
            return False
        if not isinstance(other,Argument):return False
        ok = True
        has_type=self.type and other.type
        ok= ok and  self.name == other.name
        ok= ok and  self.preposition== other.preposition
        ok= ok and  self.type == other.type or not has_type
        # ok= ok and  self.position == other.position #may differ!
        ok= ok and  self.default == other.default
        ok= ok and  self.value == other.value
        return ok

    def name_or_value(self):
        return self.value or self.name

        # str(def)ym(self):
        #   str(self.name)ym


class Variable(kast.Name):
    # attr_accessor :name, :type,:owner, :value, :final, :modifier     # :scope, :module, << owner

    def __init__(self, *margs, **args):
        super(Variable, self).__init__(*margs, **args)
        if not args: args=margs[0]
        self.name    =args['name']
        self.ctx     =args['ctx'] if 'ctx' in args else ast.Load()
        # self.id      =ast.Name(self.name,self.ctx) NOO
        self.value   =args['value'] if 'value' in args else None
        self.type    =args['type'] if 'type'  in args else type(self.value)
        self.scope   =args['scope'] if 'scope' in args else None
        self.owner   =args['owner'] if 'owner' in args else None
        self.owner   =args['object'] if 'object' in args else self.owner
        self.modifier=args['modifier'] if 'modifier' in args else None
        self.final   = 'final' in args
        self.typed   = 'typed' in args #or self.type NO
        # self.class  =args[:module]
        # scope.variables[name]=self

    def __repr__(self):
          return str("xzcv %s"%self.name)

    def __str__(self):
          return str("xzcv %s"%self.name)

    # def __len__(self):
    #     return len(self.value)

    def c(self): #unwrap, for optimization):
        # if type==Numeric: return "NUM2INT(#{name})"
        # if type==Fixnum: return "NUM2INT(#{name})"
        return self.name

    def wrap(self):
        return self.name

    def __str__(self):
        return "<Variable %s %s=%s>"%(self.type or "",self.name,self.value) #"Variable #{type} #{name}=#{value}"

    def __repr__(self):
        return "<Variable %s %s=%s>"%(self.type or "",self.name,self.value) #"Variable #{type} #{name}=#{value}"

    def increase(self):
        self.value = self.value+1
        self.value

    def __eq__(self, x):
        if not isinstance(x,Variable):
            ok= self.value == x or self.name==x
            return ok
        return self.value == x.value
        # return self.name == x.name and\
        #     self.preposition== x.preposition and\
        #     self.type == x.type and\
        #     self.position == x.position and\
        #     self.default == x.default and\
        #     self.value == x.value

    # HACK!
    def __add__(self, other):
        self.value+=other
        return self.value
    def __mul__(self, other):
        self.value*=other
        return self.value
    def __sub__(self, other):
        self.value-=other
        return self.value
    def __div__(self, other):
        self.value/=other
        return self.value

class Property(Variable):
    pass
    # attr_accessor :name, :owner


class Pointer:
    # def parser():
    #     self.parser
    # attr_accessor(line_number,offset,parser)


    def __str__(self):
        print("<Pointer #{line_number} #{offset} '#{parser.lines[line_number][offset..-1]}'>")

    # def to_s:
    #   line_number.to_s+" "+offset.to_s #+" "+parser.lines[line_number][offset]
    #
    def __sub__(self, start):
        if isinstance(start, str): start = start.length
        if isinstance(start,int):
            p = self.clone()
            p.offset -= start.length
            if p.offset < 0: p.offset = 0
            return p

        if start > self.content_between(self,start):
            return start
        return self.content_between(start,self)


    def __gt__(self, x):
        if(isinstance(x,list)):return True
        return self.line_number >= x.line_number and self.offset > x.offset()


    def __init__(self, line_number, offset, parser):
        self.line_number = line_number
        self.parser = parser
        self.offset = offset
        if line_number >= len(parser['lines']): offset = 0
        # if line_number >= len(parser.lines): offset = 0


    def content_between(self,start_pointer, end_pointer):
        line = start_pointer.line_number
        all = []
        if len(lines)==0: return all #WTF!!
        if line >= lines.count: return all
        if line == end_pointer.line_number:
            return lines[line][start_pointer.offset:end_pointer.offset - 1]
        else:
            all.append(lines[line][start_pointer.offset: - 1])

        line = line + 1
        while line < end_pointer.line_number and line < lines.count():
            all.append(lines[line])
            line = line + 1

        chars = end_pointer.offset - 1
        if line < lines.count and chars > 0: all.append(lines[line][0..chars])
        all.map
        # stripNewline()
        if all.length == 1: return all[0]
        return all

