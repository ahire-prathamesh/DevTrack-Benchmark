# Feature Specification: DevTrack Core Task and Issue Tracking

**Feature Branch**: `001-task-issue-tracking`

**Created**: 2026-09-30

**Status**: Draft

**Input**: User description: "Create the baseline product specification for DevTrack-Benchmark. Product: DevTrack is a small local developer task and issue tracking web application. Goal: Build a realistic but intentionally small application that can be used to benchmark an AI-assisted software engineering workflow from requirements through implementation, testing, browser validation, debugging, and Git-based development."

## Clarifications

### Session 2026-09-30

- **Q: How many recent tasks and recent issues should be displayed on the project dashboard? (FR-022)** → **A: Maximum of 5 recent tasks and 5 recent issues**, sorted in descending chronological order by creation date.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Project Management (Priority: P1)

As a developer, I want to create, browse, inspect, edit, and delete projects so that I can organize my software development tasks and issues into distinct workspaces.

**Why this priority**: Projects serve as the top-level container for all tracking data. Without project creation and management, no tasks or issues can be organized.

**Independent Test**: Can be fully tested by creating a new project with a name and description, viewing it in the project list, modifying its name, and deleting it after confirmation.

**Acceptance Scenarios**:

1. **Given** no projects exist, **When** the developer enters a valid name and description and submits the creation form, **Then** the new project is persisted and displayed in the project list.
2. **Given** an existing project, **When** the developer views the project details, **Then** the project name, description, and created timestamp are displayed.
3. **Given** an existing project, **When** the developer updates the project name or description with valid data, **Then** the changes are saved and reflected immediately across the interface.
4. **Given** an existing project, **When** the developer clicks delete, **Then** the system prompts for confirmation before permanently removing the project.

---

### User Story 2 - Task Tracking Within a Project (Priority: P1)

As a developer, I want to record, view, update, filter, search, and delete tasks within a selected project so that I can monitor work items from initiation to completion.

**Why this priority**: Core productivity requires creating and managing actionable items with status and priority tracking.

**Independent Test**: Can be tested independently by adding tasks to a project, updating their status ("Todo" -> "In Progress" -> "Done"), filtering the list by status, searching by title keyword, and deleting a task with confirmation.

**Acceptance Scenarios**:

1. **Given** an active project, **When** the developer creates a task with a title, description, status ("Todo"), and priority ("Medium"), **Then** the task appears under the project's task list with its creation date.
2. **Given** a list of tasks in a project, **When** the developer filters by status (e.g., "In Progress"), **Then** only tasks matching that status are displayed.
3. **Given** a list of tasks in a project, **When** the developer enters search text into the title search input, **Then** only tasks whose titles contain the query string (case-insensitive) are displayed.
4. **Given** an existing task, **When** the developer edits its details (title, description, status, or priority), **Then** the updated values are saved and displayed.
5. **Given** an existing task, **When** the developer initiates deletion and confirms the action, **Then** the task is removed from the project.

---

### User Story 3 - Issue Tracking Within a Project (Priority: P2)

As a developer, I want to report, inspect, update, filter, search, and delete issues within a project so that I can track defects and problems separately from development tasks.

**Why this priority**: Distinct issue tracking enables developers to categorize defects with lifecycle states ("Open", "In Progress", "Resolved") and triage them by priority.

**Independent Test**: Can be tested independently by creating an issue under a project, modifying its status from "Open" to "Resolved", searching issues by title, filtering by status, and deleting an issue.

**Acceptance Scenarios**:

1. **Given** an active project, **When** the developer creates an issue with title, description, status ("Open"), and priority ("High"), **Then** the issue is created with a recorded creation timestamp and displayed in the issue list.
2. **Given** a list of issues, **When** the developer selects a status filter (e.g., "Resolved"), **Then** only issues in the resolved state are shown.
3. **Given** a list of issues, **When** the developer types in the issue title search input, **Then** only matching issues are shown.
4. **Given** an existing issue, **When** the developer updates its status or details, **Then** the changes persist and update across views.
5. **Given** an existing issue, **When** the developer deletes the issue and confirms, **Then** the issue is removed.

---

### User Story 4 - Project Dashboard Overview (Priority: P2)

As a developer, I want to view a project dashboard that aggregates task and issue metrics so that I can quickly assess the current state and recent activity of a project.

**Why this priority**: Provides high-level visibility and progress metrics without requiring the developer to manually count individual records across different tabs.

**Independent Test**: Can be tested by opening the dashboard for a project with known tasks and issues, verifying that the summary statistics match the counts of each status, and verifying that recent tasks and issues are listed in descending chronological order.

**Acceptance Scenarios**:

1. **Given** a project containing tasks and issues in various statuses, **When** the developer opens the project dashboard, **Then** the system displays the project name, description, total task count, count of tasks by status ("Todo", "In Progress", "Done"), total issue count, and count of issues by status ("Open", "In Progress", "Resolved").
2. **Given** a project with newly created or updated items, **When** viewing the dashboard, **Then** up to 5 of the most recent tasks and up to 5 of the most recent issues are displayed in descending chronological order with their titles, statuses, priorities, and creation dates.
3. **Given** a project with zero tasks or issues, **When** the dashboard is viewed, **Then** the counts display zero with appropriate empty state notices.

---

### Edge Cases

- **Empty Workspace**: When the application has no projects, the interface displays an informative empty state guiding the developer to create their first project.
- **Blank or Whitespace Inputs**: Submitting empty or whitespace-only names/titles for projects, tasks, or issues is rejected with specific inline validation messages.
- **Project Deletion Cascading**: When a project is deleted, all associated tasks and issues are permanently removed with clear warning text in the confirmation dialog.
- **Search with Zero Matches**: When search keywords or status filter combinations return no matching items, a clear "No matching items found" state is displayed with an option to reset filters.
- **Non-Existent Record Navigation**: Directly navigating to or querying a deleted or non-existent project, task, or issue ID displays a clear error state indicating the item could not be found.
- **Boundary Text Lengths**: Fields handle standard length boundaries gracefully, preventing layout breakage on long titles or multi-paragraph descriptions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to view a list of all existing projects.
- **FR-002**: System MUST allow users to create a project by providing a mandatory name and an optional description.
- **FR-003**: System MUST reject project creation or update if the project name is empty or consists solely of whitespace.
- **FR-004**: System MUST allow users to view the details of a single project, including name, description, creation timestamp, and summary metrics.
- **FR-005**: System MUST allow users to edit the name and description of an existing project.
- **FR-006**: System MUST allow users to delete an existing project, requiring explicit user confirmation before deletion.
- **FR-007**: System MUST automatically delete all tasks and issues associated with a project when that project is deleted.
- **FR-008**: System MUST allow users to create a task associated with a specific project, capturing title, description, status, priority, and creation timestamp.
- **FR-009**: System MUST restrict task status to one of three values: "Todo", "In Progress", "Done", defaulting to "Todo" upon creation.
- **FR-010**: System MUST restrict task priority to one of three values: "Low", "Medium", "High", defaulting to "Medium" upon creation.
- **FR-011**: System MUST reject task creation or update if the task title is empty or consists solely of whitespace.
- **FR-012**: System MUST allow users to view, edit, and delete individual tasks under a project, requiring confirmation for deletion.
- **FR-013**: System MUST allow users to filter tasks within a project by status.
- **FR-014**: System MUST allow users to search tasks within a project by title with case-insensitive matching.
- **FR-015**: System MUST allow users to create an issue associated with a specific project, capturing title, description, status, priority, and creation timestamp.
- **FR-016**: System MUST restrict issue status to one of three values: "Open", "In Progress", "Resolved", defaulting to "Open" upon creation.
- **FR-017**: System MUST restrict issue priority to one of three values: "Low", "Medium", "High", defaulting to "Medium" upon creation.
- **FR-018**: System MUST reject issue creation or update if the issue title is empty or consists solely of whitespace.
- **FR-019**: System MUST allow users to view, edit, and delete individual issues under a project, requiring confirmation for deletion.
- **FR-020**: System MUST allow users to filter issues within a project by status.
- **FR-021**: System MUST allow users to search issues within a project by title with case-insensitive matching.
- **FR-022**: System MUST provide a project dashboard displaying project name, description, total tasks count, task counts grouped by status, total issues count, issue counts grouped by status, and lists of recent tasks (maximum 5, newest first) and recent issues (maximum 5, newest first).
- **FR-023**: System MUST provide structured error responses with clear descriptive messages whenever a request fails validation or refers to a missing entity.
- **FR-024**: System MUST provide clear navigation between the projects view, project dashboard, tasks view, and issues view.
- **FR-025**: System MUST maintain data integrity across distinct entities (Project, Task, Issue) stored in local persistence.

### Key Entities

- **Project**: Represents a discrete software development workspace.
  - *Attributes*: Identifier, Name (required, non-empty text), Description (optional text), Created Date (timestamp).
  - *Relationships*: Contains 0 to many Tasks; contains 0 to many Issues.
- **Task**: Represents an actionable unit of development work associated with a Project.
  - *Attributes*: Identifier, Project Identifier (required reference), Title (required, non-empty text), Description (optional text), Status ("Todo", "In Progress", "Done"), Priority ("Low", "Medium", "High"), Created Date (timestamp).
  - *Relationships*: Belongs to exactly one Project.
- **Issue**: Represents a defect, bug, or tracked problem associated with a Project.
  - *Attributes*: Identifier, Project Identifier (required reference), Title (required, non-empty text), Description (optional text), Status ("Open", "In Progress", "Resolved"), Priority ("Low", "Medium", "High"), Created Date (timestamp).
  - *Relationships*: Belongs to exactly one Project.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can complete project creation and start adding tasks in under 30 seconds from a clean start.
- **SC-002**: 100% of user workflows (project, task, and issue CRUD, searching, filtering, and dashboard overview) are verifiable through automated tests without manual data setup.
- **SC-003**: 100% of destructive operations (deleting a project, task, or issue) require explicit user confirmation before execution.
- **SC-004**: 100% of form submissions with missing or invalid mandatory fields display immediate, specific validation feedback preventing erroneous persistence.
- **SC-005**: Status filtering and title search return filtered results in under 200 milliseconds during interactive use.
- **SC-006**: Project dashboard summary metrics update in real-time to match the exact counts and status breakdowns of associated tasks and issues.

## Assumptions

- **Single Local User**: The system is designed for a single developer operating locally; no authentication, access control, multi-tenancy, or remote user sessions are required.
- **Local Sandbox Environment**: All data persistence and operational logic run strictly on the local machine; no external network services, cloud backends, or production infrastructure are utilized.
- **Cascading Deletions**: Deleting a project permanently deletes all associated tasks and issues belonging to that project, which is communicated to the user in the confirmation dialog.
- **Browser Environment**: The user accesses the application through a standard modern desktop web browser with JavaScript enabled.
- **No Mock or Placeholders in Core Flows**: All primary workflows (projects, tasks, issues, dashboard) are fully functional end-to-end rather than stubbed or simulated.
