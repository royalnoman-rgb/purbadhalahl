import { safeStorage, safeSession } from "../utils/storage";
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';
import { Users, Eye } from 'lucide-react';

export function VisitorStats() {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    // Session ID for this tab/device
    let sessionId = safeSession.getItem('visitor_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      safeSession.setItem('visitor_session_id', sessionId);
    }

    // Increment total visitors
    const hasVisited = safeStorage.getItem('has_visited_site');
    const statsRef = doc(db, 'site_stats', 'visitors');
    
    const initializeStats = async () => {
      try {
        if (!hasVisited) {
          await setDoc(statsRef, { totalCount: increment(1) }, { merge: true });
          safeStorage.setItem('has_visited_site', 'true');
        }
        
        // Read total count
        const docSnap = await getDoc(statsRef);
        if (docSnap.exists()) {
          setTotalVisitors(docSnap.data().totalCount || 0);
        } else {
            setTotalVisitors(1);
        }
      } catch (e) {
        console.error("Error updating stats", e);
      }
    };
    
    initializeStats();

    // Online Presence
    const onlineRef = doc(db, 'online_users', sessionId);
    const updatePresence = async () => {
      try {
        await setDoc(onlineRef, { 
          lastActive: Date.now() 
        }, { merge: true });
      } catch (e) {
          console.error("Error updating presence", e);
      }
    };

    updatePresence();
    const intervalId = setInterval(updatePresence, 120000); // update every 2 minutes

    // Cleanup on unmount
    const cleanup = () => {
      clearInterval(intervalId);
    };
    
    // Listen to online users
    // Since we can't easily do a rolling window with onSnapshot without recreating the query,
    // we'll just query active users every 30 seconds
    const fetchOnlineCount = async () => {
      try {
        const threshold = Date.now() - 5 * 60000; // 5 minutes
        // We can't do an aggregate query directly without importing more things, 
        // let's just do a normal getDocs or aggregate
        import('firebase/firestore').then(({ getCountFromServer, query, collection, where }) => {
             const q = query(collection(db, 'online_users'), where('lastActive', '>=', threshold));
             getCountFromServer(q).then(snapshot => {
                 setOnlineUsers(snapshot.data().count);
             }).catch(e => console.error(e));
        });
      } catch (e) {
        console.error("Error fetching online users", e);
      }
    };
    
    fetchOnlineCount();
    const countIntervalId = setInterval(fetchOnlineCount, 300000); // every 5 mins

    return () => {
      cleanup();
      clearInterval(countIntervalId);
    };
  }, []);

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 text-xs mt-4 text-gray-500">
      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
        <Users className="w-3.5 h-3.5 text-blue-500" />
        <span>অনলাইনে আছেন: <strong className="text-gray-700">{onlineUsers || 1}</strong></span>
      </div>
      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
        <Eye className="w-3.5 h-3.5 text-emerald-500" />
        <span>মোট ভিজিটর: <strong className="text-gray-700">{totalVisitors || '...'}</strong></span>
      </div>
    </div>
  );
}
