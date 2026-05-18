# Jenga3D 🧱✨

**Jenga3D** is an interactive 3D educational web application for learning Theory of Computation (TOC), specifically finite automata (DFA, NFA, ε-NFA), state diagrams, conversions, and related concepts.

Users build automata in 3D space, simulate string acceptance with glowing particle animations, earn shareable achievement cards, and explore TOC topics progressively.

## Features 🚀

- **3D Automata Editor**: Create and manipulate states and transitions in a beautiful 3D environment using React Three Fiber.
- **Simulation Engine**: Step-by-step visualization of string acceptance for DFA, NFA, and ε-NFA.
- **Algorithmic Tools**:
  - **ε-NFA → NFA**: Eliminate epsilon transitions.
  - **NFA → DFA**: Subset construction algorithm.
  - **DFA Minimization**: Table-filling algorithm.
  - **Regex to NFA**: Thompson Construction (supports `|`, `*`, `concat`, `()`).
- **Achievement Cards**: Earn and download aesthetic achievement cards as PNGs, capturing your 3D creations.
- **Interactive Challenges**: Progressive learning path to master automata design.
- **Persistence**: Automatic saving to local storage and manual JSON export/import.
- **Responsive Design**: Works on Desktop and Mobile.

## How to Solve Challenges 🧩

1. **Read the Requirement**: Check the left sidebar for your target language (e.g., "ends with 0").
2. **Identify States**: Think about what information you need to "remember". For "ends with 0", you need to know if the last character seen was a 0 or a 1.
3. **Map Transitions**:
   - From State A (last was 1), seeing a '0' moves to State B (last was 0).
   - From State B (last was 0), seeing a '1' moves to State A (last was 1).
4. **Set Final States**: Mark the states that represent "Acceptance" (e.g., State B where the last seen was 0).
5. **Test**: Use the Simulation panel to run strings like "1010" and verify it hits a final state.

## TOC Tips & Guidance 💡

- **DFA vs NFA**: In a DFA, every state must have exactly one exit transition for every character in the alphabet. In an NFA, you can have zero, one, or many.
- **Epsilon (ε)**: These are "free" transitions. You can move across them without reading any character from the input string.
- **Subset Construction**: This is the magic that turns an NFA into a DFA. It works by creating new states that represent "sets of possible states" the NFA could be in.
- **Minimization**: A minimized DFA is the most efficient version of a machine. It merges states that behave identically for all future inputs.

## Tech Stack 🛠️

- **Frontend**: React + TypeScript + Vite
- **3D**: Three.js + React Three Fiber + Drei
- **State Management**: Zustand
- **Styling**: TailwindCSS v4
- **Icons**: Lucide React

## Getting Started 🏁

```bash
npm install
npm run dev
```

## Creator 👨‍💻
Developed by **zuck30**

## License 📄
MIT License
