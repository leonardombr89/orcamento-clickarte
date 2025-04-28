import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { TrelloService } from './services/trello.service';
import { ApiService } from './services/api.service';
import { ToastService } from './services/toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private trelloService: TrelloService
  ) { }

  title = 'orcamento-clickarte';
  categoriaSelecionada = 'adesivos';
  isLoadingTrello = false;

  // Formulário de adesivos
  altura!: number;
  largura!: number;
  quantidade!: number;
  tipo: string = 'Vinil';
  corte: string = 'Nenhum';

  // Formulário de placas
  alturaPlaca!: number;
  larguraPlaca!: number;

  // Dados Trello
  trelloNomeCliente: string = '';
  trelloTelefoneCliente: string = '';
  trelloObservacoes: string = '';
  trelloInfoArte: string = '';
  trelloNomeServico: string = '';

  // Dados WhatsApp
  whatsappNomeCliente: string = '';
  whatsappTelefoneCliente: string = '';
  whatsappMensagem: string = '';

  // Resultado
  orcamento: any = null;
  mensagemGerada: string = '';

  selecionarCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;
    this.orcamento = null;
    this.mensagemGerada = '';
  }

  calcularOrcamento() {
    const payload = {
      altura: this.altura,
      largura: this.largura,
      quantidade: this.quantidade,
      tipo: this.tipo,
      corte: this.corte
    };

    this.apiService.post<any>('orcamentos/adesivos', payload).subscribe({
      next: (response) => {
        this.orcamento = response;
        this.gerarMensagem();
        this.toastService.mostrarToast('Orçamento calculado com sucesso!', true);
      },
      error: () => {
        this.orcamento = null;
        this.mensagemGerada = '';
      }
    });
  }

  calcularOrcamentoPlacas() {
    // Aqui futuramente você também pode mudar para chamar API
    this.toastService.mostrarToast('Funcionalidade de placas ainda não implementada.', false);
  }

  gerarMensagem() {
    if (!this.orcamento) return;

    let mensagem = `*Orçamento Gráfica ClickArte*\n\n`;
    mensagem += `📏 *Dimensões:* ${this.largura} x ${this.altura} cm\n`;
    mensagem += `📦 *Quantidade:* ${this.quantidade}\n\n`;
    mensagem += `🖨️ *Produtos e Serviços:*\n`;

    this.orcamento.produtos.forEach((produto: any) => {
      mensagem += `➖ *Qtd:* ${produto.quantidade}, *Desc:* ${produto.descricao}, *Val.Un:* R$${produto.valorUnitario.toFixed(2)}, *SubTotal:* R$${produto.subTotal.toFixed(2)}\n`;
    });

    mensagem += `\n💰 *Valor Total:* *R$${this.orcamento.valorFinal.toFixed(2)}*`;

    this.mensagemGerada = mensagem;
  }

  copiarMensagem() {
    if (!this.mensagemGerada) return;

    const textarea = document.createElement('textarea');
    textarea.value = this.mensagemGerada;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    this.toastService.mostrarToast('Mensagem copiada com sucesso!', true);
  }

  abrirModalTrello() {
    const modal = new bootstrap.Modal(document.getElementById('modalTrello')!);
    modal.show();
  }

  confirmarCriacaoCard() {
    this.isLoadingTrello = true;

    const titulo = `${this.trelloNomeCliente} | ${this.trelloNomeServico} | ${this.trelloTelefoneCliente}`;

    let descricao = '🧾 *Orçamento*\n\n';
    if (this.mensagemGerada) {
      descricao += `➔ *Resumo:*\n${this.mensagemGerada}\n\n`;
    }
    if (this.orcamento?.detalhesImpressao?.length) {
      descricao += `➔ *Observações do Sistema:*\n${this.orcamento.detalhesImpressao.join('\n')}\n\n`;
    }
    if (this.orcamento?.valorFinal) {
      descricao += `➔ *Valor Final:* R$${this.orcamento.valorFinal.toFixed(2)}\n\n`;
    }
    if (this.trelloObservacoes) {
      descricao += `📌 *Observações do Cliente:*\n${this.trelloObservacoes}\n\n`;
    }
    if (this.trelloInfoArte) {
      descricao += `🎨 *Detalhes da Arte:*\n${this.trelloInfoArte}\n\n`;
    }

    this.trelloService.criarCard(titulo, descricao).subscribe({
      next: () => {
        this.toastService.mostrarToast('Card criado no Trello com sucesso!', true);
        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('modalTrello'));
        modalInstance?.hide();
        this.isLoadingTrello = false;
      },
      error: () => {
        this.toastService.mostrarToast('Erro ao criar card no Trello!', false);
        this.isLoadingTrello = false;
      }
    });
  }

  abrirModalWhatsapp() {
    if (!this.mensagemGerada) {
      this.toastService.mostrarToast('Gere uma mensagem antes!', false);
      return;
    }

    this.whatsappMensagem = `Olá ${this.whatsappNomeCliente}! \n\n${this.mensagemGerada}`;
    const modal = new bootstrap.Modal(document.getElementById('modalWhatsapp'));
    modal.show();
  }

  enviarWhatsapp() {
    if (!this.whatsappNomeCliente || !this.whatsappTelefoneCliente) {
      this.toastService.mostrarToast('Preencha o nome e o telefone!', false);
      return;
    }

    const numeroFormatado = this.whatsappTelefoneCliente.replace(/\D/g, '').replace(/^0/, '');
    const mensagemFinal = encodeURIComponent(`Olá ${this.whatsappNomeCliente}! \n\n${this.mensagemGerada}`);

    window.open(`https://wa.me/55${numeroFormatado}?text=${mensagemFinal}`, '_blank');

    const modal = bootstrap.Modal.getInstance(document.getElementById('modalWhatsapp'));
    modal.hide();
    this.toastService.mostrarToast('Mensagem aberta no WhatsApp com sucesso!', true);
  }
}
