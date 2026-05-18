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

## Tech Stack 🛠️

- **Frontend**: React + TypeScript + Vite
- **3D**: Three.js + React Three Fiber + Drei
- **State Management**: Zustand (with Persist middleware)
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Animations**: Framer Motion & Canvas Confetti

## Getting Started 🏁

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/zuck30/jenga3d.git
   cd jenga3d
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Controls 🎮

- **S**: Select Mode
- **A**: Add State Mode
- **T**: Add Transition Mode
- **Del / Backspace**: Delete Mode
- **Click Grid**: Add state (in Add State mode)
- **Click State**: Select state / Start transition
- **OrbitControls**: Left click to rotate, Right click to pan, Scroll to zoom.

## Creator 👨‍💻
Developed by **zuck30**

## License 📄
MIT License - see [LICENSE](LICENSE) for details.
