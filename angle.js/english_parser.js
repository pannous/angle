let {
	block,
	checkNewline,
	dont_interpret,
	look_1_ahead,
	maybe,
	maybe_indent,
	must_contain_before_,
	must_contain_before,
	maybe_tokens,
	starts_with,
	tokens,
}= require('./power_parser')

function noun(include = []) {
	let a;
	a = maybe_tokens(article_words);
	if (!a) {
		must_not_start_with(list(keywords) - include);
	}
	if (!context.use_wordnet) {
		return word(include);
	}
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
