import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../../Services/OrederService/order.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IOrderItem } from '../../../Models/IOrdeItem';
import { IOrder } from '../../../Models/IOrder';
import { PreloaderService } from '../../../Services/preloaderService/preloader.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {
  customerForm!: FormGroup;
  menuItems: IOrderItem[] = [];
  restaurantId: number = 0;
  loading: boolean = false; // For loading state
  errorMessage: string = ''; // For error handling

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router,
    private preloader: PreloaderService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }

  private initializeForm(): void {
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/)]],
      customerEmail: ['', [Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      customerAddress: ['', Validators.required]
    });
  }

  private loadData(): void {
    try {
      const selectedItemsJson = localStorage.getItem('SelectedItems');
      const restaurantId = Number(localStorage.getItem('RestaurantId')) || 0;

      if (!selectedItemsJson || restaurantId === 0) {
        // Redirect to the home page if data is missing
        this.router.navigate(['/']);
        return;
      }

      const selectedItems: IOrderItem[] = JSON.parse(selectedItemsJson);
      this.menuItems = selectedItems;
      this.restaurantId = restaurantId;

      // Pre-fill form with data from localStorage if available
      const customerDetailsJson = localStorage.getItem('orderDetails');
      if (customerDetailsJson) {
        const customerDetails = JSON.parse(customerDetailsJson);
        this.customerForm.patchValue(customerDetails);
      }

    } catch (error) {
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.loading = true; // Set loading state to true

      const order: IOrder = {
        ...this.customerForm.value,
        orderItems: this.menuItems
      };

      localStorage.setItem('orderDetails', JSON.stringify(order));

    
          this.router.navigate(['/order-confirmation']);
       
    } else {
      this.errorMessage = 'Please correct the errors in the form.';
    }
  }
}
