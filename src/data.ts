import { Category, Contact } from './types';

export const categories: Category[] = [
  { 
    id: 'police', 
    title: 'পুলিশ ও থানা', 
    englishTitle: 'Police', 
    iconName: 'Shield', 
    color: 'bg-blue-500 text-blue-50' 
  },
  { 
    id: 'fire_service', 
    title: 'ফায়ার সার্ভিস', 
    englishTitle: 'Fire Service', 
    iconName: 'Flame', 
    color: 'bg-rose-600 text-rose-50' 
  },
  { 
    id: 'hospital', 
    title: 'হাসপাতাল ও অ্যাম্বুলেন্স', 
    englishTitle: 'Hospital & Ambulance', 
    iconName: 'Ambulance', 
    color: 'bg-emerald-500 text-emerald-50' 
  },
  { 
    id: 'electricity', 
    title: 'পল্লী বিদ্যুৎ', 
    englishTitle: 'Electricity', 
    iconName: 'Zap', 
    color: 'bg-amber-500 text-amber-50' 
  },
  { 
    id: 'blood_bank', 
    title: 'ব্লাড ব্যাংক', 
    englishTitle: 'Blood Bank', 
    iconName: 'Droplets', 
    color: 'bg-red-500 text-red-50' 
  },
  { 
    id: 'representatives', 
    title: 'জনপ্রতিনিধি', 
    englishTitle: 'Representatives', 
    iconName: 'Users', 
    color: 'bg-indigo-500 text-indigo-50' 
  },
  { 
    id: 'upazila_parishad', 
    title: 'উপজেলা পরিষদ', 
    englishTitle: 'Upazila Parishad', 
    iconName: 'Building2', 
    color: 'bg-teal-600 text-teal-50' 
  },
  {
    id: 'transportation',
    title: 'যাতায়াত ও ট্রান্সপোর্ট',
    englishTitle: 'Transportation',
    iconName: 'Bus',
    color: 'bg-orange-500 text-orange-50'
  },
  {
    id: 'healthcare',
    title: 'স্বাস্থ্যসেবা',
    englishTitle: 'Healthcare',
    iconName: 'Stethoscope',
    color: 'bg-cyan-600 text-cyan-50'
  },
  {
    id: 'home_services',
    title: 'দৈনন্দিন সেবা',
    englishTitle: 'Home Services',
    iconName: 'Wrench',
    color: 'bg-lime-600 text-lime-50'
  },
  {
    id: 'education',
    title: 'শিক্ষা ও ক্যারিয়ার',
    englishTitle: 'Education',
    iconName: 'GraduationCap',
    color: 'bg-blue-600 text-blue-50'
  },
  {
    id: 'business',
    title: 'ব্যবসা ও কেনাকাটা',
    englishTitle: 'Business',
    iconName: 'Store',
    color: 'bg-purple-600 text-purple-50'
  },
  {
    id: 'financial',
    title: 'আর্থিক ও অন্যান্য',
    englishTitle: 'Financial & Others',
    iconName: 'Landmark',
    color: 'bg-yellow-600 text-yellow-50'
  },
  {
    id: 'journalists',
    title: 'সাংবাদিক ও সামাজিক সংগঠন',
    englishTitle: 'Journalists & Social Organizations',
    iconName: 'Newspaper',
    color: 'bg-indigo-600 text-indigo-50'
  }
];

export const contacts: Contact[] = [
  { id: 'p1', name: 'অফিসার ইনচার্জ (OC), পূর্বধলা থানা', phone: '01320-XXXXXX', categoryId: 'police' },
  { id: 'p2', name: 'পূর্বধলা থানা ডিউটি অফিসার', phone: '01XXXXXXXXX', categoryId: 'police' },
  { id: 'f1', name: 'পূর্বধলা ফায়ার স্টেশন', phone: '01XXXXXXXXX', categoryId: 'fire_service' },
  { id: 'h1', name: 'উপজেলা স্বাস্থ্য কমপ্লেক্স, পূর্বধলা', phone: '01XXXXXXXXX', categoryId: 'hospital' },
  { id: 'h2', name: 'অ্যাম্বুলেন্স সার্ভিস (সরকারি)', phone: '01XXXXXXXXX', categoryId: 'hospital' },
  { id: 'e1', name: 'পূর্বধলা জোনাল অফিস', phone: '01XXXXXXXXX', categoryId: 'electricity', details: 'অভিযোগ কেন্দ্র' },
  { id: 'b1', name: 'পূর্বধলা ব্লাড ডোনার সোসাইটি', phone: '01XXXXXXXXX', categoryId: 'blood_bank' },
  
  // জনপ্রতিনিধি (১১ টি ইউনিয়ন)
  { id: 'r1', name: '১নং হোগলা ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: সিরাজুল ইসলাম', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব মো: আব্দুল মতিন', phone: '01700-000001', categoryId: 'representatives' },
  { id: 'r2', name: '২নং ঘাগড়া ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: রেজুওয়ান করিম', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব রফিকুল ইসলাম', phone: '01700-000002', categoryId: 'representatives' },
  { id: 'r3', name: '৩নং জারিয়া ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: আমিনুল ইসলাম', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব শফিকুল ইসলাম', phone: '01700-000003', categoryId: 'representatives' },
  { id: 'r4', name: '৪নং ধলামূলগাঁও ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: ওমর ফারুক', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব আব্দুল কাদির', phone: '01700-000004', categoryId: 'representatives' },
  { id: 'r5', name: '৫নং পূর্বধলা সদর ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: জহিরের ইসলাম', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব মো: আতিকুর রহমান', phone: '01700-000005', categoryId: 'representatives' },
  { id: 'r6', name: '৬নং আগিয়া ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: সানোয়ার হোসেন', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব কামরুল হাসান', phone: '01700-000006', categoryId: 'representatives' },
  { id: 'r7', name: '৭নং বিশকাকুনী ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: আমজাদ হোসেন', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব সাইফুর রহমান', phone: '01700-000007', categoryId: 'representatives' },
  { id: 'r8', name: '৮নং খলিশাউড় ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: আসাদুজ্জামান', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব মো: ইব্রাহিম', phone: '01700-000008', categoryId: 'representatives' },
  { id: 'r9', name: '৯নং নারান্দিয়া ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: আনোয়ার হোসেন', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব রিয়াজ উদ্দিন', phone: '01700-000009', categoryId: 'representatives' },
  { id: 'r10', name: '১০নং গোহালাকান্দা ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: হাসনাত হোসেন', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব মো: আবুল কালাম', phone: '01700-000010', categoryId: 'representatives' },
  { id: 'r11', name: '১১নং বৈরাটি ইউনিয়ন পরিষদ', details: 'চেয়ারম্যান: জনাব মো: আনিসুর রহমান', subDetails: 'প্রশাসনিক কর্মকর্তা: জনাব মজিবুর রহমান', phone: '01700-000011', categoryId: 'representatives' },

  // উপজেলা পরিষদ (Upazila Parishad)
  { id: 'u1', name: 'উপজেলা নির্বাহী অফিসার (UNO)', details: 'জনাব মো: খোরশেদ আলম', subDetails: 'ইউএনও অফিস, পূর্বধলা', phone: '01700-000012', categoryId: 'upazila_parishad' },
  { id: 'u2', name: 'উপজেলা খাদ্য নিয়ন্ত্রক', details: 'জনাব মো: আব্দুল হান্নান', subDetails: 'উপজেলা খাদ্য অফিস', phone: '01700-000013', categoryId: 'upazila_parishad' },
  { id: 'u3', name: 'উপজেলা নির্বাচন অফিসার', details: 'জনাব মো: শফিকুল ইসলাম', subDetails: 'উপজেলা নির্বাচন অফিস', phone: '01700-000014', categoryId: 'upazila_parishad' },
  { id: 'u4', name: 'উপজেলা কৃষি অফিসার', details: 'জনাব মো: রফিকুল আনোয়ার', subDetails: 'উপজেলা কৃষি সম্প্রসারণ অফিস', phone: '01700-000015', categoryId: 'upazila_parishad' },
  { id: 'u5', name: 'উপজেলা স্বাস্থ্য ও পরিবার পরিকল্পনা কর্মকর্তা', details: 'ডা. বেগম ফরিদা পারভীন', subDetails: 'উপজেলা স্বাস্থ্য কমপ্লেক্স', phone: '01700-000016', categoryId: 'upazila_parishad' },
  { id: 'u6', name: 'উপজেলা শিক্ষা অফিসার', details: 'জনাব মো: কামরুল হাসান', subDetails: 'উপজেলা প্রাথমিক শিক্ষা অফিস', phone: '01700-000017', categoryId: 'upazila_parishad' },

  // যাতায়াত ও ট্রান্সপোর্ট (Transportation)
  { id: 't1', name: 'জারিয়া লোকাল ট্রেন স্টেশন மாস্টার', details: 'জারিয়া - ঢাকা রুট', subDetails: 'ট্রেনের সময়সূচি ও তথ্য', phone: '01700-111111', categoryId: 'transportation' },
  { id: 't2', name: 'পূর্বধলা বাস কাউন্টার', details: 'ঢাকা, ময়মনসিংহ রুট', subDetails: 'বাসের টিকিট ও সময়সূচি', phone: '01700-111112', categoryId: 'transportation' },
  { id: 't3', name: 'ভাড়ায় চালিত মাইক্রোবাস', details: 'মো: আব্দুল মতিন', subDetails: 'পূর্বধলা বাজার', phone: '01700-111113', categoryId: 'transportation' },
  
  // স্বাস্থ্যসেবা (Healthcare)
  { id: 'hc1', name: 'ডা. মো: শফিকুল ইসলাম', details: 'মেডিসিন বিশেষজ্ঞ', subDetails: 'চেম্বার: পূর্বধলা ডায়াগনস্টিক সেন্টার', phone: '01700-222221', categoryId: 'healthcare' },
  { id: 'hc2', name: 'মা ও শিশু ডায়াগনস্টিক সেন্টার', details: 'সকল ধরনের টেস্ট করা হয়', subDetails: 'পূর্বধলা বাজার', phone: '01700-222222', categoryId: 'healthcare' },
  { id: 'hc3', name: '২৪ ঘন্টা খোলা ফার্মেসি', details: 'মেসার্স ভাই ভাই ফার্মেসি', subDetails: 'হাসপাতাল রোড, পূর্বধলা', phone: '01700-222223', categoryId: 'healthcare' },
  { id: 'hc4', name: 'উপজেলা প্রাণিসম্পদ কর্মকর্তা', details: 'ডা. আব্দুল লতিফ', subDetails: 'পশু চিকিৎসা', phone: '01700-222224', categoryId: 'healthcare' },
  { id: 'hc5', name: 'ডাঃ মো. হাবিবুর রহমান', details: 'নাক, কান ও গলারোগ বিশেষজ্ঞ', subDetails: 'চেম্বার: লিটন ডায়াগনস্টিক সেন্টার', phone: '01818823939', categoryId: 'healthcare' },
  { id: 'hc6', name: 'ডাঃ বিশ্ব প্রিয় মজুমদার', details: 'মেডিসিন, গর্ভবতী মা ও শিশু, নাক-কান-গলা, চর্ম ও যৌন', subDetails: 'চেম্বার: লিটন ডায়াগনস্টিক সেন্টার', phone: '01982333401', categoryId: 'healthcare' },
  { id: 'hc7', name: 'ডাঃ আজহারুল ইসলাম', details: 'মেডিসিন, চর্ম, নাক-কান-গলা, মা ও শিশু', subDetails: 'চেম্বার: সেবা ডায়াগনস্টিক সেন্টার', phone: '01620110728', categoryId: 'healthcare' },
  { id: 'hc8', name: 'ডাঃ কনক প্রভা নন্দী', details: 'গাইনী, মেডিসিন, প্রসূতী, চর্ম, মা ও শিশু', subDetails: 'চেম্বার: হযরত শাহ্জালাল ডায়াগনোস্টিক সেন্টার', phone: '01983843172', categoryId: 'healthcare' },
  { id: 'hc8_2', name: 'ডাঃ কনক প্রভা নন্দী', details: 'গাইনী, মেডিসিন, প্রসূতী, চর্ম, মা ও শিশু', subDetails: 'চেম্বার: হযরত শাহ্জালাল ডায়াগনোস্টিক সেন্টার', phone: '01730324547', categoryId: 'healthcare' },
  { id: 'hc9', name: 'ডাঃ সাদিয়া রহমান', details: 'সার্জারী, গাইনী, মেডিসিন, মা ও শিশু', subDetails: 'চেম্বার: লিটন ডায়াগনস্টিক সেন্টার', phone: '01863442401', categoryId: 'healthcare' },
  { id: 'hc10', name: 'ডাঃ মো. মিজানুর রহমান', details: 'মেডিসিন, চর্ম, যৌন, নাক-কান ও গলা, মা এবং শিশু', subDetails: 'চেম্বার: নিরাময় ডায়াগনোস্টিক সেন্টার', phone: '01738295472', categoryId: 'healthcare' },
  { id: 'hc11', name: 'ডাঃ মো. আল রাজী (মুন)', details: 'মেডিসিন, অর্থো সার্জারী, হাড় জোড়া ও মেরুদণ্ড', subDetails: 'চেম্বার: নিরাময় ডায়াগনোস্টিক সেন্টার', phone: '01910429983', categoryId: 'healthcare' },
  { id: 'hc12', name: 'ডাঃ আব্দুল্লাহ-আল-মনসুর', details: 'মেডিসিন, ডায়াবেটিস, মা, শিশু ও মনোরোগ', subDetails: 'চেম্বার: ফাতেমা ডায়াগনোস্টিক সেন্টার', phone: '01772754545', categoryId: 'healthcare' },
  { id: 'hc13', name: 'ডাঃ মো. আব্দুল মোতালেব', details: 'হৃদরোগ, মেডিসিন ও বাতজ্বর', subDetails: 'চেম্বার: আল-বারাকা ডায়াগনোস্টিক সেন্টার', phone: '01911194372', categoryId: 'healthcare' },
  { id: 'hc14', name: 'ডাঃ মোস্তফা জামান (অনিক)', details: 'ডায়াবেটিস, মা ও শিশু, গাইনী, চর্ম-যৌন', subDetails: 'চেম্বার: আল-মদিনা ডায়াগনোস্টিক সেন্টার', phone: '01689208057', categoryId: 'healthcare' },
  { id: 'hc15', name: 'ডাঃ খোকন চৌধুরী', details: 'নবজাতক ও শিশু, মেডিসিন, ডায়াবেটিস, চর্ম, যৌন', subDetails: 'চেম্বার: আল-বারাকা ডায়াগনোস্টিক সেন্টার', phone: '01916705828', categoryId: 'healthcare' },
  { id: 'hc16', name: 'ডা. মো. মোজাফ্ফর হোসেন (লিটন)', details: 'দন্ত চিকিৎসক', subDetails: 'চেম্বার: রাজধলা ডায়াগনস্টিক সেন্টার', phone: '01735729524', categoryId: 'healthcare' },
  { id: 'hc17', name: 'মো. নূর আলম হক উজ্জল', details: 'দন্ত চিকিৎসক', subDetails: 'চেম্বার: ডক্টরস ডেন্টাল কেয়ার', phone: '01918039047', categoryId: 'healthcare' },

  // দৈনন্দিন প্রয়োজনীয় সেবা (Home Services)
  { id: 'hs1', name: 'ইলেকট্রিশিয়ান মিস্ত্রি', details: 'মো: রতন মিয়া', subDetails: 'বাসাবাড়ির কারেন্টের কাজ', phone: '01700-333331', categoryId: 'home_services' },
  { id: 'hs2', name: 'এসি ও ফ্রিজ মেকানিক', details: 'মো: সোহেল, সোহেল এন্টারপ্রাইজ', subDetails: 'হোম সার্ভিস দেওয়া হয়', phone: '01700-333332', categoryId: 'home_services' },
  { id: 'hs3', name: 'গ্যাস সিলিন্ডার ডেলিভারি', details: 'রাব্বি ট্রেডার্স', subDetails: 'বাসায় গ্যাস পৌঁছে দেওয়া হয়', phone: '01700-333333', categoryId: 'home_services' },
  { id: 'hs4', name: 'ইন্টারনেট প্রোভাইডার', details: 'পূর্বধলা আইটি নেটওয়ার্ক', subDetails: 'ব্রডব্যান্ড ইন্টারনেট সার্ভিস', phone: '01700-333334', categoryId: 'home_services' },

  // শিক্ষা ও ক্যারিয়ার (Education)
  { id: 'ed1', name: 'পূর্বধলা জগৎমণি সরকারি পাইলট উচ্চ বিদ্যালয়', details: 'প্রধান শিক্ষক', subDetails: 'অফিস হেল্পলাইন', phone: '01700-444441', categoryId: 'education' },
  { id: 'ed2', name: 'পূর্বধলা সরকারি কলেজ', details: 'অধ্যক্ষের কার্যালয়', subDetails: 'কলেজ শাখা', phone: '01700-444442', categoryId: 'education' },
  { id: 'ed3', name: 'কম্পিউটার ট্রেনিং সেন্টার', details: 'স্কিল ডেভেলপমেন্ট আইটি', subDetails: 'পূর্বধলা মধ্য বাজার', phone: '01700-444443', categoryId: 'education' },

  // গুরুত্বপূর্ণ ব্যবসা ও কেনাকাটা (Business)
  { id: 'bs1', name: 'ভাই ভাই রেস্টুরেন্ট ও মিষ্টি ঘর', details: 'হোম ডেলিভারি ব্যবস্থা আছে', subDetails: 'পূর্বধলা বাজার', phone: '01700-555551', categoryId: 'business' },
  { id: 'bs2', name: 'রাসেল হার্ডওয়্যার', details: 'বাড়ি তৈরির জিনিসপত্র', subDetails: 'পূর্বধলা স্টেশন রোড', phone: '01700-555552', categoryId: 'business' },
  { id: 'bs3', name: 'সোহাগ ডেকোরেটর ও সাউন্ড সিস্টেম', details: 'যেকোনো অনুষ্ঠানের জন্য', subDetails: 'পূর্বধলা চৌরাস্তা', phone: '01700-555553', categoryId: 'business' },

  // আর্থিক ও অন্যান্য সেবা (Financial & Others)
  { id: 'fn1', name: 'সোনালী ব্যাংক পিএলসি', details: 'পূর্বধলা শাখা', subDetails: 'ব্রাঞ্চ ম্যানেজার', phone: '01700-666661', categoryId: 'financial' },
  { id: 'fn2', name: 'পূর্বধলা প্রেস ক্লাব', details: 'সাধারণ সম্পাদক', subDetails: 'যেকোনো খবর জানাতে', phone: '01700-666662', categoryId: 'financial' },
  { id: 'fn3', name: 'সুন্দরবন কুরিয়ার সার্ভিস', details: 'পূর্বধলা এজেন্সি', subDetails: 'পার্সেল আনা নেওয়া', phone: '01700-666663', categoryId: 'financial' },
  
  // সাংবাদিক ও সামাজিক সংগঠন (Journalists & Social Organizations)
  { id: 'fn4', name: 'মোহাম্মদ গোলাম মোস্তফা', details: 'দৈনিক কালেরকন্ঠ', subDetails: 'সাংবাদিক', phone: '01711511299', categoryId: 'journalists' },
  { id: 'fn5', name: 'সৈয়দ আরিফুজ্জামান', details: 'প্রকাশক-সম্পাদক, আজকের আরবান', subDetails: 'সাংবাদিক', phone: '01711709572', categoryId: 'journalists' },
  { id: 'fn6', name: 'মো. জুলফিকার আলী শাহীন', details: 'বিশেষ প্রতিনিধি, আজকের আরবান', subDetails: 'সাংবাদিক', phone: '01717143759', categoryId: 'journalists' },
  { id: 'fn7', name: 'ইসমাইল হোসেন খোকন', details: 'দৈনিক নয়াদিগন্ত', subDetails: 'সাংবাদিক', phone: '01913258097', categoryId: 'journalists' },
  { id: 'fn8', name: 'শফিকুল আলম শাহীন', details: 'দৈনিক আমার দেশ', subDetails: 'সাংবাদিক', phone: '01711796839', categoryId: 'journalists' },
  { id: 'fn9', name: 'মো. জায়েজুল ইসলাম', details: 'দৈনিক বাংলাদেশ বুলেটিন', subDetails: 'সাংবাদিক', phone: '01713549401', categoryId: 'journalists' },
  { id: 'fn10', name: 'মো. নোমান শাহরিয়ার', details: 'পূর্বধলার দর্পণ', subDetails: 'সাংবাদিক', phone: '01911397107', categoryId: 'journalists' },
  { id: 'fn11', name: 'তিলক রায় টুলু', details: 'দৈনিক ভোরের কাগজ', subDetails: 'সাংবাদিক', phone: '01711045893', categoryId: 'journalists' },
  { id: 'fn12', name: 'মো. নূর উদ্দিন মন্ডল দুলাল', details: 'দৈনিক বাংলার দর্পণ', subDetails: 'সাংবাদিক', phone: '01711001719', categoryId: 'journalists' },
  { id: 'fn13', name: 'মোহাম্মদ এমদাদুল ইসলাম', details: 'দৈনিক সংবাদ', subDetails: 'সাংবাদিক', phone: '01711176181', categoryId: 'journalists' },
  { id: 'fn14', name: 'মো. হাবিবুর রহমান', details: 'দৈনিক কালবেলা', subDetails: 'সাংবাদিক', phone: '01917213290', categoryId: 'journalists' },
  { id: 'fn15', name: 'নাহিদ আলম', details: 'স্টাফ রিপোর্টার, আজকের আরবান', subDetails: 'সাংবাদিক', phone: '01911172248', categoryId: 'journalists' },
  { id: 'fn16', name: 'সাদ্দাম হোসেন', details: 'দৈনিক বাংলাদেশ বুলেটিন', subDetails: 'সাংবাদিক', phone: '01914037608', categoryId: 'journalists' },
  { id: 'fn17', name: 'তৌহিদুল কবির খান রাসেল', details: 'দৈনিক যুগান্তর / আর টিভি', subDetails: 'সাংবাদিক', phone: '01912181925', categoryId: 'journalists' },
  { id: 'fn18', name: 'মো. শাখাওয়াত হোসেন শিমুল', details: 'দৈনিক আজকের বাংলাদেশ', subDetails: 'সাংবাদিক', phone: '01713912615', categoryId: 'journalists' },
  { id: 'fn19', name: 'মো. আল মুনসুর', details: 'দৈনিক প্রতিদিনের সংবাদ', subDetails: 'সাংবাদিক', phone: '01918510613', categoryId: 'journalists' },
  { id: 'fn20', name: 'মোহাম্মদ জুবায়েদ হোসেন বাচ্চু', details: 'দৈনিক মানব জমিন', subDetails: 'সাংবাদিক', phone: '01772928790', categoryId: 'journalists' },
  { id: 'fn21', name: 'মো. শফিকুল ইসলাম খান', details: 'দৈনিক ভোরের ডাক', subDetails: 'সাংবাদিক', phone: '01911696226', categoryId: 'journalists' },
  { id: 'fn22', name: 'মো. মিঠু সরকার', details: 'সোনালী নিউজ', subDetails: 'সাংবাদিক', phone: '01795397054', categoryId: 'journalists' },
  { id: 'fn23', name: 'মোস্তাক আহমেদ খান', details: 'দৈনিক আজকালের খবর', subDetails: 'সাংবাদিক', phone: '01925584484', categoryId: 'journalists' },
  { id: 'fn24', name: 'এস এম ওয়াদুদ', details: 'এন টিভি অনলাইন', subDetails: 'নেত্রকোণা সদর ও পূর্বধলা', phone: '01713503527', categoryId: 'journalists' },
  { id: 'fn25', name: 'আব্দুল্লাহ সাকিব', details: 'দৈনিক মানবকন্ঠ', subDetails: 'সাংবাদিক', phone: '01983317513', categoryId: 'journalists' },
  { id: 'fn26', name: 'মো. মোরসালিন আহমেদ (মোসা)', details: 'দৈনিক আমাদের সময়', subDetails: 'সাংবাদিক', phone: '01708561341', categoryId: 'journalists' },
  { id: 'fn27', name: 'সুহাদা মেহজাবিন', details: 'বার্তা সম্পাদক, আজকের আরবান', subDetails: 'সাংবাদিক', phone: '01312709572', categoryId: 'journalists' }
];
