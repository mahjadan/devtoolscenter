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
      // Set theme in localStorage before page load
      await page.addInitScript((preferredTheme: string) => {
        globalThis.localStorage.setItem("theme", preferredTheme);
      }, theme);

      // Navigate to the correct port (8082)
      await page.goto(`http://localhost:8082${p}`);
      await page.waitForLoadState("networkidle");

      // Ensure theme is properly applied by checking data-theme attribute
      await page.waitForFunction((expectedTheme: string) => {
        const html = document.documentElement;
        const dataTheme = html.getAttribute("data-theme");
        const hasClass =
          expectedTheme === "dark"
            ? html.classList.contains("dark")
            : !html.classList.contains("dark");
        return dataTheme === expectedTheme && hasClass;
      }, theme);

      // Additional wait to ensure CSS custom properties are computed
      await page.waitForTimeout(200);

      // Verify theme is applied by checking computed styles
      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue("--color-bg")
          .trim();
      });

      // Ensure the theme colors are actually applied
      if (theme === "dark") {
        expect(bgColor).toContain("#0b1120"); // Dark theme bg color
      } else {
        expect(bgColor).toContain("#f8fafc"); // Light theme bg color
      }

      await expect(page).toHaveScreenshot(
        `${theme}--${p.replace(/[\/:]+/g, "-")}-linux.png`,
        {
          fullPage: true,
          threshold: 0.3, // Allow for slight rendering differences due to token system
        }
      );
    });
  }
}
