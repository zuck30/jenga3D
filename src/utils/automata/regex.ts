import { v4 as uuidv4 } from 'uuid';
import { Automaton, State, Transition } from '../../types/automaton';

/**
 * Full Thompson Construction for Regex (|, *, concat, ()).
 */

interface Fragment {
    start: string;
    end: string;
}

export const regexToNFA = (regex: string): Automaton => {
    const states: State[] = [];
    const transitions: Transition[] = [];

    const createId = () => uuidv4();
    const addState = (type: 'normal' | 'initial' | 'final' = 'normal') => {
        const id = createId();
        states.push({
            id,
            name: `q${states.length}`,
            type,
            position: [states.length * 2, 0, 0]
        });
        return id;
    };

    const addTransition = (sourceId: string, targetId: string, label: string) => {
        transitions.push({
            id: createId(),
            sourceId,
            targetId,
            label
        });
    };

    // 1. Preprocess: Add explicit concatenation dots
    // e.g. "ab|c" -> "a.b|c"
    const preprocess = (exp: string) => {
        let res = "";
        for (let i = 0; i < exp.length; i++) {
            const c1 = exp[i];
            res += c1;
            if (i + 1 < exp.length) {
                const c2 = exp[i + 1];
                if (c1 !== '(' && c1 !== '|' && c2 !== ')' && c2 !== '|' && c2 !== '*') {
                    res += '.';
                }
            }
        }
        return res;
    };

    // 2. Infix to Postfix (Shunting-yard)
    const getPrecedence = (c: string) => {
        if (c === '*') return 3;
        if (c === '.') return 2;
        if (c === '|') return 1;
        return 0;
    };

    const toPostfix = (exp: string) => {
        let postfix = "";
        const stack: string[] = [];
        const processed = preprocess(exp);

        for (const char of processed) {
            if (char === '(') {
                stack.push(char);
            } else if (char === ')') {
                while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                    postfix += stack.pop();
                }
                stack.pop();
            } else if (['*', '.', '|'].includes(char)) {
                while (stack.length > 0 && getPrecedence(stack[stack.length - 1]) >= getPrecedence(char)) {
                    postfix += stack.pop();
                }
                stack.push(char);
            } else {
                postfix += char;
            }
        }
        while (stack.length > 0) postfix += stack.pop();
        return postfix;
    };

    // 3. Build NFA from Postfix
    const postfix = toPostfix(regex);
    const stack: Fragment[] = [];

    for (const char of postfix) {
        if (char === '*') {
            const frag = stack.pop()!;
            const start = addState();
            const end = addState();
            addTransition(start, frag.start, 'ε');
            addTransition(start, end, 'ε');
            addTransition(frag.end, frag.start, 'ε');
            addTransition(frag.end, end, 'ε');
            stack.push({ start, end });
        } else if (char === '|') {
            const frag2 = stack.pop()!;
            const frag1 = stack.pop()!;
            const start = addState();
            const end = addState();
            addTransition(start, frag1.start, 'ε');
            addTransition(start, frag2.start, 'ε');
            addTransition(frag1.end, end, 'ε');
            addTransition(frag2.end, end, 'ε');
            stack.push({ start, end });
        } else if (char === '.') {
            const frag2 = stack.pop()!;
            const frag1 = stack.pop()!;
            addTransition(frag1.end, frag2.start, 'ε');
            stack.push({ start: frag1.start, end: frag2.end });
        } else {
            // Literal
            const start = addState();
            const end = addState();
            addTransition(start, end, char);
            stack.push({ start, end });
        }
    }

    if (stack.length > 0) {
        const finalFrag = stack.pop()!;
        const startNode = states.find(s => s.id === finalFrag.start);
        if (startNode) startNode.type = 'initial';

        const endNode = states.find(s => s.id === finalFrag.end);
        if (endNode) endNode.type = 'final';
    }

    // Improve layout
    states.forEach((s, i) => {
        s.position = [i * 2, Math.sin(i * 0.5) * 2, 0];
    });

    return {
        states,
        transitions,
        type: 'ε-NFA'
    };
};
