import { Component, OnInit } from '@angular/core';
import { IMenuItem } from '../../../Models/IMenuItem';
import { MenuService } from '../../../Services/MenuService/menu.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreloaderService } from '../../../Services/preloaderService/preloader.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  menuItems: IMenuItem[] = [];
  paginatedMenuItems: IMenuItem[] = [];
  selectedItems: IMenuItem[] = [];
  errorMessage: string | null = null;
  restaurantId: number = 0;
  cityId: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router,
    private preloader: PreloaderService
  ) { }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      this.restaurantId = +params.get('id')!;
      if (this.restaurantId > 0) {
        this.menuService.getMenuItems(this.restaurantId).subscribe(
          data => {
            this.menuItems = data;
            this.cityId = this.menuItems[0].restaurantcity;
            this.totalPages = Math.ceil(this.menuItems.length / this.itemsPerPage);
            this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
            this.updatePagination();
          },
          error => this.errorMessage = error
        );
      } else {
        this.router.navigate(['/not-found']); // Handle invalid ID
      }
    });
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedMenuItems = this.menuItems.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onCheckboxChange(itemId: number): void {
    // Check if item is already selected
    const index = this.selectedItems.findIndex(selectedItem => selectedItem.menuItemId === itemId);

    if (index === -1) {
      // Fetch the menu item details from API
      this.menuService.getMenuItemDetails(itemId).subscribe(
        item => {
          this.selectedItems.push(item);
          // Save the selected items to localStorage
          localStorage.setItem('SelectedItems', JSON.stringify(this.selectedItems));
          localStorage.setItem('RestaurantId', this.restaurantId.toString());
        },
        error => this.errorMessage = error
      );
    } else {
      this.selectedItems.splice(index, 1);
      // Save the updated selected items to localStorage
      localStorage.setItem('SelectedItems', JSON.stringify(this.selectedItems));
      localStorage.setItem('RestaurantId', this.restaurantId.toString());
    }
  }

  confirmOrder(): void {

  }
}
