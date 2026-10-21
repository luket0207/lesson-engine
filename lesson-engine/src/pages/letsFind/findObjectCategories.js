import SPELLING_CATEGORIES from '../letsSpell/spellingCategories';

const FIND_CATEGORY_IDS = new Set(['animals', 'food', 'clothes']);

export const FIND_OBJECT_CATEGORIES = Object.freeze(
  SPELLING_CATEGORIES.filter((category) => FIND_CATEGORY_IDS.has(category.id)),
);

export function getFindObjectCategory(categoryId) {
  return FIND_OBJECT_CATEGORIES.find((category) => category.id === categoryId);
}

export default FIND_OBJECT_CATEGORIES;
