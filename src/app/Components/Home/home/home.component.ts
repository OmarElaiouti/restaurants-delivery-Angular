import { Component } from '@angular/core';
import { RestaurantService } from '../../../Services/RestaurantService/restaurant.service';
import { ICity } from '../../../Models/ICity';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PreloaderService } from '../../../Services/preloaderService/preloader.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  cities: ICity[] = [];
  selectedCityId: string = '';
  isSearchEnabled: boolean = false;
  errorMessage: string = '';

  constructor(private restaurantService: RestaurantService,private router: Router,private preloader: PreloaderService) { }


  ngOnInit(): void {
    this.restaurantService.getCities().subscribe({
      next: (data) => {
        this.cities = data;
        this.updateButtonState();
      },
      error: (error) => this.errorMessage = error
    });
  }

  updateButtonState() {
    this.isSearchEnabled = this.selectedCityId !== '';
  }

  onSearch() {
    if (this.selectedCityId) {
      this.router.navigate(['/restaurant'], { queryParams: { cityId: this.selectedCityId } });
    }
  }
}
