import { toBengaliDigits, toEnglishDigits } from '../utils';
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, writeBatch, doc, getDocs, setDoc } from 'firebase/firestore';
import { categories as staticCategories, contacts as staticContacts, predefinedSubCategories } from '../data';
import { db } from '../firebase';
import { Edit3, CheckCircle, Trash2, ArrowRight } from 'lucide-react';

export default function DataManagementTab() {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubCategories] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  
  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedSubCat, setSelectedSubCat] = useState('');
  
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  
  const [editingSubCatId, setEditingSubCatId] = useState<string | null>(null);
  const [editSubCatTitle, setEditSubCatTitle] = useState('');
  
  const [targetCatId, setTargetCatId] = useState('');
  const [targetSubCat, setTargetSubCat] = useState('');
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const qCat = query(collection(db, 'categories'), where('status', '==', 'approved'));
    const unsubCat = onSnapshot(qCat, (snap) => {
      const dynamicCategories = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      const dynamicCategoryIds = new Set(dynamicCategories.map(c => c.id));
      const activeStaticCategories = staticCategories.filter(c => !dynamicCategoryIds.has(c.id));
      setCategories([...activeStaticCategories, ...dynamicCategories]);
    });

    const qSubCat = query(collection(db, 'subcategories'), where('status', '==', 'approved'));
    const unsubSubCat = onSnapshot(qSubCat, (snap) => {
      setSubCategories(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    }, (error) => console.error("DataManagementTab SubCategories Error:", error));

    const qContacts = query(collection(db, 'contacts'));
    const unsubContacts = onSnapshot(qContacts, (snap) => {
      const dynamicContacts = snap.docs.map(d => ({ ...d.data(), id: d.id } as any));
      const replacedIds = new Set(dynamicContacts.map(c => c.replacesId).filter(Boolean));
      const activeStaticContacts = staticContacts.filter(c => !replacedIds.has(c.id));
      const activeDynamicContacts = dynamicContacts.filter(c => !replacedIds.has(c.id));
      
      const allContacts = [...activeStaticContacts, ...activeDynamicContacts];
      // filter out duplicates by id (prefer dynamic)
      const uniqueContacts = Array.from(new Map(allContacts.map(item => [item.id, item])).values());
      setContacts(uniqueContacts);
    });

    return () => { unsubCat(); unsubSubCat(); unsubContacts(); };
  }, []);

  const handleRenameSubCategory = async (subcatId: string, oldTitle: string, categoryId: string) => {
    if (!editSubCatTitle.trim() || editSubCatTitle === oldTitle) {
      setEditingSubCatId(null);
      return;
    }
    
    try {
      const batch = writeBatch(db);
      
      // Update subcategory doc if it's real
      if (!subcatId.startsWith('virtual_')) {
        batch.update(doc(db, 'subcategories', subcatId), { title: editSubCatTitle.trim() });
      }
      
      // Update all related contacts
      const matchingContacts = contacts.filter(c => c.categoryId === categoryId && c.subCategory === oldTitle);
      matchingContacts.forEach(contact => {
        batch.set(doc(db, 'contacts', contact.id), { ...contact, subCategory: editSubCatTitle.trim(), status: 'approved' }, { merge: true });
      });
      
      await batch.commit();
      setEditingSubCatId(null);
      alert('Subcategory renamed successfully!');
    } catch (error) {
      console.error(error);
      alert('Error renaming subcategory');
    }
  };

  const handleBulkMove = async () => {
    if (selectedContacts.size === 0 || !targetCatId) return;
    
    try {
      const batch = writeBatch(db);
      selectedContacts.forEach(contactId => {
        
        const contactToUpdate = contacts.find(c => c.id === contactId);
        if (contactToUpdate) {
            batch.set(doc(db, 'contacts', contactId), {
              ...contactToUpdate,
              categoryId: targetCatId,
              subCategory: targetSubCat || '',
              status: 'approved'
            }, { merge: true });
        }
      });
      
      await batch.commit();
      setIsMoveModalOpen(false);
      setSelectedContacts(new Set());
      setTargetCatId('');
      setTargetSubCat('');
      alert('Contacts moved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error moving contacts');
    }
  };

  const filteredContacts = contacts.filter(c => {
    if (selectedCatId && c.categoryId !== selectedCatId) return false;
    if (selectedSubCat && c.subCategory !== selectedSubCat) return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const englishSearch = toEnglishDigits(searchQuery);
      const bengaliSearch = toBengaliDigits(searchQuery);
      const hasMatch = 
        c.name?.toLowerCase().includes(searchLower) ||
        c.phone?.includes(englishSearch) ||
        toBengaliDigits(c.phone || '').includes(bengaliSearch) ||
        c.phone?.includes(searchQuery);
      if (!hasMatch) return false;
    }
    return true;
  });

  const toggleContact = (id: string) => {
    const next = new Set(selectedContacts);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedContacts(next);
  };

  const toggleAll = () => {
    if (selectedContacts.size === filteredContacts.length && filteredContacts.length > 0) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const getDerivedSubcats = (catId: string) => {
    const fromContacts = contacts.filter(c => c.categoryId === catId && c.subCategory).map(c => c.subCategory);
    const fromDocs = subcategories.filter(sc => sc.categoryId === catId).map(sc => sc.title);
    const fromPredefined = predefinedSubCategories.find(pc => pc.categoryId === catId)?.subCategories || [];
    
    return Array.from(new Set([...fromContacts, ...fromDocs, ...fromPredefined])).sort((a, b) => a.localeCompare(b, 'bn')).map(title => {
      const docInfo = subcategories.find(sc => sc.categoryId === catId && sc.title === title);
      return {
        id: docInfo ? docInfo.id : `virtual_${title}`,
        title,
        categoryId: catId
      };
    });
  };

  const currentCatSubcats = selectedCatId ? getDerivedSubcats(selectedCatId) : [];
  const targetCatSubcats = targetCatId ? getDerivedSubcats(targetCatId) : [];

  return (
    <div className="space-y-8 mt-6">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">সাব-ক্যাটাগরি রিনেম করুন</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select 
            value={selectedCatId} 
            onChange={e => { setSelectedCatId(e.target.value); setSelectedSubCat(''); }}
            className="p-2 border rounded-lg focus:ring-emerald-500"
          >
            <option value="">ক্যাটাগরি নির্বাচন করুন</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        
        {selectedCatId && currentCatSubcats.length > 0 && (
          <div className="space-y-3">
            {currentCatSubcats.map(sc => (
              <div key={sc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {editingSubCatId === sc.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input 
                      type="text" 
                      value={editSubCatTitle} 
                      onChange={e => setEditSubCatTitle(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <button onClick={() => handleRenameSubCategory(sc.id, sc.title, sc.categoryId)} className="bg-emerald-600 text-white px-3 py-2 rounded">
                      সেভ
                    </button>
                    <button onClick={() => setEditingSubCatId(null)} className="bg-gray-300 px-3 py-2 rounded">
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex justify-between items-center">
                    <span className="font-medium text-gray-800">{sc.title}</span>
                    <button onClick={() => { setEditingSubCatId(sc.id); setEditSubCatTitle(sc.title); }} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">কন্টাক্ট ম্যানেজমেন্ট</h2>
            <p className="text-sm text-gray-500 mt-1">সর্বমোট কন্টাক্ট: <strong className="text-emerald-600">{toBengaliDigits(contacts.length)}</strong> | বর্তমানে দেখাচ্ছে: <strong className="text-blue-600">{toBengaliDigits(filteredContacts.length)}</strong></p>
          </div>
          <div className="flex gap-2">
            <button 
              disabled={selectedContacts.size === 0}
              onClick={async () => {
                if (window.confirm(`আপনি কি সত্যিই ${selectedContacts.size}টি কন্টাক্ট ডিলিট করতে চান?`)) {
                  try {
                    const batch = writeBatch(db);
                    selectedContacts.forEach(id => {
                      if (!id.startsWith('static_')) {
                        batch.delete(doc(db, 'contacts', id));
                      }
                    });
                    await batch.commit();
                    setSelectedContacts(new Set());
                    alert('কন্টাক্ট ডিলিট সফল হয়েছে!');
                  } catch(e) {
                    alert('ডিলিট করতে সমস্যা হয়েছে।');
                  }
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> ডিলিট ({toBengaliDigits(selectedContacts.size)})
            </button>
            <button 
              disabled={selectedContacts.size === 0}
              onClick={() => setIsMoveModalOpen(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
            <ArrowRight className="w-4 h-4" /> মুভ করুন ({toBengaliDigits(selectedContacts.size)})
          </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input 
            type="text" 
            placeholder="নাম বা নাম্বার দিয়ে খুঁজুন..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-lg focus:ring-emerald-500"
          />
          <select 
            value={selectedCatId} 
            onChange={e => { setSelectedCatId(e.target.value); setSelectedSubCat(''); }}
            className="p-2 border rounded-lg focus:ring-emerald-500"
          >
            <option value="">সব ক্যাটাগরি</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          {selectedCatId && (
            <select 
              value={selectedSubCat} 
              onChange={e => setSelectedSubCat(e.target.value)}
              className="p-2 border rounded-lg focus:ring-emerald-500"
            >
              <option value="">সব সাব-ক্যাটাগরি</option>
              {currentCatSubcats.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
            </select>
          )}
        </div>

        <div className="border rounded-lg max-h-96 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="p-3 w-10">
                  <input type="checkbox" checked={selectedContacts.size === filteredContacts.length && filteredContacts.length > 0} onChange={toggleAll} />
                </th>
                <th className="p-3">নাম</th>
                <th className="p-3">ফোন</th>
                <th className="p-3">ক্যাটাগরি</th>
                <th className="p-3">সাব-ক্যাটাগরি</th>
                <th className="p-3">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((c, index) => (
                <tr key={`${c.id}-${index}`} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" checked={selectedContacts.has(c.id)} onChange={() => toggleContact(c.id)} />
                  </td>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.phone ? toBengaliDigits(c.phone) : (c.websiteUrl || '-')}</td>
                  <td className="p-3">{categories.find(cat => cat.id === c.categoryId)?.title || c.categoryId}</td>
                  <td className="p-3">{c.subCategory || '-'}</td>
                  <td className="p-3">{c.status === 'pending' ? <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs">পেন্ডিং</span> : <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs">অ্যাপ্রুভড</span>}</td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">কোনো কন্টাক্ট পাওয়া যায়নি</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isMoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">টার্গেট ক্যাটাগরি নির্বাচন করুন</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">ক্যাটাগরি</label>
                <select 
                  value={targetCatId} 
                  onChange={e => { setTargetCatId(e.target.value); setTargetSubCat(''); }}
                  className="w-full p-2 border rounded-lg focus:ring-emerald-500"
                >
                  <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              {targetCatId && targetCatSubcats.length > 0 && (
                <div>
                  <label className="block text-sm mb-1">সাব-ক্যাটাগরি (ঐচ্ছিক)</label>
                  <select 
                    value={targetSubCat} 
                    onChange={e => setTargetSubCat(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-emerald-500"
                  >
                    <option value="">সাব-ক্যাটাগরি নির্বাচন করুন</option>
                    {targetCatSubcats.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsMoveModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">বাতিল</button>
              <button disabled={!targetCatId} onClick={handleBulkMove} className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50">মুভ করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
