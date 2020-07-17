import { Instance } from 'chalk'
import { Token, tokenize, TokenType } from "./tokenizer"
const chalk = new Instance({level:3})
const log = console.log

enum RuleType {
  BRANCH,
  SIMPLE,
  STACK,
}

enum State {
  BEGIN,
  CONTRACT,
  FUNCTION,
  STRUCT,
  DECLARATION,
  VARNAME,
  SEPARATORS,
  NEWLINE,

  FORWARD, // Branch forward to next rule, either next rule in list or pop
  NOWHERE, // Stay in current state
}

type SimpleRule = {
  ruleType: RuleType.SIMPLE,
  tokenType: TokenType,
  values: string[]
}

type StackRule = {
  ruleType: RuleType.STACK,
  tokenType: TokenType,
  stackTo: State,
  values: string[]
}

type BranchRule = {
  ruleType: RuleType.BRANCH;
  branches: (SimpleRule | StackRule)[]
}


type Rule = BranchRule | SimpleRule | StackRule

type MachineState = {
  state: State,
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

const evaluateAlphaSequenceStay = (equalsTo?: string) => ({
  branchTo: State.NOWHERE,
  tokenType: TokenType.NAME,
  values: [],
  ruleType: RuleType.SIMPLE
} as SimpleRule)

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
      tokenType: TokenType.ANYTOKEN,
      values: [],
      ruleType: RuleType.SIMPLE
    }]
  }]
}


const evaluateVariableName = () =>  ({
  stackTo: State.VARNAME,
  tokenType: TokenType.ANYTOKEN,
  values:[],
  ruleType: RuleType.STACK
} as StackRule)

const evaluateSeparators = () =>  ({
  stackTo: State.SEPARATORS,
  tokenType: TokenType.ANYTOKEN,
  values:[],
  ruleType: RuleType.STACK
} as StackRule)

const evalConst = (name: string) => {
  return {
    tokenType: TokenType.NAME,
    values:[ name ],
    ruleType: RuleType.SIMPLE
  } as SimpleRule
}



const contractState: MachineState =  {
  state: State.CONTRACT,
  rules: [
    evalConst('contract'), 
    evaluateSeparators(), 
    evaluateVariableName(),
    evaluateSeparators(), 
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
      tokenType: TokenType.ANYTOKEN,
      values: [],
      ruleType: RuleType.SIMPLE
    }]
  }]
}

const machineStates: MachineState[] = [beginState, varNameState, separatorsState, contractState]
const machineStateMap = machineStates.reduce(
    (stateMap, current) => stateMap.set(current.state, current), 
    new Map<number, MachineState>()
)


type MachineStateInstance  = { ruleIndex: number, machineState: MachineState }

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
    if(currentState.ruleIndex >= currentState.machineState.rules.length   ) {
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
          if(branchRule.tokenType === token.type || branchRule.tokenType === TokenType.ANYTOKEN) {
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
        throw new Error(`1: Unexpected token ${token.value} ${TokenType[token.type].toLowerCase()} `)
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
            continue tokenIterable;
          }
        }
      }

      
    }
    log(`evaluated ${ chalk.green(escape(token.value))}`)
    tokenStream = tokens.next()
    count += 1
  }
}

enum RuleAction {
  FORWARD,
  STAY_OR_FORWARD,
  STACK
}
function handleNonBranchRules(
  rule: SimpleRule | StackRule, 
  token: Token,
): { action: RuleAction.FORWARD | RuleAction.STAY_OR_FORWARD } | { action: RuleAction.STACK , state: MachineState } {

  switch(rule.ruleType) {
    case RuleType.SIMPLE: {
      if( 
        rule.tokenType === TokenType.ANYTOKEN || 
        rule.tokenType === token.type && ( 
          rule.values.length === 0 || 
          rule.values.includes(token.value)
        )
      ) {
        return {
          action: rule.tokenType === TokenType.ANYTOKEN ?  RuleAction.FORWARD :  RuleAction.STAY_OR_FORWARD,
        }
      } else {
        throw new Error(`2: Unexpected token "${escape(token.value)}" of type "${TokenType[token.type].toLowerCase()}" `)
      }
    }

    case RuleType.STACK: {
      if( 
        rule.tokenType === TokenType.ANYTOKEN || 
        rule.tokenType === token.type && ( 
          rule.values.length === 0 || 
          rule.values.includes(token.value)
        )
      ) {
        return   {
          action: RuleAction.STACK,
          state: getNextSate(rule.stackTo)
        }   
      } else {
         throw new Error(`2: Unexpected token ${token.value} ${TokenType[token.type].toLowerCase()} `)
      }

    }
  }
}