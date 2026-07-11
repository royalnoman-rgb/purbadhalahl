const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldCatch = `    } catch (err) {
      console.error(err);
      alert('লগইন করতে সমস্যা হয়েছে।');
    }`;

const newCatch = `    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        alert(\`লগইন করতে সমস্যা হয়েছে: বর্তমান ডোমেইনটি (\${window.location.hostname}) Firebase-এ অনুমোদিত নয়। Firebase Console > Authentication > Settings > Authorized domains-এ এটি যুক্ত করুন।\`);
      } else if (err.code === 'auth/popup-closed-by-user') {
        alert('আপনি লগইন পপআপটি বন্ধ করে দিয়েছেন। দয়া করে আবার চেষ্টা করুন।');
      } else {
        alert(\`লগইন করতে সমস্যা হয়েছে: \${err.message || 'Unknown error'}\`);
      }
    }`;

code = code.replace(oldCatch, newCatch);
fs.writeFileSync('src/App.tsx', code);
