import pytest
import os
from backend.app import create_app
from backend.db import init_db


@pytest.fixture
def test_db_path(tmp_path):
    db_file = str(tmp_path / "test.db")
    init_db(db_file)
    return db_file


@pytest.fixture
def app(test_db_path):
    app = create_app({"TESTING": True, "DB_PATH": test_db_path})
    return app


@pytest.fixture
def client(app):
    return app.test_client()
