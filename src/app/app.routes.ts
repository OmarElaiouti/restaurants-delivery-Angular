import { Routes } from '@angular/router';
import { HomeComponent } from './Components/Home/home/home.component';
import { RestaurantComponent } from './Components/Restaurant/restaurant/restaurant.component';
import { MenuComponent } from './Components/Menu/menu/menu.component';
import { CustomerDetailsComponent } from './Components/CustomerDetails/customer-details/customer-details.component';
import { OrderConfirmationComponent } from './Components/order-confirmation/order-confirmation.component';
import { AllResultsComponent } from './Components/all-results/all-results.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'home' },
    { path: 'restaurant', component: RestaurantComponent },
    { path: 'menu/:id', component: MenuComponent },
    { path: 'customer-details', component: CustomerDetailsComponent },
    { path: 'order-confirmation', component: OrderConfirmationComponent },
    { path: 'results', component: AllResultsComponent },

];
