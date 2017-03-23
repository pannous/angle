import * as kast from 'kast';
import * as events from 'events';
import * as the from 'context';
class Interpretation {
}
function add_trigger(condition, action) {
    import * as power_parser from 'power_parser';
    if (power_parser.interpreting()) {
        return the.listeners.append(new events.Observer(condition, action));
    } else {
        return kast.call("add_trigger", [condition, action]);
    }
}
function substitute_variables(args) {
    var value, variable;
    for (var variable, _pj_c = 0, _pj_a = the.variableValues.keys, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
        variable = _pj_a[_pj_c];
        if ((variable instanceof list)) {
            variable = variable.join(" ");
        }
        value = (the.variableValues[variable] || "None");
        args = args.replace(".\\{#{variable)\\)", "#{value)");
        args = args.replace("\\$#{variable)$", "#{value)");
        args = args.replace("\\$#{variable)([^\\w])", "#{value)\\\u0001");
        args = args.replace("^#{variable)$", "#{value)");
        args = args.replace("^#{variable)([^\\w])", "#{value)\\1");
        args = args.replace("([^\\w])#{variable)$", "\\1#{value)");
        args = args.replace("([^\\w])#{variable)([^\\w])", "\\1#{value)\\2");
    }
    return args;
}
function self_modify(v, mod, arg) {
    var val;
    val = v.value;
    if ((mod === "|=")) {
        the.result = (val | arg);
    }
    if ((mod === "||=")) {
        the.result = (val || arg);
    }
    if ((mod === "&=")) {
        the.result = (val & arg);
    }
    if ((mod === "&&=")) {
        the.result = (val && arg);
    }
    if ((mod === "+=")) {
        the.result = (val + arg);
    }
    if ((mod === "-=")) {
        the.result = (val - arg);
    }
    if ((mod === "*=")) {
        the.result = (val * arg);
    }
    if ((mod === "**=")) {
        the.result = Math.pow(val, arg);
    }
    if ((mod === "/=")) {
        the.result = (val / arg);
    }
    if ((mod === "%=")) {
        the.result = (val % arg);
    }
    if ((mod === "^=")) {
        the.result = (val ^ arg);
    }
    if ((mod === "<<")) {
        the.result = (val << arg);
    }
    if ((mod === ">>")) {
        the.result = (val >> arg);
    }
    return the.result;
}

//# sourceMappingURL=interpretation.js.map
