export const toBengaliDigits = (str: string | number | undefined | null) => {
  if (str === undefined || str === null || str === '') return '';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.toString().replace(/[0-9]/g, (w) => bengaliDigits[parseInt(w)]);
};

export const toEnglishDigits = (str: string | number | undefined | null) => {
  if (str === undefined || str === null || str === '') return '';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.toString().replace(/[০-৯]/g, (w) => bengaliDigits.indexOf(w).toString());
};
