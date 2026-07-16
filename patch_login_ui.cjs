const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  `<p className="text-sm text-gray-600 mb-4">
                    আপনার মোবাইল নাম্বার বা ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন। আপনি যদি আগে থেকে একাউন্ট করে থাকেন কিন্তু পাসওয়ার্ড সেট না করে থাকেন, তবে শুধু নাম্বার দিয়ে লগইন করে ড্যাশবোর্ড থেকে পাসওয়ার্ড সেট করুন।
                  </p>`,
  `<div className="text-center mb-6">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">ফিরে আসার জন্য ধন্যবাদ!</h2>
                    <p className="text-gray-500 text-sm mb-4">আপনার মোবাইল নাম্বার বা ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন।</p>
                    <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                      আপনি যদি আগে থেকে একাউন্ট করে থাকেন কিন্তু পাসওয়ার্ড সেট না করে থাকেন, তবে শুধু নাম্বার দিয়ে লগইন করে ড্যাশবোর্ড থেকে পাসওয়ার্ড সেট করুন।
                    </p>
                  </div>`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched login ui");
