import * as _ast from '_ast';
import * as ast from 'ast';
import * as ast_magic from 'ast_magic';
import * as extensions from 'extensions';
import * as kast.kast from 'kast/kast';
import * as the from 'context';
import {kast} from 'kast';
import * as sys from 'sys';
import * as pyc_emitter from 'pyc_emitter';
var _pj;
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
    container["in_es6"] = in_es6;
    return container;
}
_pj = {};
_pj_snippets(_pj);
class Compare extends ast.Compare {
    constructor(...args) {
        import * as english_tokens from 'english_tokens';
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
    __repr__() {
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
    __eq__(x) {
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
class FunctionDef extends kast.FunctionDef {
    constructor(...margs) {
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
        this.scope = (_pj.in_es6("scope", args) ? args["scope"] : null);
        this.object = (_pj.in_es6("owner", args) ? args["owner"] : null);
        this.object = (_pj.in_es6("object", args) ? args["object"] : null);
        this.clazz = (_pj.in_es6("clazz", args) ? args["clazz"] : null);
        this.modifier = (_pj.in_es6("modifier", args) ? args["modifier"] : null);
        this.decorators = (_pj.in_es6("decorators", args) ? args["decorators"] : []);
        this.arguments = (_pj.in_es6("arguments", args) ? args["arguments"] : null);
        this.arguments = (_pj.in_es6("args", args) ? args["args"] : this.arguments);
        this.return_type = (_pj.in_es6("return_type", args) ? args["return_type"] : null);
        if ((! this.arguments)) {
            this.arguments = [];
        }
        this.args = ast.arguments({args: pyc_emitter.map_values(this.arguments), vararg: null, kwarg: null, defaults: []});
    }
    __repr__() {
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
    __eq__(other) {
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
        import * as english_parser from 'english_parser';
        import * as pyc_emitter from 'pyc_emitter';
        args = english_parser.align_args(args, (this.object || this.scope), this);
        return pyc_emitter.eval_ast([this, new FunctionCall(this.name, args)], args);
    }
}
class FunctionCall extends ast.Assign {
    constructor(func = null, arguments = null, object = null, ...margs) {
        if (((func instanceof Function) || ((typeof func) === "function"))) {
            func = func.__name__;
        }
        if ((func instanceof FunctionDef)) {
            func = func.name;
        }
        func = (_pj.in_es6("func", args) ? args["func"] : func);
        func = (_pj.in_es6("name", args) ? args["name"] : func);
        this.func = func;
        this.name = func;
        this.arguments = (_pj.in_es6("arguments", args) ? args["arguments"] : arguments);
        this.object = object;
        if (_pj.in_es6("scope", args)) {
            this.scope = args["scope"];
        }
        if (_pj.in_es6("class", args)) {
            this.clazz = args["class"];
        }
        if (_pj.in_es6("module", args)) {
            this.clazz = (this.clazz || args["module"]);
        }
        if (((func instanceof str) || (func instanceof extensions.unicode))) {
            func = kast.name(func);
        }
        if ((! (func instanceof kast.Name))) {
            throw new Error(("NOT A NAME %s" % func));
        }
        this.targets = [new kast.Name({id: "it", ctx: new ast.Store()})];
        if ((this.arguments === null)) {
            this.arguments = [];
        } else {
            if ((! ((this.arguments instanceof list) || (this.arguments instanceof dict)))) {
                this.arguments = [this.arguments];
            }
        }
        if (_pj.in_es6("returns", args)) {
            this.returns = this.return_type = args["returns"];
        } else {
            this.returns = this.return_type = this.resolve_return_type();
        }
        if (this.object) {
            this.value = kast.call_attribute(kast.name(this.object), func.id, this.arguments);
        } else {
            this.value = kast.call(func, this.arguments);
        }
    }
    __repr__() {
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
class Argument extends kast.arg {
    constructor(...margs) {
        var args;
        if ((! args)) {
            args = margs[0];
        }
        this.name = (_pj.in_es6("name", args) ? args["name"] : null);
        this.preposition = (_pj.in_es6("preposition", args) ? args["preposition"] : null);
        this.position = (_pj.in_es6("position", args) ? args["position"] : 0);
        this.type = (_pj.in_es6("type", args) ? args["type"] : null);
        this.defaulty = (_pj.in_es6("default", args) ? args["default"] : null);
        this.value = (_pj.in_es6("value", args) ? args["value"] : null);
        this.id = this.name;
    }
    __repr__() {
        if (this.value) {
            if ((! this.name)) {
                return this.value.toString();
            }
            return (this.name.toString() + this.value.toString());
        }
        return this.name.toString();
    }
    __eq__(other) {
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
class Variable extends kast.Name {
    constructor(...margs) {
        var args;
        if ((! args)) {
            args = margs[0];
        }
        this.name = args["name"];
        this.ctx = (_pj.in_es6("ctx", args) ? args["ctx"] : new ast.Load());
        this.value = (_pj.in_es6("value", args) ? args["value"] : null);
        this.type = (_pj.in_es6("type", args) ? args["type"] : Object.getPrototypeOf(this.value));
        this.scope = (_pj.in_es6("scope", args) ? args["scope"] : null);
        this.owner = (_pj.in_es6("owner", args) ? args["owner"] : null);
        this.owner = (_pj.in_es6("object", args) ? args["object"] : this.owner);
        this.modifier = (_pj.in_es6("modifier", args) ? args["modifier"] : null);
        this.finale = _pj.in_es6("final", args);
        this.typed = _pj.in_es6("typed", args);
    }
    __repr__() {
        return ("xzcv %s" % this.name).toString();
    }
    toString() {
        return ("xzcv %s" % this.name).toString();
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
    toString() {
        return ("<Variable %s %s=%s>" % [(this.type || ""), this.name, this.value]);
    }
    __repr__() {
        return ("<Variable %s %s=%s>" % [(this.type || ""), this.name, this.value]);
    }
    increase() {
        this.value = (this.value + 1);
        this.value;
    }
    __eq__(x) {
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
        if ((x instanceof list)) {
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
