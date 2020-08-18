
@builtin "number.ne"

@{%
    const moo = require("moo");

    let lexer = moo.compile({
      WS:{match: /[ \t\n]+/, lineBreaks: true},
      comment: /\/\/.*?$/,
      number:  /0|[1-9][0-9]*/,
      variable: /[a-zA-Z_]+[a-zA-Z_0-9]*/,
      string:  /"(?:\\["\\]|[^\n"\\])*"/,
      keyword: ['while', 'if', 'else', 'contract', '{', '}'],
    })
    
%}

@lexer lexer

statements -> function statements | declaration statements | contract statements | %WS statements

contract ->  "contract" %WS:* name %WS:* "{" %WS:* type_declaration:* %WS:* "}"

declaration ->  "const" %WS:* const_declaration_body | "let" %WS:* let_declaration_body

const_declaration_body -> name _ ":" _ name _ "=" | name _  "="

let_declaration_body -> name _ ":" _ name _ "=" | name _  "=" | name _ ":" _ name

field_type -> ":" %WS:* name

function ->  "function" %WS:+ name %WS:* "(" %WS:* type_declaration %WS:* ")" %WS:* "{" %WS:* statements %WS:* "}"

type_declaration -> name %WS:* ":" %WS:* name | name %WS:* ":" %WS:* name %WS:* "," type_declaration

ws -> [\ \t]:+

ows -> [\ \t]:*

name -> %variable