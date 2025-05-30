import { test as setup, expect } from "@playwright/test";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env" });

const BASE_URL = "http://localhost:5173";
const testEmail = process.env.TEST_EMAIL || "test@gmail.com";
const testPassword = process.env.TEST_PASSWORD || "test123";
const authFile = "playwright/.auth/user.json";

setup("Login Setup", async ({ page }) => {
  // Make sure the directory exists
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel(/email/i).fill(testEmail);
  await page.getByLabel(/password/i).fill(testPassword);
  await page.getByRole("button", { name: "Log in" }).click();

  // Wait until we're logged in
  await expect(page).toHaveURL(`${BASE_URL}/`);

  // Save storage state to file
  await page.context().storageState({ path: authFile });
});
