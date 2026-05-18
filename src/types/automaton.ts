export type AutomatonType = 'DFA' | 'NFA' | 'ε-NFA';

export type StateType = 'normal' | 'initial' | 'final';

export interface State {
  id: string;
  name: string;
  type: StateType;
  position: [number, number, number];
}

export interface Transition {
  id: string;
  sourceId: string;
  targetId: string;
  label: string; // "0", "1", "ε", etc.
}

export interface Automaton {
  states: State[];
  transitions: Transition[];
  type: AutomatonType;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string | null;
  image?: string; // Data URL of the achievement card
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetLanguage: string;
  initialAutomaton?: Automaton;
  isCompleted: boolean;
}
