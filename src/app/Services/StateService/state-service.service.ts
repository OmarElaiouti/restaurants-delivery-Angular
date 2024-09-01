import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateServiceService {

  private selectedCityId: string = '';
  private selectedRestaurantId: number | null = null;
  private selectedItems: Set<number> = new Set<number>();

  // BehaviorSubjects to expose the current state as Observables
  private selectedCityIdSubject = new BehaviorSubject<string>(this.selectedCityId);
  private selectedRestaurantIdSubject = new BehaviorSubject<number | null>(this.selectedRestaurantId);

  selectedCityId$: Observable<string> = this.selectedCityIdSubject.asObservable();
  selectedRestaurantId$: Observable<number | null> = this.selectedRestaurantIdSubject.asObservable();

  // Set the selected city ID
  setSelectedCityId(cityId: string): void {
    this.selectedCityId = cityId;
    this.selectedCityIdSubject.next(cityId);
  }

  // Get the selected city ID
  getSelectedCityId(): string {
    return this.selectedCityId;
  }

  // Set the selected restaurant ID and clear items if restaurant changes
  setSelectedRestaurantId(restaurantId: number | null): void {
    if (this.selectedRestaurantId !== restaurantId) {
      this.selectedRestaurantId = restaurantId;
      this.selectedRestaurantIdSubject.next(restaurantId);
      
      // Clear selected items when restaurant changes
      this.selectedItems.clear();
    }
  }

  // Get the selected restaurant ID
  getSelectedRestaurantId(): number | null {
    return this.selectedRestaurantId;
  }

  // Update selected items
  updateSelectedItems(itemId: number, isChecked: boolean): void {
    if (isChecked) {
      this.selectedItems.add(itemId);
    } else {
      this.selectedItems.delete(itemId);
    }
  }

  // Get selected items for the current restaurant
  getSelectedItems(): Set<number> {
    return this.selectedItems;
  }
}
