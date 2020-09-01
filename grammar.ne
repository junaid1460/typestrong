
@builtin "number.ne"

@{%
    const moo = require("moo");

    let lexer = moo.compile({
      WS:{match: /[ \t\n]+/, lineBreaks: true},
      comment: /\/\/.*?$/,
      number:  /0|[1-9][0-9]*/,
      variable: /[a-zA-Z_]+[a-zA-Z_0-9]*/,
      string:  /"(?:\\["\\]|[^\n"\\])*"/,
      keyword: [
          'while', 
          'if', 
          'else', 
          'contract', 
          '{', 
          '}', 
          ':',
          '=',
          '(',
          ')',
          "."
          ],
    })

%}

@preprocessor typescript
@lexer lexer

statements -> function statements | declaration statements | contract statements | %WS statements

_ -> %WS:*
__ -> %WS:+

contract ->  "contract" _ name _ "{" _ type_declaration:* _ "}"

declaration ->  "const" _ const_declaration_body | "let" _ let_declaration_body

const_declaration_body -> name _ ":" _ name _ "="  _  value | name _  "="  _  value

let_declaration_body -> name _ ":" _ name _ "="  _  value | name _  "="  _  value | name _ ":" _ name

field_type -> ":" _ name


function ->  "function" __ name _ "(" _ type_declaration _ ")" _ "{" _ statements:? _ "}"

type_declaration -> name _ ":" _ name | name _ ":" _ name _ "," type_declaration

name -> %variable

value -> map | list | number | string

number -> %number | %number "." %number

string -> %string

map ->  "{"  keyvalue_pair_list:?  "}"

keyvalue_pair ->  string _  ":" _ value

keyvalue_pair_list -> keyvalue_pair next_pair:?

next_pair -> "," _  keyvalue_pair_list 

list ->  "[" _  list_values _  "]"

list_values ->  value next_value:?

next_value -> "," _  list_values