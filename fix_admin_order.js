import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, deleteField } from 'firebase/firestore';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fix() {
  try {
    const adminRef = doc(db, 'categories', 'administration');
    await updateDoc(adminRef, {
      subCategoriesOrder: [
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
    });
    console.log('Fixed administration subCategoriesOrder in Firebase');
  } catch (e) {
    console.log('Error or doc does not exist', e);
  }
  process.exit(0);
}
fix();
