const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

// Remove "ফায়ার সার্ভিস" from administration
content = content.replace(
  'subCategories: ["উপজেলা নির্বাহী অফিস", "থানা পুলিশ", "ফায়ার সার্ভিস", "উপজেলা কৃষি অফিস", "উপজেলা ভূমি অফিস", "উপজেলা সমাজসেবা অফিস", "উপজেলা সমবায় অফিস", "অন্যান্য অফিস"]',
  'subCategories: ["উপজেলা নির্বাহী অফিস", "থানা পুলিশ", "উপজেলা কৃষি অফিস", "উপজেলা ভূমি অফিস", "উপজেলা সমাজসেবা অফিস", "উপজেলা সমবায় অফিস", "অন্যান্য অফিস"]'
);

// Add emergency with "ফায়ার সার্ভিস"
const target = 'export const predefinedSubCategories: { categoryId: string, subCategories: string[] }[] = [\n';
const replacement = 'export const predefinedSubCategories: { categoryId: string, subCategories: string[] }[] = [\n  { categoryId: "emergency", subCategories: ["ফায়ার সার্ভিস", "থানা / পুলিশ কন্ট্রোল রুম", "হাসপাতাল জরুরী বিভাগ", "বিদ্যুৎ অফিস", "পবিস অভিযোগ কেন্দ্র"] },\n';

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/data.ts', content);
  console.log("Patched data.ts");
} else {
  console.log("Target not found in data.ts");
}
