import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Train, Clock, MapPin, User, Navigation, ArrowRight } from 'lucide-react';
import { toBengaliDigits } from './utils';

const trainRoutes = {
  jaria_local: {
    id: 'jaria_local',
    name: 'জারিয়া লোকাল ট্রেন (৪ বার যাতায়াত)',
    stations: ['ময়মনসিংহ', 'শম্ভুগঞ্জ', 'বিষকা', 'গৌরীপুর', 'শ্যামগঞ্জ', 'জালশুকা', 'পূর্বধলা', 'জারিয়া']
  },
  balaka: {
    id: 'balaka',
    name: 'বলাকা এক্সপ্রেস (ঢাকা-জারিয়া)',
    stations: ['ঢাকা', 'বিমানবন্দর', 'টঙ্গী', 'জয়দেবপুর', 'গফরগাঁও', 'ময়মনসিংহ', 'শম্ভুগঞ্জ', 'বিষকা', 'গৌরীপুর', 'শ্যামগঞ্জ', 'জালশুকা', 'পূর্বধলা', 'জারিয়া']
  }
};

export default function TrainTracker({ contributorName }: { contributorName: string }) {
  const [trainData, setTrainData] = useState<Record<string, any>>({});
  const [selectedTrain, setSelectedTrain] = useState<string>('jaria_local');
  const [direction, setDirection] = useState<string>('জারিয়া গামী');
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'train_locations'), (snapshot) => {
      const data: Record<string, any> = {};
      snapshot.forEach(doc => {
        data[doc.id] = doc.data();
      });
      setTrainData(data);
    });
    return () => unsub();
  }, []);

  const handleUpdate = async () => {
    if (!selectedStation) {
      alert("অনুগ্রহ করে একটি স্টেশন নির্বাচন করুন।");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'train_locations', selectedTrain), {
        currentStation: selectedStation,
        direction: direction,
        updatedBy: contributorName || 'একজন যাত্রী',
        updatedAt: serverTimestamp()
      });
      alert('ট্রেনের অবস্থান সফলভাবে আপডেট হয়েছে! ধন্যবাদ।');
      setSelectedStation('');
    } catch (error) {
      console.error('Error updating train:', error);
      alert('আপডেট করতে সমস্যা হয়েছে।');
    }
    setIsSubmitting(false);
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'অজানা';
    const time = timestamp.toMillis ? timestamp.toMillis() : timestamp;
    const diff = Math.floor((Date.now() - time) / 60000); // in minutes
    if (diff < 1) return 'এইমাত্র';
    if (diff < 60) return `${toBengaliDigits(diff.toString())} মিনিট আগে`;
    const hours = Math.floor(diff / 60);
    return `${toBengaliDigits(hours.toString())} ঘণ্টা আগে`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-emerald-50">
        <div>
          <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
            <Train className="w-5 h-5 text-emerald-600" />
            লাইভ ট্রেন ট্র্যাকিং
          </h2>
          <p className="text-sm text-emerald-700">ট্রেনের যাত্রীরা নিজে আপডেট দিয়ে অন্যদের সাহায্য করুন</p>
        </div>
      </div>

      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Status Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b pb-2">
            <Navigation className="w-4 h-4 text-emerald-600" /> বর্তমান ট্রেনের অবস্থান
          </h3>
          
          {Object.values(trainRoutes).map(train => {
            const data = trainData[train.id];
            return (
              <div key={train.id} className="bg-slate-50 border border-slate-100 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-emerald-800">{train.name}</h4>
                  <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                    {data?.direction || 'অজানা'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span className="text-slate-700 font-medium text-lg">
                    {data?.currentStation || 'এখনো আপডেট করা হয়নি'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(data?.updatedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    আপডেট করেছেন: {data?.updatedBy || 'অজানা'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Update Section */}
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 shadow-sm">
          <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
            আপনি কি ট্রেনে আছেন? আপডেট করুন
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-emerald-800 mb-1">কোন ট্রেনে আছেন?</label>
              <select 
                value={selectedTrain}
                onChange={(e) => setSelectedTrain(e.target.value)}
                className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                {Object.values(trainRoutes).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-800 mb-1">ট্রেনটি কোন দিকে যাচ্ছে?</label>
              <div className="flex gap-3">
                <label className="flex-1 flex items-center gap-2 bg-white px-3 py-2 border border-emerald-200 rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    name="direction" 
                    value="জারিয়া গামী"
                    checked={direction === 'জারিয়া গামী'}
                    onChange={(e) => setDirection(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">জারিয়া গামী</span>
                </label>
                <label className="flex-1 flex items-center gap-2 bg-white px-3 py-2 border border-emerald-200 rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    name="direction" 
                    value={selectedTrain === 'balaka' ? 'ঢাকা গামী' : 'ময়মনসিংহ গামী'}
                    checked={direction !== 'জারিয়া গামী'}
                    onChange={(e) => setDirection(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">{selectedTrain === 'balaka' ? 'ঢাকা গামী' : 'ময়মনসিংহ গামী'}</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-800 mb-1">ট্রেনটি এখন কোথায় আছে?</label>
              <select 
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="">স্টেশন নির্বাচন করুন</option>
                {trainRoutes[selectedTrain as keyof typeof trainRoutes].stations.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleUpdate}
              disabled={isSubmitting || !selectedStation}
              className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-colors ${
                isSubmitting || !selectedStation ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <ArrowRight className="w-5 h-5" />
              অবস্থান আপডেট করুন
            </button>
            <p className="text-xs text-emerald-600 text-center mt-2">
              ভুল তথ্য দিয়ে অন্যদের বিভ্রান্ত করবেন না। 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
