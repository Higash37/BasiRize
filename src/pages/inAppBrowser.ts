// LINE・Yahoo! JAPANアプリ・Instagram・Facebookなどのアプリ内ブラウザは
// window.print()が動かないことが多い。UAから検出し、外部ブラウザで開き直す
// よう案内するために使う。
const IN_APP_BROWSER_PATTERNS: readonly [RegExp, string][] = [
  [/\bLine\//i, "LINE"],
  [/\bYJApp\b/i, "Yahoo! JAPAN"],
  [/\bInstagram\b/i, "Instagram"],
  [/\bFBAN\b|\bFBAV\b|\bFB_IAB\b/i, "Facebook"],
];

export function detectInAppBrowser(userAgent: string): string | null {
  for (const [pattern, name] of IN_APP_BROWSER_PATTERNS) {
    if (pattern.test(userAgent)) {
      return name;
    }
  }
  return null;
}
