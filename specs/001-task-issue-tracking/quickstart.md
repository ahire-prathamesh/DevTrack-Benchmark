# Quickstart & Verification Guide: DevTrack Core Task and Issue Tracking

**Feature**: [001-task-issue-tracking](spec.md)
**Status**: Completed
**Date**: 2026-09-30

This guide documents the procedures for local setup, running the application, and executing automated verification for DevTrack.

---

## 1. Prerequisites

- **Python**: 3.11 or newer
- **Node.js**: 18.0 or newer (with `npm`)
- **Git**: 2.30 or newer
- **OS**: Windows, macOS, or Linux

---

## 2. Environment Setup

### Backend Setup

```powershell
# From repository root:
python -m venv .venv
# On Windows:
.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

pip install -r backend/requirements.txt
```

### Frontend Setup

```powershell
cd frontend
npm install
cd ..
```

---

## 3. Running Locally

### Start Backend Service (Port 5000)

```powershell
# Ensure virtual environment is active:
python -m backend.app
# Backend starts listening at http://localhost:5000
```

### Start Frontend Development Server (Port 5173)

```powershell
cd frontend
npm run dev
# Frontend runs at http://localhost:5173 (proxies /api to http://localhost:5000)
```

---

## 4. Running Automated Tests

### Backend Unit & API Tests (`pytest`)

Executes backend validation, repository SQL operations, and API endpoints against an in-memory/test database:

```powershell
pytest backend/tests -v
```

**Expected Outcome**: 100% of tests pass cleanly with zero warnings or leaked database artifacts.

### Browser End-to-End Tests (`Playwright`)

Validates core user journeys (User Stories 1-4) in a real browser:

- **Database Isolation**: Playwright runs against a dedicated test database (`DEVTRACK_DB=backend/test_e2e.db`), ensuring E2E tests never overwrite or mutate the development database (`backend/devtrack.db`).
- **Server Lifecycle**: `frontend/e2e/playwright.config.ts` manages dev server lifecycles automatically via `webServer`. Alternatively, servers can be pre-launched with `DEVTRACK_DB=backend/test_e2e.db` and reused (`reuseExistingServer: true`).

```powershell
cd frontend
npx playwright test
```

**Expected Outcome**: All browser scenarios execute with full DOM verification, confirmation dialog handling, search/filter verification, and clean test teardown against `test_e2e.db`.

---

## 5. Manual Verification Walkthrough

Follow these steps to manually verify the complete application workflow:

### Step 1: Project Management (User Story 1 - P1)
1. Open `http://localhost:5173` in a browser.
2. Confirm the empty state prompt appears if no projects exist.
3. Click **"New Project"**, enter Name: `Benchmark Project`, Description: `Initial benchmark workspace`, and submit.
4. Verify `Benchmark Project` appears in the projects list with correct timestamps and initial counts (0 tasks, 0 issues).
5. Click **"Edit Project"**, rename to `DevTrack Core Project`, and save. Verify the update renders immediately.

### Step 2: Task Tracking (User Story 2 - P1)
1. Select `DevTrack Core Project` and navigate to the **Tasks** tab.
2. Click **"New Task"**, enter Title: `Create REST endpoints`, Status: `In Progress`, Priority: `High`, and submit.
3. Add a second task: Title: `Draft quickstart docs`, Status: `Todo`, Priority: `Medium`.
4. Add a third task: Title: `Configure SQLite database`, Status: `Done`, Priority: `High`.
5. Select Status Filter: `In Progress`. Verify only `Create REST endpoints` is visible.
6. Reset filter, type `database` in the search box. Verify only `Configure SQLite database` is displayed.
7. Click **"Delete Task"** on a task, confirm the dialog, and verify it is permanently removed.

### Step 3: Issue Tracking (User Story 3 - P2)
1. Navigate to the **Issues** tab within the same project.
2. Click **"New Issue"**, enter Title: `Foreign key constraint not enforced`, Status: `Open`, Priority: `High`, and submit.
3. Edit the issue, change Status to `Resolved`, and save.
4. Verify status filter `Resolved` accurately isolates the issue.
5. Search by title keyword `constraint` and verify instant matching.

### Step 4: Project Dashboard Verification (User Story 4 - P2)
1. Navigate to the **Dashboard** tab.
2. Confirm that:
   - **Total Tasks** equals the active task count.
   - **Tasks by Status** correctly breaks down counts for `Todo`, `In Progress`, and `Done`.
   - **Total Issues** equals the active issue count.
   - **Issues by Status** correctly breaks down counts for `Open`, `In Progress`, and `Resolved`.
   - **Recent Tasks** and **Recent Issues** list the items in descending chronological order.

### Step 5: Cascading Deletion Verification
1. Return to the main **Projects** view.
2. Click **"Delete Project"** for `DevTrack Core Project`.
3. Confirm the deletion prompt.
4. Verify the project disappears. Verify via database or API that all orphaned tasks and issues are completely deleted.
