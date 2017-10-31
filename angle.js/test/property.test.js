#!/usr/bin/env python;


class PropertyTest extends (ParserBaseTest) {

	test_property_of_known() {
		parse(`a={}`);
		init('a.b=3');
		parser.property();
		assert_result_is(`a.b`, 3);
	}

	test_property_of_unknown_forbidden() {
		assert_has_error('z.b=3')
	}

	test_property_of_unknown_allowed() {
		skip();
		init('z.b=3');
		parser.property();
		assert_result_is(`z.b`, 3);
	}

	test_property() {
		assert_result_is(`x={};x.a=7;x.a`, 7);
	}

	test_property_index() {
		assert_result_is(`x={};x.a=7;x['a']`, 7);
		assert_result_is(`x={};x.a=7;x[a]`, 7);
	}

	test_property_from_type() {
		init('x is a map');
		x = parser.setter();
		assert(x.type == dict)
		assert_result_is(`x is a map;x.a=7;x.a`, 7);
	}

	test_property_from_empty_declaration() {
		x = parse(`map x`);
		assert(x == {}) //  variable results return resolved!
		// assert x.type == dict
		// assert x.value == {}
	}

	test_property_from_type2() {
		assert_result_is(`map y;y.a=7;y.a`, 7);
	}

	test_property_of_object() {
		init('x is an object') // 'object' object has no attribute 'a' :(
		x = parser.setter();
		assert(x.type == object)
		assert_result_is(`x is an object;x.a=7;x.a`, 7);
	}

	test_property3() {
		assert_result_is(`x={};a of x is 7;x.a`, 7);
	}

	test_property_s() {
		assert_result_is(`x={};x's a is 7;x.a`, 7);
	}
	test_auto_property() {
		assert_result_is(`a of x is 7;x.a`, 7);
	}

	test_auto_property_s() {
		assert_result_is(`x's a is 7;x.a`, 7);
	}

	test_relations() {
		[bill, mary] = parse(` bill's parent is mary `);
		assert_equals(bill.parent, mary);
	}

	test_relations() {
		[bill, mary, john] = parse(`
		bill's parent is mary
		parent or mary is john
		[bill,mary,john]
		`);
		assert_equals(bill.parent, mary);
	};
}

register(PropertyTest, module)