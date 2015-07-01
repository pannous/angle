import ast
from kast import kast
from the import *

class Condition(object):#todo: BinOp ?
    def __init__(self, **kwargs): #ruby : initialize
        self.lhs = kwargs['lhs']
        self.comp= kwargs['comp']
        self.rhs = kwargs['rhs']

class Quote(str,ast.Str):
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
        if str(x)=="String": return True
        if str(x)=="Quote": return True
        return False

    def value(self):
        return self.quoted()

class Function:
    #attr_accessor :name, :arguments, :return_type, :scope, :module, :clazz, :object, :body

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
        self.decorators =args['decorators'] if 'decorators' in args   else None # @annotation functions
        self.arguments  =args['arguments']  if 'arguments'  in args   else None # as [Argument]
        self.return_type=args['return_type']if 'return_type' in args   else None # as [Argument]

        # self.scope    =args['scope'] # == class??

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
        self.arguments.count

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


        # def call(*args):
        # self.parser. self.context.
        #    EnglishParser.call_function self,args

# NEEDS TO BE WRAPPED! Expr(Call(Name('beep', Load()), [], [], None, None))
class FunctionCall(ast.Expr):
    def __init__(self, name=None, arguments=None,object=None, **args):
        # super(FunctionCall, self).__init__(*margs, **args)
        # self.args = []
        # self.keywords = []
        # self.kwargs = self.starargs = None
        if callable(name): name=name.__name__#lulwoot

        #or args['name']
        # self.func = name
        self.name = name or args['name']
        self.arguments = args['arguments'] if 'arguments' in args else arguments
        if object:self.object =object
        # self. = args['object'] if 'object' in args else object NOOO, MESSES
        # if 'object' in args and args['object']: self.object = args['object']
        if 'scope' in args: self.scope = args['scope']
        if 'class' in args: self.clazz = args['class']
        if 'module' in args: self.clazz = self.clazz or args['module']
        # AST CONTENT:
        if isinstance(name,str): name=kast.name(name)
        if not isinstance(name,kast.Name): raise Exception("NO NAME %s"%name)
        arguments=[] #todo!!
        self.value=kast.call(name,arguments)# ast.Call(func=name,


class Argument(kast.arg):
    #attr_accessor :name, :type, :position, :default, :preposition, :value
    def __init__(self,*margs, **args):
        if not args:
            args=margs[0] # ruby style hash args
        self.name       =args['name']       if 'name'    in args else None
        self.preposition=args['preposition']if'preposition'in args else None
        #  big python headache: starting from 0 or 1 ?? (self,x,y) etc
        self.position   =args['position']   if'position'in args else 0
        self.type       =args['type']       if 'type'    in args else None
        self.default    =args['default']    if 'default' in args else None
        self.value      =args['value']      if 'value'   in args else None
        # scope.variables[name]=self

    def __eq__(self,other):
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
        self.value or self.name

        # str(def)ym(self):
        #   str(self.name)ym


class Variable(kast.Name):
    # attr_accessor :name, :type,:owner, :value, :final, :modifier     # :scope, :module, << owner

    def __init__(self,*margs,**args):
        if not args: args=margs[0]
        self.name    =args['name']
        self.ctx     =args['ctx'] if 'ctx' in args else ast.Load()
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
        super == x
        # self.name == x.name &&
        #     self.preposition== x.preposition &&
        #     self.type == x.type &&
        #     self.position == x.position &&
        #     self.default == x.default &&
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

