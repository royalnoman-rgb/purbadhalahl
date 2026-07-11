const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const loginFormEnd = `                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-medium flex justify-center items-center transition-colors"
                    >
                      লগইন করুন
                    </button>
                  </form>`;

const loginSocialButtons = `                  <div className="mt-6 flex flex-col gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">অথবা</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleSocialLogin(googleProvider)} className="w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-gray-700 font-medium flex justify-center items-center gap-2 transition-colors">
                      <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Google দিয়ে লগইন করুন
                    </button>
                    <button type="button" onClick={() => handleSocialLogin(facebookProvider)} className="w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166FE5] border border-transparent rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook দিয়ে লগইন করুন
                    </button>
                  </div>`;

code = code.replace(loginFormEnd, loginFormEnd + '\\n' + loginSocialButtons);

const regFormEnd = `                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-medium flex justify-center items-center transition-colors"
                    >
                      প্রোফাইল সেভ করুন
                    </button>
                  </form>`;

const regSocialButtons = `                  {!contributorName && (
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">অথবা</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleSocialLogin(googleProvider)} className="w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-gray-700 font-medium flex justify-center items-center gap-2 transition-colors">
                      <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Google দিয়ে একাউন্ট তৈরি করুন
                    </button>
                    <button type="button" onClick={() => handleSocialLogin(facebookProvider)} className="w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166FE5] border border-transparent rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook দিয়ে একাউন্ট তৈরি করুন
                    </button>
                  </div>
                  )}`;

code = code.replace(regFormEnd, regFormEnd + '\\n' + regSocialButtons);

fs.writeFileSync('src/App.tsx', code);
