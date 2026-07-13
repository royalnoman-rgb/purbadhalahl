const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  const target = `  const [replyingToRequest, setReplyingToRequest] = useState<string | null>(null);`;
  const replacement = `  const [replyingToRequest, setReplyingToRequest] = useState<string | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);`;
                        
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Patched ' + file);
  } else {
    console.log('Target not found in ' + file);
  }
}

patchFile('src/Admin.tsx');
