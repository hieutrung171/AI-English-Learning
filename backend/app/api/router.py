from fastapi import APIRouter

from app.api.routes import admin, auth, chat, health, learning

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(chat.router, tags=["tutor"])
api_router.include_router(learning.router, tags=["learning"])
api_router.include_router(auth.router, tags=["authentication"])
api_router.include_router(admin.router, tags=["administration"])
