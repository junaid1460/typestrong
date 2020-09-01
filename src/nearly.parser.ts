import { Grammar, Parser } from 'nearley';
import grammar from './grammar.compiled';

export const parser = new Parser(Grammar.fromCompiled(grammar));
