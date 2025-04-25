import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { OrcamentoService } from './services/orcamento.service';
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

  constructor(private orcamentoService: OrcamentoService, private trelloService: TrelloService) { }

  title = 'orcamento-clickarte';
  categoriaSelecionada = 'adesivos';

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

    if (!this.orcamento) {
      alert('Erro ao calcular o orçamento.');
    }
  }

  gerarMensagem() {
    if (this.orcamento) {
      this.mensagemGerada = this.orcamentoService.gerarMensagemOrcamento(
        this.altura,
        this.largura,
        this.quantidade,
        this.orcamento
      );

      // Agora abrir o modal Bootstrap manualmente
      const modalElement = document.getElementById('mensagemModal') as HTMLElement;
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();

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
    const titulo = `${this.trelloNomeCliente} | ${this.trelloNomeServico} | ${this.trelloTelefoneCliente}`;
    const descricao = `📌 Observações:\n${this.trelloObservacoes}\n\n🎨 Arte:\n${this.trelloInfoArte}`;
  
    this.trelloService.criarCard(titulo, descricao).subscribe({
      next: () => {
        this.mostrarToast('Card criado no Trello com sucesso!', true);
        const modalInstance = (window as any).bootstrap.Modal.getInstance(document.getElementById('modalTrello'));
        modalInstance?.hide();
      },
      error: (error) => {
        console.error('Erro ao criar card:', error);
        this.mostrarToast('Erro ao criar o card no Trello!', false);
      }
    });
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
