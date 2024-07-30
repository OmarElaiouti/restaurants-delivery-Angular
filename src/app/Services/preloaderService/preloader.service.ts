import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


  export class PreloaderService {
    private selector = 'preloader';

    constructor(@Inject(DOCUMENT) private document: Document) {}
  
    private getElement() {
      return this.document.getElementById(this.selector);
    }
  
    hide() {
      const el = this.getElement();
      if (el) {
        el.style.transition = 'opacity 3s ease-out';
        el.style.opacity = '0';
        setTimeout(() => {
          el.style.display = 'none';
        }, 500); 
      }
    }

    show() {
      const el = this.getElement();
      if (el) {
        el.style.display = 'block';
        el.style.opacity = '1';
      }
    }
  }

