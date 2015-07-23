import angle
angle.use_tree = True
# angle.use_tree = False
from parser_test_helper import *


class AlgebraTest(ParserBaseTest):

    def setUp(self):
        self.parser.do_interpret()
        angle.use_tree=False
        super(AlgebraTest, self).setUp()

    def test_algebra1(self):
        assert_result_is('two minus 1', 1)
        assert_result_is('3 minus one', 2)
        init('4.0')
        assert_equals(self.parser.fraction(), 4)
        init('4.0+3.0')
        self.parser.do_interpret()
        assert_equals(self.parser.algebra(), 7)
        assert_result_is('4.0+3.0', 7.0)

    def test_algebra_NOW(self):
        # skip('test_algebra_NOW, DONT SKIP!')
        assert_result_is('1+3/4', 7/4.)
        assert_result_is('1+(3/4)', 7/4.)
        assert_result_is('1.0+3/4.0', 7/4.)
        assert_result_is('1.0+(3/4.0)', 7/4.)
        assert_result_is('1+3/4.0', 7/4.)

    def test_algebra(self):
        ok = parse('2*(3+10)')
        print((('Parsed input as ' + str(ok)) + '!'))
        assert_equals(ok, 26)
        # skip()
        # assert(self.current_node!=(None))
        # full_value = self.current_node.full_value()
        # val = eval(full_value)
        # assert_equals(val, 26)
        # val = self.current_node.eval_node(self.variableValues)
        # assert_equals(val, 26)
