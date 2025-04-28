import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';

declare const bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private loadingService: LoadingService) {}

  mostrarToast(mensagem: string, sucesso: boolean = true) {
    this.loadingService.runAfterHide(() => {
      const toastEl = document.getElementById('toast-dinamico');
      const toastBody = document.getElementById('toast-body-text');

      if (toastEl && toastBody) {
        toastEl.classList.remove('bg-success', 'bg-danger', 'text-white');

        if (sucesso) {
          toastEl.classList.add('bg-success', 'text-white');
        } else {
          toastEl.classList.add('bg-danger', 'text-white');
        }

        toastBody.textContent = mensagem;

        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    });
  }
}
