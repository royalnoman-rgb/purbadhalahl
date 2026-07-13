const { contacts } = require('./src/data.js');
const dupes = contacts.filter(c => c.id === 'fn4');
console.log(dupes.length);
