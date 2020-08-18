// Generated automatically by nearley, version 2.19.5
// http://github.com/Hardmath123/nearley
(function () {
    function id(x) {
        return x[0];
    }

    const moo = require('moo');

    let lexer = moo.compile({
        WS: { match: /[ \t\n]+/, lineBreaks: true },
        comment: /\/\/.*?$/,
        number: /0|[1-9][0-9]*/,
        variable: /[a-zA-Z_]+[a-zA-Z_0-9]*/,
        string: /"(?:\\["\\]|[^\n"\\])*"/,
        keyword: ['while', 'if', 'else', 'contract', '{', '}'],
    });

    var grammar = {
        Lexer: lexer,
        ParserRules: [
            { name: 'unsigned_int$ebnf$1', symbols: [/[0-9]/] },
            {
                name: 'unsigned_int$ebnf$1',
                symbols: ['unsigned_int$ebnf$1', /[0-9]/],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
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
            {
                name: 'int$ebnf$1',
                symbols: [],
                postprocess: function (d) {
                    return null;
                },
            },
            { name: 'int$ebnf$2', symbols: [/[0-9]/] },
            {
                name: 'int$ebnf$2',
                symbols: ['int$ebnf$2', /[0-9]/],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
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
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
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
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
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
                postprocess: function (d) {
                    return null;
                },
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
            {
                name: 'decimal$ebnf$1',
                symbols: [],
                postprocess: function (d) {
                    return null;
                },
            },
            { name: 'decimal$ebnf$2', symbols: [/[0-9]/] },
            {
                name: 'decimal$ebnf$2',
                symbols: ['decimal$ebnf$2', /[0-9]/],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            {
                name: 'decimal$ebnf$3$subexpression$1$ebnf$1',
                symbols: [/[0-9]/],
            },
            {
                name: 'decimal$ebnf$3$subexpression$1$ebnf$1',
                symbols: ['decimal$ebnf$3$subexpression$1$ebnf$1', /[0-9]/],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
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
            {
                name: 'decimal$ebnf$3',
                symbols: [],
                postprocess: function (d) {
                    return null;
                },
            },
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
            {
                name: 'jsonfloat$ebnf$1',
                symbols: [],
                postprocess: function (d) {
                    return null;
                },
            },
            { name: 'jsonfloat$ebnf$2', symbols: [/[0-9]/] },
            {
                name: 'jsonfloat$ebnf$2',
                symbols: ['jsonfloat$ebnf$2', /[0-9]/],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            {
                name: 'jsonfloat$ebnf$3$subexpression$1$ebnf$1',
                symbols: [/[0-9]/],
            },
            {
                name: 'jsonfloat$ebnf$3$subexpression$1$ebnf$1',
                symbols: ['jsonfloat$ebnf$3$subexpression$1$ebnf$1', /[0-9]/],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
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
            {
                name: 'jsonfloat$ebnf$3',
                symbols: [],
                postprocess: function (d) {
                    return null;
                },
            },
            {
                name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$1',
                symbols: [/[+-]/],
                postprocess: id,
            },
            {
                name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$1',
                symbols: [],
                postprocess: function (d) {
                    return null;
                },
            },
            {
                name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$2',
                symbols: [/[0-9]/],
            },
            {
                name: 'jsonfloat$ebnf$4$subexpression$1$ebnf$2',
                symbols: ['jsonfloat$ebnf$4$subexpression$1$ebnf$2', /[0-9]/],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
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
            {
                name: 'jsonfloat$ebnf$4',
                symbols: [],
                postprocess: function (d) {
                    return null;
                },
            },
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
                            (d[3]
                                ? 'e' + (d[3][1] || '+') + d[3][2].join('')
                                : '')
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
            { name: 'contract$ebnf$1', symbols: [] },
            {
                name: 'contract$ebnf$1',
                symbols: [
                    'contract$ebnf$1',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'contract$ebnf$2', symbols: [] },
            {
                name: 'contract$ebnf$2',
                symbols: [
                    'contract$ebnf$2',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'contract$ebnf$3', symbols: [] },
            {
                name: 'contract$ebnf$3',
                symbols: [
                    'contract$ebnf$3',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'contract$ebnf$4', symbols: [] },
            {
                name: 'contract$ebnf$4',
                symbols: ['contract$ebnf$4', 'type_declaration'],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'contract$ebnf$5', symbols: [] },
            {
                name: 'contract$ebnf$5',
                symbols: [
                    'contract$ebnf$5',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            {
                name: 'contract',
                symbols: [
                    { literal: 'contract' },
                    'contract$ebnf$1',
                    'name',
                    'contract$ebnf$2',
                    { literal: '{' },
                    'contract$ebnf$3',
                    'contract$ebnf$4',
                    'contract$ebnf$5',
                    { literal: '}' },
                ],
            },
            { name: 'declaration$ebnf$1', symbols: [] },
            {
                name: 'declaration$ebnf$1',
                symbols: [
                    'declaration$ebnf$1',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            {
                name: 'declaration',
                symbols: [
                    { literal: 'const' },
                    'declaration$ebnf$1',
                    'const_declaration_body',
                ],
            },
            { name: 'declaration$ebnf$2', symbols: [] },
            {
                name: 'declaration$ebnf$2',
                symbols: [
                    'declaration$ebnf$2',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            {
                name: 'declaration',
                symbols: [
                    { literal: 'let' },
                    'declaration$ebnf$2',
                    'let_declaration_body',
                ],
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
                ],
            },
            {
                name: 'const_declaration_body',
                symbols: ['name', '_', { literal: '=' }],
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
                ],
            },
            {
                name: 'let_declaration_body',
                symbols: ['name', '_', { literal: '=' }],
            },
            {
                name: 'let_declaration_body',
                symbols: ['name', '_', { literal: ':' }, '_', 'name'],
            },
            { name: 'field_type$ebnf$1', symbols: [] },
            {
                name: 'field_type$ebnf$1',
                symbols: [
                    'field_type$ebnf$1',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            {
                name: 'field_type',
                symbols: [{ literal: ':' }, 'field_type$ebnf$1', 'name'],
            },
            {
                name: 'function$ebnf$1',
                symbols: [lexer.has('WS') ? { type: 'WS' } : WS],
            },
            {
                name: 'function$ebnf$1',
                symbols: [
                    'function$ebnf$1',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'function$ebnf$2', symbols: [] },
            {
                name: 'function$ebnf$2',
                symbols: [
                    'function$ebnf$2',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'function$ebnf$3', symbols: [] },
            {
                name: 'function$ebnf$3',
                symbols: [
                    'function$ebnf$3',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'function$ebnf$4', symbols: [] },
            {
                name: 'function$ebnf$4',
                symbols: [
                    'function$ebnf$4',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'function$ebnf$5', symbols: [] },
            {
                name: 'function$ebnf$5',
                symbols: [
                    'function$ebnf$5',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'function$ebnf$6', symbols: [] },
            {
                name: 'function$ebnf$6',
                symbols: [
                    'function$ebnf$6',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'function$ebnf$7', symbols: [] },
            {
                name: 'function$ebnf$7',
                symbols: [
                    'function$ebnf$7',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            {
                name: 'function',
                symbols: [
                    { literal: 'function' },
                    'function$ebnf$1',
                    'name',
                    'function$ebnf$2',
                    { literal: '(' },
                    'function$ebnf$3',
                    'type_declaration',
                    'function$ebnf$4',
                    { literal: ')' },
                    'function$ebnf$5',
                    { literal: '{' },
                    'function$ebnf$6',
                    'statements',
                    'function$ebnf$7',
                    { literal: '}' },
                ],
            },
            { name: 'type_declaration$ebnf$1', symbols: [] },
            {
                name: 'type_declaration$ebnf$1',
                symbols: [
                    'type_declaration$ebnf$1',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'type_declaration$ebnf$2', symbols: [] },
            {
                name: 'type_declaration$ebnf$2',
                symbols: [
                    'type_declaration$ebnf$2',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            {
                name: 'type_declaration',
                symbols: [
                    'name',
                    'type_declaration$ebnf$1',
                    { literal: ':' },
                    'type_declaration$ebnf$2',
                    'name',
                ],
            },
            { name: 'type_declaration$ebnf$3', symbols: [] },
            {
                name: 'type_declaration$ebnf$3',
                symbols: [
                    'type_declaration$ebnf$3',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'type_declaration$ebnf$4', symbols: [] },
            {
                name: 'type_declaration$ebnf$4',
                symbols: [
                    'type_declaration$ebnf$4',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'type_declaration$ebnf$5', symbols: [] },
            {
                name: 'type_declaration$ebnf$5',
                symbols: [
                    'type_declaration$ebnf$5',
                    lexer.has('WS') ? { type: 'WS' } : WS,
                ],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            {
                name: 'type_declaration',
                symbols: [
                    'name',
                    'type_declaration$ebnf$3',
                    { literal: ':' },
                    'type_declaration$ebnf$4',
                    'name',
                    'type_declaration$ebnf$5',
                    { literal: ',' },
                    'type_declaration',
                ],
            },
            { name: 'ws$ebnf$1', symbols: [/[\ \t]/] },
            {
                name: 'ws$ebnf$1',
                symbols: ['ws$ebnf$1', /[\ \t]/],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'ws', symbols: ['ws$ebnf$1'] },
            { name: 'ows$ebnf$1', symbols: [] },
            {
                name: 'ows$ebnf$1',
                symbols: ['ows$ebnf$1', /[\ \t]/],
                postprocess: function arrpush(d) {
                    return d[0].concat([d[1]]);
                },
            },
            { name: 'ows', symbols: ['ows$ebnf$1'] },
            {
                name: 'name',
                symbols: [
                    lexer.has('variable') ? { type: 'variable' } : variable,
                ],
            },
        ],
        ParserStart: 'statements',
    };
    if (
        typeof module !== 'undefined' &&
        typeof module.exports !== 'undefined'
    ) {
        module.exports = grammar;
    } else {
        window.grammar = grammar;
    }
})();
