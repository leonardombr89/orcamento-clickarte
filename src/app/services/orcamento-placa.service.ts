// src/app/services/orcamento-placa.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrcamentoPlacaService {

  constructor() { }

  processarOrcamento(altura: number, largura: number) {
    // Só preparando o básico por enquanto

    const alturaCm = altura < 1 ? altura * 100 : altura;
    const larguraCm = largura < 1 ? largura * 100 : largura;

    const area = (alturaCm / 100) * (larguraCm / 100); // Área em metros quadrados

    // 🚧 Aqui depois vamos usar a regra de cálculo que você me explicar

    const precoMetroQuadrado = 120; // Exemplo fixo
    const valorTotal = area * precoMetroQuadrado;

    const produtos = [
      {
        descricao: 'Placa personalizada',
        altura: alturaCm,
        largura: larguraCm,
        area: area.toFixed(2),
        valorUnitario: precoMetroQuadrado,
        subTotal: valorTotal
      }
    ];

    return {
      produtos,
      valorFinal: valorTotal
    };
  }

  gerarMensagemOrcamento(altura: number, largura: number, orcamento: any): string {
    let mensagem = `*Orçamento de Placa - ClickArte*\n\n`;
    mensagem += `📏 *Tamanho:* ${largura} x ${altura} cm\n`;
    mensagem += `🖨️ *Área:* ${orcamento.produtos[0].area} m²\n\n`;
    mensagem += `➖ *Produto:* ${orcamento.produtos[0].descricao}\n`;
    mensagem += `💵 *Valor m²:* R$${orcamento.produtos[0].valorUnitario.toFixed(2)}\n`;
    mensagem += `💰 *Valor Total:* *R$${orcamento.valorFinal.toFixed(2)}*`;

    return mensagem;
  }
}
