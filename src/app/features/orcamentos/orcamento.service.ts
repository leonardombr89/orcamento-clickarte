import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { OrcamentoDTO } from './orcamento.dto';
import { ApiService } from '../../../app/services/api.service';
import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrcamentoService {
  private readonly endpoint = 'api/orcamentos';

  constructor(
    private api: ApiService,
    private toast: ToastService,
    private loading: LoadingService
  ) {}

  listarTodos(
    page: number = 0,
    size: number = 10,
    filtroBusca?: string,
    filtroStatus?: string,
    dataInicial?: string,
    dataFinal?: string
  ): Observable<any> {
    this.loading.show();
  
    let httpParams = new HttpParams()
      .set('page', page)
      .set('size', size);
  
    if (filtroBusca) {
      httpParams = httpParams.set('nome', filtroBusca);
    }
  
    if (filtroStatus) {
      httpParams = httpParams.set('status', filtroStatus);
    }
  
    if (dataInicial) {
      httpParams = httpParams.set('dataInicial', dataInicial);
    }
  
    if (dataFinal) {
      httpParams = httpParams.set('dataFinal', dataFinal);
    }
  
    return this.api.get<any>(this.endpoint, httpParams).pipe(
      finalize(() => this.loading.hide()),
      catchError(err => {
        this.toast.show('Erro ao listar orçamentos', false);
        return throwError(() => err);
      })
    );
  }
  
  

  buscarPorId(id: number): Observable<OrcamentoDTO> {
    this.loading.show();
    return this.api.get<OrcamentoDTO>(`${this.endpoint}/${id}`).pipe(
      finalize(() => this.loading.hide()),
      catchError(err => {
        this.toast.show('Erro ao buscar orçamento', false);
        return throwError(() => err);
      })
    );
  }

  criar(orcamento: OrcamentoDTO): Observable<OrcamentoDTO> {
    this.loading.show();
    return this.api.post<OrcamentoDTO>(this.endpoint, orcamento).pipe(
      finalize(() => this.loading.hide()),
      catchError(err => {
        this.toast.show('Erro ao salvar orçamento', false);
        return throwError(() => err);
      })
    );
  }

  atualizar(id: number, orcamento: OrcamentoDTO): Observable<OrcamentoDTO> {
    this.loading.show();
    return this.api.put<OrcamentoDTO>(`${this.endpoint}/${id}`, orcamento).pipe(
      finalize(() => this.loading.hide()),
      catchError(err => {
        this.toast.show('Erro ao atualizar orçamento', false);
        return throwError(() => err);
      })
    );
  }

  atualizarStatus(id: number, status: 'APROVADO' | 'REPROVADO' | 'VENCIDO' | 'CANCELADO' | 'PENDENTE'): Observable<OrcamentoDTO> {
    this.loading.show();
  
    return this.api.put<OrcamentoDTO>(`${this.endpoint}/${id}/status`, { status }).pipe(
      finalize(() => this.loading.hide()),
      catchError(err => {
        this.toast.show('Erro ao atualizar status', false);
        return throwError(() => err);
      })
    );
  }

  deletar(id: number): Observable<void> {
    this.loading.show();
    return this.api.delete<void>(`${this.endpoint}/${id}`).pipe(
      finalize(() => this.loading.hide()),
      catchError(err => {
        this.toast.show('Erro ao deletar orçamento', false);
        return throwError(() => err);
      })
    );
  }
}
