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

enum RuleType {
  BRANCH
}

enum State {
  BEGIN,
  CONTRACT,
  FUNCTION,
  STRUCT,
  DECLARATION,
}

type BranchRule = {
  type: RuleType.BRANCH;
  branches: {
    to: keyof typeof State,
    when: {
      type: TokenType,
      value: string
    }
  }[]
}

type Rule = BranchRule

type MachineState = {
  state: State,
  rules: Rule[]
}

const stateMachine: MachineState[] = [{
  state: State.BEGIN,
  rules: [{
        branches: [
          {
            to: 'CONTRACT',
            when: {
              type: TokenType.NAME,
              value: 'contract'
            }
          },
          {       
            to: 'FUNCTION',
            when: {
              type: TokenType.NAME,
              value: 'function'
            }
          },
          {
            to: 'STRUCT',
            when: {
              type: TokenType.NAME,
              value: 'struct'
            }
          },
          {  
            to: 'DECLARATION',
            when: {
              type: TokenType.NAME,
              value: 'const'
            }
          },
          { 
            to: 'DECLARATION',
            when: {
              type: TokenType.NAME,
              value: 'let'
            }
          },
      ],
        type: RuleType.BRANCH
    }]
}]


type Token =  {
  type: TokenType,
  value: string
}

export function* tokenize(fileContent: string): Generator<Token> {
    const tokens = lex(fileContent);
    for (const lex of tokens) {
      if(lex.type === LexType.ALPHA) {
        yield {
          type: TokenType.NAME,
          value: lex.value
        }
      } else if ( lex.type === LexType.NUM ) {
        yield  {
          type: TokenType.NUMBER,
          value: lex.value
        }
      } else if( lex.type === LexType.UNKNOWN) {
        
        switch ( lex.value ) {
          case '{':  {
            yield {
              type: TokenType.OPEN_BLOCK,
              value: lex.value
            }
            break;
          }
          case '}':  {
            yield {
              type: TokenType.CLOSE_BLOCK,
              value: lex.value
            }
            break;
          }
          case '(':  {
            yield {
              type: TokenType.OPEN_BRACE,
              value: lex.value
            }
            break;
          }

          case ')':  {
            yield {
              type: TokenType.CLOSE_BRACE,
              value: lex.value
            }
            break;
          }
          case '[':  {
            yield {
              type: TokenType.OPEN_BRACKET,
              value: lex.value
            }
            break;
          }
          case ']':  {
            yield {
              type: TokenType.CLOSE_BRACKET,
              value: lex.value
            }
            break;
          }
          case '\n':  {
            yield {
              type: TokenType.NL,
              value: lex.value
            }
            break;
          }
          case '.':  {
            yield {
              type: TokenType.DOT,
              value: lex.value
            }
            break;
          }
          case ' ':  {
            yield {
              type: TokenType.SPACE,
              value: lex.value,
            }
            break;
          }
          case '\\':  {
            yield {
              type: TokenType.ESC,
              value: lex.value
            }
            break;
          }
          default: yield {
            type: TokenType.UNKNOWN,
            value: lex.value
          }
        }
      }
    }
}


enum LexType {
    ALPHA,
    NUM,
    UNKNOWN,
    END,
}

function getCharType(char: string): LexType | undefined {
    const isalpha = isAlpha(char);
    const isnum = isNumber(char);
    if(isalpha) {
        return LexType.ALPHA
    } else if (isnum) {
        return LexType.NUM
    }
}


function* lex(fileContent: string): Generator<{value: string, type: LexType}> {
    const tokens: string[] = []
    let lexType: LexType | undefined;
    for(const char of fileContent) {
        const currentCharType = getCharType(char);
        if (lexType !== currentCharType && tokens.length && lexType) {
            yield {
                value: tokens.join(''),
                type: lexType
            }
            popAll(tokens)
        }
        tokens.push(char)
        if(currentCharType == undefined) {
            lexType = LexType.UNKNOWN;
        } else {
            lexType = currentCharType;
        }
    }
    if(tokenize.length && lexType) {
      yield {
        type: lexType,
        value: tokens.join('')
      }
    }
    yield {
        value: '',
        type: LexType.END
    }
}


