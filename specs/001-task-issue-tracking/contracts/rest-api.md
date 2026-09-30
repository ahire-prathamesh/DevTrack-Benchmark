# REST API Contract: DevTrack Core Task and Issue Tracking

**Feature**: [001-task-issue-tracking](../spec.md)
**Status**: Completed
**Base Path**: `/api`
**Date**: 2026-09-30

## Common Response Formats

### Error Envelope (4xx / 5xx)

```json
{
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | BAD_REQUEST | INTERNAL_ERROR",
    "message": "Human-readable description of error",
    "details": [
      {
        "field": "name | title | status | priority",
        "issue": "Specific description of violation"
      }
    ]
  }
}
```

---

## 1. Projects Endpoints

### `GET /api/projects`
List all projects.

- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "name": "DevTrack Benchmark",
      "description": "Developer task and issue tracking application",
      "created_at": "2026-09-30T12:00:00Z",
      "task_count": 5,
      "issue_count": 2
    }
  ]
  ```

### `POST /api/projects`
Create a new project.

- **Request Body**:
  ```json
  {
    "name": "Project Alpha",
    "description": "Optional project description"
  }
  ```
- **Validation**:
  - `name`: String, required, 1-100 characters after trim.
  - `description`: String, optional, max 2000 characters.
- **Response `201 Created`**:
  ```json
  {
    "id": 2,
    "name": "Project Alpha",
    "description": "Optional project description",
    "created_at": "2026-09-30T12:05:00Z"
  }
  ```
- **Response `400 Bad Request`**: Validation error if `name` is missing or empty.

### `GET /api/projects/{id}`
Retrieve a single project by ID.

- **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "name": "DevTrack Benchmark",
    "description": "Developer task and issue tracking application",
    "created_at": "2026-09-30T12:00:00Z"
  }
  ```
- **Response `404 Not Found`**: When project with `{id}` does not exist.

### `PUT /api/projects/{id}`
Update an existing project (full resource replacement).

- **Semantics**: PUT represents a full resource replacement. The request body MUST supply all required resource fields.
- **Request Body**:
  ```json
  {
    "name": "Updated Project Name",
    "description": "Updated description"
  }
  ```
- **Validation**:
  - `name`: String, required, 1-100 characters after trim.
  - `description`: String, optional (if omitted or null, sets description to null).
- **Response `200 OK`**: Updated project object.
- **Response `400 Bad Request`**: Validation error if `name` is missing or empty.
- **Response `404 Not Found`**: When project does not exist.

### `DELETE /api/projects/{id}`
Delete a project and all associated tasks and issues (cascading).

- **Response `204 No Content`**
- **Response `404 Not Found`**: When project does not exist.

---

## 2. Project Dashboard Endpoint

### `GET /api/projects/{project_id}/dashboard`
Retrieve aggregated statistics and recent items for a project (maximum 5 recent tasks and 5 recent issues, sorted newest first).

- **Response `200 OK`**:
  ```json
  {
    "project": {
      "id": 1,
      "name": "DevTrack Benchmark",
      "description": "Developer task and issue tracking application",
      "created_at": "2026-09-30T12:00:00Z"
    },
    "task_metrics": {
      "total": 6,
      "by_status": {
        "Todo": 2,
        "In Progress": 3,
        "Done": 1
      }
    },
    "issue_metrics": {
      "total": 3,
      "by_status": {
        "Open": 1,
        "In Progress": 1,
        "Resolved": 1
      }
    },
    "recent_tasks": [
      {
        "id": 12,
        "project_id": 1,
        "title": "Build task filter UI",
        "status": "In Progress",
        "priority": "High",
        "created_at": "2026-09-30T12:30:00Z"
      }
    ],
    "recent_issues": [
      {
        "id": 4,
        "project_id": 1,
        "title": "Fix SQLite foreign key PRAGMA",
        "status": "Resolved",
        "priority": "High",
        "created_at": "2026-09-30T12:15:00Z"
      }
    ]
  }
  ```
- **Notes**: `recent_tasks` contains at most 5 items ordered by `created_at DESC`. `recent_issues` contains at most 5 items ordered by `created_at DESC`.
- **Response `404 Not Found`**: When project does not exist.

---

## 3. Tasks Endpoints

### `GET /api/projects/{project_id}/tasks`
List tasks for a project, with optional filtering and search.

- **Query Parameters**:
  - `status`: Optional. One of `'Todo'`, `'In Progress'`, `'Done'`.
  - `search`: Optional. Case-insensitive substring match against `title`.
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "project_id": 1,
      "title": "Set up Flask project structure",
      "description": "Configure app factory and blueprints",
      "status": "Done",
      "priority": "High",
      "created_at": "2026-09-30T12:10:00Z"
    }
  ]
  ```
- **Response `404 Not Found`**: When parent project does not exist.

### `POST /api/projects/{project_id}/tasks`
Create a new task under a project.

- **Request Body**:
  ```json
  {
    "title": "Implement API error handling",
    "description": "Add standardized error response envelope",
    "status": "Todo",
    "priority": "Medium"
  }
  ```
- **Validation**:
  - `title`: String, required, 1-200 characters after trim.
  - `description`: String, optional.
  - `status`: String, optional (defaults to `'Todo'`), must be one of `['Todo', 'In Progress', 'Done']`.
  - `priority`: String, optional (defaults to `'Medium'`), must be one of `['Low', 'Medium', 'High']`.
- **Response `201 Created`**: Returns created task object.
- **Response `400 Bad Request`**: Validation error.
- **Response `404 Not Found`**: When parent project does not exist.

### `GET /api/tasks/{id}`
Retrieve a single task by ID.

- **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "project_id": 1,
    "title": "Set up Flask project structure",
    "description": "Configure app factory and blueprints",
    "status": "Done",
    "priority": "High",
    "created_at": "2026-09-30T12:10:00Z"
  }
  ```
- **Response `404 Not Found`**: When task does not exist.

### `PUT /api/tasks/{id}`
Update an existing task (full resource replacement).

- **Semantics**: PUT represents a full resource replacement. All editable fields MUST be supplied in the request body.
- **Request Body**:
  ```json
  {
    "title": "Updated Task Title",
    "description": "Updated description",
    "status": "In Progress",
    "priority": "High"
  }
  ```
- **Validation**:
  - `title`: String, required, 1-200 characters after trim.
  - `description`: String, optional (if omitted or null, sets description to null).
  - `status`: String, required, must be one of `['Todo', 'In Progress', 'Done']`.
  - `priority`: String, required, must be one of `['Low', 'Medium', 'High']`.
- **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "project_id": 1,
    "title": "Updated Task Title",
    "description": "Updated description",
    "status": "In Progress",
    "priority": "High",
    "created_at": "2026-09-30T12:10:00Z"
  }
  ```
- **Response `400 Bad Request`**: Validation error if required fields are missing or invalid.
- **Response `404 Not Found`**: When task does not exist.

### `DELETE /api/tasks/{id}`
Delete a task.

- **Response `204 No Content`**
- **Response `404 Not Found`**: When task does not exist.

---

## 4. Issues Endpoints

### `GET /api/projects/{project_id}/issues`
List issues for a project, with optional filtering and search.

- **Query Parameters**:
  - `status`: Optional. One of `'Open'`, `'In Progress'`, `'Resolved'`.
  - `search`: Optional. Case-insensitive substring match against `title`.
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "project_id": 1,
      "title": "Fix confirmation dialog positioning",
      "description": "Dialog overflows on mobile viewports",
      "status": "Open",
      "priority": "Low",
      "created_at": "2026-09-30T12:20:00Z"
    }
  ]
  ```
- **Response `404 Not Found`**: When parent project does not exist.

### `POST /api/projects/{project_id}/issues`
Create a new issue under a project.

- **Request Body**:
  ```json
  {
    "title": "Form validation allows whitespace-only input",
    "description": "Trimming validation missing on title input",
    "status": "Open",
    "priority": "High"
  }
  ```
- **Validation**:
  - `title`: String, required, 1-200 characters after trim.
  - `description`: String, optional.
  - `status`: String, optional (defaults to `'Open'`), must be one of `['Open', 'In Progress', 'Resolved']`.
  - `priority`: String, optional (defaults to `'Medium'`), must be one of `['Low', 'Medium', 'High']`.
- **Response `201 Created`**: Returns created issue object.
- **Response `400 Bad Request`**: Validation error.
- **Response `404 Not Found`**: When parent project does not exist.

### `GET /api/issues/{id}`
Retrieve a single issue by ID.

- **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "project_id": 1,
    "title": "Fix confirmation dialog positioning",
    "description": "Dialog overflows on mobile viewports",
    "status": "Open",
    "priority": "Low",
    "created_at": "2026-09-30T12:20:00Z"
  }
  ```
- **Response `404 Not Found`**: When issue does not exist.

### `PUT /api/issues/{id}`
Update an existing issue (full resource replacement).

- **Semantics**: PUT represents a full resource replacement. All editable fields MUST be supplied in the request body.
- **Request Body**:
  ```json
  {
    "title": "Updated Issue Title",
    "description": "Updated defect details",
    "status": "Resolved",
    "priority": "High"
  }
  ```
- **Validation**:
  - `title`: String, required, 1-200 characters after trim.
  - `description`: String, optional (if omitted or null, sets description to null).
  - `status`: String, required, must be one of `['Open', 'In Progress', 'Resolved']`.
  - `priority`: String, required, must be one of `['Low', 'Medium', 'High']`.
- **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "project_id": 1,
    "title": "Updated Issue Title",
    "description": "Updated defect details",
    "status": "Resolved",
    "priority": "High",
    "created_at": "2026-09-30T12:20:00Z"
  }
  ```
- **Response `400 Bad Request`**: Validation error if required fields are missing or invalid.
- **Response `404 Not Found`**: When issue does not exist.

### `DELETE /api/issues/{id}`
Delete an issue.

- **Response `204 No Content`**
- **Response `404 Not Found`**: When issue does not exist.
