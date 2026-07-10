import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc, query, where, getDoc, setDoc, increment, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { CheckCircle, XCircle, Trash2, ArrowLeft, Star, ArrowUp, ArrowDown, UserCircle, Send, Edit3, ThumbsUp, CheckCircle2, X, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from './components/ConfirmDialog';

const VerifiedBadge = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] text-[#0866FF] shrink-0 inline-block align-middle ml-1 -mt-0.5"
    title="Verified Contributor"
  >
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" />
  </svg>
);

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('adminAuth') === 'true');
  
  const [pendingContacts, setPendingContacts] = useState<any[]>([]);
  const [pendingCategories, setPendingCategories] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [replyText, setReplyText] = useState<{[key: string]: string}>({});
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState('');
  const [contributorMessageText, setContributorMessageText] = useState<{[key: string]: string}>({});
  const [expandedContributorId, setExpandedContributorId] = useState<string | null>(null);
  
  const [adminHistory, setAdminHistory] = useState<any[]>([]);
  const [publicReviews, setPublicReviews] = useState<any[]>([]);
  const [contributors, setContributors] = useState<any[]>([]);
  const [deletedPosts, setDeletedPosts] = useState<any[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});

  const confirmAction = (message: string, action: () => void) => {
    setConfirmConfig({ isOpen: true, message, action });
  };
  const [activeTab, setActiveTab] = useState<'requests' | 'feedbacks' | 'reviews' | 'contributors' | 'history' | 'recycle'>('requests');

  const isVerifiedContributor = (name: string, phone?: string) => {
    return contributors.slice(0, 5).some(c => (phone && c.phone === phone) || (!phone && c.name === name));
  };

  const logAdminAction = async (actionDesc: string) => {
    try {
      await addDoc(collection(db, 'admin_history'), {
        action: actionDesc,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const contactsQuery = query(collection(db, 'contacts'), where('status', '==', 'pending'));
      const contactsSnapshot = await getDocs(contactsQuery);
      setPendingContacts(contactsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      const categoriesQuery = query(collection(db, 'categories'), where('status', '==', 'pending'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      setPendingCategories(categoriesSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      const deletedPostsQuery = query(collection(db, 'community_posts'), where('isDeleted', '==', true));
      const deletedPostsSnapshot = await getDocs(deletedPostsQuery);
      const now = new Date();
      const validDeletedPosts: any[] = [];
      
      for (const d of deletedPostsSnapshot.docs) {
        const data = d.data();
        if (data.deletedAt) {
          const deletedDate = new Date(data.deletedAt);
          const diffDays = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 3600 * 24));
          // If older than 30 days, permanently delete it
          if (diffDays > 30) {
            await deleteDoc(d.ref);
            continue;
          }
        }
        validDeletedPosts.push({ id: d.id, ...data });
      }
      setDeletedPosts(validDeletedPosts);

      const feedbacksQuery = collection(db, 'feedback');
      const feedbacksSnapshot = await getDocs(feedbacksQuery);
      // Sort in memory or just display
      const fbList = feedbacksSnapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      fbList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setFeedbacks(fbList);

      const historyQuery = collection(db, 'admin_history');
      const historySnapshot = await getDocs(historyQuery);
      let historyList = historySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      historyList = historyList.filter(item => {
        const itemTime = new Date(item.createdAt).getTime();
        if (itemTime < thirtyDaysAgo) {
          deleteDoc(doc(db, 'admin_history', item.id)).catch(console.error);
          return false;
        }
        return true;
      });
      historyList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAdminHistory(historyList);

      const reviewsQuery = collection(db, 'public_reviews');
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const revList = reviewsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      revList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPublicReviews(revList);

      const contributorsQuery = collection(db, 'contributors');
      const contributorsSnapshot = await getDocs(contributorsQuery);
      const contList = contributorsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      contList.sort((a, b) => (b.points || 0) - (a.points || 0));
      setContributors(contList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      
      const q = query(collection(db, 'contributors'));
      const unsub = onSnapshot(q, (snapshot) => {
        const contList = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
        contList.sort((a, b) => (b.points || 0) - (a.points || 0));
        setContributors(contList);
      });
      return () => unsub();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple secret for now
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
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
      await logAdminAction(`Contact approved: ${contactData.name || 'Unknown'}`);
      
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

  const handleDeleteContact = (id: string) => {
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      const contactRef = doc(db, 'contacts', id);
      const contactSnap = await getDoc(contactRef);
      if (contactSnap.exists()) {
        const data = contactSnap.data();
        await deleteDoc(contactRef);
        await logAdminAction(`Contact deleted: ${data.name || 'Unknown'}`);
      }
      fetchData();
    });
  };


  const handleRestorePost = async (id: string) => {
    await updateDoc(doc(db, 'community_posts', id), {
      isDeleted: false,
      deletedAt: null
    });
    await logAdminAction(`Post restored (ID: ${id})`);
    fetchData();
  };
  
  const handlePermanentDeletePost = (id: string) => {
    confirmAction('পোস্টটি চিরতরে মুছে ফেলতে চান?', async () => {
      await deleteDoc(doc(db, 'community_posts', id));
      await logAdminAction(`Post permanently deleted (ID: ${id})`);
      fetchData();
    });
  };

  const handleDeletePublicReview = (id: string) => {
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      await deleteDoc(doc(db, 'public_reviews', id));
      await logAdminAction(`Public review deleted (ID: ${id})`);
      fetchData();
    });
  };

  const handleDeleteContributor = (id: string) => {
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      await deleteDoc(doc(db, 'contributors', id));
      await logAdminAction(`Contributor deleted (ID: ${id})`);
      fetchData();
    });
  };

  const handleApproveCategory = async (id: string) => {
    const catRef = doc(db, 'categories', id);
    const catSnap = await getDoc(catRef);
    await updateDoc(catRef, { status: 'approved' });
    if(catSnap.exists()) await logAdminAction(`Category approved: ${catSnap.data().title || 'Unknown'}`);
    fetchData();
  };

  const handleDeleteCategory = (id: string) => {
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      const catRef = doc(db, 'categories', id);
      const catSnap = await getDoc(catRef);
      await deleteDoc(catRef);
      if(catSnap.exists()) await logAdminAction(`Category deleted: ${catSnap.data().title || 'Unknown'}`);
      fetchData();
    });
  };

  const handleDeleteFeedback = (id: string) => {
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      const fbRef = doc(db, 'feedback', id);
      const fbSnap = await getDoc(fbRef);
      await deleteDoc(fbRef);
      if(fbSnap.exists()) await logAdminAction(`Feedback deleted from: ${fbSnap.data().name || 'Unknown'}`);
      fetchData();
    });
  };

  const handleRateFeedback = async (id: string, stars: number, contributorPhone?: string, contributorName?: string) => {
    await updateDoc(doc(db, 'feedback', id), {
      status: 'approved',
      rating: stars
    });
    
    await logAdminAction(`Feedback rated ${stars} stars for: ${contributorName || 'Unknown'}`);

    if (contributorPhone) {
      const contributorRef = doc(db, 'contributors', contributorPhone);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        await updateDoc(contributorRef, {
          points: increment(stars * 2)
        });
      } else {
        await setDoc(contributorRef, {
          name: contributorName || 'Unknown',
          phone: contributorPhone,
          facebookUrl: '',
          approvedCount: 0,
          points: stars * 2
        });
      }
    }
    fetchData();
  };

  const handleReplyFeedback = async (feedbackId: string) => {
    if (!replyText[feedbackId]?.trim()) return;
    try {
      const feedbackRef = doc(db, 'feedback', feedbackId);
      const feedbackDoc = await getDoc(feedbackRef);
      if (feedbackDoc.exists()) {
        const feedback = feedbackDoc.data();
        const newReplies = [...(feedback.replies || []), {
          id: Date.now().toString(),
          sender: 'admin',
          message: replyText[feedbackId].trim(),
          createdAt: new Date().toISOString()
        }];
        await updateDoc(feedbackRef, {
          replies: newReplies,
          hasUnreadAdminReply: false,
          hasUnreadUserReply: true
        });
        await logAdminAction(`Replied to feedback from: ${feedback.name || 'Unknown'}`);
        setReplyText(prev => ({ ...prev, [feedbackId]: '' }));
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে! আবার চেষ্টা করুন।');
    }
  };

  const handleSendMessageToContributor = async (id: string) => {
    if (!contributorMessageText[id]?.trim()) return;
    try {
      const contributorRef = doc(db, 'contributors', id);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const contributorData = contributorDoc.data();
        const newMessages = [...(contributorData.messages || []), {
          id: Date.now().toString(),
          sender: 'admin',
          message: contributorMessageText[id].trim(),
          createdAt: new Date().toISOString()
        }];
        await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadMessage: true,
          hasUnreadAdminMessage: false
        });
        await logAdminAction(`Message sent to contributor: ${contributorData.name || 'Unknown'}`);
        setContributorMessageText(prev => ({ ...prev, [id]: '' }));
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে! আবার চেষ্টা করুন।');
    }
  };

  const handleMarkContributorMessageAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'contributors', id), {
        hasUnreadAdminMessage: false
      });
      setContributors(prev => prev.map(cont => cont.id === id ? { ...cont, hasUnreadAdminMessage: false } : cont));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPassword = async (id: string) => {
    const newPassword = prompt('নতুন পাসওয়ার্ড দিন (ব্যবহারকারীকে এই পাসওয়ার্ডটি ম্যাসেজের মাধ্যমে পাঠানো হবে):');
    if (newPassword) {
      try {
        const contributorRef = doc(db, 'contributors', id);
        const contributorDoc = await getDoc(contributorRef);
        if (contributorDoc.exists()) {
          const contributorData = contributorDoc.data();
          const newMessages = [...(contributorData.messages || []), {
            id: Date.now().toString(),
            sender: 'admin',
            message: `আপনার পাসওয়ার্ড রিকোভারি রিকোয়েস্ট গ্রহণ করা হয়েছে। আপনার নতুন পাসওয়ার্ড: ${newPassword}`,
            createdAt: new Date().toISOString()
          }];
          await updateDoc(contributorRef, {
            password: newPassword,
            passwordResetRequested: false,
            messages: newMessages,
            hasUnreadMessage: true
          });
          await logAdminAction(`Password reset for contributor: ${contributorData.name || 'Unknown'}`);
          alert('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে এবং ব্যবহারকারীকে ম্যাসেজ পাঠানো হয়েছে।');
          fetchData();
        }
      } catch (err) {
        console.error(err);
        alert('ত্রুটি হয়েছে!');
      }
    }
  };

  const handleEditReplyAdmin = async (feedbackId: string, replyId: string) => {
    if (!editReplyText.trim()) return;
    try {
      const feedbackRef = doc(db, 'feedback', feedbackId);
      const feedbackDoc = await getDoc(feedbackRef);
      if (feedbackDoc.exists()) {
        const feedback = feedbackDoc.data();
        const updatedReplies = (feedback.replies || []).map((reply: any) => 
          reply.id === replyId ? { ...reply, message: editReplyText.trim(), edited: true } : reply
        );
        await updateDoc(feedbackRef, {
          replies: updatedReplies
        });
        setFeedbacks(prev => prev.map(fb => fb.id === feedbackId ? { ...fb, replies: updatedReplies } : fb));
        setEditingReplyId(null);
        setEditReplyText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeReplyAdmin = async (feedbackId: string, replyId: string) => {
    try {
      const feedbackRef = doc(db, 'feedback', feedbackId);
      const feedbackDoc = await getDoc(feedbackRef);
      if (feedbackDoc.exists()) {
        const feedback = feedbackDoc.data();
        const updatedReplies = (feedback.replies || []).map((reply: any) => {
          if (reply.id === replyId) {
            const likes = reply.likes || [];
            if (likes.includes('admin')) {
                return { ...reply, likes: likes.filter((id: string) => id !== 'admin') };
            } else {
                return { ...reply, likes: [...likes, 'admin'] };
            }
          }
          return reply;
        });
        await updateDoc(feedbackRef, {
          replies: updatedReplies
        });
        setFeedbacks(prev => prev.map(fb => fb.id === feedbackId ? { ...fb, replies: updatedReplies } : fb));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkFeedbackAsReadAdmin = async (feedbackId: string) => {
    try {
      await updateDoc(doc(db, 'feedback', feedbackId), {
        hasUnreadAdminReply: false
      });
      setFeedbacks(prev => prev.map(fb => fb.id === feedbackId ? { ...fb, hasUnreadAdminReply: false } : fb));
    } catch (err) {
      console.error(err);
    }
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
        <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem('adminAuth'); }} className="text-sm bg-emerald-700 px-3 py-1 rounded hover:bg-emerald-600">লগআউট</button>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-6">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide border-b">
          <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'requests' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            অপেক্ষমান রিকোয়েস্ট ({pendingContacts.length + pendingCategories.length})
          </button>
          <button onClick={() => setActiveTab('feedbacks')} className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'feedbacks' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            মতামত ({feedbacks.length})
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            রিভিউ ({publicReviews.length})
          </button>
          <button onClick={() => setActiveTab('contributors')} className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'contributors' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            অবদানকারী
          </button>
          <button onClick={() => setActiveTab('history')} className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'history' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            অ্যাডমিন হিস্ট্রি
          </button>
          <button onClick={() => setActiveTab('recycle')} className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'recycle' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            রিসাইকেল বিন ({deletedPosts.length})
          </button>
        </div>

        
        <ConfirmDialog 
          isOpen={confirmConfig.isOpen} 
          message={confirmConfig.message} 
          onConfirm={() => { confirmConfig.action(); setConfirmConfig({...confirmConfig, isOpen: false}); }} 
          onCancel={() => setConfirmConfig({...confirmConfig, isOpen: false})} 
        />
        <div className="space-y-8">
        
        {/* Pending Categories */}
        {activeTab === 'requests' && (
          <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">অপেক্ষমান ক্যাটাগরি (মেনু) - {pendingCategories.length}</h2>
          {pendingCategories.length === 0 ? <p className="text-gray-500">কোনো অপেক্ষমান ক্যাটাগরি নেই।</p> : (
            <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 pb-2">
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
        )}

        {/* Pending Contacts */}
        {activeTab === 'requests' && (
          <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">অপেক্ষমান নাম্বার - {pendingContacts.length}</h2>
          {pendingContacts.length === 0 ? <p className="text-gray-500">কোনো অপেক্ষমান নাম্বার নেই।</p> : (
            <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 pb-2">
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
                    {contact.contributorName && (
                      <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs">
                        <p className="text-gray-500 font-medium mb-1">প্রেরক:</p>
                        <p className="text-gray-800">{contact.contributorName} ({contact.contributorPhone})</p>
                        {contact.contributorFacebook && (
                          <a href={contact.contributorFacebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>
                        )}
                      </div>
                    )}
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
        )}

        {/* Feedbacks */}
        {activeTab === 'feedbacks' && (
          <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">মতামত ও আইডিয়া - {feedbacks.length}</h2>
          {feedbacks.length === 0 ? <p className="text-gray-500">কোনো মতামত নেই।</p> : (
            <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 pb-2">
              {feedbacks.map(feedback => (
                <div key={feedback.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <span className="flex items-center">
                          {feedback.name}
                          {isVerifiedContributor(feedback.name, feedback.contributorPhone) && <VerifiedBadge />}
                        </span>
                        {feedback.hasUnreadAdminReply && (
                          <span className="flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                          </span>
                        )}
                      </h3>
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
                          onClick={() => handleRateFeedback(feedback.id, star, feedback.contributorPhone, feedback.name)}
                          className="text-gray-300 hover:text-yellow-500 transition-colors"
                          title={`${star} Star${star > 1 ? 's' : ''}`}
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600 mr-2">রেটিং পরিবর্তন করুন:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRateFeedback(feedback.id, star, feedback.contributorPhone, feedback.name)}
                          className={`${star <= feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                          title={`${star} Star${star > 1 ? 's' : ''}`}
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Replies Section */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {feedback.replies && feedback.replies.length > 0 && (
                      <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-2">
                        {feedback.replies.map((reply: any) => {
                          const isLiked = reply.likes?.includes('admin');
                          return (
                          <div key={reply.id} className={`p-2 rounded-lg text-sm ${reply.sender === 'admin' ? 'bg-emerald-50 ml-6' : 'bg-gray-50 mr-6'}`}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-xs text-gray-700">{reply.sender === 'admin' ? 'অ্যাডমিন' : feedback.name}</span>
                              <div className="flex items-center gap-2">
                                {reply.edited && <span className="text-[9px] text-gray-400 italic">edited</span>}
                                <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleString('bn-BD')}</span>
                              </div>
                            </div>
                            {editingReplyId === reply.id ? (
                              <div className="mt-1 flex gap-1">
                                <input
                                  type="text"
                                  value={editReplyText}
                                  onChange={(e) => setEditReplyText(e.target.value)}
                                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleEditReplyAdmin(feedback.id, reply.id);
                                  }}
                                />
                                <button onClick={() => handleEditReplyAdmin(feedback.id, reply.id)} className="text-emerald-600 hover:text-emerald-700">
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditingReplyId(null)} className="text-gray-400 hover:text-red-500">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <p className="text-gray-800">{reply.message}</p>
                                <div className="flex justify-end gap-2 mt-1">
                                  <button 
                                    onClick={() => handleLikeReplyAdmin(feedback.id, reply.id)}
                                    className={`flex items-center gap-1 text-[10px] ${isLiked ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-500'}`}
                                  >
                                    <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-emerald-600' : ''}`} />
                                    {reply.likes?.length > 0 && <span>{reply.likes.length}</span>}
                                  </button>
                                  {reply.sender === 'admin' && (
                                    <button 
                                      onClick={() => {
                                        setEditingReplyId(reply.id);
                                        setEditReplyText(reply.message);
                                      }}
                                      className="text-gray-400 hover:text-blue-500"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )})}
                      </div>
                    )}
                    
                    <div className="flex gap-2 relative">
                      <input
                        type="text"
                        value={replyText[feedback.id] || ''}
                        onClick={() => {
                          if (feedback.hasUnreadAdminReply) {
                            handleMarkFeedbackAsReadAdmin(feedback.id);
                          }
                        }}
                        onChange={(e) => setReplyText({ ...replyText, [feedback.id]: e.target.value })}
                        placeholder="রিপ্লাই লিখুন..."
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleReplyFeedback(feedback.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleReplyFeedback(feedback.id)}
                        disabled={!replyText[feedback.id]?.trim()}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      {feedback.hasUnreadAdminReply && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
        )}

        {/* Recycle Bin */}
        {activeTab === 'recycle' && (
          <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">রিসাইকেল বিন (মুছে ফেলা পোস্টসমূহ) - {deletedPosts.length}</h2>
          {deletedPosts.length === 0 ? <p className="text-gray-500">রিসাইকেল বিনে কোনো পোস্ট নেই।</p> : (
            <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 pb-2">
              {deletedPosts.map(post => (
                <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{post.authorName}</p>
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{post.text}</p>
                    <p className="text-xs text-gray-400 mt-2">মুছে ফেলা হয়েছে: {new Date(post.deletedAt).toLocaleString('bn-BD')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleRestorePost(post.id)}
                      className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-200"
                    >
                      রিস্টোর
                    </button>
                    <button 
                      onClick={() => handlePermanentDeletePost(post.id)}
                      className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200"
                    >
                      ডিলিট
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        )}

        {/* Admin History */}
        {activeTab === 'history' && (
          <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">অ্যাডমিন হিস্ট্রি (গত ৩০ দিন)</h2>
          {adminHistory.length === 0 ? <p className="text-gray-500">কোনো হিস্ট্রি নেই।</p> : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                {adminHistory.map(item => (
                  <div key={item.id} className="flex justify-between items-start border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <p className="text-sm font-medium text-gray-800">{item.action}</p>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">{new Date(item.createdAt).toLocaleString('bn-BD')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        )}{/* Public Reviews */}
        {activeTab === 'reviews' && (
          <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">পাবলিক রিভিও সমূহ - {publicReviews.length}</h2>
          {publicReviews.length === 0 ? <p className="text-gray-500">কোনো রিভিও নেই।</p> : (
            <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 pb-2">
              {publicReviews.map(review => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{review.name}</h3>
                      <div className="flex gap-0.5 mb-1">
                        {[...Array(review.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{review.message}</p>
                    </div>
                    <button onClick={() => handleDeletePublicReview(review.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex-shrink-0" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        )}

        {/* Contributors */}
        {activeTab === 'contributors' && (
          <section>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">অবদানকারীগণ (Contributors) - {contributors.length}</h2>
          {contributors.length === 0 ? <p className="text-gray-500">কোনো অবদানকারী নেই।</p> : (
            <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 pb-2">
              {contributors.map(cont => (
                <div key={cont.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        {cont.avatar ? (
                          <img src={cont.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-emerald-200" />
                        ) : (
                          <UserCircle className="w-6 h-6 text-emerald-600" />
                        )}
                        <span className="flex items-center">
                          {cont.name}
                          {isVerifiedContributor(cont.name, cont.phone) && <VerifiedBadge />}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600">{cont.phone}</p>
                      <div className="flex gap-4 mt-1 text-sm font-medium text-gray-700">
                        <span>Points: <span className="text-emerald-600">{cont.points || 0}</span></span>
                        <span>Approved: <span className="text-blue-600">{cont.approvedCount || 0}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setExpandedContributorId(expandedContributorId === cont.id ? null : cont.id);
                          if (cont.hasUnreadAdminMessage) {
                            handleMarkContributorMessageAsRead(cont.id);
                          }
                        }} 
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 relative" 
                        title="Messages"
                      >
                        <Send className="w-5 h-5" />
                        {cont.hasUnreadAdminMessage && (
                          <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                          </span>
                        )}
                      </button>
                      <button 
                        onClick={() => handleResetPassword(cont.id)} 
                        className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 relative" 
                        title="Reset Password"
                      >
                        <Key className="w-5 h-5" />
                        {cont.passwordResetRequested && (
                          <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                          </span>
                        )}
                      </button>
                      <button onClick={() => handleDeleteContributor(cont.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {expandedContributorId === cont.id && (
                    <div className="mt-2 pt-3 border-t border-gray-100">
                      {cont.messages && cont.messages.length > 0 ? (
                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-2">
                          {cont.messages.map((msg: any) => (
                            <div key={msg.id} className={`p-2 rounded-lg text-sm ${msg.sender === 'admin' ? 'bg-emerald-50 ml-6' : 'bg-gray-50 mr-6'}`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-[11px] text-gray-700">{msg.sender === 'admin' ? 'অ্যাডমিন' : cont.name}</span>
                                <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString('bn-BD')}</span>
                              </div>
                              <p className="text-gray-800 text-xs">{msg.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 mb-2">কোনো ম্যাসেজ নেই।</p>
                      )}
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={contributorMessageText[cont.id] || ''}
                          onChange={(e) => setContributorMessageText({ ...contributorMessageText, [cont.id]: e.target.value })}
                          placeholder="ম্যাসেজ লিখুন..."
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessageToContributor(cont.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleSendMessageToContributor(cont.id)}
                          disabled={!contributorMessageText[cont.id]?.trim()}
                          className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        )}        </div>
      </main>
    </div>
  );
}
