from fastapi import APIRouter

from app.api.routes import chat, health, learning

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(chat.router, tags=["tutor"])
api_router.include_router(learning.router, tags=["learning"])
