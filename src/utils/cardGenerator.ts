/**
 * Utility to capture the Three.js canvas and generate a shareable achievement card.
 */

export const generateAchievementCard = async (
    canvas: HTMLCanvasElement,
    title: string,
    description: string,
    creator: string = "zuck30"
): Promise<string> => {
    // Create a temporary canvas to draw the card
    const cardCanvas = document.createElement('canvas');
    const ctx = cardCanvas.getContext('2d');
    if (!ctx) throw new Error("Could not get 2D context");

    cardCanvas.width = 800;
    cardCanvas.height = 1000;

    // 1. Draw Background
    const gradient = ctx.createLinearGradient(0, 0, 0, cardCanvas.height);
    gradient.addColorStop(0, '#0f172a'); // slate-900
    gradient.addColorStop(1, '#1e1b4b'); // indigo-950
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cardCanvas.width, cardCanvas.height);

    // 2. Draw the 3D capture
    // Note: To capture correctly, preserveDrawingBuffer must be true in WebGL or we capture right after render
    const captureWidth = 700;
    const captureHeight = 500;
    const captureX = (cardCanvas.width - captureWidth) / 2;
    const captureY = 100;

    // Draw border for capture
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(captureX - 2, captureY - 2, captureWidth + 4, captureHeight + 4);

    ctx.drawImage(canvas, captureX, captureY, captureWidth, captureHeight);

    // 3. Draw Meta Info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, cardCanvas.width / 2, 700);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '20px Inter, system-ui, sans-serif';
    ctx.fillText(description, cardCanvas.width / 2, 740);

    // 4. Footer info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`BUILDER: ${creator.toUpperCase()}`, cardCanvas.width / 2, 900);

    ctx.fillStyle = '#22d3ee'; // cyan-400
    ctx.font = 'bold 24px monospace';
    ctx.fillText("JENGA3D // THEORY OF COMPUTATION", cardCanvas.width / 2, 940);

    // 5. Add a "neon" glow effect
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, cardCanvas.width - 40, cardCanvas.height - 40);

    return cardCanvas.toDataURL('image/png');
};

export const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
};
