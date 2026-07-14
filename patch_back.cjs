const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const backFunction = `
  const handleBack = () => {
    if (isRequestModalOpen) setIsRequestModalOpen(false);
    else if (isCategoryModalOpen) setIsCategoryModalOpen(false);
    else if (isSubCategoryModalOpen) setIsSubCategoryModalOpen(false);
    else if (isFeedbackModalOpen) setIsFeedbackModalOpen(false);
    else if (isReviewsModalOpen) setIsReviewsModalOpen(false);
    else if (isLeaderboardOpen) setIsLeaderboardOpen(false);
    else if (selectedUserProfile) setSelectedUserProfile(null);
    else if (selectedBloodGroup) setSelectedBloodGroup(null);
    else if (selectedSubCategory) setSelectedSubCategory(null);
    else if (selectedCategory) setSelectedCategory(null);
    else if (isContributorProfileOpen) setIsContributorProfileOpen(false);
    else if (showCommunity) setShowCommunity(false);
    else if (showMap) setShowMap(false);
  };
`;

// Insert it after useState declarations (around line 197)
content = content.replace(
  `const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);`,
  `const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);\n` + backFunction
);

fs.writeFileSync('src/App.tsx', content);
console.log("Injected handleBack");
