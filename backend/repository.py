from typing import Any, Optional, List, Dict
from backend.db import get_connection
from backend.models import Project, Task, Issue
from backend.errors import ApiError


def validate_project_payload(name: Any, description: Any = None) -> tuple[str, Optional[str]]:
    if not isinstance(name, str) or not name.strip():
        raise ApiError(
            code="VALIDATION_ERROR",
            message="Project name is required and cannot be empty or whitespace-only",
            status_code=400,
            details=[{"field": "name", "issue": "Must be a non-empty string"}],
        )
    name = name.strip()
    if len(name) > 100:
        raise ApiError(
            code="VALIDATION_ERROR",
            message="Project name cannot exceed 100 characters",
            status_code=400,
            details=[{"field": "name", "issue": "Exceeds 100 characters"}],
        )

    clean_desc = None
    if description is not None:
        if not isinstance(description, str):
            raise ApiError(
                code="VALIDATION_ERROR",
                message="Project description must be a string",
                status_code=400,
                details=[{"field": "description", "issue": "Must be a string"}],
            )
        clean_desc = description.strip()
        if len(clean_desc) > 2000:
            raise ApiError(
                code="VALIDATION_ERROR",
                message="Project description cannot exceed 2000 characters",
                status_code=400,
                details=[{"field": "description", "issue": "Exceeds 2000 characters"}],
            )
        if not clean_desc:
            clean_desc = None

    return name, clean_desc


def list_projects(db_path: str) -> List[Project]:
    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT p.id, p.name, p.description, p.created_at,
                   (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as task_count,
                   (SELECT COUNT(*) FROM issues i WHERE i.project_id = p.id) as issue_count
            FROM projects p
            ORDER BY p.created_at DESC
            """
        )
        rows = cur.fetchall()
        return [
            Project(
                id=row["id"],
                name=row["name"],
                description=row["description"],
                created_at=row["created_at"],
                task_count=row["task_count"],
                issue_count=row["issue_count"],
            )
            for row in rows
        ]
    finally:
        conn.close()


def get_project_by_id(db_path: str, project_id: int) -> Optional[Project]:
    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT p.id, p.name, p.description, p.created_at,
                   (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as task_count,
                   (SELECT COUNT(*) FROM issues i WHERE i.project_id = p.id) as issue_count
            FROM projects p
            WHERE p.id = ?
            """,
            (project_id,),
        )
        row = cur.fetchone()
        if not row:
            return None
        return Project(
            id=row["id"],
            name=row["name"],
            description=row["description"],
            created_at=row["created_at"],
            task_count=row["task_count"],
            issue_count=row["issue_count"],
        )
    finally:
        conn.close()


def create_project(db_path: str, name: Any, description: Any = None) -> Project:
    clean_name, clean_desc = validate_project_payload(name, description)
    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO projects (name, description) VALUES (?, ?)",
            (clean_name, clean_desc),
        )
        conn.commit()
        project_id = cur.lastrowid
        return get_project_by_id(db_path, project_id)  # type: ignore
    finally:
        conn.close()


def update_project(
    db_path: str, project_id: int, name: Any, description: Any = None
) -> Optional[Project]:
    clean_name, clean_desc = validate_project_payload(name, description)
    existing = get_project_by_id(db_path, project_id)
    if not existing:
        return None

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            "UPDATE projects SET name = ?, description = ? WHERE id = ?",
            (clean_name, clean_desc, project_id),
        )
        conn.commit()
        return get_project_by_id(db_path, project_id)
    finally:
        conn.close()


def delete_project(db_path: str, project_id: int) -> bool:
    existing = get_project_by_id(db_path, project_id)
    if not existing:
        return False

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        conn.commit()
        return True
    finally:
        conn.close()


def validate_task_payload(
    title: Any,
    description: Any = None,
    status: Any = "Todo",
    priority: Any = "Medium",
    is_update: bool = False,
) -> tuple[str, Optional[str], str, str]:
    from backend.models import TASK_STATUSES, TASK_PRIORITIES

    if not isinstance(title, str) or not title.strip():
        raise ApiError(
            code="VALIDATION_ERROR",
            message="Task title is required and cannot be empty or whitespace-only",
            status_code=400,
            details=[{"field": "title", "issue": "Must be a non-empty string"}],
        )
    title = title.strip()
    if len(title) > 200:
        raise ApiError(
            code="VALIDATION_ERROR",
            message="Task title cannot exceed 200 characters",
            status_code=400,
            details=[{"field": "title", "issue": "Exceeds 200 characters"}],
        )

    clean_desc = None
    if description is not None:
        if not isinstance(description, str):
            raise ApiError(
                code="VALIDATION_ERROR",
                message="Task description must be a string",
                status_code=400,
                details=[{"field": "description", "issue": "Must be a string"}],
            )
        clean_desc = description.strip()
        if len(clean_desc) > 2000:
            raise ApiError(
                code="VALIDATION_ERROR",
                message="Task description cannot exceed 2000 characters",
                status_code=400,
                details=[{"field": "description", "issue": "Exceeds 2000 characters"}],
            )
        if not clean_desc:
            clean_desc = None

    if status is None:
        status = "Todo"
    if status not in TASK_STATUSES:
        raise ApiError(
            code="VALIDATION_ERROR",
            message=f"Invalid task status '{status}'. Must be one of: {sorted(list(TASK_STATUSES))}",
            status_code=400,
            details=[{"field": "status", "issue": "Invalid enum value"}],
        )

    if priority is None:
        priority = "Medium"
    if priority not in TASK_PRIORITIES:
        raise ApiError(
            code="VALIDATION_ERROR",
            message=f"Invalid task priority '{priority}'. Must be one of: {sorted(list(TASK_PRIORITIES))}",
            status_code=400,
            details=[{"field": "priority", "issue": "Invalid enum value"}],
        )

    return title, clean_desc, status, priority


def list_tasks_by_project(
    db_path: str,
    project_id: int,
    status: Optional[str] = None,
    search: Optional[str] = None,
) -> List[Task]:
    existing_project = get_project_by_id(db_path, project_id)
    if not existing_project:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Project with ID {project_id} not found",
            status_code=404,
        )

    query = "SELECT id, project_id, title, description, status, priority, created_at FROM tasks WHERE project_id = ?"
    params: List[Any] = [project_id]

    if status:
        query += " AND status = ?"
        params.append(status)

    if search:
        query += " AND LOWER(title) LIKE ?"
        params.append(f"%{search.lower()}%")

    query += " ORDER BY created_at DESC, id DESC"

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(query, params)
        rows = cur.fetchall()
        return [
            Task(
                id=row["id"],
                project_id=row["project_id"],
                title=row["title"],
                description=row["description"],
                status=row["status"],
                priority=row["priority"],
                created_at=row["created_at"],
            )
            for row in rows
        ]
    finally:
        conn.close()


def get_task_by_id(db_path: str, task_id: int) -> Optional[Task]:
    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, project_id, title, description, status, priority, created_at FROM tasks WHERE id = ?",
            (task_id,),
        )
        row = cur.fetchone()
        if not row:
            return None
        return Task(
            id=row["id"],
            project_id=row["project_id"],
            title=row["title"],
            description=row["description"],
            status=row["status"],
            priority=row["priority"],
            created_at=row["created_at"],
        )
    finally:
        conn.close()


def create_task(
    db_path: str,
    project_id: int,
    title: Any,
    description: Any = None,
    status: Any = "Todo",
    priority: Any = "Medium",
) -> Task:
    existing_project = get_project_by_id(db_path, project_id)
    if not existing_project:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Project with ID {project_id} not found",
            status_code=404,
        )

    clean_title, clean_desc, clean_status, clean_priority = validate_task_payload(
        title, description, status, priority
    )

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO tasks (project_id, title, description, status, priority)
            VALUES (?, ?, ?, ?, ?)
            """,
            (project_id, clean_title, clean_desc, clean_status, clean_priority),
        )
        conn.commit()
        task_id = cur.lastrowid
        return get_task_by_id(db_path, task_id)  # type: ignore
    finally:
        conn.close()


def update_task(
    db_path: str,
    task_id: int,
    title: Any,
    description: Any = None,
    status: Any = None,
    priority: Any = None,
) -> Optional[Task]:
    existing = get_task_by_id(db_path, task_id)
    if not existing:
        return None

    clean_title, clean_desc, clean_status, clean_priority = validate_task_payload(
        title, description, status, priority, is_update=True
    )

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            """
            UPDATE tasks
            SET title = ?, description = ?, status = ?, priority = ?
            WHERE id = ?
            """,
            (clean_title, clean_desc, clean_status, clean_priority, task_id),
        )
        conn.commit()
        return get_task_by_id(db_path, task_id)
    finally:
        conn.close()


def delete_task(db_path: str, task_id: int) -> bool:
    existing = get_task_by_id(db_path, task_id)
    if not existing:
        return False

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        conn.commit()
        return True
    finally:
        conn.close()


def validate_issue_payload(
    title: Any,
    description: Any = None,
    status: Any = "Open",
    priority: Any = "Medium",
    is_update: bool = False,
) -> tuple[str, Optional[str], str, str]:
    from backend.models import ISSUE_STATUSES, ISSUE_PRIORITIES

    if not isinstance(title, str) or not title.strip():
        raise ApiError(
            code="VALIDATION_ERROR",
            message="Issue title is required and cannot be empty or whitespace-only",
            status_code=400,
            details=[{"field": "title", "issue": "Must be a non-empty string"}],
        )
    title = title.strip()
    if len(title) > 200:
        raise ApiError(
            code="VALIDATION_ERROR",
            message="Issue title cannot exceed 200 characters",
            status_code=400,
            details=[{"field": "title", "issue": "Exceeds 200 characters"}],
        )

    clean_desc = None
    if description is not None:
        if not isinstance(description, str):
            raise ApiError(
                code="VALIDATION_ERROR",
                message="Issue description must be a string",
                status_code=400,
                details=[{"field": "description", "issue": "Must be a string"}],
            )
        clean_desc = description.strip()
        if len(clean_desc) > 2000:
            raise ApiError(
                code="VALIDATION_ERROR",
                message="Issue description cannot exceed 2000 characters",
                status_code=400,
                details=[{"field": "description", "issue": "Exceeds 2000 characters"}],
            )
        if not clean_desc:
            clean_desc = None

    if status is None:
        status = "Open"
    if status not in ISSUE_STATUSES:
        raise ApiError(
            code="VALIDATION_ERROR",
            message=f"Invalid issue status '{status}'. Must be one of: {sorted(list(ISSUE_STATUSES))}",
            status_code=400,
            details=[{"field": "status", "issue": "Invalid enum value"}],
        )

    if priority is None:
        priority = "Medium"
    if priority not in ISSUE_PRIORITIES:
        raise ApiError(
            code="VALIDATION_ERROR",
            message=f"Invalid issue priority '{priority}'. Must be one of: {sorted(list(ISSUE_PRIORITIES))}",
            status_code=400,
            details=[{"field": "priority", "issue": "Invalid enum value"}],
        )

    return title, clean_desc, status, priority


def list_issues_by_project(
    db_path: str,
    project_id: int,
    status: Optional[str] = None,
    search: Optional[str] = None,
) -> List[Issue]:
    existing_project = get_project_by_id(db_path, project_id)
    if not existing_project:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Project with ID {project_id} not found",
            status_code=404,
        )

    query = "SELECT id, project_id, title, description, status, priority, created_at FROM issues WHERE project_id = ?"
    params: List[Any] = [project_id]

    if status:
        query += " AND status = ?"
        params.append(status)

    if search:
        query += " AND LOWER(title) LIKE ?"
        params.append(f"%{search.lower()}%")

    query += " ORDER BY created_at DESC, id DESC"

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(query, params)
        rows = cur.fetchall()
        return [
            Issue(
                id=row["id"],
                project_id=row["project_id"],
                title=row["title"],
                description=row["description"],
                status=row["status"],
                priority=row["priority"],
                created_at=row["created_at"],
            )
            for row in rows
        ]
    finally:
        conn.close()


def get_issue_by_id(db_path: str, issue_id: int) -> Optional[Issue]:
    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, project_id, title, description, status, priority, created_at FROM issues WHERE id = ?",
            (issue_id,),
        )
        row = cur.fetchone()
        if not row:
            return None
        return Issue(
            id=row["id"],
            project_id=row["project_id"],
            title=row["title"],
            description=row["description"],
            status=row["status"],
            priority=row["priority"],
            created_at=row["created_at"],
        )
    finally:
        conn.close()


def create_issue(
    db_path: str,
    project_id: int,
    title: Any,
    description: Any = None,
    status: Any = "Open",
    priority: Any = "Medium",
) -> Issue:
    existing_project = get_project_by_id(db_path, project_id)
    if not existing_project:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Project with ID {project_id} not found",
            status_code=404,
        )

    clean_title, clean_desc, clean_status, clean_priority = validate_issue_payload(
        title, description, status, priority
    )

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO issues (project_id, title, description, status, priority)
            VALUES (?, ?, ?, ?, ?)
            """,
            (project_id, clean_title, clean_desc, clean_status, clean_priority),
        )
        conn.commit()
        issue_id = cur.lastrowid
        return get_issue_by_id(db_path, issue_id)  # type: ignore
    finally:
        conn.close()


def update_issue(
    db_path: str,
    issue_id: int,
    title: Any,
    description: Any = None,
    status: Any = None,
    priority: Any = None,
) -> Optional[Issue]:
    existing = get_issue_by_id(db_path, issue_id)
    if not existing:
        return None

    clean_title, clean_desc, clean_status, clean_priority = validate_issue_payload(
        title, description, status, priority, is_update=True
    )

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute(
            """
            UPDATE issues
            SET title = ?, description = ?, status = ?, priority = ?
            WHERE id = ?
            """,
            (clean_title, clean_desc, clean_status, clean_priority, issue_id),
        )
        conn.commit()
        return get_issue_by_id(db_path, issue_id)
    finally:
        conn.close()


def delete_issue(db_path: str, issue_id: int) -> bool:
    existing = get_issue_by_id(db_path, issue_id)
    if not existing:
        return False

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM issues WHERE id = ?", (issue_id,))
        conn.commit()
        return True
    finally:
        conn.close()


def get_project_dashboard(db_path: str, project_id: int) -> Optional[Dict[str, Any]]:
    project = get_project_by_id(db_path, project_id)
    if not project:
        return None

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()

        # Task aggregations
        cur.execute("SELECT COUNT(*) as count FROM tasks WHERE project_id = ?", (project_id,))
        total_tasks = cur.fetchone()["count"]

        task_by_status = {"Todo": 0, "In Progress": 0, "Done": 0}
        cur.execute(
            "SELECT status, COUNT(*) as count FROM tasks WHERE project_id = ? GROUP BY status",
            (project_id,),
        )
        for row in cur.fetchall():
            if row["status"] in task_by_status:
                task_by_status[row["status"]] = row["count"]

        # Issue aggregations
        cur.execute("SELECT COUNT(*) as count FROM issues WHERE project_id = ?", (project_id,))
        total_issues = cur.fetchone()["count"]

        issue_by_status = {"Open": 0, "In Progress": 0, "Resolved": 0}
        cur.execute(
            "SELECT status, COUNT(*) as count FROM issues WHERE project_id = ? GROUP BY status",
            (project_id,),
        )
        for row in cur.fetchall():
            if row["status"] in issue_by_status:
                issue_by_status[row["status"]] = row["count"]

        # Recent 5 tasks (ordered by created_at DESC, id DESC)
        cur.execute(
            """
            SELECT id, project_id, title, description, status, priority, created_at
            FROM tasks
            WHERE project_id = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 5
            """,
            (project_id,),
        )
        recent_tasks = [
            Task(
                id=row["id"],
                project_id=row["project_id"],
                title=row["title"],
                description=row["description"],
                status=row["status"],
                priority=row["priority"],
                created_at=row["created_at"],
            ).to_dict()
            for row in cur.fetchall()
        ]

        # Recent 5 issues (ordered by created_at DESC, id DESC)
        cur.execute(
            """
            SELECT id, project_id, title, description, status, priority, created_at
            FROM issues
            WHERE project_id = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 5
            """,
            (project_id,),
        )
        recent_issues = [
            Issue(
                id=row["id"],
                project_id=row["project_id"],
                title=row["title"],
                description=row["description"],
                status=row["status"],
                priority=row["priority"],
                created_at=row["created_at"],
            ).to_dict()
            for row in cur.fetchall()
        ]

        return {
            "project": {
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "created_at": project.created_at,
            },
            "task_metrics": {
                "total": total_tasks,
                "by_status": task_by_status,
            },
            "issue_metrics": {
                "total": total_issues,
                "by_status": issue_by_status,
            },
            "recent_tasks": recent_tasks,
            "recent_issues": recent_issues,
        }
    finally:
        conn.close()


