"""
FastAPI dependencies for authentication and authorization.
"""

# --- IMPORTS ---
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer
from opty_api.app import container
from opty_api.schemas.user import User
from opty_api.utils.auth import get_user_from_token


# --- GLOBAL ---
# HTTP Bearer security scheme
security = HTTPBearer()


# --- CODE ---
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Dependency to get the current authenticated user.
    Validates the JWT token and returns the user profile from MongoDB.

    :param credentials: HTTP authorization credentials.
    :return: Current user profile.

    :raises HTTPException: If the token is invalid or user not found.
    """

    # Extract token from credentials
    token = credentials.credentials

    # Validate token with Supabase and get user
    supabase_user = await get_user_from_token(token)

    # Invalid token: raise 401 exception
    if not supabase_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid authentication credentials',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    # Get user profile from MongoDB
    user = await container['user_repository'].get_by_supabase_id(supabase_user.user.id)

    # User profile not found: raise 404 exception
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='User profile not found',
        )

    # Return user profile
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency to get the current active user.

    :param current_user: Current user profile from get_current_user dependency.
    :return: Current active user profile.

    :raises HTTPException: If the user is inactive.
    """
    # Check if user is active
    if not current_user['is_active']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='User account is inactive',
        )

    # Return active user profile
    return current_user


def require_role(required_role: str):
    """
    Dependency factory to require specific user role.

    Usage:
        @router.get('/supervisor-endpoint')
        async def endpoint(current_user: User = Depends(require_role('supervisor'))):
        ...

    :param required_role: The required user role.

    :return: A dependency function that checks the user's role.

    :raises HTTPException: If the user role does not match the required role.
    """

    # Role checker function
    async def role_checker(current_user: User = Depends(get_current_active_user)) -> User:

        # User role does not match: raise 403 exception
        if current_user['role'] != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f'Access denied. Required role: {required_role}'
            )

        # Return current user
        return current_user

    # Return the role checker function
    return role_checker
