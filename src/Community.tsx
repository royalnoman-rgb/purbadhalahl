import { safeStorage, safeSession } from "./utils/storage";
import React, { useState, useEffect, useRef } from 'react';
import { ConfirmDialog } from './components/ConfirmDialog';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Users, Lock, Send, UserCircle, MessageCircle, ArrowLeft, ThumbsUp, Heart, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';

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

const AdminBadge = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] shrink-0 inline-block align-middle ml-1 -mt-0.5"
    title="Admin"
  >
    <path d="M22.5 12.536V11.464L20.892 9.114L21.214 6.273L18.441 5.437L16.51 3.239L13.8 4.029L12 2.25L10.2 4.029L7.49 3.239L5.559 5.437L2.786 6.273L3.108 9.114L1.5 11.464V12.536L3.108 14.886L2.786 17.727L5.559 18.563L7.49 20.761L10.2 19.971L12 21.75L13.8 19.971L16.51 20.761L18.441 18.563L21.214 17.727L20.892 14.886L22.5 12.536Z" fill="#0866FF"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M16.53 8.47a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.97 1.97 4.97-4.97a.75.75 0 0 1 1.06 0z" fill="white"/>
  </svg>
);

interface CommunityProps {
  contributorPhone: string;
  contributorName: string;
  contributorAvatar: string;
  topContributors: any[];
  onLoginClick: () => void;
  onBack: () => void;
  onUserClick: (phone: string) => void;
  onlineUsers: string[];
}

export default function Community({ contributorPhone, contributorName, contributorAvatar, topContributors, onLoginClick, onBack, onUserClick, onlineUsers }: CommunityProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostText, setEditPostText] = useState('');
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});

  const confirmAction = (message: string, action: () => void) => {
    setConfirmConfig({ isOpen: true, message, action });
  };

  const isAdmin = safeStorage.getItem('adminAuth') === 'true';
  const effectivePhone = isAdmin ? 'admin' : contributorPhone;
  const effectiveName = isAdmin ? 'অ্যাডমিন' : contributorName;
  const effectiveAvatar = isAdmin ? '/logo.png' : contributorAvatar;
  const handleUpdatePost = async (postId: string) => {
    if (!editPostText.trim()) return;
    await updateDoc(doc(db, 'community_posts', postId), { text: editPostText.trim() });
    setEditingPostId(null);
  };

  const handleDeletePost = (postId: string) => {
    confirmAction('পোস্টটি মুছে ফেলতে চান?', async () => {
      await updateDoc(doc(db, 'community_posts', postId), { 
        isDeleted: true, 
        deletedAt: new Date().toISOString() 
      });
    });
  };
  const handleDeleteComment = (postId: string, commentId: string) => {
    confirmAction('মন্তব্যটি মুছে ফেলতে চান?', async () => {
      const postRef = doc(db, 'community_posts', postId);
      const postDoc = await getDoc(postRef);
      if(postDoc.exists()) {
        const comments = postDoc.data().comments || [];
        await updateDoc(postRef, { comments: comments.map((c: any) => c.id === commentId ? { ...c, isDeleted: true, deletedAt: new Date().toISOString() } : c) });
      }
    });
  };
  useEffect(() => {
    if (!effectivePhone) return;
    
    const q = query(collection(db, 'community_posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })).filter((p: any) => !p.isDeleted));
    });
    return () => unsub();
  }, [effectivePhone]);

  const isVerifiedContributor = (phone: string, name: string) => {
    return topContributors.slice(0, 5).some(c => c.phone === phone || c.name === name);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !effectivePhone) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'community_posts'), {
        authorName: effectiveName || 'Unknown',
        authorPhone: effectivePhone,
        authorAvatar: effectiveAvatar || '',
        text: newPostText.trim(),
        createdAt: new Date().toISOString(),
        comments: [],
        likes: [],
        loves: []
      });
      setNewPostText('');
    } catch (err) {
      console.error(err);
      alert('পোস্ট করতে সমস্যা হয়েছে।');
    }
    setIsSubmitting(false);
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text || !effectivePhone) return;

    try {
      const postRef = doc(db, 'community_posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          id: Date.now().toString(),
          authorName: effectiveName || 'Unknown',
          authorPhone: effectivePhone,
          authorAvatar: effectiveAvatar || '',
          text: text,
          createdAt: new Date().toISOString(),
          likes: [],
          loves: []
        })
      });
      setCommentText(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReaction = async (postId: string, reactionType: 'like' | 'love') => {
    if (!effectivePhone) return;

    try {
      const postRef = doc(db, 'community_posts', postId);
      const postDoc = await getDoc(postRef);
      if (!postDoc.exists()) return;
      
      const data = postDoc.data();
      let likes = data.likes || [];
      let loves = data.loves || [];

      const hasLiked = likes.includes(effectivePhone);
      const hasLoved = loves.includes(effectivePhone);

      if (reactionType === 'like') {
        if (hasLiked) {
          likes = likes.filter((p: string) => p !== effectivePhone);
        } else {
          likes.push(effectivePhone);
          loves = loves.filter((p: string) => p !== effectivePhone);
        }
      } else if (reactionType === 'love') {
        if (hasLoved) {
          loves = loves.filter((p: string) => p !== effectivePhone);
        } else {
          loves.push(effectivePhone);
          likes = likes.filter((p: string) => p !== effectivePhone);
        }
      }

      await updateDoc(postRef, { likes, loves });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentReaction = async (postId: string, commentId: string, reactionType: 'like' | 'love') => {
    if (!effectivePhone) return;

    try {
      const postRef = doc(db, 'community_posts', postId);
      const postDoc = await getDoc(postRef);
      if (!postDoc.exists()) return;
      
      const data = postDoc.data();
      const comments = data.comments || [];
      const commentIndex = comments.findIndex((c: any) => c.id === commentId);
      
      if (commentIndex === -1) return;
      
      const comment = comments[commentIndex];
      let likes = comment.likes || [];
      let loves = comment.loves || [];

      const hasLiked = likes.includes(effectivePhone);
      const hasLoved = loves.includes(effectivePhone);

      if (reactionType === 'like') {
        if (hasLiked) {
          likes = likes.filter((p: string) => p !== effectivePhone);
        } else {
          likes.push(effectivePhone);
          loves = loves.filter((p: string) => p !== effectivePhone);
        }
      } else if (reactionType === 'love') {
        if (hasLoved) {
          loves = loves.filter((p: string) => p !== effectivePhone);
        } else {
          loves.push(effectivePhone);
          likes = likes.filter((p: string) => p !== effectivePhone);
        }
      }

      comments[commentIndex] = { ...comment, likes, loves };

      await updateDoc(postRef, { comments });
    } catch (err) {
      console.error(err);
    }
  };

  if (!effectivePhone) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center mt-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">কমিউনিটিতে স্বাগতম</h2>
        <p className="text-gray-600 mb-6 max-w-sm">
          কমিউনিটিতে যুক্ত হতে, পোস্ট পড়তে এবং আলোচনা করতে দয়া করে আপনার প্রোফাইলে লগইন করুন অথবা নতুন প্রোফাইল তৈরি করুন।
        </p>
        <div className="flex gap-3">
            <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
            ফিরে যান
            </button>
            <button
            onClick={onLoginClick}
            className="px-6 py-2 bg-emerald-600 rounded-xl text-white font-medium hover:bg-emerald-700 transition-colors"
            >
            লগইন / রেজিস্ট্রেশন
            </button>
        </div>
      </div>
  );
}

  return (
    <>
      <ConfirmDialog 
        isOpen={confirmConfig.isOpen} 
        message={confirmConfig.message} 
        onConfirm={() => { confirmConfig.action(); setConfirmConfig({...confirmConfig, isOpen: false}); }} 
        onCancel={() => setConfirmConfig({...confirmConfig, isOpen: false})} 
      />
    <div className="mt-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
          <h2 className="font-bold text-emerald-800 flex items-center gap-2">
            <Users className="w-5 h-5" /> কমিউনিটি আলোচনা
          </h2>
        </div>
        <div className="p-4">
          <form onSubmit={handlePostSubmit} className="flex gap-3 items-start">
            {effectiveAvatar ? (
              <img src={effectiveAvatar} alt={effectiveName} className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200" />
            ) : (
              <UserCircle className="w-10 h-10 text-gray-400 shrink-0" />
            )}
            <div className="flex-1">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="কমিউনিটির সাথে কিছু শেয়ার করুন..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                rows={3}
                required
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newPostText.trim()}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-colors font-medium text-sm"
                >
                  {isSubmitting ? 'পোস্ট হচ্ছে...' : <> <Send className="w-4 h-4" /> পোস্ট করুন </>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">এখনও কোনো পোস্ট নেই। আপনিই প্রথম পোস্ট করুন!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div 
                className={`flex items-center gap-3 mb-3 ${post.authorPhone !== 'admin' ? 'cursor-pointer hover:bg-gray-50 p-1 -m-1 rounded-lg transition-colors' : ''}`}
                onClick={() => post.authorPhone !== 'admin' && onUserClick(post.authorPhone)}
              >
                <div className="relative shrink-0">
                  {post.authorPhone === 'admin' ? (
                    <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                      <img src="/logo.png" alt="Admin" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                  ) : post.authorAvatar ? (
                    <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <UserCircle className="w-6 h-6" />
                    </div>
                  )}
                  {onlineUsers.includes(post.authorPhone) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight flex items-center">
                    {post.authorName}
                    {post.authorPhone === 'admin' ? <AdminBadge /> : (isVerifiedContributor(post.authorPhone, post.authorName) && <VerifiedBadge />)}
                  </h3>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString('bn-BD')}</p>
                </div>
              </div>
              {(isAdmin || post.authorPhone === effectivePhone) && (
                <div className="absolute top-4 right-4 flex gap-2">
                  {post.authorPhone === effectivePhone && (
                    <button 
                      onClick={() => {
                        if (editingPostId === post.id) {
                          setEditingPostId(null);
                        } else {
                          setEditingPostId(post.id);
                          setEditPostText(post.text);
                        }
                      }} 
                      className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"
                      title="Edit Post"
                    >
                      {editingPostId === post.id ? <XCircle className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeletePost(post.id)} 
                    className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {editingPostId === post.id ? (
                <div className="mb-4">
                  <textarea
                    value={editPostText}
                    onChange={(e) => setEditPostText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm md:text-base"
                    rows={4}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleUpdatePost(post.id)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> সেভ করুন
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap mb-4 text-sm md:text-base leading-relaxed">
                  {post.text}
                </p>
              )}
              
              <div className="flex items-center gap-4 mb-3 px-1">
                <button
                  onClick={() => handleReaction(post.id, 'like')}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    post.likes?.includes(effectivePhone) 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${post.likes?.includes(effectivePhone) ? 'fill-blue-600' : ''}`} />
                  <span>{post.likes?.length || 0}</span>
                </button>
                <button
                  onClick={() => handleReaction(post.id, 'love')}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    post.loves?.includes(effectivePhone) 
                      ? 'text-red-500' 
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.loves?.includes(effectivePhone) ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{post.loves?.length || 0}</span>
                </button>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">{post.comments?.length || 0} টি মন্তব্য</span>
                </div>
                
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-3 mb-3 max-h-48 overflow-y-auto pr-2">
                    {post.comments.filter((c: any) => !c.isDeleted).map((comment: any) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="flex items-start gap-2 mb-1">
                          <div 
                            className={`flex items-start gap-2 ${comment.authorPhone !== 'admin' ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                            onClick={() => comment.authorPhone !== 'admin' && onUserClick(comment.authorPhone)}
                          >
                            <div className="relative shrink-0">
                              {comment.authorPhone === 'admin' ? (
                                <div className="w-6 h-6 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                                  <img src="/logo.png" alt="Admin" className="w-full h-full object-cover mix-blend-multiply" />
                                </div>
                              ) : comment.authorAvatar ? (
                                <img src={comment.authorAvatar} alt={comment.authorName} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                  <UserCircle className="w-4 h-4" />
                                </div>
                              )}
                              {onlineUsers.includes(comment.authorPhone) && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <span className="font-semibold text-gray-900 flex items-center mt-0.5">
                              {comment.authorName}
                              {comment.authorPhone === 'admin' ? <AdminBadge /> : (isVerifiedContributor(comment.authorPhone, comment.authorName) && <VerifiedBadge />)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-end items-start">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString('bn-BD')}</span>
                                {(isAdmin || comment.authorPhone === effectivePhone) && (
                                  <div className="flex gap-1">
                                {comment.authorPhone === effectivePhone && (
                                  <button
                                    onClick={() => {
                                      if (editingPostId === comment.id) {
                                        setEditingPostId(null);
                                      } else {
                                        setEditingPostId(comment.id);
                                        setEditPostText(comment.text);
                                      }
                                    }}
                                    className="text-blue-500 hover:bg-blue-50 p-0.5 rounded"
                                    title="Edit"
                                  >
                                    {editingPostId === comment.id ? <XCircle className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  className="text-red-500 hover:bg-red-50 p-0.5 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {editingPostId === comment.id ? (
                          <div className="mb-2 mt-1">
                            <textarea
                              value={editPostText}
                              onChange={(e) => setEditPostText(e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-xs"
                              rows={2}
                            />
                            <div className="flex justify-end mt-1">
                              <button
                                onClick={async () => {
                                  if (!editPostText.trim()) return;
                                  const postRef = doc(db, 'community_posts', post.id);
                                  const postDoc = await getDoc(postRef);
                                  if (postDoc.exists()) {
                                    const comments = postDoc.data().comments || [];
                                    await updateDoc(postRef, {
                                      comments: comments.map((c: any) => c.id === comment.id ? { ...c, text: editPostText.trim() } : c)
                                    });
                                    setEditingPostId(null);
                                  }
                                }}
                                className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-medium hover:bg-emerald-700 flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" /> সেভ
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 mb-1.5">{comment.text}</p>
                        )}
                        <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500">
                          <button
                            onClick={() => handleCommentReaction(post.id, comment.id, 'like')}
                            className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${comment.likes?.includes(effectivePhone) ? 'text-blue-600' : ''}`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${comment.likes?.includes(effectivePhone) ? 'fill-blue-600' : ''}`} />
                            <span>{comment.likes?.length > 0 ? comment.likes.length : 'লাইক'}</span>
                          </button>
                          <button
                            onClick={() => handleCommentReaction(post.id, comment.id, 'love')}
                            className={`flex items-center gap-1 hover:text-red-500 transition-colors ${comment.loves?.includes(effectivePhone) ? 'text-red-500' : ''}`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${comment.loves?.includes(effectivePhone) ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{comment.loves?.length > 0 ? comment.loves.length : 'লাভ'}</span>
                          </button>
                        </div>
                        </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText[post.id] || ''}
                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                    placeholder="মন্তব্য লিখুন..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleCommentSubmit(post.id);
                    }}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    disabled={!commentText[post.id]?.trim()}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
}
