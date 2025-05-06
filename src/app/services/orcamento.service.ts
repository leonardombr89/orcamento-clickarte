import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrcamentoService {

  constructor(private api: ApiService) {}

  processarOrcamento(
    altura: number,
    largura: number,
    quantidade: number,
    tipo: string,
    corte: string
  ): Observable<any> {
    const payload = { altura, largura, quantidade, tipo, corte };
    return this.api.post<any>('orcamentos/adesivos', payload);
  }

  listarTodos(page: number = 0, size: number = 10): Observable<any> {
    const httpParams = new HttpParams()
      .set('page', page)
      .set('size', size);
  
    return this.api.get<any>('api/orcamentos', httpParams);
  }

  /*gerarMensagemOrcamento(altura: number, largura: number, quantidade: number, orcamento: any): string {
    let mensagem = `*Orçamento Gráfica ClickArte*\n\n`;
    mensagem += `📏 *Dimensões:* ${largura} x ${altura}cm\n`;
    mensagem += `📦 *Quantidade:* ${quantidade}\n\n`;
    mensagem += `🖨️ *Produtos e Serviços:*\n`;

    orcamento.produtos.forEach((produto: any) => {
      mensagem += `➖ *Qtd:* ${produto.quantidade}, *Desc:* ${produto.descricao}, *Val.Un:* R$${produto.valorUnitario.toFixed(2)}, *SubTotal:* R$${produto.subTotal.toFixed(2)}\n`;
    });

    mensagem += `\n💰 *Valor Total:* *R$${orcamento.valorFinal.toFixed(2)}*`;
    return mensagem;
  }*/
}
