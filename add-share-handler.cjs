const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('handleShareApp')) {
  code = code.replace(
    'const handleReviewComment = async (reviewId: string)',
    `const handleShareApp = async () => {
    const shareData = {
      title: 'পূর্বধলা হেল্পলাইন',
      text: 'পূর্বধলা হেল্পলাইন - জরুরি প্রয়োজনে সকল নাম্বার এবং তথ্য এখন আপনার হাতের মুঠোয়!',
      url: window.location.origin
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('লিংকটি কপি করা হয়েছে! এখন আপনি যেকোনো জায়গায় শেয়ার করতে পারবেন।');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleReviewComment = async (reviewId: string)`
  );
  fs.writeFileSync('src/App.tsx', code);
}
