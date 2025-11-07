import { test, expect } from "@playwright/test";
const pages = [
  "/",
  "/about/",
  "/contact/",
  "/privacy-policy/",
  "/terms-of-service/",
  "/base64-encode-decode/",
  "/json-formatter/",
  "/jsonpath-tester/",
  "/jwt-decoder/",
  "/regex-tester/",
  "/url-encode-decode/",
  "/uuid-generator/",
  "/yaml-to-json/",
  "/blog/",
  "/blog/jsonpath-expressions-guide/",
  "/blog/jwt-tokens-explained/",
  "/blog/mastering-regular-expressions/",
  "/blog/understanding-base64-encoding/",
  "/blog/understanding-json-formatting/",
  "/blog/understanding-url-encoding/",
  "/blog/understanding-uuid-generation/",
  "/blog/yaml-vs-json/",
];

const themes = ["light", "dark"] as const;

for (const theme of themes) {
  for (const p of pages) {
    test(`${theme} snapshot ${p}`, async ({ page }) => {
      await page.addInitScript((preferredTheme: string) => {
        globalThis.localStorage.setItem("theme", preferredTheme);
      }, theme);

      await page.goto(`http://localhost:8080${p}`);
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveScreenshot(
        `${theme}-${p.replace(/[\/:]+/g, "_")}.png`,
        {
          fullPage: true,
        }
      );
    });
  }
}
