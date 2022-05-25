import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { within } from '@testing-library/angular';
import { fireEvent, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { Message, MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { RaguInMemoryDbService } from 'src/ragu-in-memory-db.service';
import { DeliveryLocalesComponent } from './delivery-locales.component';
import { DeliveryLocalesModule } from './delivery-locales.module';
import { DeliveryLocalesService } from './delivery-locales.service';

const SPINNER_CLASS = ".pi-spinner";

const errorMessage: Message = {
  severity: 'error',
  summary: 'Oops!',
  detail: 'Desculpe o transtorno, mas algo inesperado ocorreu. Tente novamente mais tarde.'
};

class DeliveryLocalesPage{
  get hoodInput(): HTMLInputElement{
    return screen.getByLabelText('Bairro');
  }

  get saveButton(): HTMLButtonElement {
    return screen.getByRole('button', {name: 'Salvar'})  
  }
  
  get taxInput(): HTMLInputElement{
    return screen.getByLabelText('Taxa');
  }
  
  get table(): HTMLElement{
    return screen.getByRole('table');
  }
  
  getCell(text: string): HTMLElement {
    return screen.getByRole('cell',{ name: text })
  }
  
  queryCell(text: string): HTMLElement | null {
    return screen.queryByRole('cell', { name: text })
  }
}

describe('DeliveryLocalesComponent', () => {
  let fixture: ComponentFixture<DeliveryLocalesComponent>;
  let component: DeliveryLocalesComponent;
  let page: DeliveryLocalesPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryLocalesComponent] ,
      imports:[
        DeliveryLocalesModule, 
        HttpClientModule, 
        HttpClientInMemoryWebApiModule.forRoot(RaguInMemoryDbService)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryLocalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new DeliveryLocalesPage();
  });

  it(`GIVEN delivery locales is loaded WHEN save button THEN it should be disabled`, () => {
    expect(page.saveButton.disabled).toBeTrue();
  });

  it('GIVEN tax input WHEN user types any letter THEN tax input should not accept and remain empty', async () => {
    await userEvent.type(page.taxInput, 'as');
    expect(page.taxInput.textContent).toBe('');
  });

  it('GIVEN tax input WHEN user types a number THEN tax input should format the number to currency real', async () => {
    fireEvent.change(page.taxInput, {target:{value: "20"}});
    fireEvent.blur(page.taxInput);

    //the replace is needed because the value is an HTML string from input
    //angular pipe, after formating, it turns to R$&nbsp20,00 which was 
    //breaking the comparision against R$ 20,00 and failing the test silently.
    expect(replaceNbspByEmptySpace(page.taxInput.value)).toEqual('R$ 20,00');
  });

  it('GIVEN neighbourhood and tax WHEN user clicks on salvar THEN should clear inputs and append new line to the hood list ', waitForAsync(async() => {
    expect(page.queryCell('Vila matilde')).toBeNull();
    
    await userEvent.type(page.hoodInput, 'Vila matilde');
    fireEvent.change(page.taxInput, { target: { value: "20" } });
    fireEvent.blur(page.taxInput);
    fixture.detectChanges();
    await userEvent.click(page.saveButton);
    fireEvent.change(page.table);  
    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.hoodInput.value).toBe('');
    expect(page.getCell('Vila matilde')).toBeDefined();
    expect(screen.getByText('R$ 20,00')).toBeDefined();
  }));

  it('GIVEN hood input WHEN do not provide the neighborhood THEN required error message appear', async () => {
    expect(screen.queryByText('Bairro é obrigatório')).withContext('hood input required error message').toBeNull();

    await userEvent.type(page.hoodInput, 'any');
    await userEvent.clear(page.hoodInput);
    fixture.detectChanges();

    expect(screen.queryByText('Bairro é obrigatório')).withContext('hood input required error message').not.toBeNull();
  });

  it('GIVEN tax input WHEN user do not provide the tax THEN required error message should appear', async () => {
    expect(screen.queryByText('Taxa é obrigatório')).withContext('tax input required error message').toBeNull();

    fireEvent.blur(page.taxInput);
    fixture.detectChanges();

    expect(screen.queryByText('Taxa é obrigatório')).withContext('tax input required error message').not.toBeNull();
  });

  it('GIVEN save button was clicked WHEN is saving THEN load spinner should appear and disappear', async () => {
    expect(page.saveButton.querySelector(SPINNER_CLASS)).withContext('save button loading when component appear').toBeNull();

    await userEvent.type(screen.getByLabelText('Bairro'), 'any');
    fireEvent.change(page.taxInput, {target:{value: "2"}});
    fireEvent.blur(page.taxInput);
    fixture.detectChanges();
    await userEvent.click(page.saveButton);
    fixture.detectChanges();
    expect(page.saveButton.querySelector(SPINNER_CLASS)).withContext('save button loading just after clicked').not.toBeNull();
    
    await fixture.whenStable();
    fixture.detectChanges();
    expect(page.saveButton.querySelector(SPINNER_CLASS)).withContext('save button loading when save operation finished').toBeNull();
  });

  it('GIVEN delivery locales previously registered WHEN user goes to Locais de entrega THEN all of them should be displayed', async() => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(screen.queryByText('itagua - in memory')).withContext('itagua should be displayed').not.toBeNull();
    expect(screen.queryByText('centro - in memory')).withContext('centro should be displayed').not.toBeNull();
  });

  it('GIVEN component is initializing WHEN is fetching all delivery locales THEN', async () => {
    const table = screen.getByTestId('delivery-locales-table');
    fixture.detectChanges();
    expect(table.querySelector(SPINNER_CLASS)).withContext("loading should appear when is fetching").not.toBeNull();

    await fixture.whenStable();
    fixture.detectChanges();
    expect(table.querySelector(SPINNER_CLASS)).withContext("loading should disappear after get all delivery locales").toBeNull();
  });

  it('GIVEN some error ocurred WHEN save new delivery locale THEN isSaving should be false', () => {
    spyOn(TestBed.inject(DeliveryLocalesService), 'post').and.returnValue(throwError(() => new Error("any")));
    
    component.onSaveButtonClick();

    expect(component.isSaving).toBeFalse();
  });

  it('GIVEN some error ocurred WHEN fetching delivery locales on init THEN should add error to MessageService', () => {
    const messageService = TestBed.inject(MessageService);
    let actual: Message = {};
    
    spyOn(TestBed.inject(DeliveryLocalesService), 'getAll').and.returnValue(throwError(() =>  new Error("any")));
    messageService.messageObserver.subscribe(message => actual = message as Message);
    
    component.ngOnInit();

    expect(actual).toEqual(errorMessage);
  });

  it('GIVEN some error ocurred WHEN fetching all delivery locales on init THEN isTableLoading should be false', () => {
    spyOn(TestBed.inject(DeliveryLocalesService), 'getAll').and.returnValue(throwError(() =>  new Error("any")));

    component.ngOnInit();

    expect(component.isTableLoading).toBeFalse();
  });

  it('GIVEN an existing delivery locale WHEN user click on remove THEN delivery locale should be removed from the list', async () => {
    const saveButton = screen.getByRole('button', {name: 'Salvar'});
    const taxInput = screen.getByLabelText('Taxa');
    await userEvent.type(screen.getByLabelText('Bairro'), 'toDelete');
    fireEvent.change(taxInput, {target:{value: "20"}});
    fireEvent.blur(taxInput);
    fixture.detectChanges();
    await userEvent.click(saveButton);
    await fixture.whenStable();
    fixture.detectChanges();

    const deleteButton = within(screen.getByRole('row', {name: /todelete/i})).getByTestId("trashButton") 
    await userEvent.click(deleteButton);
    await fixture.whenStable();
    fixture.detectChanges();
    
    expect(screen.queryByRole('row', { name: /toDelete/i })).toBeNull();
  })

  it('GIVEN some error ocurred WHEN deleting delivery locales THEN should add error to MessageService', () => {
    const messageService = TestBed.inject(MessageService);
    let actual: Message = {};
    
    spyOn(TestBed.inject(DeliveryLocalesService), 'delete').and.returnValue(throwError(() =>  new Error("any")));
    messageService.messageObserver.subscribe(message => actual = message as Message);
    
    component.onTrashButtonClick(0);

    expect(actual).toEqual(errorMessage);
  });

  it('GIVEN trash button was clicked WHEN is removing THEN load spinner should appear and disappear', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const trashButton = within(screen.getByRole('row', {name: /itagua - in memory/i})).getByTestId("trashButton")
    const table = screen.getByTestId('delivery-locales-table');
    
    await userEvent.click(trashButton);
    fixture.detectChanges();
    expect(table.querySelector(SPINNER_CLASS)).withContext('table loading after trash button clicked').not.toBeNull();
    
    await fixture.whenStable();
    fixture.detectChanges();
    expect(table.querySelector(SPINNER_CLASS)).withContext('table stop loading when delete operation finished').toBeNull();
  });

  function replaceNbspByEmptySpace(value: string): ArrayLike<string> {
    const nbspUnicodePattern = /\u00A0/g;
    return value.replace(nbspUnicodePattern, ' ');
  }

});
