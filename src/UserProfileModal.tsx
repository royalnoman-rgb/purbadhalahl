import { toBengaliDigits } from './utils';
import React, { useState, useEffect } from 'react';
import { UserCircle, Send, X, Shield, Star, Trophy, MessageCircle } from 'lucide-react';
import { db } from './firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPhone: string;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  onlineUsers: string[];
}

export default function UserProfileModal({ isOpen, onClose, userPhone, currentUserId, currentUserName, currentUserAvatar, onlineUsers }: UserProfileModalProps) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isOpen || !userPhone) return;
    
    const fetchUser = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'contributors', userPhone);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user", error);
      }
      setLoading(false);
    };
    
    fetchUser();
  }, [isOpen, userPhone]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUserId) return;
    
    setIsSending(true);
    try {
      await addDoc(collection(db, 'user_messages'), {
        senderPhone: currentUserId,
        senderName: currentUserName,
        senderAvatar: currentUserAvatar,
        receiverPhone: userPhone,
        receiverName: userData?.name || 'Unknown',
        message: message.trim(),
        createdAt: new Date().toISOString(),
        read: false
      });
      setMessage('');
      alert('ম্যাসেজ পাঠানো হয়েছে!');
      onClose();
    } catch (error) {
      console.error(error);
      alert('ম্যাসেজ পাঠাতে সমস্যা হয়েছে।');
    }
    setIsSending(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-scale-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-semibold text-gray-900">ইউজার প্রোফাইল</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : userData ? (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {userData.avatar ? (
                  <img src={userData.avatar} alt={userData.name} className="w-24 h-24 rounded-full object-cover border-4 border-emerald-50 shadow-sm" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-4 border-white shadow-sm">
                    <UserCircle className="w-12 h-12" />
                  </div>
                )}
                {onlineUsers.includes(userPhone) && <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                {userData.name}
              </h3>
              
              <div className="flex gap-4 mt-4 w-full">
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <Trophy className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-500">পয়েন্ট</div>
                  <div className="font-bold text-gray-900">{userData.points || 0}</div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-500">অ্যাপ্রুভড</div>
                  <div className="font-bold text-gray-900">{userData.approvedCount || 0}</div>
                </div>
              </div>
              
              {currentUserId && currentUserId !== userPhone && (
                <div className="w-full mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" /> ম্যাসেজ পাঠান
                  </h4>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="আপনার ম্যাসেজ লিখুন..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isSending}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" /> {isSending ? 'পাঠানো হচ্ছে...' : 'পাঠান'}
                    </button>
                  </div>
                </div>
              )}
              
              {!currentUserId && (
                <p className="mt-6 text-sm text-red-500 bg-red-50 p-3 rounded-lg w-full text-center">
                  ম্যাসেজ পাঠাতে লগইন করুন।
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">ইউজার খুঁজে পাওয়া যায়নি।</p>
          )}
        </div>
      </div>
    </div>
  );
}
