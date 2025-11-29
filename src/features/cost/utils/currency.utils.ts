export const getCurrencySymbol = (currency?: string) => {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    HU: "Ħ", // Fictional currency symbol
  };
  return symbols[currency || "HU"] || currency || "Ħ";
};

