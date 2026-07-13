const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');

const target = `<span className="flex items-center">
                          {cont.name}
                          {isVerifiedContributor(cont.name, cont.phone) && <VerifiedBadge />}
                        </span>`;
const replacement = `<span className="flex items-center relative">
                          {cont.name}
                          {isVerifiedContributor(cont.name, cont.phone) && <VerifiedBadge />}
                          {onlineUsers.includes(cont.id) && <span className="absolute -top-1 -right-3 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>}
                        </span>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/Admin.tsx', content);
  console.log("Patched successfully.");
} else {
  console.log("Target not found!");
}
