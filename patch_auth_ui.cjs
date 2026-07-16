const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Change header title logic
content = content.replace(
  `{isLoginMode ? 'লগইন' : 'আমার প্রোফাইল'}`,
  `{isLoginMode ? 'লগইন' : !contributorName ? 'একাউন্ট তৈরি করুন' : 'আমার প্রোফাইল'}`
);

// 2. Add visual banner to the registration form
content = content.replace(
  `<p className="text-sm text-gray-600 mb-4">
                    এখানে আপনার তথ্য সেভ করে রাখলে, পরবর্তীতে নতুন কোনো নাম্বার যুক্ত করলে বারবার আপনার নাম ও নাম্বার দিতে হবে না। আপনার যুক্ত করা নাম্বার অ্যাপ্রুভ হলে আপনার অবদান পয়েন্ট বৃদ্ধি পাবে।
                  </p>`,
  `{!contributorName ? (
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">স্বাগতম!</h2>
                      <p className="text-gray-500 text-sm">পূর্বধলা হেল্পলাইনে যুক্ত হতে একাউন্ট তৈরি করুন</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-4">
                      এখানে আপনার তথ্য আপডেট করতে পারবেন। আপনার যুক্ত করা নাম্বার অ্যাপ্রুভ হলে আপনার পয়েন্ট বৃদ্ধি পাবে।
                    </p>
                  )}`
);

// 3. Make the submit button say "একাউন্ট তৈরি করুন" instead of "প্রোফাইল সেভ করুন" for new users
content = content.replace(
  `                      type="submit"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-medium flex justify-center items-center transition-colors"
                    >
                      প্রোফাইল সেভ করুন
                    </button>`,
  `                      type="submit"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-medium flex justify-center items-center transition-colors shadow-md hover:shadow-lg"
                    >
                      {!contributorName ? 'একাউন্ট তৈরি করুন' : 'প্রোফাইল সেভ করুন'}
                    </button>`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched auth ui");
