let {
	block,
	checkNewline,
	raiseNewline,
	raiseEnd,
	dont_interpret,
	look_1_ahead,
	maybe,
	maybe_indent,
	must_contain,
	must_not_start_with,
	must_contain_before_,
	must_contain_before,
	maybe_tokens,
	next_token,
	one_or_more,
	starts_with,
	tokens,
}=require('./power_parser')

let _=tokens

function loops() {
	return maybe(repeat_every_times) ||
		maybe(repeat_n_times) ||
		maybe(n_times_action) ||
		maybe(action_n_times) ||
		maybe(for_i_in_collection) ||
		maybe(repeat_with) ||
		maybe(while_loop) ||
		maybe(looped_action) ||
		maybe(looped_action_until) ||
		maybe(repeat_action_while) ||
		maybe(as_long_condition_block) ||
		maybe(forever) ||
		maybe(once) ||
		raise_not_matching("Not a loop");
}

function for_i_in_collection() {
	let b, c, v;
	must_contain("for");
	maybe_token("repeat");
	maybe_tokens(["for", "with"]);
	maybe_token("all");
	v = variable();
	maybe_tokens(["in", "from"]);
	c = collection();
	b = action_or_block();
	for (let i of c) {
		v.value = i;
		the.result = do_execute_block(b);
	}
	return the.result;
}

module.exports={loops}

function repeat_with() {
	(maybe_token("for") || (_("repeat") && _("with")));
	no_rollback();
	let v = variable();
	_("in");
	let c = collection();
	let b = action_or_block();
	if (interpreting()) {
		c.map(i => do_execute_block(b, i))
		return the.result;
	}
	return new ast.For({
		target: v,
		iter: c,
		body: b
	});
}

function while_loop() {
	maybe_tokens(["repeat"]);
	tokens(["while", "as long as"]);
	no_rollback();
	dont_interpret();
	let c = condition();
	allow_rollback();
	maybe_tokens(["repeat"]);
	maybe_tokens(["then"]);
	dont_interpret();
	let b = action_or_block();
	let r = false;
	adjust_interpret();
	if (!interpreting()) {
		return new ast.While({
			test: c,
			body: b
		});
	}
	while (check_condition(c)) {
		r = do_execute_block(b);
	}
	return r;
}

function until_loop() {
	maybe_tokens(["repeat"]);
	tokens(["until", "as long as"]);
	dont_interpret();
	no_rollback();
	let c = condition();
	maybe_tokens(["repeat"]);
	let b = action_or_block();
	let r = false;
	if (interpreting()) {
		while (!check_condition(c)) {
			r = do_execute_block(b);
		}
	}
	return r;
}

function repeat_every_times() {
	must_contain(time_words);
	dont_interpret();
	maybe_tokens(["repeat"]);
	action_or_block();
	let interval = datetime();
}

function repeat_action_while() {
	let b, c;
	_("repeat");
	if (the.current_word.match(/\s*while/)) {
		raise_not_matching("repeat_action_while != repeat_while_action", the.string);
	}
	b = action_or_block();
	_("while");
	c = condition();
	if (!interpreting()) {
		return new ast.While({
			test: c,
			body: b
		});
	}
	while (check_condition(c)) {
		the.result = do_execute_block(b);
	}
	return the.result;
}

function looped_action() {
	let a, c, r;
	must_not_start_with("while");
	must_contain(["as long as", "while"]);
	dont_interpret();
	maybe_tokens(["do", "repeat"]);
	a = action();
	tokens(["as long as", "while"]);
	c = condition();
	r = false;
	if (!interpreting()) {
		return a;
	}
	if (interpreting()) {
		while (check_condition(c)) {
			r = do_execute_block(a);
		}
	}
	return r;
}

function looped_action_until() {
	let a, b, c, r;
	must_contain("until");
	b = maybe_tokens(["do", "repeat"]);
	dont_interpret();
	a = (b ? action_or_block("until") : action());
	_("until");
	c = condition();
	r = false;
	if (!interpreting()) {
		return a;
	}
	if (interpreting()) {
		while (!check_condition(c)) {
			r = do_execute_block(a);
		}
	}
	return r;
}

function is_number(n) {
	return (str(n).parse_number() !== 0);
}

function action_n_times(a = null) {
	let n;
	must_contain("times");
	dont_interpret();
	maybe_tokens(["do"]);
	a = (a || action());
	n = number();
	_("times");
	end_block();
	if (interpreting()) {
		Number(n).times(() => {
			return do_evaluate(a);
		});
	} else {
		todo("action_n_times");
	}
	return a;
}

function n_times_action() {
	let a, n;
	must_contain("times");
	n = number();
	_("times");
	no_rollback();
	maybe_tokens(["do", "repeat"]);
	dont_interpret();
	a = action_or_block();
	if (interpreting()) {
		xint(n).times_do(() => {
			return do_evaluate(a);
		});
	}
	return a;
}
function repeat_n_times() {
	let b, n;
	_("repeat");
	n = number();
	_("times");
	dont_interpret();
	no_rollback();
	b = action_or_block();
	adjust_interpret();
	if (interpreting()) {
		the.result = xint(n).times_do(() => {
			return do_execute_block(b);
		});
	} else {
		return new For(store("i"), call("range", [zero, n]), [assign("it", b)]);
	}
	return the.result;
}

function forever(a = null) {
	must_contain("forever");
	a = (a || action());
	_("forever");
	if (interpreting()) {
		// noinspection InfiniteLoopJS
		while (true) {
			do_execute_block(a);
		}
	}
}

function as_long_condition_block() {
	let a, c;
	_("as long as");
	c = condition();
	if (!c) {
		dont_interpret();
	}
	a = action_or_block();
	if (interpreting()) {
		while (check_condition(c)) {
			do_execute_block(a);
		}
	}
}

function once() {
	return (maybe(once_trigger) || action_once());
}

function once_trigger() {
	let b, c;
	tokens(once_words);
	no_rollback();
	dont_interpret();
	c = (maybe(future_event) || condition());
	maybe_token("then");
	b = action_or_block();
	return todo("add_trigger(c, b);")
}

function action_once() {
	let b, c;
	if (!maybe_tokens("do")) must_contain(once_words);
	no_rollback();
	maybe_newline();
	b = action_or_block();
	tokens(once_words);
	c = condition();
	end_expression();
	interpretation.add_trigger(c, b);
}


function future_event() {// once beeped ... todo G
	if (the.current_word.endswith("ed")) {
		return word();
	}
}




module.exports={
	loops,
	repeat_with,
	while_loop,
	until_loop,
	repeat_every_times,
	repeat_action_while,
	looped_action,
	looped_action_until,
	is_number,
	action_n_times,
	n_times_action,
	repeat_n_times,
	forever,
	as_long_condition_block,
}