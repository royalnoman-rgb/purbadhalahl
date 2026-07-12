export const toBengaliDigits = (str: string | undefined | null) => {
  if (!str) return str || '';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.toString().replace(/[0-9]/g, (w) => bengaliDigits[parseInt(w)]);
};

export const toEnglishDigits = (str: string | undefined | null) => {
  if (!str) return str || '';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.toString().replace(/[০-৯]/g, (w) => bengaliDigits.indexOf(w).toString());
};
