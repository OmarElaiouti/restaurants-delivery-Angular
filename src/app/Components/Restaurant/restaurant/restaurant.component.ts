import { Component, OnInit } from '@angular/core';
import { IRestaurant } from '../../../Models/IRestaurant';
import { RestaurantService } from '../../../Services/RestaurantService/restaurant.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreloaderService } from '../../../Services/preloaderService/preloader.service';
import { StateServiceService } from '../../../Services/StateService/state-service.service';
import { filter } from 'rxjs';
import { NavigationService } from '../../../Services/NavigationService/navigation.service';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
})
export class RestaurantComponent implements OnInit {

  restaurants: IRestaurant[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  paginatedRestaurants: IRestaurant[] = [];
  totalPages: number = 0;
  private previousUrl: string | null = null;

  constructor(private restaurantService: RestaurantService, 
    private route: ActivatedRoute,
    private preloader: PreloaderService,
    private stateService: StateServiceService,
    private router: Router,
    private navigationService: NavigationService) {


      

    }

  ngOnInit(): void {
    this.previousUrl = this.navigationService.getPreviousUrl();

    this.route.queryParams.subscribe(params => {
      const cityId = +params['cityId'];
      if (cityId) {
        this.restaurantService.getRestaurantsByCity(cityId).subscribe({
          next: (data) => {
            this.restaurants = data;
            this.totalPages = Math.ceil(this.restaurants.length / this.itemsPerPage);
            this.updatePaginatedRestaurants();
          },
          error: (error) => this.errorMessage = error
        });
      }
    });
  }

  updatePaginatedRestaurants(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedRestaurants = this.restaurants.slice(start, end);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return; // Ensure page is within bounds
    this.currentPage = page;
    this.updatePaginatedRestaurants();
  }
  onRestaurantClick(restaurantId: number): void {
    debugger;
    localStorage.removeItem('SelectedItems');
    this.stateService.setSelectedRestaurantId(restaurantId);
    localStorage.setItem('RestaurantId', restaurantId.toString());
    

  }

  get isPreviousDisabled(): boolean {
    return this.currentPage === 1;
  }

  get isNextDisabled(): boolean {
    return this.currentPage === this.totalPages;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goBack(): void {
    if (this.previousUrl?.includes('results') || this.previousUrl === '/') {
      this.router.navigate(['/results']);
    } else {
      this.router.navigate(['/']);
    }
  }
}