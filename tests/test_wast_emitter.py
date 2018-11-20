import subprocess

import wast_emitter
from wast import Wast
import angle
from tests.parser_test_helper import *


class Tee(object):
  def __init__(self,name=None):
    self.datas=[]
    self.stdout = sys.stdout
    sys.stdout = self
    if not name: name="out.wast"
    self.file = open(name, "w+")

  def disconnect(self):
    self.__del__()

  def __del__(self): # not called by del ... wtf
    if self.file:
      self.flush()
      self.file.close()
      self.file=None
      sys.stdout = self.stdout

  def write(self, data):
    self.datas+=[data]
    self.stdout.write(data)
    self.file.write(data)

  def flush(self):
    self.stdout.flush()
    self.file.flush()

  def size(self):
    return len(self.datas)

  def __str__(self):
    return "\n".join(self.datas)

  def last(self):
    return self.datas[-1]


class WastEmitterTest(ParserBaseTest,unittest.TestCase):

    def setUp(self):
      super(WastEmitterTest, self).setUp()
      parser.clear()

    def test_string_methods(self):
        parse("invert 'hi'")
        self.assert_equals(the.result, 'ih')
        self.assert_that("invert('hi') is 'ih'")

    def _test_emit_import(self):
      self.tee=Tee()
      node={'module':"env","fun":"printc","func":"printc","params":"i32","result":""}
      wast_emitter.emit_import(node)
      print(self.tee)
      expect='(import "env" "printc" (func $printc (param i32) (result ))'
      # assert self.tee.last()==expect
      assert self.tee.size()==1

    def test_whole_program(self):
      print('test_whole_program')
      self.tee=Tee()
      wast = Wast()
      # wast.starter="main"
      wast.datas+=["HI ANGLE!"]
      wast.types += [{'name':'main','params':'','result':"i32"}]
      # wast.exports += ['main']
      wast.imports+=[{'module':"env","fun":"printc","func":"printc","params":"i32","result":""}]
      wast.functions+=[{'func':"main",'type':"main",'params':'','result':'i32','body':[]}]
      wast_emitter.emit_module(wast)
      file_name = self.tee.file.name
      cmd="wast2wasm " + file_name
      self.tee.disconnect()
      # self.tee.__del__()
      del self.tee
      result = os.system("wast2wasm " + file_name)
      print(result)
      result = os.system("wasm-as " + file_name)
      print(result)
      result = subprocess.check_output("./wasmx " + file_name.replace("wast","wasm"), shell=True)
      print(str(result,"UTF8")) # fucking python3
      assert "1337" in str(result)

