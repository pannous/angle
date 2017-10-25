#!/usr/local/bin/python;
// var ast = require('ast');
var os = require('os');
var sys = require('sys');


// if 'TESTING' in os.environ:
// 	# raise Exception("IgnoreException")
// 	arg = None
// return
	// quit(1)

function go_ahead() {

	ast_file = 'out/inline.ast';
	do_exec = false;
	arg = null;
	if (len(sys.argv) > 1) {
		arg = sys.argv[1];
	}
	if (arg && '.ast' in arg) {
		ast_file = arg;
	} else if (arg) {
		if (arg.endswith('.py')) {
			expr = open(arg).read();
			do_exec = true;
		my_ast = ast.parse(arg);
		console.log(arg);
		console.log('');
		x = ast.dump(my_ast, annotate_fields=true, include_attributes=true);
		console.log(x);
		console.log('\n--------MEDIUM-------- (ok)\n');
		x = ast.dump(my_ast, annotate_fields=true, include_attributes=false);
		console.log(x);
		console.log('\n--------SHORT-------- (view-only)\n');
		x = ast.dump(my_ast, annotate_fields=false, include_attributes=false);
		console.log(x);
		console.log('');
		if (do_exec) exec(expr);
		exit(0);

			try {
				source = codegen.to_source(inline_ast);
				console.log(source)  // => CODE
			} catch (ex) {
				console.log(ex);
				my_ast = ast.fix_missing_locations(inline_ast);
				code = compile(inline_ast, 'out/inline', 'exec');
				// if do_exec:
				exec(code);
			}
			inline_ast = 'set in execfile:';
			exec(open(ast_file).read());
		}
	}
}
if (!'TESTING' in process.env && !'TEST' in process.env) {
	go_ahead();
}
