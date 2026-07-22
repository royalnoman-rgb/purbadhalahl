const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);`;

const repl1 = `  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId, subCategory } = useParams();

  const [_selectedCategory, _setSelectedCategory] = useState<Category | null>(null);
  const [_selectedSubCategory, _setSelectedSubCategory] = useState<string | null>(null);

  const selectedCategory = _selectedCategory;
  const setSelectedCategory = (cat: Category | null) => {
    _setSelectedCategory(cat);
    if (cat) navigate('/category/' + cat.id);
    else navigate('/');
  };

  const selectedSubCategory = _selectedSubCategory;
  const setSelectedSubCategory = (sub: string | null) => {
    _setSelectedSubCategory(sub);
    if (sub && selectedCategory) navigate('/category/' + selectedCategory.id + '/' + encodeURIComponent(sub));
    else if (selectedCategory) navigate('/category/' + selectedCategory.id);
    else navigate('/');
  };`;

const target2 = `  const [showMap, setShowMap] = useState(false);
  const [showTrainTracker, setShowTrainTracker] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);`;

const repl2 = `  const [_showMap, _setShowMap] = useState(false);
  const [showTrainTracker, setShowTrainTracker] = useState(false);
  const [_showCommunity, _setShowCommunity] = useState(false);

  const showMap = _showMap;
  const setShowMap = (val: boolean) => {
    _setShowMap(val);
    if (val) navigate('/map');
    else navigate('/');
  };

  const showCommunity = _showCommunity;
  const setShowCommunity = (val: boolean) => {
    _setShowCommunity(val);
    if (val) navigate('/community');
    else navigate('/');
  };`;

if(code.includes(target1) && code.includes(target2)) {
  code = code.replace(target1, repl1);
  code = code.replace(target2, repl2);
  fs.writeFileSync('src/App.tsx', code);
  console.log("States updated");
} else {
  console.log("Failed to find state blocks");
}
