import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrcamentoDTO, OrcamentoItemDTO } from '../../features/orcamentos/orcamento.dto';
import { ModalComponent } from '../modal.component/modal.component';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-orcamento-modal',
  templateUrl: './orcamento-modal.component.html',
  styleUrls: ['./orcamento-modal.component.css'],
  standalone: true,
  imports: [ModalComponent, FormsModule, CommonModule, NgxMaskDirective]
})
export class OrcamentoModalComponent {
  @Input() visible: boolean = false;
  @Input() somenteVisualizacao: boolean = false;

  private _orcamento: OrcamentoDTO = {
    clienteNome: '',
    clienteTelefone: '',
    clienteEmail: '',
    nomeServico: '',
    informacoesArte: '',
    observacoes: '',
    mensagem: '',
    valorTotal: 0,
    itens: []
  };

  @Input() set orcamento(value: OrcamentoDTO) {
    this._orcamento = {
      ...value,
      itens: value.itens?.map(i => ({ ...i })) ?? []
    };
  }

  get orcamento(): OrcamentoDTO {
    return this._orcamento;
  }

  @Output() closed = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<OrcamentoDTO>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    this.cdr.detectChanges();
  }

  novoItem: OrcamentoItemDTO = {
    produtoNome: '',
    precoUnitario: 0,
    quantidade: 1
  };
  

  adicionarItem() {
    const item = { ...this.novoItem };

    if (!item.produtoNome || item.precoUnitario <= 0 || item.quantidade <= 0) {
      return;
    }

    this.orcamento.itens = [...this.orcamento.itens, item];
    this.recalcularTotal();
    this.novoItem = { produtoNome: '', precoUnitario: 0, quantidade: 1 };
  }

  removerItem(index: number) {
    const novaLista = [...this.orcamento.itens];
    novaLista.splice(index, 1);
    this.orcamento.itens = novaLista;
    this.recalcularTotal();
  }

  recalcularTotal() {
    this.orcamento.valorTotal = this.orcamento.itens.reduce((acc, item) => {
      return acc + item.precoUnitario * item.quantidade;
    }, 0);
  }

  fechar() {
    this.closed.emit();
  }

  salvarOrcamento() {
    console.log(this.orcamento)
    this.salvar.emit(this.orcamento);
  }

  formValid(): boolean {
    const emailValido = this.orcamento.clienteEmail.includes('@');
  
    return this.orcamento.clienteNome.trim() !== '' &&
           this.orcamento.clienteTelefone.trim() !== '' &&
           this.orcamento.clienteEmail.trim() !== '' &&
           this.orcamento.nomeServico.trim() !== '' &&
           emailValido;
  }
}
