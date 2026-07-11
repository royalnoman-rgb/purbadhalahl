const fs = require('fs');
let code = fs.readFileSync('src/Admin.tsx', 'utf8');

const target = `const VerifiedBadge = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[16px] h-[16px] text-[#0866FF] shrink-0 inline-block align-middle ml-1 -mt-0.5"
    title="Verified Contributor"
  >
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <path d="M10 15.586l-3.293-3.293 1.414-1.414L10 12.758l5.879-5.879 1.414 1.414L10 15.586z" fill="white" />
  </svg>
);`;

const replace = `const VerifiedBadge = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (badgeRef.current && !badgeRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="relative inline-block align-middle ml-1 -mt-0.5" ref={badgeRef}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[16px] h-[16px] shrink-0 cursor-pointer"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTooltip(!showTooltip); }}
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M12 0.5C12 0.5 13.0623 3.01894 14.806 3.61907C16.6344 4.24838 19.349 3.51868 19.349 3.51868C19.349 3.51868 19.3871 6.30907 20.6558 7.74723C21.8596 9.11202 23.5 10.5187 23.5 10.5187C23.5 10.5187 21.055 11.8398 20.6558 13.5C20.2195 15.3147 21.3653 17.893 21.3653 17.893C21.3653 17.893 18.6667 18.0673 17.2798 19.2612C15.8203 20.5175 14.806 23.0187 14.806 23.0187C14.806 23.0187 12 21.3 12 21.3C12 21.3 9.194 23.0187 9.194 23.0187C9.194 23.0187 8.1797 20.5175 6.7202 19.2612C5.3333 18.0673 2.6347 17.893 2.6347 17.893C2.6347 17.893 3.7805 15.3147 3.3442 13.5C2.945 11.8398 0.5 10.5187 0.5 10.5187C0.5 10.5187 2.1404 9.11202 3.3442 7.74723C4.6129 6.30907 4.651 3.51868 4.651 3.51868C4.651 3.51868 7.3656 4.24838 9.194 3.61907C10.9377 3.01894 12 0.5 12 0.5Z" fill="#0866FF"/>
        <path d="M10.125 15.0833L6.375 11.3333L7.55417 10.1542L10.125 12.725L16.6125 6.2375L17.7917 7.41667L10.125 15.0833Z" fill="white"/>
      </svg>
      {showTooltip && (
        <div 
          className="absolute z-50 w-56 p-3 mt-2 -ml-28 text-[11px] font-normal leading-relaxed text-left text-gray-800 bg-white border border-gray-100 rounded-lg shadow-xl left-1/2 top-full"
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          Accounts with a verified badge have been authenticated and can be Meta Verified subscribers or notable persons or brands.
          <div className="absolute w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45 -top-[7px] left-1/2 -ml-[6px]"></div>
        </div>
      )}
    </div>
  );
};`;

code = code.replace(target, replace);
fs.writeFileSync('src/Admin.tsx', code);
