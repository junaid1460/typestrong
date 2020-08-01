import { isAlpha, isNumber } from './utils';

export enum TokenType {
    ALPHA, // hello
    OPEN_BLOCK, // {
    CLOSE_BLOCK, // }
    NUMBER, // 23
    DOT, // .
    OPEN_BRACE, // (
    CLOSE_BRACE, // )
    OPEN_BRACKET, // [
    CLOSE_BRACKET, // ]
    NL, // new line
    SPACE, // white space
    ESC, // \
    UNKNOWN, // any utf8
    GT,
    LT,
    EQ,
    NOT,
    OR,
    AND,
    MUL,
    DIV,
    MOD,
    COLUMN,
    SEMI,
    COMMA,
    QUESTION,
    SUB,
    ADD,
    SINGLE_QUOTE,
    DOUBLE_QUOTE,
    BACKTICK,
    UNDERSCORE,
    XOR,
    AT,
}

export const AnyToken = -1;

export type Token = {
    type: TokenType;
    value: string;
};

const getTokenType = (value: string) => {
    const tokenMap = {
        '{': {
            type: TokenType.OPEN_BLOCK,
            value: value,
        },
        '}': {
            type: TokenType.CLOSE_BLOCK,
            value: value,
        },
        '(': {
            type: TokenType.OPEN_BRACE,
            value: value,
        },
        ')': {
            type: TokenType.CLOSE_BRACE,
            value: value,
        },
        '[': {
            type: TokenType.OPEN_BRACKET,
            value: value,
        },
        ']': {
            type: TokenType.CLOSE_BRACKET,
            value: value,
        },
        '\n': {
            type: TokenType.NL,
            value: value,
        },
        '.': {
            type: TokenType.DOT,
            value: value,
        },
        ' ': {
            type: TokenType.SPACE,
            value: value,
        },
        '\\': {
            type: TokenType.ESC,
            value: value,
        },
        ':': {
            type: TokenType.COLUMN,
            value: value,
        },

        '&': {
            type: TokenType.AND,
            value: value,
        },
        '|': {
            type: TokenType.OR,
            value: value,
        },
        '!': {
            type: TokenType.NOT,
            value: value,
        },
        '>': {
            type: TokenType.GT,
            value: value,
        },
        '<': {
            type: TokenType.LT,
            value: value,
        },
        '=': {
            type: TokenType.EQ,
            value: value,
        },
        '+': {
            type: TokenType.ADD,
            value: value,
        },
        '-': {
            type: TokenType.SUB,
            value: value,
        },
        '/': {
            type: TokenType.DIV,
            value: value,
        },
        '%': {
            type: TokenType.MOD,
            value: value,
        },
        '*': {
            type: TokenType.MUL,
            value: value,
        },
        '?': {
            type: TokenType.QUESTION,
            value: value,
        },
        ',': {
            type: TokenType.COMMA,
            value: value,
        },
        ';': {
            type: TokenType.COMMA,
            value: value,
        },
        '"': {
            type: TokenType.DOUBLE_QUOTE,
            value: value,
        },
        "'": {
            type: TokenType.SINGLE_QUOTE,
            value: value,
        },
        '`': {
            type: TokenType.BACKTICK,
            value: value,
        },
        _: {
            type: TokenType.BACKTICK,
            value: value,
        },
        '@': {
            type: TokenType.AT,
            value: value,
        },
        '^': {
            type: TokenType.XOR,
            value: value,
        },
    };
    const token = (tokenMap as any)[value];
    if (token === undefined) {
        return {
            type: TokenType.UNKNOWN,
            value: value,
        };
    }
    return token;
};

export function* tokenize(fileContent: string): Generator<Token> {
    const tokens = basicTokens(fileContent);
    for (const basicToken of tokens) {
        if (basicToken.type === BasicTokenType.ALPHA) {
            yield {
                type: TokenType.ALPHA,
                value: basicToken.value,
            };
        } else if (basicToken.type === BasicTokenType.NUM) {
            yield {
                type: TokenType.NUMBER,
                value: basicToken.value,
            };
        } else if (basicToken.type === BasicTokenType.UNKNOWN) {
            yield getTokenType(basicToken.value);
        }
    }
}

enum BasicTokenType {
    ALPHA,
    NUM,
    UNKNOWN,
    END,
}

function getCharType(char: string): BasicTokenType {
    const isalpha = isAlpha(char);
    const isnum = isNumber(char);
    if (isalpha) {
        return BasicTokenType.ALPHA;
    } else if (isnum) {
        return BasicTokenType.NUM;
    }
    return BasicTokenType.UNKNOWN;
}

function* basicTokens(
    fileContent: string
): Generator<{ value: string; type: BasicTokenType }> {
    const token = '';
    for (const char of fileContent) {
        const currentCharType = getCharType(char);
        yield {
            value: token,
            type: currentCharType,
        };
    }
    yield {
        value: token,
        type: BasicTokenType.END,
    };
}
