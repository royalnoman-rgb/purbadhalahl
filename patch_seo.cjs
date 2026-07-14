const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const additionalMeta = `
    <meta name="keywords" content="পূর্বধলা, স্মার্ট হেল্পলাইন, Purbadhala, Smart Helpline, Emergency, Hospital, Police, Fire Service, Netrokona, Purbadhala Upazila" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://purbadhala-smart-helpline.web.app/logo.png" />
    <meta property="og:url" content="https://purbadhala-smart-helpline.web.app" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Purbadhala Smart Helpline - পূর্বধলা স্মার্ট হেল্পলাইন" />
    <meta name="twitter:description" content="পূর্বধলা উপজেলার সকল প্রয়োজনীয় ও গুরুত্বপূর্ণ ফোন নম্বর, ঠিকানা এবং অন্যান্য তথ্য পাওয়ার একটি বিশ্বস্ত মাধ্যম।" />
    <meta name="twitter:image" content="https://purbadhala-smart-helpline.web.app/logo.png" />
`;

content = content.replace('</head>', additionalMeta + '</head>');

fs.writeFileSync('index.html', content);
console.log("SEO tags added");
