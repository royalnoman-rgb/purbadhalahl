/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Flame, Ambulance, Zap, Droplets, Users, Building2, Phone, ArrowLeft, Search, UserPlus, X, CheckCircle2,
  Bus, Stethoscope, Wrench, GraduationCap, Store, Landmark, Newspaper, Plus, Edit3, Navigation, Lock, MessageCircle, Award, Trophy, UserCircle, Star
} from 'lucide-react';
import { categories as staticCategories, contacts as staticContacts } from './data';
import { Category } from './types';
import { collection, addDoc, getDocs, query, where, onSnapshot, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

import MapTracker from './MapTracker';

// Map icon strings to actual React components from lucide-react
const iconMap: Record<string, React.ElementType> = {
  Shield, Flame, Ambulance, Zap, Droplets, Users, Building2, Bus, Stethoscope, Wrench, GraduationCap, Store, Landmark, Newspaper,
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  
  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  
  const [requestStatus, setRequestStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Dynamic Data
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const [dynamicContacts, setDynamicContacts] = useState<any[]>([]);
  const [ratedFeedbacks, setRatedFeedbacks] = useState<any[]>([]);

  // Form states - Contact
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+88');
  const [newDetails, setNewDetails] = useState('');
  const [newSubDetails, setNewSubDetails] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // Form states - Category
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatEnglish, setNewCatEnglish] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Building2');
  const [newCatColor, setNewCatColor] = useState('bg-emerald-600 text-emerald-50');

  // Form states - Feedback
  const [newFeedbackName, setNewFeedbackName] = useState('');
  const [newFeedbackMessage, setNewFeedbackMessage] = useState('');

  // Contributor Modals and State
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isContributorProfileOpen, setIsContributorProfileOpen] = useState(false);
  const [contributorName, setContributorName] = useState('');
  const [contributorPhone, setContributorPhone] = useState('');
  const [contributorFacebook, setContributorFacebook] = useState('');
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [contributorPoints, setContributorPoints] = useState(0);
  const [contributorApprovedCount, setContributorApprovedCount] = useState(0);
  const [contributorFeedbacks, setContributorFeedbacks] = useState<any[]>([]);
  const [isEditProfileMode, setIsEditProfileMode] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('contributorName');
    const savedPhone = localStorage.getItem('contributorPhone');
    const savedFb = localStorage.getItem('contributorFacebook');
    if (savedName) setContributorName(savedName);
    if (savedPhone) setContributorPhone(savedPhone);
    if (savedFb) setContributorFacebook(savedFb);
  }, []);

  useEffect(() => {
    // Fetch approved categories
    const qCat = query(collection(db, 'categories'), where('status', '==', 'approved'));
    const unsubCat = onSnapshot(qCat, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setDynamicCategories(cats);
    });

    // Fetch approved contacts
    const qContact = query(collection(db, 'contacts'), where('status', '==', 'approved'));
    const unsubContact = onSnapshot(qContact, (snapshot) => {
      const conts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDynamicContacts(conts);
    });

    // Fetch rated feedbacks
    const qFeedback = query(collection(db, 'feedback'), where('status', '==', 'approved'));
    const unsubFeedback = onSnapshot(qFeedback, (snapshot) => {
      const fbs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRatedFeedbacks(fbs);
    });

    return () => {
      unsubCat();
      unsubContact();
      unsubFeedback();
    }
  }, []);

  const allCategories = [...staticCategories, ...dynamicCategories];
  
  // Handle replaced contacts (edits)
  const replacedIds = new Set(dynamicContacts.map(c => c.replacesId).filter(Boolean));
  const activeStaticContacts = staticContacts.filter(c => !replacedIds.has(c.id));
  const activeDynamicContacts = dynamicContacts.filter(c => !replacedIds.has(c.id));
  const allContacts = [...activeStaticContacts, ...activeDynamicContacts];

  const filteredContacts = allContacts.filter((c) => {
    const matchesCategory = selectedCategory ? c.categoryId === selectedCategory.id : true;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    val = val.replace(/[০-৯]/g, (w) => bengaliDigits.indexOf(w).toString());
    setNewPhone(val);
  };

  const handleSuggestEdit = (contact: any) => {
    setNewName(contact.name);
    setNewPhone(contact.phone);
    setNewDetails(contact.details || '');
    setNewSubDetails(contact.subDetails || '');
    setNewCategory(contact.categoryId);
    setEditingContactId(contact.id);
    setIsRequestModalOpen(true);
  };

  const openNewRequestModal = () => {
    setNewName('');
    setNewPhone('+88');
    setNewDetails('');
    setNewSubDetails('');
    setNewCategory('');
    setEditingContactId(null);
    setIsRequestModalOpen(true);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      const payload: any = {
        name: newName,
        phone: newPhone,
        details: newDetails,
        subDetails: newSubDetails,
        categoryId: newCategory,
        status: 'pending',
        contributorName: contributorName || null,
        contributorPhone: contributorPhone || null,
        contributorFacebook: contributorFacebook || null,
      };
      
      if (editingContactId) {
        payload.replacesId = editingContactId;
      }
      
      await addDoc(collection(db, 'contacts'), payload);
      
      setRequestStatus('success');
      setTimeout(() => {
        setIsRequestModalOpen(false);
        setRequestStatus('idle');
        setNewName('');
        setNewPhone('+88');
        setNewDetails('');
        setNewSubDetails('');
        setNewCategory('');
        setEditingContactId(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে! আবার চেষ্টা করুন।');
      setRequestStatus('idle');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      await addDoc(collection(db, 'categories'), {
        title: newCatTitle,
        englishTitle: newCatEnglish,
        iconName: newCatIcon,
        color: newCatColor,
        status: 'pending'
      });
      
      setRequestStatus('success');
      setTimeout(() => {
        setIsCategoryModalOpen(false);
        setRequestStatus('idle');
        setNewCatTitle('');
        setNewCatEnglish('');
        setNewCatIcon('Building2');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে! আবার চেষ্টা করুন।');
      setRequestStatus('idle');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      await addDoc(collection(db, 'feedback'), {
        name: newFeedbackName,
        message: newFeedbackMessage,
        createdAt: new Date().toISOString(),
        contributorPhone: contributorPhone || null,
        contributorName: contributorName || null,
        status: 'pending'
      });
      
      setRequestStatus('success');
      setTimeout(() => {
        setIsFeedbackModalOpen(false);
        setRequestStatus('idle');
        setNewFeedbackName('');
        setNewFeedbackMessage('');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে! আবার চেষ্টা করুন।');
      setRequestStatus('idle');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const q = query(collection(db, 'contributors'), orderBy('approvedCount', 'desc'), limit(10));
      const snapshot = await getDocs(q);
      setTopContributors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching leaderboard", err);
    }
  };

  useEffect(() => {
    if (isLeaderboardOpen) {
      fetchLeaderboard();
    }
  }, [isLeaderboardOpen]);

  const fetchContributorStats = async () => {
    if (contributorPhone) {
      try {
        const docRef = doc(db, 'contributors', contributorPhone);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContributorPoints(data.points || (data.approvedCount || 0) * 10);
          setContributorApprovedCount(data.approvedCount || 0);
        }

        const feedbackQuery = query(collection(db, 'feedback'), where('contributorPhone', '==', contributorPhone));
        const feedbackSnap = await getDocs(feedbackQuery);
        setContributorFeedbacks(feedbackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    }
  };

  useEffect(() => {
    if (isContributorProfileOpen) {
      fetchContributorStats();
    }
  }, [isContributorProfileOpen, contributorPhone]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'contributors', loginPhone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setContributorName(data.name || '');
        setContributorPhone(data.phone || loginPhone);
        setContributorFacebook(data.facebookUrl || '');
        
        localStorage.setItem('contributorName', data.name || '');
        localStorage.setItem('contributorPhone', data.phone || loginPhone);
        localStorage.setItem('contributorFacebook', data.facebookUrl || '');
        
        setIsContributorProfileOpen(false);
        setIsLoginMode(false);
        setLoginPhone('');
        alert(`স্বাগতম ${data.name}! আপনার প্রোফাইল সফলভাবে লগইন হয়েছে।`);
      } else {
        alert('এই নাম্বারে কোনো অবদানকারীর তথ্য পাওয়া যায়নি। দয়া করে নতুন প্রোফাইল তৈরি করুন।');
      }
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const saveContributorProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('contributorName', contributorName);
    localStorage.setItem('contributorPhone', contributorPhone);
    localStorage.setItem('contributorFacebook', contributorFacebook);
    setIsContributorProfileOpen(false);
    alert('প্রোফাইল সেইভ হয়েছে! এখন থেকে আপনার যুক্ত করা নাম্বারগুলো অ্যাপ্রুভ হলে আপনার অবদান পয়েন্ট বাড়বে।');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-10 transition-all">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          {selectedCategory || showMap ? (
            <button
              onClick={() => { setSelectedCategory(null); setShowMap(false); }}
              className="mr-3 p-2 hover:bg-emerald-700 active:bg-emerald-800 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="mr-3 p-1 bg-white rounded-full overflow-hidden flex items-center justify-center w-10 h-10">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-cover mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone text-emerald-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
                }}
              />
            </div>
          )}
          <h1 className="text-xl font-semibold tracking-tight truncate flex-1">
            {showMap ? 'গাড়ির লাইভ অবস্থান' : selectedCategory ? selectedCategory.title : 'পূর্বধলা হেল্পলাইন'}
          </h1>
          <button 
            onClick={() => setIsLeaderboardOpen(true)}
            className="ml-2 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white"
            title="শীর্ষ অবদানকারী"
          >
            <Trophy className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsContributorProfileOpen(true)}
            className="ml-1 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white"
            title="আমার প্রোফাইল"
          >
            <UserCircle className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Search Bar - only show if no category is selected or if there are many contacts */}
        {!selectedCategory && !showMap && (
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="নাম বা নাম্বার দিয়ে খুঁজুন..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Contribution Banner */}
        {!selectedCategory && !showMap && !searchQuery && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-6 text-emerald-900 shadow-sm">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              আমাদের ভিশন ও আপনার অবদান
            </h2>
            <p className="text-sm leading-relaxed mb-4 text-emerald-800">
              আমরা পূর্বধলার মানুষের জন্য একটি পূর্ণাঙ্গ প্লে-স্টোর অ্যাপস তৈরি করতে যাচ্ছি। এখানে সিএনজি, পিকআপ, প্রাইভেট কার ড্রাইভারদের নাম্বার ও লাইভ লোকেশন (চেক-ইন) যুক্ত করার প্ল্যান রয়েছে। এই অ্যাপটিকে আরও সমৃদ্ধ করতে আপনার মতামত, আইডিয়া এবং নতুন নাম্বার যুক্ত করে আমাদের সহায়তা করুন।
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={openNewRequestModal}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                নতুন নাম্বার দিন
              </button>
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="bg-white text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors"
              >
                মতামত ও আইডিয়া দিন
              </button>
            </div>
          </div>
        )}

        {/* Live Tracking Map */}
        {showMap && (
          <div className="mb-8">
            <MapTracker />
          </div>
        )}

        {/* Dashboard Grid (Shown when no category is selected and no search typed) */}
        {!selectedCategory && !showMap && !searchQuery && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setShowMap(true)}
              className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50"
            >
              <Navigation className="w-10 h-10 mb-1" strokeWidth={1.5} />
              <span className="text-sm sm:text-base font-medium text-center">গাড়ির অবস্থান</span>
            </button>
            {allCategories.map((category) => {
              const IconComponent = iconMap[category.iconName] || Building2;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className={`${category.color} rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50`}
                >
                  <IconComponent className="w-10 h-10 mb-1" strokeWidth={1.5} />
                  <span className="text-sm sm:text-base font-medium text-center">{category.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Contacts List (Shown when searching or inside a category) */}
        {(selectedCategory || searchQuery) && (
          <div className="space-y-3">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div key={contact.id || contact.phone} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 leading-tight">{contact.name}</h3>
                    {contact.details && (
                      <p className="text-sm text-gray-800 font-medium mt-1 mb-0.5">{contact.details}</p>
                    )}
                    {contact.subDetails && (
                      <p className="text-sm text-gray-500 mb-1">{contact.subDetails}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <a href={`tel:${contact.phone}`} className="text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-2 transition-colors hover:bg-emerald-100 active:bg-emerald-200">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex-shrink-0 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 p-3 rounded-full transition-colors flex items-center justify-center"
                      aria-label={`Call ${contact.name}`}
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://wa.me/${contact.phone.replace(/[^0-9+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 bg-green-50 hover:bg-green-100 active:bg-green-200 text-green-600 p-3 rounded-full transition-colors flex items-center justify-center"
                      aria-label={`WhatsApp ${contact.name}`}
                      title="হোয়াটসঅ্যাপে মেসেজ দিন"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                    <button 
                      onClick={() => handleSuggestEdit(contact)}
                      className="flex-shrink-0 bg-gray-50 hover:bg-emerald-50 active:bg-emerald-100 text-gray-500 hover:text-emerald-600 p-3 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      title="নাম্বারটি সংশোধন করুন"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>কোনো তথ্য পাওয়া যায়নি।</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} পূর্বধলা হেল্পলাইন
          <br />
          <a href="https://pdonline.com.bd" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors font-medium">পূর্বধলার দর্পন আইটি সহায়তায়</a>
        </p>
        <div className="mt-3 flex justify-center items-center gap-4">
          <button onClick={() => setIsReviewsModalOpen(true)} className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
            <Star className="w-3 h-3" /> রেটিংস ও রিভিও
          </button>
          <Link to="/admin" className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
            <Lock className="w-3 h-3" /> এডমিন প্যানেল
          </Link>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-20">
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 active:bg-indigo-800 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center group relative"
          aria-label="Add new category"
        >
          <span className="absolute right-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন ক্যাটাগরি যুক্ত করুন</span>
          <Plus className="w-6 h-6" />
        </button>
        <button
          onClick={openNewRequestModal}
          className="bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 active:bg-emerald-800 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 flex items-center justify-center group relative"
          aria-label="Request to add number"
        >
          <span className="absolute right-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">নতুন নাম্বার যুক্ত করুন</span>
          <UserPlus className="w-6 h-6" />
        </button>
      </div>

      {/* Request Number Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingContactId ? 'নাম্বারটি সংশোধন করুন' : 'নতুন নাম্বার যুক্ত করুন'}
              </h2>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5">
              {requestStatus === 'success' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">রিকোয়েস্ট সফল হয়েছে!</h3>
                  <p className="text-gray-500">আপনার দেওয়া তথ্যটি যাচাই করে শীঘ্রই ডিরেক্টরিতে যুক্ত করা হবে।</p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">যাঁর নাম্বার যুক্ত করবেন তাঁর নাম/পদের নাম *</label>
                    <input
                      type="text" required value={newName} onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="যেমন: জামাল উদ্দিন"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার *</label>
                    <input
                      type="tel" required value={newPhone} onChange={handlePhoneChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="+8801XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">বিস্তারিত পরিচয়</label>
                    <input
                      type="text" value={newDetails} onChange={(e) => setNewDetails(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="যেমন: মেডিসিন বিশেষজ্ঞ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা / সাব-ডিটেইলস</label>
                    <input
                      type="text" value={newSubDetails} onChange={(e) => setNewSubDetails(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="যেমন: পূর্বধলা বাজার"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরি *</label>
                    <select
                      required value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option value="" disabled>ক্যাটাগরি নির্বাচন করুন</option>
                      {allCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="submit" disabled={requestStatus === 'submitting'}
                    className={`w-full py-3 px-4 rounded-xl text-white font-medium flex justify-center items-center transition-colors ${
                      requestStatus === 'submitting' ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {requestStatus === 'submitting' ? 'জমা দেওয়া হচ্ছে...' : 'রিকোয়েস্ট পাঠান'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">নতুন ক্যাটাগরি (মেনু) যুক্ত করুন</h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5">
              {requestStatus === 'success' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-indigo-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">রিকোয়েস্ট সফল হয়েছে!</h3>
                  <p className="text-gray-500">অ্যাডমিন চেক করে ক্যাটাগরিটি যুক্ত করবেন।</p>
                </div>
              ) : (
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরির নাম (বাংলায়) *</label>
                    <input
                      type="text" required value={newCatTitle} onChange={(e) => setNewCatTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="যেমন: ব্লাড ডোনার"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name (English) *</label>
                    <input
                      type="text" required value={newCatEnglish} onChange={(e) => setNewCatEnglish(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. Blood Donors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">আইকন (অপশনাল)</label>
                    <select
                      value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="Building2">Building</option>
                      <option value="Users">Users</option>
                      <option value="Phone">Phone</option>
                      <option value="Ambulance">Ambulance</option>
                      <option value="Store">Store</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit" disabled={requestStatus === 'submitting'}
                    className={`w-full py-3 px-4 rounded-xl text-white font-medium flex justify-center items-center transition-colors ${
                      requestStatus === 'submitting' ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {requestStatus === 'submitting' ? 'জমা দেওয়া হচ্ছে...' : 'রিকোয়েস্ট পাঠান'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">মতামত ও আইডিয়া</h2>
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5">
              {requestStatus === 'success' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">ধন্যবাদ!</h3>
                  <p className="text-gray-500">আপনার মতামত সফলভাবে আমাদের কাছে পৌঁছেছে।</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম *</label>
                    <input
                      type="text" required value={newFeedbackName} onChange={(e) => setNewFeedbackName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="আপনার নাম"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">আপনার মতামত বা আইডিয়া *</label>
                    <textarea
                      required value={newFeedbackMessage} onChange={(e) => setNewFeedbackMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                      placeholder="অ্যাপটি কীভাবে আরও ভালো করা যায়? আপনার নতুন কোনো আইডিয়া থাকলে এখানে লিখুন..."
                    />
                  </div>
                  
                  <button
                    type="submit" disabled={requestStatus === 'submitting'}
                    className={`w-full py-3 px-4 rounded-xl text-white font-medium flex justify-center items-center transition-colors ${
                      requestStatus === 'submitting' ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {requestStatus === 'submitting' ? 'জমা দেওয়া হচ্ছে...' : 'পাঠিয়ে দিন'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contributor Profile Modal */}
      {isContributorProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-emerald-600" /> {isLoginMode ? 'লগইন' : 'আমার প্রোফাইল'}
              </h2>
              <button
                onClick={() => { setIsContributorProfileOpen(false); setIsLoginMode(false); }}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5">
              {isLoginMode ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    আপনার পূর্বের ব্যবহৃত মোবাইল নাম্বারটি দিয়ে লগইন করুন। কোনো পাসওয়ার্ডের প্রয়োজন নেই।
                  </p>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নাম্বার *</label>
                      <input
                        type="tel" required value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-medium flex justify-center items-center transition-colors"
                    >
                      লগইন করুন
                    </button>
                  </form>
                  <div className="mt-4 text-center">
                    <button onClick={() => setIsLoginMode(false)} className="text-sm text-emerald-600 hover:underline">
                      নতুন প্রোফাইল তৈরি করতে চান?
                    </button>
                  </div>
                </>
              ) : contributorName && !isEditProfileMode ? (
                <>
                  <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-100">
                    <h3 className="font-semibold text-emerald-800 text-lg mb-3">আপনার ড্যাশবোর্ড</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                        <p className="text-sm text-gray-500 mb-1">এপ্রুভড নাম্বার</p>
                        <p className="text-2xl font-bold text-emerald-600">{contributorApprovedCount}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                        <p className="text-sm text-gray-500 mb-1">মোট পয়েন্ট</p>
                        <p className="text-2xl font-bold text-emerald-600">{contributorPoints}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">আমার মতামত ও আইডিয়া</h3>
                    {contributorFeedbacks.length === 0 ? (
                      <p className="text-sm text-gray-500">আপনি এখনও কোনো মতামত দেননি।</p>
                    ) : (
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {contributorFeedbacks.map(fb => (
                          <div key={fb.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-xs text-gray-500">{new Date(fb.createdAt).toLocaleDateString('bn-BD')}</p>
                              {fb.status === 'approved' ? (
                                <div className="flex gap-0.5">
                                  {[...Array(fb.rating || 1)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full font-medium">পেন্ডিং</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{fb.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsEditProfileMode(true)} className="text-sm text-emerald-600 hover:underline font-medium">
                      প্রোফাইল আপডেট করুন
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        localStorage.removeItem('contributorName');
                        localStorage.removeItem('contributorPhone');
                        localStorage.removeItem('contributorFacebook');
                        setContributorName('');
                        setContributorPhone('');
                        setContributorFacebook('');
                        setContributorPoints(0);
                        setContributorApprovedCount(0);
                        setIsContributorProfileOpen(false);
                        alert('লগআউট সফল হয়েছে');
                      }} 
                      className="text-sm text-red-600 hover:underline font-medium"
                    >
                      লগআউট করুন
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    এখানে আপনার তথ্য সেভ করে রাখলে, পরবর্তীতে নতুন কোনো নাম্বার যুক্ত করলে বারবার আপনার নাম ও নাম্বার দিতে হবে না। আপনার যুক্ত করা নাম্বার অ্যাপ্রুভ হলে আপনার অবদান পয়েন্ট বৃদ্ধি পাবে।
                  </p>
                  <form onSubmit={(e) => {
                    saveContributorProfile(e);
                    setIsEditProfileMode(false);
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম *</label>
                      <input
                        type="text" required value={contributorName} onChange={(e) => setContributorName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="আপনার নাম"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">আপনার মোবাইল নাম্বার *</label>
                      <input
                        type="tel" required value={contributorPhone} onChange={(e) => setContributorPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ফেসবুক প্রোফাইল লিংক (ঐচ্ছিক)</label>
                      <input
                        type="url" value={contributorFacebook} onChange={(e) => setContributorFacebook(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-medium flex justify-center items-center transition-colors"
                    >
                      প্রোফাইল সেভ করুন
                    </button>
                  </form>
                  <div className="mt-4 flex items-center justify-between">
                    {!contributorName && (
                      <button type="button" onClick={() => setIsLoginMode(true)} className="text-sm text-emerald-600 hover:underline">
                        আগের একাউন্ট থাকলে নাম্বার দিয়ে লগইন করুন
                      </button>
                    )}
                    {contributorName && (
                      <button type="button" onClick={() => setIsEditProfileMode(false)} className="text-sm text-gray-600 hover:underline">
                        বাতিল করুন
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {isReviewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> রেটিংস ও রিভিও</h2>
              <button
                onClick={() => setIsReviewsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {ratedFeedbacks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>এখনও কোনো রিভিও নেই।</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ratedFeedbacks.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{review.name}</h3>
                        <div className="flex gap-0.5">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString('bn-BD')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> শীর্ষ অবদানকারীগণ</h2>
              <button
                onClick={() => setIsLeaderboardOpen(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {topContributors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>এখনও কোনো অবদানকারী নেই।</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topContributors.map((user, idx) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 leading-tight">
                            {user.facebookUrl ? (
                              <a href={user.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                                {user.name}
                              </a>
                            ) : (
                              user.name
                            )}
                          </h3>
                          <p className="text-xs text-gray-500">পয়েন্ট: <span className="font-semibold text-emerald-600">{user.approvedCount}</span></p>
                        </div>
                      </div>
                      {idx < 3 && (
                        <Trophy className={`w-5 h-5 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : 'text-amber-700'}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
