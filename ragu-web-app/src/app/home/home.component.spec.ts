import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataViewModule } from 'primeng/dataview';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderService } from './order-list/order-ragu.service';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, OrderListComponent ],
      imports: [CommonModule, DataViewModule],
      providers:[{provide: OrderService, useValue: { getByCreation: () => of([]) }}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});