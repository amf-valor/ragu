import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { ToastModule } from "primeng/toast";
import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DeliveryLocalesComponent } from "./delivery-locales/delivery-locales.component";
import { DeliveryLocalesModule } from "./delivery-locales/delivery-locales.module";
import { MenuModule } from "./menu/menu.module";

describe('AppComponent integration tests', () => {
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [ DeliveryLocalesComponent, AppComponent ] ,
          imports:[
            BrowserAnimationsModule,
            AppRoutingModule, 
            MenuModule, 
            DeliveryLocalesModule, 
            HttpClientTestingModule, 
            ToastModule]
        })
        .compileComponents();
      });
    
    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
    });

    it('GIVEN user goes to Locais de entrega WHEN save delivery locale fail THEN toast should be prompted', async () => {
        const uri = `${environment.raguBaseUrl}/api/deliveryLocales`;
        await userEvent.click(screen.getByRole('menuitem', { name: 'Locais de entrega' }));
        await fixture.whenStable();
        fixture.detectChanges();

        const taxInput = screen.getByLabelText('Taxa');
        const saveButton = screen.getByRole('button', { name: 'Salvar' });
        const httpController = TestBed.inject(HttpTestingController);
    
        await userEvent.type(screen.getByLabelText('Bairro'), 'Itagua');
        fireEvent.change(taxInput, { target:{ value: "12" }});
        fireEvent.blur(taxInput);
        fixture.detectChanges();
        await userEvent.click(saveButton);
        const req = httpController.match(req => (req.url === uri && req.method === 'POST'))[0];
        expect(req).withContext(`was not found any request for: ${uri}`).toBeDefined();

        req.flush('', {status: 500, statusText: 'Internal Server Error'});
        await fixture.whenStable();
        fixture.detectChanges();

        expect(screen.getByText(/desculpe o transtorno, mas algo inesperado ocorreu\. tente novamente mais tarde\./i)).toBeDefined();
    });
});