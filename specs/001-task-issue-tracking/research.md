# Research & Technical Decisions: DevTrack Core Task and Issue Tracking

**Feature**: [001-task-issue-tracking](spec.md)
**Status**: Completed
**Date**: 2026-09-30

## Technical Context Unknowns & Decisions

### 1. Backend Architecture & Database Access

- **Decision**: Python 3.11+ with Flask for REST endpoints and Python's built-in `sqlite3` module with a lightweight data access repository layer. Enforce foreign keys per connection via `PRAGMA foreign_keys = ON;`.
- **Rationale**:
  - Python's standard library `sqlite3` requires zero external drivers and guarantees deterministic behavior without external database management.
  - Flask is lightweight, unopinionated, and provides straightforward routing and JSON serialization without heavyweight overhead.
  - Using direct parameterized SQL queries in a dedicated repository layer eliminates complex ORM mapping overhead (such as SQLAlchemy migrations or session life-cycle issues) while keeping query logic explicit and fully testable.
- **Alternatives Considered**:
  - *SQLAlchemy / Flask-SQLAlchemy*: Rejected. Introduces substantial dependency weight, migration scaffolding, and abstraction layers for what is fundamentally a 3-table local application.
  - *FastAPI*: Rejected. The project constitution and technical constraints explicitly dictate Flask.

### 2. Frontend Framework & Tooling

- **Decision**: React 18+ with TypeScript using Vite as the development server and bundler. Vanilla CSS with modern styling (CSS custom properties, clean layout utilities) for a polished, responsive, and accessible UI.
- **Rationale**:
  - Vite offers instant server start, fast Hot Module Replacement (HMR), and clean TypeScript compilation without configuration bloat.
  - React + TypeScript guarantees type safety between frontend data contracts and component props.
  - Plain modern CSS provides total control over layout, responsiveness, and component styling without introducing heavy CSS frameworks.
- **Alternatives Considered**:
  - *Next.js*: Rejected. Server-side rendering is unnecessary for a local single-user tool and adds severe architectural friction with the Flask backend.
  - *TailwindCSS*: Rejected. In alignment with engineering guidelines and Constitution Principle X (Lean Dependencies), vanilla CSS is preferred for maximum simplicity.
  - *Create React App*: Rejected. Deprecated and slow.

### 3. API Communication & Error Protocol

- **Decision**: REST API utilizing standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) with JSON request and response payloads. Structured error envelopes:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Project name is required",
      "details": [{ "field": "name", "issue": "Must not be empty" }]
    }
  }
  ```
- **Rationale**:
  - Provides deterministic, testable status codes (200, 201, 204, 400, 404, 500).
  - Explicitly satisfies FR-023 and Constitution Principle VI (Explicit and Testable Backend APIs).
  - Enables frontend forms to map validation errors directly to user-facing inputs.
- **Alternatives Considered**:
  - *GraphQL*: Rejected. Overkill for simple parent-child CRUD and dashboard queries.
  - *Ad-hoc status strings*: Rejected. Inconsistent error structures make client-side validation brittle.

### 4. Backend Automated Testing

- **Decision**: Use `pytest` for backend unit and integration testing. Database tests will run against an in-memory SQLite database (`:memory:`) or an isolated temporary SQLite file initialized fresh for test fixtures.
- **Rationale**:
  - In-memory SQLite tests execute in milliseconds, guaranteeing zero inter-test state contamination and 100% deterministic reproducibility (Constitution Principle XIV).
  - Flask's native test client (`app.test_client()`) provides end-to-end HTTP request/response validation without binding real network sockets.
- **Alternatives Considered**:
  - *Shared test SQLite database file*: Rejected due to risk of test flakiness and leftover state.
  - *Python `unittest` module*: Rejected. `pytest` provides cleaner fixtures, parameterized testing, and concise assertion reporting.

### 5. Frontend End-to-End Browser Testing

- **Decision**: Playwright for TypeScript/JavaScript running against a dedicated test database (`DEVTRACK_DB=backend/test_e2e.db`) with `playwright.config.ts` managing the Flask backend and Vite frontend server lifecycle via `webServer` (or reusing active servers with `reuseExistingServer: !process.env.CI`).
- **Rationale**:
  - Playwright provides fast, reliable, cross-browser validation of actual user journeys: project creation, task/issue filtering, search interactions, and delete confirmation modals.
  - Dedicated E2E database isolation prevents browser tests from overwriting or corrupting the developer's local `devtrack.db` data (Constitution Principle XIV).
  - Directly fulfills FR-022 and Constitution Principle VII (End-to-End Browser Workflow Validation).
- **Alternatives Considered**:
  - *Cypress*: Rejected. Slower execution and heavier resource footprint on local developer environments.
  - *Testing against primary development database*: Rejected. Mutates developer manual test data and prevents reproducible test runs.
  - *jsdom/React Testing Library alone*: Rejected. Does not validate real browser event loops, navigation, or dialog interactions.

### 6. Local Development Environment & Process Orchestration

- **Decision**: Simple local execution using standard tools:
  - Backend runs on `http://localhost:5000` via `python -m backend.app` (or `flask run`).
  - Frontend runs on `http://localhost:5173` via `npm run dev`, with Vite proxying `/api` requests to port 5000.
  - Database file stored at a configurable local path (default: `backend/devtrack.db`, gitignored).
  - Zero Docker containers, zero external daemons, zero external database servers.
- **Rationale**:
  - Zero-friction developer setup satisfying Constitution Principle XIII (Safe, Local-Only Development).
  - No credentials or secrets required (Constitution Principle III).
- **Alternatives Considered**:
  - *Docker Compose*: Explicitly rejected by user instructions and Constitution Principle X.
  - *Procfile / Honcho*: Rejected to avoid extra Python dependencies.
