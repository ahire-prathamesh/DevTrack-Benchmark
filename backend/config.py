import os

DEFAULT_DB_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "devtrack.db"
)


class Config:
    DB_PATH: str = os.environ.get("DEVTRACK_DB", DEFAULT_DB_PATH)
    PORT: int = int(os.environ.get("PORT", "5000"))
    DEBUG: bool = os.environ.get("FLASK_DEBUG", "0") == "1"
