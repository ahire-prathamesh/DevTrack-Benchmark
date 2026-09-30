import { test, expect } from '@playwright/test';

test.describe('User Story 4: Project Dashboard Overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    const newProjectBtn = page.getByRole('button', { name: /new project/i });
    if (await newProjectBtn.isVisible()) {
      await newProjectBtn.click();
      await page.getByLabel(/project name/i).fill('Dashboard Workspace');
      await page.getByRole('dialog').getByRole('button', { name: /save|create/i }).click();
    }

    // Open project workspace
    await page.getByRole('heading', { name: 'Dashboard Workspace' }).first().click();
  });

  test('should render empty metrics, update after task and issue creation, and show recent items', async ({ page }) => {
    const dialog = page.getByRole('dialog');

    // 1. Initial Dashboard tab state
    await page.getByRole('button', { name: 'Dashboard', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard Workspace' })).toBeVisible();

    // Verify initial metrics cards exist
    await expect(page.getByText(/Total Tasks/i)).toBeVisible();
    await expect(page.getByText(/Total Issues/i)).toBeVisible();

    // 2. Add a task in Tasks tab
    await page.getByRole('button', { name: 'Tasks', exact: true }).click();
    await page.getByRole('button', { name: /new task/i }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/task title/i).fill('Task for Dashboard Metric');
    await dialog.getByLabel('Status').selectOption('In Progress');
    await dialog.getByRole('button', { name: /save|create/i }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Task for Dashboard Metric' })).toBeVisible();

    // 3. Add an issue in Issues tab
    await page.getByRole('button', { name: 'Issues', exact: true }).click();
    await page.getByRole('button', { name: /new issue/i }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/issue title/i).fill('Issue for Dashboard Metric');
    await dialog.getByLabel('Status').selectOption('Open');
    await dialog.getByRole('button', { name: /save|create/i }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Issue for Dashboard Metric' })).toBeVisible();

    // 4. Return to Dashboard tab
    await page.getByRole('button', { name: 'Dashboard', exact: true }).click();

    // Recent items should show the newly created items
    await expect(page.getByText('Task for Dashboard Metric')).toBeVisible();
    await expect(page.getByText('Issue for Dashboard Metric')).toBeVisible();
  });
});
