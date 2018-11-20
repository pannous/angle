import context
context.use_tree = True
context.interpret = False
import tests.function_test
tests.function_test.FunctionTest()

context.use_tree = False
context.interpret = True