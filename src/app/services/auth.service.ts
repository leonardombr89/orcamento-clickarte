import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from '../features/usuarios/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private api: ApiService, private router: Router) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.api.post<{ token: string }>('auth/login', { username, password }).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  salvarToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Erro ao decodificar token:', e);
      return null;
    }
  }

  getUsuarioNome(): string | null {
    const payload = this.decodeToken();
    return payload?.nome || null;
  }

  getPerfilUsuario(): string | null {
    const payload = this.decodeToken();
    return payload?.roles?.[0]?.replace('ROLE_', '') || null;
  }

  getUsuario(): Usuario {
    const payload = this.decodeToken();
    if (!payload) throw new Error('Token inválido');

    return {
      id: payload.id,
      nome: payload.nome,
      username: payload.sub,
      perfil: payload.roles?.[0]?.replace('ROLE_', '') || 'OPERADOR',
      senha: '',
      ativo: true
    };
  }

}
