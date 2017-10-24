class Add {}
class Sub {}
class Mult {}
class Div {}
class BitXor {}
class Pow {}
class Mod {}
class Not {}
class And {}
class Or {}
class Gt {}
class GtE {}
class Lt {}
class LtE {}
class Eq {}
class BitOr {}
class NotEq {}
class In {}
class Num {}
class Str {}
class Compare{}
class FunctionDef{}
class Assign{}
class Name{}
class Load{}
class Store{}

// module.exports = [Add]
module.exports = {
  Add: Add,
  Sub: Sub,
  Mult: Mult,
  Div: Div,
  Eq: Eq,
  Gt: Gt,
  Or: Or,
  BitXor: BitXor,
  NotEq: NotEq,
  Mod: Mod,
  Not: Not,
  And: And,
  BitOr: BitOr,
  Pow: Pow,
  Gt: Gt,
  GtE: GtE,
  Lt: Lt,
  LtE: LtE,
  In: In,
	Name:Name,
    Load:Load,
    Store:Store,
	Num:Num,
    Str:Str,
	Compare:Compare,
	FunctionDef:FunctionDef,
    Assign:Assign
}