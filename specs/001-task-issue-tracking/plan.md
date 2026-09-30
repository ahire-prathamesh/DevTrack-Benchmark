# Implementation Plan: DevTrack Baseline Task and Issue Tracking

**Branch**: `001-task-issue-tracking` | **Date**: 2026-09-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-task-issue-tracking/spec.md`

## Summary

Build the baseline DevTrack-Benchmark application: a lightweight, local developer task and issue tracking web application. The technical approach couples a Python/Flask REST API using SQLite (`sqlite3` standard library with parameterized queries and foreign keys) with a React/TypeScript frontend built with Vite and vanilla CSS. Testing is enforced at all layers: unit and API integration tests with `pytest`, and end-to-end browser workflow tests with `Playwright`.

## Technical Context

- **Language/Version**: Python 3.11+ (Backend), TypeScript 5.x / ECMAScript 2022 (Frontend)
- **Primary Dependencies**:
  - Backend: `flask`, `flask-cors`
  - Frontend: `react`, `react-dom`, `vite`
- **Storage**: SQLite 3 (using Python built-in `sqlite3` with `PRAGMA foreign_keys = ON;`)
- **Testing**:
  - Backend: `pytest`, `pytest-cov`
  - Frontend/E2E: `Playwright` (`@playwright/test`)
- **Target Platform**: Cross-platform local developer machine (Windows, macOS, Linux)
- **Project Type**: Web Application (Decoupled React Single-Page Application + Flask REST API)
- **Performance Goals**: Sub-50ms API endpoint latency locally; instant (<50ms) client-side search/filtering
- **Constraints**:
  - Local-only execution (strictly localhost)
  - No external database servers, no Docker, no cloud dependencies
  - Zero authentication or secrets required
  - Strict input validation (no empty/whitespace titles/names)
  - Explicit confirmation for all deletions
- **Scale/Scope**: Single developer, 3 domain entities (Projects, Tasks, Issues), 4 core user journeys

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Gate | Assessment | Status |
|------------------|------------|--------|
| **I. Correctness Over Speed** | All requirements mapped to explicit contracts, schema constraints, and unit/API/E2E tests. | **PASS** |
| **II. Security by Design** | Parameterized queries prevent SQL injection; strict input validation; sanitized payloads. | **PASS** |
| **III. Zero Secrets in Version Control** | No API keys, credentials, or remote services. Config uses safe local defaults; `.env` is gitignored. | **PASS** |
| **IV. Simple, Maintainable Architecture** | Lightweight architecture using standard library SQLite, straightforward Flask routes, and modular React components. No heavyweight ORM or state machines. | **PASS** |
| **V. Mandatory Automated Testing** | Automated test suite includes backend unit/API tests (`pytest`) and browser workflow tests (`Playwright`). | **PASS** |
| **VI. Explicit and Testable Backend APIs** | REST API adheres to strict JSON schemas, explicit HTTP status codes, and standardized error envelopes. | **PASS** |
| **VII. End-to-End Browser Workflow Validation** | Playwright test suite covers Project, Task, Issue, and Dashboard flows in real browser environments. | **PASS** |
| **VIII. Mandatory Verification of AI-Generated Code** | Complete code artifacts and tests will be verified before final commits. | **PASS** |
| **IX. Small, Traceable, and Reviewable Changes** | Architecture split into modular files with single responsibilities. | **PASS** |
| **X. Lean Dependencies and Infrastructure** | No Docker, no external database servers, no UI component library bloat. Only minimal necessary packages (`flask`, `flask-cors`, `vite`, `react`). | **PASS** |
| **XI. Clear Separation of Concerns** | Strict directory boundaries: `backend/` handles data/REST, `frontend/` handles UI/presentation, `specs/` maintains documentation. | **PASS** |
| **XII. Decision-Oriented Documentation** | Architecture choices, contracts, data schemas, and quickstart guides are fully documented in `specs/001-task-issue-tracking/`. | **PASS** |
| **XIII. Safe, Local-Only Development** | Application runs purely on `localhost:5000` and `localhost:5173`. No production systems or network access needed. | **PASS** |
| **XIV. Deterministic and Reproducible Environments** | In-memory/temporary SQLite database isolation for backend testing ensures zero test side-effects and repeatable test outcomes. | **PASS** |
| **XV. Meaningful Git History** | Stepwise verified implementation commits will follow standard semantic conventions. | **PASS** |

## Project Structure

### Documentation (this feature)

```text
specs/001-task-issue-tracking/
├── spec.md                  # Baseline feature specification
├── checklists/
│   └── requirements.md      # Specification quality checklist
├── plan.md                  # This implementation plan
├── research.md              # Phase 0 technical decisions & rationale
├── data-model.md            # Phase 1 SQLite schema, entities & validation
├── contracts/
│   └── rest-api.md          # Phase 1 REST API specification & endpoints
├── quickstart.md            # Phase 1 local setup, run, & verification guide
└── tasks.md                 # Phase 2 output (/speckit-tasks command)
```

### Source Code Layout

```text
backend/
├── requirements.txt         # Flask, Flask-CORS, pytest
├── app.py                   # App factory, configuration, CORS, error handling
├── config.py                # Environment configuration (DB path, port, debug)
├── db.py                    # SQLite connection provider, schema initializer, PRAGMA setup
├── repository.py            # Parameterized SQL queries for Projects, Tasks, Issues, Dashboard
├── routes/
│   ├── __init__.py          # Blueprint registrations
│   ├── projects.py          # /api/projects CRUD and /api/projects/<id>/dashboard
│   ├── tasks.py             # /api/projects/<id>/tasks and /api/tasks/<id> CRUD
│   └── issues.py            # /api/projects/<id>/issues and /api/issues/<id> CRUD
└── tests/
    ├── conftest.py          # In-memory SQLite fixtures & Flask test client
    ├── test_db.py           # SQLite schema constraints & cascading delete tests
    ├── test_projects_api.py # Project REST endpoint tests & validation error checks
    ├── test_tasks_api.py    # Task REST endpoint tests, status filters, & search checks
    ├── test_issues_api.py   # Issue REST endpoint tests, status filters, & search checks
    └── test_dashboard_api.py# Dashboard aggregation & recent item metric tests

frontend/
├── package.json             # React, Vite, TypeScript, Playwright
├── tsconfig.json            # Strict TypeScript configuration
├── vite.config.ts           # Vite dev server with proxy to http://localhost:5000
├── index.html               # Single page application entry point
├── src/
│   ├── main.tsx             # React root render
│   ├── App.tsx              # Top-level view switching & project context
│   ├── index.css            # Design tokens, typography, CSS reset, responsive utility
│   ├── api/
│   │   ├── client.ts        # Typed fetch wrapper with error envelope handling
│   │   └── types.ts         # TypeScript models: Project, Task, Issue, DashboardData
│   ├── components/
│   │   ├── Header.tsx       # Application header & navigation breadcrumbs
│   │   ├── ConfirmationModal.tsx # Accessible modal for destructive deletion confirmation
│   │   ├── StatusBadge.tsx  # Color-coded badges for task/issue status and priority
│   │   ├── ProjectCard.tsx  # Project summary card with action buttons
│   │   ├── ProjectModal.tsx # Project create/edit modal form with validation feedback
│   │   ├── TaskList.tsx     # Task table/cards with status filter dropdown & title search
│   │   ├── TaskModal.tsx    # Task create/edit modal form with validation feedback
│   │   ├── IssueList.tsx    # Issue table/cards with status filter dropdown & title search
│   │   ├── IssueModal.tsx   # Issue create/edit modal form with validation feedback
│   │   └── DashboardView.tsx# Project metrics cards, status breakdowns, & recent lists
│   └── pages/
│       ├── ProjectsPage.tsx # Overview list of all projects with empty-state guidance
│       └── ProjectDetailPage.tsx # Selected project container: tabs for Dashboard, Tasks, Issues
└── e2e/
    ├── playwright.config.ts # Playwright configuration (webServer config or local endpoints)
    ├── projects.spec.ts     # User Story 1: Project CRUD & cascading delete E2E tests
    ├── tasks.spec.ts        # User Story 2: Task CRUD, filtering, & search E2E tests
    ├── issues.spec.ts       # User Story 3: Issue CRUD, filtering, & search E2E tests
    └── dashboard.spec.ts    # User Story 4: Dashboard counts & recent item display E2E tests
```

**Structure Decision**: A clean two-tier layout (`backend/` and `frontend/`) ensures total decoupling. The backend can be tested and run completely independently of the frontend, and the frontend communicates solely via the standard REST API contract over HTTP.

## Architectural Design & Strategy

### 1. Data Access & Integrity Strategy
- All database queries are isolated inside `backend/repository.py`.
- Parameterized SQL statements (`?` placeholders) are used exclusively to guarantee SQL injection safety.
- Database connections explicitly run `PRAGMA foreign_keys = ON;` upon connection to ensure SQLite enforces relational integrity and cascading deletes.
- Schema creation script runs automatically on backend startup if tables do not exist.

### 2. Validation & Error Handling Strategy
- **Backend Validation**:
  - Request payloads are validated before database execution.
  - Project names and Task/Issue titles are stripped of leading/trailing whitespace. Empty strings are rejected with HTTP 400.
  - Status and Priority values are validated against strict whitelist sets.
  - Non-existent IDs return HTTP 404 with structured JSON.
  - Centralized error handlers format all errors into the standard error envelope `{ "error": { "code": "...", "message": "...", "details": [...] } }`.
- **PUT Semantics (Full Resource Replacement)**:
  - `PUT` requests represent a complete resource replacement. The request body MUST supply all required resource attributes (`name` for projects; `title`, `status`, `priority` for tasks and issues).
  - Omitted or null optional fields (such as `description`) are cleared in the database.
- **Entity Response Contracts**:
  - Single task and issue API endpoints (`GET /api/tasks/{id}`, `PUT /api/tasks/{id}`, `GET /api/issues/{id}`, `PUT /api/issues/{id}`) explicitly return `project_id` in the top-level JSON response, ensuring client-side views always retain parent project context.
- **Frontend Validation**:
  - Forms validate required fields in real time and display clear field-level feedback.
  - Server validation errors are parsed and displayed directly next to invalid form controls.

### 3. User Interface & State Management
- Simple, predictable React state management using React hooks (`useState`, `useEffect`, `useCallback`) without external global state libraries.
- The UI provides clear, intuitive tab navigation:
  - Top level: **Projects** view.
  - Detail level: Selecting a project opens **Project Detail**, featuring three tabs:
    1. **Dashboard**: Summary metrics, status distribution, and a maximum of 5 recent tasks and 5 recent issues (newest first).
    2. **Tasks**: Filterable, searchable task list with status chips and edit/delete actions.
    3. **Issues**: Filterable, searchable issue list with status chips and edit/delete actions.
- Destructive actions (deleting projects, tasks, or issues) trigger `ConfirmationModal` before dispatching any API requests.

### 4. Testing Strategy
- **Backend Tests (`pytest`)**:
  - `conftest.py` provides an isolated `:memory:` database fixture with foreign keys enabled and schema initialized.
  - Test suites systematically test:
    - Positive CRUD workflows for all 3 entities.
    - Cascading deletes (deleting project cascades to tasks and issues).
    - Validation error cases (empty title, invalid status/priority, oversized text).
    - Missing entity handling (404s for invalid IDs).
    - Dashboard aggregation logic (verifying exact count calculations and sorting limit of 5 recent items).
- **Browser E2E Tests (`Playwright`)**:
  - **Database Isolation**: Playwright E2E tests execute against a dedicated, isolated test database (`DEVTRACK_DB=backend/test_e2e.db`), ensuring test runs never mutate or pollute the primary development database (`backend/devtrack.db`).
  - **Server Lifecycle Orchestration**: `frontend/e2e/playwright.config.ts` defines `webServer` commands to start the backend with `DEVTRACK_DB=backend/test_e2e.db` and the frontend Vite server, supporting `reuseExistingServer: !process.env.CI` for flexible interactive debugging.
  - Runs in real Chromium browser.
  - Verifies DOM rendering, form submissions, filter dropdown selections, real-time search filtering, confirmation modals, and toast/error indicators.

## Complexity Tracking

> No constitution violations. No extra complexity introduced.

| Potential Complexity | Status | Rationale |
|----------------------|--------|-----------|
| External ORM (SQLAlchemy) | **Rejected** | Direct `sqlite3` queries are simpler, transparent, and require zero external dependencies. |
| State Management Library (Redux/Zustand) | **Rejected** | React component state and hooks are fully sufficient for the single-user local scope. |
| Containerization (Docker) | **Rejected** | Explicitly disallowed by user requirements and Constitution Principle X; local native execution is faster and simpler. |
| Authentication System | **Rejected** | Single developer benchmark; auth adds unnecessary scaffolding without testing value. |
