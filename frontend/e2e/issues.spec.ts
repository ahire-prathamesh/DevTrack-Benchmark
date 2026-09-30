import { test, expect } from '@playwright/test';

test.describe('User Story 3: Issue Tracking Within a Project', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Ensure at least one project exists
    const newProjectBtn = page.getByRole('button', { name: /new project/i });
    if (await newProjectBtn.isVisible()) {
      await newProjectBtn.click();
      await page.getByLabel(/project name/i).fill('Issue Workspace');
      await page.getByRole('dialog').getByRole('button', { name: /save|create/i }).click();
    }

    // Open project workspace
    await page.getByRole('heading', { name: 'Issue Workspace' }).first().click();
    // Switch to Issues tab
    await page.getByRole('button', { name: 'Issues', exact: true }).click();
  });

  test('should create, search, filter, edit, and delete issues', async ({ page }) => {
    const dialog = page.getByRole('dialog');

    // 1. Create first issue
    await page.getByRole('button', { name: /new issue/i }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/issue title/i).fill('Database timeout on query');
    await dialog.getByLabel(/description/i).fill('Connection pool exhausted under load');
    await dialog.getByLabel('Status').selectOption('In Progress');
    await dialog.getByLabel('Priority').selectOption('High');
    await dialog.getByRole('button', { name: /save|create/i }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByRole('heading', { name: 'Database timeout on query' })).toBeVisible();
    await expect(page.locator('.badge', { hasText: 'In Progress' })).toBeVisible();

    // 2. Create second issue
    await page.getByRole('button', { name: /new issue/i }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/issue title/i).fill('CSS alignment error on navbar');
    await dialog.getByLabel('Status').selectOption('Open');
    await dialog.getByLabel('Priority').selectOption('Low');
    await dialog.getByRole('button', { name: /save|create/i }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByRole('heading', { name: 'CSS alignment error on navbar' })).toBeVisible();

    // 3. Filter by Status
    const statusFilter = page.getByLabel('Filter by status');
    await statusFilter.selectOption('In Progress');
    await expect(page.getByRole('heading', { name: 'Database timeout on query' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'CSS alignment error on navbar' })).not.toBeVisible();

    // Reset filter
    await statusFilter.selectOption('All');
    await expect(page.getByRole('heading', { name: 'CSS alignment error on navbar' })).toBeVisible();

    // 4. Search by Title
    const searchInput = page.getByPlaceholder(/search issues/i);
    await searchInput.fill('timeout');
    await expect(page.getByRole('heading', { name: 'Database timeout on query' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'CSS alignment error on navbar' })).not.toBeVisible();
    await searchInput.fill('');

    // 5. Edit Issue
    await page.getByRole('button', { name: /edit/i }).first().click();
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/issue title/i).fill('Database timeout on query - resolved with index');
    await dialog.getByLabel('Status').selectOption('Resolved');
    await dialog.getByRole('button', { name: /save|update/i }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByRole('heading', { name: 'Database timeout on query - resolved with index' })).toBeVisible();

    // 6. Delete Issue with confirmation
    await page.getByRole('button', { name: /delete/i }).first().click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Delete Issue' }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByRole('heading', { name: 'Database timeout on query - resolved with index' })).not.toBeVisible();
  });
});
