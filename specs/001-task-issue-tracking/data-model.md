# Data Model: DevTrack Core Task and Issue Tracking

**Feature**: [001-task-issue-tracking](spec.md)
**Status**: Completed
**Date**: 2026-09-30

## Overview

DevTrack uses a local SQLite database with three relational entities: `projects`, `tasks`, and `issues`. Strict referential integrity is enforced using foreign key constraints with cascading deletes enabled (`PRAGMA foreign_keys = ON;`).

## Entity Definitions

### 1. Project (`projects`)

Represents a workspace containing related tasks and issues.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique numeric identifier |
| `name` | TEXT | NOT NULL, CHECK(length(trim(name)) > 0) | Name of the project (1-100 characters) |
| `description` | TEXT | NULL | Optional markdown or plain text details |
| `created_at` | TEXT | NOT NULL | ISO 8601 UTC timestamp of creation |

**Validation Rules**:
- `name` MUST NOT be null, empty, or whitespace-only. Maximum length: 100 characters.
- `description` is optional. Maximum length: 2000 characters.

---

### 2. Task (`tasks`)

Represents an actionable work item belonging to a project.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique numeric identifier |
| `project_id` | INTEGER | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Parent project foreign key |
| `title` | TEXT | NOT NULL, CHECK(length(trim(title)) > 0) | Task title (1-200 characters) |
| `description` | TEXT | NULL | Optional task details |
| `status` | TEXT | NOT NULL, CHECK(status IN ('Todo', 'In Progress', 'Done')), DEFAULT 'Todo' | Lifecycle status |
| `priority` | TEXT | NOT NULL, CHECK(priority IN ('Low', 'Medium', 'High')), DEFAULT 'Medium' | Task priority |
| `created_at` | TEXT | NOT NULL | ISO 8601 UTC timestamp of creation |

**Validation Rules**:
- `title` MUST NOT be null, empty, or whitespace-only. Maximum length: 200 characters.
- `status` MUST be one of: `'Todo'`, `'In Progress'`, `'Done'`. Defaults to `'Todo'`.
- `priority` MUST be one of: `'Low'`, `'Medium'`, `'High'`. Defaults to `'Medium'`.
- `project_id` MUST reference an existing project in the database.

---

### 3. Issue (`issues`)

Represents a defect, bug, or problem item belonging to a project.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique numeric identifier |
| `project_id` | INTEGER | NOT NULL, REFERENCES projects(id) ON DELETE CASCADE | Parent project foreign key |
| `title` | TEXT | NOT NULL, CHECK(length(trim(title)) > 0) | Issue title (1-200 characters) |
| `description` | TEXT | NULL | Optional defect description |
| `status` | TEXT | NOT NULL, CHECK(status IN ('Open', 'In Progress', 'Resolved')), DEFAULT 'Open' | Defect lifecycle status |
| `priority` | TEXT | NOT NULL, CHECK(priority IN ('Low', 'Medium', 'High')), DEFAULT 'Medium' | Defect priority |
| `created_at` | TEXT | NOT NULL | ISO 8601 UTC timestamp of creation |

**Validation Rules**:
- `title` MUST NOT be null, empty, or whitespace-only. Maximum length: 200 characters.
- `status` MUST be one of: `'Open'`, `'In Progress'`, `'Resolved'`. Defaults to `'Open'`.
- `priority` MUST be one of: `'Low'`, `'Medium'`, `'High'`. Defaults to `'Medium'`.
- `project_id` MUST reference an existing project in the database.

---

## State Transition Models

### Task Status Transitions
```text
[ Creation ] ──► Todo ◄──► In Progress ◄──► Done
```
Any state can transition to any other valid task state (`Todo`, `In Progress`, `Done`) upon user update.

### Issue Status Transitions
```text
[ Creation ] ──► Open ◄──► In Progress ◄──► Resolved
```
Any state can transition to any other valid issue state (`Open`, `In Progress`, `Resolved`) upon user update.

---

## Relational Schema (DDL)

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Todo' CHECK (status IN ('Todo', 'In Progress', 'Done')),
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(project_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_created ON tasks(project_id, created_at DESC);

CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_issues_project_id ON issues(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(project_id, status);
CREATE INDEX IF NOT EXISTS idx_issues_project_created ON issues(project_id, created_at DESC);
```

## Cascading Deletes

When a row in `projects` is deleted, SQLite's foreign key constraint with `ON DELETE CASCADE` automatically and atomically deletes:
1. All rows in `tasks` matching `tasks.project_id = projects.id`.
2. All rows in `issues` matching `issues.project_id = projects.id`.
