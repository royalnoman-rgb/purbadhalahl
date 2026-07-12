const fs = require('fs');

const categories = [
  { id: 'emergency', title: 'জরুরি সেবা', englishTitle: 'Emergency Services', iconName: 'Flame', color: 'bg-rose-600 text-rose-50' },
  { id: 'healthcare', title: 'স্বাস্থ্যসেবা', englishTitle: 'Healthcare', iconName: 'Stethoscope', color: 'bg-cyan-600 text-cyan-50' },
  { id: 'blood_donors', title: 'রক্তদাতা ও ব্লাড ব্যাংক', englishTitle: 'Blood Donors', iconName: 'Droplets', color: 'bg-red-500 text-red-50' },
  { id: 'administration', title: 'প্রশাসন ও সরকারি অফিস', englishTitle: 'Administration', iconName: 'Building2', color: 'bg-indigo-600 text-indigo-50' },
  { id: 'representatives', title: 'জনপ্রতিনিধি', englishTitle: 'Public Representatives', iconName: 'Users', color: 'bg-teal-600 text-teal-50' },
  { id: 'education', title: 'শিক্ষাপ্রতিষ্ঠান ও শিক্ষক', englishTitle: 'Education', iconName: 'GraduationCap', color: 'bg-blue-600 text-blue-50' },
  { id: 'transport', title: 'যাতায়াত ও পরিবহন', englishTitle: 'Transport', iconName: 'Bus', color: 'bg-orange-500 text-orange-50' },
  { id: 'daily_services', title: 'পেশাজীবী ও কারিগর', englishTitle: 'Daily Services', iconName: 'Wrench', color: 'bg-lime-600 text-lime-50' },
  { id: 'business', title: 'ব্যবসা ও কেনাকাটা', englishTitle: 'Business & Shops', iconName: 'Store', color: 'bg-purple-600 text-purple-50' },
  { id: 'finance', title: 'আর্থিক প্রতিষ্ঠান', englishTitle: 'Bank & Finance', iconName: 'Landmark', color: 'bg-emerald-600 text-emerald-50' },
  { id: 'miscellaneous', title: 'অন্যান্য / বিবিধ', englishTitle: 'Miscellaneous', iconName: 'MoreHorizontal', color: 'bg-gray-600 text-gray-50' },
];

const contacts = [
  // 1. জরুরি সেবা
  { id: 'e1', name: 'পূর্বধলা ফায়ার স্টেশন', phone: '01XXXXXXXXX', categoryId: 'emergency', subCategory: 'ফায়ার সার্ভিস' },
  { id: 'e2', name: 'অফিসার ইনচার্জ (OC), পূর্বধলা থানা', phone: '01320-XXXXXX', categoryId: 'emergency', subCategory: 'থানা / পুলিশ কন্ট্রোল রুম' },
  { id: 'e3', name: 'পূর্বধলা থানা ডিউটি অফিসার', phone: '01XXXXXXXXX', categoryId: 'emergency', subCategory: 'থানা / পুলিশ কন্ট্রোল রুম' },
  { id: 'e4', name: 'অ্যাম্বুলেন্স সার্ভিস (সরকারি)', phone: '01XXXXXXXXX', categoryId: 'emergency', subCategory: 'অ্যাম্বুলেন্স সার্ভিস' },
  { id: 'e5', name: 'পূর্বধলা জোনাল অফিস (অভিযোগ কেন্দ্র)', phone: '01XXXXXXXXX', categoryId: 'emergency', subCategory: 'পল্লী বিদ্যুৎ / পিডিবি' },
  
  // 2. স্বাস্থ্যসেবা
  { id: 'h1', name: 'উপজেলা স্বাস্থ্য কমপ্লেক্স, পূর্বধলা', phone: '01XXXXXXXXX', categoryId: 'healthcare', subCategory: 'উপজেলা স্বাস্থ্য কমপ্লেক্স' },
  
  // 3. রক্তদাতা
  { id: 'b1', name: 'পূর্বধলা ব্লাড ডোনার সোসাইটি', phone: '01XXXXXXXXX', categoryId: 'blood_donors', subCategory: 'স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন' },

  // 4. প্রশাসন
  { id: 'a1', name: 'ইউএনও (UNO) অফিস', phone: '01XXXXXXXXX', categoryId: 'administration', subCategory: 'ইউএনও (UNO) অফিস' },

  // 5. জনপ্রতিনিধি
  { id: 'r1', name: '১নং হোগলা ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: সিরাজুল ইসলাম', phone: '01700-000001', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },
  { id: 'r2', name: '২নং ঘাগড়া ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: রেজুওয়ান করিম', phone: '01700-000002', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },
  { id: 'r3', name: '৩নং জারিয়া ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: আমিনুল ইসলাম', phone: '01700-000003', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },
  { id: 'r4', name: '৪নং ধলামূলগাঁও ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: ওমর ফারুক', phone: '01700-000004', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },
  { id: 'r5', name: '৫নং পূর্বধলা সদর ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: জহিরের ইসলাম', phone: '01700-000005', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },
  { id: 'r6', name: '৬নং আগিয়া ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: সানোয়ার হোসেন', phone: '01700-000006', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },
  { id: 'r7', name: '৭নং বিশকাকুনী ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: আমজাদ হোসেন', phone: '01700-000007', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },
  { id: 'r8', name: '৮নং খলিশাউড় ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: কামরুজ্জামান', phone: '01700-000008', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },
  { id: 'r9', name: '৯নং নারান্দিয়া ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: আব্দুল কুদ্দুস', phone: '01700-000009', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },
  { id: 'r10', name: '১০নং গোহালাকান্দা ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: আনোয়ার হোসেন', phone: '01700-000010', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },
  { id: 'r11', name: '১১নং বৈরাটি ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: শফিকুল ইসলাম', phone: '01700-000011', categoryId: 'representatives', subCategory: 'ইউনিয়ন পরিষদ' },

  // 6. শিক্ষাপ্রতিষ্ঠান
  { id: 'ed1', name: 'পূর্বধলা জে. এম. পাইলট উচ্চ বিদ্যালয়', details: 'প্রধান শিক্ষক', phone: '01700-444441', categoryId: 'education', subCategory: 'স্কুল, কলেজ ও মাদ্রাসা' },
  { id: 'ed2', name: 'পূর্বধলা সরকারি কলেজ', details: 'অধ্যক্ষের কার্যালয়', phone: '01700-444442', categoryId: 'education', subCategory: 'স্কুল, কলেজ ও মাদ্রাসা' },
  { id: 'ed3', name: 'কম্পিউটার ট্রেনিং সেন্টার', details: 'স্কিল ডেভেলপমেন্ট আইটি', phone: '01700-444443', categoryId: 'education', subCategory: 'প্রাইভেট টিউটর ও কোচিং সেন্টার' },

  // 7. যাতায়াত
  // ... (none pre-existing mapped here, we can add a dummy)
  { id: 't1', name: 'পূর্বধলা বাসস্ট্যান্ড', phone: '01XXXXXXXXX', categoryId: 'transport', subCategory: 'বাস কাউন্টার' },

  // 8. পেশাজীবী (formerly journalists)
  { id: 'fn4', name: 'মোহাম্মদ গোলাম মোস্তফা', details: 'দৈনিক কালেরকন্ঠ', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01711511299', categoryId: 'daily_services' },
  { id: 'fn5', name: 'সৈয়দ আরিফুজ্জামান', details: 'প্রকাশক-সম্পাদক, আজকের আরবান', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01711709572', categoryId: 'daily_services' },
  { id: 'fn6', name: 'মো. জুলফিকার আলী শাহীন', details: 'বিশেষ প্রতিনিধি, আজকের আরবান', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01717143759', categoryId: 'daily_services' },
  { id: 'fn7', name: 'ইসমাইল হোসেন খোকন', details: 'দৈনিক নয়াদিগন্ত', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01913258097', categoryId: 'daily_services' },
  { id: 'fn8', name: 'শফিকুল আলম শাহীন', details: 'দৈনিক আমার দেশ', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01711796839', categoryId: 'daily_services' },
  { id: 'fn9', name: 'মো. জায়েজুল ইসলাম', details: 'দৈনিক বাংলাদেশ বুলেটিন', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01713549401', categoryId: 'daily_services' },
  { id: 'fn10', name: 'মো. নোমান শাহরিয়ার', details: 'পূর্বধলার দর্পণ', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01911397107', categoryId: 'daily_services' },
  { id: 'fn11', name: 'তিলক রায় টুলু', details: 'দৈনিক ভোরের কাগজ', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01711045893', categoryId: 'daily_services' },
  { id: 'fn12', name: 'মো. নূর উদ্দিন মন্ডল দুলাল', details: 'দৈনিক বাংলার দর্পণ', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01711001719', categoryId: 'daily_services' },
  { id: 'fn13', name: 'মোহাম্মদ এমদাদুল ইসলাম', details: 'দৈনিক সংবাদ', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01711176181', categoryId: 'daily_services' },
  { id: 'fn14', name: 'মো. হাবিবুর রহমান', details: 'দৈনিক কালবেলা', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01917213290', categoryId: 'daily_services' },
  { id: 'fn15', name: 'নাহিদ আলম', details: 'স্টাফ রিপোর্টার, আজকের আরবান', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01911172248', categoryId: 'daily_services' },
  { id: 'fn16', name: 'সাদ্দাম হোসেন', details: 'দৈনিক বাংলাদেশ বুলেটিন', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01914037608', categoryId: 'daily_services' },
  { id: 'fn17', name: 'তৌহিদুল কবির খান রাসেল', details: 'দৈনিক যুগান্তর / আর টিভি', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01912181925', categoryId: 'daily_services' },
  { id: 'fn18', name: 'মো. শাখাওয়াত হোসেন শিমুল', details: 'দৈনিক আজকের বাংলাদেশ', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01713912615', categoryId: 'daily_services' },
  { id: 'fn19', name: 'মো. আল মুনসুর', details: 'দৈনিক প্রতিদিনের সংবাদ', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01918510613', categoryId: 'daily_services' },
  { id: 'fn20', name: 'মোহাম্মদ জুবায়েদ হোসেন বাচ্চু', details: 'দৈনিক মানব জমিন', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01772928790', categoryId: 'daily_services' },
  { id: 'fn21', name: 'মো. শফিকুল ইসলাম খান', details: 'দৈনিক ভোরের ডাক', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01911696226', categoryId: 'daily_services' },
  { id: 'fn22', name: 'মো. মিঠু সরকার', details: 'সোনালী নিউজ', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01795397054', categoryId: 'daily_services' },
  { id: 'fn23', name: 'মোস্তাক আহমেদ খান', details: 'দৈনিক আজকালের খবর', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01925584484', categoryId: 'daily_services' },
  { id: 'fn24', name: 'এস এম ওয়াদুদ', details: 'এন টিভি অনলাইন', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01713503527', categoryId: 'daily_services' },
  { id: 'fn25', name: 'আব্দুল্লাহ সাকিব', details: 'দৈনিক মানবকন্ঠ', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01983317513', categoryId: 'daily_services' },
  { id: 'fn26', name: 'মো. মোরসালিন আহমেদ (মোসা)', details: 'দৈনিক আমাদের সময়', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01708561341', categoryId: 'daily_services' },
  { id: 'fn27', name: 'সুহাদা মেহজাবিন', details: 'বার্তা সম্পাদক, আজকের আরবান', subCategory: 'আইনজীবী ও সাংবাদিক', phone: '01312709572', categoryId: 'daily_services' },

  // 9. ব্যবসা ও কেনাকাটা
  { id: 'bs1', name: 'ভাই ভাই রেস্টুরেন্ট ও মিষ্টি ঘর', details: 'হোম ডেলিভারি ব্যবস্থা আছে', phone: '01700-555551', categoryId: 'business', subCategory: 'রেস্টুরেন্ট ও খাবার সরবরাহ' },
  { id: 'bs2', name: 'রাসেল হার্ডওয়্যার', details: 'বাড়ি তৈরির জিনিসপত্র', phone: '01700-555552', categoryId: 'business', subCategory: 'হার্ডওয়ার ও ডেকোরেটর' },
  { id: 'bs3', name: 'সোহাগ ডেকোরেটর ও সাউন্ড সিস্টেম', details: 'যেকোনো অনুষ্ঠানের জন্য', phone: '01700-555553', categoryId: 'business', subCategory: 'হার্ডওয়ার ও ডেকোরেটর' },

  // 10. আর্থিক প্রতিষ্ঠান
  { id: 'fn1', name: 'সোনালী ব্যাংক পিএলসি', details: 'পূর্বধলা শাখা', phone: '01700-666661', categoryId: 'finance', subCategory: 'সরকারি ও বেসরকারি ব্যাংক' },

  // 11. বিবিধ
  { id: 'fn2', name: 'পূর্বধলা প্রেস ক্লাব', details: 'সাধারণ সম্পাদক', phone: '01700-666662', categoryId: 'miscellaneous', subCategory: 'স্থানীয় স্বেচ্ছাসেবী সংগঠন' },
  { id: 'fn3', name: 'সুন্দরবন কুরিয়ার সার্ভিস', details: 'পূর্বধলা এজেন্সি', phone: '01700-666663', categoryId: 'miscellaneous', subCategory: 'অন্যান্য' },

];

const code = `import { Category, Contact } from './types';

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export const contacts: Contact[] = ${JSON.stringify(contacts, null, 2)};
`;

fs.writeFileSync('src/data.ts', code);
