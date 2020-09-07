
@builtin "number.ne"

@{%
    const moo = require("moo");

    let lexer = moo.compile({
      ws:{match: /[ \t]+/},
      nl:{match: /[\n]+/, lineBreaks: true},
      comment: /\/\/.*?$/,
      number:  /0|[1-9][0-9]*/,
      variable: /[a-zA-Z_]+[a-zA-Z_0-9]*/,
      string:  /"(?:\\["\\]|[^\n"\\])*"/,
      keyword: [
          'while', 
          'if', 
          'else', 
          'contract', 
          'type',
          'let',
          'return',
          '{', 
          '}', 
          ':',
          '=',
          '(',
          ')',
          ".",
          ';',
          ',',
          '>'
          ],
    })

%}

@preprocessor typescript
@lexer lexer

file ->  statements:* 

_ -> %ws:*

__ -> %ws:+

___ -> %nl 

ws -> %ws

statements -> type  | declaration | assignment | call | return | ___ | ws

declaration -> "let" __ varName _ type_member_init:? _ ___

assignment -> varName _ type_member_init _ ___

call -> varName _ "(" _ ")" _ ___

return -> "return" _ ___

type ->  "type" _ varName _  "=" _ type_value

type_value -> "{" _ ___ type_member:* _ "}"

type_member -> _ varName _ ":" _ varName _ type_member_init:? ___ | _ varName _ type_member_init ___

type_member_init -> "=" _ value

varName -> %variable

string -> %string

number -> %number

value -> varName | string | number | number "." number | function

function ->  "(" _ ")" _ "=" ">" _ "{" _ ___ statements:* "}"

