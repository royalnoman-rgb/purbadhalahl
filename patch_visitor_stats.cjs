const fs = require('fs');
let code = fs.readFileSync('src/components/VisitorStats.tsx', 'utf8');

const newCode = `import { safeStorage, safeSession } from "../utils/storage";
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { Users, Eye } from 'lucide-react';

export function VisitorStats() {
  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    const hasVisited = safeStorage.getItem('has_visited_site');
    const statsRef = doc(db, 'site_stats', 'visitors');
    
    const initializeStats = async () => {
      try {
        if (!hasVisited) {
          await setDoc(statsRef, { totalCount: increment(1) }, { merge: true });
          safeStorage.setItem('has_visited_site', 'true');
        }
        
        // Fetch once instead of onSnapshot
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
  }, []);

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 text-xs mt-4 text-slate-500">
      <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-100 shadow-sm hover:shadow-md transition-all">
        <Eye className="w-4 h-4 text-emerald-600" />
        <span className="font-medium text-slate-600">মোট ভিজিটর: <strong className="text-emerald-700 text-[13px] ml-0.5">{totalVisitors || '...'}</strong></span>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/VisitorStats.tsx', newCode);
console.log('VisitorStats optimized.');
