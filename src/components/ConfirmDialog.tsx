import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">সতর্কতা</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel} 
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            বাতিল
          </button>
          <button 
            onClick={() => {
              onConfirm();
            }} 
            className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition-colors"
          >
            নিশ্চিত
          </button>
        </div>
      </div>
    </div>
  );
}
