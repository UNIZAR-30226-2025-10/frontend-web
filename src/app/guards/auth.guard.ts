import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {

  const tokenService = inject(TokenService)
  const token = tokenService.getToken();  // Obtiene el token
  const userRole = tokenService.getTipo();
  const router = inject(Router);   // Crea una instancia del Router

  if (!token) {  
    router.navigate(['/login']);  // Si no hay token, redirige a login
    return false;  
  }

  const requiredRoles = route.data['roles'];  // El rol que se necesita para acceder a la ruta

  if (requiredRoles && requiredRoles.includes(userRole)) {
    return true;  // Si el rol del usuario está permitido, puedes acceder a la ruta
  } else {
    router.navigate(['/login']);  // Rediriges si el usuario no tiene el rol adecuado
    return false;
  }
};
