const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // App.tsx edits
  if (file.includes('App.tsx')) {
    // For number edit request
    content = content.replace(/receiverPhone: 'admin',\s*type: 'number_edit_request',/g, "receiverPhone: 'admin',\n            senderPhone: contributorPhone,\n            type: 'number_edit_request',");
    // For number request
    content = content.replace(/receiverPhone: 'admin',\s*type: 'number_request',/g, "receiverPhone: 'admin',\n            senderPhone: contributorPhone,\n            type: 'number_request',");
    // For subcategory request
    content = content.replace(/receiverPhone: 'admin',\s*type: 'subcategory_request',/g, "receiverPhone: 'admin',\n          senderPhone: contributorPhone,\n          type: 'subcategory_request',");
    // For category request
    content = content.replace(/receiverPhone: 'admin',\s*type: 'category_request',/g, "receiverPhone: 'admin',\n            senderPhone: contributorPhone,\n            type: 'category_request',");
    // For user message
    content = content.replace(/receiverPhone: 'admin',\s*type: 'user_message',/g, "receiverPhone: 'admin',\n        senderPhone: contributorPhone,\n        type: 'user_message',");
    // For feedback
    content = content.replace(/receiverPhone: 'admin',\s*type: 'feedback',/g, "receiverPhone: 'admin',\n        senderPhone: contributorPhone,\n        type: 'feedback',");
    // For review
    content = content.replace(/receiverPhone: 'admin',\s*type: 'review',/g, "receiverPhone: 'admin',\n        senderPhone: contributorPhone,\n        type: 'review',");
  }

  // Admin.tsx edits
  if (file.includes('Admin.tsx')) {
    // For admin message to user (request reply)
    content = content.replace(/receiverPhone: contributorPhone,\s*type: 'admin_message',/g, "receiverPhone: contributorPhone,\n          senderPhone: 'admin',\n          type: 'admin_message',");
    
    // For admin message to user (general inbox)
    content = content.replace(/receiverPhone: id,\s*type: 'admin_message',/g, "receiverPhone: id,\n          senderPhone: 'admin',\n          type: 'admin_message',");
    content = content.replace(/receiverPhone: contributorId,\s*type: 'admin_message',/g, "receiverPhone: contributorId,\n          senderPhone: 'admin',\n          type: 'admin_message',");
    
    // For contact approval
    content = content.replace(/receiverPhone: contactData.contributorPhone,\s*type: 'contact_approved',/g, "receiverPhone: contactData.contributorPhone,\n          senderPhone: 'admin',\n          type: 'contact_approved',");
    
    // For general approval (categories/subcategories)
    content = content.replace(/receiverPhone: data.contributorPhone,\s*type: 'approval',/g, "receiverPhone: data.contributorPhone,\n          senderPhone: 'admin',\n          type: 'approval',");
    
    // For admin reply to feedback
    content = content.replace(/receiverPhone: feedback.contributorPhone,\s*type: 'admin_reply',/g, "receiverPhone: feedback.contributorPhone,\n            senderPhone: 'admin',\n            type: 'admin_reply',");
  }
  
  fs.writeFileSync(file, content);
}

patchFile('src/App.tsx');
patchFile('src/Admin.tsx');
console.log('Done patching addDoc for notifications');
