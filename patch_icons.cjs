const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `Bus, Stethoscope, Wrench, GraduationCap, Store, Landmark, Newspaper, Plus, Edit3, Navigation, Lock, MessageCircle, Award, Trophy, UserCircle, Star, ThumbsUp, Send, Bell, BadgeCheck, Heart`,
  `Bus, Stethoscope, Wrench, GraduationCap, Store, Landmark, Newspaper, Plus, Edit3, Navigation, Lock, MessageCircle, Award, Trophy, UserCircle, Star, ThumbsUp, Send, Bell, BadgeCheck, Heart, Trash2`
);

fs.writeFileSync(file, code);
