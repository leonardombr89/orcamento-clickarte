import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" @fade class="toast-container" [ngClass]="success ? 'bg-success' : 'bg-danger'">
      <span>{{ message }}</span>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background-color: #28a745;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      font-size: 0.95rem;
      z-index: 1050;
    }
    .bg-success { background-color: #28a745; }
    .bg-danger { background-color: #dc3545; }
  `],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class ToastComponent {
  visible = false;
  message = '';
  success = true;
  timeout: any;

  show(message: string, success: boolean = true) {
    clearTimeout(this.timeout);
    this.message = message;
    this.success = success;
    this.visible = true;

    this.timeout = setTimeout(() => {
      this.visible = false;
    }, 3000);
  }
}
