const fs = require('fs');

const files = ['src/App.tsx', 'src/Admin.tsx', 'src/Community.tsx'];

const oldTooltipText = "Accounts with a verified badge have been authenticated and can be Meta Verified subscribers or notable persons or brands.";
const newTooltipText = "এই ভেরিফাইড ব্যাজটি নির্দেশ করে যে ব্যবহারকারীর পরিচয় যাচাইকৃত এবং তিনি আমাদের প্ল্যাটফর্মের একজন বিশ্বস্ত কন্ট্রিবিউটর বা সম্মানিত ব্যক্তি।";

const verifiedBadgeSVGTarget = `<path fillRule="evenodd" clipRule="evenodd" d="M12 0.5C12 0.5 13.0623 3.01894 14.806 3.61907C16.6344 4.24838 19.349 3.51868 19.349 3.51868C19.349 3.51868 19.3871 6.30907 20.6558 7.74723C21.8596 9.11202 23.5 10.5187 23.5 10.5187C23.5 10.5187 21.055 11.8398 20.6558 13.5C20.2195 15.3147 21.3653 17.893 21.3653 17.893C21.3653 17.893 18.6667 18.0673 17.2798 19.2612C15.8203 20.5175 14.806 23.0187 14.806 23.0187C14.806 23.0187 12 21.3 12 21.3C12 21.3 9.194 23.0187 9.194 23.0187C9.194 23.0187 8.1797 20.5175 6.7202 19.2612C5.3333 18.0673 2.6347 17.893 2.6347 17.893C2.6347 17.893 3.7805 15.3147 3.3442 13.5C2.945 11.8398 0.5 10.5187 0.5 10.5187C0.5 10.5187 2.1404 9.11202 3.3442 7.74723C4.6129 6.30907 4.651 3.51868 4.651 3.51868C4.651 3.51868 7.3656 4.24838 9.194 3.61907C10.9377 3.01894 12 0.5 12 0.5Z" fill="#0866FF"/>
        <path d="M10.125 15.0833L6.375 11.3333L7.55417 10.1542L10.125 12.725L16.6125 6.2375L17.7917 7.41667L10.125 15.0833Z" fill="white"/>`;

const verifiedBadgeSVGReplacement = `<path d="M22.5 12.536V11.464L20.892 9.114L21.214 6.273L18.441 5.437L16.51 3.239L13.8 4.029L12 2.25L10.2 4.029L7.49 3.239L5.559 5.437L2.786 6.273L3.108 9.114L1.5 11.464V12.536L3.108 14.886L2.786 17.727L5.559 18.563L7.49 20.761L10.2 19.971L12 21.75L13.8 19.971L16.51 20.761L18.441 18.563L21.214 17.727L20.892 14.886L22.5 12.536Z" fill="#0866FF"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M16.53 8.47a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.97 1.97 4.97-4.97a.75.75 0 0 1 1.06 0z" fill="white"/>`;

const adminBadgeTarget = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] text-[#0866FF] shrink-0 inline-block align-middle ml-1" title="Admin"><circle cx="12" cy="12" r="12" fill="currentColor" /><path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" /></svg>`;
const adminBadgeTarget2 = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] text-[#0866FF] shrink-0 inline-block align-middle ml-3" title="Admin"><circle cx="12" cy="12" r="12" fill="currentColor" /><path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" /></svg>`;

const adminBadgeReplacement1 = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] shrink-0 inline-block align-middle ml-1" title="Admin"><path d="M22.5 12.536V11.464L20.892 9.114L21.214 6.273L18.441 5.437L16.51 3.239L13.8 4.029L12 2.25L10.2 4.029L7.49 3.239L5.559 5.437L2.786 6.273L3.108 9.114L1.5 11.464V12.536L3.108 14.886L2.786 17.727L5.559 18.563L7.49 20.761L10.2 19.971L12 21.75L13.8 19.971L16.51 20.761L18.441 18.563L21.214 17.727L20.892 14.886L22.5 12.536Z" fill="#0866FF"/><path fillRule="evenodd" clipRule="evenodd" d="M16.53 8.47a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.97 1.97 4.97-4.97a.75.75 0 0 1 1.06 0z" fill="white"/></svg>`;
const adminBadgeReplacement2 = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] shrink-0 inline-block align-middle ml-3" title="Admin"><path d="M22.5 12.536V11.464L20.892 9.114L21.214 6.273L18.441 5.437L16.51 3.239L13.8 4.029L12 2.25L10.2 4.029L7.49 3.239L5.559 5.437L2.786 6.273L3.108 9.114L1.5 11.464V12.536L3.108 14.886L2.786 17.727L5.559 18.563L7.49 20.761L10.2 19.971L12 21.75L13.8 19.971L16.51 20.761L18.441 18.563L21.214 17.727L20.892 14.886L22.5 12.536Z" fill="#0866FF"/><path fillRule="evenodd" clipRule="evenodd" d="M16.53 8.47a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.97 1.97 4.97-4.97a.75.75 0 0 1 1.06 0z" fill="white"/></svg>`;


files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    code = code.split(oldTooltipText).join(newTooltipText);
    code = code.split(verifiedBadgeSVGTarget).join(verifiedBadgeSVGReplacement);
    code = code.split(adminBadgeTarget).join(adminBadgeReplacement1);
    code = code.split(adminBadgeTarget2).join(adminBadgeReplacement2);
    
    // There's also the standalone Admin Badge in Community.tsx as a component
    const communityAdminBadge = `<svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] text-[#0866FF] shrink-0 inline-block align-middle ml-1 -mt-0.5"
    title="Admin"
  >
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" />
  </svg>`;
    const communityAdminBadgeReplacement = `<svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] shrink-0 inline-block align-middle ml-1 -mt-0.5"
    title="Admin"
  >
    <path d="M22.5 12.536V11.464L20.892 9.114L21.214 6.273L18.441 5.437L16.51 3.239L13.8 4.029L12 2.25L10.2 4.029L7.49 3.239L5.559 5.437L2.786 6.273L3.108 9.114L1.5 11.464V12.536L3.108 14.886L2.786 17.727L5.559 18.563L7.49 20.761L10.2 19.971L12 21.75L13.8 19.971L16.51 20.761L18.441 18.563L21.214 17.727L20.892 14.886L22.5 12.536Z" fill="#0866FF"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M16.53 8.47a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.97 1.97 4.97-4.97a.75.75 0 0 1 1.06 0z" fill="white"/>
  </svg>`;
    code = code.split(communityAdminBadge).join(communityAdminBadgeReplacement);

    fs.writeFileSync(file, code);
  }
});

console.log('Update completed');
