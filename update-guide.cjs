const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `              <div>
                <h3 className="font-semibold text-lg text-emerald-700 mb-2">কীভাবে নতুন নাম্বার যুক্ত করবেন?</h3>
                <ul className="list-disc ml-5 space-y-1 text-slate-600 text-sm">
                  <li>হোম পেজে নিচে ডানদিকের <strong>"প্লাস (+)"</strong> আইকনে ক্লিক করুন।</li>
                  <li>সঠিক ক্যাটাগরি ও সাব-ক্যাটাগরি নির্বাচন করুন।</li>
                  <li>নাম, মোবাইল নাম্বার এবং অন্যান্য তথ্য সঠিকভাবে পূরণ করে <strong>"রিকোয়েস্ট পাঠান"</strong> বাটনে ক্লিক করুন।</li>
                </ul>
              </div>`;

const replacement = `              <div>
                <h3 className="font-semibold text-lg text-emerald-700 mb-2">কীভাবে নতুন নাম্বার যুক্ত করবেন?</h3>
                <ul className="list-disc ml-5 space-y-1 text-slate-600 text-sm">
                  <li>হোম পেজে নিচে ডানদিকের <strong>"প্লাস (+)"</strong> আইকনে ক্লিক করুন।</li>
                  <li>সঠিক ক্যাটাগরি ও সাব-ক্যাটাগরি নির্বাচন করুন।</li>
                  <li>নাম, মোবাইল নাম্বার এবং অন্যান্য তথ্য সঠিকভাবে পূরণ করে <strong>"রিকোয়েস্ট পাঠান"</strong> বাটনে ক্লিক করুন।</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-emerald-700 mb-2">পয়েন্ট ও ইনভাইট সিস্টেম (Invite & Earn)</h3>
                <ul className="list-disc ml-5 space-y-1 text-slate-600 text-sm">
                  <li>আপনার প্রোফাইল থেকে বা উপরের শেয়ার আইকনে ক্লিক করে বন্ধুদের অ্যাপটি শেয়ার করতে পারবেন।</li>
                  <li>আপনার লিংক দিয়ে কেউ নতুন একাউন্ট খুললে আপনি সাথে সাথে <strong>১০ পয়েন্ট</strong> বোনাস পাবেন।</li>
                  <li>এছাড়াও সঠিক নাম্বার বা তথ্য যুক্ত করলেও পয়েন্ট বৃদ্ধি পাবে, যা আপনাকে "শীর্ষ অবদানকারী" (Leaderboard) হতে সাহায্য করবে।</li>
                </ul>
              </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Guide modal updated');
} else {
  console.log('Target not found in Guide modal');
}
