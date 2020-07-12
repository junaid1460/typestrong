import { TokenType } from "./tokenizer"

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
      value: string[]
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
              value:[ 'contract']
            }
          },
          {       
            to: 'FUNCTION',
            when: {
              type: TokenType.NAME,
              value: ['function']
            }
          },
          {
            to: 'STRUCT',
            when: {
              type: TokenType.NAME,
              value: ['struct']
            }
          },
          {  
            to: 'DECLARATION',
            when: {
              type: TokenType.NAME,
              value: ['const', 'let']
            }
          },
      
      ],
        type: RuleType.BRANCH
    }]
}]

