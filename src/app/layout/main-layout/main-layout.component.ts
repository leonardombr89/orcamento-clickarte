import { Component, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../../shared/tost.component/toast.component';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../features/usuarios/usuario.model';
import { UsuarioModalComponent } from '../../shared/modal-usuario/usuario-modal.component';
import { UsuarioService } from '../../features/usuarios/usuario.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent, UsuarioModalComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements AfterViewInit {

  isSidebarCollapsed = false;
  dropdownAberto = false;

  nomeUsuario: string = '';
  perfilUsuario: string = '';

  modalPerfilAberto = false;

  usuarioLogado: Usuario = {
    id: 0,
    nome: '',
    username: '',
    senha: '',
    perfil: 'OPERADOR',
    ativo: true
  };

  @ViewChild('toast') toast!: ToastComponent;

  constructor(
    private toastService: ToastService,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.usuarioLogado = { ...usuario };
      this.nomeUsuario = usuario.nome;
      this.perfilUsuario = usuario.perfil;
    }
  }
  

  ngAfterViewInit(): void {
    this.toastService.setToast(this.toast);
  }

  carregarUsuarioLogado(): void {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.usuarioLogado = { ...usuario };
      this.nomeUsuario = usuario.nome;
      this.perfilUsuario = usuario.perfil;
    }
  }

  abrirModalPerfil() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.usuarioLogado = { ...usuario };
      this.modalPerfilAberto = true;
    } else {
      console.warn('Usuário não encontrado no AuthService');
    }
  }

  atualizarPerfil(usuario: Usuario): void {
    this.usuarioService.atualizar(usuario.id!, usuario).subscribe({
      next: () => {
        this.toastService.show('Perfil atualizado com sucesso!', true);
        this.modalPerfilAberto = false;
        this.carregarUsuarioLogado();
      },
      error: () => {
        this.toastService.show('Erro ao atualizar o perfil.', false);
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleDropdown(): void {
    this.dropdownAberto = !this.dropdownAberto;
  }

  @HostListener('document:click', ['$event'])
  fecharDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.dropdownAberto = false;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
