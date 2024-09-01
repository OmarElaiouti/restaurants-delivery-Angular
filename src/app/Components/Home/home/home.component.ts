import { Component } from '@angular/core';
import { RestaurantService } from '../../../Services/RestaurantService/restaurant.service';
import { ICity } from '../../../Models/ICity';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PreloaderService } from '../../../Services/preloaderService/preloader.service';
import { StateServiceService } from '../../../Services/StateService/state-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  cities: ICity[] = [];
  selectedCityId: string = "";
  isSearchedValued: boolean = false;
  errorMessage: string = '';

  constructor(private restaurantService: RestaurantService,
    private router: Router,
    private preloader: PreloaderService,
    private stateService: StateServiceService,
  ) { }


  ngOnInit(): void {
    this.selectedCityId = this.stateService.getSelectedCityId();

    this.restaurantService.getCities().subscribe({
      next: (data) => {
        this.cities = data;
        this.updateButtonState();
      },
      error: (error) => this.errorMessage = error
    });
  }

  updateButtonState() {
    this.isSearchedValued = this.selectedCityId !== '';
  }
  onCityChange(): void {
    this.stateService.setSelectedCityId(this.selectedCityId);
  }

  onSearch() {
    if (this.selectedCityId) {
      this.router.navigate(['/restaurant'], { queryParams: { cityId: this.selectedCityId } });
    }
    else{
      this.router.navigate(['/results'], { queryParams: { city: "all" } });

    }
  }
}
