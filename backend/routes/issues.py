from flask import Blueprint, jsonify, request, current_app
from backend.repository import (
    list_issues_by_project,
    get_issue_by_id,
    create_issue,
    update_issue,
    delete_issue,
)
from backend.errors import ApiError

issues_bp = Blueprint("issues", __name__)


@issues_bp.route("/api/projects/<int:project_id>/issues", methods=["GET"])
def get_project_issues(project_id: int):
    status = request.args.get("status")
    search = request.args.get("search")
    db_path = current_app.config["DB_PATH"]

    issues = list_issues_by_project(db_path, project_id, status=status, search=search)
    return jsonify([i.to_dict() for i in issues]), 200


@issues_bp.route("/api/projects/<int:project_id>/issues", methods=["POST"])
def create_project_issue(project_id: int):
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    description = data.get("description")
    status = data.get("status", "Open")
    priority = data.get("priority", "Medium")
    db_path = current_app.config["DB_PATH"]

    issue = create_issue(db_path, project_id, title, description, status, priority)
    return jsonify(issue.to_dict()), 201


@issues_bp.route("/api/issues/<int:issue_id>", methods=["GET"])
def get_single_issue(issue_id: int):
    db_path = current_app.config["DB_PATH"]
    issue = get_issue_by_id(db_path, issue_id)
    if not issue:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Issue with ID {issue_id} not found",
            status_code=404,
        )
    return jsonify(issue.to_dict()), 200


@issues_bp.route("/api/issues/<int:issue_id>", methods=["PUT"])
def update_single_issue(issue_id: int):
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    description = data.get("description")
    status = data.get("status")
    priority = data.get("priority")
    db_path = current_app.config["DB_PATH"]

    updated = update_issue(db_path, issue_id, title, description, status, priority)
    if not updated:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Issue with ID {issue_id} not found",
            status_code=404,
        )
    return jsonify(updated.to_dict()), 200


@issues_bp.route("/api/issues/<int:issue_id>", methods=["DELETE"])
def delete_single_issue(issue_id: int):
    db_path = current_app.config["DB_PATH"]
    deleted = delete_issue(db_path, issue_id)
    if not deleted:
        raise ApiError(
            code="NOT_FOUND",
            message=f"Issue with ID {issue_id} not found",
            status_code=404,
        )
    return "", 204
