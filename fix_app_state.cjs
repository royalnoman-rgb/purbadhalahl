const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("const [confirmConfig")) {
  const targetState = `  const [publicReviews, setPublicReviews] = useState<any[]>([]);`;
  const replaceState = `  const [publicReviews, setPublicReviews] = useState<any[]>([]);
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, action: () => void}>({isOpen: false, message: '', action: () => {}});

  const confirmAction = (message: string, action: () => void) => {
    setConfirmConfig({ isOpen: true, message, action });
  };`;
  code = code.replace(targetState, replaceState);
}

// Add import if missing
if (!code.includes("import { ConfirmDialog }")) {
  code = code.replace("import Admin from './Admin';", "import Admin from './Admin';\nimport { ConfirmDialog } from './components/ConfirmDialog';");
}

fs.writeFileSync('src/App.tsx', code);
