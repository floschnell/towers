/**
 * Transforms a in-game color code into a readable color string which
 * can be used within CSS context.
 *
 * @param {number} colorCode The code of the color.
 * @return {string} Name of the color.
 */
export function getColor(colorCode) {
  const colors = ['orange', 'blue', 'purple', 'pink', '#dd0', 'red', 'green', 'brown'];
  return colors[colorCode];
}
