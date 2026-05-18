import { Automaton } from '../types/automaton';

export const saveAutomatonToFile = (automaton: Automaton) => {
    const data = JSON.stringify(automaton, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `automaton-${automaton.type}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
};

export const loadAutomatonFromFile = (file: File): Promise<Automaton> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const automaton = JSON.parse(e.target?.result as string);
                resolve(automaton);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
};
