
/**
 * Reads the value of a CSS variable from the root document element.
 * Useful for accessing theme colors defined in CSS from JavaScript/TypeScript code (e.g., for Canvas charts).
 *
 * @param name - The name of the CSS variable (e.g., "--accent").
 * @returns The trimmed string value of the variable.
 */
export function readCssVar(name: string): string {
  if (typeof window === 'undefined') return ''; // Safety check for SSR or non-browser envs
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Retrieves the current theme tokens (colors) as a JavaScript object.
 * This allows components like ECharts to stay in sync with the CSS-defined theme (Light/Dark mode).
 *
 * @returns An object containing the core color palette.
 */
export function getThemeTokens() {
  return {
    bg: readCssVar("--bg"),
    card: readCssVar("--card"),
    text: readCssVar("--text"),
    muted: readCssVar("--muted"),
    divider: readCssVar("--divider"),
    accent: readCssVar("--accent"),
  };
}
