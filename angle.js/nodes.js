// "use strict"
//let {Variable, Argument} = require('./nodes')
let ast = require('./ast')

class Compare extends ast.Compare {
    constructor(...args) {
        super()
        // import * as english_tokens from 'english_tokens';
        this.left = kwargs["left"];
        this.comp = kwargs["comp"];
        if (((this.comp instanceof str) || (this.comp instanceof ast.Str))) {
            this.comp = english_tokens.kast_operator_map[this.comp.toString()];
        }
        this.right = kwargs["right"];
        this.left = this.left;
        this.ops = [this.comp];
        this.comparators = [this.right];
    }
    toString() {
        return ("%s %s %s" % [this.left, this.comp, this.right]);
    }
}
class Quote extends ast.Str {
    is_a(className) {
        if ((((typeof className) === "string") || (className instanceof String))) {
            className = className.lower();
        }
        if ((className === "quote")) {
            return true;
        }
        return (className === "string");
    }
    isa(x) {
        if ((x.toString().lower() === "string")) {
            return true;
        }
        if ((x.toString().lower() === "quote")) {
            return true;
        }
        false;
    }
    equals(x) {
        if ((x.toString() === "str")) {
            return true;
        }
        if ((x.toString() === "String")) {
            return true;
        }
        if ((x.toString() === "Quote")) {
            return true;
        }
        return false;
    }
    value() {
        return this.quoted();
    }
}
class FunctionDef extends ast.FunctionDef {
    constructor(...margs) {
	    super()
	    var args;
        if ((! args)) {
            args = margs[0];
        }
        this.name = args["name"].toString();
        this.body = args["body"];
        this.clazz = null;
        this.object = null;
        this.modifier = null;
        this.arguments = [];
        this.decorators = [];
        this.scope = (args["scope"]  || null);
        this.object = (args["owner"]  || null);
        this.object = (args["object"]  || null);
        this.clazz = (args["clazz"]  || null);
        this.modifier = (args["modifier"]  || null);
        this.decorators = (args["decorators"]  || []);
        this.arguments = (args["arguments"]  || null);
        this.arguments = (args["args"]  || this.arguments);
        this.return_type = (args["return_type"]  || null);
        if ((! this.arguments)) {
            this.arguments = [];
        }
        this.args = ast.arguments({args: pyc_emitter.map_values(this.arguments), vararg: null, kwarg: null, defaults: []});
    }
    toString() {
        if (this.clazz) {
            return ("<Function %s %s>" % [this.clazz, this.name]);
        }
        return ("<Function %s>" % this.name);
    }
    is_classmethod() {
        return ((this.clazz !== null) || (this.modifier === "classmethod"));
    }
    is_staticmethod() {
        return ((this.clazz !== null) && (this.modifier === "staticmethod"));
    }
    argc() {
        return this.arguments.count;
    }
    toString() {
        if (this.clazz) {
            return ("<Function %s %s>" % [this.clazz, this.name]);
        }
        return ("<Function %s>" % this.name);
    }
    equals(other) {
        var body_ok, ok;
        if ((other instanceof FunctionDef)) {
            ok = (this.name === other.name);
            ok = (ok && (this.scope === other.scope));
            ok = (ok && (this.clazz === other.clazz));
            ok = (ok && (this.object === other.object));
            ok = (ok && (this.arguments === other.arguments));
            body_ok = (this.body === other.body);
            return ok;
        }
        if ((other instanceof ast.FunctionDef)) {
            return ((this.name === other.name) && (this.arguments === other.args));
        }
        return false;
    }
    __name__() {
        return this.name;
    }
    call(args) {
        // import * as english_parser from 'english_parser';
        // import * as pyc_emitter from 'pyc_emitter';
        args = english_parser.align_args(args, (this.object || this.scope), this);
        return pyc_emitter.eval_ast([this, new FunctionCall(this.name, args)], args);
    }
}
class FunctionCall extends ast.Assign {
    constructor(func = null, argus = null, object = null, ...margs) {
	    super()
	    let args=arguments
	    if (((func instanceof Function) || ((typeof func) === "function"))) {
            func = func.__name__;
        }
        if ((func instanceof FunctionDef)) {
            func = func.name;
        }
        func = (args["func"]  || func);
        func = (args["name"]  || func);
        this.func = func;
        this.name = func;
        this.arguments = (args["arguments"]  || argus);
        this.object = object;
        console.log(typeof args)
        if ( "scope" in args) {
            this.scope = args["scope"];
        }
        if ( "class" in args) {
            this.clazz = args["class"];
        }
        if ("module" in  args) {
            this.clazz = (this.clazz || args["module"]);
        }
        if (is_string(func)) {
            func = ast.name(func);
        }
        if ((! (func instanceof ast.Name))) {
            throw new Error(("NOT A NAME %s" % func));
        }
        this.targets = [new kast.Name({id: "it", ctx: new ast.Store()})];
        if ((this.arguments === null)) {
            this.arguments = [];
        } else {
            if ((! ((this.arguments instanceof Array) || (this.arguments instanceof Object /*todo*/)))) {
                this.arguments = [this.arguments];
            }
        }
        this.returns = this.return_type = args["returns"] || this.resolve_return_type();
        if (this.object) {
            this.value = kast.call_attribute(kast.name(this.object), func.id, this.arguments);
        } else {
            this.value = kast.call(func, this.arguments);
        }
    }
    toString() {
        return ((this.name.toString() + " ") + this.arguments.toString());
    }
    resolve_return_type() {
        if ((this.name === "int")) {
            return Integer;
        }
        if ((this.name === "str")) {
            return str;
        }
        if ((this.name === "string")) {
            return str;
        }
        return "Unknown";
    }
}
class Argument{//} extends kast.arg {
    constructor(...margs) {
	    var args;
        if ((! args)) args = margs[0];
        this.name = (args["name"]  || null);
        this.preposition = (args["preposition"]  || null);
        this.position = (args["position"]  || 0);
        this.type = (args["type"]  || null);
        this.defaulty = (args["default"]  || null);
        this.value = (args["value"]  || null);
        this.id = this.name;
    }
    toString() {
        if (this.value) {
            if ((! this.name)) {
                return this.value.toString();
            }
            return (this.name.toString() + this.value.toString());
        }
        return this.name.toString();
    }
    equals(other) {
        var has_type, ok;
        if ((! other)) {
            return false;
        }
        if ((! (other instanceof Argument))) {
            return false;
        }
        ok = true;
        has_type = (this.type && other.type);
        ok = (ok && (this.name === other.name));
        ok = (ok && (this.preposition === other.preposition));
        ok = ((ok && (this.type === other.type)) || (! has_type));
        ok = (ok && (this.defaulty === other.defaulty));
        ok = (ok && (this.value === other.value));
        return ok;
    }
    name_or_value() {
        return (this.value || this.name);
    }
}
class Variable extends ast.Name {
    constructor(...margs) {
	    super()
        var args= margs.length==1?margs[0]:margs
        Object.assign(this,args)
        // this.name = args["name"];
	    this.ctx = args["ctx"] || ast.Load;
	    // this.value = args["value"] || null;
	    // this.type = args["type"] || args["typed"]
	    this.type = this.type || this.typed
	    this.type = this.type || this.value &&Object.getPrototypeOf(this.value)
	    this.type = this.type || this.value && typeof this.value || null
	    // this.scope = args["scope"] || null;
	    // this.owner = args["owner"] || null;
	    this.owner = args["object"] || this.owner;
	    // this.modifier = args["modifier"] || null;
	    // this.finale =  args["final"];
	    // this.typed =  args["typed"];
    }

	// toString() {
     //    return ("xzcv %s" % this.name).toString();
	// }
	// toString() {
	// 	return ("xzcv %s" % this.name).toString();
	// }
	toString() {
		return ("<Variable %s %s=%s>" % [(this.type || ""), this.name, this.value]);
	}
	toString() {
		return ("<Variable %s %s=%s>" % [(this.type || ""), this.name, this.value]);
	}
	__getitem__(item) {
        return this.value[item];
    }
	c() {
        return this.name;
    }
	wrap() {
        return this.name;
    }
    increase() {
        this.value = (this.value + 1);
        return this.value;
    }
    equals(x) {
        if ((x instanceof Variable)) {
            return (this.value === x.value);
        } else {
            try {
                return ((this.value === x) || (this.name === x));
            } catch(e) {
                return false;
            }
        }
    }
    __add__(other) {
        if ((other instanceof Variable)) {
            other = other.value;
        }
        if ((this.value instanceof _ast.AST)) {
            return new _ast.BinOp(this.value, new _ast.Add(), ast_magic.wrap_value(other));
        } else {
            return (this.value + other);
        }
    }
    __mul__(other) {
        this.value *= other;
        return this.value;
    }
    __sub__(other) {
        this.value -= other;
        return this.value;
    }
    __div__(other) {
        this.value /= other;
        return this.value;
    }
}
class Pointer {
    toString() {
        console.log("<Pointer #{line_number} #{offset} '#{parser.lines[line_number][offset..-1]}'>");
    }
    __sub__(start) {
        var p;
        if ((((typeof start) === "string") || (start instanceof String))) {
            start = start.length;
        }
        if ((((typeof start) === "number") || (start instanceof Number))) {
            p = this.clone();
            p.offset -= start.length;
            if ((p.offset < 0)) {
                p.offset = 0;
            }
            return p;
        }
        if ((start > this.content_between(this, start))) {
            return start;
        }
        return this.content_between(start, this);
    }
    __gt__(x) {
        if ((x instanceof Array)) {
            return true;
        }
        return ((this.line_number >= x.line_number) && (this.offset > x.offset()));
    }
    constructor(line_number, offset, parser) {
        this.line_number = line_number;
        this.parser = parser;
        this.offset = offset;
        if ((line_number >= parser["lines"].length)) {
            offset = 0;
        }
    }
    content_between(start_pointer, end_pointer) {
        var all, chars, line;
        line = start_pointer.line_number;
        all = [];
        if ((lines.length === 0)) {
            return all;
        }
        if ((line >= lines.count)) {
            return all;
        }
        if ((line === end_pointer.line_number)) {
            return lines[line].slice(start_pointer.offset, (end_pointer.offset - 1));
        } else {
            all.append(lines[line].slice(start_pointer.offset, (- 1)));
        }
        line = (line + 1);
        while (((line < end_pointer.line_number) && (line < lines.count()))) {
            all.append(lines[line]);
            line = (line + 1);
        }
        chars = (end_pointer.offset - 1);
        if (((line < lines.count) && (chars > 0))) {
            all.append(lines[line][0.0.chars]);
        }
        all.map;
        if ((all.length === 1)) {
            return all[0];
        }
        return all;
    }
}

//# sourceMappingURL=nodes.js.map
module.exports={
    Variable,
	Argument,
	FunctionCall
}
