import { AnyToken, TokenType } from "../tokenizer"
import { BranchRule, MachineState, OptionalRule, RuleType, SimpleRule, StackRule } from "./@types"

export const grammar = `
  begin =>  interface: "interface": @ || struct: "struct": @  || function : "function": @ || NL : @ || SPACE:@ || ?;
  interface => "interface", sep, variable_name , optional_sep, "{", optional_sep , "}";
  struct =>  "struct", 
              sep, 
              variable_name, 
              struct_contract: "implements" || ?, 
              "{",
              sep || ?, 
              "}";

  struct_contract => "implements",  sep , variable_name, optional_sep || ?;

  sep =>  SPACE || NL, SPACE : @ ||  NL: @ || ?;
  optional_sep =>  SPACE : @ ||  NL: @ || ?;
  variable_name => NAME || "_", NAME: @ || NUMBER: @ || "_": @ || ?;
`


export function parseGrammar() {
  const states =  grammar
    .trim()
    .split(';')
    .map(line => line.trim())
    .filter(line => line.indexOf('=>') >= 0)
    .map(line => {
      const [stateName, rules] = line.split('=>').map(e => e.trim())

      return {
        stateName,
        rules : rules
          .split(',')
          .map(unit => {
            const rules = unit
              .split('||')
              .map(instruction => {
                const [first, second, third]  = instruction.trim().split(":").map(e => e.trim())
                const recursion =  second === '@' || third === '@'
                return {
                  token: first,
                  conditionalToken: second === '@' && recursion ? undefined : second,
                  recursion : recursion
                }
              })
              .map(({conditionalToken, token, recursion}) =>  {
                if(token.startsWith('"')) {
                  return {
                    ruleType: RuleType.SIMPLE,
                    tokenType: AnyToken,
                    values: [token.slice(1, -1)]
                  } as SimpleRule
                }
                else if(token === '?') {
                   return {
                    ruleType: RuleType.OPTIONAL,
                    tokenType: AnyToken
                  } as OptionalRule
                }
                else if(token.length && token === token.toUpperCase()) {
                    const tokenType: TokenType = TokenType[token as any] as any;
                    if(tokenType === undefined) {
                      throw new Error(`Invalid token type "${token}"`)
                    }
                    return {
                      ruleType: RuleType.SIMPLE,
                      tokenType: tokenType,
                      recursion: recursion,
                      values: []
                    } as SimpleRule
                } 
                else  {
                  if(conditionalToken) {
                    if(conditionalToken.startsWith('"')) {
                      return {
                        ruleType: RuleType.STACK,
                        stackTo: token as any,
                        tokenType: AnyToken,
                        recursion: recursion,
                        values:[conditionalToken.slice(1, -1)]
                      }
                    } else if(conditionalToken.toUpperCase() === conditionalToken) {
                      const tokenType: TokenType = TokenType[conditionalToken as any] as any;
                      const data =  {
                        ruleType: RuleType.STACK,
                        stackTo: token as any,
                        recursion: recursion,
                        tokenType: tokenType,
                        values:[]
                      }

                      return data
                    } else {
                      throw new Error('Invalid transition condition')
                    }
              
                  } else {
                    const data =  {
                      ruleType: RuleType.STACK,
                      stackTo: token as any,
                      tokenType: AnyToken,
                      recursion: recursion,
                      values:[]
                    } as StackRule

                    return data;
                  }
                }
              })
              return {
                branches: rules,
                ruleType: RuleType.BRANCH,
                isOptional: rules.findIndex(e => e.ruleType === RuleType.OPTIONAL) >= 0
              } as BranchRule

          })
      }
    })
    const map = states.reduce((reduceTo, current, ) => {
      console.log(current.stateName, current.rules)
      return reduceTo.set(current.stateName, {
        state: current.stateName,
        rules: current.rules as any
      })
    }, new Map<string, MachineState>())

    return map
   
}