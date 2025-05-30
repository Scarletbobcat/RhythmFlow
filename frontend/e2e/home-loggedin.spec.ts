import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
  });

  test("has a working logout button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Log Out" })).toBeVisible();
    await page.getByRole("button", { name: "Log Out" }).click();
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test("has working search functionality", async ({ page }) => {
    const searchInput = page.getByPlaceholder("What do you want to listen to?");
    await searchInput.fill("test");

    await searchInput.press("Enter");

    await expect(page).toHaveURL(`${BASE_URL}/search?query=test`);
    await expect(page.getByText("test")).toBeVisible();
    await expect(page.getByText("someone")).toBeVisible();
  });

  test("displays trending tracks", async ({ page }) => {
    // Check if trending tracks section is visible
    await expect(page.getByText("Trending")).toBeVisible();

    // Check if at least one track is displayed
    await page
      .locator("div")
      .filter({ hasText: /^testTest Artist$/ })
      .first()
      .click();
  });
});
