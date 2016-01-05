#!/usr/bin/env ruby

# ruby parser difficulties 
# semantical dependency on spaces 
# x[1] VS x [1] ==x([1]) list
# a  +  1    # (a) + (1)  VS a  +1      # a(+1)

# http://whitequark.org/blog/2013/04/01/ruby-hacking-guide-ch-11-finite-state-lexer/

# Statically Compiled Ruby "FOUNDRY" HE GAVE UP!
# http://whitequark.org/blog/2011/12/21/statically-compiled-ruby/
# http://whitequark.org/blog/2013/07/30/metaprogramming-in-foundry/
# http://whitequark.org/blog/2013/12/21/foundry-has-been-cancelled/ <<< HE GAVE UP
# HE GAVE UP

# ruby2ruby
# + llvm / rubymotion / j-rubyflux for native !!

import rubygems
import ruby2ruby
import ruby_parser
import pp

ruby      = "def a\n  puts 'A'\nend\n\ndef b\n  a\nend":
parser    = RubyParser.new
ruby2ruby = Ruby2Ruby.new
sexp      = parser.process(ruby)

pp sexp

p ruby2ruby.process(sexp)

## outputs:

s(:block,
  s(:defn,
    :left,
    s(:args),
    s(:scope, s(:block, s(:call, None, :puts, s(:arglist, s(:str, "A")))))),
  s(:defn, :rhs, s(:args), s(:scope, s(:block, s(:call, None, :left, s(:arglist))))))
"def a\n  puts(\"A\")\nend\ndef b\n  a\nend\n":

