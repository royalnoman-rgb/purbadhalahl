/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Flame, Ambulance, Zap, Droplets, Users, Building2, Phone, ArrowLeft, Search, UserPlus, X, CheckCircle2,
  Bus, Stethoscope, Wrench, GraduationCap, Store, Landmark, Newspaper, Plus, Edit3, Navigation, Lock, MessageCircle, Award, Trophy, UserCircle, Star, ThumbsUp, Send, Bell, BadgeCheck, Heart, Trash2
} from 'lucide-react';
import { categories as staticCategories, contacts as staticContacts } from './data';
import { Category } from './types';
import { collection, addDoc, getDocs, query, where, onSnapshot, orderBy, limit, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

import MapTracker from './MapTracker';
import Community from './Community';
import UserProfileModal from './UserProfileModal';
import { ConfirmDialog } from './components/ConfirmDialog';

// Map icon strings to actual React components from lucide-react
const iconMap: Record<string, React.ElementType> = {
  Shield, Flame, Ambulance, Zap, Droplets, Users, Building2, Bus, Stethoscope, Wrench, GraduationCap, Store, Landmark, Newspaper,
};

const VerifiedBadge = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (badgeRef.current && !badgeRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="relative inline-block align-middle ml-1 -mt-0.5" ref={badgeRef}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[16px] h-[16px] shrink-0 cursor-pointer"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTooltip(!showTooltip); }}
      >
        <path d="M22.5 12.536V11.464L20.892 9.114L21.214 6.273L18.441 5.437L16.51 3.239L13.8 4.029L12 2.25L10.2 4.029L7.49 3.239L5.559 5.437L2.786 6.273L3.108 9.114L1.5 11.464V12.536L3.108 14.886L2.786 17.727L5.559 18.563L7.49 20.761L10.2 19.971L12 21.75L13.8 19.971L16.51 20.761L18.441 18.563L21.214 17.727L20.892 14.886L22.5 12.536Z" fill="#0866FF"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M16.53 8.47a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.97 1.97 4.97-4.97a.75.75 0 0 1 1.06 0z" fill="white"/>
      </svg>
      {showTooltip && (
        <div 
          className="absolute z-50 w-56 p-3 mt-2 -ml-28 text-[11px] font-normal leading-relaxed text-left text-gray-800 bg-white border border-gray-100 rounded-lg shadow-xl left-1/2 top-full"
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          This verified badge indicates that the user's identity has been verified and they are a trusted contributor to our platform.
          <div className="absolute w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45 -top-[7px] left-1/2 -ml-[6px]"></div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('adminAuth') === 'true');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedUserProfile, setSelectedUserProfile] = useState<string | null>(null);
  
  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  
  const [requestStatus, setRequestStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Dynamic Data
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const prevNotifCount = useRef(0);
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const [dynamicContacts, setDynamicContacts] = useState<any[]>([]);
  const [publicReviews, setPublicReviews] = useState<any[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});

  const confirmAction = (message: string, action: () => void) => {
    setConfirmConfig({ isOpen: true, message, action });
  };

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
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCatIcon, setNewCatIcon] = useState('Building2');
  const [newCatColor, setNewCatColor] = useState('bg-emerald-600 text-emerald-50');

  // Form states - Feedback
  const [newFeedbackName, setNewFeedbackName] = useState('');
  const [newFeedbackMessage, setNewFeedbackMessage] = useState('');

  // Form states - Public Review
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewMessage, setNewReviewMessage] = useState('');
  const [reviewSubmitStatus, setReviewSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Contributor Modals and State
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isContributorProfileOpen, setIsContributorProfileOpen] = useState(false);
  const [contributorName, setContributorName] = useState('');
  const [contributorPhone, setContributorPhone] = useState('');
  const [contributorFacebook, setContributorFacebook] = useState('');
  const [contributorAvatar, setContributorAvatar] = useState('');
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isResetPasswordMode, setIsResetPasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [contributorPassword, setContributorPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(localStorage.getItem('hasPassword') === 'true');
  const [contributorPoints, setContributorPoints] = useState(0);
  const [contributorApprovedCount, setContributorApprovedCount] = useState(0);
  const [contributorFeedbacks, setContributorFeedbacks] = useState<any[]>([]);
  const [contributorContacts, setContributorContacts] = useState<any[]>([]);
  const [contributorMessages, setContributorMessages] = useState<any[]>([]);
  const [userMessages, setUserMessages] = useState<any[]>([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [userMessageText, setUserMessageText] = useState('');
  const [feedbackReplyText, setFeedbackReplyText] = useState<{[key: string]: string}>({});
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState('');
  const [isEditProfileMode, setIsEditProfileMode] = useState(!localStorage.getItem('contributorName'));
  const [activeUserTab, setActiveUserTab] = useState<'stats' | 'contacts' | 'feedbacks' | 'messages'>('stats');

    useEffect(() => {
    if (activeUserTab === 'messages' && contributorPhone) {
      const markAsRead = async () => {
        const unreadMsgs = userMessages.filter(msg => msg.receiverPhone === contributorPhone && !msg.read);
        for (const msg of unreadMsgs) {
          try {
            await updateDoc(doc(db, 'user_messages', msg.id), { read: true });
          } catch(e) {}
        }
      };
      markAsRead();
    }
  }, [activeUserTab, userMessages, contributorPhone]);

  // Presence setup
  useEffect(() => {
    const updatePresence = async () => {
      try {
        if (isAdmin) {
          await setDoc(doc(db, 'contributors', 'admin'), {
            lastActive: Date.now()
          }, { merge: true });
        }
        if (contributorPhone) {
          await updateDoc(doc(db, 'contributors', contributorPhone), {
            lastActive: Date.now()
          });
        }
      } catch (e) {}
    };
    if (contributorPhone || isAdmin) {
      updatePresence();
      const interval = setInterval(updatePresence, 3 * 60 * 1000);
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') updatePresence();
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [contributorPhone, isAdmin]);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const threshold = Date.now() - 5 * 60 * 1000;
        const q = query(collection(db, 'contributors'), where('lastActive', '>', threshold));
        const snapshot = await getDocs(q);
        setOnlineUsers(snapshot.docs.map(d => d.id));
      } catch(e) {}
    };
    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem('contributorName');
    const savedPhone = localStorage.getItem('contributorPhone');
    const savedFb = localStorage.getItem('contributorFacebook');
    const savedAvatar = localStorage.getItem('contributorAvatar');
    if (savedName) setContributorName(savedName);
    if (savedPhone) setContributorPhone(savedPhone);
    if (savedFb) setContributorFacebook(savedFb);
    if (savedAvatar) setContributorAvatar(savedAvatar);
  }, []);

  useEffect(() => {
    // Request notification permission on load
    if ("Notification" in window && Notification.permission !== "denied" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const playNotificationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));
  };

  const showBrowserNotification = (title, body) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: '/logo.png' });
    }
  };

  useEffect(() => {
    if (!contributorPhone && !isAdmin) return;
    const receiverId = isAdmin ? 'admin' : contributorPhone;
    const qNotif = query(collection(db, 'notifications'), where('receiverPhone', '==', receiverId));
    
    const unsubNotif = onSnapshot(qNotif, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(notifs);
      
      const unreadCount = notifs.filter(n => !n.read).length;
      if (unreadCount > prevNotifCount.current) {
        // new notification arrived
        playNotificationSound();
        const newest = notifs.find(n => !n.read);
        if (newest) {
          showBrowserNotification(newest.title, newest.body);
        }
      }
      prevNotifCount.current = unreadCount;
    });
    return () => unsubNotif();
  }, [contributorPhone, isAdmin]);

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

    // Fetch public reviews
    const qReview = query(collection(db, 'public_reviews'), orderBy('createdAt', 'desc'));
    const unsubReview = onSnapshot(qReview, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPublicReviews(revs);
    });

    // Fetch top 10 contributors for verified badges and leaderboard globally
    const qTopContributors = query(collection(db, 'contributors'), orderBy('points', 'desc'), limit(20));
    const unsubTopContributors = onSnapshot(qTopContributors, (snapshot) => {
      const contributors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      const activeContributors = contributors.filter(c => c.points > 0 || c.approvedCount > 0);
      setTopContributors(activeContributors.slice(0, 10));
    });

    return () => {
      unsubCat();
      unsubContact();
      unsubReview();
      unsubTopContributors();
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
  }).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

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
      // Check for duplicates in static contacts
      const isStaticDuplicate = staticContacts.some(c => 
        (c.phone === newPhone || c.name.toLowerCase() === newName.toLowerCase()) && 
        (!editingContactId || c.id !== editingContactId)
      );
      if (isStaticDuplicate) {
        alert('এই নাম বা নাম্বারটি ইতিমধ্যে যুক্ত করা আছে!');
        setRequestStatus('idle');
        return;
      }

      // Check for duplicates in firestore
      const qPhone = query(collection(db, 'contacts'), where('phone', '==', newPhone));
      const phoneSnapshot = await getDocs(qPhone);
      if (!phoneSnapshot.empty) {
        const isOnlySelf = phoneSnapshot.docs.every(d => d.id === editingContactId || d.data().replacesId === editingContactId);
        if (!isOnlySelf) {
          alert('এই নাম্বারটি ইতিমধ্যে যুক্ত করা আছে!');
          setRequestStatus('idle');
          return;
        }
      }

      const qName = query(collection(db, 'contacts'), where('name', '==', newName));
      const nameSnapshot = await getDocs(qName);
      if (!nameSnapshot.empty) {
        const isOnlySelf = nameSnapshot.docs.every(d => d.id === editingContactId || d.data().replacesId === editingContactId);
        if (!isOnlySelf) {
          alert('এই নামটি ইতিমধ্যে যুক্ত করা আছে!');
          setRequestStatus('idle');
          return;
        }
      }

      const payload: any = {
        name: newName,
        phone: newPhone,
        details: newDetails,
        subDetails: newSubDetails,
        categoryId: newCategory,
        status: isAdmin ? 'approved' : 'pending',
        contributorName: contributorName || null,
        contributorPhone: contributorPhone || null,
        contributorFacebook: contributorFacebook || null,
      };
      
      if (editingContactId) {
        if (isAdmin) {
          // If admin, direct update
          await updateDoc(doc(db, 'contacts', editingContactId), {
            name: newName,
            phone: newPhone,
            details: newDetails,
            subDetails: newSubDetails,
            categoryId: newCategory,
          });
        } else {
          payload.replacesId = editingContactId;
          await addDoc(collection(db, 'contacts'), payload);
        }
      } else {
        await addDoc(collection(db, 'contacts'), payload);
      }
      
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

  const openEditCategoryModal = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    setNewCatTitle(category.title);
    setNewCatEnglish(category.englishTitle || '');
    setNewCatIcon(category.iconName || 'Building2');
    setNewCatColor(category.color || 'bg-emerald-600 text-emerald-50');
    setEditingCategoryId(category.id);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      if (editingCategoryId) {
        await updateDoc(doc(db, 'categories', editingCategoryId), {
          title: newCatTitle,
          englishTitle: newCatEnglish,
          iconName: newCatIcon,
          color: newCatColor,
        });
      } else {
        await addDoc(collection(db, 'categories'), {
          title: newCatTitle,
          englishTitle: newCatEnglish,
          iconName: newCatIcon,
          color: newCatColor,
          status: isAdmin ? 'approved' : 'pending'
        });

        if (!isAdmin) {
          await addDoc(collection(db, 'notifications'), {
            receiverPhone: 'admin',
            type: 'category_request',
            title: 'নতুন ক্যাটাগরি রিকোয়েস্ট',
            body: `${newCatTitle} - ${newCatEnglish}`,
            read: false,
            createdAt: new Date().toISOString(),
            link: 'requests'
          });
        }
      }
      
      setRequestStatus('success');
      setTimeout(() => {
        setIsCategoryModalOpen(false);
        setRequestStatus('idle');
        setNewCatTitle('');
        setNewCatEnglish('');
        setNewCatIcon('Building2');
        setEditingCategoryId(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে! আবার চেষ্টা করুন।');
      setRequestStatus('idle');
    }
  };

  const handleFeedbackReplyUser = async (feedbackId: string) => {
    if (!feedbackReplyText[feedbackId]?.trim()) return;
    try {
      const feedbackRef = doc(db, 'feedback', feedbackId);
      const feedbackDoc = await getDoc(feedbackRef);
      if (feedbackDoc.exists()) {
        const feedback = feedbackDoc.data();
        const newReplies = [...(feedback.replies || []), {
          id: Date.now().toString(),
          sender: 'user',
          message: feedbackReplyText[feedbackId].trim(),
          createdAt: new Date().toISOString()
        }];
        await updateDoc(feedbackRef, {
          replies: newReplies,
          hasUnreadAdminReply: true,
          hasUnreadUserReply: false
        });
        setFeedbackReplyText(prev => ({ ...prev, [feedbackId]: '' }));
        // Update local state so it reflects instantly if no onSnapshot is used for user dashboard
        setContributorFeedbacks(prev => prev.map(fb => fb.id === feedbackId ? { ...fb, replies: newReplies, hasUnreadUserReply: false } : fb));
      }
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে! আবার চেষ্টা করুন।');
    }
  };

  const handleEditReplyUser = async (feedbackId: string, replyId: string) => {
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
        setContributorFeedbacks(prev => prev.map(fb => fb.id === feedbackId ? { ...fb, replies: updatedReplies } : fb));
        setEditingReplyId(null);
        setEditReplyText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeReplyUser = async (feedbackId: string, replyId: string) => {
    try {
      const feedbackRef = doc(db, 'feedback', feedbackId);
      const feedbackDoc = await getDoc(feedbackRef);
      if (feedbackDoc.exists()) {
        const feedback = feedbackDoc.data();
        const updatedReplies = (feedback.replies || []).map((reply: any) => {
          if (reply.id === replyId) {
            const likes = reply.likes || [];
            const userIdentifier = contributorPhone || 'anonymous';
            if (likes.includes(userIdentifier)) {
                return { ...reply, likes: likes.filter((id: string) => id !== userIdentifier) };
            } else {
                return { ...reply, likes: [...likes, userIdentifier] };
            }
          }
          return reply;
        });
        await updateDoc(feedbackRef, {
          replies: updatedReplies
        });
        setContributorFeedbacks(prev => prev.map(fb => fb.id === feedbackId ? { ...fb, replies: updatedReplies } : fb));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkFeedbackAsRead = async (feedbackId: string) => {
    try {
      await updateDoc(doc(db, 'feedback', feedbackId), {
        hasUnreadUserReply: false
      });
      setContributorFeedbacks(prev => prev.map(fb => fb.id === feedbackId ? { ...fb, hasUnreadUserReply: false } : fb));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkMessagesAsRead = async () => {
    if (!contributorPhone || !hasUnreadMessages) return;
    try {
      await updateDoc(doc(db, 'contributors', contributorPhone), {
        hasUnreadMessage: false
      });
      setHasUnreadMessages(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContributorMessage = async (msgId: string, deleteForEveryone: boolean) => {
    try {
      const contributorRef = doc(db, 'contributors', contributorPhone);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const data = contributorDoc.data();
        const messages = data.messages || [];
        const updatedMessages = messages.map((msg: any) => {
          if (msg.id === msgId) {
            if (deleteForEveryone) {
              return { ...msg, deletedForEveryone: true };
            } else {
              return { ...msg, deletedFor: [...(msg.deletedFor || []), 'user'] };
            }
          }
          return msg;
        });
        await updateDoc(contributorRef, { messages: updatedMessages });
        setContributorMessages(updatedMessages);
      }
    } catch(e) {
      console.error(e);
      alert('ম্যাসেজ ডিলেট করতে সমস্যা হয়েছে।');
    }
  };

  const handleSendUserMessage = async () => {
    if (!contributorPhone || !userMessageText.trim()) return;
    try {
      const contributorRef = doc(db, 'contributors', contributorPhone);
      const contributorDoc = await getDoc(contributorRef);
      if (contributorDoc.exists()) {
        const contributorData = contributorDoc.data();
        const newMessage = {
          id: Date.now().toString(),
          sender: 'user',
          message: userMessageText.trim(),
          createdAt: new Date().toISOString()
        };
        const newMessages = [...(contributorData.messages || []), newMessage];
        await updateDoc(contributorRef, {
          messages: newMessages,
          hasUnreadAdminMessage: true
        });

        // Notify admin
        await addDoc(collection(db, 'notifications'), {
          receiverPhone: 'admin',
          type: 'user_message',
          title: `${contributorName} থেকে ম্যাসেজ`,
          body: userMessageText.trim(),
          read: false,
          createdAt: new Date().toISOString(),
          link: 'messages'
        });
        setContributorMessages(newMessages);
        setUserMessageText('');
      }
    } catch (err) {
      console.error(err);
      alert('ম্যাসেজ পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };


  const handleDeleteCategoryApp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (err) {
        console.error(err);
      }
    });
  };


  const handleUpdatePointsApp = async (id: string, currentPoints: number) => {
    const newPoints = prompt('নতুন পয়েন্ট দিন:', currentPoints.toString());
    if (newPoints !== null && !isNaN(Number(newPoints))) {
      try {
        await updateDoc(doc(db, 'contributors', id), { points: Number(newPoints) });
        alert('পয়েন্ট আপডেট হয়েছে');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleBanContributorApp = async (id: string, isCurrentlyBanned: boolean) => {
    try {
      await updateDoc(doc(db, 'contributors', id), { isBanned: !isCurrentlyBanned });
      alert(isCurrentlyBanned ? 'ব্যান তুলে নেওয়া হয়েছে' : 'ইউজার ব্যান করা হয়েছে');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteContactApp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confirmAction('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?', async () => {
      try {
        await deleteDoc(doc(db, 'contacts', id));
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      await addDoc(collection(db, 'feedback'), {
        name: contributorName || newFeedbackName,
        message: newFeedbackMessage,
        createdAt: new Date().toISOString(),
        contributorPhone: contributorPhone || null,
        status: 'pending'
      });

      // Notify admin
      await addDoc(collection(db, 'notifications'), {
        receiverPhone: 'admin',
        type: 'feedback',
        title: 'নতুন মতামত/আইডিয়া',
        body: `${contributorName || newFeedbackName}: ${newFeedbackMessage}`,
        read: false,
        createdAt: new Date().toISOString(),
        link: 'feedbacks'
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitStatus('submitting');
    
    try {
      await addDoc(collection(db, 'public_reviews'), {
        name: contributorName || newReviewName,
        rating: newReviewRating,
        message: newReviewMessage,
        createdAt: new Date().toISOString(),
        likes: 0,
        authorPhone: contributorPhone || '',
        authorAvatar: contributorAvatar || ''
      });

      // Notify admin
      await addDoc(collection(db, 'notifications'), {
        receiverPhone: 'admin',
        type: 'review',
        title: 'নতুন পাবলিক রিভিউ',
        body: `${contributorName || newReviewName} ${newReviewRating} রেটিং দিয়েছেন`,
        read: false,
        createdAt: new Date().toISOString(),
        link: 'reviews'
      });
      
      setReviewSubmitStatus('success');
      setTimeout(() => {
        setIsWritingReview(false);
        setReviewSubmitStatus('idle');
        setNewReviewName('');
        setNewReviewMessage('');
        setNewReviewRating(5);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে! আবার চেষ্টা করুন।');
      setReviewSubmitStatus('idle');
    }
  };

  const getUserId = () => {
    if (contributorPhone) return contributorPhone;
    let did = localStorage.getItem('deviceId');
    if (!did) {
      did = 'anon_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', did);
    }
    return did;
  };

  const handleReviewReaction = async (review: any, reactionType: 'like' | 'love') => {
    if (contributorPhone && review.authorPhone === contributorPhone) {
      alert('আপনি নিজের রিভিওটিতে রিয়েক্ট দিতে পারবেন না।');
      return;
    }
    const userId = getUserId();
    try {
      const reviewRef = doc(db, 'public_reviews', review.id);
      const reviewDoc = await getDoc(reviewRef);
      if (!reviewDoc.exists()) return;
      const data = reviewDoc.data();
      let likesArray = data.likesArray || [];
      let lovesArray = data.lovesArray || [];
      
      const hasLiked = likesArray.includes(userId);
      const hasLoved = lovesArray.includes(userId);
      
      if (reactionType === 'like') {
        if (hasLiked) {
          likesArray = likesArray.filter((id) => id !== userId);
        } else {
          likesArray.push(userId);
          lovesArray = lovesArray.filter((id) => id !== userId);
        }
      } else if (reactionType === 'love') {
        if (hasLoved) {
          lovesArray = lovesArray.filter((id) => id !== userId);
        } else {
          lovesArray.push(userId);
          likesArray = likesArray.filter((id) => id !== userId);
        }
      }
      await updateDoc(reviewRef, { likesArray, lovesArray, likes: likesArray.length + lovesArray.length });
    } catch (err) {
      console.error("Error reacting to review", err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const q = query(collection(db, 'contributors'), orderBy('points', 'desc'), limit(20));
      const snapshot = await getDocs(q);
      const contributors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      // Filter out those with 0 points and 0 approved count
      const activeContributors = contributors.filter(c => c.points > 0 || c.approvedCount > 0);
      setTopContributors(activeContributors.slice(0, 10));
    } catch (err) {
      console.error("Error fetching leaderboard", err);
    }
  };

  useEffect(() => {
    if (isLeaderboardOpen) {
      fetchLeaderboard();
    }
  }, [isLeaderboardOpen]);

  const isVerifiedContributor = (name: string) => {
    return topContributors.slice(0, 5).some(c => c.name === name);
  };

  const fetchContributorStats = async () => {
    if (contributorPhone) {
      try {
        const docRef = doc(db, 'contributors', contributorPhone);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContributorPoints(data.points || (data.approvedCount || 0) * 10);
          setContributorApprovedCount(data.approvedCount || 0);
          setContributorMessages(data.messages || []);
          setHasUnreadMessages(data.hasUnreadMessage || false);
          setHasPassword(!!data.password);
          if (data.password) localStorage.setItem('hasPassword', 'true');
          else localStorage.removeItem('hasPassword');
        }

        const feedbackQuery = query(collection(db, 'feedback'), where('contributorPhone', '==', contributorPhone));
        const feedbackSnap = await getDocs(feedbackQuery);
        setContributorFeedbacks(feedbackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const contactsQuery = query(collection(db, 'contacts'), where('contributorPhone', '==', contributorPhone));
        const contactsSnap = await getDocs(contactsQuery);
        setContributorContacts(contactsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    }
  };

  useEffect(() => {
    let unsubContributor: any = null;
    let unsubUserMessages: any = null;
    if (isContributorProfileOpen && contributorPhone) {
      fetchContributorStats();
      
      const docRef = doc(db, 'contributors', contributorPhone);
      unsubContributor = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContributorPoints(data.points || (data.approvedCount || 0) * 10);
          setContributorApprovedCount(data.approvedCount || 0);
          setContributorMessages(data.messages || []);
          setHasUnreadMessages(data.hasUnreadMessage || false);
          setHasPassword(!!data.password);
          if (data.password) localStorage.setItem('hasPassword', 'true');
          else localStorage.removeItem('hasPassword');
        }
      });

      const receivedMessagesQuery = query(collection(db, 'user_messages'), where('receiverPhone', '==', contributorPhone));
      const sentMessagesQuery = query(collection(db, 'user_messages'), where('senderPhone', '==', contributorPhone));
      
      let receivedMsgs: any[] = [];
      let sentMsgs: any[] = [];

      const updateUnifiedMessages = () => {
         const all = [...receivedMsgs, ...sentMsgs].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
         const filtered = all.filter(msg => {
            if (msg.deletedForEveryone) return false;
            if (msg.deletedFor?.includes(contributorPhone)) return false;
            return true;
         });
         filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
         setUserMessages(filtered);
      };

      unsubUserMessages = onSnapshot(receivedMessagesQuery, (snapshot) => {
        receivedMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        updateUnifiedMessages();
      });
      const unsubSent = onSnapshot(sentMessagesQuery, (snapshot) => {
        sentMsgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        updateUnifiedMessages();
      });
      
      // Store unsubSent to use in cleanup
      (window as any)._unsubSent = unsubSent;
    }
    return () => {
      if (unsubContributor) unsubContributor();
      if (unsubUserMessages) unsubUserMessages();
      if ((window as any)._unsubSent) (window as any)._unsubSent();
    };
  }, [isContributorProfileOpen, contributorPhone]);

  const handleDeleteUserMessage = async (msgId: string, deleteForEveryone: boolean) => {
    try {
      const msgRef = doc(db, 'user_messages', msgId);
      if (deleteForEveryone) {
        await updateDoc(msgRef, { deletedForEveryone: true });
      } else {
        const msgDoc = await getDoc(msgRef);
        if (msgDoc.exists()) {
          const data = msgDoc.data();
          await updateDoc(msgRef, { deletedFor: [...(data.deletedFor || []), contributorPhone] });
        }
      }
    } catch (error) {
      console.error(error);
      alert('ম্যাসেজ ডিলেট করতে সমস্যা হয়েছে।');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone) {
      alert('দয়া করে আপনার মোবাইল নাম্বার দিন।');
      return;
    }
    try {
      const docRef = doc(db, 'contributors', loginPhone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(otp);
        setIsForgotPassword(false);
        setIsOtpMode(true);
        alert(`আপনার নাম্বারে একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।

(ডেমো কোড: ${otp})`);
      } else {
        alert('এই নাম্বারে কোনো একাউন্ট পাওয়া যায়নি।');
      }
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === generatedOtp) {
      setIsOtpMode(false);
      setIsResetPasswordMode(true);
      setEnteredOtp('');
    } else {
      alert('ভেরিফিকেশন কোড ভুল হয়েছে!');
    }
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      alert('পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে।');
      return;
    }
    try {
      const docRef = doc(db, 'contributors', loginPhone);
      await updateDoc(docRef, { password: newPassword, passwordResetRequested: false });
      alert('আপনার পাসওয়ার্ড সফলভাবে রিস্টোর হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
      setIsResetPasswordMode(false);
      setIsLoginMode(true);
      setNewPassword('');
    } catch (err) {
      console.error(err);
      alert('পাসওয়ার্ড রিস্টোর করতে সমস্যা হয়েছে।');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'contributors', loginPhone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.password && data.password !== loginPassword) {
          alert('পাসওয়ার্ড ভুল হয়েছে!');
          return;
        }
        
        setContributorName(data.name || '');
        setContributorPhone(data.phone || loginPhone);
        setContributorFacebook(data.facebookUrl || '');
        setContributorAvatar(data.avatar || '');
        setContributorPassword(data.password || '');
        setHasPassword(!!data.password);
          if (data.password) localStorage.setItem('hasPassword', 'true');
          else localStorage.removeItem('hasPassword');
        
        localStorage.setItem('contributorName', data.name || '');
        localStorage.setItem('contributorPhone', data.phone || loginPhone);
        localStorage.setItem('contributorFacebook', data.facebookUrl || '');
        if (data.avatar) {
          localStorage.setItem('contributorAvatar', data.avatar);
        } else {
          localStorage.removeItem('contributorAvatar');
        }
        
        setIsEditProfileMode(false);
        setIsContributorProfileOpen(false);
        setIsLoginMode(false);
        setLoginPhone('');
        setLoginPassword('');
        
        if (data.password) {
          localStorage.setItem('hasPassword', 'true');
        } else {
          localStorage.removeItem('hasPassword');
        }
        
        if (!data.password) {
          alert(`স্বাগতম ${data.name}! আপনার প্রোফাইলটি সুরক্ষিত রাখতে ড্যাশবোর্ড থেকে পাসওয়ার্ড সেট করে নিন।`);
        } else {
          setHasPassword(true);
          localStorage.setItem('hasPassword', 'true');
          alert(`স্বাগতম ${data.name}! আপনার প্রোফাইল সফলভাবে লগইন হয়েছে।`);
        }
      } else {
        alert('এই নাম্বারে কোনো অবদানকারীর তথ্য পাওয়া যায়নি। দয়া করে নতুন প্রোফাইল তৈরি করুন।');
      }
    } catch (err) {
      console.error(err);
      alert('ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setContributorAvatar(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveContributorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'contributors', contributorPhone);
      const docSnap = await getDoc(docRef);
      
      const updateData: any = {
        name: contributorName,
        facebookUrl: contributorFacebook,
      };
      if (contributorAvatar) {
        updateData.avatar = contributorAvatar;
      }
      
      if (contributorPassword) {
        updateData.password = contributorPassword;
        setHasPassword(true);
        localStorage.setItem('hasPassword', 'true');
      }

      if (!docSnap.exists()) {
        if (!contributorPassword) {
            alert("নতুন প্রোফাইল তৈরি করার জন্য পাসওয়ার্ড দেওয়া বাধ্যতামূলক।");
            return;
        }
        await setDoc(docRef, {
          ...updateData,
          phone: contributorPhone,
          approvedCount: 0,
          points: 0,
          createdAt: new Date().toISOString()
        });
      } else {
        await updateDoc(docRef, updateData);
      }
      localStorage.setItem('contributorName', contributorName);
      localStorage.setItem('contributorPhone', contributorPhone);
      localStorage.setItem('contributorFacebook', contributorFacebook);
      if (contributorAvatar) {
        localStorage.setItem('contributorAvatar', contributorAvatar);
      }

      // Update authorName and authorAvatar in all community_posts by this user
      const postsQuery = query(collection(db, 'community_posts'), where('authorPhone', '==', contributorPhone));
      const postsSnapshot = await getDocs(postsQuery);
      const updatePromises = postsSnapshot.docs.map(postDoc => {
        return updateDoc(doc(db, 'community_posts', postDoc.id), {
          authorName: contributorName,
          authorAvatar: contributorAvatar || ''
        });
      });
      
      // Update public_reviews
      const reviewsQuery = query(collection(db, 'public_reviews'), where('authorPhone', '==', contributorPhone));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewUpdatePromises = reviewsSnapshot.docs.map(reviewDoc => {
        return updateDoc(doc(db, 'public_reviews', reviewDoc.id), {
          name: contributorName,
          authorAvatar: contributorAvatar || ''
        });
      });
      
      // Update comments in community_posts
      const allPostsSnapshot = await getDocs(collection(db, 'community_posts'));
      const commentUpdatePromises = allPostsSnapshot.docs.map(postDoc => {
        const postData = postDoc.data();
        let updated = false;
        const newComments = (postData.comments || []).map((c) => {
          if (c.authorPhone === contributorPhone) {
            updated = true;
            return { ...c, authorName: contributorName, authorAvatar: contributorAvatar || '' };
          }
          return c;
        });
        if (updated) {
          return updateDoc(doc(db, 'community_posts', postDoc.id), { comments: newComments });
        }
        return Promise.resolve();
      });

      await Promise.all([...updatePromises, ...reviewUpdatePromises, ...commentUpdatePromises]);

      setIsContributorProfileOpen(false);
      alert('প্রোফাইল সেইভ হয়েছে! এখন থেকে আপনার যুক্ত করা নাম্বারগুলো অ্যাপ্রুভ হলে আপনার অবদান পয়েন্ট বাড়বে।');
    } catch (err) {
      console.error(err);
      alert('প্রোফাইল সেইভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const hasUnreadReply = contributorFeedbacks.some(fb => fb.hasUnreadUserReply);

  return (
    <>
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen} 
        message={confirmConfig.message} 
        onConfirm={() => { confirmConfig.action(); setConfirmConfig({...confirmConfig, isOpen: false}); }} 
        onCancel={() => setConfirmConfig({...confirmConfig, isOpen: false})} 
      />
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-10 transition-all">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          {selectedCategory || showMap || showCommunity ? (
            <button
              onClick={() => { setSelectedCategory(null); setShowMap(false); setShowCommunity(false); }}
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
            {showCommunity ? 'কমিউনিটি' : showMap ? 'গাড়ির লাইভ অবস্থান' : selectedCategory ? selectedCategory.title : 'পূর্বধলা হেল্পলাইন'}
          </h1>
          {isAdmin && (
            <a href="/admin" className="ml-2 text-[10px] bg-red-500 text-white px-2 py-1 rounded shadow-sm hover:bg-red-600 transition-colors font-medium">
              অ্যাডমিন প্যানেল
            </a>
          )}
          <button 
            onClick={() => setIsLeaderboardOpen(true)}
            className="ml-2 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white"
            title="শীর্ষ অবদানকারী"
          >
            <Trophy className="w-6 h-6" />
          </button>
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  // mark all as read
                  const unreadNotifs = notifications.filter(n => !n.read);
                  unreadNotifs.forEach(n => {
                    updateDoc(doc(db, 'notifications', n.id), { read: true }).catch(() => {});
                  });
                  prevNotifCount.current = 0;
                }
              }}
              className="ml-2 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white relative"
              title="নোটিফিকেশন"
            >
              <Bell className="w-6 h-6" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-600"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">নোটিফিকেশন</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => {
                        notifications.forEach(n => {
                          deleteDoc(doc(db, 'notifications', n.id)).catch(() => {});
                        });
                        setNotifications([]);
                      }}
                      className="text-[10px] text-red-500 hover:text-red-600 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">কোনো নোটিফিকেশন নেই।</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`p-3 border-b border-gray-50 text-sm hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}
                        onClick={() => {
                          setShowNotifications(false);
                          if (notif.link === 'community') {
                            setShowCommunity(true);
                            setShowMap(false);
                            setSelectedCategory(null);
                          } else if (notif.link === 'messages') {
                            if (isAdmin) {
                                // admin inbox handled differently, but we can't easily redirect to admin dashboard from app unless window.location
                                window.location.href = '/admin';
                            } else {
                                setIsContributorProfileOpen(true);
                                // could set tab, but it defaults to stats, would be nice to open inbox. Just open profile for now
                            }
                          }
                        }}
                      >
                        <h4 className="font-semibold text-gray-900 text-xs mb-1">{notif.title}</h4>
                        <p className="text-gray-600 text-[11px] line-clamp-2">{notif.body}</p>
                        <span className="text-[9px] text-gray-400 mt-1 block">{new Date(notif.createdAt).toLocaleString('bn-BD')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsContributorProfileOpen(true)}
            className="ml-1 p-2 hover:bg-emerald-700 rounded-full transition-colors flex items-center justify-center text-white relative"
            title="আমার প্রোফাইল"
          >
            {contributorAvatar ? (
              <img src={contributorAvatar} alt="Profile" className="w-7 h-7 rounded-full object-cover border border-emerald-500 bg-white" />
            ) : (
              <UserCircle className="w-6 h-6" />
            )}
            {(hasUnreadReply || hasUnreadMessages) && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Search Bar - only show if no category is selected or if there are many contacts */}
        {!selectedCategory && !showMap && !showCommunity && (
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
        {!selectedCategory && !showMap && !showCommunity && !searchQuery && (
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
        {showMap && !showCommunity && (
          <div className="mb-8">
            <MapTracker />
          </div>
        )}

        {/* Community */}
        {showCommunity && (
          <Community 
            contributorPhone={contributorPhone}
            contributorName={contributorName}
            contributorAvatar={contributorAvatar}
            topContributors={topContributors}
            onLoginClick={() => setIsContributorProfileOpen(true)}
            onBack={() => setShowCommunity(false)}
            onUserClick={setSelectedUserProfile}
            onlineUsers={onlineUsers}
          />
        )}

        {/* Dashboard Grid (Shown when no category is selected and no search typed) */}
        {!selectedCategory && !showMap && !showCommunity && !searchQuery && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setShowCommunity(true)}
              className="bg-blue-50 text-blue-700 border border-blue-100 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <Users className="w-10 h-10 mb-1" strokeWidth={1.5} />
              <span className="text-sm sm:text-base font-medium text-center">কমিউনিটি</span>
            </button>
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
                <div key={category.id} className="relative group">
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`${category.color} w-full h-full rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50`}
                  >
                    <IconComponent className="w-10 h-10 mb-1" strokeWidth={1.5} />
                    <span className="text-sm sm:text-base font-medium text-center">{category.title}</span>
                  </button>
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!['fire', 'police', 'ambulance', 'hospital', 'blood', 'palli_bidyut', 'desco', 'wasa', 'journalist'].includes(category.id) && (
                        <button 
                          onClick={(e) => openEditCategoryModal(e, category)}
                          className="bg-blue-500 text-white p-1.5 rounded-full"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      {!['fire', 'police', 'ambulance', 'hospital', 'blood', 'palli_bidyut', 'desco', 'wasa', 'journalist'].includes(category.id) && (
                        <button 
                          onClick={(e) => handleDeleteCategoryApp(category.id, e)}
                          className="bg-red-500 text-white p-1.5 rounded-full"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
  );
})}
          </div>
        )}

        {/* Contacts List (Shown when searching or inside a category) */}
        {(selectedCategory || searchQuery) && !showCommunity && !showMap && (
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
                    {isAdmin && (
                      <button 
                        onClick={(e) => handleDeleteContactApp(contact.id, e)}
                        className="flex-shrink-0 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-500 hover:text-red-600 p-3 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
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
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{isAdmin ? 'সফলভাবে সম্পন্ন হয়েছে!' : 'রিকোয়েস্ট সফল হয়েছে!'}</h3>
                  <p className="text-gray-500">{isAdmin ? 'আপনার দেওয়া তথ্যটি সাথে সাথে আপডেট হয়ে গেছে।' : 'আপনার দেওয়া তথ্যটি যাচাই করে শীঘ্রই ডিরেক্টরিতে যুক্ত করা হবে।'}</p>
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
                    {requestStatus === 'submitting' ? 'জমা দেওয়া হচ্ছে...' : isAdmin ? (editingContactId ? 'আপডেট করুন' : 'যুক্ত করুন') : 'রিকোয়েস্ট পাঠান'}
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
              <h2 className="text-lg font-semibold text-gray-900">{editingCategoryId ? "ক্যাটাগরি আপডেট করুন" : "নতুন ক্যাটাগরি (মেনু) যুক্ত করুন"}</h2>
              <button
                onClick={() => { setIsCategoryModalOpen(false); setEditingCategoryId(null); }}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5">
              {requestStatus === 'success' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-16 h-16 text-indigo-500 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{isAdmin ? 'সফলভাবে সম্পন্ন হয়েছে!' : 'রিকোয়েস্ট সফল হয়েছে!'}</h3>
                  <p className="text-gray-500">{isAdmin ? 'আপনার দেওয়া তথ্যটি সাথে সাথে আপডেট হয়ে গেছে।' : 'অ্যাডমিন চেক করে ক্যাটাগরিটি যুক্ত করবেন।'}</p>
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
                    {requestStatus === 'submitting' ? 'জমা দেওয়া হচ্ছে...' : isAdmin ? (editingCategoryId ? 'আপডেট করুন' : 'যুক্ত করুন') : 'রিকোয়েস্ট পাঠান'}
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
                  {!contributorName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম *</label>
                      <input
                        type="text" required value={newFeedbackName} onChange={(e) => setNewFeedbackName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="আপনার নাম"
                      />
                    </div>
                  )}
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
      <UserProfileModal isOpen={!!selectedUserProfile} onClose={() => setSelectedUserProfile(null)} userPhone={selectedUserProfile || ""} currentUserId={contributorPhone} currentUserName={contributorName} currentUserAvatar={contributorAvatar} onlineUsers={onlineUsers} />
      {isContributorProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-emerald-600" /> 
                <span className="flex items-center">
                  {isLoginMode ? 'লগইন' : 'আমার প্রোফাইল'}
                  {!isLoginMode && contributorName && isVerifiedContributor(contributorName) && <VerifiedBadge />}
                </span>
              </h2>
              <button
                onClick={() => { setIsContributorProfileOpen(false); setIsLoginMode(false); setIsForgotPassword(false); setIsOtpMode(false); setIsResetPasswordMode(false); }}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5">
              {isResetPasswordMode ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    আপনার নতুন পাসওয়ার্ড সেট করুন।
                  </p>
                  <form onSubmit={handleSaveNewPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">নতুন পাসওয়ার্ড *</label>
                      <input
                        type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="নতুন পাসওয়ার্ড"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-medium flex justify-center items-center transition-colors"
                    >
                      সেভ করুন
                    </button>
                  </form>
                </>
              ) : isOtpMode ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    আপনার মোবাইল নাম্বারে পাঠানো ৪-ডিজিটের কোডটি এখানে লিখুন।
                  </p>
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ভেরিফিকেশন কোড *</label>
                      <input
                        type="text" required value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-center tracking-widest text-lg font-bold"
                        placeholder="----"
                        maxLength={4}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-medium flex justify-center items-center transition-colors"
                    >
                      ভেরিফাই করুন
                    </button>
                  </form>
                  <div className="mt-4 text-center">
                    <button onClick={() => { setIsOtpMode(false); setIsForgotPassword(true); }} className="text-sm text-gray-600 hover:underline">
                      ফিরে যান
                    </button>
                  </div>
                </>
              ) : isForgotPassword ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    আপনার মোবাইল নাম্বারটি দিন। আমরা আপনার নাম্বারে একটি ভেরিফিকেশন কোড পাঠাবো।
                  </p>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
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
                      কোড পাঠান
                    </button>
                  </form>
                  <div className="mt-4 text-center">
                    <button onClick={() => setIsForgotPassword(false)} className="text-sm text-gray-600 hover:underline">
                      ফিরে যান
                    </button>
                  </div>
                </>
              ) : isLoginMode ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    আপনার মোবাইল নাম্বার ও পাসওয়ার্ড দিয়ে লগইন করুন। আপনি যদি আগে থেকে একাউন্ট করে থাকেন কিন্তু পাসওয়ার্ড সেট না করে থাকেন, তবে শুধু নাম্বার দিয়ে লগইন করে ড্যাশবোর্ড থেকে পাসওয়ার্ড সেট করুন।
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
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
                        <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-emerald-600 hover:underline">পাসওয়ার্ড ভুলে গেছেন?</button>
                      </div>
                      <input
                        type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="আপনার পাসওয়ার্ড দিন (যদি থাকে)"
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
                  {!hasPassword && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4 text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p className="font-medium">আপনার একাউন্টটি সুরক্ষিত নয়!</p>
                        <button onClick={() => setIsEditProfileMode(true)} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-900 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors">
                          পাসওয়ার্ড সেট করুন
                        </button>
                      </div>
                      <p className="mt-1 text-xs opacity-90">আপনার একাউন্টটি সুরক্ষিত রাখতে এখনই প্রোফাইল আপডেট করে একটি পাসওয়ার্ড সেট করে নিন।</p>
                    </div>
                  )}
                  
                  {/* User Dashboard Tabs */}
                  <div className="flex overflow-x-auto gap-2 mb-4 pb-1 scrollbar-hide border-b">
                    <button onClick={() => setActiveUserTab('stats')} className={`px-3 py-1.5 font-medium text-xs whitespace-nowrap border-b-2 transition-colors ${activeUserTab === 'stats' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                      ড্যাশবোর্ড
                    </button>
                    <button onClick={() => setActiveUserTab('contacts')} className={`px-3 py-1.5 font-medium text-xs whitespace-nowrap border-b-2 transition-colors ${activeUserTab === 'contacts' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                      নাম্বার ({contributorContacts.length})
                    </button>
                    <button onClick={() => setActiveUserTab('feedbacks')} className={`px-3 py-1.5 font-medium text-xs whitespace-nowrap border-b-2 transition-colors ${activeUserTab === 'feedbacks' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                      মতামত ({contributorFeedbacks.length})
                    </button>
                    <button onClick={() => setActiveUserTab('messages')} className={`px-3 py-1.5 font-medium text-xs whitespace-nowrap border-b-2 transition-colors ${activeUserTab === 'messages' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                      ইনবক্স {hasUnreadMessages || hasUnreadReply ? <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-1"></span> : ''}
                    </button>
                  </div>

                  {activeUserTab === 'stats' && (
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
                  )}

                  {activeUserTab === 'feedbacks' && (
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
                              {fb.status === 'approved' && (
                                <div className="flex gap-0.5">
                                  {[...Array(fb.rating || 1)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{fb.message}</p>
                            
                            {/* Replies Section Toggle */}
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <button 
                                onClick={() => {
                                  if (expandedFeedbackId === fb.id) {
                                    setExpandedFeedbackId(null);
                                  } else {
                                    setExpandedFeedbackId(fb.id);
                                    if (fb.hasUnreadUserReply) {
                                      handleMarkFeedbackAsRead(fb.id);
                                    }
                                  }
                                }}
                                className="flex items-center gap-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 relative"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>রিপ্লাই দেখুন {fb.replies?.length ? `(${fb.replies.length})` : ''}</span>
                                {fb.hasUnreadUserReply && (
                                  <span className="flex h-2.5 w-2.5 ml-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                  </span>
                                )}
                              </button>
                            </div>

                            {/* Replies Thread */}
                            {expandedFeedbackId === fb.id && (
                              <div className="mt-3 bg-white p-2 rounded border border-gray-100">
                                {fb.replies && fb.replies.length > 0 ? (
                                  <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                                    {fb.replies.map((reply: any) => {
                                      const userIdentifier = contributorPhone || 'anonymous';
                                      const isLiked = reply.likes?.includes(userIdentifier);
                                      return (
                                      <div key={reply.id} className={`p-2 rounded-lg text-sm ${reply.sender === 'user' ? 'bg-emerald-50 ml-4' : 'bg-gray-50 mr-4'}`}>
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="font-semibold text-[11px] text-gray-700 flex items-center">{reply.sender === 'user' ? 'আপনি' : 'অ্যাডমিন'} {reply.sender === 'admin' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] shrink-0 inline-block align-middle ml-1" title="Admin"><path d="M22.5 12.536V11.464L20.892 9.114L21.214 6.273L18.441 5.437L16.51 3.239L13.8 4.029L12 2.25L10.2 4.029L7.49 3.239L5.559 5.437L2.786 6.273L3.108 9.114L1.5 11.464V12.536L3.108 14.886L2.786 17.727L5.559 18.563L7.49 20.761L10.2 19.971L12 21.75L13.8 19.971L16.51 20.761L18.441 18.563L21.214 17.727L20.892 14.886L22.5 12.536Z" fill="#0866FF"/><path fillRule="evenodd" clipRule="evenodd" d="M16.53 8.47a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.97 1.97 4.97-4.97a.75.75 0 0 1 1.06 0z" fill="white"/></svg>}</span>
                                          <div className="flex items-center gap-2">
                                            {reply.edited && <span className="text-[9px] text-gray-400 italic">edited</span>}
                                            <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString('bn-BD')}</span>
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
                                                if (e.key === 'Enter') handleEditReplyUser(fb.id, reply.id);
                                              }}
                                            />
                                            <button onClick={() => handleEditReplyUser(fb.id, reply.id)} className="text-emerald-600 hover:text-emerald-700">
                                              <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingReplyId(null)} className="text-gray-400 hover:text-red-500">
                                              <X className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ) : (
                                          <>
                                            <p className="text-gray-800 text-xs">{reply.message}</p>
                                            <div className="flex justify-end gap-2 mt-1">
                                              <button 
                                                onClick={() => handleLikeReplyUser(fb.id, reply.id)}
                                                className={`flex items-center gap-1 text-[10px] ${isLiked ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-500'}`}
                                              >
                                                <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-emerald-600' : ''}`} />
                                                {reply.likes?.length > 0 && <span>{reply.likes.length}</span>}
                                              </button>
                                              {reply.sender === 'user' && (
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
                                ) : (
                                  <p className="text-xs text-gray-400 mb-2">এখনও কোনো রিপ্লাই নেই।</p>
                                )}
                                
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={feedbackReplyText[fb.id] || ''}
                                    onChange={(e) => setFeedbackReplyText({ ...feedbackReplyText, [fb.id]: e.target.value })}
                                    placeholder="আপনার রিপ্লাই..."
                                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleFeedbackReplyUser(fb.id);
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleFeedbackReplyUser(fb.id)}
                                    disabled={!feedbackReplyText[fb.id]?.trim()}
                                    className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  )} 
 {activeUserTab === 'messages' && ( 
 <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900">অ্যাডমিনের সাথে ম্যাসেজ</h3>
                      {hasUnreadMessages && (
                        <button onClick={handleMarkMessagesAsRead} className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium hover:bg-red-200">
                          মার্ক এজ রিড
                        </button>
                      )}
                    </div>
                    {contributorMessages.length === 0 ? (
                      <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg text-center">কোনো ম্যাসেজ নেই।</p>
                    ) : (
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        {contributorMessages.filter(msg => !msg.deletedForEveryone && !msg.deletedFor?.includes('user')).map(msg => (
                          <div key={msg.id} className="bg-white p-3 rounded shadow-sm">
                            <div className="flex justify-between items-center mb-1 border-b border-gray-50 pb-1">
                              <span className="font-semibold text-[11px] text-emerald-700 flex items-center">
                                <span className="relative">
                                  {msg.sender === 'admin' ? 'অ্যাডমিন' : 'আপনি'}
                                  {msg.sender === 'admin' && onlineUsers.includes('admin') && <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>}
                                  {msg.sender !== 'admin' && onlineUsers.includes(contributorPhone) && <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>}
                                </span>
                                {msg.sender === 'admin' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[12px] h-[12px] shrink-0 inline-block align-middle ml-3" title="Admin"><path d="M22.5 12.536V11.464L20.892 9.114L21.214 6.273L18.441 5.437L16.51 3.239L13.8 4.029L12 2.25L10.2 4.029L7.49 3.239L5.559 5.437L2.786 6.273L3.108 9.114L1.5 11.464V12.536L3.108 14.886L2.786 17.727L5.559 18.563L7.49 20.761L10.2 19.971L12 21.75L13.8 19.971L16.51 20.761L18.441 18.563L21.214 17.727L20.892 14.886L22.5 12.536Z" fill="#0866FF"/><path fillRule="evenodd" clipRule="evenodd" d="M16.53 8.47a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.97 1.97 4.97-4.97a.75.75 0 0 1 1.06 0z" fill="white"/></svg>}
                              </span>
                              <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString('bn-BD')}</span>
                            </div>
                            <p className="text-gray-800 text-xs whitespace-pre-wrap">{msg.message}</p>
                            <div className="flex justify-end items-center mt-2 gap-2">
                              {msg.sender === 'user' && (
                                <span className={`text-[10px] font-medium ${msg.read ? 'text-blue-500' : 'text-gray-400'}`}>
                                  {msg.read ? 'Seen' : 'Delivered'}
                                </span>
                              )}
                              <button onClick={() => handleDeleteContributorMessage(msg.id, false)} className="text-[10px] text-red-500 hover:text-red-600" title="Delete for me">
                                <Trash2 className="w-3 h-3" />
                              </button>
                              {msg.sender === 'user' && (
                                <button onClick={() => handleDeleteContributorMessage(msg.id, true)} className="text-[10px] text-red-600 hover:text-red-700 bg-red-50 px-1 rounded" title="Delete for everyone">
                                  সবার জন্য মুছুন
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={userMessageText}
                        onChange={(e) => setUserMessageText(e.target.value)}
                        placeholder="রিপ্লাই লিখুন..."
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSendUserMessage();
                        }}
                      />
                      <button
                        onClick={handleSendUserMessage}
                        disabled={!userMessageText.trim()}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">ইউজারদের সাথে কথোপকথন</h3>
                      {userMessages.length === 0 ? (
                        <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg text-center">কোনো ম্যাসেজ নেই।</p>
                      ) : (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {userMessages.map(msg => {
                            const isSentByMe = msg.senderPhone === contributorPhone;
                            return (
                            <div key={msg.id} className="bg-white p-3 rounded shadow-sm border border-gray-100">
                              <div className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded" onClick={() => setSelectedUserProfile(isSentByMe ? msg.receiverPhone : msg.senderPhone)}>
                                <div className="relative shrink-0">
                                  {isSentByMe ? (
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                      <Send className="w-3 h-3" />
                                    </div>
                                  ) : msg.senderAvatar ? (
                                    <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                      <UserCircle className="w-4 h-4" />
                                    </div>
                                  )}
                                  {!isSentByMe && onlineUsers.includes(msg.senderPhone) && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                  <span className="font-semibold text-[11px] text-gray-900">{isSentByMe ? `To: ${msg.receiverName}` : msg.senderName}</span>
                                  <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString('bn-BD')}</span>
                                </div>
                              </div>
                              <p className="text-gray-800 text-xs whitespace-pre-wrap pl-8">{msg.message}</p>
                              <div className="flex justify-between items-center mt-2 pl-8">
                                <div className="flex gap-2">
                                  {isSentByMe ? (
                                    <span className={`text-[10px] font-medium ${msg.read ? 'text-blue-500' : 'text-gray-400'}`}>
                                      {msg.read ? 'Seen' : 'Delivered'}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleDeleteUserMessage(msg.id, false)} className="text-[10px] text-red-500 hover:text-red-600" title="Delete for me">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  {isSentByMe && (
                                    <button onClick={() => handleDeleteUserMessage(msg.id, true)} className="text-[10px] text-red-600 hover:text-red-700 bg-red-50 px-1 rounded" title="Delete for everyone">
                                      সবার জন্য মুছুন
                                    </button>
                                  )}
                                  {!isSentByMe && (
                                    <button
                                      onClick={() => setSelectedUserProfile(msg.senderPhone)}
                                      className="text-[10px] text-emerald-600 font-medium hover:text-emerald-700"
                                    >
                                      রিপ্লাই দিন
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  )} 
 {activeUserTab === 'contacts' && ( 
 <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">আমার যোগ করা নাম্বারসমূহ</h3>
                    {contributorContacts.length === 0 ? (
                      <p className="text-sm text-gray-500">আপনি এখনও কোনো নাম্বার যোগ করেননি।</p>
                    ) : (
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {contributorContacts.map(contact => (
                          <div key={contact.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{contact.name}</p>
                              <p className="text-sm text-gray-500">{contact.phone}</p>
                            </div>
                            <div>
                              {contact.status === 'approved' ? (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">অ্যাপ্রুভড</span>
                              ) : (
                                <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">পেন্ডিং</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  )} 
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
                        setContributorPassword('');
                        setContributorPoints(0);
                        setContributorApprovedCount(0);
                        setIsEditProfileMode(true);
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
                  <form onSubmit={async (e) => {
                    await saveContributorProfile(e);
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড {contributorName ? '(পরিবর্তন করতে চাইলে লিখুন)' : '*'}</label>
                      <input
                        type="password" value={contributorPassword} onChange={(e) => setContributorPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder={contributorName ? "নতুন পাসওয়ার্ড" : "আপনার পাসওয়ার্ড সেট করুন"}
                        required={!contributorName} // Required for new users
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">প্রোফাইল ছবি (ঐচ্ছিক)</label>
                      <div className="flex items-center gap-3">
                        {contributorAvatar ? (
                          <img src={contributorAvatar} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            <UserCircle className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                      </div>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> রেটিংস ও রিভিও</h2>
              <button
                onClick={() => { setIsReviewsModalOpen(false); setIsWritingReview(false); }}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-grow">
              {reviewSubmitStatus === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">ধন্যবাদ!</h3>
                  <p className="text-gray-500">আপনার রিভিও সফলভাবে প্রকাশিত হয়েছে।</p>
                </div>
              ) : isWritingReview ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {!contributorName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">আপনার নাম *</label>
                      <input
                        type="text" required value={newReviewName} onChange={(e) => setNewReviewName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="আপনার নাম"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">রেটিং *</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star className={`w-8 h-8 ${star <= newReviewRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">আপনার রিভিও *</label>
                    <textarea
                      required value={newReviewMessage} onChange={(e) => setNewReviewMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                      placeholder="অ্যাপটি সম্পর্কে আপনার মতামত লিখুন..."
                    />
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button" onClick={() => setIsWritingReview(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit" disabled={reviewSubmitStatus === 'submitting'}
                      className={`flex-1 py-3 px-4 rounded-xl text-white font-medium flex justify-center items-center transition-colors ${
                        reviewSubmitStatus === 'submitting' ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {reviewSubmitStatus === 'submitting' ? 'প্রকাশ করা হচ্ছে...' : 'রিভিও দিন'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-6">
                    <button 
                      onClick={() => setIsWritingReview(true)}
                      className="w-full py-3 px-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-medium transition-colors border border-emerald-200 flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" /> নিজে একটি রিভিও দিন
                    </button>
                  </div>
                  
                  {publicReviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>এখনও কোনো রিভিও নেই। প্রথম রিভিওটি আপনিই দিন!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {publicReviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-start gap-3 mb-2">
                            <div 
                              className={`flex items-start gap-3 ${review.authorPhone ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                              onClick={() => review.authorPhone && setSelectedUserProfile(review.authorPhone)}
                            >
                              <div className="relative shrink-0">
                                {review.authorAvatar ? (
                                  <img src={review.authorAvatar} alt={review.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <UserCircle className="w-6 h-6" />
                                  </div>
                                )}
                                {review.authorPhone && onlineUsers.includes(review.authorPhone) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                              </div>
                              <h3 className="font-semibold text-gray-900 flex items-center mt-2">
                                {review.name}
                                {isVerifiedContributor(review.name) && <VerifiedBadge />}
                              </h3>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-end">
                                <div className="flex gap-0.5">
                                  {[...Array(review.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{review.message}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/60">
                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('bn-BD')}</p>
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                              <button
                                onClick={() => handleReviewReaction(review, 'like')}
                                className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${review.likesArray?.includes(getUserId()) || JSON.parse(localStorage.getItem('likedReviews') || '[]').includes(review.id) ? 'text-blue-600' : ''}`}
                              >
                                <ThumbsUp className={`w-4 h-4 ${review.likesArray?.includes(getUserId()) || JSON.parse(localStorage.getItem('likedReviews') || '[]').includes(review.id) ? 'fill-blue-600' : ''}`} />
                                <span>{review.likesArray?.length > 0 ? review.likesArray.length : (review.likes > 0 ? review.likes : 'লাইক')}</span>
                              </button>
                              <button
                                onClick={() => handleReviewReaction(review, 'love')}
                                className={`flex items-center gap-1 hover:text-red-500 transition-colors ${review.lovesArray?.includes(getUserId()) ? 'text-red-500' : ''}`}
                              >
                                <Heart className={`w-4 h-4 ${review.lovesArray?.includes(getUserId()) ? 'fill-red-500 text-red-500' : ''}`} />
                                <span>{review.lovesArray?.length > 0 ? review.lovesArray.length : 'লাভ'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
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
                    <div key={user.id} onClick={() => user.phone !== "admin" && setSelectedUserProfile(user.phone)} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <div className="relative shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <UserCircle className="w-6 h-6" />
                            </div>
                          )}
                          {onlineUsers.includes(user.phone) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 leading-tight flex items-center gap-1">
                            {user.facebookUrl ? (
                              <a href={user.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                                {user.name}
                              </a>
                            ) : (
                              <span>{user.name}</span>
                            )}
                            {idx < 5 && (
                              <VerifiedBadge />
                            )}
                          </h3>
                          <p className="text-xs text-gray-500">পয়েন্ট: <span className="font-semibold text-emerald-600">{user.points || 0}</span></p>
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
    </>
  );
}
