import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../features/usuarios/usuario.model';
import { ModalComponent } from '../../shared/modal.component/modal.component';

@Component({
  selector: 'app-usuario-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './usuario-modal.component.html'
})
export class UsuarioModalComponent {
  @Input() visible: boolean = false;
  @Input() somenteVisualizacao: boolean = false;

  /**
   * Quando `modoPerfil` é `true`, esconde o campo de perfil e impede alteração do username
   */
  @Input() modoPerfil: boolean = false;

  @Output() closed = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<Usuario>();

  private _usuario: Usuario = {
    id: 0,
    nome: '',
    username: '',
    senha: '',
    perfil: 'OPERADOR',
    ativo: true
  };

  @Input() set usuario(value: Usuario | null) {
    this._usuario = value ? { ...value } : {
      id: 0,
      nome: '',
      username: '',
      senha: '',
      perfil: 'OPERADOR',
      ativo: true
    };
  }

  get usuario(): Usuario {
    return this._usuario;
  }

  fechar() {
    this.closed.emit();
  }

  salvarUsuario() {
    if (this.formValid()) {
      this.salvar.emit({ ...this._usuario });
    }
  }

  formValid(): boolean {
    return !!this._usuario.nome?.trim()
        && (!!this._usuario.username?.trim() || this.modoPerfil)
        && (!!this._usuario.senha?.trim())
        && (!!this._usuario.perfil || this.modoPerfil);
  }
}
