import { expect, test } from "@playwright/test";

test("homepage highlights the first milestone", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /customer feedback for teams that need answers fast/i
    })
  ).toBeVisible();
  await expect(page.getByText(/foundation first/i)).toBeVisible();
});
