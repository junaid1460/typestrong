import { readFileSync } from 'fs';
import { AnyToken, TokenType } from '../tokenizer';
import { isAlpha } from '../utils';
import {
    BranchRule,
    MachineState,
    OptionalRule,
    RuleType,
    SimpleRule,
    StackRule,
} from './@types';

export const grammar = readFileSync(process.argv[3]).toString();

export function parseGrammar() {
    const states = grammar
        .trim()
        .split(';')
        .map((line) => line.trim())
        .filter((line) => line.indexOf('=>') >= 0)
        .map((line) => {
            const [stateName, rules] = line.split('=>').map((e) => e.trim());

            return {
                stateName,
                rules: rules.split(',').map((unit) => {
                    const rules = unit
                        .split('||')
                        .map((instruction) => {
                            const [first, second, third] = instruction
                                .trim()
                                .split(':')
                                .map((e) => e.trim());
                            const recursion = second === '@' || third === '@';
                            return {
                                token: first,
                                conditionalToken:
                                    second === '@' && recursion
                                        ? undefined
                                        : second,
                                recursion: recursion,
                            };
                        })
                        .map(({ conditionalToken, token, recursion }) => {
                            if (token === '?') {
                                return {
                                    ruleType: RuleType.OPTIONAL,
                                    tokenType: AnyToken,
                                } as OptionalRule;
                            } else if (
                                token.length &&
                                isAlpha(token.replace(/_/gi, '')) &&
                                token === token.toUpperCase()
                            ) {
                                const tokenType: TokenType = TokenType[
                                    token as any
                                ] as any;
                                if (tokenType === undefined) {
                                    throw new Error(
                                        `Invalid token type "${token}"`
                                    );
                                }
                                return {
                                    ruleType: RuleType.SIMPLE,
                                    tokenType: tokenType,
                                    recursion: recursion,
                                    value: '',
                                } as SimpleRule;
                            } else if (token.startsWith('@')) {
                                if (conditionalToken) {
                                    if (conditionalToken === '*') {
                                        const data = {
                                            ruleType: RuleType.STACK,
                                            stackTo: token as any,
                                            tokenType: AnyToken,
                                            recursion: recursion,
                                            value: '',
                                        } as StackRule;

                                        return data;
                                    } else if (
                                        conditionalToken.toUpperCase() ===
                                        conditionalToken
                                    ) {
                                        const tokenType: TokenType = TokenType[
                                            conditionalToken as any
                                        ] as any;
                                        const data = {
                                            ruleType: RuleType.STACK,
                                            stackTo: token as any,
                                            recursion: recursion,
                                            tokenType: tokenType,
                                            values: [],
                                        };

                                        return data;
                                    } else {
                                        return {
                                            ruleType: RuleType.STACK,
                                            stackTo: token as any,
                                            tokenType: AnyToken,
                                            recursion: recursion,
                                            values: [
                                                conditionalToken.replace(
                                                    '\\*',
                                                    '*'
                                                ),
                                            ],
                                        };
                                    }
                                } else {
                                    throw new Error('Condition is necessary');
                                }
                            } else {
                                if (token === '*') {
                                    return {
                                        ruleType: RuleType.SIMPLE,
                                        tokenType: AnyToken,
                                        recursion: recursion,
                                        value: '',
                                    } as SimpleRule;
                                }
                                return {
                                    ruleType: RuleType.SIMPLE,
                                    tokenType: AnyToken,
                                    recursion: recursion,
                                    value: token.replace('\\*', '*'),
                                } as SimpleRule;
                            }
                        });
                    return {
                        branches: rules,
                        ruleType: RuleType.BRANCH,
                        isOptional:
                            rules.findIndex(
                                (e) => e.ruleType === RuleType.OPTIONAL
                            ) >= 0,
                    } as BranchRule;
                }),
            };
        });

    const map = states.reduce((reduceTo, current) => {
        console.log(current.stateName, current.rules);
        return reduceTo.set(current.stateName, {
            state: current.stateName,
            rules: current.rules as any,
        });
    }, new Map<string, MachineState>());

    return map;
}
