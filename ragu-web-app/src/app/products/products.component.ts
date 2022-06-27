import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, of, takeWhile } from 'rxjs';
import { Product } from '../models/product.model';
import { NotificationService } from '../services/notification.service';
import { ProductRaguService } from '../services/product-ragu.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnDestroy, OnInit {
  private readonly _productForm: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    price: [null, Validators.required]
  });

  private _isActive = true;

  get productForm(): FormGroup{
    return this._productForm;
  }

  get nameControl(): FormControl{
    return <FormControl>this._productForm.get('name');
  }

  get priceControl(): FormControl{
    return <FormControl>this._productForm.get('price');
  }

  get isNameControlInvalid(): boolean{
    return this.isFormControlInvalid(this.nameControl);
  }

  private isFormControlInvalid(control: FormControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
  
  get isPriceControlInvalid(): boolean{
    return this.isFormControlInvalid(this.priceControl);
  }

  products$: Observable<Product[]> = of([]);
  

  constructor(private readonly _formBuilder: FormBuilder, 
              private readonly _productRaguService: ProductRaguService,
              private readonly _notificationService: NotificationService){}
  
  ngOnInit(): void {
    this.products$ = this._productRaguService.get()
      .pipe(catchError(() => { 
        this._notificationService.notifyError();
        return this.products$;
      }));
  }
  
  ngOnDestroy(): void {
    this._isActive = false;
  }

  onSaveButtonClick(){
    this._productRaguService  
      .post(this.fromForm())
      .pipe(takeWhile(() => this._isActive))
      .subscribe({
        next: () => this.productForm.reset(),
        error: () => { this._notificationService.notifyError(); }
      });
  }

  private fromForm(): Product {
    return {
      name: this.nameControl.value,
      price: this.priceControl?.value
    };
  }
}


