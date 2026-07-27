from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI English Learning API"
    database_url: str = "sqlite:///./ai_english.db"
    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
