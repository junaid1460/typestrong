import { AnyToken, TokenType } from '../tokenizer';

export enum RuleType {
    BRANCH, // Test a token against multiple rules
    SIMPLE, // Simple rule that tests against token type and values
    STACK, // State transition while preserving current state
    OPTIONAL, // If turing machine reads this rule, it will skip the rule
}

/**
 * Simple rule can test against token type and value
 * the token holds
 */
export type SimpleRule = {
    // Type mentioning for runtime reference
    ruleType: RuleType.SIMPLE;

    // if value of -1 then it's considered as * or any
    tokenType: TokenType | typeof AnyToken;

    // If list is empty then comparison won't happen, and considered and success
    values: string[];

    // Should stay in state or not
    recursion: boolean;
};

/**
 * Makes transition to state mentioned in @stackTo
 * By stacking the new state over current
 */
export type StackRule = {
    // Type mentioning for runtime reference
    ruleType: RuleType.STACK;
    tokenType: TokenType | typeof AnyToken;
    // State to which transition should happen
    stackTo: string;
    // If list is empty then comparison won't happen, and considered and success
    values: string[];

    // Should stay in state or not
    recursion: boolean;
};

// Exit from a branch
export type OptionalRule = {
    // Type mentioning for runtime reference
    ruleType: RuleType.OPTIONAL;
    tokenType: TokenType | typeof AnyToken;
};

/**
 * Evaluates token against rules provided
 */
export type BranchRule = {
    // Type mentioning for runtime reference
    ruleType: RuleType.BRANCH;
    // Does not allow to nest branch rule within branch rule
    branches: (SimpleRule | StackRule | OptionalRule)[];

    isOptional: boolean;
};

export type Rule = BranchRule | SimpleRule | StackRule | OptionalRule;

export type MachineState = {
    // State for which rules are listed
    state: string;

    // Rules for the state
    // Rules are evaluated left-to-right one-by-one
    rules: Rule[];
};

export type MachineStateInstance = {
    // index of rule currently being evaluated in following
    // Provided machine state
    ruleIndex: number;
    brachRuleIndex: number;
    // Machine state
    machineState: MachineState;

    tokensRead: number;
};
