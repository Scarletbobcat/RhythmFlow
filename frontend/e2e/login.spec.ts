/// <reference types="vite/types/importMeta.d.ts" />
import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const BASE_URL = "http://localhost:5173";

const testEmail = process.env.TEST_EMAIL || "test@gmail.com";
const testPassword = process.env.TEST_PASSWORD || "test123";

test.describe("Login", () => {
  test("Login form displays all required elements", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Check for input fields
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();

    // Check for buttons
    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continue with Google" })
    ).toBeVisible();

    // Check for links
    await expect(page.getByText("Sign up for RhythmFlow")).toBeVisible();
    await expect(page.getByText("Forgot Password")).toBeVisible();
  });

  test("Form validation works for empty fields", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Submit form without entering any data
    await page.getByRole("button", { name: "Log in" }).click();

    // Check for validation messages
    await expect(
      page.getByText(/Please fill in both email and password./i)
    ).toBeVisible();
  });

  test("Password field masks input", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Check password field type
    const passwordField = page.getByLabel(/password/i);
    await expect(passwordField).toHaveAttribute("type", "password");

    // Enter password and verify it's masked
    await passwordField.fill("test123");
    await expect(passwordField).toHaveValue("test123");
    await expect(passwordField).toHaveAttribute("type", "password");
  });

  test("Error displays with invalid credentials", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill("invalid@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");

    // Submit the form
    await page.getByRole("button", { name: "Log in" }).click();

    // Check for error message
    await expect(
      page.getByText(/An error has occurred. Please try again later./i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("Successful login redirects to dashboard", async ({ page }) => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);

    // Fill in valid credentials (this will depend on your test environment)
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);

    // Submit the form
    await page.getByRole("button", { name: "Log in" }).click();

    // Check for redirect to dashboard
    // You can adapt this based on your application's structure
    await expect(page).toHaveURL(`${BASE_URL}/`, { timeout: 5000 });
  });

  test("Navigation to signup page works", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Click sign up link
    await page.getByText("Sign up for RhythmFlow").click();

    // Verify we're on the signup page
    await expect(
      page.getByRole("heading", { name: /Register with RhythmFlow/i })
    ).toBeVisible({ timeout: 3000 });
  });

  test("Navigation to forgot password works", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Click forgot password link
    await page.getByText("Forgot Password").click();

    // Verify we're on the forgot password page
    await expect(
      page.getByRole("heading", { name: /forgot password|reset password/i })
    ).toBeVisible({ timeout: 3000 });
  });
});
