const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const perfectHistory = `
  const activeViewsCount = [
    isRequestModalOpen, isCategoryModalOpen, isSubCategoryModalOpen,
    isFeedbackModalOpen, isReviewsModalOpen, isLeaderboardOpen,
    !!selectedUserProfile, isContributorProfileOpen, !!selectedBloodGroup,
    !!selectedSubCategory, !!selectedCategory, showCommunity, showMap
  ].filter(Boolean).length;

  const prevActiveViewsCount = useRef(activeViewsCount);

  useEffect(() => {
    if (activeViewsCount === 1 && prevActiveViewsCount.current === 0) {
      if (window.history.state?.dummy !== true) {
        window.history.pushState({ dummy: true }, '');
      }
    }
    prevActiveViewsCount.current = activeViewsCount;
  }, [activeViewsCount]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (activeViewsCount > 0) {
        handleBack();
        if (activeViewsCount > 1) {
          window.history.pushState({ dummy: true }, '');
        }
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

// Need to replace the old historyEffect we just injected
content = content.replace(
  /const activeViewsCount = \[[\s\S]*?showCommunity, showMap\n  \]\);/m,
  perfectHistory.trim()
);

fs.writeFileSync('src/App.tsx', content);
console.log("Injected perfect history logic");
