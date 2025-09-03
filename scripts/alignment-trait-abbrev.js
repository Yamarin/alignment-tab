// alignment-trait-abbrev.js
// Utility to convert law/moral values to alignment abbreviation (e.g., "LG", "CN")

/**
 * Converts law and moral values to a two-letter alignment abbreviation.
 * @param {number} law - Law axis value (0-44)
 * @param {number} moral - Moral axis value (0-44)
 * @returns {string} Alignment abbreviation (e.g., "LG", "CN", "N")
 */
export function alignmentAbbreviation(law, moral) {
  let lawChar = law >= 30 ? 'L' : law <= 14 ? 'C' : 'N';
  let moralChar = moral >= 30 ? 'G' : moral <= 14 ? 'E' : 'N';
  // Always return two-letter abbreviation, so true neutral is 'NN'
  return lawChar + moralChar;
}
