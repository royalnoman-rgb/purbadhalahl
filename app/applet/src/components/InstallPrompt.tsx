import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const hasPrompted = localStorage.getItem('hasPromptedInstall');
    
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!hasPrompted) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
    
    localStorage.setItem('hasPromptedInstall', 'true');
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('hasPromptedInstall', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border border-emerald-100 p-4 z-[100] animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">এপসটি ইন্সটল করুন</h3>
            <p className="text-sm text-gray-500 mt-1">
              দ্রুত ও সহজে ব্যবহার করতে আপনার মোবাইলে এপসটি যোগ করুন।
            </p>
          </div>
        </div>
        <button 
          onClick={handleClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleClose}
          className="flex-1 py-2 px-4 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          পরে
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          ইন্সটল করুন
        </button>
      </div>
    </div>
  );
};
