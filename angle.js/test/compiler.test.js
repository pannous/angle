#!/usr/bin/env python;
// var ast_export = require('ast_export');
// from tests.parser_test_helper var * = require('*');

// # = SkippingTest extends (#);
class CompilerEquivalenceTest extends ParserBaseTest {
	test_compiler_output_equivalence() {
		return skip();
		source = '../kast/tests/hi.py';
		// source='../core/english_parser.py'
		contents = open(source).readlines()  // all()
		contents = '\n'.join(contents);
		contents = `print('hi')`;
		inline = '(string)'  // compile from inline string source:
		source = inline;
		parse(contents);
		file_ast = compile(contents, source, 'exec', ast.PyCF_ONLY_AST);
		// x=ast.dump(file_ast, annotate_fields=True, include_attributes=True)
		angle_ast = parse_tree(contents);
		console.log((ast.dump(file_ast, annotate_fields = false, include_attributes = false)));
		console.log((ast.dump(angle_ast, annotate_fields = false, include_attributes = false)));
		assert_equals(file_ast, angle_ast);
		code = compile(angle_ast, 'file', 'exec');
		if (source == inline) {
			ast_export.emit_pyc(code);
		} else {
			ast_export.emit_pyc(code, source + '.pyc');
			try {
				exec(code);
			} catch (ex) {
			}
		}
	}
}
register(CompilerEquivalenceTest,module)
