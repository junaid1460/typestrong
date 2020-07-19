import { parseGrammar } from "./grammar";

const machineStateMap = parseGrammar()

export function getNextSate(
  nextStateREF: string
) {
  const nextState = machineStateMap.get(nextStateREF)

  // This is language parsing error
  if (!nextState) {
    throw new Error('Compiler error')
  }

  return nextState
}
