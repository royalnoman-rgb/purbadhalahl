import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc, query, where, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from './firebase';
import { CheckCircle, XCircle, Trash2, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [pendingContacts, setPendingContacts] = useState<any[]>([]);
  const [pendingCategories, setPendingCategories] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const contactsQuery = query(collection(db, 'contacts'), where('status', '==', 'pending'));
      const contactsSnapshot = await getDocs(contactsQuery);
      setPendingContacts(contactsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      const categoriesQuery = query(collection(db, 'categories'), where('status', '==', 'pending'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      setPendingCategories(categoriesSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      const feedbacksQuery = collection(db, 'feedback');
      const feedbacksSnapshot = await getDocs(feedbacksQuery);
      // Sort in memory or just display
      const fbList = feedbacksSnapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      fbList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setFeedbacks(fbList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple secret for now
      setIsAuthenticated(true);
    } else {
      alert('ভুল পাসওয়ার্ড');
    }
  };

  const handleApproveContact = async (id: string) => {
    const contactRef = doc(db, 'contacts', id);
    const contactSnap = await getDoc(contactRef);
    if (contactSnap.exists()) {
      const contactData = contactSnap.data();
      await updateDoc(contactRef, { status: 'approved' });
      
      if (contactData.contributorPhone && contactData.contributorName) {
        const contributorRef = doc(db, 'contributors', contactData.contributorPhone);
        const contributorDoc = await getDoc(contributorRef);
        if (contributorDoc.exists()) {
          await updateDoc(contributorRef, {
            approvedCount: increment(1),
            points: increment(10)
          });
        } else {
          await setDoc(contributorRef, {
            name: contactData.contributorName,
            phone: contactData.contributorPhone,
            facebookUrl: contactData.contributorFacebook || '',
            approvedCount: 1,
            points: 10
          });
        }
      }
    }
    fetchData();
  };

  const handleDeleteContact = async (id: string) => {
    if(window.confirm('সত্যিই ডিলিট করতে চান?')) {
      await deleteDoc(doc(db, 'contacts', id));
      fetchData();
    }
  };

  const handleApproveCategory = async (id: string) => {
    await updateDoc(doc(db, 'categories', id), { status: 'approved' });
    fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    if(window.confirm('সত্যিই ডিলিট করতে চান?')) {
      await deleteDoc(doc(db, 'categories', id));
      fetchData();
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if(window.confirm('সত্যিই ডিলিট করতে চান?')) {
      await deleteDoc(doc(db, 'feedback', id));
      fetchData();
    }
  };

  const handleRateFeedback = async (id: string, stars: number, contributorPhone?: string) => {
    await updateDoc(doc(db, 'feedback', id), {
      status: 'approved',
      rating: stars
    });
    if (contributorPhone) {
      const contributorRef = doc(db, 'contributors', contributorPhone);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        await updateDoc(contributorRef, {
          points: increment(stars * 2)
        });
      }
    }
    fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">অ্যাডমিন প্যানেল</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="পাসওয়ার্ড দিন"
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700">
              লগইন
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/" className="text-emerald-600 text-sm hover:underline">মূল পেজে ফিরে যান</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-emerald-800 text-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 hover:bg-emerald-700 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-emerald-700 px-3 py-1 rounded hover:bg-emerald-600">লগআউট</button>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8 mt-6">
        
        {/* Pending Categories */}
        <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">অপেক্ষমান ক্যাটাগরি (মেনু) - {pendingCategories.length}</h2>
          {pendingCategories.length === 0 ? <p className="text-gray-500">কোনো অপেক্ষমান ক্যাটাগরি নেই।</p> : (
            <div className="grid gap-4">
              {pendingCategories.map(cat => (
                <div key={cat.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{cat.title} ({cat.englishTitle})</h3>
                    <p className="text-sm text-gray-600">Icon: {cat.iconName} | Color: {cat.color}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveCategory(cat.id)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Approve">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pending Contacts */}
        <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">অপেক্ষমান নাম্বার - {pendingContacts.length}</h2>
          {pendingContacts.length === 0 ? <p className="text-gray-500">কোনো অপেক্ষমান নাম্বার নেই।</p> : (
            <div className="grid gap-4">
              {pendingContacts.map(contact => (
                <div key={contact.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{contact.name}</h3>
                      {contact.replacesId && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">সংশোধন রিকোয়েস্ট</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{contact.phone}</p>
                    <p className="text-sm text-gray-500">{contact.details} - {contact.subDetails}</p>
                    <p className="text-xs text-emerald-600 mt-1">Category: {contact.categoryId}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveContact(contact.id)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Approve">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteContact(contact.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Feedbacks */}
        <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">মতামত ও আইডিয়া - {feedbacks.length}</h2>
          {feedbacks.length === 0 ? <p className="text-gray-500">কোনো মতামত নেই।</p> : (
            <div className="grid gap-4">
              {feedbacks.map(feedback => (
                <div key={feedback.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{feedback.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{new Date(feedback.createdAt).toLocaleString('bn-BD')}</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{feedback.message}</p>
                    </div>
                    <button onClick={() => handleDeleteFeedback(feedback.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex-shrink-0" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {!feedback.rating ? (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">রেটিং দিন:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRateFeedback(feedback.id, star, feedback.contributorPhone)}
                          className="text-gray-300 hover:text-yellow-500 transition-colors"
                          title={`${star} Star${star > 1 ? 's' : ''}`}
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600 mr-2">রেটিং দেওয়া হয়েছে:</span>
                      {[...Array(feedback.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
