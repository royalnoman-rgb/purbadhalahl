const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf8');
const searchStr = `export const predefinedSubCategories: { categoryId: string, subCategories: string[] }[] = [
  { categoryId: "healthcare", subCategories: ["Hospital/Clinic", "Doctors", "Diagnostic Center", "Pharmacy"] },
  { categoryId: "blood_donors", subCategories: ["রক্তদাতা", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
  { categoryId: "administration", subCategories: ["উপজেলা নির্বাহী অফিস", "থানা পুলিশ", "ফায়ার সার্ভিস", "উপজেলা কৃষি অফিস", "উপজেলা ভূমি অফিস", "উপজেলা সমাজসেবা অফিস", "উপজেলা সমবায় অফিস", "অন্যান্য অফিস"] },
  { categoryId: "representatives", subCategories: ["MP", "Upazila Parishad", "Union Parishad"] },
  { categoryId: "education", subCategories: ["School/College/Madrasa", "Kindergarten", "Private Tutors"] },
  { categoryId: "transport", subCategories: ["Bus", "Train", "Rent-A-Car", "CNG/Auto Stand", "Truck/Pickup"] },
  { categoryId: "daily_services", subCategories: ["Electrician", "Plumber", "TV/Fridge Mechanic", "Mason/Carpenter", "Lawyer"] },
  { categoryId: "business", subCategories: ["Gas Cylinder", "Restaurant", "Computer/Internet/WiFi", "Hardware/Decorator", "Grocery/Super Shop"] },
  { categoryId: "finance", subCategories: ["Banks", "NGO", "Mobile Banking Agents"] },
  { categoryId: "miscellaneous", subCategories: ["Kazi Office", "Mosque/Temple", "Volunteer Organizations", "অন্যান্য"] }
];`;

const replaceStr = `export const predefinedSubCategories: { categoryId: string, subCategories: string[] }[] = [
  { categoryId: "healthcare", subCategories: ["হাসপাতাল/ক্লিনিক", "ডাক্তার", "ডায়াগনস্টিক সেন্টার", "ফার্মেসি"] },
  { categoryId: "blood_donors", subCategories: ["রক্তদাতা", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "ব্লাড ব্যাংক"] },
  { categoryId: "administration", subCategories: ["উপজেলা নির্বাহী অফিস", "থানা পুলিশ", "ফায়ার সার্ভিস", "উপজেলা কৃষি অফিস", "উপজেলা ভূমি অফিস", "উপজেলা সমাজসেবা অফিস", "উপজেলা সমবায় অফিস", "অন্যান্য অফিস"] },
  { categoryId: "representatives", subCategories: ["সংসদ সদস্য (এমপি)", "উপজেলা পরিষদ", "ইউনিয়ন পরিষদ"] },
  { categoryId: "education", subCategories: ["স্কুল/কলেজ/মাদ্রাসা", "কিন্ডারগার্টেন", "প্রাইভেট টিউটর"] },
  { categoryId: "transport", subCategories: ["বাস", "ট্রেন", "রেন্ট-এ-কার", "সিএনজি/অটো স্ট্যান্ড", "ট্রাক/পিকআপ"] },
  { categoryId: "daily_services", subCategories: ["ইলেকট্রিশিয়ান", "প্লাম্বার", "টিভি/ফ্রিজ মেকানিক", "রাজমিস্ত্রি/কাঠমিস্ত্রি", "আইনজীবী"] },
  { categoryId: "business", subCategories: ["গ্যাস সিলিন্ডার", "রেস্টুরেন্ট/খাবার দোকান", "কম্পিউটার/ইন্টারনেট/ওয়াইফাই", "হার্ডওয়্যার/ডেকোরেটর", "মুদি দোকান/সুপার শপ"] },
  { categoryId: "finance", subCategories: ["ব্যাংক", "এনজিও", "মোবাইল ব্যাংকিং এজেন্ট"] },
  { categoryId: "miscellaneous", subCategories: ["কাজী অফিস", "মসজিদ/মন্দির", "স্বেচ্ছাসেবী সংগঠন", "অন্যান্য"] }
];`;
code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/data.ts', code);
