const fs = require('fs');
let content = fs.readFileSync('src/Admin.tsx', 'utf8');

const target1 = "  const [showNotifications, setShowNotifications] = useState(false);";
const replacement1 = `  const [showNotifications, setShowNotifications] = useState(false);
  const adminNotifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminNotifRef.current && !adminNotifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);`;

if (content.includes(target1) && !content.includes('adminNotifRef')) {
  content = content.replace(target1, replacement1);
}

const target2 = '<div className="relative">';
// Replace only the first occurrence in the header (which is the notif container)
// We will look for <div className="relative"> right before <button onClick={() => { setShowNotifications(!showNotifications);
const targetRegex = /<div className="relative">\s*<button \s*onClick=\{\(\) => \{\s*setShowNotifications\(!showNotifications\);/;
const replacement2 = `<div className="relative" ref={adminNotifRef}>\n            <button \n              onClick={() => {\n                setShowNotifications(!showNotifications);`;
if (targetRegex.test(content)) {
  content = content.replace(targetRegex, replacement2);
}

// Ensure responsive class for notification dropdown
const dropdownTarget = '<div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800">';
const dropdownReplacement = '<div className="absolute right-0 sm:right-0 mt-2 w-[90vw] sm:w-80 max-w-[320px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800 -mr-16 sm:mr-0">';
if (content.includes(dropdownTarget)) {
  content = content.replace(dropdownTarget, dropdownReplacement);
} else {
  // Try fallback in case class changed
  const fallbackRegex = /<div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50[^"]*">/;
  const fallbackReplacement = '<div className="absolute right-[-40px] sm:right-0 mt-2 w-[90vw] sm:w-80 max-w-[320px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800">';
  if (fallbackRegex.test(content)) {
    content = content.replace(fallbackRegex, fallbackReplacement);
  }
}

fs.writeFileSync('src/Admin.tsx', content);
