import sqlite3
import pytest
from backend.db import get_connection


def test_schema_creation_and_insertion(test_db_path):
    conn = get_connection(test_db_path)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO projects (name, description) VALUES (?, ?)",
        ("Test Project", "Description"),
    )
    conn.commit()
    project_id = cur.lastrowid
    assert project_id is not None

    cur.execute(
        "INSERT INTO tasks (project_id, title, status, priority) VALUES (?, ?, ?, ?)",
        (project_id, "Test Task", "Todo", "Medium"),
    )
    conn.commit()
    task_id = cur.lastrowid
    assert task_id is not None

    cur.execute(
        "INSERT INTO issues (project_id, title, status, priority) VALUES (?, ?, ?, ?)",
        (project_id, "Test Issue", "Open", "High"),
    )
    conn.commit()
    issue_id = cur.lastrowid
    assert issue_id is not None
    conn.close()


def test_project_name_constraint_rejects_empty(test_db_path):
    conn = get_connection(test_db_path)
    cur = conn.cursor()
    with pytest.raises(sqlite3.IntegrityError):
        cur.execute("INSERT INTO projects (name) VALUES ('   ')")
        conn.commit()
    conn.close()


def test_task_constraints(test_db_path):
    conn = get_connection(test_db_path)
    cur = conn.cursor()
    cur.execute("INSERT INTO projects (name) VALUES ('P1')")
    conn.commit()
    pid = cur.lastrowid

    # Empty title rejected
    with pytest.raises(sqlite3.IntegrityError):
        cur.execute(
            "INSERT INTO tasks (project_id, title) VALUES (?, '   ')", (pid,)
        )
        conn.commit()

    # Invalid status rejected
    with pytest.raises(sqlite3.IntegrityError):
        cur.execute(
            "INSERT INTO tasks (project_id, title, status) VALUES (?, 'T1', 'Invalid')",
            (pid,),
        )
        conn.commit()

    # Invalid priority rejected
    with pytest.raises(sqlite3.IntegrityError):
        cur.execute(
            "INSERT INTO tasks (project_id, title, priority) VALUES (?, 'T1', 'Critical')",
            (pid,),
        )
        conn.commit()
    conn.close()


def test_issue_constraints(test_db_path):
    conn = get_connection(test_db_path)
    cur = conn.cursor()
    cur.execute("INSERT INTO projects (name) VALUES ('P1')")
    conn.commit()
    pid = cur.lastrowid

    # Empty title rejected
    with pytest.raises(sqlite3.IntegrityError):
        cur.execute(
            "INSERT INTO issues (project_id, title) VALUES (?, '   ')", (pid,)
        )
        conn.commit()

    # Invalid status rejected
    with pytest.raises(sqlite3.IntegrityError):
        cur.execute(
            "INSERT INTO issues (project_id, title, status) VALUES (?, 'I1', 'Closed')",
            (pid,),
        )
        conn.commit()

    # Invalid priority rejected
    with pytest.raises(sqlite3.IntegrityError):
        cur.execute(
            "INSERT INTO issues (project_id, title, priority) VALUES (?, 'I1', 'Extreme')",
            (pid,),
        )
        conn.commit()
    conn.close()


def test_foreign_key_enforcement(test_db_path):
    conn = get_connection(test_db_path)
    cur = conn.cursor()
    with pytest.raises(sqlite3.IntegrityError):
        cur.execute(
            "INSERT INTO tasks (project_id, title) VALUES (999, 'Orphan Task')"
        )
        conn.commit()
    conn.close()


def test_cascading_delete(test_db_path):
    conn = get_connection(test_db_path)
    cur = conn.cursor()
    cur.execute("INSERT INTO projects (name) VALUES ('Cascade Project')")
    conn.commit()
    pid = cur.lastrowid

    cur.execute(
        "INSERT INTO tasks (project_id, title) VALUES (?, 'Task 1')", (pid,)
    )
    cur.execute(
        "INSERT INTO issues (project_id, title) VALUES (?, 'Issue 1')", (pid,)
    )
    conn.commit()

    # Verify rows exist
    cur.execute("SELECT COUNT(*) FROM tasks WHERE project_id = ?", (pid,))
    assert cur.fetchone()[0] == 1
    cur.execute("SELECT COUNT(*) FROM issues WHERE project_id = ?", (pid,))
    assert cur.fetchone()[0] == 1

    # Delete project
    cur.execute("DELETE FROM projects WHERE id = ?", (pid,))
    conn.commit()

    # Verify cascading delete purged tasks and issues
    cur.execute("SELECT COUNT(*) FROM tasks WHERE project_id = ?", (pid,))
    assert cur.fetchone()[0] == 0
    cur.execute("SELECT COUNT(*) FROM issues WHERE project_id = ?", (pid,))
    assert cur.fetchone()[0] == 0
    conn.close()
