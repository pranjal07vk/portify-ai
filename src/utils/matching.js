export const matchKeywords = (text, items) => {
  if (!text) return items;

  // Simple keyword matching: count how many tags appear in the text
  const textLower = text.toLowerCase();
  
  const scoredItems = items.map(item => {
    let score = 0;
    item.tags.forEach(tag => {
      if (textLower.includes(tag.toLowerCase())) {
        score += 1;
      }
    });
    return { ...item, score };
  });

  // Sort by score descending
  return scoredItems.sort((a, b) => b.score - a.score);
};

export const generatePortfolioId = () => {
  return Math.random().toString(36).substring(2, 10);
};
