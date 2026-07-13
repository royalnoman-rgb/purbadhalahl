const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  const target = `  const handleEditRequestSave = async (id: string, type: 'contact' | 'category' | 'subcategory') => {`;
  const replacement = `  const handleBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    setBroadcasting(true);
    try {
      // Chunk batches to avoid 500 limit
      const chunkSize = 400;
      for (let i = 0; i < contributors.length; i += chunkSize) {
        const chunk = contributors.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        chunk.forEach(cont => {
          const notifRef = doc(collection(db, 'notifications'));
          batch.set(notifRef, {
            receiverPhone: cont.id,
            senderPhone: 'admin',
            type: 'broadcast',
            title: broadcastTitle.trim(),
            body: broadcastMessage.trim(),
            read: false,
            createdAt: new Date().toISOString()
          });
        });
        await batch.commit();
      }
      
      await logAdminAction(\`Broadcasted notice: \${broadcastTitle.trim()}\`);
      setShowBroadcastModal(false);
      setBroadcastTitle('');
      setBroadcastMessage('');
      alert('সকলকে নোটিশ পাঠানো হয়েছে!');
    } catch (e) {
      console.error(e);
      alert('নোটিশ পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setBroadcasting(false);
    }
  };

  const handleEditRequestSave = async (id: string, type: 'contact' | 'category' | 'subcategory') => {`;
                        
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Patched ' + file);
  } else {
    console.log('Target not found in ' + file);
  }
}

patchFile('src/Admin.tsx');
