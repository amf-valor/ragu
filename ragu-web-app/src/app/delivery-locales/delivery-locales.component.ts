import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  
  private _isFetching: boolean;
  public get isFetching(): boolean {
    return this._isFetching;
  }

  public get hoodControl() : AbstractControl { 
    return <AbstractControl>this.deliveryLocalesForm.get('hood'); 
  }
  
  public get taxControl() : AbstractControl {
    return <AbstractControl> this.deliveryLocalesForm.get('tax');
  }
  
  saving: boolean;

  constructor(private formBuilder: FormBuilder, private deliveryLocalesService: DeliveryLocalesService) { 
    this.deliveryLocalesForm = this.formBuilder.group({
      hood: ['', Validators.required],
      tax: [null, Validators.required]
    });

    this.saving = false;
    this._isFetching = false;
  }

  ngOnInit(): void {
    this._isFetching = true;
    
    this.deliveryLocalesService.getAll().subscribe(deliveryLocales => {
      this._isFetching = false;
      this._deliveryLocales = deliveryLocales;
    });
  }

  onSaveButtonClick(){
    this.saving = true;

    this.deliveryLocalesService.post({ hood: this.hoodControl.value, tax: this.taxControl.value })
      .subscribe(deliveryLocale => {
        this.deliveryLocales.push(deliveryLocale);
        this.deliveryLocalesForm.reset();
        this.saving = false;
      });
  }

}
