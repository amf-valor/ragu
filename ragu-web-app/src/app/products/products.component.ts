import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, takeWhile } from 'rxjs';
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

  private _productsSource: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  
  products$: Observable<Product[]> = this._productsSource.asObservable();
  

  constructor(private readonly _formBuilder: FormBuilder, 
              private readonly _productRaguService: ProductRaguService,
              private readonly _notificationService: NotificationService){}
  
  ngOnInit(): void {
    this._productRaguService.get()
      .pipe(takeWhile(() => this._isActive))
      .subscribe({
        next: products => {
          this._productsSource.next([...products]);
        },
        error: () => {
          this._notificationService.notifyError();
        }
      });
  }
  
  ngOnDestroy(): void {
    this._isActive = false;
  }

  onSaveButtonClick(){
    this._productRaguService  
      .post(this.fromForm())
      .pipe(takeWhile(() => this._isActive))
      .subscribe({
        next: newProduct => {
          this._productsSource.next([...this._productsSource.value, {...newProduct}]);
          this.productForm.reset();
        },
        error: () => { this._notificationService.notifyError(); }
      });
  }

  onRemoveButtonClick(id: number){
    this._productRaguService.delete(id)
      .pipe(takeWhile(() => this._isActive))
      .subscribe({
        error: () => { this._notificationService.notifyError(); },
        complete: () => {
          this._productsSource.next([...this._productsSource.value.filter(product => product.id !== id)]);
        }
      });
  }

  private fromForm(): Product {
    return {
      name: this.nameControl.value,
      price: this.priceControl.value
    };
  }
}


