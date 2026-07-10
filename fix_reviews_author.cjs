const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                      {publicReviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-start gap-3 mb-2">
                            {review.authorAvatar ? (
                              <img src={review.authorAvatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                <UserCircle className="w-6 h-6" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                  {review.name}
                                  {isVerifiedContributor(review.name) && <VerifiedBadge />}
                                </h3>`;

const replace = `                      {publicReviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-start gap-3 mb-2">
                            <div 
                              className={\`flex items-start gap-3 \${review.authorPhone ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}\`}
                              onClick={() => review.authorPhone && setSelectedUserProfile(review.authorPhone)}
                            >
                              {review.authorAvatar ? (
                                <img src={review.authorAvatar} alt={review.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                  <UserCircle className="w-6 h-6" />
                                </div>
                              )}
                              <h3 className="font-semibold text-gray-900 flex items-center mt-2">
                                {review.name}
                                {isVerifiedContributor(review.name) && <VerifiedBadge />}
                              </h3>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-end">`;

code = code.replace(target, replace);
fs.writeFileSync('src/App.tsx', code);
