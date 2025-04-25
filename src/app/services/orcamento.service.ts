// src/app/services/orcamento.service.ts

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class OrcamentoService {

    constructor() { }

    processarOrcamento(
        altura: number,
        largura: number,
        quantidade: number,
        tipo: string,
        corte: string
      ) {
        const alturaEmCm = altura < 1 ? altura * 100 : altura;
        const larguraEmCm = largura < 1 ? largura * 100 : largura;
      
        const folhaMap = this.obterFolhaMap();
      
        if (!folhaMap.has('SRA3') || !folhaMap.has('A4')) {
          console.error("Erro: Formato SRA3 ou A4 não encontrado no mapa de folhas!");
          return null;
        }
      
        const sra3 = (folhaMap.get('SRA3') as any)[tipo.toLowerCase()];
        const a4 = (folhaMap.get('A4') as any)[tipo.toLowerCase()];
      
        if (!sra3 || !a4) {
          console.error("Erro: Tipo de material não suportado!");
          return null;
        }
      
        const resultadoSRA3 = this.calculaMelhorOrientacao(sra3, alturaEmCm, larguraEmCm);
        const resultadoA4 = this.calculaMelhorOrientacao(a4, alturaEmCm, larguraEmCm);
      
        let folhasSRA3 = Math.floor(quantidade / resultadoSRA3.quantidade);
        let sobra = quantidade % resultadoSRA3.quantidade;
      
        let folhasA4 = 0;
        if (sobra > 0) {
          if (sobra <= resultadoA4.quantidade) {
            folhasA4 = 1;
          } else {
            folhasSRA3 += 1;
          }
        }
      
        const produtos: any[] = [];
      
        if (folhasSRA3 > 0) {
          produtos.push({
            quantidade: folhasSRA3,
            descricao: sra3.descricao,
            valorUnitario: sra3.valorFolha,
            subTotal: folhasSRA3 * sra3.valorFolha
          });
        }
        if (folhasA4 > 0) {
          produtos.push({
            quantidade: folhasA4,
            descricao: a4.descricao,
            valorUnitario: a4.valorFolha,
            subTotal: folhasA4 * a4.valorFolha
          });
        }
      
        if (corte !== "Nenhum") {
          if (folhasSRA3 > 0) {
            produtos.push({
              quantidade: folhasSRA3,
              descricao: `Corte ${corte} SRA3`,
              valorUnitario: corte === "Manual" ? sra3.corteManual : sra3.corteEletronico,
              subTotal: folhasSRA3 * (corte === "Manual" ? sra3.corteManual : sra3.corteEletronico)
            });
          }
          if (folhasA4 > 0) {
            produtos.push({
              quantidade: folhasA4,
              descricao: `Corte ${corte} A4`,
              valorUnitario: corte === "Manual" ? a4.corteManual : a4.corteEletronico,
              subTotal: folhasA4 * (corte === "Manual" ? a4.corteManual : a4.corteEletronico)
            });
          }
        }
      
        const valorFinal = produtos.reduce((acc, item) => acc + item.subTotal, 0);
      
        const adesivosRestantes = (resultadoSRA3.quantidade * folhasSRA3 + resultadoA4.quantidade * folhasA4) - quantidade;
      
        const detalhesImpressao = [`Ainda cabem ${adesivosRestantes} sem aumentar o valor`];
      
        if (folhasSRA3 > 0) {
          detalhesImpressao.push(`A melhor orientação do SRA3 é ${resultadoSRA3.orientacao}, quantidade p/ folha ${resultadoSRA3.quantidade}`);
        }
        if (folhasA4 > 0) {
          detalhesImpressao.push(`A melhor orientação do A4 é ${resultadoA4.orientacao}, quantidade p/ folha ${resultadoA4.quantidade}`);
        }
      
        return {
          produtos,
          valorFinal,
          detalhesImpressao
        };
      }
      

    gerarMensagemOrcamento(altura: number, largura: number, quantidade: number, orcamento: any): string {
        let mensagem = `*Orçamento Gráfica ClickArte*\n\n`;
        mensagem += `📏 *Dimensões:* ${largura} x ${altura}cm\n`;
        mensagem += `📦 *Quantidade:* ${quantidade}\n\n`;
        mensagem += `🖨️ *Produtos e Serviços:*\n`;

        orcamento.produtos.forEach((produto: any) => {
            mensagem += `➖ *Qtd:* ${produto.quantidade}, *Desc:* ${produto.descricao}, *Val.Un:* R$${produto.valorUnitario.toFixed(2)}, *SubTotal:* R$${produto.subTotal.toFixed(2)}\n`;
        });

        mensagem += `\n💰 *Valor Total:* *R$${orcamento.valorFinal.toFixed(2)}*`;
        return mensagem;
    }

    private calculaMelhorOrientacao(folha: any, alturaAdesivo: number, larguraAdesivo: number) {
        const qtdVertical = this.calculaFolhaVertical(folha, alturaAdesivo, larguraAdesivo);
        const qtdHorizontal = this.calculaFolhaHorizontal(folha, alturaAdesivo, larguraAdesivo);

        return qtdVertical > qtdHorizontal
            ? { quantidade: qtdVertical, orientacao: "Vertical (Retrato)" }
            : { quantidade: qtdHorizontal, orientacao: "Horizontal (Paisagem)" };
    }

    private calculaFolhaVertical(folha: any, alturaAdesivo: number, larguraAdesivo: number) {
        const maxPorLinha = Math.floor(folha.alturaUtil / alturaAdesivo);
        const maxPorColuna = Math.floor(folha.larguraUtil / larguraAdesivo);
        return maxPorLinha * maxPorColuna;
    }

    private calculaFolhaHorizontal(folha: any, alturaAdesivo: number, larguraAdesivo: number) {
        const maxPorLinha = Math.floor(folha.alturaUtil / larguraAdesivo);
        const maxPorColuna = Math.floor(folha.larguraUtil / alturaAdesivo);
        return maxPorLinha * maxPorColuna;
    }

    private obterFolhaMap() {
        return new Map([
            ['SRA3', {
                vinil: {
                    alturaUtil: 40.5,
                    larguraUtil: 29.5,
                    valorFolha: 14.0,
                    corteManual: 2.00,
                    corteEletronico: 3.00,
                    descricao: "Adesivo vinil brilho SRA3"
                },
                papel: {
                    alturaUtil: 40.5,
                    larguraUtil: 29.5,
                    valorFolha: 11.0,
                    corteManual: 2.00,
                    corteEletronico: 3.00,
                    descricao: "Adesivo papel SRA3"
                }
            }],
            ['A4', {
                vinil: {
                    alturaUtil: 26.0,
                    larguraUtil: 19.0,
                    valorFolha: 10.5,
                    corteManual: 1.00,
                    corteEletronico: 2.00,
                    descricao: "Adesivo vinil brilho A4"
                },
                papel: {
                    alturaUtil: 26.0,
                    larguraUtil: 19.0,
                    valorFolha: 8.0,
                    corteManual: 1.00,
                    corteEletronico: 2.00,
                    descricao: "Adesivo papel A4"
                }
            }]
        ]);
    }
}
