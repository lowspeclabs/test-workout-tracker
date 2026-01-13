
export function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

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
