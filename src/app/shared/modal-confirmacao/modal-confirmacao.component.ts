import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-confirmacao.component.html',
  styleUrl: './modal-confirmacao.component.css'
})
export class ModalConfirmacaoComponent {
  @Input() visible: boolean = false;
  @Input() texto: string = 'Você tem certeza?';
  @Input() titulo: string = 'Confirmação';

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  fechar() {
    this.cancelar.emit();
  }

  confirmarAcao() {
    this.confirmar.emit();
  }
}
