import { readFileSync } from 'fs';
import { isAlpha, isNumber, popAll } from './utils';

async function parseFile(file: string) {
    const fileContent = readFileSync(file).toString()
    const tokens = lex(fileContent);
    console.log(Array.from(tokens))
}


enum LexType {
    ALPHA,
    NUM,
    UNKNOWN,
    UNDEFINED,
    END,
}

function getCharType(char: string): LexType {
    const isalpha = isAlpha(char);
    const isnum = isNumber(char);
    if(isalpha) {
        return LexType.ALPHA
    } else if (isnum) {
        return LexType.NUM
    }
    else {
        return LexType.UNKNOWN
    }
}


function* lex(fileContent: string): Generator<{token: string, type: LexType}> {
    const tokens: string[] = []
    let lexType = LexType.UNDEFINED;
    for(const char of fileContent) {
        const currentCharType = getCharType(char);
        if (lexType !== currentCharType && tokens.length) {
            yield {
                token: tokens.join(''),
                type: lexType
            }
            popAll(tokens)
        }
        tokens.push(char)
        if(currentCharType == LexType.UNKNOWN) {
            lexType = LexType.UNDEFINED;
        } else {
            lexType = currentCharType;
        }
    }
    yield {
        token: '',
        type: LexType.END
    }
}

const value = parseFile(process.argv[2])
