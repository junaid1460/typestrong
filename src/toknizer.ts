import { isAlpha, isNumber, popAll } from './utils';

export enum TokenType {
  NAME, // hello
  OPEN_BLOCK,  // {
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
  UNKNOWN // any utf8
}

export type Token =  {
  type: TokenType,
  value: string
}

export function* tokenize(fileContent: string): Generator<Token> {
    const tokens = basicTokens(fileContent);
    for (const basicToken of tokens) {
      if(basicToken.type === BasicTokenType.ALPHA) {
        yield {
          type: TokenType.NAME,
          value: basicToken.value
        }
      } else if ( basicToken.type === BasicTokenType.NUM ) {
        yield  {
          type: TokenType.NUMBER,
          value: basicToken.value
        }
      } else if( basicToken.type === BasicTokenType.UNKNOWN) {
        
        switch ( basicToken.value ) {
          case '{':  {
            yield {
              type: TokenType.OPEN_BLOCK,
              value: basicToken.value
            }
            break;
          }
          case '}':  {
            yield {
              type: TokenType.CLOSE_BLOCK,
              value: basicToken.value
            }
            break;
          }
          case '(':  {
            yield {
              type: TokenType.OPEN_BRACE,
              value: basicToken.value
            }
            break;
          }

          case ')':  {
            yield {
              type: TokenType.CLOSE_BRACE,
              value: basicToken.value
            }
            break;
          }
          case '[':  {
            yield {
              type: TokenType.OPEN_BRACKET,
              value: basicToken.value
            }
            break;
          }
          case ']':  {
            yield {
              type: TokenType.CLOSE_BRACKET,
              value: basicToken.value
            }
            break;
          }
          case '\n':  {
            yield {
              type: TokenType.NL,
              value: basicToken.value
            }
            break;
          }
          case '.':  {
            yield {
              type: TokenType.DOT,
              value: basicToken.value
            }
            break;
          }
          case ' ':  {
            yield {
              type: TokenType.SPACE,
              value: basicToken.value,
            }
            break;
          }
          case '\\':  {
            yield {
              type: TokenType.ESC,
              value: basicToken.value
            }
            break;
          }
          default: yield {
            type: TokenType.UNKNOWN,
            value: basicToken.value
          }
        }
      }
    }
}


enum BasicTokenType {
    ALPHA,
    NUM,
    UNKNOWN,
    END,
}

function getCharType(char: string): BasicTokenType | undefined {
    const isalpha = isAlpha(char);
    const isnum = isNumber(char);
    if(isalpha) {
        return BasicTokenType.ALPHA
    } else if (isnum) {
        return BasicTokenType.NUM
    }
}


function* basicTokens(fileContent: string): Generator<{value: string, type: BasicTokenType}> {
    const tokens: string[] = []
    let basicTokenType: BasicTokenType | undefined;
    for(const char of fileContent) {
        const currentCharType = getCharType(char);
        if (basicTokenType !== currentCharType && tokens.length && basicTokenType) {
            yield {
                value: tokens.join(''),
                type: basicTokenType
            }
            popAll(tokens)
        }
        tokens.push(char)
        if(currentCharType == undefined) {
            basicTokenType = BasicTokenType.UNKNOWN;
        } else {
            basicTokenType = currentCharType;
        }
    }
    if(tokenize.length && basicTokenType) {
      yield {
        type: basicTokenType,
        value: tokens.join('')
      }
    }
    yield {
        value: '',
        type: BasicTokenType.END
    }
}


