import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { finalize, takeWhile } from 'rxjs';
import { DeliveryLocale } from './delivery-locale.model';
import { DeliveryLocalesService } from './delivery-locales.service';


@Component({
  selector: 'app-delivery-locales',
  templateUrl: './delivery-locales.component.html',
  styleUrls: ['./delivery-locales.component.css']
})
export class DeliveryLocalesComponent implements OnInit, OnDestroy {
  private readonly _deliveryLocalesForm: FormGroup = this.formBuilder.group({
    hood: ['', Validators.required],
    tax: [null, Validators.required]
  });

  get deliveryLocalesForm(): FormGroup {
    return this._deliveryLocalesForm;
  }

  private _deliveryLocales: DeliveryLocale[] = [];
  get deliveryLocales(): DeliveryLocale[] {
    return this._deliveryLocales;
  }

  private _isTableLoading: boolean = false;
  get isTableLoading(): boolean {
    return this._isTableLoading;
  }

  private _isSaving: boolean = false;
  get isSaving(): boolean {
    return this._isSaving;
  }

  get hoodControl(): AbstractControl {
    return <AbstractControl>this._deliveryLocalesForm.get('hood');
  }
  
  get taxControl(): AbstractControl {
    return <AbstractControl>this._deliveryLocalesForm.get('tax');
  }
  
  private _isAlive: boolean = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly deliveryLocalesService: DeliveryLocalesService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._isTableLoading = true;

    this.deliveryLocalesService.getAll()
      .pipe(
        takeWhile(() => this._isAlive),
        finalize(() => this._isTableLoading = false),
      ).subscribe({
        next: deliveryLocales => {
          this._deliveryLocales = [...deliveryLocales];
        },
        error: () => this.addErrorMessage()
      });
  }


  onSaveButtonClick() {
    this._isSaving = true;

    this.deliveryLocalesService.post({ hood: this.hoodControl.value, tax: this.taxControl.value })
      .pipe(
        finalize(() => this._isSaving = false),
        takeWhile(() => this._isAlive)  
      ).subscribe({
        next: deliveryLocale => {
          this._deliveryLocales.push({...deliveryLocale});
          this._deliveryLocalesForm.reset();
        },
        error: () => this.addErrorMessage()
      });
  }

  onTrashButtonClick(id: number) {
    this._isTableLoading = true;

    this.deliveryLocalesService.delete(id)
      .pipe(
        finalize(() => this._isTableLoading = false),
        takeWhile(() => this._isAlive)
      )
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
    this._deliveryLocales = [...this._deliveryLocales
      .filter(deliveryLocale => deliveryLocale.id !== id)]
  }

  ngOnDestroy(): void {
    this._isAlive = false;
  }
}
