const fs = require('fs');
const file = 'src/Community.tsx';
let code = fs.readFileSync(file, 'utf8');

// Insert the effective constants right after isAdmin
const targetIsAdmin = `  const isAdmin = localStorage.getItem('adminAuth') === 'true';`;
const replaceIsAdmin = `  const isAdmin = localStorage.getItem('adminAuth') === 'true';
  const effectivePhone = isAdmin ? 'admin' : contributorPhone;
  const effectiveName = isAdmin ? 'অ্যাডমিন' : contributorName;
  const effectiveAvatar = isAdmin ? '' : contributorAvatar;`;

code = code.replace(targetIsAdmin, replaceIsAdmin);

// Now replace all contributorPhone with effectivePhone except in the signature.
// A safe way is to replace it inside the function body.
// The function body starts at `const [posts`
const idxStart = code.indexOf('const [posts');
let prefix = code.substring(0, idxStart);
let suffix = code.substring(idxStart);

suffix = suffix.replace(/contributorPhone/g, 'effectivePhone');
suffix = suffix.replace(/contributorName/g, 'effectiveName');
suffix = suffix.replace(/contributorAvatar/g, 'effectiveAvatar');

// Wait, the destructuring parameter is in prefix.
code = prefix + suffix;

// Now for the Blue Badge for Admin.
// In VerifiedBadge, it's a component. Let's create an AdminBadge right after it.
const targetBadge = `</svg>
);`;
const replaceBadge = `</svg>
);

const AdminBadge = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] text-[#0866FF] shrink-0 inline-block align-middle ml-1 -mt-0.5"
    title="Admin"
  >
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" />
  </svg>
);`;

code = code.replace(targetBadge, replaceBadge);

// Now in post render:
// {isVerifiedContributor(post.authorPhone, post.authorName) && <VerifiedBadge />}
// Replace with:
// {post.authorPhone === 'admin' ? <AdminBadge /> : (isVerifiedContributor(post.authorPhone, post.authorName) && <VerifiedBadge />)}
code = code.replace(
  `{isVerifiedContributor(post.authorPhone, post.authorName) && <VerifiedBadge />}`,
  `{post.authorPhone === 'admin' ? <AdminBadge /> : (isVerifiedContributor(post.authorPhone, post.authorName) && <VerifiedBadge />)}`
);

// Do the same for comments
code = code.replace(
  `{isVerifiedContributor(comment.authorPhone, comment.authorName) && <VerifiedBadge />}`,
  `{comment.authorPhone === 'admin' ? <AdminBadge /> : (isVerifiedContributor(comment.authorPhone, comment.authorName) && <VerifiedBadge />)}`
);

fs.writeFileSync(file, code);
console.log("Community.tsx patched successfully.");
