// Generated automatically by nearley, version 2.19.5
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any {
    return d[0];
}
declare var ws: any;
declare var nl: any;
declare var variable: any;
declare var string: any;
declare var number: any;

const moo = require('moo');

let lexer = moo.compile({
    ws: { match: /[ \t]+/ },
    nl: { match: /[\n]+/, lineBreaks: true },
    comment: /\/\/.*?$/,
    number: /0|[1-9][0-9]*/,
    variable: /[a-zA-Z_]+[a-zA-Z_0-9]*/,
    string: /"(?:\\["\\]|[^\n"\\])*"/,
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
        '.',
        ';',
        ',',
        '>',
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
        { name: 'file$ebnf$1', symbols: [] },
        {
            name: 'file$ebnf$1',
            symbols: ['file$ebnf$1', 'statements'],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        { name: 'file', symbols: ['file$ebnf$1'] },
        { name: '_$ebnf$1', symbols: [] },
        {
            name: '_$ebnf$1',
            symbols: ['_$ebnf$1', lexer.has('ws') ? { type: 'ws' } : ws],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        { name: '_', symbols: ['_$ebnf$1'] },
        { name: '__$ebnf$1', symbols: [lexer.has('ws') ? { type: 'ws' } : ws] },
        {
            name: '__$ebnf$1',
            symbols: ['__$ebnf$1', lexer.has('ws') ? { type: 'ws' } : ws],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        { name: '__', symbols: ['__$ebnf$1'] },
        { name: '___', symbols: [lexer.has('nl') ? { type: 'nl' } : nl] },
        { name: 'ws', symbols: [lexer.has('ws') ? { type: 'ws' } : ws] },
        { name: 'statements', symbols: ['type'] },
        { name: 'statements', symbols: ['declaration'] },
        { name: 'statements', symbols: ['assignment'] },
        { name: 'statements', symbols: ['call'] },
        { name: 'statements', symbols: ['return'] },
        { name: 'statements', symbols: ['___'] },
        { name: 'statements', symbols: ['ws'] },
        {
            name: 'declaration$ebnf$1',
            symbols: ['type_member_init'],
            postprocess: id,
        },
        { name: 'declaration$ebnf$1', symbols: [], postprocess: () => null },
        {
            name: 'declaration',
            symbols: [
                { literal: 'let' },
                '__',
                'varName',
                '_',
                'declaration$ebnf$1',
                '_',
                '___',
            ],
        },
        {
            name: 'assignment',
            symbols: ['varName', '_', 'type_member_init', '_', '___'],
        },
        {
            name: 'call',
            symbols: [
                'varName',
                '_',
                { literal: '(' },
                '_',
                { literal: ')' },
                '_',
                '___',
            ],
        },
        { name: 'return', symbols: [{ literal: 'return' }, '_', '___'] },
        {
            name: 'type',
            symbols: [
                { literal: 'type' },
                '_',
                'varName',
                '_',
                { literal: '=' },
                '_',
                'type_value',
            ],
        },
        { name: 'type_value$ebnf$1', symbols: [] },
        {
            name: 'type_value$ebnf$1',
            symbols: ['type_value$ebnf$1', 'type_member'],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        {
            name: 'type_value',
            symbols: [
                { literal: '{' },
                '_',
                '___',
                'type_value$ebnf$1',
                '_',
                { literal: '}' },
            ],
        },
        {
            name: 'type_member$ebnf$1',
            symbols: ['type_member_init'],
            postprocess: id,
        },
        { name: 'type_member$ebnf$1', symbols: [], postprocess: () => null },
        {
            name: 'type_member',
            symbols: [
                '_',
                'varName',
                '_',
                { literal: ':' },
                '_',
                'varName',
                '_',
                'type_member$ebnf$1',
                '___',
            ],
        },
        {
            name: 'type_member',
            symbols: ['_', 'varName', '_', 'type_member_init', '___'],
        },
        { name: 'type_member_init', symbols: [{ literal: '=' }, '_', 'value'] },
        {
            name: 'varName',
            symbols: [lexer.has('variable') ? { type: 'variable' } : variable],
        },
        {
            name: 'string',
            symbols: [lexer.has('string') ? { type: 'string' } : string],
        },
        {
            name: 'number',
            symbols: [lexer.has('number') ? { type: 'number' } : number],
        },
        { name: 'value', symbols: ['varName'] },
        { name: 'value', symbols: ['string'] },
        { name: 'value', symbols: ['number'] },
        { name: 'value', symbols: ['number', { literal: '.' }, 'number'] },
        { name: 'value', symbols: ['function'] },
        { name: 'function$ebnf$1', symbols: [] },
        {
            name: 'function$ebnf$1',
            symbols: ['function$ebnf$1', 'statements'],
            postprocess: (d) => d[0].concat([d[1]]),
        },
        {
            name: 'function',
            symbols: [
                { literal: '(' },
                '_',
                { literal: ')' },
                '_',
                { literal: '=' },
                { literal: '>' },
                '_',
                { literal: '{' },
                '_',
                '___',
                'function$ebnf$1',
                { literal: '}' },
            ],
        },
    ],
    ParserStart: 'file',
};

export default grammar;
