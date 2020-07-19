import { Instance } from 'chalk'
import { AnyToken, Token, tokenize, TokenType } from "../tokenizer"
import { MachineState, MachineStateInstance, RuleType, SimpleRule, StackRule } from './@types'
import { getNextSate } from './statemachine'
const chalk = new Instance({level:3})
const log = console.log

function escape(str: string) {
  return str
      .replace(/\n/gi, '\\n')
      .replace(/ /gi, '␣')
}

export function parse (fileContent: string) {
  const tokens = tokenize(fileContent);
  const states: MachineStateInstance[] = [{
    ruleIndex: 0,
    machineState: getNextSate('begin')
  }]
  let tokenStream = tokens.next()
  let count = 0
  let evaluated = '';
  tokenIterable: while (!tokenStream.done) {
    const token = tokenStream.value

    const currentState = states[states.length - 1];
    if (!currentState) {
      throw new Error('Internal compiler error')
    }
    const currentMachineState = currentState.machineState
    if (currentState.ruleIndex >= currentState.machineState.rules.length) {
      const popped =  states.pop()
      log(chalk.red('-'), popped!!.machineState.state)
      continue tokenIterable;
    }

    const currentRule = currentMachineState.rules[currentState.ruleIndex]


    mainBranch: switch (currentRule.ruleType) {
      // Main rule check.
      case RuleType.BRANCH: {
        branchRules: for (const branchRule of currentRule.branches) {
          if ( branchRule.tokenType === token.type || branchRule.tokenType === AnyToken) {

            if(branchRule.ruleType === RuleType.OPTIONAL) {
              currentState.ruleIndex += 1
              continue tokenIterable;
            }

            const result = handleNonBranchRules(branchRule, token)
            if(result.action === RuleAction.ERROR) {
              continue branchRules;
            }
            if (result.action === RuleAction.STACK) {
                states.push({
                  machineState: result.state,
                  ruleIndex: 0
                })
                log(chalk.green('+'), result.state.state)
                if((branchRule as StackRule).recursion === true) {
                  // don't push for self recursion
                  continue tokenIterable;
                }
                currentState.ruleIndex += 1;
                continue tokenIterable;
            } else if (result.action === RuleAction.STAY_OR_FORWARD) {
              if( (branchRule as SimpleRule).recursion === true) {
                break mainBranch;
              }
            } 
            currentState.ruleIndex += 1;
            if( currentState.ruleIndex >= currentState.machineState.rules.length) {
              continue tokenIterable;
            }
            break mainBranch;
          }
        }
        throw new Error(`Unexpected token "${escape(token.value)}" of type "${TokenType[token.type].toLowerCase()}" `)
      }
    }
    log(chalk.green('☑'),`${ chalk.green(escape(token.value))} in ${chalk.yellow(currentMachineState.state)}`)
    evaluated += token.value
    tokenStream = tokens.next()
    log(chalk.yellow('☐'),` ${ chalk.green(escape(tokenStream.value.value))}`)
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
  rule: SimpleRule | StackRule , 
  token: Token,
): { action: RuleAction.FORWARD | RuleAction.STAY_OR_FORWARD | RuleAction.ERROR } | { action: RuleAction.STACK , state: MachineState } {

  switch(rule.ruleType) {
    case RuleType.SIMPLE: { 
      if ( 
        (
          rule.tokenType === AnyToken || 
          (rule as SimpleRule).tokenType === token.type
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
  }
}


