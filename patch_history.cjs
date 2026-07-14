const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const historyEffect = `
  const activeViewsCount = [
    isRequestModalOpen, isCategoryModalOpen, isSubCategoryModalOpen,
    isFeedbackModalOpen, isReviewsModalOpen, isLeaderboardOpen,
    !!selectedUserProfile, isContributorProfileOpen, !!selectedBloodGroup,
    !!selectedSubCategory, !!selectedCategory, showCommunity, showMap
  ].filter(Boolean).length;

  const prevActiveViewsCount = useRef(activeViewsCount);

  useEffect(() => {
    // If a new layer was opened, push a history state
    if (activeViewsCount > prevActiveViewsCount.current) {
      const diff = activeViewsCount - prevActiveViewsCount.current;
      for (let i = 0; i < diff; i++) {
        window.history.pushState({ modal: true }, '');
      }
    } 
    // If a layer was closed via UI (not back button), we need to pop the history state
    // But we can't reliably do that without messing up. 
    // Actually, if we leave them, the back button will just require more presses.
    // To fix that, we can use the 'popstate' listener to sync.
    
    prevActiveViewsCount.current = activeViewsCount;
  }, [activeViewsCount]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (activeViewsCount > 0) {
        handleBack();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    isRequestModalOpen, isCategoryModalOpen, isSubCategoryModalOpen,
    isFeedbackModalOpen, isReviewsModalOpen, isLeaderboardOpen,
    selectedUserProfile, isContributorProfileOpen, selectedBloodGroup,
    selectedSubCategory, selectedCategory, showCommunity, showMap
  ]);
`;

content = content.replace(
  `const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);`,
  `const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);\n` + historyEffect
);

fs.writeFileSync('src/App.tsx', content);
console.log("Injected history logic");
