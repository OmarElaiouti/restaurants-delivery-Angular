import { AfterViewInit, Component, HostListener } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { PreloaderService } from './Services/preloaderService/preloader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  constructor(private preloader: PreloaderService, private router: Router) {
    

    this.router.events.subscribe(event => {
       ;
      if (event instanceof NavigationStart) {
        this.preloader.show();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.preloader.hide();
      }
    });
  }

  ngAfterViewInit() {
     

    this.preloader.hide();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    
    this.preloader.show();
  }
}
