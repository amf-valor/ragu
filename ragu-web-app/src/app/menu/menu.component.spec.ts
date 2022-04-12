import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import { MenubarModule } from 'primeng/menubar';
import { MenuComponent } from './menu.component';
import  userEvent from '@testing-library/user-event';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../app-routing.module';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports:[
        MenubarModule,
        RouterTestingModule.withRoutes(routes)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show menu item Locais de entrega', () => {
    const menuItem = screen.queryByText('Locais de entrega');
    expect(menuItem).toBeTruthy();
  })

  it('should redirect to delivery-locales when clicked', async () => {
    const user = userEvent.setup();
    const menuItem = screen.getByText('Locais de entrega');
    const location = TestBed.inject(Location);

    await user.click(menuItem)

    expect(location.path()).toBe('/delivery-locales')
  })
});
