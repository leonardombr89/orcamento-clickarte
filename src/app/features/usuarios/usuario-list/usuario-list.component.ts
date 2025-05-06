import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { ToastService } from '../../../services/toast.service';
import { PageHeaderComponent } from '../../../shared/page.header/page-header.component';
import { ModalConfirmacaoComponent } from '../../../shared/modal-confirmacao/modal-confirmacao.component';
import { UsuarioModalComponent } from '../../../shared/modal-usuario/usuario-modal.component';
import { RouterModule } from '@angular/router';
import { Usuario } from '../usuario.model';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  standalone: true,
   imports: [CommonModule, FormsModule, RouterModule, PageHeaderComponent, ModalConfirmacaoComponent, UsuarioModalComponent],
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  usuarios: any[] = [];
  filtro: string = '';
  perfil: string = '';

  modalAberto = false;
  modalConfirmacao = false;
  usuarioSelecionado: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (dados) => this.usuarios = dados,
      error: () => this.toastService.show('Erro ao buscar usuários', false)
    });
  }

  aplicarFiltro(): void {
    this.usuarioService.listar().subscribe({
      next: (dados) => {
        this.usuarios = dados.filter(usuario => {
          const nomeMatch = usuario.nome.toLowerCase().includes(this.filtro.toLowerCase());
          const userMatch = usuario.username.toLowerCase().includes(this.filtro.toLowerCase());
          const perfilMatch = this.perfil ? usuario.perfil === this.perfil : true;
          return (nomeMatch || userMatch) && perfilMatch;
        });
      }
    });
  }

  abrirModalNovo() {
    this.usuarioSelecionado = {
      nome: '',
      username: '',
      senha: '',
      perfil: 'OPERADOR',
      ativo: true
    };
    this.modalAberto = true;
  }

  abrirModalEditar(usuario: any): void {
    this.usuarioSelecionado = { ...usuario };
    this.modalAberto = true;
  }

  salvarOuAtualizar(usuario: any): void {
    const obs = usuario.id ? this.usuarioService.atualizar(usuario.id, usuario) : this.usuarioService.criar(usuario);
    obs.subscribe({
      next: () => {
        this.modalAberto = false;
        this.toastService.show('Usuário salvo com sucesso!', true);
        this.listarUsuarios();
      },
      error: () => this.toastService.show('Erro ao salvar usuário', false)
    });
  }

  confirmarDesativar(usuario: any): void {
    this.usuarioSelecionado = usuario;
    this.modalConfirmacao = true;
  }

  desativarUsuario(usuario: any): void {
    this.usuarioService.desativar(usuario.id).subscribe({
      next: () => {
        this.toastService.show('Usuário desativado!', true);
        this.modalConfirmacao = false;
        this.listarUsuarios();
      },
      error: () => this.toastService.show('Erro ao desativar usuário', false)
    });
  }
}
