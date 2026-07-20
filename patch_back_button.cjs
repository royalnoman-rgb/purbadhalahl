const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetLogic = `  const prevActiveViewsCount = useRef(activeViewsCount);

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
    selectedSubCategory, selectedCategory, showCommunity, showMap, showTrainTracker
  ]);`;

const replacementLogic = `  const prevActiveViewsCount = useRef(activeViewsCount);

  useEffect(() => {
    // When activeViewsCount increases (a new view/modal is opened), push a state for each step
    if (activeViewsCount > prevActiveViewsCount.current) {
      const diff = activeViewsCount - prevActiveViewsCount.current;
      for (let i = 0; i < diff; i++) {
        window.history.pushState({ dummy: true }, '');
      }
    }
    prevActiveViewsCount.current = activeViewsCount;
  }, [activeViewsCount]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // Whenever back button is pressed, we decrement prevActiveViewsCount to prevent pushing state again
      // and close the top-most view.
      if (activeViewsCount > 0) {
        prevActiveViewsCount.current = activeViewsCount - 1;
        handleBack();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    activeViewsCount,
    isRequestModalOpen, isCategoryModalOpen, isSubCategoryModalOpen,
    isFeedbackModalOpen, isReviewsModalOpen, isLeaderboardOpen,
    selectedUserProfile, isContributorProfileOpen, selectedBloodGroup,
    selectedSubCategory, selectedCategory, showCommunity, showMap, showTrainTracker, searchQuery
  ]);`;

if (code.includes(targetLogic)) {
  code = code.replace(targetLogic, replacementLogic);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Patched back button logic');
} else {
  console.log('Could not find target logic to patch');
}
