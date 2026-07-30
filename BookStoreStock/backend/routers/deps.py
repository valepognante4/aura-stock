from fastapi import Header, HTTPException


def get_current_user_id(x_user_id: int | None = Header(default=None)) -> int:
    """
    Dependencia de seguridad: extrae el ID del usuario autenticado
    desde el header HTTP 'X-User-Id' que inyecta el interceptor Angular.

    Lanza 401 si el header está ausente o no es un entero válido.
    """
    if x_user_id is None:
        raise HTTPException(
            status_code=401,
            detail="No autenticado: se requiere el header X-User-Id.",
        )
    return x_user_id
