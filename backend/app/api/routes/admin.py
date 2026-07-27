from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.routes.auth import serialize_user
from app.core.database import get_db
from app.core.security import require_admin
from app.models.schemas import UserResponse
from app.models.user import User

router = APIRouter(prefix="/admin")


@router.get("/users", response_model=list[UserResponse])
def list_users(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> list[UserResponse]:
    users = db.scalars(select(User).order_by(User.created_at.desc())).all()
    return [serialize_user(user) for user in users]
