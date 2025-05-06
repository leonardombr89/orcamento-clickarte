import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../shared/tost.component/toast.component';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private toastService: ToastService,
    private api: ApiService
  ) {}

  login() {
    this.authService.login(this.form.username, this.form.password).subscribe({
      next: (res) => {
        this.authService.salvarToken(res.token);
        console.log('Token recebido:', res.token);
  
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 100);
      },
      error: () => {
        alert('Usuário ou senha inválidos')
        this.toastService.show('Usuário ou senha inválidos', false)
      }
    });
  }
}
