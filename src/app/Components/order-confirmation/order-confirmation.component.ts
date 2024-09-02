import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { OrderService } from '../../Services/OrederService/order.service';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { IOrderItem } from '../../Models/IOrdeItem';
import { IMenuItem } from '../../Models/IMenuItem';
import { Route, Router, RouterLink } from '@angular/router';
import $ from 'jquery';
import { PreloaderService } from '../../Services/preloaderService/preloader.service';
import { AuthService } from '../../Services/AuthService/auth.service';
import { PopupService } from '../../Services/PopupService/popup.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [NgbModalModule,CommonModule,RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {

  @ViewChild('receiptModal') receiptModal!: TemplateRef<any>;
  
  customerDetails: any;
  items: any[] = [];
  total: number = 0;
  subtotal: number = 0;
  receiptContent: string = '';

  constructor(
    private orderService: OrderService,
    private modalService: NgbModal,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private preloader: PreloaderService,
    private authService: AuthService,
    private popupService: PopupService

  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const customerDetails = localStorage.getItem('orderDetails');
    this.customerDetails = customerDetails ? JSON.parse(customerDetails) : {};

    const selectedItems = localStorage.getItem('SelectedItems');
    this.items = selectedItems ? JSON.parse(selectedItems) : [];
    if (!customerDetails || !selectedItems) {
      // Redirect to home page if local storage is missing necessary data
      this.router.navigate(['/']);
      return;
    }
    this.items = this.items.map(item => ({
      ...item,
      quantity: item.quantity || 1,
      total: item.price * (item.quantity || 1)
    }));

    this.updateTotals();
  }

  updateQuantity(item: any, change: number): void {
    item.quantity = Math.max(1, (item.quantity || 1) + change);
    item.total = item.price * item.quantity;
    this.updateTotals();
  }

  removeItem(item: any): void {
    this.items = this.items.filter(i => i !== item);
    this.updateTotals();
  }

  updateTotals(): void {
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.total = this.subtotal; // Assuming no additional charges
  }

  confirmOrder(): void {
    debugger;
    if (!this.authService.isAuthenticated()) {
      this.popupService.showLogin();
      
      return; 
      
    }



    const orderItems = this.items.map(item => ({
      MenuItemId: item.menuItemId,
      Quantity: item.quantity,
      TotalPrice: item.total
    }));

    const order = {
      CustomerName: this.customerDetails.customerName,
      CustomerEmail: this.customerDetails.customerEmail,
      CustomerPhone: this.customerDetails.customerPhone,
      CustomerAddress: this.customerDetails.customerAddress,
      OrderItems: orderItems
    };

    this.orderService.submitOrder(order).subscribe(response => {
      
      if (response) {
        $('#confirmOrder').prop('disabled', true);

        this.receiptContent = `
          <div class="text-left">
            <div><strong>Customer:</strong> ${response.customerName}</div>
            <div><strong>Order Code:</strong> ${response.orderId}</div>
            <div><strong>Time:</strong> ${new Date().toLocaleString()}</div>
            <hr />
            <div class="receipt-items">
              <table class="table table-borderless">
                <thead>
                  <tr><th>Item</th><th>Price</th><th>Quantity</th><th>Total</th><th>Restaurant</th></tr>
                </thead>
                <tbody>
                  ${response.orderItems.map((item: any) => `
                    <tr>
                      <td>${item.menuItemName}</td>
                      <td>$${item.menuItemPrice}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.totalPrice}</td>
                      <td>${item.restaurantName}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <hr />
              <p><strong>Total Amount: $${response.totalAmount}</strong></p>
              <p>Your order will arrive as soon as possible.</p>
              <p>Thank you for ordering with us!</p>
            </div>
          </div>
        `;

        this.openReceiptModal();
      }
    }, error => {
      console.error('Error submitting order:', error);
    });
  }

  openReceiptModal(): void {
    const modal = document.getElementById('receiptModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeReceiptModal(): void {
    const modal = document.getElementById('receiptModal');
    if (modal) {
      modal.style.display = 'none';
       // Clear local storage
    this.router.navigate(['/']);
    }
  }
}