from dataclasses import dataclass, asdict
from typing import Optional, Any, Dict

TASK_STATUSES = {"Todo", "In Progress", "Done"}
TASK_PRIORITIES = {"Low", "Medium", "High"}
ISSUE_STATUSES = {"Open", "In Progress", "Resolved"}
ISSUE_PRIORITIES = {"Low", "Medium", "High"}


@dataclass
class Project:
    id: Optional[int]
    name: str
    description: Optional[str]
    created_at: Optional[str] = None
    task_count: Optional[int] = None
    issue_count: Optional[int] = None

    def to_dict(self) -> Dict[str, Any]:
        data: Dict[str, Any] = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at,
        }
        if self.task_count is not None:
            data["task_count"] = self.task_count
        if self.issue_count is not None:
            data["issue_count"] = self.issue_count
        return data


@dataclass
class Task:
    id: Optional[int]
    project_id: int
    title: str
    description: Optional[str]
    status: str = "Todo"
    priority: str = "Medium"
    created_at: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "project_id": self.project_id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "created_at": self.created_at,
        }


@dataclass
class Issue:
    id: Optional[int]
    project_id: int
    title: str
    description: Optional[str]
    status: str = "Open"
    priority: str = "Medium"
    created_at: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "project_id": self.project_id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "created_at": self.created_at,
        }
