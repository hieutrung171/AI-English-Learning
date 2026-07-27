from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, get_current_user, hash_password, verify_password
from app.models.schemas import (
    AuthResponse,
    LanguageUpdate,
    LoginRequest,
    RegisterRequest,
    UserResponse,
)
from app.models.user import User, UserRole

router = APIRouter(prefix="/auth")


def serialize_user(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        preferred_language=user.preferred_language,
        is_active=user.is_active,
    )


def set_auth_cookie(response: Response, user: User) -> None:
    response.set_cookie(
        key="access_token",
        value=create_access_token(user),
        httponly=True,
        secure=settings.secure_cookies,
        samesite="lax",
        max_age=settings.access_token_minutes * 60,
        path="/",
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, response: Response, db: Session = Depends(get_db)) -> AuthResponse:
    email = request.email.strip().lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="Email is already registered")

    user = User(
        email=email,
        full_name=request.full_name.strip(),
        password_hash=hash_password(request.password),
        role=UserRole.learner.value,
        preferred_language=request.preferred_language,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    set_auth_cookie(response, user)
    return AuthResponse(user=serialize_user(user), message="Account created")


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, response: Response, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.scalar(select(User).where(User.email == request.email.strip().lower()))
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")
    set_auth_cookie(response, user)
    return AuthResponse(user=serialize_user(user), message="Signed in")


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> None:
    response.delete_cookie("access_token", path="/")


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)) -> UserResponse:
    return serialize_user(user)


@router.patch("/language", response_model=UserResponse)
def update_language(
    request: LanguageUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserResponse:
    user.preferred_language = request.preferred_language
    db.add(user)
    db.commit()
    db.refresh(user)
    return serialize_user(user)
