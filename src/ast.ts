import { Instance } from 'chalk'
import { AnyToken, Token, tokenize, TokenType } from "./tokenizer"
const chalk = new Instance({level:3})
const log = console.log

function escape(str: string) {
  return str
      .replace(/\n/gi, '\\n')
      .replace(/ /gi, '␣')
}

enum RuleType {
  BRANCH,       // Test a token against multiple rules
  SIMPLE,       // Simple rule that tests against token type and values
  STACK,        // State transition while preserving current state 
  BRANCH_EXIT   // Move forward from a branch rule
}

/**
 * Simple rule can test against token type and value 
 * the token holds
 */
type SimpleRule = {
  // Type mentioning for runtime reference
  ruleType: RuleType.SIMPLE,

  // if value of -1 then it's considered as * or any
  tokenType: TokenType | typeof AnyToken,

  // If list is empty then comparison won't happen, and considered and success
  values: string[]
}

/**
 * Makes transition to state mentioned in @stackTo 
 * By stacking the new state over current
 */
type StackRule = {
  // Type mentioning for runtime reference
  ruleType: RuleType.STACK,
  tokenType: TokenType | typeof AnyToken,
  // State to which transition should happen
  stackTo: string,
  // If list is empty then comparison won't happen, and considered and success
  values: string[]
}

// Exit from a branch
type BranchExitRule = {
  // Type mentioning for runtime reference
  ruleType: RuleType.BRANCH_EXIT,

  // if value of -1 then it's considered as * or any
  tokenType: TokenType | typeof AnyToken,

  // If list is empty then comparison won't happen, and considered and success
  values: string[]
}


/**
 * Evaluates token against rules provided 
 */
type BranchRule = {
  // Type mentioning for runtime reference
  ruleType: RuleType.BRANCH;
  // Does not allow to nest branch rule within branch rule
  branches: (SimpleRule | StackRule | BranchExitRule)[]
}



type Rule = BranchRule | SimpleRule | StackRule

type MachineState = {
  // State for which rules are listed
  state: string,

  // Rules for the state
  // Rules are evaluated left-to-right one-by-one
  rules: Rule[]
}



const grammar = `
  begin =>  contract: "contract" || struct: "struct"  || function : "function" || sep;
  contract => "contract", sep, variable_name , sep, "{", sep, "}";
  sep =>  SPACE || NL, sep: SPACE || sep: NL || EXIT;
  variable_name => NAME, NAME || NUMBER || "_" || EXIT;
`

function parseGrammar() {
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
                const [token, conditionalToken]  = instruction.trim().split(":").map(e => e.trim())
                return {
                  token,
                  conditionalToken
                }
              })
              .map(({conditionalToken, token}) =>  {
                if(token.startsWith('"')) {
                  return {
                    ruleType: RuleType.SIMPLE,
                    tokenType: AnyToken,
                    values: [token.slice(1, -1)]
                  } as SimpleRule
                }
                else if(token === 'EXIT') {
                  return {
                    ruleType: RuleType.BRANCH_EXIT,
                    tokenType: AnyToken,
                    values: []
                  } as BranchExitRule
                }
                else if(token === token.toUpperCase()) {
                    const tokenType: TokenType = TokenType[token as any] as any;
                    if(tokenType === undefined) {
                      throw new Error(`Invalid token type "${token}"`)
                    }
                    return {
                      ruleType: RuleType.SIMPLE,
                      tokenType: tokenType,
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
                        values:[conditionalToken.slice(1, -1)]
                      }
                    } else if(conditionalToken.toUpperCase() === conditionalToken) {
                      const tokenType: TokenType = TokenType[conditionalToken as any] as any;
                      return {
                        ruleType: RuleType.STACK,
                        stackTo: token as any,
                        tokenType: tokenType,
                        values:[]
                      }
                    } else {
                      throw new Error('Invalid transition condition')
                    }
              
                  } else {
                    return {
                      ruleType: RuleType.STACK,
                      stackTo: token as any,
                      tokenType: AnyToken,
                      values:[]
                    } as StackRule
                  }
                }
              })
            if(rules.length > 1) {
              return {
                branches: rules,
                ruleType: RuleType.BRANCH
              } as BranchRule
            } else {
              return rules[0]
            }
          })
      }
    })
    const map = states.reduce((reduceTo, current, ) => {
      return reduceTo.set(current.stateName, {
        state: current.stateName,
        rules: current.rules as any
      })
    }, new Map<string, MachineState>())

    return map
   
}

const machineStateMap = parseGrammar()


type MachineStateInstance  = { 
  // index of rule currently being evaluated in following 
  // Provided machine state
  ruleIndex: number, 
  // Machine state
  machineState: MachineState 
}

function getNextSate(
  nextStateREF: string
) {
  const nextState = machineStateMap.get(nextStateREF)

  // This is language parsing error
  if (!nextState) {
    throw new Error('Compiler error')
  }

  return nextState
}


export function parse (fileContent: string) {
  const tokens = tokenize(fileContent);
  const states: MachineStateInstance[] = [{
    ruleIndex: 0,
    machineState: getNextSate('begin')
  }]
  let tokenStream = tokens.next()
  let count = 0
  tokenIterable: while (!tokenStream.done) {
    const token = tokenStream.value

    const currentState = states[states.length - 1];
    if (!currentState) {
      throw new Error('Internal compiler error')
    }
    const currentMachineState = currentState.machineState
    if (currentState.ruleIndex >= currentState.machineState.rules.length) {
      const popped =  states.pop()
      log("POPPED", popped!!.machineState.state)
      continue tokenIterable;
    }

    const currentRule = currentMachineState.rules[currentState.ruleIndex]

    log(count, token.type, escape(token.value), RuleType[currentRule.ruleType], states.length, "rule no.", currentState.ruleIndex)

    mainBranch: switch (currentRule.ruleType) {
      // Main rule check.
      case RuleType.BRANCH: {
        branchRules: for (const branchRule of currentRule.branches) {
          if (branchRule.tokenType === token.type || branchRule.tokenType === AnyToken) {
            const result = handleNonBranchRules(branchRule, token)
            if(result.action === RuleAction.ERROR) {
              continue branchRules;
            }
            if (result.action === RuleAction.STACK) {
              if((branchRule as StackRule).stackTo ===  currentMachineState.state) {
                // don't push for self recursion
                break mainBranch;
              } else {
                states.push({
                  machineState: result.state,
                  ruleIndex: 0
                })
               log('PUSHED', result.state.state)
              }
               continue tokenIterable;
            } else {
              currentState.ruleIndex += 1;
              if( currentState.ruleIndex >= currentState.machineState.rules.length) {
                const popped = states.pop()
                log("POPPED", popped!!.machineState.state)
                continue tokenIterable;
              }
              break mainBranch;
            } 
          }
        }
        throw new Error(`Unexpected token "${escape(token.value)}" of type "${TokenType[token.type].toLowerCase()}" `)
      }

      default: {
        const result = handleNonBranchRules(currentRule, token)
        if(result.action === RuleAction.ERROR) {
          throw new Error(`Unexpected token "${escape(token.value)}" of type "${TokenType[token.type].toLowerCase()}" `)
        }
        else if (result.action === RuleAction.STACK) {
           states.push({
             machineState: result.state,
             ruleIndex: 0
           })
           log('PUSHED', result.state.state)
           currentState.ruleIndex += 1;
           continue tokenIterable;
        }else {
          currentState.ruleIndex += 1;
          if(currentState.ruleIndex >= currentState.machineState.rules.length   ) {
            const popped =  states.pop()
            log("POPPED", popped!!.machineState.state)
            break mainBranch;
          }
        }
      }

      
    }
    log(`evaluated ${ chalk.green(escape(token.value))} in ${chalk.yellow(currentMachineState.state)}`)
    tokenStream = tokens.next()
    log(`evaluating ${ chalk.green(escape(tokenStream.value.value))}`)
    count += 1
  }
}

enum RuleAction {
  FORWARD,
  STAY_OR_FORWARD,
  STACK,
  ERROR
}
function handleNonBranchRules(
  rule: SimpleRule | StackRule | BranchExitRule, 
  token: Token,
): { action: RuleAction.FORWARD | RuleAction.STAY_OR_FORWARD | RuleAction.ERROR } | { action: RuleAction.STACK , state: MachineState } {

  switch(rule.ruleType) {
    case RuleType.SIMPLE: {
      if ( 
        (
          rule.tokenType === AnyToken || 
          rule.tokenType === token.type
        ) 
        && ( 
          rule.values.length === 0 || 
          rule.values.includes(token.value)
        )
      ) {
        return {
          action: RuleAction.STAY_OR_FORWARD,
        }
      } else {
        return {
          action: RuleAction.ERROR,
        }
      }
    }

    case RuleType.STACK: {
      if ( 
        (rule.tokenType === AnyToken || 
        rule.tokenType === token.type) && ( 
          rule.values.length === 0 || 
          rule.values.includes(token.value)
        )
      ) {
        return   {
          action: RuleAction.STACK,
          state: getNextSate(rule.stackTo)
        }   
      } else {
         return {
           action: RuleAction.ERROR
         }
      }

    }

    case RuleType.BRANCH_EXIT: {
      if ( 
        rule.tokenType === AnyToken || 
        rule.tokenType === token.type && ( 
          rule.values.length === 0 || 
          rule.values.includes(token.value)
        )
      ) {
        return {
          action: RuleAction.FORWARD
        }
      } else {
        return {
          action: RuleAction.ERROR
        }
      }
    }
  }
}


