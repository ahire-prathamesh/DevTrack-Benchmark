import { test, expect } from '@playwright/test';

test.describe('User Story 2: Task Tracking Within a Project', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Ensure at least one project exists
    const newProjectBtn = page.getByRole('button', { name: /new project/i });
    if (await newProjectBtn.isVisible()) {
      await newProjectBtn.click();
      await page.getByLabel(/project name/i).fill('Task Workspace');
      await page.getByRole('dialog').getByRole('button', { name: /save|create/i }).click();
    }

    // Open project workspace
    await page.getByRole('heading', { name: 'Task Workspace' }).first().click();
    // Switch to Tasks tab
    await page.getByRole('button', { name: 'Tasks', exact: true }).click();
  });

  test('should create, search, filter, edit, and delete tasks', async ({ page }) => {
    const dialog = page.getByRole('dialog');

    // 1. Create first task
    await page.getByRole('button', { name: /new task/i }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/task title/i).fill('Setup backend models');
    await dialog.getByLabel(/description/i).fill('Define Task and Issue dataclasses');
    await dialog.getByLabel('Status').selectOption('In Progress');
    await dialog.getByLabel('Priority').selectOption('High');
    await dialog.getByRole('button', { name: /save|create/i }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByRole('heading', { name: 'Setup backend models' })).toBeVisible();
    await expect(page.locator('.badge', { hasText: 'In Progress' })).toBeVisible();

    // 2. Create second task
    await page.getByRole('button', { name: /new task/i }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/task title/i).fill('Write E2E tests');
    await dialog.getByLabel('Status').selectOption('Todo');
    await dialog.getByLabel('Priority').selectOption('Medium');
    await dialog.getByRole('button', { name: /save|create/i }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByRole('heading', { name: 'Write E2E tests' })).toBeVisible();

    // 3. Filter by Status
    const statusFilter = page.getByLabel('Filter by status');
    await statusFilter.selectOption('In Progress');
    await expect(page.getByRole('heading', { name: 'Setup backend models' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Write E2E tests' })).not.toBeVisible();

    // Reset filter
    await statusFilter.selectOption('All');
    await expect(page.getByRole('heading', { name: 'Write E2E tests' })).toBeVisible();

    // 4. Search by Title
    const searchInput = page.getByPlaceholder(/search tasks/i);
    await searchInput.fill('backend');
    await expect(page.getByRole('heading', { name: 'Setup backend models' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Write E2E tests' })).not.toBeVisible();
    await searchInput.fill('');

    // 5. Edit Task
    await page.getByRole('button', { name: /edit/i }).first().click();
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/task title/i).fill('Setup backend models & schema');
    await dialog.getByLabel('Status').selectOption('Done');
    await dialog.getByRole('button', { name: /save|update/i }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByRole('heading', { name: 'Setup backend models & schema' })).toBeVisible();

    // 6. Delete Task with confirmation
    await page.getByRole('button', { name: /delete/i }).first().click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Delete Task' }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByRole('heading', { name: 'Setup backend models & schema' })).not.toBeVisible();
  });
});
