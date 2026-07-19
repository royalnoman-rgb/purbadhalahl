const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const shareData = {
      title: 'পূর্বধলা হেল্পলাইন',
      text: 'পূর্বধলা হেল্পলাইন - জরুরি প্রয়োজনে সকল নাম্বার এবং তথ্য এখন আপনার হাতের মুঠোয়!',
      url: window.location.origin
    };`;

const replacement = `    const shareUrl = contributorPhone ? \`\${window.location.origin}?ref=\${contributorPhone}\` : window.location.origin;
    const shareData = {
      title: 'পূর্বধলা হেল্পলাইন',
      text: 'পূর্বধলা হেল্পলাইন - জরুরি প্রয়োজনে সকল নাম্বার এবং তথ্য এখন আপনার হাতের মুঠোয়!',
      url: shareUrl
    };`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Updated share app url');
}
