import { Instance } from 'chalk';
import { AnyToken, Token, tokenize, TokenType } from '../tokenizer';
import {
    MachineState,
    MachineStateInstance,
    RuleType,
    SimpleRule,
    StackRule,
} from './@types';
import { getNextSate } from './statemachine';
const chalk = new Instance({ level: 3 });
const log = console.log;

function escape(str: string) {
    return str.replace(/\n/gi, '\\n');
}

export function parse(fileContent: string) {
    const tokens = tokenize(fileContent);
    const states: MachineStateInstance[] = [
        {
            ruleIndex: 0,
            machineState: getNextSate('@begin'),
            tokensRead: 0,
            brachRuleIndex: 0,
            ruleIndexChanged: false,
        },
    ];
    let tokenStream = tokens.next();
    let evaluatedString = '';

    tokenIterable: while (!tokenStream.done) {
        const token = tokenStream.value;

        const currentState = states[states.length - 1];
        if (!currentState) {
            log(evaluatedString);
            throw new Error('Internal compiler error');
        }
        const currentMachineState = currentState.machineState;
        if (currentState.ruleIndex >= currentState.machineState.rules.length) {
            const popped = states.pop();
            const newState = states[states.length - 1];
            if (popped?.tokensRead !== 0) {
                if (newState) newState.brachRuleIndex = 0;
            } else {
                if (newState && !newState.ruleIndexChanged)
                    newState.brachRuleIndex += 1;
            }
            log(chalk.red('-'), popped!!.machineState.state);
            continue tokenIterable;
        }

        const currentRule = currentMachineState.rules[currentState.ruleIndex];
        currentState.ruleIndexChanged = false;
        mainBranch: switch (currentRule.ruleType) {
            // Main rule check.
            case RuleType.BRANCH: {
                branchRules: while (
                    currentState.brachRuleIndex < currentRule.branches.length
                ) {
                    const branchRule =
                        currentRule.branches[currentState.brachRuleIndex];
                    if (
                        branchRule.tokenType === token.type ||
                        branchRule.tokenType === AnyToken
                    ) {
                        if (branchRule.ruleType === RuleType.OPTIONAL) {
                            currentState.ruleIndex += 1;
                            currentState.ruleIndexChanged = true;
                            continue tokenIterable;
                        }

                        const result = handleNonBranchRules(branchRule, token);
                        if (result.action === RuleAction.ERROR) {
                            ++currentState.brachRuleIndex;
                            continue branchRules;
                        }
                        if (result.action === RuleAction.STACK) {
                            states.push({
                                machineState: result.state,
                                ruleIndex: 0,
                                tokensRead: 0,
                                brachRuleIndex: 0,
                                ruleIndexChanged: false,
                            });
                            log(chalk.green('+'), result.state.state);
                            if ((branchRule as StackRule).recursion === true) {
                                // don't push for self recursion
                                // currentState.brachRuleIndex = 0
                                continue tokenIterable;
                            }
                            currentState.brachRuleIndex = 0;
                            currentState.ruleIndex += 1;
                            currentState.ruleIndexChanged = true;
                            continue tokenIterable;
                        }
                        if (result.action === RuleAction.STAY_OR_FORWARD) {
                            if ((branchRule as SimpleRule).recursion === true) {
                                currentState.brachRuleIndex = 0;
                                break mainBranch;
                            }
                        }

                        currentState.ruleIndex += 1;
                        currentState.ruleIndexChanged = true;
                        currentState.brachRuleIndex = 0;
                        break mainBranch;
                    }
                    ++currentState.brachRuleIndex;
                }

                throw new Error(
                    `Unexpected token "${escape(
                        token.value
                    )}" of type "${TokenType[
                        token.type
                    ].toLowerCase()}" \n while expected ${currentRule.branches
                        .map((e) =>
                            [
                                TokenType[e.tokenType],
                                e.ruleType === RuleType.SIMPLE
                                    ? e.values.join(', ')
                                    : undefined,
                            ]
                                .filter((e) => e)
                                .join()
                        )
                        .join(' or ')} \n  ${evaluatedString} `
                );
            }
        }

        ++currentState.tokensRead;
        log(
            chalk.green('☑'),
            `${chalk.green(escape(token.value))} in ${chalk.yellow(
                currentMachineState.state
            )}`
        );
        evaluatedString += token.value;
        tokenStream = tokens.next();
        log(
            chalk.yellow('☐'),
            ` ${chalk.green(escape(tokenStream.value.value))}`,
            currentState.ruleIndex
        );
        log(` ${chalk.yellow(currentMachineState.state)}`);
    }
}

enum RuleAction {
    FORWARD,
    STAY_OR_FORWARD,
    STACK,
    ERROR,
}
function handleNonBranchRules(
    rule: SimpleRule | StackRule,
    token: Token
):
    | {
          action:
              | RuleAction.FORWARD
              | RuleAction.STAY_OR_FORWARD
              | RuleAction.ERROR;
      }
    | { action: RuleAction.STACK; state: MachineState } {
    switch (rule.ruleType) {
        case RuleType.SIMPLE: {
            if (
                (rule.tokenType === AnyToken ||
                    (rule as SimpleRule).tokenType === token.type) &&
                (rule.values.length === 0 || rule.values.includes(token.value))
            ) {
                return {
                    action: RuleAction.STAY_OR_FORWARD,
                };
            } else {
                return {
                    action: RuleAction.ERROR,
                };
            }
        }

        case RuleType.STACK: {
            if (
                (rule.tokenType === AnyToken ||
                    rule.tokenType === token.type) &&
                (rule.values.length === 0 || rule.values.includes(token.value))
            ) {
                return {
                    action: RuleAction.STACK,
                    state: getNextSate(rule.stackTo),
                };
            } else {
                return {
                    action: RuleAction.ERROR,
                };
            }
        }
    }
}
