#!/usr/bin/env python;
// var angle = require('angle');



class PackageTest extends (ParserBaseTest) {;

    test_using(){
        parser.dont_interpret();
        simple = parse(`depends on stdio`);
        assert_equals({'dependency': {'package': 'stdio', 'type': false, 'version': false, }, }, simple);
	    dependency = parse(`from numpy version >= 1.2.3 import a,b,c`);
	    dependency = parse(`import numpy version >= 1.2.3`);
	    dependency = parse(`import numpy version >= 1.2.3 as np`);
	    dependency = parse(`require numpy version >= 1.2.3`);
	    dependency = parse(`using c package stdio version >= 1.2.3`);
        console.log(dependency);
        assert_equals({'dependency': {'package': 'stdio', 'type': 'c', 'version': '>= 1.2.3', }, }, dependency);

    }
}

register(PackageTest, module)