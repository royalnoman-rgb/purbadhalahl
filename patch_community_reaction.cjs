const fs = require('fs');
let content = fs.readFileSync('src/Community.tsx', 'utf8');

const target = `  const handleReaction = async (postId: string, type: 'like' | 'love') => {`;

content = content.replace(target, target); // No change, just checking

fs.writeFileSync('src/Community.tsx', content);
