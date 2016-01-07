import re # for 'is_file'
import os

import extensions


def h(x):
  help(x)
  
def log(msg):
  print(msg)

def fold(self,x,fun):
  if not callable(fun): 
    fun,x=x,fun
  return reduce(fun, self, x)

def last(xs):
  return xs[-1]
  

def flatten(l):
    if isinstance(l, list) or isinstance(l, tuple):
        for k in l:
            if isinstance(k, list):
                l.remove(k)
                l.append(*k)
    else:return [l]
    # verbose("NOT flattenable: %s"%s)
    return l


def square(x):
    if isinstance(x,list): return map(square,x)
    return x*x

def puts(x):
    print(x)
    return x

def increase(x):
    import nodes
    # if isinstance(x, dict)
    if isinstance(x, nodes.Variable):
        x.value=x.value+1
        return x.value
    return x+1

def grep(xs, x):
    # filter(lambda y: re.match(x,y),xs)
    if isinstance(x,list):
        return filter(lambda y: x[0] in str(y),xs)
    return filter(lambda y: x in str(y),xs)

def ls(path="."):
    return os.listdir(path)

def length(self):
    return len(self)

def say(x):
    print(x) 
    import os
    os.system("say '%s'"%x)

def beep(bug=True):
    print("\aBEEP ")
    import angle
    if not angle.testing:
        import os
        os.system("say 'beep'")
    return 'beeped'


def match_path(p):
    if(not isinstance(p,str)):return False
    m = re.search(r'^(\/[\w\'\.]+)',p)
    if not m: return False
    return m


def is_file(p, must_exist=True):

    if(not isinstance(p,str)):return False
    if re.search(r'^\d*\.\d+',p): return False
    if re.match(r'^\d*\.\d+',str(p)): return False
    m = re.search(r'^(\/[\w\'\.]+)',p)
    m = m or re.search(r'^([\w\/\.]*\.\w+)',p)
    if not m: return False
    return must_exist and m and os.path.isfile(m.string) or m


def is_dir(x, must_exist=True):
    #(the.string+" ").match(r'^(\')?([^\/\\0]+(\')?)+ ')
    m = match_path(x)
    return must_exist and m and os.path.isdirectory(m[0]) or m

# def print(x # debug!):
# print x
#   print "\n"
#   x

print("extension functions loaded")
