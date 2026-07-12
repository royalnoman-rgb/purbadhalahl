import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { contacts as staticContacts } from '../data';
import { toBengaliDigits } from '../utils';
import { Trash2, AlertCircle, CheckCircle } from 'lucide-react';

export default function DuplicatesTab() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  useEffect(() => {
    const qContacts = query(collection(db, 'contacts'), where('status', '==', 'approved'));
    const unsubContacts = onSnapshot(qContacts, (snap) => {
      const dynamicContacts = snap.docs.map(d => ({ ...d.data(), id: d.id } as any));
      const replacedIds = new Set(dynamicContacts.map(c => c.replacesId).filter(Boolean));
      const activeStaticContacts = staticContacts.filter(c => !replacedIds.has(c.id));
      const activeDynamicContacts = dynamicContacts.filter(c => !replacedIds.has(c.id));
      
      const allContacts = [...activeStaticContacts, ...activeDynamicContacts];
      setContacts(allContacts);
      setLoading(false);
      findDuplicates(allContacts);
    });

    return () => unsubContacts();
  }, []);

  const findDuplicates = (allContacts: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    // Group by normalized phone
    allContacts.forEach(contact => {
      if (!contact.phone) return;
      const normalizedPhone = contact.phone.replace(/[^0-9+]/g, '');
      if (normalizedPhone.length > 5) { // Ensure it's a valid looking phone
        if (!groups[normalizedPhone]) {
          groups[normalizedPhone] = [];
        }
        groups[normalizedPhone].push(contact);
      }
    });

    // Also group by name to find name duplicates
    const nameGroups: { [key: string]: any[] } = {};
    allContacts.forEach(contact => {
      if (!contact.name) return;
      const normalizedName = contact.name.trim().toLowerCase();
      if (normalizedName.length > 2) {
        if (!nameGroups[normalizedName]) {
          nameGroups[normalizedName] = [];
        }
        nameGroups[normalizedName].push(contact);
      }
    });

    const duplicateGroups = [];
    
    // Process phone duplicates
    for (const [phone, group] of Object.entries(groups)) {
      if (group.length > 1) {
        duplicateGroups.push({
          type: 'phone',
          value: phone,
          items: group
        });
      }
    }

    // Process name duplicates, avoiding ones already caught by phone
    const caughtPhoneItems = new Set(duplicateGroups.flatMap(g => g.items.map((i: any) => i.id)));
    for (const [name, group] of Object.entries(nameGroups)) {
      if (group.length > 1) {
        // filter out items already in caughtPhoneItems
        const remainingGroup = group.filter(item => !caughtPhoneItems.has(item.id));
        if (remainingGroup.length > 1) { // Still a duplicate group
          duplicateGroups.push({
            type: 'name',
            value: name,
            items: group // keep the full group for context
          });
        }
      }
    }

    setDuplicates(duplicateGroups);
  };

  const handleDelete = async (id: string, isStatic: boolean) => {
    if (isStatic) {
      alert("এটি একটি স্ট্যাটিক ডেটা। এটি সোর্স কোড থেকে মুছে ফেলতে হবে।");
      return;
    }
    
    if (window.confirm("আপনি কি নিশ্চিত যে এই নাম্বারটি মুছে ফেলতে চান?")) {
      try {
        await deleteDoc(doc(db, 'contacts', id));
      } catch (err) {
        console.error("Error deleting contact: ", err);
        alert("ডিলিট করতে সমস্যা হয়েছে।");
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">ডেটা লোড হচ্ছে...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">ডুপলিকেট নাম্বারসমূহ</h2>
        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
          {duplicates.length} টি ডুপলিকেট গ্রুপ পাওয়া গেছে
        </span>
      </div>

      {duplicates.length === 0 ? (
        <div className="bg-emerald-50 text-emerald-700 p-8 rounded-xl text-center flex flex-col items-center">
          <CheckCircle className="w-12 h-12 mb-3 text-emerald-500" />
          <h3 className="text-lg font-medium">কোনো ডুপলিকেট ডেটা পাওয়া যায়নি!</h3>
        </div>
      ) : (
        <div className="grid gap-6">
          {duplicates.map((group, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">
                  {group.type === 'phone' ? 'একই নাম্বার:' : 'একই নাম:'} 
                  <span className="ml-2 bg-white px-2 py-1 rounded text-orange-900">{group.type === 'phone' ? toBengaliDigits(group.value) : group.value}</span>
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {group.items.map((contact: any) => {
                  const isStatic = !contact.id || contact.id.toString().length < 10; // basic heuristic
                  return (
                    <div key={contact.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                          {isStatic && (
                            <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Static</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{toBengaliDigits(contact.phone)}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {contact.details} {contact.subDetails ? `• ${contact.subDetails}` : ''}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                            {contact.categoryId}
                          </span>
                          {contact.subCategory && (
                            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                              {contact.subCategory}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <button
                          onClick={() => handleDelete(contact.id, isStatic)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                          ডিলিট করুন
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
