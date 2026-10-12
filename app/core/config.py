from functools import lru_cache
import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]
RUNTIME_DIR = Path("/tmp") if os.environ.get("VERCEL") else BASE_DIR


class Settings(BaseSettings):
    app_name: str = "NovaRetail"
    app_env: str = "development"
    openai_api_key: str = ""
    tavily_api_key: str = ""
    pinecone_api_key: str = ""
    pinecone_index_name: str = "fde-it-support-rag"
    pinecone_namespace: str = "company-it-kb"
    embedding_model: str = "text-embedding-3-small"
    openai_model: str = "gpt-4o-mini"
    top_k: int = 4
    max_retries: int = 1
    admin_api_key: str = ""
    audit_db_path: str = str(RUNTIME_DIR / "data" / "audit.db")
    upload_dir: str = str(RUNTIME_DIR / "uploads")
    sample_kb_dir: str = str(BASE_DIR / "data" / "sample_kb")

    model_config = SettingsConfigDict(env_file=str(BASE_DIR / ".env"), extra="ignore")




@lru_cache
def get_settings() -> Settings:
    return Settings()
