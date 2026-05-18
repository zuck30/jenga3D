import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Automaton, State, Transition, AutomatonType, StateType, Achievement, Challenge } from '../types/automaton';
import { getEpsilonClosure, getNextStates, containsFinalState } from '../utils/automata/simulation';
import { convertNFAToDFA, eliminateEpsilon, minimizeDFA } from '../utils/automata/conversions';
import { regexToNFA } from '../utils/automata/regex';

interface AppState {
  automaton: Automaton;
  selectedElement: { id: string; type: 'state' | 'transition' } | null;
  mode: 'select' | 'addState' | 'addTransition' | 'delete';
  simulation: {
    isRunning: boolean;
    currentStates: string[];
    activeTransitions: string[]; // IDs of transitions currently being traversed
    inputString: string;
    currentIndex: number;
    result: 'accepted' | 'rejected' | 'pending' | null;
  };
  achievements: Achievement[];
  challenges: Challenge[];

  // Actions
  setAutomatonType: (type: AutomatonType) => void;
  addState: (position: [number, number, number]) => void;
  updateState: (id: string, updates: Partial<State>) => void;
  deleteState: (id: string) => void;
  addTransition: (sourceId: string, targetId: string, label: string) => void;
  updateTransition: (id: string, updates: Partial<Transition>) => void;
  deleteTransition: (id: string) => void;
  setSelectedElement: (element: { id: string; type: 'state' | 'transition' } | null) => void;
  setMode: (mode: AppState['mode']) => void;

  // Simulation actions
  setSimulationInput: (input: string) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  stepSimulation: () => void;
  resetSimulation: () => void;

  // Achievement actions
  unlockAchievement: (id: string, image?: string) => void;
  loadChallenge: (id: string) => void;

  // Algorithms
  runNFAToDFA: () => void;
  runEliminateEpsilon: () => void;
  runMinimizeDFA: () => void;
  createFromRegex: (regex: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      automaton: {
        states: [],
        transitions: [],
        type: 'DFA',
      },
      selectedElement: null,
      mode: 'select',
      simulation: {
        isRunning: false,
        currentStates: [],
        activeTransitions: [],
        inputString: '',
        currentIndex: 0,
        result: null,
      },
      achievements: [
        { id: 'first-state', title: 'First State', description: 'Create your first state', unlockedAt: null },
        { id: 'first-transition', title: 'First Transition', description: 'Create your first transition', unlockedAt: null },
        { id: 'string-accepted', title: 'String Accepted', description: 'First successful acceptance', unlockedAt: null },
        { id: 'dfa-builder', title: 'DFA Builder', description: 'Complete DFA with ≥3 states', unlockedAt: null },
        { id: 'epsilon-vanquisher', title: 'ε Vanquisher', description: 'Eliminate epsilon transitions', unlockedAt: null },
      ],
      challenges: [
        { id: 'ch1', title: 'Challenge 1: Binary End', description: 'Build a DFA that accepts binary strings ending with "0". Hint: You need at least 2 states.', targetLanguage: 'ending with 0', isCompleted: false },
        { id: 'ch2', title: 'Challenge 2: Substring Search', description: 'Build a DFA for strings containing the substring "01". Tip: This is a 3-state machine.', targetLanguage: 'contains 01', isCompleted: false },
        { id: 'ch3', title: 'Challenge 3: Edge NFA', description: 'Build an NFA for "starts with 0 and ends with 1". Note: Use branching for NFA power!', targetLanguage: 'starts 0, ends 1', isCompleted: false },
        { id: 'ch4', title: 'Challenge 4: Even Zeros', description: 'Build a DFA for strings with an even number of 0s. Tip: Use a "loop-back" strategy.', targetLanguage: 'even number of 0s', isCompleted: false },
        { id: 'ch5', title: 'Challenge 5: Modulo 3', description: 'Build a DFA that accepts binary numbers divisible by 3. High difficulty!', targetLanguage: 'binary mod 3 == 0', isCompleted: false },
        { id: 'ch6', title: 'Challenge 6: Epsilon Jump', description: 'Build an ε-NFA for (0|1)*0. Use at least one epsilon transition.', targetLanguage: '(0|1)*0', isCompleted: false },
      ],

      setAutomatonType: (type) => set((state) => ({ automaton: { ...state.automaton, type } })),

      addState: (position) => set((state) => {
        const newState: State = {
          id: uuidv4(),
          name: `q${state.automaton.states.length}`,
          type: state.automaton.states.length === 0 ? 'initial' : 'normal',
          position,
        };
        const newStates = [...state.automaton.states, newState];

        if (state.achievements.find(a => a.id === 'first-state' && !a.unlockedAt)) {
          setTimeout(() => get().unlockAchievement('first-state'), 0);
        }

        return {
          automaton: { ...state.automaton, states: newStates },
        };
      }),

      updateState: (id, updates) => set((state) => ({
        automaton: {
          ...state.automaton,
          states: state.automaton.states.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        },
      })),

      deleteState: (id) => set((state) => ({
        automaton: {
          ...state.automaton,
          states: state.automaton.states.filter((s) => s.id !== id),
          transitions: state.automaton.transitions.filter((t) => t.sourceId !== id && t.targetId !== id),
        },
        selectedElement: state.selectedElement?.id === id ? null : state.selectedElement,
      })),

      addTransition: (sourceId, targetId, label) => set((state) => {
        const newTransition: Transition = {
          id: uuidv4(),
          sourceId,
          targetId,
          label,
        };

        if (state.achievements.find(a => a.id === 'first-transition' && !a.unlockedAt)) {
          setTimeout(() => get().unlockAchievement('first-transition'), 0);
        }

        return {
          automaton: {
            ...state.automaton,
            transitions: [...state.automaton.transitions, newTransition],
          },
        };
      }),

      updateTransition: (id, updates) => set((state) => ({
        automaton: {
          ...state.automaton,
          transitions: state.automaton.transitions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        },
      })),

      deleteTransition: (id) => set((state) => ({
        automaton: {
          ...state.automaton,
          transitions: state.automaton.transitions.filter((t) => t.id !== id),
        },
        selectedElement: state.selectedElement?.id === id ? null : state.selectedElement,
      })),

      setSelectedElement: (element) => set({ selectedElement: element }),

      setMode: (mode) => set({ mode }),

      setSimulationInput: (inputString) => set((state) => ({
        simulation: { ...state.simulation, inputString }
      })),

      startSimulation: () => set((state) => {
        const initialState = state.automaton.states.find(s => s.type === 'initial');
        if (!initialState) return state;

        const initialStates = getEpsilonClosure([initialState.id], state.automaton.transitions);

        return {
          simulation: {
            ...state.simulation,
            isRunning: true,
            currentStates: initialStates,
            activeTransitions: [],
            currentIndex: 0,
            result: 'pending',
          }
        };
      }),

      stopSimulation: () => set((state) => ({
        simulation: { ...state.simulation, isRunning: false, result: null }
      })),

      stepSimulation: () => set((state) => {
        const { automaton, simulation } = state;

        if (simulation.currentIndex >= simulation.inputString.length) {
            const isAccepted = containsFinalState(simulation.currentStates, automaton.states);

            if (isAccepted && state.achievements.find(a => a.id === 'string-accepted' && !a.unlockedAt)) {
                setTimeout(() => get().unlockAchievement('string-accepted'), 0);
            }

            return {
                simulation: {
                    ...simulation,
                    isRunning: false,
                    result: isAccepted ? 'accepted' : 'rejected'
                }
            };
        }

        const char = simulation.inputString[simulation.currentIndex];

        // Find transitions that are being triggered
        const triggeredTransitions = automaton.transitions.filter(t =>
            simulation.currentStates.includes(t.sourceId) && t.label === char
        );

        const nextStates = getNextStates(simulation.currentStates, char, automaton.transitions);

        return {
            simulation: {
                ...simulation,
                currentStates: nextStates,
                activeTransitions: triggeredTransitions.map(t => t.id),
                currentIndex: simulation.currentIndex + 1,
            }
        };
      }),

      resetSimulation: () => set((state) => ({
        simulation: {
            ...state.simulation,
            isRunning: false,
            currentStates: [],
            activeTransitions: [],
            currentIndex: 0,
            result: null,
        }
      })),

      unlockAchievement: (id, image) => set((state) => ({
        achievements: state.achievements.map(a =>
            a.id === id ? { ...a, unlockedAt: new Date().toISOString(), image } : a
        )
      })),

      loadChallenge: (id) => set((state) => {
        const challenge = state.challenges.find(c => c.id === id);
        if (!challenge) return state;
        return {
            automaton: challenge.initialAutomaton || {
                states: [{ id: uuidv4(), name: 'q0', type: 'initial', position: [0, 0, 0] }],
                transitions: [],
                type: 'DFA',
            },
            simulation: { ...state.simulation, result: null }
        };
      }),

      runNFAToDFA: () => set((state) => ({
          automaton: convertNFAToDFA(state.automaton)
      })),

      runEliminateEpsilon: () => set((state) => ({
          automaton: eliminateEpsilon(state.automaton)
      })),

      runMinimizeDFA: () => set((state) => ({
          automaton: minimizeDFA(state.automaton)
      })),

      createFromRegex: (regex: string) => set((state) => ({
          automaton: regexToNFA(regex)
      })),
    }),
    {
      name: 'jenga3d-storage',
      partialize: (state) => ({
          automaton: state.automaton,
          achievements: state.achievements,
          challenges: state.challenges
      }),
    }
  )
);
