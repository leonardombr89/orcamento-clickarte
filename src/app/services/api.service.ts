import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.BASE_URL}/${endpoint}`, { params })
      .pipe(catchError(error => this.handleError(error)));
  }

  post<T>(endpoint: string, body: any, params?: HttpParams): Observable<T> {
    return this.http.post<T>(`${this.BASE_URL}/${endpoint}`, body, { params })
      .pipe(catchError(error => this.handleError(error)));
  }

  put<T>(endpoint: string, body: any, params?: HttpParams): Observable<T> {
    return this.http.put<T>(`${this.BASE_URL}/${endpoint}`, body, { params })
      .pipe(catchError(error => this.handleError(error)));
  }

  delete<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.delete<T>(`${this.BASE_URL}/${endpoint}`, { params })
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any) {
    console.error('Erro na requisição:', error);
    this.toastService.show('Erro ao processar a solicitação!', false);
    return throwError(() => error);
  }
}
