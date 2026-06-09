// Detect chemical formulas like Fe2O3, CuSO4, CaCO3

export const detectFormula = (text = "") => {
  const pattern = /\b([A-Z][a-z]?)(\d*)/g;

  const matches = text.match(pattern);

  if (!matches) return null;

  return matches.join(" ");
};

// better check
export const isFormulaQuestion = (text = "") => {
  const t = text.toLowerCase();
  return (
    /[a-z][0-9]/i.test(text) ||
    t.includes("formula") ||
    t.includes("compound") ||
    t.includes("chemical")
  );
};