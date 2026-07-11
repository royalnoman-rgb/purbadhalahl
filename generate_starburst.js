function getStarburstPath(cx, cy, spikes, outerRadius, innerRadius) {
    let path = '';
    const step = Math.PI / spikes;
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * step - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) path += \`M \${x} \${y}\`;
        else path += \` L \${x} \${y}\`;
    }
    path += ' Z';
    return path;
}
console.log(getStarburstPath(12, 12, 10, 12, 9));
console.log(getStarburstPath(12, 12, 12, 12, 9));
console.log(getStarburstPath(12, 12, 16, 12, 10.5));
