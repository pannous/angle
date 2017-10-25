// var angle = require('angle');
var angle = require('./angle_base_test');

class StringTest extends (ParserBaseTest) {
    test_string_methods(){
        parse(`invert "hi"`);
        self.assert_equals(the.result, 'ih');
        self.assert_that(`invert("hi") is 'ih'`);
        // self.assert_that("invert "hi" is 'ih'") # todo HIGHER BINDING OF CALL!
    }
    test_nth_word(){
        self.assert_that(`3rd word in 'hi my friend !!!' is 'friend'`);
        self.assert_that(`3rd word in 'hi my friend !!!' is 'friend'`);
    }
    _test_advanced_string_methods(){
        parse(`x="hi" inverted`);
        self.assert_that(the.result.equals('ih'));
        self.assert_equals('ih', self.variableValues['x']);
    }
    _test_select_character(){
        self.assert_that(`last character of "hi" is 'i'`);
        self.assert_that(`first character of "hi" is 'h'`);
        self.assert_that(`second character of "hi" is 'i'`);
    }
    _test_select_word(){
        self.assert_that(`first word of 'hi you' is "hi"`);
        self.assert_that(`second word of 'hi you' is 'you'`);
        self.assert_that(`last word of 'hi you' is 'you'`);
    }
    test_gerunds(){
        init('gerunding');
        x = parser.gerund();
        init('gerunded');
        x = parser.postjective();
        x;
    }
    test_concatenation(){
        parser.do_interpret();
        parse(`z is "hi" plus "world"`);
        self.assert_equals(the.variables['z'], 'HiWorld');
    }
    test_concatenation2(){
        parser.do_interpret();
        parse(`x is "hi"; y is "world";z is x plus y`);
        self.assert_equals(the.variables['z'], 'HiWorld');
    }
    test_concatenation_b(){
        init('x is "hi"');
        parser.setter();
        self.assert_equals("hi", the.variables['x']);
        init(`x + ' world'`);
        r = parser.algebra();
        self.assert_equals(r, 'hi world');
        parse(`x + ' world'`);
        self.assert_equals(result(), 'hi world');
        parse(`y is ' world'`);
        parse(`z is x + y`);
        self.assert_equals(the.variables['z'], 'hi world');
    }
    test_concatenation_b0(){
        parse(`x is "hi"`);
        parse(`y is ' you'\n       z is x + y`);
        // parse("y is ' you'\nz is x + y")
        self.assert_equals(the.variables['z'], 'hi you');
    }
    test_concatenation_b1(){
        init('x is "hi"');
        parser.setter();
        self.assert_equals("hi", the.variables['x']);
        init('x + " world"');
        r = parser.algebra();
        self.assert_equals(r, 'hi world');
        parse(`x + ' world'`);
        self.assert_equals(result(), 'hi world');
        parse(`y is ' world'`);
        parse(`z is x + y`);
        self.assert_equals(the.variables['z'], 'hi world');
    }
    test_concatenation_c(){
        parse(`x is "hi"`);
        parse(`y is ' you'`);
        parse(`z is x + y`);
        self.assert_equals(the.variables['z'], 'hi you');
    }
    test_newline_statements(){
        parse(`x is "hi";\n           z='ho'`);
        self.assert_equals(the.variables['z'], 'ho');
    }
    test_concatenation_c3(){
        parse(`x is "hi"`);
        parse(`y is ' you';z is x + y`);
        self.assert_equals(the.variables['z'], 'hi you');
    }
    DONT_test_concatenation_by_and(){
        parse(`z = x and y`);
        self.assert_equals('hi world', the.variables['z']);
        self.assert_that(`x and y == 'hi world'`);
        parse(`z is x and ' ' and y`);
        self.assert_that(`type of z is string or list`);
    }
    dont_test_list_concatenation(){
        init('"hi" " " "world"');
        z = parser.expressions();
        self.assert_equals(z, 'hi world');
        the.variables['x'] = ["hi", ];
        the.variables['y'] = ["world", ];
        init(`z=x ' ' y`);
        z = parser.setter();
        self.assert_equals(z, 'hi world');
        parse(`x is "hi"; y is "world";z is x ' ' y`);
        self.assert_that(`type of z is string or type of z is list`);
        self.assert_that(`type of z is string or list`);
        self.assert_equals(the.variables['z'], 'hi world');
        self.assert_that(`z is 'hi world' OR z is "hi",' ',"world"`);
    }
    test_concatenation2(){
        parse(`x is "hi"; y = ' world'`);
        self.assert_equals(the.variables['x'],"hi");
        self.assert_equals(the.variables['y'],' world');
        self.assert_equals(parse(`x + y`), `hi world`);
        self.assert_that(`x plus y == 'hi world'`);
    }
    test_concatenation2b(){
        self.assert_equals(parse(`"hi"+ ' '+"world"`), `hi world`);
        self.assert_result_is(`"hi"+ ' '+"world"`, 'hi world');
        parse(`x is "hi"; y is "world";z is x plus ' ' plus y`);
        self.assert_equals(the.variables['z'], 'hi world');
        self.assert_that(`z is 'hi world'`);
    }
    test_type(){
        parse(`x="hi"`);
        self.assert_result_is(`type of x`, String);
        self.assert_that(`type of x is string`);
    }
    test_type3(){
        parse(`x be 'hello world';`);
        self.assert_that(`x is a string`);
        self.assert_that(`type of x is string`);
        self.assert_that(`class of x is string`);
        self.assert_that(`kind of x is string`);
        parse(`yy= class of x`);
        self.assert_equals(str, the.variables['yy'].value);
        // self.assert_equals(Quote, the.variables['y'])
        self.assert_that(`yy is string`);
        parse(`yy is type of x`);
        self.assert_that(`yy is string`);
    }
    test_type1(){
        init('class of "hi"');
        parser.evaluate_property();
        self.assert_equals(result(), String);
        // self.assert_equals(result(), Quote)
        init('class of "hi"');
        parser.expression();
        self.assert_equals(result(), String);
        // self.assert_equals(result(), Quote)
        parse(`class of "hi"`);
        self.assert_equals(result(), String);
        // self.assert_equals(result(), Quote)
    }
    test_type2(){
        parse(`x="hi";\n      class of x`);
        parse(`x="hi";class of x`);
        self.assert_equals(result(), String);
        // self.assert_equals(result(), Quote)
    }
    test_result(){
        parse(`x be 'hello world';show x;x; class of x`);
        self.assert_that(`type of x is string`);
        self.assert_that(`class of x is string`);
        parse(`yy is type of x`);
        self.assert_that(`yy is string`);

    }
}
new StringTest()