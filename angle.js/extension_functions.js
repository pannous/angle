True = true;
False = false;

function Max(a, b) {
    if ((a > b)) {
        return a;
    }
    return b;
}

function Min(a, b) {
    if ((a > b)) {
        return b;
    }
    return a;
}

function rand(n = 1) {
    return (_random() * n);
}

function random(n = 1) {
    return (_random() * n);
}

function random_array(l) {
    return np.random.rand(l);
}

function random_matrix(x, y) {
    return np.random.rand(x, y);
}

function pick(xs) {
    return xs[randint(xs.length)];
}

function readlines(source) {
    console.log("open(source).readlines()");
    return map(str.strip, open(source).readlines());
}

function reverse(x) {
    var y;
    y = x.reverse();
    return (y || x);
}

function h(x) {
    help(x);
}

function log(msg) {
    console.log(msg);
}

function fold(x, fun) {
    if ((!((fun instanceof Function) || ((typeof fun) === "function")))) {
        [fun, x] = [x, fun];
    }
    return reduce(fun, this, x);
}

function last(xs) {
    return xs.slice((-1))[0];
}

function Pow(x, y) {
    return Math.pow(x, y);
}

is_string = function is_string(s) {
    return (s instanceof String)
}

function flatten(l) {
    if (((l instanceof list) || (l instanceof tuple))) {
        for (var k, _pj_c = 0, _pj_a = l, _pj_b = _pj_a.length;
            (_pj_c < _pj_b); _pj_c += 1) {
            k = _pj_a[_pj_c];
            if ((k instanceof list)) {
                l.remove(k);
                l.append(...k);
            }
        }
    } else {
        return [l];
    }
    return l;
}

function square(x) {
    if ((x instanceof list)) {
        return map(square, x);
    }
    return (x * x);
}

function puts(x) {
    console.log(x);
    return x;
}

function increase(x) {
    // import * as nodes from 'nodes';
    if ((x instanceof nodes.Variable)) {
        x.value = (x.value + 1);
        return x.value;
    }
    return (x + 1);
}

function grep(xs, x) {
    if ((x instanceof list)) {
        return filter(function (y) {
            return _pj.in_es6(x[0], y.toString());
        }, xs);
    }
    return filter(function (y) {
        return _pj.in_es6(x, y.toString());
    }, xs);
}

function ls(mypath = ".") {
    return list(os.listdir(mypath));
}

function length() {
    return this.length;
}

function say(x) {
    console.log(x);
    os.system(("say '%s'" % x));
}

function bash(x) {
    os.system(x);
}

function beep() {
    console.log("\u0007BEEP ");
}

function beep(bug = true) {
    console.log("\u0007BEEP ");
    if ((!context.testing)) {
        os.system("say 'beep'");
    }
    return "beeped";
}

function match_path(p) {
    var m;
    if ((!(p instanceof str))) {
        return false;
    }
    m = re.search("^(\\/[\\w\\'\\.]+)", p);
    if ((!m)) {
        return false;
    }
    return m;
}

function regex_match(a, b) {
    var NONE, match;
    NONE = "None";
    match = regex_matches(a, b);
    if (match) {
        try {
            return a.slice(match.start(), match.end()).strip();
        } catch (e) {
            return b.slice(match.start(), match.end()).strip();
        }
    }
    return NONE;
}

function regex_matches(a, b) {
    if ((a instanceof re._pattern_type)) {
        return a.search(b);
    }
    if ((b instanceof re._pattern_type)) {
        return b.search(a);
    }
    if ((is_string(a) && (a.length > 0))) {
        if ((a[0] === "/")) {
            return re.compile(a).search(b);
        }
    }
    if ((is_string(b) && (b.length > 0))) {
        if ((b[0] === "/")) {
            return re.compile(b).search(a);
        }
    }
    try {
        b = re.compile(b);
    } catch (e) {
        console.log(("FAILED: re.compile(%s)" % b));
        b = re.compile(b.toString());
    }
    console.log(a);
    console.log(b);
    return b.search(a.toString());
}

function is_file(p, must_exist = true) {
    var m;
    if ((!(p instanceof str))) {
        return false;
    }
    if (re.search("^\\d*\\.\\d+", p)) {
        return false;
    }
    if (re.match("^\\d*\\.\\d+", p.toString())) {
        return false;
    }
    m = re.search("^(\\/[\\w\\'\\.]+)", p);
    m = (m || re.search("^([\\w\\/\\.]*\\.\\w+)", p));
    if ((!m)) {
        return false;
    }
    return (((must_exist && m) && os.path.isfile(m.string)) || m);
}

function is_dir(x, must_exist = true) {
    var m;
    m = match_path(x);
    return (((must_exist && m) && os.path.isdirectory(m[0])) || m);
}

function is_a(clazz) {
    var className, ok;
    if ((this === clazz)) {
        return true;
    }
    try {
        ok = (this instanceof clazz);
        if (ok) {
            return true;
        }
    } catch (e) {
        console.log(e);
    }
    className = clazz.toString().lower();
    if ((className === this.toString().lower())) {
        return true;
    }
    if (this.is(clazz)) {
        return true;
    }
    return false;
}

function grep(xs, pattern) {
    return filter(pattern, xs);
}

function _in(x, xs) {
    return xs.has(x)
}
//# sourceMappingURL=extension_functions.js.map