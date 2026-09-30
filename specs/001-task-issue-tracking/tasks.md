# Tasks: DevTrack Baseline Task and Issue Tracking

**Feature**: [001-task-issue-tracking](spec.md)
**Plan**: [plan.md](plan.md)
**Status**: Ready for Implementation

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency configuration, and base toolchains.

- [X] T001 Configure project `.gitignore` to exclude virtual environments (`.venv/`), local SQLite databases (`*.db`, `backend/devtrack.db`, `backend/test_e2e.db`), Python caches (`__pycache__/`, `.pytest_cache/`), and Node build artifacts (`node_modules/`, `dist/`, `playwright-report/`) in `.gitignore`
- [X] T002 [P] Define backend dependencies (`Flask==3.0.*`, `Flask-Cors==4.0.*`, `pytest==8.0.*`, `pytest-cov==4.1.*`) in `backend/requirements.txt`
- [X] T003 [P] Initialize frontend package configuration with React 18, Vite, TypeScript, and Playwright (`@playwright/test`) in `frontend/package.json` and strict compiler options in `frontend/tsconfig.json`
- [X] T004 [P] Configure Vite dev server with proxy forwarding `/api` requests to `http://localhost:5000` in `frontend/vite.config.ts`
- [X] T005 [P] Configure Playwright E2E runner with automated `webServer` lifecycle commands, dedicated test database `DEVTRACK_DB=backend/test_e2e.db`, and base URL in `frontend/e2e/playwright.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database connections, domain models, server framework, and shared UI design system.

⚠️ **CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Implement SQLite connection factory with `PRAGMA foreign_keys = ON;` and DDL table initializer in `backend/db.py`
- [X] T007 [P] Implement environment configuration loader supporting `DEVTRACK_DB` path (defaulting to `backend/devtrack.db`) and port settings in `backend/config.py`
- [X] T008 [P] Implement core domain data classes (`Project`, `Task`, `Issue`) in `backend/models.py`
- [X] T009 Implement pytest test harness with isolated `:memory:` database fixture and Flask test client in `backend/tests/conftest.py`
- [X] T010 Implement database schema constraint and cascading delete (`ON DELETE CASCADE`) tests in `backend/tests/test_db.py`
- [X] T011 Implement Flask application factory with CORS configuration, blueprint registration, and standardized error envelope formatting (`{ "error": { "code": "...", "message": "...", "details": [...] } }`) in `backend/app.py`
- [X] T012 [P] Define TypeScript interfaces for `Project`, `Task`, `Issue`, `DashboardData`, and `ApiError` in `frontend/src/api/types.ts`
- [X] T013 [P] Implement typed REST API client with fetch wrapper and error envelope handling in `frontend/src/api/client.ts`
- [X] T014 [P] Implement global CSS design system tokens, typography, CSS reset, layout utilities, and responsive breakpoints in `frontend/src/index.css`
- [X] T015 [P] Implement accessible delete confirmation dialog component in `frontend/src/components/ConfirmationModal.tsx`
- [X] T016 [P] Implement status and priority badge chip components in `frontend/src/components/StatusBadge.tsx`

**Checkpoint**: Foundation ready — all core models, DB connections, API client wrappers, and test fixtures are operational.

---

## Phase 3: User Story 1 - Project Management (Priority: P1) 🎯 MVP

**Goal**: Enable developer to create, list, view, edit, and delete projects with confirmation and cascading removal.

**Independent Test**: Create a project with name and description, verify it in the project list, edit its name, and delete it with confirmation dialog handling.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T017 [P] [US1] Write backend API tests for Project CRUD, duplicate handling, and validation (`name` required 1-100 characters, non-whitespace; `description` optional max 2000 chars) in `backend/tests/test_projects_api.py`
- [X] T018 [P] [US1] Write Playwright E2E browser test verifying Project creation, listing, editing, and deletion with confirmation in `frontend/e2e/projects.spec.ts`

### Implementation for User Story 1

- [X] T019 [US1] Implement Project SQL repository methods (`list_projects`, `get_project_by_id`, `create_project`, `update_project`, `delete_project`) enforcing constraints (`name TEXT NOT NULL CHECK (length(trim(name)) > 0)`) in `backend/repository.py`
- [X] T020 [US1] Implement Project REST endpoints (`GET /api/projects`, `POST /api/projects`, `GET /api/projects/<id>`, `PUT /api/projects/<id>` with full replacement semantics, `DELETE /api/projects/<id>`) in `backend/routes/projects.py`
- [X] T021 [P] [US1] Implement `ProjectModal.tsx` create/edit form modal with client validation feedback in `frontend/src/components/ProjectModal.tsx`
- [X] T022 [P] [US1] Implement `ProjectCard.tsx` displaying project name, description, timestamps, and edit/delete actions in `frontend/src/components/ProjectCard.tsx`
- [X] T023 [US1] Implement `ProjectsPage.tsx` listing all projects with empty-state guide in `frontend/src/pages/ProjectsPage.tsx`
- [X] T024 [US1] Implement application layout, header navigation, and view switching in `frontend/src/components/Header.tsx` and `frontend/src/App.tsx`

**Checkpoint**: User Story 1 is fully functional and testable independently (MVP Complete).

---

## Phase 4: User Story 2 - Task Tracking Within a Project (Priority: P1)

**Goal**: Enable developer to create, view, update, delete, status-filter, and title-search tasks within a project.

**Independent Test**: Create tasks under a project, transition status ('Todo' -> 'In Progress' -> 'Done'), filter by status, search by title, and delete a task with confirmation.

### Tests for User Story 2

- [X] T025 [P] [US2] Write backend API tests for Task CRUD, status filter (`?status=`), title search (`?search=`), and validation in `backend/tests/test_tasks_api.py`
- [X] T026 [P] [US2] Write Playwright E2E browser test for Task creation, status filter dropdown, title search input, editing, and deletion in `frontend/e2e/tasks.spec.ts`

### Implementation for User Story 2

- [X] T027 [US2] Implement Task SQL repository methods (`list_tasks_by_project`, `get_task_by_id`, `create_task`, `update_task`, `delete_task`) enforcing constraints (`title TEXT NOT NULL CHECK (length(trim(title)) > 0)`, `status IN ('Todo', 'In Progress', 'Done')` default `'Todo'`, `priority IN ('Low', 'Medium', 'High')` default `'Medium'`) in `backend/repository.py`
- [X] T028 [US2] Implement Task REST endpoints (`GET /api/projects/<project_id>/tasks`, `POST /api/projects/<project_id>/tasks`, `GET /api/tasks/<id>`, `PUT /api/tasks/<id>` with full replacement returning `project_id`, `DELETE /api/tasks/<id>`) in `backend/routes/tasks.py`
- [X] T029 [P] [US2] Implement `TaskModal.tsx` create/edit form modal with status and priority selectors in `frontend/src/components/TaskModal.tsx`
- [X] T030 [P] [US2] Implement `TaskList.tsx` table/card view with real-time title search and status dropdown filtering in `frontend/src/components/TaskList.tsx`
- [X] T031 [US2] Integrate Task tab into project detail view container in `frontend/src/pages/ProjectDetailPage.tsx`

**Checkpoint**: User Stories 1 and 2 are fully functional and independently testable.

---

## Phase 5: User Story 3 - Issue Tracking Within a Project (Priority: P2)

**Goal**: Enable developer to create, view, update, delete, status-filter, and title-search issues within a project.

**Independent Test**: Create issues under a project, transition status ('Open' -> 'In Progress' -> 'Resolved'), filter by status, search by title, and delete an issue with confirmation.

### Tests for User Story 3

- [X] T032 [P] [US3] Write backend API tests for Issue CRUD, status filter (`?status=`), title search (`?search=`), and validation in `backend/tests/test_issues_api.py`
- [X] T033 [P] [US3] Write Playwright E2E browser test for Issue creation, status filter dropdown, title search input, editing, and deletion in `frontend/e2e/issues.spec.ts`

### Implementation for User Story 3

- [X] T034 [US3] Implement Issue SQL repository methods (`list_issues_by_project`, `get_issue_by_id`, `create_issue`, `update_issue`, `delete_issue`) enforcing constraints (`title TEXT NOT NULL CHECK (length(trim(title)) > 0)`, `status IN ('Open', 'In Progress', 'Resolved')` default `'Open'`, `priority IN ('Low', 'Medium', 'High')` default `'Medium'`) in `backend/repository.py`
- [X] T035 [US3] Implement Issue REST endpoints (`GET /api/projects/<project_id>/issues`, `POST /api/projects/<project_id>/issues`, `GET /api/issues/<id>`, `PUT /api/issues/<id>` with full replacement returning `project_id`, `DELETE /api/issues/<id>`) in `backend/routes/issues.py`
- [X] T036 [P] [US3] Implement `IssueModal.tsx` create/edit form modal with status and priority selectors in `frontend/src/components/IssueModal.tsx`
- [X] T037 [P] [US3] Implement `IssueList.tsx` table/card view with real-time title search and status dropdown filtering in `frontend/src/components/IssueList.tsx`
- [X] T038 [US3] Integrate Issue tab into project detail view container in `frontend/src/pages/ProjectDetailPage.tsx`

**Checkpoint**: User Stories 1, 2, and 3 work seamlessly and independently.

---

## Phase 6: User Story 4 - Project Dashboard Overview (Priority: P2)

**Goal**: Provide project dashboard view aggregating total tasks, tasks by status, total issues, issues by status, and lists of up to 5 recent tasks and 5 recent issues.

**Independent Test**: Open project dashboard, verify task/issue total counts and status breakdown match active data, and confirm recent lists show up to 5 items sorted newest first.

### Tests for User Story 4

- [X] T039 [P] [US4] Write backend API integration tests for Dashboard endpoint verifying accurate count aggregations and max 5 recent tasks/issues limit in `backend/tests/test_dashboard_api.py`
- [X] T040 [P] [US4] Write Playwright E2E browser test for Dashboard metrics rendering, empty-state counters, and recent item display in `frontend/e2e/dashboard.spec.ts`

### Implementation for User Story 4

- [X] T041 [US4] Implement Dashboard SQL aggregation queries (total tasks, tasks by status, total issues, issues by status, and recent 5 tasks and 5 issues ordered by `created_at DESC`) in `backend/repository.py`
- [X] T042 [US4] Implement Dashboard REST endpoint `GET /api/projects/<project_id>/dashboard` in `backend/routes/projects.py`
- [X] T043 [P] [US4] Implement `DashboardView.tsx` rendering summary metric cards, status breakdown distribution, and recent task/issue cards in `frontend/src/components/DashboardView.tsx`
- [X] T044 [US4] Wire `DashboardView.tsx` as the default active tab inside `ProjectDetailPage.tsx` in `frontend/src/pages/ProjectDetailPage.tsx`

**Checkpoint**: All 4 user stories are fully implemented, connected, and independently verified.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Application mounting, comprehensive test execution, and end-to-end verification.

- [X] T045 [P] Implement application entry point `frontend/src/main.tsx` and HTML page metadata in `frontend/index.html`
- [X] T046 [P] Verify backend entry point runs cleanly with `python -m backend.app` in `backend/app.py`
- [X] T047 Execute full backend automated test suite (`pytest backend/tests -v`) and verify 100% pass rate with zero warnings
- [X] T048 Execute full Playwright browser test suite (`npx playwright test`) against isolated test database (`DEVTRACK_DB=backend/test_e2e.db`)
- [X] T049 Execute manual quickstart verification walkthrough per `specs/001-task-issue-tracking/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on Foundational completion (and references project container from US1).
- **User Story 3 (Phase 5)**: Depends on Foundational completion (and references project container from US1).
- **User Story 4 (Phase 6)**: Depends on Foundational completion (and visualizes tasks from US2 and issues from US3).
- **Polish (Phase 7)**: Depends on completion of all user story phases.

### Within Each User Story

1. Write automated tests first (backend API tests & Playwright specs) and verify they fail before implementation.
2. Implement SQL repository methods in `backend/repository.py`.
3. Implement REST route handlers in `backend/routes/`.
4. Implement UI components and modal forms in `frontend/src/components/`.
5. Integrate views into `frontend/src/pages/`.
6. Run story-specific tests to achieve green checkpoint.

---

## Parallel Opportunities

- **Phase 1 (Setup)**: Tasks `T002`, `T003`, `T004`, `T005` can all be executed in parallel.
- **Phase 2 (Foundational)**: Tasks `T007`, `T008`, `T012`, `T013`, `T014`, `T015`, `T016` can be executed in parallel.
- **Within Stories**:
  - In User Story 1: `T017` (API test), `T018` (E2E test), `T021` (ProjectModal), and `T022` (ProjectCard) can be developed in parallel.
  - In User Story 2: `T025` (API test), `T026` (E2E test), `T029` (TaskModal), and `T030` (TaskList) can be developed in parallel.
  - In User Story 3: `T032` (API test), `T033` (E2E test), `T036` (IssueModal), and `T037` (IssueList) can be developed in parallel.
  - In User Story 4: `T039` (API test), `T040` (E2E test), and `T043` (DashboardView) can be developed in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`T001` - `T005`).
2. Complete Phase 2: Foundational (`T006` - `T016`).
3. Complete Phase 3: User Story 1 (`T017` - `T024`).
4. **STOP and VALIDATE**: Verify complete Project CRUD in browser and automated tests. This forms a working MVP!

### Incremental Delivery

1. Setup + Foundation ➡️ Foundation Ready.
2. Add User Story 1 ➡️ Project management working (MVP).
3. Add User Story 2 ➡️ Task tracking with status/search active.
4. Add User Story 3 ➡️ Issue tracking with status/search active.
5. Add User Story 4 ➡️ Project dashboard overview with aggregated metrics.
6. Phase 7 Polish ➡️ Complete automated test suite validation.
