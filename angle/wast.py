class Wast:
  def __init__(self, *args, **kwargs):
    super(Wast, self).__init__(*args, **kwargs)
    self.memory = None
    self.starter = None
    self.types = []
    self.exports = []
    self.imports = []
    self.datas = []
    self.functions = []

