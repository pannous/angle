from ppci import wasm


class TreeVisitor():  # ast.NodeTransformer
  parents = []

  def parent(self):
    return self.parents[-1]

  def __repr__(self):
    return "<TreeVisitor>"

  def visit(self, node):
    """Visit a node."""

    if node == "$0":
      return print("(get_local $0)", end=' ')
    if node == "$1":
      return print("(get_local $1)", end=' ')

    if isinstance(node, dict):
      for (m, v) in node.items():
        self.visit(v)
      return

    if isinstance(node, tuple):
      method = node[0]
      params = node[1:]
      for t in params:
        self.visit(t)  # ,end=' ')
      return
    else:
      method = 'visit_' + node.__class__.__name__
    visitor = getattr(self, method, self.generic_visit)
    return visitor(node)

  def generic_visit(self, node, wrap=False):
    self.parents.append(node)
    self.current = node
    for field, old_value in node.fields:
      old_value = getattr(node, field, None)
      new_node = self.visit(old_value)
      if new_node is not None and new_node != old_value:
        setattr(node, field, new_node)
    self.parents.pop()
    return node

  def visit_int(self, i):

    print("(i32.const %d)" % i, end=' ')  # stupid wast verbosity!

  def visit_list(self, xs):
    # as data or inline construction??
    new_values = []
    for value in xs:
      value = self.visit(value)
      if value is None:
        continue
      # elif not isinstance(value, ast.AST):
      #   new_values.append(value)
      #   continue
      new_values.append(value)
    return new_values


def emit_():
  print("(")
  print(")")


def emit_import(node):
  if 'result' in node and node['result']:
    print('(import "{module}" "{fun}" (func ${func} (param {params}) (result {result})))'.format(**node))
  else:
    print('(import "{module}" "{fun}" (func ${func} (param {params}) ))'.format(**node))


def emit_global(node):
  print(' (global {global} {type} {value})'.format(**node))


def emit_global_mutable(node):
  print(' (global {global} (mut {type}) {value})'.format(**node))


# (global $a-mutable-global (mut f32) (f32.const 7.5))

def emit_table():
  print('(table 1 1 anyfunc)')


def emit_memory(emit_memory):
  print('(memory $0 1 256)')


offset = 0


# global offset

def emit_data(data):
  global offset
  if (isinstance(data, str)):
    print('(data (i32.const {offset}) "{data}")'.format(**{'offset': offset, 'data': data}))
    offset += len(data) + 1
  else:
    raise Exception("UNKNOWN type " + data)


def emit_export(export):
  print('(export "%s" (func "$%s"))' % (export, export))


# (export "mem" (memory $0))


def emit_body(body):
  visitor = TreeVisitor()
  for statement in body:
    visitor.visit(statement)


# ...?


def emit_func(func):
  print('(func "{func}" (; 1 ;) (type ${type}) {params} (result {result})'.format(**func))
  #   (param $0 i32) (param $1 i64) (param $2 f32) (param $3 f64)
  body = func['body']
  if not body and "i" in func['type']:  # debug
    print(' (return (i32.const 1337))')
  else:
    emit_body(body)  # yay, last==return!!
  print(')')


def emit_type(type):
  print('(type ${name} (func (param {params}) (result {result})))'.format(**type))


import wast
import wasmer
import wasmfun
from kast import kast

wasm.WASMComponent.__str__=lambda self: '(%s %s ...)' % (self.__class__.__name__, self.id)
wasm.WASMComponent.__repr__=wasm.WASMComponent.to_string
wasm.Instruction.__repr__=lambda self:"(%s %s)" % (self.opcode,self.args)



# def emit_module(prog: wast.Wast):
def emit_module(prog: kast):
  kast.Module
  code = '(module (func $main (result i32) (i32.const 42) (return)))'
  m1 = wasm.Module(code)
  for d in m1.definitions:
    print(d)
    if isinstance(d, wasm.Type):
      print(d.params)
      print(d.result)
    if isinstance(d,wasm.Func):
      print(d.locals)
      print(d.instructions)

  m1 = wasm.Module()
  #  see wasm.instruction_table
  m1.add_definition(wasm.Type('$main_type',[],['i32'])) # [(0, 'i32')]
  main_type=wasm.Ref('type', index=0, name='$main_type')
  m1.add_definition(wasm.Func('$main',main_type,[],[wasm.Instruction('i32.const',(42)),wasm.Instruction('return')]))
  m1.add_definition(wasm.Memory('$0', 1))
  m1.add_definition(wasm.Export("memory", "memory", wasm.Ref('memory', index=0, name='$0')))
  m1.add_definition(wasm.Export("main", "func", wasm.Ref('func', index=0, name='$main')))
  # wasmer.validate()
  print(m1.to_string())
  wasm_bytes = m1.to_bytes()
  with open('out.wasm', 'wb') as f:
    f.write(wasm_bytes)
  instance = wasmer.Instance(wasm_bytes)
  print(instance.exports)
  # if 'main' in instance.exports:
  try:
    result = instance.exports.main()
    print(result)
  except Exception as e:
    print(e)


  # else:
  #   print("NO MAIN")

  # for type in prog.types:
  #   emit_type(type)
  # for import_ in prog.imports:
  #   emit_import(import_)
  # emit_table()
  # emit_memory(prog.memory)
  # for data in prog.datas:
  #   emit_data(data)
  # for export in prog.exports:
  #   emit_export(export)
  # if prog.starter:
  #   print('(start $%s)' % prog.starter)
  # for func in prog.functions:
  #   emit_func(func)


if __name__ == '__main__':
  emit_module(None)
