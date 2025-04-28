import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  private loadingStartTime: number = 0;
  private minDuration = 2000; // 2 segundos
  private isForceHiding = false;
  private pendingCallbacks: (() => void)[] = [];

  show() {
    this.activeRequests++;

    if (this.activeRequests === 1) {
      this.loadingStartTime = Date.now();
      document.body.classList.add('loading');
    }
  }

  hide() {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }

    if (this.activeRequests === 0 && !this.isForceHiding) {
      const elapsed = Date.now() - this.loadingStartTime;
      const remainingTime = this.minDuration - elapsed;

      if (remainingTime > 0) {
        this.isForceHiding = true;
        setTimeout(() => {
          this.forceHide();
          this.isForceHiding = false;
        }, remainingTime);
      } else {
        this.forceHide();
      }
    }
  }

  private forceHide() {
    document.body.classList.remove('loading');
    // Depois que esconder, executar as ações pendentes
    this.pendingCallbacks.forEach(callback => callback());
    this.pendingCallbacks = [];
  }

  runAfterHide(callback: () => void) {
    if (this.activeRequests === 0 && !this.isForceHiding) {
      callback(); // Loading já acabou
    } else {
      this.pendingCallbacks.push(callback); // Aguarda o fim
    }
  }

  isLoading(): boolean {
    return this.activeRequests > 0;
  }
}
