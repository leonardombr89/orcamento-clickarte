import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrelloService {
  private backendUrl = 'https://crmclickarte.fly.dev/trello/cards'; // agora é seu BACKEND

  constructor(private http: HttpClient) {}

  criarCard(nome: string, descricao: string) {
    const payload = {
      titulo: nome,
      descricao: descricao
    };

    return this.http.post(this.backendUrl, payload);
  }
}
