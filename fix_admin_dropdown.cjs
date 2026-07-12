const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

if (!code.includes('import { categories as staticCategories, predefinedSubCategories }')) {
  code = code.replace(
    "import { Link } from 'react-router-dom';",
    "import { Link } from 'react-router-dom';\nimport { categories as staticCategories, predefinedSubCategories } from './data';"
  );
}

// Add state for all categories and subcategories if missing
if (!code.includes('const [allCats, setAllCats] = useState')) {
  const stateInsertPoint = "const [activeTab, setActiveTab] = useState";
  code = code.replace(
    stateInsertPoint,
    `const [allCats, setAllCats] = useState<any[]>([]);\n  const [allSubCats, setAllSubCats] = useState<any[]>([]);\n  ${stateInsertPoint}`
  );
  
  // inside useEffect fetch the categories and subcategories to populate them
  const useEffectFetchPoint = "const unsubscribe = onSnapshot(collection(db, 'contacts'),";
  code = code.replace(
    useEffectFetchPoint,
    `const fetchCatData = async () => {
      const catSnap = await getDocs(query(collection(db, 'categories'), where('status', '==', 'approved')));
      const dCats = catSnap.docs.map(d => ({id: d.id, ...d.data()}));
      const dCatIds = new Set(dCats.map(c => c.id));
      const aCats = [...staticCategories.filter(c => !dCatIds.has(c.id)), ...dCats];
      setAllCats(aCats);

      const subSnap = await getDocs(query(collection(db, 'subcategories'), where('status', '==', 'approved')));
      const dSubCats = subSnap.docs.map(d => ({id: d.id, ...d.data()}));
      const combinedSubCats = [...predefinedSubCategories];
      dSubCats.forEach(ds => {
        let pc = combinedSubCats.find(c => c.categoryId === ds.categoryId);
        if (pc) {
           if (!pc.subCategories.includes(ds.title)) pc.subCategories.push(ds.title);
        } else {
           combinedSubCats.push({ categoryId: ds.categoryId, subCategories: [ds.title] });
        }
      });
      setAllSubCats(combinedSubCats);
    };
    fetchCatData();
    ${useEffectFetchPoint}`
  );
}

// Replace the inputs with selects in Admin.tsx
const inputTargetStr = `<input className="w-full text-sm p-1 border rounded" value={editRequestData.categoryId || ''} onChange={e => setEditRequestData({...editRequestData, categoryId: e.target.value})} placeholder="Category ID" />
                        <input className="w-full text-sm p-1 border rounded" value={editRequestData.subCategory || ''} onChange={e => setEditRequestData({...editRequestData, subCategory: e.target.value})} placeholder="Sub Category" />`;

const inputReplaceStr = `<select className="w-full text-sm p-1 border rounded bg-white" value={editRequestData.categoryId || ''} onChange={e => setEditRequestData({...editRequestData, categoryId: e.target.value, subCategory: ''})}>
                          <option value="" disabled>ক্যাটাগরি নির্বাচন করুন</option>
                          {allCats.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                        {editRequestData.categoryId === 'blood_donors' ? (
                          <select className="w-full text-sm p-1 border rounded bg-white" value={editRequestData.subCategory || ''} onChange={e => setEditRequestData({...editRequestData, subCategory: e.target.value})}>
                            <option value="" disabled>রক্তের গ্রুপ</option>
                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'রক্তদাতা', 'ব্লাড ব্যাংক'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                          </select>
                        ) : (
                          <select className="w-full text-sm p-1 border rounded bg-white" value={editRequestData.subCategory || ''} onChange={e => setEditRequestData({...editRequestData, subCategory: e.target.value})}>
                            <option value="">সাব-ক্যাটাগরি নির্বাচন করুন (ঐচ্ছিক)</option>
                            {(allSubCats.find(c => c.categoryId === editRequestData.categoryId)?.subCategories || []).map(sub => (
                              <option key={sub} value={sub}>{sub}</option>
                            ))}
                          </select>
                        )}`;

if (code.includes(inputTargetStr)) {
  code = code.replace(inputTargetStr, inputReplaceStr);
  console.log("Successfully replaced Admin dropdowns");
}

fs.writeFileSync('src/Admin.tsx', code);
