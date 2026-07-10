const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `          <h1 className="text-xl font-semibold tracking-tight truncate flex-1">
            {showCommunity ? 'কমিউনিটি' : showMap ? 'গাড়ির লাইভ অবস্থান' : selectedCategory ? selectedCategory.title : 'পূর্বধলা হেল্পলাইন'}
          </h1>
          <button 
            onClick={() => setIsLeaderboardOpen(true)}`;

const replacement = `          <h1 className="text-xl font-semibold tracking-tight truncate flex-1">
            {showCommunity ? 'কমিউনিটি' : showMap ? 'গাড়ির লাইভ অবস্থান' : selectedCategory ? selectedCategory.title : 'পূর্বধলা হেল্পলাইন'}
          </h1>
          {isAdmin && (
            <a href="/admin" className="ml-2 text-[10px] bg-red-500 text-white px-2 py-1 rounded shadow-sm hover:bg-red-600 transition-colors font-medium">
              অ্যাডমিন প্যানেল
            </a>
          )}
          <button 
            onClick={() => setIsLeaderboardOpen(true)}`;

code = code.replace(target, replacement);

fs.writeFileSync(file, code);
