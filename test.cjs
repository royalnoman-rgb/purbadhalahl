const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function tE(str) {
  if (!str) return str || '';
  return str.toString().replace(/[০-৯]/g, (w) => bengaliDigits.indexOf(w).toString());
}
function tB(str) {
  if (!str) return str || '';
  return str.toString().replace(/[0-9]/g, (w) => bengaliDigits[parseInt(w)]);
}
console.log(tB('01711'));
console.log(tE('০১৭১১'));
