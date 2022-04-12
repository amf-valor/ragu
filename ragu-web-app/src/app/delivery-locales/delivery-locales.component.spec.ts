import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryLocalesComponent } from './delivery-locales.component';

describe('DeliveryLocalesComponent', () => {
  let component: DeliveryLocalesComponent;
  let fixture: ComponentFixture<DeliveryLocalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryLocalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryLocalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
