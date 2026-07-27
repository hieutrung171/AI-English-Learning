from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models.user import User, UserRole
from sqlalchemy import select


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    if settings.admin_email and settings.admin_password:
        with SessionLocal() as db:
            email = settings.admin_email.strip().lower()
            if not db.scalar(select(User).where(User.email == email)):
                db.add(
                    User(
                        email=email,
                        full_name="FluentAI Administrator",
                        password_hash=hash_password(settings.admin_password),
                        role=UserRole.admin.value,
                        preferred_language="vi",
                    )
                )
                db.commit()
    yield

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="AI service for adaptive English learning.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix="/api/v1")
