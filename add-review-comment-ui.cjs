const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                              <button
                                onClick={() => handleReviewReaction(review, 'love')}
                                className={\`flex items-center gap-1 hover:text-red-500 transition-colors \${review.lovesArray?.includes(getUserId()) ? 'text-red-500' : ''}\`}
                              >
                                <Heart className={\`w-4 h-4 \${review.lovesArray?.includes(getUserId()) ? 'fill-red-500 text-red-500' : ''}\`} />
                                <span>{review.lovesArray?.length > 0 ? review.lovesArray.length : 'লাভ'}</span>
                              </button>
                            </div>
                          </div>
                        </div>`;

const replaceStr = `                              <button
                                onClick={() => handleReviewReaction(review, 'love')}
                                className={\`flex items-center gap-1 hover:text-red-500 transition-colors \${review.lovesArray?.includes(getUserId()) ? 'text-red-500' : ''}\`}
                              >
                                <Heart className={\`w-4 h-4 \${review.lovesArray?.includes(getUserId()) ? 'fill-red-500 text-red-500' : ''}\`} />
                                <span>{review.lovesArray?.length > 0 ? review.lovesArray.length : 'লাভ'}</span>
                              </button>
                              
                              <button
                                onClick={() => setExpandedReviewComments(prev => 
                                  prev.includes(review.id) ? prev.filter(id => id !== review.id) : [...prev, review.id]
                                )}
                                className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>{review.comments?.length || 'কমেন্ট'}</span>
                              </button>
                            </div>
                          </div>
                          
                          {/* Comments Section */}
                          {expandedReviewComments.includes(review.id) && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <div className="space-y-3 mb-3">
                                {review.comments?.map((comment: any) => (
                                  <div key={comment.id} className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                      {comment.authorAvatar ? (
                                        <img src={comment.authorAvatar} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <UserCircle className="w-4 h-4 text-slate-400" />
                                      )}
                                    </div>
                                    <div className="bg-slate-50 px-3 py-2 rounded-xl rounded-tl-none flex-1">
                                      <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-xs font-semibold text-slate-800">{comment.authorName}</span>
                                        <span className="text-[10px] text-slate-400">
                                          {new Date(comment.createdAt).toLocaleDateString('bn-BD')}
                                        </span>
                                      </div>
                                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{comment.text}</p>
                                    </div>
                                  </div>
                                ))}
                                {(!review.comments || review.comments.length === 0) && (
                                  <div className="text-xs text-slate-500 text-center py-2">
                                    কোনো কমেন্ট নেই। প্রথম কমেন্ট করুন!
                                  </div>
                                )}
                              </div>
                              
                              {contributorPhone ? (
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={reviewCommentTexts[review.id] || ''}
                                    onChange={(e) => setReviewCommentTexts(prev => ({...prev, [review.id]: e.target.value}))}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleReviewComment(review.id);
                                      }
                                    }}
                                    placeholder="আপনার কমেন্ট লিখুন..."
                                    className="flex-1 px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                  />
                                  <button
                                    onClick={() => handleReviewComment(review.id)}
                                    disabled={!reviewCommentTexts[review.id]?.trim()}
                                    className="p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                                  >
                                    <Send className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-xs text-slate-500 text-center py-2 bg-slate-50 rounded-lg">
                                  কমেন্ট করতে হলে লগইন করুন
                                </div>
                              )}
                            </div>
                          )}
                          
                        </div>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Successfully replaced UI');
} else {
  console.log('Target string not found!');
}
