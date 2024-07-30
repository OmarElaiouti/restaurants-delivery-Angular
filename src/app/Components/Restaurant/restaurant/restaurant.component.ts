import { Component, OnInit } from '@angular/core';
import { IRestaurant } from '../../../Models/IRestaurant';
import { RestaurantService } from '../../../Services/RestaurantService/restaurant.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreloaderService } from '../../../Services/preloaderService/preloader.service';

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

  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute,private preloader: PreloaderService) {}

  ngOnInit(): void {
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

  get isPreviousDisabled(): boolean {
    return this.currentPage === 1;
  }

  get isNextDisabled(): boolean {
    return this.currentPage === this.totalPages;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}