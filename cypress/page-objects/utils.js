export const createButtonSelector = (label) => `button[aria-label="${label}"]`;

export const capitalize = (string) => {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};