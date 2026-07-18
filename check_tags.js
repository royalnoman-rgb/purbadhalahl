import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

let tags = [];
let regex = /<(\/?)([a-zA-Z0-9_]+)[^>]*>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  let isClosing = match[1] === '/';
  let tagName = match[2];
  if (tagName === 'br' || tagName === 'img' || tagName === 'input' || tagName === 'hr' || tagName === 'meta' || tagName === 'link' || tagName === 'path' || tagName === 'svg' || tagName === 'circle' || tagName === 'rect' || tagName === 'line' || tagName === 'polyline' || tagName === 'polygon' || match[0].endsWith('/>')) {
    continue;
  }
  if (!isClosing) {
    tags.push({name: tagName, index: match.index});
  } else {
    if (tags.length > 0 && tags[tags.length - 1].name === tagName) {
      tags.pop();
    } else {
      console.log(`Mismatch at index ${match.index}: found </${tagName}> but expected </${tags.length > 0 ? tags[tags.length-1].name : 'none'}>`);
      break;
    }
  }
}
console.log("Remaining unclosed tags:", tags.map(t => t.name));
