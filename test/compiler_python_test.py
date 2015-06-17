import ast
from parser_test_helper import *


class CompilerPythonEquivalenceTest(ParserBaseTest):
    def test_compiler_output_equivalence(self):
        source='../kast/tests/hi.py'
        contents=open(source).readlines()# all()
        contents="\n".join(contents)
        contents="print('hi')"
        source="(string)" # compile from inline string source:
        file_ast=compile(contents, source, 'exec',ast.PyCF_ONLY_AST)
        x=ast.dump(file_ast, annotate_fields=True, include_attributes=True)
        x=ast.dump(file_ast, annotate_fields=False, include_attributes=False)
        print(x)
        angle_ast=parse_tree(contents)
        assert_equal(file_ast,angle_ast)
