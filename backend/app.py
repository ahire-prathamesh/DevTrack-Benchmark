from flask import Flask, jsonify, request
from flask_cors import CORS
from typing import Optional, Dict, Any
import os

from backend.config import Config
from backend.db import init_db
from backend.errors import ApiError


def create_app(test_config: Optional[Dict[str, Any]] = None) -> Flask:
    app = Flask(__name__)

    # Default configuration
    app.config["DB_PATH"] = Config.DB_PATH
    app.config["DEBUG"] = Config.DEBUG

    if test_config:
        app.config.update(test_config)

    # Enable CORS for frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize SQLite database
    init_db(app.config["DB_PATH"])

    # Register blueprints
    from backend.routes.projects import projects_bp
    app.register_blueprint(projects_bp)

    try:
        from backend.routes.tasks import tasks_bp
        app.register_blueprint(tasks_bp)
    except ImportError:
        pass

    try:
        from backend.routes.issues import issues_bp
        app.register_blueprint(issues_bp)
    except ImportError:
        pass

    # Centralized error handlers
    @app.errorhandler(ApiError)
    def handle_api_error(err: ApiError):
        return (
            jsonify(
                {
                    "error": {
                        "code": err.code,
                        "message": err.message,
                        "details": err.details,
                    }
                }
            ),
            err.status_code,
        )

    @app.errorhandler(400)
    def handle_bad_request(err):
        return (
            jsonify(
                {
                    "error": {
                        "code": "BAD_REQUEST",
                        "message": str(err.description)
                        if hasattr(err, "description")
                        else "Bad request",
                        "details": [],
                    }
                }
            ),
            400,
        )

    @app.errorhandler(404)
    def handle_not_found(err):
        return (
            jsonify(
                {
                    "error": {
                        "code": "NOT_FOUND",
                        "message": str(err.description)
                        if hasattr(err, "description")
                        else "Resource not found",
                        "details": [],
                    }
                }
            ),
            404,
        )

    @app.errorhandler(405)
    def handle_method_not_allowed(err):
        return (
            jsonify(
                {
                    "error": {
                        "code": "METHOD_NOT_ALLOWED",
                        "message": "Method not allowed for requested URL",
                        "details": [],
                    }
                }
            ),
            405,
        )

    @app.errorhandler(500)
    def handle_server_error(err):
        return (
            jsonify(
                {
                    "error": {
                        "code": "INTERNAL_ERROR",
                        "message": "An internal server error occurred",
                        "details": [],
                    }
                }
            ),
            500,
        )

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)
