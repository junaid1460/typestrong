// Generated automatically by nearley, version 2.19.5
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
    return d[0];
}
declare var WS: any;
declare var variable: any;
declare var number: any;
declare var string: any;

const moo = require('moo');

let lexer = moo.compile({
    WS: { match: /[ \t\n]+/, lineBreaks: true },
    comment: /\/\/.*?$/,
    number: /0|[1-9][0-9]*/,
    variable: /[a-zA-Z_]+[a-zA-Z_0-9]*/,
    string: /"(?:\\["\\]|[^\n"\\])*"/,
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
        '.',
    ],
});

interface NearleyToken {
    value: any;
    [key: string]: any;
}

interface NearleyLexer {
    reset: (chunk: string, info: any) => void;
    next: () => NearleyToken | undefined;
    save: () => any;
    formatError: (token: NearleyToken) => string;
    has: (tokenType: string) => boolean;
}

interface NearleyRule {
    name: string;
    symbols: NearleySymbol[];
    postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

type NearleySymbol =
    | string
    | { literal: any }
    | { test: (token: any) => boolean };

interface Grammar {
    Lexer: NearleyLexer | undefined;
    ParserRules: NearleyRule[];
    ParserStart: string;
}

const grammar: Grammar = {
    Lexer: lexer,
    ParserRules: [
        { name: 'unsigned_int$ebnf$1', symbols: [/[0-9]/] },
        {
            name: 'unsigned_int$ebnf$1',
            symbols: ['unsigned_int$ebnf$1', /[0-9]/],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        {
            name: 'unsigned_int',
            symbols: ['unsigned_int$ebnf$1'],
            postprocess: function (d) {
                return parseInt(d[0].join(''));
            },
        },
        { name: 'int$ebnf$1$subexpression$1', symbols: [{ literal: '-' }] },
        { name: 'int$ebnf$1$subexpression$1', symbols: [{ literal: '+' }] },
        {
            name: 'int$ebnf$1',
            symbols: ['int$ebnf$1$subexpression$1'],
            postprocess: id,
        },
        { name: 'int$ebnf$1', symbols: [], postprocess: () => null },
        { name: 'int$ebnf$2', symbols: [/[0-9]/] },
        {
            name: 'int$ebnf$2',
            symbols: ['int$ebnf$2', /[0-9]/],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        {
            name: 'int',
            symbols: ['int$ebnf$1', 'int$ebnf$2'],
            postprocess: function (d) {
                if (d[0]) {
                    return parseInt(d[0][0] + d[1].join(''));
                } else {
                    return parseInt(d[1].join(''));
                }
            },
        },
        { name: 'unsigned_decimal$ebnf$1', symbols: [/[0-9]/] },
        {
            name: 'unsigned_decimal$ebnf$1',
            symbols: ['unsigned_decimal$ebnf$1', /[0-9]/],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        {
            name: 'unsigned_decimal$ebnf$2$subexpression$1$ebnf$1',
            symbols: [/[0-9]/],
        },
        {
            name: 'unsigned_decimal$ebnf$2$subexpression$1$ebnf$1',
            symbols: [
                'unsigned_decimal$ebnf$2$subexpression$1$ebnf$1',
                /[0-9]/,
            ],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        {
            name: 'unsigned_decimal$ebnf$2$subexpression$1',
            symbols: [
                { literal: '.' },
                'unsigned_decimal$ebnf$2$subexpression$1$ebnf$1',
            ],
        },
        {
            name: 'unsigned_decimal$ebnf$2',
            symbols: ['unsigned_decimal$ebnf$2$subexpression$1'],
            postprocess: id,
        },
        {
            name: 'unsigned_decimal$ebnf$2',
            symbols: [],
            postprocess: () => null,
        },
        {
            name: 'unsigned_decimal',
            symbols: ['unsigned_decimal$ebnf$1', 'unsigned_decimal$ebnf$2'],
            postprocess: function (d) {
                return parseFloat(
                    d[0].join('') + (d[1] ? '.' + d[1][1].join('') : '')
                );
            },
        },
        {
            name: 'decimal$ebnf$1',
            symbols: [{ literal: '-' }],
            postprocess: id,
        },
        { name: 'decimal$ebnf$1', symbols: [], postprocess: () => null },
        { name: 'decimal$ebnf$2', symbols: [/[0-9]/] },
        {
            name: 'decimal$ebnf$2',
            symbols: ['decimal$ebnf$2', /[0-9]/],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        { name: 'decimal$ebnf$3$subexpression$1$ebnf$1', symbols: [/[0-9]/] },
        {
            name: 'decimal$ebnf$3$subexpression$1$ebnf$1',
            symbols: ['decimal$ebnf$3$subexpression$1$ebnf$1', /[0-9]/],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        {
            name: 'decimal$ebnf$3$subexpression$1',
            symbols: [
                { literal: '.' },
                'decimal$ebnf$3$subexpression$1$ebnf$1',
            ],
        },
        {
            name: 'decimal$ebnf$3',
            symbols: ['decimal$ebnf$3$subexpression$1'],
            postprocess: id,
        },
        { name: 'decimal$ebnf$3', symbols: [], postprocess: () => null },
        {
            name: 'decimal',
            symbols: ['decimal$ebnf$1', 'decimal$ebnf$2', 'decimal$ebnf$3'],
            postprocess: function (d) {
                return parseFloat(
                    (d[0] || '') +
                        d[1].join('') +
                        (d[2] ? '.' + d[2][1].join('') : '')
                );
            },
        },
        {
            name: 'percentage',
            symbols: ['decimal', { literal: '%' }],
            postprocess: function (d) {
                return d[0] / 100;
            },
        },
        {
            name: 'jsonfloat$ebnf$1',
            symbols: [{ literal: '-' }],
            postprocess: id,
        },
        { name: 'jsonfloat$ebnf$1', symbols: [], postprocess: () => null },
        { name: 'jsonfloat$ebnf$2', symbols: [/[0-9]/] },
        {
            name: 'jsonfloat$ebnf$2',
            symbols: ['jsonfloat$ebnf$2', /[0-9]/],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        { name: 'jsonfloat$ebnf$3$subexpression$1$ebnf$1', symbols: [/[0-9]/] },
        {
            name: 'jsonfloat$ebnf$3$subexpression$1$ebnf$1',
            symbols: ['jsonfloat$ebnf$3$subexpression$1$ebnf$1', /[0-9]/],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        {
            name: 'jsonfloat$ebnf$3$subexpression$1',
            symbols: [
                { literal: '.' },
                'jsonfloat$ebnf$3$subexpression$1$ebnf$1',
            ],
        },
        {
            name: 'jsonfloat$ebnf$3',
            symbols: ['jsonfloat$ebnf$3$subexpression$1'],
            postprocess: id,
        },
        { name: 'jsonfloat$ebnf$3', symbols: [], postprocess: () => null },
        {
            name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$1',
            symbols: [/[+-]/],
            postprocess: id,
        },
        {
            name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$1',
            symbols: [],
            postprocess: () => null,
        },
        { name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$2', symbols: [/[0-9]/] },
        {
            name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$2',
            symbols: ['jsonfloat$ebnf$4$subexpression$1$ebnf$2', /[0-9]/],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        {
            name: 'jsonfloat$ebnf$4$subexpression$1',
            symbols: [
                /[eE]/,
                'jsonfloat$ebnf$4$subexpression$1$ebnf$1',
                'jsonfloat$ebnf$4$subexpression$1$ebnf$2',
            ],
        },
        {
            name: 'jsonfloat$ebnf$4',
            symbols: ['jsonfloat$ebnf$4$subexpression$1'],
            postprocess: id,
        },
        { name: 'jsonfloat$ebnf$4', symbols: [], postprocess: () => null },
        {
            name: 'jsonfloat',
            symbols: [
                'jsonfloat$ebnf$1',
                'jsonfloat$ebnf$2',
                'jsonfloat$ebnf$3',
                'jsonfloat$ebnf$4',
            ],
            postprocess: function (d) {
                return parseFloat(
                    (d[0] || '') +
                        d[1].join('') +
                        (d[2] ? '.' + d[2][1].join('') : '') +
                        (d[3] ? 'e' + (d[3][1] || '+') + d[3][2].join('') : '')
                );
            },
        },
        { name: 'statements', symbols: ['function', 'statements'] },
        { name: 'statements', symbols: ['declaration', 'statements'] },
        { name: 'statements', symbols: ['contract', 'statements'] },
        {
            name: 'statements',
            symbols: [lexer.has('WS') ? { type: 'WS' } : WS, 'statements'],
        },
        { name: '_$ebnf$1', symbols: [] },
        {
            name: '_$ebnf$1',
            symbols: ['_$ebnf$1', lexer.has('WS') ? { type: 'WS' } : WS],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        { name: '_', symbols: ['_$ebnf$1'] },
        { name: '__$ebnf$1', symbols: [lexer.has('WS') ? { type: 'WS' } : WS] },
        {
            name: '__$ebnf$1',
            symbols: ['__$ebnf$1', lexer.has('WS') ? { type: 'WS' } : WS],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        { name: '__', symbols: ['__$ebnf$1'] },
        { name: 'contract$ebnf$1', symbols: [] },
        {
            name: 'contract$ebnf$1',
            symbols: ['contract$ebnf$1', 'type_declaration'],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        {
            name: 'contract',
            symbols: [
                { literal: 'contract' },
                '_',
                'name',
                '_',
                { literal: '{' },
                '_',
                'contract$ebnf$1',
                '_',
                { literal: '}' },
            ],
        },
        {
            name: 'declaration',
            symbols: [{ literal: 'const' }, '_', 'const_declaration_body'],
        },
        {
            name: 'declaration',
            symbols: [{ literal: 'let' }, '_', 'let_declaration_body'],
        },
        {
            name: 'const_declaration_body',
            symbols: [
                'name',
                '_',
                { literal: ':' },
                '_',
                'name',
                '_',
                { literal: '=' },
                '_',
                'value',
            ],
        },
        {
            name: 'const_declaration_body',
            symbols: ['name', '_', { literal: '=' }, '_', 'value'],
        },
        {
            name: 'let_declaration_body',
            symbols: [
                'name',
                '_',
                { literal: ':' },
                '_',
                'name',
                '_',
                { literal: '=' },
                '_',
                'value',
            ],
        },
        {
            name: 'let_declaration_body',
            symbols: ['name', '_', { literal: '=' }, '_', 'value'],
        },
        {
            name: 'let_declaration_body',
            symbols: ['name', '_', { literal: ':' }, '_', 'name'],
        },
        { name: 'field_type', symbols: [{ literal: ':' }, '_', 'name'] },
        { name: 'function$ebnf$1', symbols: ['statements'], postprocess: id },
        { name: 'function$ebnf$1', symbols: [], postprocess: () => null },
        {
            name: 'function',
            symbols: [
                { literal: 'function' },
                '__',
                'name',
                '_',
                { literal: '(' },
                '_',
                'type_declaration',
                '_',
                { literal: ')' },
                '_',
                { literal: '{' },
                '_',
                'function$ebnf$1',
                '_',
                { literal: '}' },
            ],
        },
        {
            name: 'type_declaration',
            symbols: ['name', '_', { literal: ':' }, '_', 'name'],
        },
        {
            name: 'type_declaration',
            symbols: [
                'name',
                '_',
                { literal: ':' },
                '_',
                'name',
                '_',
                { literal: ',' },
                'type_declaration',
            ],
        },
        {
            name: 'name',
            symbols: [lexer.has('variable') ? { type: 'variable' } : variable],
        },
        { name: 'value', symbols: ['map'] },
        { name: 'value', symbols: ['list'] },
        { name: 'value', symbols: ['number'] },
        { name: 'value', symbols: ['string'] },
        {
            name: 'number',
            symbols: [lexer.has('number') ? { type: 'number' } : number],
        },
        {
            name: 'number',
            symbols: [
                lexer.has('number') ? { type: 'number' } : number,
                { literal: '.' },
                lexer.has('number') ? { type: 'number' } : number,
            ],
        },
        {
            name: 'string',
            symbols: [lexer.has('string') ? { type: 'string' } : string],
        },
        {
            name: 'map$ebnf$1',
            symbols: ['keyvalue_pair_list'],
            postprocess: id,
        },
        { name: 'map$ebnf$1', symbols: [], postprocess: () => null },
        {
            name: 'map',
            symbols: [{ literal: '{' }, 'map$ebnf$1', { literal: '}' }],
        },
        {
            name: 'keyvalue_pair',
            symbols: ['string', '_', { literal: ':' }, '_', 'value'],
        },
        {
            name: 'keyvalue_pair_list$ebnf$1',
            symbols: ['next_pair'],
            postprocess: id,
        },
        {
            name: 'keyvalue_pair_list$ebnf$1',
            symbols: [],
            postprocess: () => null,
        },
        {
            name: 'keyvalue_pair_list',
            symbols: ['keyvalue_pair', 'keyvalue_pair_list$ebnf$1'],
        },
        {
            name: 'next_pair',
            symbols: [{ literal: ',' }, '_', 'keyvalue_pair_list'],
        },
        {
            name: 'list',
            symbols: [
                { literal: '[' },
                '_',
                'list_values',
                '_',
                { literal: ']' },
            ],
        },
        {
            name: 'list_values$ebnf$1',
            symbols: ['next_value'],
            postprocess: id,
        },
        { name: 'list_values$ebnf$1', symbols: [], postprocess: () => null },
        { name: 'list_values', symbols: ['value', 'list_values$ebnf$1'] },
        { name: 'next_value', symbols: [{ literal: ',' }, '_', 'list_values'] },
    ],
    ParserStart: 'statements',
};

export default grammar;
