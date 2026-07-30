import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional de Angular que adjunta automáticamente el ID del
 * usuario autenticado como header `X-User-Id` en cada petición HTTP
 * dirigida al backend de AuraStock (excepto login y registro).
 *
 * De esta forma el backend puede aislar los datos por usuario (multi-tenant)
 * sin que cada servicio tenga que gestionar la autenticación manualmente.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Rutas que NO requieren el header (autenticación pública)
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublic = publicPaths.some(path => req.url.includes(path));

  if (isPublic) {
    return next(req);
  }

  const session = authService.getSession();

  // Si hay sesión activa, clona la petición añadiendo el header X-User-Id
  if (session?.id) {
    const authReq = req.clone({
      setHeaders: {
        'X-User-Id': String(session.id),
      },
    });
    return next(authReq);
  }

  // Sin sesión: deja pasar la petición sin modificar (el backend la rechazará con 401)
  return next(req);
};
