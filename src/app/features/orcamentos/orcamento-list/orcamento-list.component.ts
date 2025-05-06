// orcamento-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrcamentoService } from '../../orcamentos/orcamento.service';
import { ToastService } from '../../../services/toast.service';
import { OrcamentoDTO } from '../orcamento.dto';
import { OrcamentoModalComponent } from '../../../shared/orcamento-modal/orcamento-modal.component';
import { ModalConfirmacaoComponent } from '../../../shared/modal-confirmacao/modal-confirmacao.component';
import { PageHeaderComponent } from '../../../shared/page.header/page-header.component';



@Component({
  selector: 'app-orcamento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, OrcamentoModalComponent, PageHeaderComponent, ModalConfirmacaoComponent],
  templateUrl: './orcamento-list.component.html',
  styleUrls: ['./orcamento-list.component.css']
})
export class OrcamentoListComponent implements OnInit {

  modalSalvarAberto = false;
  modalConfirmacaoVisivelTrello = false;
  modalConfirmacaoExclusao = false;
  somenteVisualizacao: boolean = false;

  filtroBusca: string = '';
  paginaAtual = 0;
  itensPorPagina = 10;

  orcamentos: any[] = [];
  totalRegistros = 0;
  totalPaginas = 0;

  filtroStatus: string = '';
  filtroDataInicial: string = '';
  filtroDataFinal: string = '';

  formOrcamento: OrcamentoDTO = {
    clienteNome: '',
    clienteTelefone: '',
    clienteEmail: '',
    nomeServico: '',
    observacoes: '',
    mensagem: '',
    valorTotal: 0,
    itens: []
  };

  constructor(private orcamentoService: OrcamentoService, private toast: ToastService) { }

  ngOnInit() {
    this.carregarOrcamentos();
  }

  carregarOrcamentos() {
    this.orcamentoService.listarTodos(
      this.paginaAtual - 0,
      this.itensPorPagina,
      this.filtroBusca,
      this.filtroStatus,
      this.filtroDataInicial,
      this.filtroDataFinal
    ).subscribe(response => {
      this.orcamentos = response.content;
      this.totalRegistros = response.totalElements;
      this.totalPaginas = response.totalPages;
    });
  }

  orcamentoSelecionado!: OrcamentoDTO;  

  aplicarFiltro(): void {
    this.paginaAtual = 0;
    this.carregarOrcamentos();
  }
  

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.carregarOrcamentos();
    }
  }

  paginaProxima() {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
      this.carregarOrcamentos();
    }
  }

  get primeiroRegistroPagina(): number {
    return this.orcamentos.length === 0 ? 0 : this.paginaAtual * this.itensPorPagina + 1;
  }

  get ultimoRegistroPagina(): number {
    return Math.min((this.paginaAtual + 1) * this.itensPorPagina, this.totalRegistros);
  }

  aprovarOrcamento(orc: OrcamentoDTO) {
    if (!orc.id) return;

    this.orcamentoService.atualizarStatus(orc.id, 'APROVADO').subscribe(() => {
      this.toast.show('Orçamento aprovado com sucesso!');
      this.carregarOrcamentos();
    });
    this.modalConfirmacaoVisivelTrello = false;
  }

  cancelarOrcamento(orc: OrcamentoDTO): void {
    if (!orc?.id) return;
  
    this.orcamentoService.atualizarStatus(orc.id, 'CANCELADO').subscribe(() => {
      this.toast.show('Orçamento cancelado com sucesso!');
      this.carregarOrcamentos();
      this.modalConfirmacaoExclusao = false;
    });
  }


  abrirNovoOrcamento() {
    this.formOrcamento = {
      clienteNome: '',
      clienteTelefone: '',
      clienteEmail: '',
      nomeServico: '',
      observacoes: '',
      mensagem: '',
      valorTotal: 0,
      itens: []
    };
    this.modalSalvarAberto = true;
  }

  abrirModalEditar(orc: OrcamentoDTO) {
    this.formOrcamento = {
      ...orc,
      itens: orc.itens?.map(item => ({ ...item })) || []
    };
    this.somenteVisualizacao = orc.status !== 'PENDENTE';;
    this.modalSalvarAberto = true;
  } 

  abrirModalConfirmacao(orc: OrcamentoDTO) {
    this.orcamentoSelecionado = orc;
    this.modalConfirmacaoVisivelTrello = true;
  }

  abrirModalExclusao(orc: OrcamentoDTO): void {
    this.orcamentoSelecionado = orc;
    this.modalConfirmacaoExclusao = true;
  }

  salvarOuAtualizar(orcamento: OrcamentoDTO) {
    if (orcamento.id) {
      this.orcamentoService.atualizar(orcamento.id, orcamento).subscribe(() => {
        this.carregarOrcamentos();
        this.toast.show('Orçamento atualizado com sucesso!');
        this.modalSalvarAberto = false;
      });
    } else {
      this.orcamentoService.criar(orcamento).subscribe(() => {
        this.carregarOrcamentos();
        this.toast.show('Orçamento salvo com sucesso!');
        this.modalSalvarAberto = false;
      });
    }
  }

  limparFiltros(): void {
    this.filtroBusca = '';
    this.filtroStatus = '';
    this.filtroDataInicial = '';
    this.filtroDataFinal = '';
    this.paginaAtual = 0;
    this.carregarOrcamentos();
  }
  

  validarIntervaloDatas(): void {
    if (this.filtroDataInicial && this.filtroDataFinal) {
      const dataInicio = new Date(this.filtroDataInicial);
      const dataFim = new Date(this.filtroDataFinal);
  
      if (dataFim < dataInicio) {
        alert('A data final não pode ser anterior à data inicial.');
        this.filtroDataFinal = '';
        return;
      }
    }
    this.aplicarFiltro();
  }  
  
}

