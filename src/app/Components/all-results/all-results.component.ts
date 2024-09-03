import { Component } from '@angular/core';
import { ICity } from '../../Models/ICity';
import { RestaurantService } from '../../Services/RestaurantService/restaurant.service';
import { PreloaderService } from '../../Services/preloaderService/preloader.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstPipe } from '../../Pipes/capitalizeFirst/capitalize-first.pipe';
import { NavigationService } from '../../Services/NavigationService/navigation.service';

@Component({
  selector: 'app-all-results',
  standalone: true,
  imports: [CommonModule,RouterModule,CapitalizeFirstPipe ],
  templateUrl: './all-results.component.html',
  styleUrl: './all-results.component.css'
})
export class AllResultsComponent {
  results: ICity[] = [];
  errorMessage: string = '';

  constructor(private restaurantService: RestaurantService,
    private router: Router, private route: ActivatedRoute,
    private preloader: PreloaderService,
    private navigationService: NavigationService) {}

  ngOnInit(): void {
    const currentUrl = this.router.url;


    this.navigationService.setCurrentUrl(currentUrl);



        this.restaurantService.getAllRestaurantsByCities().subscribe({
          next: (data) => {
            this.results = data;
          },
          error: (error) => this.errorMessage = error
        });
      
  }

  ViewAll(selectedCityId:number) {
      this.router.navigate(['/restaurant'], { queryParams: { cityId: selectedCityId } });
   
  }
}
