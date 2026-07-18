import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
`  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {`,
`  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      const existing = subCategories.find(s => s.categoryId === newSubCatParentId && s.title.trim().toLowerCase() === newSubCatTitle.trim().toLowerCase());
      if (existing) {
        alert('এই সাব-ক্যাটাগরিটি ইতিমধ্যে যুক্ত আছে!');
        setRequestStatus('idle');
        return;
      }`
);

content = content.replace(
`  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      if (editingCategoryId) {`,
`  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('submitting');
    
    try {
      if (!editingCategoryId) {
        const existing = categories.find(c => c.title.trim().toLowerCase() === newCatTitle.trim().toLowerCase() || (c.englishTitle && newCatEnglish && c.englishTitle.trim().toLowerCase() === newCatEnglish.trim().toLowerCase()));
        if (existing) {
          alert('এই ক্যাটাগরিটি ইতিমধ্যে যুক্ত আছে!');
          setRequestStatus('idle');
          return;
        }
      }
      
      if (editingCategoryId) {`
);

fs.writeFileSync('src/App.tsx', content);
