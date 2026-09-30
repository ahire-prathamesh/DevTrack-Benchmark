from flask import Blueprint, jsonify, request, current_app
from backend.repository import (
    list_tasks_by_project,
    get_task_by_id,
    create_task,
    update_task,
    delete_task,
)
from backend.errors import ApiError

tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.route("/api/projects/<int:project_id>/tasks", methods=["GET"])
def get_project_tasks(project_id: int):
    status = request.args.get("status")
    search = request.args.get("search")
    db_path = current_app.config["DB_PATH"]

    tasks = list_tasks_by_project(db_path, project_id, status=status, search=search)
    return jsonify([t.to_dict() for t in tasks]), 200


@tasks_bp.route("/api/projects/<int:project_id>/tasks", methods=["POST"])
def create_project_task(project_id: int):
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    description = data.get("description")
    status = data.get("status", "Todo")
    priority = data.get("priority", "Medium")
    db_path = current_app.config["DB_PATH"]

    task = create_task(db_path, project_id, title, description, status, priority)
    return jsonify(task.to_dict()), 201


@tasks_bp.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_single_task(task_id: int):
    db_path = current_app.config["DB_PATH"]
    task = get_task_by_id(db_path, task_id)
    if not task:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Task with ID {task_id} not found",
            status_code=404,
        )
    return jsonify(task.to_dict()), 200


@tasks_bp.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_single_task(task_id: int):
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    description = data.get("description")
    status = data.get("status")
    priority = data.get("priority")
    db_path = current_app.config["DB_PATH"]

    updated = update_task(db_path, task_id, title, description, status, priority)
    if not updated:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Task with ID {task_id} not found",
            status_code=404,
        )
    return jsonify(updated.to_dict()), 200


@tasks_bp.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_single_task(task_id: int):
    db_path = current_app.config["DB_PATH"]
    deleted = delete_task(db_path, task_id)
    if not deleted:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Task with ID {task_id} not found",
            status_code=404,
        )
    return "", 204
