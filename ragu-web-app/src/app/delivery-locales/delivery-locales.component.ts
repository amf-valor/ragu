import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { DeliveryLocale } from './delivery-locale.model';
import { DeliveryLocalesService } from './delivery-locales.service';


@Component({
  selector: 'app-delivery-locales',
  templateUrl: './delivery-locales.component.html',
  styleUrls: ['./delivery-locales.component.css']
})
export class DeliveryLocalesComponent implements OnInit{

  deliveryLocalesForm: FormGroup;
  
  private _deliveryLocales: DeliveryLocale[] = [];
  public get deliveryLocales(): DeliveryLocale[] {
    return this._deliveryLocales;
  }
  
  private _isTableLoading: boolean;
  public get isTableLoading(): boolean {
    return this._isTableLoading;
  }
  
  public get hoodControl() : AbstractControl { 
    return <AbstractControl>this.deliveryLocalesForm.get('hood'); 
  }
  
  public get taxControl() : AbstractControl {
    return <AbstractControl> this.deliveryLocalesForm.get('tax');
  }
  
  private _isSaving: boolean;
  public get isSaving(): boolean {
    return this._isSaving;
  }

  constructor(
    private formBuilder: FormBuilder, 
    private deliveryLocalesService: DeliveryLocalesService, 
    private messageService: MessageService
  ){ 
    this.deliveryLocalesForm = this.formBuilder.group({
      hood: ['', Validators.required],
      tax: [null, Validators.required]
    });

    this._isTableLoading = false;
    this._isSaving = false;
  }

  ngOnInit(): void {
    this._isTableLoading = true;
    
    this.deliveryLocalesService.getAll()
      .pipe(finalize(() => this._isTableLoading = false ))
      .subscribe({
        next: deliveryLocales => {
          this._deliveryLocales = deliveryLocales;
        },
        error: () => this.addErrorMessage()
      });
  }

  
  onSaveButtonClick(){
    this._isSaving = true;
    
    this.deliveryLocalesService.post({ hood: this.hoodControl.value, tax: this.taxControl.value })
    .pipe(finalize(() => this._isSaving = false))
    .subscribe({
      next: deliveryLocale => {
          this.deliveryLocales.push(deliveryLocale);
          this.deliveryLocalesForm.reset();
        },
        error: () => this.addErrorMessage()
      });
  }
  
  onTrashButtonClick(id: number){
    this._isTableLoading = true;

    this.deliveryLocalesService.delete(id)
    .pipe(finalize(() => this._isTableLoading = false))
    .subscribe({
      next: () => this.removeDeliveryLocaleById(id),
      error: () => this.addErrorMessage()
    })
  }
  
  private addErrorMessage(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Oops!',
      detail: 'Desculpe o transtorno, mas algo inesperado ocorreu. Tente novamente mais tarde.'
    });
  }

  private removeDeliveryLocaleById(id: number) {
    const quantityOfItemsToRemove = 1;
    const indexToRemove = this.deliveryLocales.findIndex(item => item.id === id);
    this.deliveryLocales.splice(indexToRemove, quantityOfItemsToRemove);
  }
  
}
