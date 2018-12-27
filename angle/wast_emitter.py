from wast import Wast


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
      for (m,v) in node.items():
        print("(", end=' ')
        print(m, end=' ')
        self.visit(v)
        print(")", end=' ')
      return

    if isinstance(node, tuple):
      method = node[0]
      params = node[1:]
      print("(",end=' ')
      print(method,end=' ')
      for t in params:
          self.visit(t)#,end=' ')
      print(")")
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
    print("(i32.const %d)" % i,end=' ') # stupid wast verbosity!

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
    emit_body(body) # yay, last==return!!
  print(')')


def emit_type(type):
  print('(type ${name} (func (param {params}) (result {result})))'.format(**type))


def emit_module(prog: Wast):
  print("(module")
  print('(type $v (func))')
  for type in prog.types:
    emit_type(type)
  for import_ in prog.imports:
    emit_import(import_)
  emit_table()
  emit_memory(prog.memory)
  for data in prog.datas:
    emit_data(data)
  for export in prog.exports:
    emit_export(export)
  if prog.starter:
    print('(start $%s)' % prog.starter)
  for func in prog.functions:
    emit_func(func)
  print(")")
