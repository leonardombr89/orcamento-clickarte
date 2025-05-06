import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-registro-inicial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-inicial.component.html',
  styleUrls: ['./registro-inicial.component.css']
})
export class RegistroInicialComponent {
  form = {
    nome: '',
    username: '',
    senha: ''
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private toast: ToastService
  ) {}

  registrar() {
    this.api.post('auth/register', this.form).subscribe({
      next: () => {
        this.toast.show('Usuário registrado com sucesso!', true);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast.show('Erro ao registrar: ' + (err?.error || 'Erro desconhecido'), false);
      }
    });
  }
}
