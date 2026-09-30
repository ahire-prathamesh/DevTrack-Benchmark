import { test, expect } from '@playwright/test';

test.describe('User Story 1: Project Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
  });

  test('should create, list, edit, and delete a project with confirmation', async ({ page }) => {
    // 1. Initial State: Check for empty state or create button
    const newProjectBtn = page.getByRole('button', { name: /new project/i });
    await expect(newProjectBtn).toBeVisible();

    // 2. Create Project
    await newProjectBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel(/project name/i).fill('Alpha Benchmark');
    await page.getByLabel(/description/i).fill('Workspace for benchmarking');
    await page.getByRole('dialog').getByRole('button', { name: /save|create/i }).click();

    // Verify project appears in list
    await expect(page.getByRole('heading', { name: 'Alpha Benchmark' })).toBeVisible();
    await expect(page.getByText('Workspace for benchmarking')).toBeVisible();

    // 3. Edit Project
    await page.getByRole('button', { name: /edit/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByLabel(/project name/i).fill('Alpha Benchmark Updated');
    await page.getByRole('dialog').getByRole('button', { name: /save|update/i }).click();

    await expect(page.getByRole('heading', { name: 'Alpha Benchmark Updated' })).toBeVisible();

    // 4. Delete Project with Confirmation
    await page.getByRole('button', { name: /delete/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/are you sure you want to delete/i)).toBeVisible();

    // Confirm deletion
    await page.getByRole('dialog').getByRole('button', { name: 'Delete Project' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Verify project is removed
    await expect(page.getByRole('heading', { name: 'Alpha Benchmark Updated' })).not.toBeVisible();
  });

  test('should show validation error when submitting empty project name', async ({ page }) => {
    await page.getByRole('button', { name: /new project/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: /save|create/i }).click();

    await expect(page.getByText(/project name is required/i)).toBeVisible();
  });
});
