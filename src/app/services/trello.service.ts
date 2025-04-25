import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrelloService {
  private apiKey = '';
  private token = '';
  private idLista = '';

  constructor(private http: HttpClient) {}

  criarCard(nome: string, descricao: string) {
    const url = `https://api.trello.com/1/cards`;

    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('token', this.token)
      .set('idList', this.idLista)
      .set('name', nome)
      .set('desc', descricao);

    return this.http.post(url, null, { params });
  }
}
