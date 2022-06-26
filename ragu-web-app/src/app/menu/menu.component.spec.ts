import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MenubarModule } from 'primeng/menubar';
import { routes } from '../app-routing.module';
import { MenuComponent } from './menu.component';

fdescribe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [
        MenubarModule,
        RouterTestingModule.withRoutes(routes)
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();
  });

  it('should redirect to delivery-locales when clicked', async () => {
    await givenMenuItemShouldRedirecTo('Locais de entrega', '/delivery-locales');
  });
  
  it('should redirect to products when produtos menu item is clicked', async () =>{
    await givenMenuItemShouldRedirecTo('Produtos', '/products');
  });
  
  async function givenMenuItemShouldRedirecTo(menuItemText: string, expectedPath: string) {
    const menuItem = screen.getByText(menuItemText);
    const location = TestBed.inject(Location);

    await userEvent.click(menuItem);

    expect(location.path()).toBe(expectedPath);
  }
});

