const fs = require('fs');

// Community.tsx
let commCode = fs.readFileSync('src/Community.tsx', 'utf8');
commCode = commCode.replace(
  "{post.authorPhone !== 'admin' && onlineUsers.includes(post.authorPhone) && <div className=\"absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full\"></div>}",
  "{onlineUsers.includes(post.authorPhone) && <div className=\"absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full\"></div>}"
);

commCode = commCode.replace(
  "{comment.authorPhone !== 'admin' && onlineUsers.includes(comment.authorPhone) && <div className=\"absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full\"></div>}",
  "{onlineUsers.includes(comment.authorPhone) && <div className=\"absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full\"></div>}"
);
fs.writeFileSync('src/Community.tsx', commCode);

// App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  "{review.authorPhone && onlineUsers.includes(review.authorPhone) && <div className=\"absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full\"></div>}",
  "{review.authorPhone && onlineUsers.includes(review.authorPhone) && <div className=\"absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full\"></div>}"
); // No change needed for reviews, but verify if admin can review.

fs.writeFileSync('src/App.tsx', appCode);

