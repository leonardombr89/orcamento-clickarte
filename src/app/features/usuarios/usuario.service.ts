// src/app/features/usuarios/usuario.service.ts
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';
import { HttpParams } from '@angular/common/http';
import { Usuario } from './usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly endpoint = 'api/usuarios';

  constructor(
    private api: ApiService,
    private toast: ToastService,
    private loading: LoadingService
  ) {}

  listar(): Observable<Usuario[]> {
    this.loading.show();
    return this.api.get<Usuario[]>(this.endpoint).pipe(
      finalize(() => this.loading.hide()),
      catchError(err => {
        this.toast.show('Erro ao listar usuários', false);
        return throwError(() => err);
      })
    );
  }

  criar(usuario: Usuario): Observable<Usuario> {
    this.loading.show();
    return this.api.post<Usuario>(this.endpoint, usuario).pipe(
      finalize(() => this.loading.hide()),
      catchError(err => {
        this.toast.show('Erro ao criar usuário', false);
        return throwError(() => err);
      })
    );
  }

  atualizar(id: number, usuario: Usuario): Observable<Usuario> {
    this.loading.show();
    return this.api.put<Usuario>(`${this.endpoint}/${id}`, usuario).pipe(
      finalize(() => this.loading.hide()),
      catchError(err => {
        this.toast.show('Erro ao atualizar usuário', false);
        return throwError(() => err);
      })
    );
  }

  desativar(id: number): Observable<void> {
    this.loading.show();
    return this.api.delete<void>(`${this.endpoint}/${id}`).pipe(
      finalize(() => this.loading.hide()),
      catchError(err => {
        this.toast.show('Erro ao desativar usuário', false);
        return throwError(() => err);
      })
    );
  }
}
