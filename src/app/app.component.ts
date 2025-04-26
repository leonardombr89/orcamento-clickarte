import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { OrcamentoService } from './services/orcamento.service';
import { OrcamentoPlacaService } from './services/orcamento-placa.service';
import { TrelloService } from './services/trello.service';

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
    private orcamentoService: OrcamentoService,
    private orcamentoServicePlaca: OrcamentoPlacaService,
    private trelloService: TrelloService) { }

  title = 'orcamento-clickarte';
  categoriaSelecionada = 'adesivos';

  isLoadingTrello = false;

  // Campos do formulário de adesivos
  altura!: number;
  largura!: number;
  quantidade!: number;
  tipo: string = 'Vinil';
  corte: string = 'Nenhum';

  // Resultado do orçamento
  orcamento: any = null;
  mensagemGerada: string = '';

  trelloNomeCliente: string = '';
  trelloTelefoneCliente: string = '';
  trelloObservacoes: string = '';
  trelloInfoArte: string = '';
  trelloNomeServico: string = '';

  whatsappNomeCliente: string = '';
  whatsappTelefoneCliente: string = '';
  whatsappMensagem: string = '';

  alturaPlaca!: number;
  larguraPlaca!: number;


  selecionarCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;
    this.orcamento = null;
    this.mensagemGerada = '';
  }

  calcularOrcamento() {
    this.orcamento = this.orcamentoService.processarOrcamento(
      this.altura,
      this.largura,
      this.quantidade,
      this.tipo,
      this.corte
    );

    if (this.orcamento) {
      this.gerarMensagem();
    }

    if (!this.orcamento) {
      alert('Erro ao calcular o orçamento.');
    }
  }

  calcularOrcamentoPlacas() {
    this.orcamentoServicePlaca.processarOrcamento(this.alturaPlaca, this.larguraPlaca);
  }

  gerarMensagem() {
    if (this.orcamento) {
      this.mensagemGerada = this.orcamentoService.gerarMensagemOrcamento(
        this.altura,
        this.largura,
        this.quantidade,
        this.orcamento
      );
    }
  }

  copiarMensagem() {
    const textarea = document.createElement('textarea');
    textarea.value = this.mensagemGerada || '';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    this.mostrarToast('Texto copiado com sucesso!');
  }


  abrirModalTrello() {
    const modal = new bootstrap.Modal(document.getElementById('modalTrello')!);
    modal.show();
  }

  confirmarCriacaoCard() {
    this.isLoadingTrello = true; // Começa o loading

    const titulo = `${this.trelloNomeCliente} | ${this.trelloNomeServico} | ${this.trelloTelefoneCliente}`;

    let descricao = '';

    // 🧾 Orçamento
    descricao += `🧾 *Orçamento*\n`;

    // ➔ Resumo
    if (this.mensagemGerada) {
      descricao += `  ➔ *Resumo:*\n${this.mensagemGerada}\n\n`;
    }

    // ➔ Observações do Sistema
    if (this.orcamento?.detalhesImpressao?.length) {
      descricao += `  ➔ *Observações do Sistema:*\n${this.orcamento.detalhesImpressao.join('\n')}\n\n`;
    }

    // ➔ Valor Final
    if (this.orcamento?.valorFinal !== undefined) {
      descricao += `  ➔ *Valor Final:* R$${this.orcamento.valorFinal.toFixed(2)}\n\n`;
    }

    // 📌 Observações do Cliente
    if (this.trelloObservacoes) {
      descricao += `📌 *Observações do Cliente:*\n${this.trelloObservacoes}\n\n`;
    }

    // 🎨 Detalhes da Arte
    if (this.trelloInfoArte) {
      descricao += `🎨 *Detalhes da Arte:*\n${this.trelloInfoArte}\n\n`;
    }

    this.trelloService.criarCard(titulo, descricao).subscribe({
      next: () => {
        this.mostrarToast('Card criado no Trello com sucesso!', true);

        const modalInstance = (window as any).bootstrap.Modal.getInstance(document.getElementById('modalTrello'));
        modalInstance?.hide();
        this.isLoadingTrello = false;
      },
      error: (error) => {
        console.error('Erro ao criar card:', error);
        this.mostrarToast('Erro ao criar o card no Trello!', false);
        this.isLoadingTrello = false;
      }
    });
  }


  abrirModalWhatsapp() {
    if (!this.mensagemGerada) {
      this.mostrarToast('Gere uma mensagem antes!', false);
      return;
    }

    this.whatsappMensagem = `Olá ${this.whatsappNomeCliente}, segue o seu orçamento:\n\n${this.mensagemGerada}`;

    const modal = new (window as any).bootstrap.Modal(document.getElementById('modalWhatsapp'));
    modal.show();
  }

  enviarWhatsapp() {
    if (!this.whatsappNomeCliente || !this.whatsappTelefoneCliente) {
      this.mostrarToast('Preencha o nome e telefone!', false);
      return;
    }

    const numeroFormatado = this.whatsappTelefoneCliente
      .replace(/\D/g, '') // remove tudo que não for número
      .replace(/^0/, ''); // remove o zero inicial se houver

    const mensagemFinal = encodeURIComponent(`Olá ${this.whatsappNomeCliente}! \n\n${this.mensagemGerada}`);

    window.open(`https://wa.me/55${numeroFormatado}?text=${mensagemFinal}`, '_blank');

    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('modalWhatsapp'));
    modal.hide();

    this.mostrarToast('Mensagem aberta no WhatsApp com sucesso!');
  }


  mostrarToast(mensagem: string, sucesso: boolean = true) {
    const toastEl = document.getElementById('toast-dinamico');
    const toastBody = document.getElementById('toast-body-text');

    if (toastEl && toastBody) {
      // Remove classes anteriores
      toastEl.classList.remove('bg-success', 'bg-danger', 'text-white');

      // Define a cor baseada no sucesso ou erro
      if (sucesso) {
        toastEl.classList.add('bg-success', 'text-white');
      } else {
        toastEl.classList.add('bg-danger', 'text-white');
      }

      // Atualiza o texto
      toastBody.textContent = mensagem;

      // Exibe o toast
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }



}
