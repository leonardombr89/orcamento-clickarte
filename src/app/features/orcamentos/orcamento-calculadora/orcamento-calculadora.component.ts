import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { TrelloService } from '../../../services/trello.service';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { ModalComponent } from '../../../shared/modal.component/modal.component';
import { OrcamentoService } from '../orcamento.service';
import { OrcamentoModalComponent } from '../../../shared/orcamento-modal/orcamento-modal.component';
import { ModalConfirmacaoComponent } from '../../../shared/modal-confirmacao/modal-confirmacao.component';
import { PageHeaderComponent } from '../../../shared/page.header/page-header.component';
import { OrcamentoDTO } from '../../orcamentos/orcamento.dto';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-orcamento-calculadora',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective, ModalComponent, OrcamentoModalComponent, PageHeaderComponent, ModalConfirmacaoComponent],
  templateUrl: './orcamento-calculadora.component.html',
  styleUrls: ['./orcamento-calculadora.component.css']
})
export class OrcamentoCalculadoraComponent {

  categoriaSelecionada = 'adesivos';
  isLoadingTrello = false;

  modalWhatsappVisible = false;
  modalTrelloAberto = false;
  modalSalvarAberto = false;
  modalConfirmacaoVisivelTrello = false;
  orcamentoPendente!: OrcamentoDTO;

  formOrcamento = {
    clienteNome: '',
    clienteTelefone: '',
    clienteEmail: '',
    nomeServico: '',
    observacoes: '',
    mensagem: '',
    valorTotal: 0,
    itens: [] as any[]
  };

  novoItem = {
    produtoNome: '',
    precoUnitario: 0,
    quantidade: 1
  };


  // Adesivos
  altura = 0;
  largura = 0;
  quantidade = 0;
  tipo = 'Vinil';
  corte = 'Nenhum';

  // Placas
  alturaPlaca = 0;
  larguraPlaca = 0;

  // WhatsApp
  whatsappNomeCliente = '';
  whatsappTelefoneCliente = '';
  whatsappMensagem = '';

  // Trello
  trelloNomeCliente = '';
  trelloTelefoneCliente = '';
  trelloNomeServico = '';
  trelloObservacoes = '';
  trelloInfoArte = '';

  // Resultado
  orcamento: any = null;
  mensagemGerada = '';

  constructor(
    private apiService: ApiService,
    private trelloService: TrelloService,
    private toastService: ToastService,
    private orcamentoService: OrcamentoService,
  ) { }

  showToast(message: string, success: boolean = true) {
    this.toastService.show(message, success);
  }

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
        this.showToast('Orçamento calculado com sucesso!', true);
      },
      error: () => {
        this.orcamento = null;
        this.mensagemGerada = '';
        this.showToast('Erro ao calcular orçamento!', false);
      }
    });
  }

  calcularOrcamentoPlacas() {
    this.showToast('Funcionalidade de placas ainda não implementada.', false);
  }

  gerarMensagem() {
    if (!this.orcamento) return;

    const linhas = this.orcamento.produtos.map((produto: any) =>
      `➖ *Qtd:* ${produto.quantidade}, *Desc:* ${produto.descricao}, *Val.Un:* R$${produto.valorUnitario.toFixed(2)}, *SubTotal:* R$${produto.subTotal.toFixed(2)}`
    );

    this.mensagemGerada =
      `*Orçamento Gráfica ClickArte*\n\n` +
      `📏 *Dimensões:* ${this.largura} x ${this.altura} cm\n` +
      `📦 *Quantidade:* ${this.quantidade}\n\n` +
      `🖨️ *Produtos e Serviços:*\n${linhas.join('\n')}\n\n` +
      `💰 *Valor Total:* *R$${this.orcamento.valorFinal.toFixed(2)}*`;
  }



  copiarMensagem() {
    if (!this.mensagemGerada) return;

    navigator.clipboard.writeText(this.mensagemGerada)
      .then(() => this.showToast('Mensagem copiada com sucesso!', true))
      .catch(() => this.showToast('Erro ao copiar mensagem!', false));
  }

  abrirModalWhatsapp() {
    if (!this.mensagemGerada) {
      this.showToast('Gere uma mensagem antes!', false);
      return;
    }
    this.whatsappMensagem = `Olá ${this.whatsappNomeCliente}!\n\n${this.mensagemGerada}`;
    this.modalWhatsappVisible = true;
  }

  enviarWhatsapp() {
    if (!this.whatsappNomeCliente || !this.whatsappTelefoneCliente) {
      this.showToast('Preencha o nome e o telefone!', false);
      return;
    }

    const numero = this.whatsappTelefoneCliente.replace(/\D/g, '').replace(/^0/, '');

    const mensagem = `Olá ${this.whatsappNomeCliente}!\n\n${this.mensagemGerada}`;
    const mensagemFinal = encodeURIComponent(mensagem).replace(/\*/g, '%2A');

    window.open(`https://wa.me/55${numero}?text=${mensagemFinal}`, '_blank');

    this.modalWhatsappVisible = false;
    this.showToast('Mensagem aberta no WhatsApp com sucesso!', true);
  }


  abrirModalTrello() {
    this.modalTrelloAberto = true;
  }

  abrirModalSalvarComOrcamento(orcamento: any) {
    this.formOrcamento = {
      clienteNome: '',
      clienteTelefone: '',
      clienteEmail: '',
      nomeServico: this.categoriaSelecionada + ' ' + this.tipo + ', ' + this.altura +  ' X ' + this.largura + ', Quantidade: ' + this.quantidade,
      observacoes: orcamento?.detalhesImpressao?.join('\n') || '',
      mensagem: this.mensagemGerada || '',
      valorTotal: orcamento?.valorFinal || 0,
      itens: orcamento?.produtos?.map((p: any) => ({
        produtoNome: p.descricao,
        descricao: p.descricao,
        precoUnitario: p.valorUnitario,
        quantidade: p.quantidade
      })) || []
    };

    this.modalSalvarAberto = true;
  }

  abrirModalCardTrello() {
    this.modalConfirmacaoVisivelTrello = true;
  }


  addCardTrello() {

    const titulo = `${this.orcamento.clienteNome} | ${this.orcamento.nomeServico} | ${this.orcamento.clienteTelefone}`;
    let descricao = `🧾 *Orçamento*\n\n➔ *Resumo:*\n${this.orcamento.mensagem ?? 'Sem mensagem.'}\n\n`;

    if (this.orcamento.observacoes)
      descricao += `➔ *Observações do Cliente:*\n${this.orcamento.observacoes}\n\n`;

    if (this.orcamento.informacoesArte)
      descricao += `🎨 *Detalhes da Arte:*\n${this.orcamento.informacoesArte}\n\n`;

    if (this.orcamento.itens?.length) {
      descricao += `📦 *Itens:*\n`;
      for (const item of this.orcamento.itens) {
        descricao += `- ${item.quantidade}x ${item.produtoNome} (R$${item.precoUnitario.toFixed(2)})\n`;
      }
      descricao += '\n';
    }

    if (this.orcamento.valorTotal)
      descricao += `💰 *Valor Total:* R$${this.orcamento.valorTotal.toFixed(2)}\n\n`;

    if (this.orcamento.dataPrevisaoEntrega)
      descricao += `📆 *Previsão de Entrega:* ${this.orcamento.dataPrevisaoEntrega}\n`;

    this.trelloService.criarCard(titulo, descricao).subscribe({
      next: () => {
        this.showToast('Card criado no Trello com sucesso!', true);

        // Atualizar status do orçamento para APROVADO
        this.orcamentoService.atualizarStatus(this.orcamento.id!, 'APROVADO').subscribe({
          next: () => {
            this.showToast('Status do orçamento atualizado para APROVADO!', true);
          },
          error: () => {
            this.showToast('Erro ao atualizar status do orçamento.', false);
          }
        });
      },
      error: () => {
        this.showToast('Erro ao criar card no Trello!', false);
        this.isLoadingTrello = false;
      }
    });
  }


  confirmarCriacaoCard() {
    this.isLoadingTrello = true;

    const titulo = `${this.trelloNomeCliente} | ${this.trelloNomeServico} | ${this.trelloTelefoneCliente}`;
    let descricao = `🧾 *Orçamento*\n\n➔ *Resumo:*\n${this.mensagemGerada}\n\n`;

    if (this.orcamento?.detalhesImpressao?.length)
      descricao += `➔ *Observações do Sistema:*\n${this.orcamento.detalhesImpressao.join('\n')}\n\n`;
    if (this.orcamento?.valorFinal)
      descricao += `➔ *Valor Final:* R$${this.orcamento.valorFinal.toFixed(2)}\n\n`;
    if (this.trelloObservacoes)
      descricao += `📌 *Observações do Cliente:*\n${this.trelloObservacoes}\n\n`;
    if (this.trelloInfoArte)
      descricao += `🎨 *Detalhes da Arte:*\n${this.trelloInfoArte}\n\n`;

    this.trelloService.criarCard(titulo, descricao).subscribe({
      next: () => {
        this.showToast('Card criado no Trello com sucesso!', true);
        bootstrap.Modal.getInstance(document.getElementById('modalTrello')!)?.hide();
        this.isLoadingTrello = false;
      },
      error: () => {
        this.showToast('Erro ao criar card no Trello!', false);
        this.isLoadingTrello = false;
      }
    });
  }

  atualizarDadosFormulario(dados: any) {
    this.altura = dados.altura;
    this.largura = dados.largura;
    this.quantidade = dados.quantidade;
    this.tipo = dados.tipo;
    this.corte = dados.corte;
  }

  adicionarItem() {
    const item = { ...this.novoItem };

    if (!item.produtoNome || item.precoUnitario <= 0 || item.quantidade <= 0) {
      this.showToast('Preencha todos os dados do item corretamente', false);
      return;
    }

    this.formOrcamento.itens.push(item);
    this.recalcularTotal();
    this.novoItem = { produtoNome: '', precoUnitario: 0, quantidade: 1 };
  }

  removerItem(index: number) {
    this.formOrcamento.itens.splice(index, 1);
    this.recalcularTotal();
  }

  recalcularTotal() {
    this.formOrcamento.valorTotal = this.formOrcamento.itens.reduce((total, item) => {
      return total + item.precoUnitario * item.quantidade;
    }, 0);
  }

  salvarOuAtualizar(orcamento: OrcamentoDTO) {
    if (orcamento.id) {
      this.orcamentoService.atualizar(orcamento.id, orcamento).subscribe(() => {
        this.showToast('Orçamento atualizado com sucesso!');
        this.modalSalvarAberto = false;
      });
    } else {
      this.orcamentoPendente = orcamento;
      this.modalConfirmacaoVisivelTrello = true;
    }
  }

  confirmarSalvarComCard() {
    this.modalConfirmacaoVisivelTrello = false;
    this.orcamentoPendente.criarCardTrello = true;
  
    this.orcamentoService.criar(this.orcamentoPendente).subscribe(() => {
      this.showToast('Orçamento salvo com sucesso!');
      this.modalSalvarAberto = false;
    });
  }
  
  confirmarSalvarSemCard() {
    this.modalConfirmacaoVisivelTrello = false;
    this.orcamentoPendente.criarCardTrello = false;
  
    this.orcamentoService.criar(this.orcamentoPendente).subscribe(() => {
      this.showToast('Orçamento salvo com sucesso!');
      this.modalSalvarAberto = false;
    });
  }


}
