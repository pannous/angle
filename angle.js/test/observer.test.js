#!/usr/bin/env python;
// var angle = require('angle');


class ObserverTest extends (ParserBaseTest) {
	_test_every_date1() {
		parse(`every 1 seconds { say "Ja!" }`);
		parse(`every 2 seconds do say "OK"`);
		sleep(10000);
	}

	_test_every_date() {
		parse(`every 1 seconds do say "OK"`);
		parse(`beep every three seconds`);
		parse(`every two seconds puts "YAY"`);
		parse(`every minute puts "HURRAY"`);
		parse(`every five seconds do say "OK"`);
		sleep(10000);
	}

	test_whenever() {
		parse(`var x;beep whenever x is 5`);
		parse(`beep once x is 5`);
		parse(`once x is 5 do beep`);
		parse(`once x is 5 beep `);
		parse(`x is 5`);
	}

	test_whenever_2() {
		skip('test this later');
		parse(`whenever the clock shows five seconds do beep`);
		assert(self.result.equals('1/3'));

	}
}
