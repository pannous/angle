#!/usr/bin/env python;
// var angle = require('angle');



class PackageTest extends (ParserBaseTest) {;

    test_using(){
        parser.dont_interpret();
        simple = parse(`depends on stdio`);
        assert_equals({'dependency': {'package': 'stdio', 'type': false, 'version': false, }, }, simple);
        dependency = parse(`using c package stdio version >= 1.2.3`);
        console.log(dependency);
        assert_equals({'dependency': {'package': 'stdio', 'type': 'c', 'version': '>= 1.2.3', }, }, dependency);

    }
}
