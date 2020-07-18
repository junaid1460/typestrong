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

enum State {
  BEGIN,        // Starting state 
  CONTRACT,     // Contract or interface eg: contract Name {}
  FUNCTION,     // Evaluate function block eg: function Name () {}
  STRUCT,       // Evaluate struct block eg: struct Name signs Name {}
  DECLARATION,  // Value declaration statement eg: const name = 12;
  VARNAME,      // Valiable name evaluation eg: name123
  SEPARATORS,   // Spaces and tabs
  NEWLINE,      // New line char   
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
  stackTo: State,
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
  state: State,

  // Rules for the state
  // Rules are evaluated left-to-right one-by-one
  rules: Rule[]
}

const beginState: MachineState = {
  state: State.BEGIN,
  rules: [{
        branches: [
          {
            tokenType: TokenType.NAME,
            values:[ 'contract'],
            ruleType: RuleType.STACK,
            stackTo: State.CONTRACT
          },
          {       
 
            tokenType: TokenType.NAME,
            values:[ 'function'],
            ruleType: RuleType.SIMPLE
          },
          {
   
            tokenType: TokenType.NAME,
            values:[ 'struct'],
            ruleType: RuleType.SIMPLE
          },
          {  
            tokenType: TokenType.NAME,
            values:[ 'const', 'let'],
            ruleType: RuleType.SIMPLE
          },
          {  
            tokenType: TokenType.NL,
            values:[],
            ruleType: RuleType.SIMPLE
          },
          {  
            tokenType: TokenType.SPACE,
            values:[],
            ruleType: RuleType.SIMPLE
          },
      ],
        ruleType: RuleType.BRANCH
    }]
}


const varNameState: MachineState = {
  state: State.VARNAME,
  rules: [{
    ruleType: RuleType.SIMPLE,
    tokenType: TokenType.NAME,
    values: []
  }, {
    ruleType: RuleType.BRANCH,
    branches: [{
      tokenType: TokenType.NAME,
      values: [],
      ruleType: RuleType.SIMPLE
    }, {
      tokenType: TokenType.NUMBER,
      values: [],
      ruleType: RuleType.SIMPLE
    }, {
      tokenType: TokenType.UNDERSCORE,
      values: [],
      ruleType: RuleType.SIMPLE
    }, {
      tokenType: AnyToken,
      values: [],
      ruleType: RuleType.BRANCH_EXIT
    }]
  }]
}


const evaluateVariableName = () =>  ({
  stackTo: State.VARNAME,
  tokenType: AnyToken,
  values:[],
  ruleType: RuleType.STACK
} as StackRule)

const evaluateSeparators = () =>  ({
  stackTo: State.SEPARATORS,
  tokenType: AnyToken,
  values:[],
  ruleType: RuleType.STACK
} as StackRule)

const evalConstName = (name: string) => {
  return {
    tokenType: TokenType.NAME,
    values:[ name ],
    ruleType: RuleType.SIMPLE
  } as SimpleRule
}

const evalAnyConst = (name: string) => {
  return {
    tokenType: AnyToken,
    values:[ name ],
    ruleType: RuleType.SIMPLE
  } as SimpleRule
}

const contractState: MachineState =  {
  state: State.CONTRACT,
  rules: [
    evalConstName('contract'), evaluateSeparators(), evaluateVariableName(), evaluateSeparators(), evalAnyConst('{'), evaluateSeparators(),
    evalAnyConst('}')
  ]
}

const separatorsState: MachineState = {
  state: State.SEPARATORS,
  rules: [{
    ruleType: RuleType.BRANCH,
    branches: [{
      tokenType: TokenType.SPACE,
      values: [],
      ruleType: RuleType.SIMPLE
    }, {
      tokenType: TokenType.NL,
      values: [],
      ruleType: RuleType.SIMPLE
    }, {
      tokenType: AnyToken,
      values: [],
      ruleType: RuleType.BRANCH_EXIT
    }]
  }]
}

const machineStates: MachineState[] = [beginState, varNameState, separatorsState, contractState]
const machineStateMap = machineStates.reduce(
    (stateMap, current) => stateMap.set(current.state, current), 
    new Map<number, MachineState>()
)

type MachineStateInstance  = { 
  // index of rule currently being evaluated in following 
  // Provided machine state
  ruleIndex: number, 
  // Machine state
  machineState: MachineState 
}

function getNextSate(
  nextStateREF: State
) {
  const nextState = machineStateMap.get(nextStateREF)

  // This is language parsing error
  if(!nextState) {
    throw new Error('Compiler error')
  }

  return nextState
}


export function parse(fileContent: string) {
  const tokens = tokenize(fileContent);
  const states: MachineStateInstance[] = [{
    ruleIndex: 0,
    machineState: beginState
    
  }]
  let tokenStream = tokens.next()
  let count = 0
  tokenIterable: while(!tokenStream.done) {
    const token = tokenStream.value

    const currentState = states[states.length - 1];
    if(!currentState) {
      throw new Error('Internal compiler error')
    }
    const currentMachineState = currentState.machineState
    if( currentState.ruleIndex >= currentState.machineState.rules.length   ) {
      const popped =  states.pop()
      log("POPPED", State[popped!!.machineState.state])
      continue tokenIterable;
    }

    const currentRule = currentMachineState.rules[currentState.ruleIndex]

    log(count, token.type, escape(token.value), RuleType[currentRule.ruleType], states.length)

    mainBranch: switch(currentRule.ruleType) {
      // Main rule check.
      case RuleType.BRANCH: {
        for(const branchRule of currentRule.branches) {
          if(branchRule.tokenType === token.type || branchRule.tokenType === AnyToken) {
            const result = handleNonBranchRules(branchRule, token)
            if(result.action === RuleAction.STACK) {
               states.push({
                 machineState: result.state,
                 ruleIndex: 0
               })
               log('PUSHED', State[result.state.state])
               continue tokenIterable;
            } else if (result.action === RuleAction.FORWARD) {
              currentState.ruleIndex += 1;
              if( currentState.ruleIndex >= currentState.machineState.rules.length) {
                const popped = states.pop()
                log("POPPED", State[popped!!.machineState.state])
                continue tokenIterable;
              }
              break mainBranch;
            } else {
              break mainBranch;
            }
          }
        }
        throw new Error(`Unexpected token ${token.value} ${TokenType[token.type].toLowerCase()} `)
      }

      default: {
        const result = handleNonBranchRules(currentRule, token)
        if(result.action === RuleAction.STACK) {
           states.push({
             machineState: result.state,
             ruleIndex: 0
           })
           log('PUSHED', State[result.state.state])
           currentState.ruleIndex += 1;
           continue tokenIterable;
        } else {
          currentState.ruleIndex += 1;
          if(currentState.ruleIndex >= currentState.machineState.rules.length   ) {
            const popped =  states.pop()
            log("POPPED", State[popped!!.machineState.state])
            break mainBranch;
          }
        }
      }

      
    }
    log(`evaluated ${ chalk.green(escape(token.value))}`)
    tokenStream = tokens.next()
    log(`evaluating ${ chalk.green(escape(tokenStream.value.value))}`)
    count += 1
  }
}

enum RuleAction {
  FORWARD,
  STAY_OR_FORWARD,
  STACK
}
function handleNonBranchRules(
  rule: SimpleRule | StackRule | BranchExitRule, 
  token: Token,
): { action: RuleAction.FORWARD | RuleAction.STAY_OR_FORWARD } | { action: RuleAction.STACK , state: MachineState } {

  switch(rule.ruleType) {
    case RuleType.SIMPLE: {
      if( 
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
        throw new Error(`Unexpected token "${escape(token.value)}" of type "${TokenType[token.type].toLowerCase()}" `)
      }
    }

    case RuleType.STACK: {
      if( 
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
         throw new Error(`Unexpected token "${escape(token.value)}" of type "${TokenType[token.type].toLowerCase()}" `)
      }

    }

    case RuleType.BRANCH_EXIT: {
      if( 
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
        throw new Error(`Unexpected token "${escape(token.value)}" of type "${TokenType[token.type].toLowerCase()}" `)
      }
    }
  }
}