export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // spaces → dash
    .replace(/[^\w-]+/g, "")    // remove special chars
    .replace(/--+/g, "-");      // remove double dashes
};
