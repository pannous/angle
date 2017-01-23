# https://github.com/flier/pyv8

# truffle on graal JVM has faster runs, but sloooooow startup 6SECONDS for HELLOWTF
# https://stackoverflow.com/questions/31901940/why-is-ruby-irb-iteration-so-slow/31906922#31906922

# python+truffle = zippy

# talk at PyCon 2015 about Jython 2.7, including new features: https://www.youtube.com/watch?v=hLm3garVQFo

# PyV8 is a python wrapper for Google V8 engine, it act as a bridge between the Python and JavaScript objects, and support to hosting Google's v8 engine in a python script.
#
# import PyV8
js = PyV8.JSContext()          # create a context with an implicit global object
js.enter()                     # enter the context (also support with statement)
js.eval("1+2")                 # evalute the javascript expression
                                 # return a native python int
class Global(PyV8.JSClass):      # define a compatible javascript class
  def hello(self):               # define a method
    print("Hello World")

js2 = PyV8.JSContext(Global()) # create another context with the global object
js2.enter()
js2.eval("hello()")            # call the global object from javascript
# Hello World                          # the output from python script
