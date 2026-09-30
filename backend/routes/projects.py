from flask import Blueprint, jsonify, request, current_app
from backend.repository import (
    list_projects,
    get_project_by_id,
    create_project,
    update_project,
    delete_project,
    get_project_dashboard,
)
from backend.errors import ApiError

projects_bp = Blueprint("projects", __name__, url_prefix="/api/projects")


@projects_bp.route("", methods=["GET"])
def get_all_projects():
    db_path = current_app.config["DB_PATH"]
    projects = list_projects(db_path)
    return jsonify([p.to_dict() for p in projects]), 200


@projects_bp.route("", methods=["POST"])
def create_new_project():
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    description = data.get("description")
    db_path = current_app.config["DB_PATH"]

    project = create_project(db_path, name, description)
    return jsonify(project.to_dict()), 201


@projects_bp.route("/<int:project_id>", methods=["GET"])
def get_single_project(project_id: int):
    db_path = current_app.config["DB_PATH"]
    project = get_project_by_id(db_path, project_id)
    if not project:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Project with ID {project_id} not found",
            status_code=404,
        )
    return jsonify(project.to_dict()), 200


@projects_bp.route("/<int:project_id>", methods=["PUT"])
def update_single_project(project_id: int):
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    description = data.get("description")
    db_path = current_app.config["DB_PATH"]

    updated = update_project(db_path, project_id, name, description)
    if not updated:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Project with ID {project_id} not found",
            status_code=404,
        )
    return jsonify(updated.to_dict()), 200


@projects_bp.route("/<int:project_id>", methods=["DELETE"])
def delete_single_project(project_id: int):
    db_path = current_app.config["DB_PATH"]
    deleted = delete_project(db_path, project_id)
    if not deleted:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Project with ID {project_id} not found",
            status_code=404,
        )
    return "", 204


@projects_bp.route("/<int:project_id>/dashboard", methods=["GET"])
def get_project_dashboard_route(project_id: int):
    db_path = current_app.config["DB_PATH"]
    data = get_project_dashboard(db_path, project_id)
    if not data:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Project with ID {project_id} not found",
            status_code=404,
        )
    return jsonify(data), 200

