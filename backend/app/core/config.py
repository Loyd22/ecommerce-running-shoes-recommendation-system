# backend/app/core/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Your OpenAI API key
    OPENAI_API_KEY: str

    # Model name used by the AI client
    OPENAI_MODEL: str = "gpt-4.1-mini"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()