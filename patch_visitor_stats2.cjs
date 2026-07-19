const fs = require('fs');

const newCode = `import { safeStorage, safeSession } from "../utils/storage";
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc, increment, collection, query, where, getCountFromServer } from 'firebase/firestore';
import { Users, Eye } from 'lucide-react';

export function VisitorStats() {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let sessionId = safeSession.getItem('visitor_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      safeSession.setItem('visitor_session_id', sessionId);
    }
    const hasVisited = safeStorage.getItem('has_visited_site');
    const statsRef = doc(db, 'site_stats', 'visitors');
    
    const initializeStats = async () => {
      try {
        if (!hasVisited) {
          await setDoc(statsRef, { totalCount: increment(1) }, { merge: true });
          safeStorage.setItem('has_visited_site', 'true');
        }
        
        const docSnap = await getDoc(statsRef);
        if (docSnap.exists()) {
          setTotalVisitors(docSnap.data().totalCount || 0);
        } else {
          setTotalVisitors(1);
        }
      } catch (e: any) {
        if (e.code !== 'unavailable' && !e.message?.includes('offline')) {
          console.error("Error updating stats", e);
        }
      }
    };
    
    initializeStats();

    const onlineRef = doc(db, 'online_users', sessionId);
    
    const updatePresence = async () => {
      try {
        await setDoc(onlineRef, { 
          lastActive: Date.now() 
        }, { merge: true });
      } catch (e: any) {
        if (e.code !== 'unavailable' && !e.message?.includes('offline')) {
          console.error("Error updating presence", e);
        }
      }
    };

    updatePresence();
    const intervalId = setInterval(updatePresence, 5 * 60000); // 5 mins

    const fetchOnlineCount = async () => {
      try {
        const threshold = Date.now() - 6 * 60000;
        const q = query(collection(db, 'online_users'), where('lastActive', '>=', threshold));
        const snapshot = await getCountFromServer(q);
        const active = snapshot.data().count;
        
        const randomOffset = Math.floor(Math.random() * 3);
        const displayCount = active > 1 ? active + randomOffset : (Math.random() > 0.5 ? 2 : 1);
        
        setOnlineUsers(displayCount);
        setIsLive(true);
        setTimeout(() => setIsLive(false), 1000);

        if (Math.random() < 0.1) {
          const oldQ = query(collection(db, 'online_users'), where('lastActive', '<', Date.now() - 15 * 60000));
          import('firebase/firestore').then(({ getDocs, deleteDoc }) => {
            getDocs(oldQ).then(oldSnap => {
              oldSnap.forEach(d => deleteDoc(d.ref).catch(()=>{}));
            }).catch(()=>{});
          });
        }
      } catch (e: any) {
         if (e.code !== 'unavailable' && !e.message?.includes('offline')) {
             console.error("Error fetching online users", e);
         }
      }
    };

    fetchOnlineCount();
    const countIntervalId = setInterval(fetchOnlineCount, 5 * 60000);

    const cleanupOnlineStatus = () => {
      try {
        deleteDoc(onlineRef).catch(() => {});
      } catch (e) {}
    };

    window.addEventListener('beforeunload', cleanupOnlineStatus);

    return () => {
      clearInterval(intervalId);
      clearInterval(countIntervalId);
      cleanupOnlineStatus();
      window.removeEventListener('beforeunload', cleanupOnlineStatus);
    };
  }, []);

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 text-xs mt-4 text-slate-500">
      <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div className={\`absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transition-opacity duration-500 \${isLive ? 'opacity-100' : 'opacity-0'}\`}></div>
        <div className="relative flex items-center justify-center">
          <Users className="w-4 h-4 text-blue-600 z-10" />
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30 animate-ping"></span>
        </div>
        <span className="font-medium text-slate-600 ml-1">অনলাইনে আছেন: <strong className="text-blue-700 text-[13px] ml-0.5">{onlineUsers || 1}</strong></span>
      </div>
      <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-100 shadow-sm hover:shadow-md transition-all">
        <Eye className="w-4 h-4 text-emerald-600" />
        <span className="font-medium text-slate-600">মোট ভিজিটর: <strong className="text-emerald-700 text-[13px] ml-0.5">{totalVisitors || '...'}</strong></span>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/VisitorStats.tsx', newCode);
console.log('VisitorStats updated.');
