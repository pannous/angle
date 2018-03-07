// import * as _ast from '_ast';
// import * as ast from 'ast';
// import * as sys from 'sys';
// import * as collections from 'collections';
// import {*} from '_ast';
// import * as os.path from 'os/path';
import * as ast_magic from 'ast_magic';
import {wrap_value} from 'ast_magic';
import * as context from 'context';
import * as codegen from 'astor';
import {SourceGenerator as sourcegen} from 'astor/codegen';
import {Print, assign, name} from 'kast/kast';
import {kast} from 'kast';
import * as nodes from 'nodes';
import * as the from 'context';
var _pj;
var provided, to_inject, to_provide;
function _pj_snippets(container) {
    function in_es6(left, right) {
        if (((right instanceof Array) || ((typeof right) === "string"))) {
            return (right.indexOf(left) > (- 1));
        } else {
            if (((right instanceof Map) || (right instanceof Set) || (right instanceof WeakMap) || (right instanceof WeakSet))) {
                return right.has(left);
            } else {
                return (left in right);
            }
        }
    }
    function set_properties(cls, props) {
        var desc, value;
        var _pj_a = props;
        for (var p in _pj_a) {
            if (_pj_a.hasOwnProperty(p)) {
                value = props[p];
                if (((((! ((value instanceof Map) || (value instanceof WeakMap))) && (value instanceof Object)) && ("get" in value)) && (value.get instanceof Function))) {
                    desc = value;
                } else {
                    desc = {"value": value, "enumerable": false, "configurable": true, "writable": true};
                }
                Object.defineProperty(cls.prototype, p, desc);
            }
        }
    }
    container["in_es6"] = in_es6;
    container["set_properties"] = set_properties;
    return container;
}
_pj = {};
_pj_snippets(_pj);
sourcegen.visit_Function = sourcegen.visit_FunctionDef;
sourcegen.visit_function = sourcegen.visit_FunctionDef;
sourcegen.visit_FunctionCall = sourcegen.visit_Call;
sourcegen.visit_Variable = sourcegen.visit_Name;
sourcegen.visit_Argument = sourcegen.visit_Name;
sourcegen.visit_Condition = sourcegen.visit_Compare;
to_inject = [];
to_provide = {};
provided = {};
class Reflector extends object {
    __getitem__(name) {
        import * as english_parser from 'angle_parser';
        var m;
        if ((name === "__tracebackhide__")) {
            return false;
        }
        console.log(("Reflector __getitem__ %s" % name.toString()));
        if (_pj.in_es6(name, the.params)) {
            the.result = english_parser.do_evaluate(the.params[name]);
        } else {
            if (_pj.in_es6(name, the.variables)) {
                the.result = english_parser.do_evaluate(the.variables[name].value);
            } else {
                if (_pj.in_es6(name, locals())) {
                    return locals()[name];
                } else {
                    if (_pj.in_es6(name, globals())) {
                        return globals()[name];
                    } else {
                        if (__builtin__.hasattr(__builtin__, name)) {
                            return __builtin__.getattr(__builtin__, name);
                        } else {
                            if ((name === "reverse")) {
                                return list.reverse;
                            } else {
                                if (_pj.in_es6(name, the.methods)) {
                                    m = the.methods[name];
                                    if ((m instanceof nodes.FunctionDef)) {
                                        throw new Error(("%s must be declared or imported before!" % m));
                                        m = m.body;
                                    }
                                    return m;
                                } else {
                                    console.log(("UNKNOWN ITEM %s" % name));
                                    return name;
                                }
                            }
                        }
                    }
                }
            }
        }
        return the.result;
    }
    __setitem__(key, value) {
        console.log(("Reflector __setitem__ %s %s" % [key, value]));
        if (_pj.in_es6(key, the.variables)) {
            the.variables[key].value = value;
        } else {
            the.variables[key] = new nodes.Variable({name: key, value: value});
        }
        the.variableValues[key] = value;
        the.result = value;
    }
}
class PrepareTreeVisitor extends ast.NodeTransformer {
    toString() {
        return "<PrepareTreeVisitor>";
    }
    generic_visit(node, wrap = false) {
        var new_node, old_value;
        this.parents.append(node);
        this.current = node;
        if ((! ((node instanceof ast.AST) || (node instanceof _ast.AST)))) {
            if (wrap) {
                return wrap_value(node);
            } else {
                return node;
            }
        }
        for (var field_n_old_value, _pj_c = 0, _pj_a = ast.iter_fields(node), _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
            field_n_old_value = _pj_a[_pj_c];
            old_value = (node[field] || null);
            new_node = this.visit(old_value);
            if (((new_node !== null) && (new_node !== old_value))) {
                node[field] = new_node;
            }
        }
        this.parents.pop();
        return node;
    }
    parent() {
        return this.parents.slice((- 1))[0];
    }
    visit_list(xs) {
        var new_values, value;
        new_values = [];
        for (var value, _pj_c = 0, _pj_a = xs, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
            value = _pj_a[_pj_c];
            value = this.visit(value);
            if ((value === null)) {
                continue;
            } else {
                if ((! (value instanceof ast.AST))) {
                    new_values.append(value);
                    continue;
                }
            }
            new_values.append(value);
        }
        return new_values;
    }
    visit_list(x) {
        return new kast.List(this.visit_list(x), new ast.Load());
    }
    visit_float(x) {
        return new ast.Num(x);
    }
    visit_Num(x) {
        return x;
    }
    visit_function(x) {
        return name(x.__name__);
    }
    visit_Name(x) {
        return x;
    }
    visit_Print(x) {
        return null;
    }
    visit_Call(x) {
        return x;
    }
    visit_BinOp(node) {
        if ((node.left instanceof nodes.Variable)) {
            node.left = kast.name(node.left.name);
        }
        if ((node.right instanceof nodes.Variable)) {
            node.right.context = new _ast.Load();
        }
        node.right = ast_magic.wrap_value(node.right);
        node.left = ast_magic.wrap_value(node.left);
        return node;
    }
    visit_Str(x) {
        return x;
    }
    visit_str(x) {
        if ((x === "0")) {
            return new _ast.Num(0);
        }
        if ((x === "False")) {
            return kast.false;
        }
        if (((this.current instanceof ast.Str) || (this.current instanceof ast.Name) || (this.current instanceof ast.FunctionDef) || (this.current instanceof ast.Attribute) || (this.current instanceof ast.alias) || (this.current instanceof ast.keyword))) {
            return x;
        }
        return new ast.Str(x);
    }
    visit_int(x) {
        return new ast.Num(x);
    }
    visit_Assign(x) {
        return this.generic_visit(x);
    }
    visit_Pass(x) {
        return new ast.Expr(x);
    }
    visit_Variable(x) {
        return new ast.Name(x.name, x.ctx);
    }
    visit_arguments(x) {
        x.ctx = new _ast.Param();
        return x;
    }
    visit_Function(x) {
        return this.visit_FunctionDef(x);
    }
    visit_FunctionDef(x) {
        var argList;
        x.body = list(map(this.generic_visit, x.body));
        x.body = fix_block(x.body);
        if ((! _pj.in_es6(x, to_inject))) {
            to_inject.append(x);
        }
        argList = map_def_argument_params(x.arguments);
        x.args = ast.arguments({args: argList, vararg: null, kwarg: null, defaults: [], kwonlyargs: [], kw_defaults: []});
        x.decorator_list = (x.decorators || []);
        x.vararg = null;
        provided[x.name] = x;
        return x;
    }
    visit_Argument(x) {
        if ((x.value instanceof nodes.Variable)) {
            return this.visit_Variable(x);
        }
        return this.generic_visit(x.value);
    }
    visit_FunctionCall(node) {
        var function_def, skip_assign;
        if (_pj.in_es6(node.name, the.methods)) {
            function_def = the.methods[node.name];
            if ((function_def instanceof ast.FunctionDef)) {
                to_inject.append(function_def);
            } else {
                if ((function_def instanceof collections.Callable)) {
                    to_provide[node.name] = function_def;
                } else {
                    if (provided[node.name]) {
                        console.log(("OK, already provided " + node.name));
                    } else {
                        console.log("HUH");
                    }
                }
            }
            console.log(("NEED TO IMPORT %s ??" % function_def));
        }
        node.value.args = map_arguments(node.value.args);
        skip_assign = true;
        if (skip_assign) {
            return this.generic_visit(node.value);
        }
    }
}
_pj.set_properties(PrepareTreeVisitor, {"parents": []});
function fix_ast_module(my_ast, fix_body = true) {
    if ((! (Object.getPrototypeOf(my_ast) === ast.Module))) {
        if ((! (my_ast instanceof Array))) {
            my_ast = [my_ast];
        }
        my_ast = new ast.Module({body: my_ast});
    }
    new PrepareTreeVisitor().visit(my_ast);
    if (fix_body) {
        if (context.needs_extensions) {
            my_ast.body.insert(0, new ast.ImportFrom("angle.extensions", [ast.alias("*", null)], 0));
        }
        for (var s, _pj_c = 0, _pj_a = to_inject, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
            s = _pj_a[_pj_c];
            if ((! _pj.in_es6(s, my_ast.body))) {
                my_ast.body.insert(0, s);
            }
        }
        fix_block(my_ast.body, {returns: false, prints: true});
    }
    my_ast = ast.fix_missing_locations(my_ast);
    print_ast(my_ast);
    return my_ast;
}
function fix_block(body, returns = true, prints = false) {
    var last_statement;
    body.insert(0, new ast.Global({names: ["it"]}));
    last_statement = body.slice((- 1))[0];
    if (((last_statement instanceof Array) && (last_statement.length === 1))) {
        last_statement = last_statement[0];
        console.log("HOW??");
    }
    if ((! ((last_statement instanceof ast.Assign) || (last_statement instanceof ast.If) || (last_statement instanceof nodes.FunctionDef) || (last_statement instanceof ast.Return) || (last_statement instanceof ast.Assert)))) {
        if ((last_statement instanceof kast.Print)) {
            body.slice((- 1))[0] = assign("it", last_statement.values[0]);
            last_statement.values[0] = name("it");
            body.append(last_statement);
        } else {
            body.slice((- 1))[0] = assign("it", last_statement);
        }
    }
    if ((last_statement instanceof ast.Assign)) {
        if ((! _pj.in_es6("it", function () {
    var _pj_a = [], _pj_b = last_statement.targets;
    for (var _pj_c = 0, _pj_d = _pj_b.length; (_pj_c < _pj_d); _pj_c += 1) {
        var x = _pj_b[_pj_c];
        _pj_a.push(x.id);
    }
    return _pj_a;
}
.call(this)))) {
            last_statement.targets.append(new Name({id: "it", ctx: new Store()}));
        }
    }
    if ((returns && (! (body.slice((- 1))[0] instanceof ast.Return)))) {
        body.append(new ast.Return(name("it")));
    }
    return body;
}
function get_globals(args) {
    var my_globals;
    my_globals = {};
    my_globals.update(the.variableValues.copy());
    my_globals.update(the.params);
    my_globals.update(the.methods);
    my_globals.update(globals());
    if ((args instanceof Object /*todo*/)) {
        the.params.update(args);
    } else {
        console.log("What the hell do you think you're doing, I need a dictionary as args (not a list)");
    }
    return my_globals;
}
function get_ast(python, source = "out/inline.py", _context = "exec") {
    var py_ast;
    py_ast = compile(python, source, _context, ast.PyCF_ONLY_AST);
    print_ast(py_ast);
    return py_ast;
}
function print_ast(my_ast, source_file = "out/inline", with_line_numbers = false) {
    var x;
    if ((! os.path.exists("out"))) {
        return;
    }
    try {
        x = ast.dump(my_ast, {annotate_fields: true, include_attributes: with_line_numbers});
        open((source_file + ".ast"), "wt").write(("from ast import *\ninline_ast=" + x.replace("(", "(\n")));
        console.log(x);
        console.log("");
        x = ast.dump(my_ast, {annotate_fields: false, include_attributes: false});
        open((source_file + ".short.ast"), "wt").write(("short_ast=" + x));
        console.log(x);
        console.log("");
    } catch(e) {
        console.error(e);
        console.log(("CAN'T DUMP ast / print_ast %s" % my_ast));
        if ((! (my_ast instanceof Array))) {
            console.log(my_ast.body);
        }
    }
}
function print_source(my_ast, source_file = "out/inline") {
    var source;
    try {
        source = codegen.to_source(my_ast);
        if (os.path.exists("out")) {
            open((source_file + ".py"), "wt").write(source);
        }
        console.log(source);
    } catch(e) {
        import * as traceback from 'traceback';
        console.log("SOURCE NOT STANDARD CONFORM");
        traceback.print_exc();
    }
}
function eval_ast(my_ast, args = {}, source_file = "out/inline", target_file = null, run = false, fix_body = true, _context = "exec") {
    var code, info_, ret;
    try {
        while ((to_inject.length > 0)) {
            to_inject.pop();
        }
        my_ast = fix_ast_module(my_ast, {fix_body: fix_body});
        console.log("///////////////");
        console.log(my_ast);
        code = compile(my_ast, source_file, "exec");
        if ((context.use_tree && (! run))) {
            the.result = my_ast;
            return my_ast;
        }
        print_source(my_ast, source_file);
        emit_pyc(code, (target_file || (source_file + ".pyc")));
        ret = run_ast(my_ast, source_file, args, {fix: false, code: code, _context: _context});
        the.params.clear();
        return ret;
    } catch(e) {
        console.error(e);
        console.log(my_ast);
        print_ast(my_ast, source_file);
        print_source(my_ast, source_file);
        info = sys.exc_info()[2];
        throw e;
    }
}
class Namespace {
    constructor(variables) {
        this.variables = variables;
    }
}
function run_ast(my_ast, source_file = "(String)", args = null, fix = true, _context = "", code = null) {
    var my_globals, namespace, ret;
    if ((! args)) {
        args = {};
    }
    if (fix) {
        my_ast = fix_ast_module(my_ast);
    }
    if ((! code)) {
        code = compile(my_ast, source_file, "exec");
    }
    if ((_context === "eval")) {
        my_globals = get_globals(args);
        ret = eval(code, my_globals, new Reflector());
    } else {
        args.update(to_provide);
        namespace = context.variables;
        namespace.update(args);
        namespace["it"] = null;
        exec(code, namespace);
        ret = namespace["it"];
    }
    ret = (ret || the.result);
    return ret;
}
function map_values(val) {
    return list(map(wrap_value, val));
}
function map_arguments(val) {
    return list(map(wrap_value, val));
}
function get_id(x) {
    if ((x instanceof Name)) {
        return x.id;
    }
    return x;
}
function map_def_argument_params(val) {
    function assure_arg(x) {
        return _ast.arg(get_id(x), null);
    }
    return list(map(assure_arg, val));
}
function emit_pyc(code, fileName = "output.pyc") {
    import * as marshal from 'marshal';
    import * as py_compile from 'py_compile';
    import * as time from 'time';
    var fc;
    if ((fileName === "out/inline.pyc")) {
        return;
    }
    fc = open(fileName, "wb");
    fc.write("\u0000\u0000\u0000\u0000");
    marshal.dump(code, fc);
    fc.flush();
    fc.seek(0, 0);
    console.log(("WRITTEN TO " + fileName));
}

//# sourceMappingURL=pyc_emitter.js.map
