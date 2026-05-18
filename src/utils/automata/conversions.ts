import { v4 as uuidv4 } from 'uuid';
import { Automaton, State, Transition } from '../../types/automaton';
import { getEpsilonClosure } from './simulation';

/**
 * NFA to DFA conversion using Subset Construction algorithm.
 */
export const convertNFAToDFA = (nfa: Automaton): Automaton => {
  const dfaStates: State[] = [];
  const dfaTransitions: Transition[] = [];

  const nfaInitialState = nfa.states.find((s: State) => s.type === 'initial');
  if (!nfaInitialState) return nfa;

  const initialClosure = getEpsilonClosure([nfaInitialState.id], nfa.transitions).sort();
  const queue: string[][] = [initialClosure];
  const stateMap = new Map<string, string>(); // Sorted IDs -> DFA state ID

  const getMapKey = (ids: string[]) => ids.sort().join(',');

  const alphabet = Array.from(new Set(
    nfa.transitions
      .filter((t: Transition) => t.label !== 'ε' && t.label !== '')
      .map((t: Transition) => t.label)
  ));

  let stateCount = 0;
  while (queue.length > 0) {
    const currentSet = queue.shift()!;
    const key = getMapKey(currentSet);

    if (stateMap.has(key)) continue;

    const dfaStateId = uuidv4();
    stateMap.set(key, dfaStateId);

    const isFinal = currentSet.some(id => nfa.states.find((s: State) => s.id === id)?.type === 'final');
    const isInitial = key === getMapKey(initialClosure);

    dfaStates.push({
      id: dfaStateId,
      name: `Q${stateCount++}`,
      type: isInitial ? 'initial' : (isFinal ? 'final' : 'normal'),
      position: [stateCount * 3, 0, Math.sin(stateCount) * 3],
    });
  }

  // Generate transitions
  stateMap.forEach((dfaSourceId, key) => {
    const currentSet = key.split(',');
    alphabet.forEach(symbol => {
      const nextSet: string[] = [];
      currentSet.forEach(sId => {
        nfa.transitions.forEach((t: Transition) => {
          if (t.sourceId === sId && t.label === symbol) {
            if (!nextSet.includes(t.targetId)) nextSet.push(t.targetId);
          }
        });
      });

      const nextClosure = getEpsilonClosure(nextSet, nfa.transitions);
      if (nextClosure.length > 0) {
        const nextKey = getMapKey(nextClosure);
        const dfaTargetId = stateMap.get(nextKey);

        if (dfaTargetId) {
          dfaTransitions.push({
            id: uuidv4(),
            sourceId: dfaSourceId,
            targetId: dfaTargetId,
            label: symbol,
          });
        }
      }
    });
  });

  return {
    states: dfaStates,
    transitions: dfaTransitions,
    type: 'DFA'
  };
};

export const eliminateEpsilon = (automaton: Automaton): Automaton => {
  const newTransitions: Transition[] = [];
  const alphabet = Array.from(new Set(
    automaton.transitions
      .filter((t: Transition) => t.label !== 'ε' && t.label !== '')
      .map((t: Transition) => t.label)
  ));

  const newStates = automaton.states.map((s: State) => {
    const closure = getEpsilonClosure([s.id], automaton.transitions);
    const isFinal = closure.some(id => automaton.states.find((state: State) => state.id === id)?.type === 'final');

    alphabet.forEach(symbol => {
        const reached: string[] = [];
        closure.forEach(sId => {
          automaton.transitions.forEach((t: Transition) => {
            if (t.sourceId === sId && t.label === symbol) {
              if (!reached.includes(t.targetId)) reached.push(t.targetId);
            }
          });
        });

        const finalReached = getEpsilonClosure(reached, automaton.transitions);
        finalReached.forEach(targetId => {
          if (!newTransitions.find((t: Transition) => t.sourceId === s.id && t.targetId === targetId && t.label === symbol)) {
            newTransitions.push({
              id: uuidv4(),
              sourceId: s.id,
              targetId: targetId,
              label: symbol
            });
          }
        });
      });

    return {
      ...s,
      type: s.type === 'initial' ? 'initial' : (isFinal ? 'final' : 'normal') as any
    };
  });

  return {
    states: newStates,
    transitions: newTransitions,
    type: 'NFA'
  };
};

export const minimizeDFA = (automaton: Automaton): Automaton => {
  const states = automaton.states;
  const transitions = automaton.transitions;
  const alphabet = Array.from(new Set(transitions.map((t: Transition) => t.label)));

  let partitions: string[][] = [
    states.filter((s: State) => s.type === 'final').map((s: State) => s.id),
    states.filter((s: State) => s.type !== 'final').map((s: State) => s.id)
  ].filter(p => p.length > 0);

  let changed = true;
  while (changed) {
    changed = false;
    const newPartitions: string[][] = [];

    partitions.forEach(group => {
      if (group.length <= 1) {
        newPartitions.push(group);
        return;
      }

      const subgroups: Map<string, string[]> = new Map();
      group.forEach(stateId => {
        let signature = "";
        alphabet.forEach(symbol => {
          const trans = transitions.find((t: Transition) => t.sourceId === stateId && t.label === symbol);
          if (trans) {
            const targetPartitionIndex = partitions.findIndex(p => p.includes(trans.targetId));
            signature += `${symbol}:${targetPartitionIndex},`;
          } else {
            signature += `${symbol}:-1,`;
          }
        });

        if (!subgroups.has(signature)) subgroups.set(signature, []);
        subgroups.get(signature)!.push(stateId);
      });

      if (subgroups.size > 1) changed = true;
      subgroups.forEach(sub => newPartitions.push(sub));
    });
    partitions = newPartitions;
  }

  const minStates: State[] = [];
  const minTransitions: Transition[] = [];

  partitions.forEach((group, index) => {
    const repId = group[0];
    const repState = states.find((s: State) => s.id === repId)!;
    const isInitial = group.some(id => states.find((s: State) => s.id === id)?.type === 'initial');

    minStates.push({
      ...repState,
      id: `min-${index}`,
      name: `M${index}`,
      type: isInitial ? 'initial' : repState.type,
      position: [index * 4, 0, 0]
    });
  });

  partitions.forEach((group, index) => {
    const repId = group[0];
    alphabet.forEach(symbol => {
      const trans = transitions.find((t: Transition) => t.sourceId === repId && t.label === symbol);
      if (trans) {
        const targetGroupIndex = partitions.findIndex(p => p.includes(trans.targetId));
        minTransitions.push({
          id: uuidv4(),
          sourceId: `min-${index}`,
          targetId: `min-${targetGroupIndex}`,
          label: symbol
        });
      }
    });
  });

  return {
    states: minStates,
    transitions: minTransitions,
    type: 'DFA'
  };
};
