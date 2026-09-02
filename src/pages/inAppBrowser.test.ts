import { describe, expect, it } from "vitest";
import { detectInAppBrowser } from "./inAppBrowser";

describe("アプリ内ブラウザの検出", () => {
  it("LINEのUAを検出する", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Line/13.7.0";
    expect(detectInAppBrowser(ua)).toBe("LINE");
  });

  it("Yahoo! JAPANアプリのUAを検出する", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 YJApp-IOS jp.co.yahoo.ios.yjtop/4.0";
    expect(detectInAppBrowser(ua)).toBe("Yahoo! JAPAN");
  });

  it("InstagramアプリのUAを検出する", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Instagram 300.0.0.29.110";
    expect(detectInAppBrowser(ua)).toBe("Instagram");
  });

  it("FacebookアプリのUAを検出する", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) [FBAN/FBIOS;FBAV/400.0]";
    expect(detectInAppBrowser(ua)).toBe("Facebook");
  });

  it("通常のブラウザは検出しない", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    expect(detectInAppBrowser(ua)).toBeNull();
  });
});
