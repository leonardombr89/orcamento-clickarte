import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-gestor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-gestor.component.html'
})
export class RegistroGestorComponent implements OnInit {
  form = {
    nome: '',
    username: '',
    senha: ''
  };

  mostrarFormulario = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.get<boolean>('auth/tem-usuarios').subscribe({
      next: (temUsuario) => {
        if (temUsuario) {
          this.router.navigate(['/nao-encontrado']); // redireciona caso já exista um usuário
        } else {
          this.mostrarFormulario = true;
        }
      },
      error: () => {
        alert('Erro ao verificar usuários');
        this.router.navigate(['/login']);
      }
    });
  }

  registrar() {
    this.api.post('auth/register', this.form).subscribe({
      next: () => {
        alert('Gestor cadastrado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: () => alert('Erro ao registrar gestor')
    });
  }
}
