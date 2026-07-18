import { Category, Contact } from './types';

export const categories: Category[] = [
  {
    "id": "emergency",
    "title": "জরুরি সেবা",
    "englishTitle": "Emergency Services",
    "iconName": "Flame",
    "color": "bg-rose-600 text-rose-50"
  },
  {
    "id": "healthcare",
    "title": "স্বাস্থ্যসেবা",
    "englishTitle": "Healthcare",
    "iconName": "Stethoscope",
    "color": "bg-cyan-600 text-cyan-50"
  },
  {
    "id": "blood_donors",
    "title": "রক্তদাতা ও ব্লাড ব্যাংক",
    "englishTitle": "Blood Donors",
    "iconName": "Droplets",
    "color": "bg-red-500 text-red-50"
  },
  {
    "id": "administration",
    "title": "প্রশাসন ও সরকারি অফিস",
    "englishTitle": "Administration",
    "iconName": "Building2",
    "color": "bg-indigo-600 text-indigo-50",
    "subCategoriesOrder": [
      "উপজেলা নির্বাহী অফিসারের কার্যালয় (UNO)",
      "সহকারী কমিশনার (ভূমি) এর কার্যালয়",
      "উপজেলা কৃষি অফিস",
      "উপজেলা প্রাণিসম্পদ অফিস",
      "উপজেলা মৎস্য অফিস",
      "উপজেলা শিক্ষা অফিস (প্রাথমিক)",
      "উপজেলা মাধ্যমিক শিক্ষা অফিস",
      "উপজেলা সমাজসেবা কার্যালয়",
      "উপজেলা প্রকৌশলীর কার্যালয় (LGED)",
      "উপজেলা জনস্বাস্থ্য প্রকৌশল অধিদপ্তর (DPHE)",
      "উপজেলা প্রকল্প বাস্তবায়ন কর্মকর্তার কার্যালয় (PIO)",
      "উপজেলা নির্বাচন অফিস",
      "উপজেলা সাব-রেজিস্ট্রার অফিস",
      "উপজেলা পরিবার পরিকল্পনা কার্যালয়",
      "উপজেলা খাদ্য নিয়ন্ত্রকের কার্যালয়",
      "উপজেলা হিসাবরক্ষণ অফিস",
      "উপজেলা মহিলা বিষয়ক কর্মকর্তার কার্যালয়",
      "উপজেলা যুব উন্নয়ন কর্মকর্তার কার্যালয়",
      "উপজেলা সমবায় কার্যালয়",
      "উপজেলা পল্লী উন্নয়ন অফিস (BRDB)",
      "উপজেলা আনসার ও ভিডিপি কার্যালয়",
      "উপজেলা পরিসংখ্যান অফিস",
      "উপজেলা বন বিভাগ",
      "উপজেলা ইসলামিক ফাউন্ডেশন",
      "অন্যান্য"
    ]
  },
  {
    "id": "representatives",
    "title": "জনপ্রতিনিধি",
    "englishTitle": "Public Representatives",
    "iconName": "Users",
    "color": "bg-teal-600 text-teal-50"
  },
  {
    "id": "education",
    "title": "শিক্ষাপ্রতিষ্ঠান ও শিক্ষক",
    "englishTitle": "Education",
    "iconName": "GraduationCap",
    "color": "bg-blue-600 text-blue-50"
  },
  {
    "id": "transport",
    "title": "যাতায়াত ও পরিবহন",
    "englishTitle": "Transport",
    "iconName": "Bus",
    "color": "bg-orange-500 text-orange-50"
  },
  {
    "id": "daily_services",
    "title": "পেশাজীবী ও কারিগর",
    "englishTitle": "Daily Services",
    "iconName": "Wrench",
    "color": "bg-lime-600 text-lime-50"
  },
  {
    "id": "business",
    "title": "ব্যবসা ও কেনাকাটা",
    "englishTitle": "Business & Shops",
    "iconName": "Store",
    "color": "bg-purple-600 text-purple-50"
  },
  {
    "id": "finance",
    "title": "আর্থিক প্রতিষ্ঠান",
    "englishTitle": "Bank & Finance",
    "iconName": "Landmark",
    "color": "bg-emerald-600 text-emerald-50"
  },
  {
    "id": "miscellaneous",
    "title": "অন্যান্য / বিবিধ",
    "englishTitle": "Miscellaneous",
    "iconName": "MoreHorizontal",
    "color": "bg-gray-600 text-gray-50"
  }
];

export const contacts: Contact[] = [
  {
    "id": "e1",
    "name": "পূর্বধলা ফায়ার স্টেশন",
    "phone": "01XXXXXXXXX",
    "categoryId": "emergency",
    "subCategory": "ফায়ার সার্ভিস"
  },
  {
    "id": "e2",
    "name": "অফিসার ইনচার্জ (OC), পূর্বধলা থানা",
    "phone": "01320-XXXXXX",
    "categoryId": "emergency",
    "subCategory": "থানা / পুলিশ কন্ট্রোল রুম"
  },
  {
    "id": "e3",
    "name": "পূর্বধলা থানা ডিউটি অফিসার",
    "phone": "01XXXXXXXXX",
    "categoryId": "emergency",
    "subCategory": "থানা / পুলিশ কন্ট্রোল রুম"
  },
  {
    "id": "e4",
    "name": "অ্যাম্বুলেন্স সার্ভিস (সরকারি)",
    "phone": "01XXXXXXXXX",
    "categoryId": "emergency",
    "subCategory": "অ্যাম্বুলেন্স সার্ভিস"
  },
  {
    "id": "e5",
    "name": "পূর্বধলা জোনাল অফিস (অভিযোগ কেন্দ্র)",
    "phone": "01XXXXXXXXX",
    "categoryId": "emergency",
    "subCategory": "পল্লী বিদ্যুৎ / পিডিবি"
  },
  {
    "id": "h1",
    "name": "উপজেলা স্বাস্থ্য কমপ্লেক্স, পূর্বধলা",
    "phone": "01XXXXXXXXX",
    "categoryId": "healthcare",
    "subCategory": "উপজেলা স্বাস্থ্য কমপ্লেক্স"
  },
  {
    "id": "b1",
    "name": "পূর্বধলা ব্লাড ডোনার সোসাইটি",
    "phone": "01XXXXXXXXX",
    "categoryId": "blood_donors",
    "subCategory": "স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন"
  },
  {
    "id": "admin_1",
    "name": "উপজেলা নির্বাহী অফিসারের কার্যালয় (UNO)",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা নির্বাহী অফিসারের কার্যালয় (UNO)"
  },
  {
    "id": "admin_2",
    "name": "সহকারী কমিশনার (ভূমি) এর কার্যালয়",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "সহকারী কমিশনার (ভূমি) এর কার্যালয়"
  },
  {
    "id": "admin_3",
    "name": "উপজেলা কৃষি অফিস",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা কৃষি অফিস"
  },
  {
    "id": "admin_4",
    "name": "উপজেলা প্রাণিসম্পদ অফিস",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা প্রাণিসম্পদ অফিস"
  },
  {
    "id": "admin_5",
    "name": "উপজেলা মৎস্য অফিস",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা মৎস্য অফিস"
  },
  {
    "id": "admin_6",
    "name": "উপজেলা সমাজসেবা কার্যালয়",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা সমাজসেবা কার্যালয়"
  },
  {
    "id": "admin_7",
    "name": "উপজেলা শিক্ষা অফিস (প্রাথমিক)",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা শিক্ষা অফিস (প্রাথমিক)"
  },
  {
    "id": "admin_8",
    "name": "উপজেলা মাধ্যমিক শিক্ষা অফিস",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা মাধ্যমিক শিক্ষা অফিস"
  },
  {
    "id": "admin_9",
    "name": "উপজেলা প্রকৌশলীর কার্যালয় (LGED)",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা প্রকৌশলীর কার্যালয় (LGED)"
  },
  {
    "id": "admin_10",
    "name": "উপজেলা জনস্বাস্থ্য প্রকৌশল অধিদপ্তর (DPHE)",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা জনস্বাস্থ্য প্রকৌশল অধিদপ্তর (DPHE)"
  },
  {
    "id": "admin_11",
    "name": "উপজেলা মহিলা বিষয়ক কর্মকর্তার কার্যালয়",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা মহিলা বিষয়ক কর্মকর্তার কার্যালয়"
  },
  {
    "id": "admin_12",
    "name": "উপজেলা যুব উন্নয়ন কর্মকর্তার কার্যালয়",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা যুব উন্নয়ন কর্মকর্তার কার্যালয়"
  },
  {
    "id": "admin_13",
    "name": "উপজেলা সমবায় কার্যালয়",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা সমবায় কার্যালয়"
  },
  {
    "id": "admin_14",
    "name": "উপজেলা নির্বাচন অফিস",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা নির্বাচন অফিস"
  },
  {
    "id": "admin_15",
    "name": "উপজেলা হিসাবরক্ষণ অফিস",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা হিসাবরক্ষণ অফিস"
  },
  {
    "id": "admin_16",
    "name": "উপজেলা পল্লী উন্নয়ন অফিস (BRDB)",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা পল্লী উন্নয়ন অফিস (BRDB)"
  },
  {
    "id": "admin_17",
    "name": "উপজেলা আনসার ও ভিডিপি কার্যালয়",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা আনসার ও ভিডিপি কার্যালয়"
  },
  {
    "id": "admin_18",
    "name": "উপজেলা প্রকল্প বাস্তবায়ন কর্মকর্তার কার্যালয় (PIO)",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা প্রকল্প বাস্তবায়ন কর্মকর্তার কার্যালয় (PIO)"
  },
  {
    "id": "admin_19",
    "name": "উপজেলা পরিসংখ্যান অফিস",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা পরিসংখ্যান অফিস"
  },
  {
    "id": "admin_20",
    "name": "উপজেলা খাদ্য নিয়ন্ত্রকের কার্যালয়",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা খাদ্য নিয়ন্ত্রকের কার্যালয়"
  },
  {
    "id": "admin_21",
    "name": "উপজেলা সাব-রেজিস্ট্রার অফিস",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা সাব-রেজিস্ট্রার অফিস"
  },
  {
    "id": "admin_22",
    "name": "উপজেলা পরিবার পরিকল্পনা কার্যালয়",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা পরিবার পরিকল্পনা কার্যালয়"
  },
  {
    "id": "admin_23",
    "name": "উপজেলা বন বিভাগ",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা বন বিভাগ"
  },
  {
    "id": "admin_24",
    "name": "উপজেলা ইসলামিক ফাউন্ডেশন",
    "phone": "নাম্বার যুক্ত করুন",
    "categoryId": "administration",
    "subCategory": "উপজেলা ইসলামিক ফাউন্ডেশন"
  },
  {
    "id": "r1",
    "name": "১নং হোগলা ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: সিরাজুল ইসলাম",
    "phone": "01700-000001",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "r2",
    "name": "২নং ঘাগড়া ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: রেজুওয়ান করিম",
    "phone": "01700-000002",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "r3",
    "name": "৩নং জারিয়া ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: আমিনুল ইসলাম",
    "phone": "01700-000003",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "r4",
    "name": "৪নং ধলামূলগাঁও ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: ওমর ফারুক",
    "phone": "01700-000004",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "r5",
    "name": "৫নং পূর্বধলা সদর ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: জহিরের ইসলাম",
    "phone": "01700-000005",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "r6",
    "name": "৬নং আগিয়া ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: সানোয়ার হোসেন",
    "phone": "01700-000006",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "r7",
    "name": "৭নং বিশকাকুনী ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: আমজাদ হোসেন",
    "phone": "01700-000007",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "r8",
    "name": "৮নং খলিশাউড় ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: কামরুজ্জামান",
    "phone": "01700-000008",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "r9",
    "name": "৯নং নারান্দিয়া ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: আব্দুল কুদ্দুস",
    "phone": "01700-000009",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "r10",
    "name": "১০নং গোহালাকান্দা ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: আনোয়ার হোসেন",
    "phone": "01700-000010",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "r11",
    "name": "১১নং বৈরাটি ইউনিয়ন পরিষদ",
    "details": "চেয়ারম্যান: জনাব মো: শফিকুল ইসলাম",
    "phone": "01700-000011",
    "categoryId": "representatives",
    "subCategory": "ইউনিয়ন পরিষদ"
  },
  {
    "id": "ed1",
    "name": "পূর্বধলা জে. এম. পাইলট উচ্চ বিদ্যালয়",
    "details": "প্রধান শিক্ষক",
    "phone": "01700-444441",
    "categoryId": "education",
    "subCategory": "স্কুল"
  },
  {
    "id": "ed2",
    "name": "পূর্বধলা সরকারি কলেজ",
    "details": "অধ্যক্ষের কার্যালয়",
    "phone": "01700-444442",
    "categoryId": "education",
    "subCategory": "কলেজ"
  },
  {
    "id": "ed3",
    "name": "কম্পিউটার ট্রেনিং সেন্টার",
    "details": "স্কিল ডেভেলপমেন্ট আইটি",
    "phone": "01700-444443",
    "categoryId": "education",
    "subCategory": "প্রাইভেট টিউটর ও কোচিং সেন্টার"
  },
  {
    "id": "t1",
    "name": "পূর্বধলা বাসস্ট্যান্ড",
    "phone": "01XXXXXXXXX",
    "categoryId": "transport",
    "subCategory": "বাস কাউন্টার"
  },
  {
    "id": "fn4",
    "name": "মোহাম্মদ গোলাম মোস্তফা",
    "details": "দৈনিক কালেরকন্ঠ",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01711511299",
    "categoryId": "daily_services"
  },
  {
    "id": "fn5",
    "name": "সৈয়দ আরিফুজ্জামান",
    "details": "প্রকাশক-সম্পাদক, আজকের আরবান",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01711709572",
    "categoryId": "daily_services"
  },
  {
    "id": "fn6",
    "name": "মো. জুলফিকার আলী শাহীন",
    "details": "বিশেষ প্রতিনিধি, আজকের আরবান",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01717143759",
    "categoryId": "daily_services"
  },
  {
    "id": "fn7",
    "name": "ইসমাইল হোসেন খোকন",
    "details": "দৈনিক নয়াদিগন্ত",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01913258097",
    "categoryId": "daily_services"
  },
  {
    "id": "fn8",
    "name": "শফিকুল আলম শাহীন",
    "details": "দৈনিক আমার দেশ",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01711796839",
    "categoryId": "daily_services"
  },
  {
    "id": "fn9",
    "name": "মো. জায়েজুল ইসলাম",
    "details": "দৈনিক বাংলাদেশ বুলেটিন",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01713549401",
    "categoryId": "daily_services"
  },
  {
    "id": "fn10",
    "name": "মো. নোমান শাহরিয়ার",
    "details": "পূর্বধলার দর্পণ",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01911397107",
    "categoryId": "daily_services"
  },
  {
    "id": "fn11",
    "name": "তিলক রায় টুলু",
    "details": "দৈনিক ভোরের কাগজ",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01711045893",
    "categoryId": "daily_services"
  },
  {
    "id": "fn12",
    "name": "মো. নূর উদ্দিন মন্ডল দুলাল",
    "details": "দৈনিক বাংলার দর্পণ",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01711001719",
    "categoryId": "daily_services"
  },
  {
    "id": "fn13",
    "name": "মোহাম্মদ এমদাদুল ইসলাম",
    "details": "দৈনিক সংবাদ",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01711176181",
    "categoryId": "daily_services"
  },
  {
    "id": "fn14",
    "name": "মো. হাবিবুর রহমান",
    "details": "দৈনিক কালবেলা",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01917213290",
    "categoryId": "daily_services"
  },
  {
    "id": "fn15",
    "name": "নাহিদ আলম",
    "details": "স্টাফ রিপোর্টার, আজকের আরবান",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01911172248",
    "categoryId": "daily_services"
  },
  {
    "id": "fn16",
    "name": "সাদ্দাম হোসেন",
    "details": "দৈনিক বাংলাদেশ বুলেটিন",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01914037608",
    "categoryId": "daily_services"
  },
  {
    "id": "fn17",
    "name": "তৌহিদুল কবির খান রাসেল",
    "details": "দৈনিক যুগান্তর / আর টিভি",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01912181925",
    "categoryId": "daily_services"
  },
  {
    "id": "fn18",
    "name": "মো. শাখাওয়াত হোসেন শিমুল",
    "details": "দৈনিক আজকের বাংলাদেশ",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01713912615",
    "categoryId": "daily_services"
  },
  {
    "id": "fn19",
    "name": "মো. আল মুনসুর",
    "details": "দৈনিক প্রতিদিনের সংবাদ",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01918510613",
    "categoryId": "daily_services"
  },
  {
    "id": "fn20",
    "name": "মোহাম্মদ জুবায়েদ হোসেন বাচ্চু",
    "details": "দৈনিক মানব জমিন",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01772928790",
    "categoryId": "daily_services"
  },
  {
    "id": "fn21",
    "name": "মো. শফিকুল ইসলাম খান",
    "details": "দৈনিক ভোরের ডাক",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01911696226",
    "categoryId": "daily_services"
  },
  {
    "id": "fn22",
    "name": "মো. মিঠু সরকার",
    "details": "সোনালী নিউজ",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01795397054",
    "categoryId": "daily_services"
  },
  {
    "id": "fn23",
    "name": "মোস্তাক আহমেদ খান",
    "details": "দৈনিক আজকালের খবর",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01925584484",
    "categoryId": "daily_services"
  },
  {
    "id": "fn24",
    "name": "এস এম ওয়াদুদ",
    "details": "এন টিভি অনলাইন",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01713503527",
    "categoryId": "daily_services"
  },
  {
    "id": "fn25",
    "name": "আব্দুল্লাহ সাকিব",
    "details": "দৈনিক মানবকন্ঠ",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01983317513",
    "categoryId": "daily_services"
  },
  {
    "id": "fn26",
    "name": "মো. মোরসালিন আহমেদ (মোসা)",
    "details": "দৈনিক আমাদের সময়",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01708561341",
    "categoryId": "daily_services"
  },
  {
    "id": "fn27",
    "name": "সুহাদা মেহজাবিন",
    "details": "বার্তা সম্পাদক, আজকের আরবান",
    "subCategory": "আইনজীবী ও সাংবাদিক",
    "phone": "01312709572",
    "categoryId": "daily_services"
  },
  {
    "id": "bs1",
    "name": "ভাই ভাই রেস্টুরেন্ট ও মিষ্টি ঘর",
    "details": "হোম ডেলিভারি ব্যবস্থা আছে",
    "phone": "01700-555551",
    "categoryId": "business",
    "subCategory": "রেস্টুরেন্ট ও খাবার সরবরাহ"
  },
  {
    "id": "bs2",
    "name": "রাসেল হার্ডওয়্যার",
    "details": "বাড়ি তৈরির জিনিসপত্র",
    "phone": "01700-555552",
    "categoryId": "business",
    "subCategory": "হার্ডওয়ার ও ডেকোরেটর"
  },
  {
    "id": "bs3",
    "name": "সোহাগ ডেকোরেটর ও সাউন্ড সিস্টেম",
    "details": "যেকোনো অনুষ্ঠানের জন্য",
    "phone": "01700-555553",
    "categoryId": "business",
    "subCategory": "হার্ডওয়ার ও ডেকোরেটর"
  },
  {
    "id": "fn1",
    "name": "সোনালী ব্যাংক পিএলসি",
    "details": "পূর্বধলা শাখা",
    "phone": "01700-666661",
    "categoryId": "finance",
    "subCategory": "সরকারি ও বেসরকারি ব্যাংক"
  },
  {
    "id": "fn2",
    "name": "পূর্বধলা প্রেস ক্লাব",
    "details": "সাধারণ সম্পাদক",
    "phone": "01700-666662",
    "categoryId": "miscellaneous",
    "subCategory": "স্থানীয় স্বেচ্ছাসেবী সংগঠন"
  },
  {
    "id": "fn3",
    "name": "সুন্দরবন কুরিয়ার সার্ভিস",
    "details": "পূর্বধলা এজেন্সি",
    "phone": "01700-666663",
    "categoryId": "miscellaneous",
    "subCategory": "অন্যান্য"
  }
];

export const predefinedSubCategories: { categoryId: string, subCategories: string[] }[] = [
  { categoryId: "emergency", subCategories: ["ফায়ার সার্ভিস", "থানা / পুলিশ কন্ট্রোল রুম", "হাসপাতাল জরুরী বিভাগ", "বিদ্যুৎ অফিস", "পবিস অভিযোগ কেন্দ্র"] },
  { categoryId: "healthcare", subCategories: ["হাসপাতাল/ক্লিনিক", "ডাক্তার", "ডায়াগনস্টিক সেন্টার", "ফার্মেসি"] },
  { categoryId: "blood_donors", subCategories: ["স্থানীয় ব্লাড ডোনার ক্লাব বা সংগঠন", "রক্তদাতা", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "ব্লাড ব্যাংক"] },
  { categoryId: "administration", subCategories: ["উপজেলা নির্বাহী অফিসারের কার্যালয় (UNO)", "সহকারী কমিশনার (ভূমি) এর কার্যালয়", "উপজেলা কৃষি অফিস", "উপজেলা প্রাণিসম্পদ অফিস", "উপজেলা মৎস্য অফিস", "উপজেলা শিক্ষা অফিস (প্রাথমিক)", "উপজেলা মাধ্যমিক শিক্ষা অফিস", "উপজেলা সমাজসেবা কার্যালয়", "উপজেলা প্রকৌশলীর কার্যালয় (LGED)", "উপজেলা জনস্বাস্থ্য প্রকৌশল অধিদপ্তর (DPHE)", "উপজেলা প্রকল্প বাস্তবায়ন কর্মকর্তার কার্যালয় (PIO)", "উপজেলা নির্বাচন অফিস", "উপজেলা সাব-রেজিস্ট্রার অফিস", "উপজেলা পরিবার পরিকল্পনা কার্যালয়", "উপজেলা খাদ্য নিয়ন্ত্রকের কার্যালয়", "উপজেলা হিসাবরক্ষণ অফিস", "উপজেলা মহিলা বিষয়ক কর্মকর্তার কার্যালয়", "উপজেলা যুব উন্নয়ন কর্মকর্তার কার্যালয়", "উপজেলা সমবায় কার্যালয়", "উপজেলা পল্লী উন্নয়ন অফিস (BRDB)", "উপজেলা আনসার ও ভিডিপি কার্যালয়", "উপজেলা পরিসংখ্যান অফিস", "উপজেলা বন বিভাগ", "উপজেলা ইসলামিক ফাউন্ডেশন", "অন্যান্য"] },
  { categoryId: "representatives", subCategories: ["সংসদ সদস্য (এমপি)", "উপজেলা পরিষদ", "ইউনিয়ন পরিষদ"] },
  { categoryId: "education", subCategories: ["স্কুল", "কলেজ", "মাদ্রাসা", "কিন্ডারগার্টেন", "প্রাইভেট টিউটর"] },
  { categoryId: "transport", subCategories: ["বাস", "ট্রেন", "রেন্ট-এ-কার", "সিএনজি/অটো স্ট্যান্ড", "ট্রাক/পিকআপ"] },
  { categoryId: "daily_services", subCategories: ["ইলেকট্রিশিয়ান", "প্লাম্বার", "টিভি/ফ্রিজ মেকানিক", "রাজমিস্ত্রি/কাঠমিস্ত্রি", "আইনজীবী"] },
  { categoryId: "business", subCategories: ["গ্যাস সিলিন্ডার", "রেস্টুরেন্ট/খাবার দোকান", "কম্পিউটার/ইন্টারনেট/ওয়াইফাই", "হার্ডওয়্যার/ডেকোরেটর", "মুদি দোকান/সুপার শপ"] },
  { categoryId: "finance", subCategories: ["ব্যাংক", "এনজিও", "মোবাইল ব্যাংকিং এজেন্ট"] },
  { categoryId: "miscellaneous", subCategories: ["কাজী অফিস", "মসজিদ/মন্দির", "স্বেচ্ছাসেবী সংগঠন", "অন্যান্য"] }
];
