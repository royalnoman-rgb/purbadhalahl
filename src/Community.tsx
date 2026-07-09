import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import { Users, Lock, Send, UserCircle, MessageCircle, ArrowLeft } from 'lucide-react';

interface CommunityProps {
  contributorPhone: string;
  contributorName: string;
  contributorAvatar: string;
  onLoginClick: () => void;
  onBack: () => void;
}

export default function Community({ contributorPhone, contributorName, contributorAvatar, onLoginClick, onBack }: CommunityProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!contributorPhone) return;
    
    const q = query(collection(db, 'community_posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [contributorPhone]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !contributorPhone) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'community_posts'), {
        authorName: contributorName || 'Unknown',
        authorPhone: contributorPhone,
        authorAvatar: contributorAvatar || '',
        text: newPostText.trim(),
        createdAt: new Date().toISOString(),
        comments: []
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
    if (!text || !contributorPhone) return;

    try {
      const postRef = doc(db, 'community_posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          id: Date.now().toString(),
          authorName: contributorName || 'Unknown',
          authorPhone: contributorPhone,
          text: text,
          createdAt: new Date().toISOString()
        })
      });
      setCommentText(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error(err);
    }
  };

  if (!contributorPhone) {
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
    <div className="mt-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
          <h2 className="font-bold text-emerald-800 flex items-center gap-2">
            <Users className="w-5 h-5" /> কমিউনিটি আলোচনা
          </h2>
        </div>
        <div className="p-4">
          <form onSubmit={handlePostSubmit} className="flex gap-3 items-start">
            {contributorAvatar ? (
              <img src={contributorAvatar} alt={contributorName} className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200" />
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
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-3">
                {post.authorAvatar ? (
                  <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <UserCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight">{post.authorName}</h3>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString('bn-BD')}</p>
                </div>
              </div>
              
              <p className="text-gray-800 whitespace-pre-wrap mb-4 text-sm md:text-base leading-relaxed">
                {post.text}
              </p>
              
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">{post.comments?.length || 0} টি মন্তব্য</span>
                </div>
                
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-3 mb-3 max-h-48 overflow-y-auto pr-2">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-gray-900">{comment.authorName}</span>
                          <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleString('bn-BD')}</span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
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
  );
}
