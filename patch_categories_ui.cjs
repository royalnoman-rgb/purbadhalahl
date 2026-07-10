const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `            {allCategories.map((category) => {
              const IconComponent = iconMap[category.iconName] || Building2;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className={\`\${category.color} rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50\`}
                >
                  <IconComponent className="w-10 h-10 mb-1" strokeWidth={1.5} />
                  <span className="text-sm sm:text-base font-medium text-center">{category.title}</span>
                </button>
              );
            })}`;

const replacement = `            {allCategories.map((category) => {
              const IconComponent = iconMap[category.iconName] || Building2;
              return (
                <div key={category.id} className="relative group">
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={\`\${category.color} w-full h-full rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50\`}
                  >
                    <IconComponent className="w-10 h-10 mb-1" strokeWidth={1.5} />
                    <span className="text-sm sm:text-base font-medium text-center">{category.title}</span>
                  </button>
                  {isAdmin && !['fire', 'police', 'ambulance', 'hospital', 'blood', 'palli_bidyut', 'desco', 'wasa', 'journalist'].includes(category.id) && (
                    <button 
                      onClick={(e) => handleDeleteCategoryApp(category.id, e)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
