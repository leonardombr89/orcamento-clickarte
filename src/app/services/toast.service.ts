import { Injectable } from '@angular/core';
import { ToastComponent } from '../shared/tost.component/toast.component';
import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class ToastService {
  
  private toastRef?: ToastComponent;

  constructor(private loadingService: LoadingService) {}

  setToast(toast: ToastComponent) {
    this.toastRef = toast;
  }

  show(message: string, success: boolean = true) {
    this.loadingService.runAfterHide(() => {
      this.toastRef?.show(message, success);
    });
  }
}
