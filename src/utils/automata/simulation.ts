import { Automaton, State, Transition } from '../../types/automaton';

/**
 * Calculates the epsilon closure for a set of states.
 */
export const getEpsilonClosure = (stateIds: string[], transitions: Transition[]): string[] => {
  const closure = new Set(stateIds);
  const stack = [...stateIds];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    const epsilonTransitions = transitions.filter(
      (t) => t.sourceId === currentId && (t.label === 'ε' || t.label === '')
    );

    epsilonTransitions.forEach((t) => {
      if (!closure.has(t.targetId)) {
        closure.add(t.targetId);
        stack.push(t.targetId);
      }
    });
  }

  return Array.from(closure);
};

/**
 * Computes the next set of states given current states and an input symbol.
 */
export const getNextStates = (
  currentStateIds: string[],
  symbol: string,
  transitions: Transition[]
): string[] => {
  const nextStates = new Set<string>();

  // For each current state, find transitions matching the symbol
  currentStateIds.forEach((stateId) => {
    transitions.forEach((t) => {
      if (t.sourceId === stateId && t.label === symbol) {
        nextStates.add(t.targetId);
      }
    });
  });

  // After moving with a symbol, we also need to consider the epsilon closure of the resulting states
  return getEpsilonClosure(Array.from(nextStates), transitions);
};

/**
 * Checks if a set of state IDs contains any final state.
 */
export const containsFinalState = (stateIds: string[], states: State[]): boolean => {
  return stateIds.some((id) => {
    const state = states.find((s) => s.id === id);
    return state?.type === 'final';
  });
};
