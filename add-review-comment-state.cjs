const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('reviewCommentTexts')) {
  code = code.replace(
    'const [publicReviews, setPublicReviews] = useState<any[]>([]);',
    'const [publicReviews, setPublicReviews] = useState<any[]>([]);\n  const [reviewCommentTexts, setReviewCommentTexts] = useState<Record<string, string>>({});\n  const [expandedReviewComments, setExpandedReviewComments] = useState<string[]>([]);'
  );
  fs.writeFileSync('src/App.tsx', code);
}
