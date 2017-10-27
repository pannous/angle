let {
	adjust_interpret,
	block,
	checkNewline,
	raiseNewline,
	dont_interpret,
	look_1_ahead,
	maybe,
	maybe_indent,
	must_not_start_with,
	must_contain_before_,
	must_contain_before,
	maybe_token,
	maybe_tokens,
	must_contain,
	next_token,
	one_or_more,
	raiseEnd,
	starts_with,
	skip_comments,
	tokens,
}= require('./power_parser')

// let {word} = require('./values')

function that_do() {
	let comp, s;
	tokens(["that", "who", "which"]);
	star(adverb);
	comp = verb;
	maybe_token("s");
	s = star(() => {
		return (maybe(adverb) || maybe(preposition) || maybe(endNoun));
	});
	return comp;
}

function more_comparative() {
	tokens(["more", "less", "equally"]);
	return adverb();
}

function as_adverb_as() {
	let a;
	_("as");
	a = adverb();
	_("as");
	return a;
}


function null_comparative() {
	let c;
	verb();
	c = comparative();
	endNode();
	if (c.startsWith("more") || c.ends_with("er")) {
		return c;
	}
}

function than_comparative() {
	comparative();
	_("than");
	return (maybe(adverb) || endNode());
}

function comparative() {
	let c, comp;
	c = (maybe(more_comparative) || adverb);
	if ((c.startsWith("more") || maybe(() => {
			return c.ends_with("er");
		}))) {
		comp = c;
	}
	return c;
}

function that_are() {
	let comp;
	tokens(["that", "which", "who"]);
	tokens(be_words)
	comp = maybe(adjective);
	(comp || maybe(compareNode) || gerund());
	return comp;
}

function that_object_predicate() {
	let s;
	tokens(["that", "which", "who", "whom"]);
	(maybe(pronoun) || endNoun());
	verbium();
	s = star(() => {
		return (maybe(adverb) || maybe(preposition) || maybe(endNoun));
	});
	return s;
}

function that() {
	let filter;
	filter = (maybe(that_do) || maybe(that_are) || whose());
	return filter;
}

function where() {
	tokens(["where"]);
	return condition();
}

function selector() {
	let x;
	if (checkEndOfLine()) {
		return;
	}
	x = maybe(compareNode) || maybe(where) || maybe(that) || maybe(token("of") && endNode) || preposition && nod;
	if (context.use_tree) {
		return parent_node();
	}
	return x;
}

function verb_comparison() {
	let comp;
	star(adverb);
	comp = verb();
	maybe(preposition);
	return comp;
}

function comparison_word() {
	let comp;
	comp = (maybe(verb_comparison) || comparation());
	return comp;
}

function noun(include = []) {
	let a;
	a = maybe_tokens(article_words);
	if (!a) {
		must_not_start_with(keywords, include);
	}
	// if (!context.use_wordnet) {
	// 	return word(include);
	// }
	if (the.current_word.in(the.nouns)) {
		return the.current_word;
	}
	raise_not_matching("noun");
}

function verb() {
	let found_verb;
	// no_keyword_except(remove_from_list(system_verbs, be_words));
	found_verb = maybe_tokens(((other_verbs + system_verbs + the.verbs) - be_words) - ["do"]);
	if (!found_verb) {
		raise_not_matching("no verb");
	}
	return found_verb;
}

function adjective() {
	return tokens(the.adjectives);
}


function attribute() {
	return tokens(attributes);
}

function preposition() {
	return tokens(prepositions);
}

function pronoun() {
	return tokens(pronouns);
}


function wordnet_is_adverb() {
}

function adverb() {
	let found_adverb;
	no_keyword_except(adverbs);
	found_adverb = maybe_tokens(adverbs);
	if (!found_adverb) {
		raise_not_matching("no adverb");
	}
	return found_adverb;
}


function drop_plural(x) {
	if (x.endswith("s")) {
		return x.slice(0, (-1));
	}
	return x;
}

module.exports = {
	adjective,
	adverb,
	attribute,
	drop_plural,
	noun,
	preposition,
	pronoun,
	verb,
	wordnet_is_adverb,
}
