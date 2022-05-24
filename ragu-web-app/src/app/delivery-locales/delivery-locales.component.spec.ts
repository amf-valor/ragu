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

const errorMessage: Message = {
  severity: 'error',
  summary: 'Oops!',
  detail: 'Desculpe o transtorno, mas algo inesperado ocorreu. Tente novamente mais tarde.'
};

describe('DeliveryLocalesComponent', () => {
  let fixture: ComponentFixture<DeliveryLocalesComponent>;
  let component: DeliveryLocalesComponent;

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
  });

  it(`GIVEN ragu loaded correctly WHEN user goes to Locais de entrega THEN bairro should be empty and taxa should be empty 
  and save button should be disabled`, () => {

    const hoodInput = screen.getByLabelText('Bairro') as HTMLInputElement;
    const taxInput = screen.getByLabelText('Taxa') as HTMLInputElement;
    const saveButton = screen.getByRole('button', {name: 'Salvar'}) as HTMLButtonElement;

    expect(hoodInput.value).toBe('');
    expect(taxInput.value).toBe('');
    expect(saveButton.disabled).toBeTrue();
  });

  it('GIVEN tax input WHEN user types any letter THEN tax input should not accept and remain empty', async () => {
    const taxInput = screen.getByLabelText('Taxa');
    
    await userEvent.type(taxInput, 'as');
    
    expect(taxInput.textContent).toBe('');
  });

  it('GIVEN tax input WHEN user types a number THEN tax input should format the number to currency real', async () => {
    const taxInput = screen.getByLabelText('Taxa') as HTMLInputElement;
    
    fireEvent.change(taxInput, {target:{value: "20"}});
    fireEvent.blur(taxInput);

    //u00A0 is the unicode for &nbsp
    //the replace is needed because the value is an HTML string from input
    //angular pipe, after formating, it turns R$&nbsp20,00 which was 
    //breaking the comparision against R$ 20,00 and failing the test.
    expect(replaceNbspByEmptySpace(taxInput.value)).toEqual('R$ 20,00');
  });

  it('GIVEN neighbourhood and tax WHEN user clicks on salvar THEN should clear inputs and append new line to the hood list ', waitForAsync(async() => {
    expect(screen.queryByText('Vila matilde')).toBeNull();

    const taxInput = screen.getByLabelText('Taxa');
    const saveButton = screen.getByRole('button', {name: 'Salvar'});
    
    await userEvent.type(screen.getByLabelText('Bairro'), 'Vila matilde');
    fireEvent.change(taxInput, {target:{value: "20"}});
    fireEvent.blur(taxInput);
    fixture.detectChanges();
    await userEvent.click(saveButton);
    fireEvent.change(screen.getByRole('table'));  
    await fixture.whenStable();
    fixture.detectChanges();

    expect((screen.getByLabelText('Bairro') as HTMLInputElement).value).toBe('');
    expect(screen.getByText('Vila matilde')).toBeDefined();
    expect(screen.getByText('R$ 20,00')).toBeDefined();
  }));

  it('GIVEN hood input WHEN do not provide the neighborhood THEN required error message appear', async () => {
    expect(screen.queryByText('Bairro é obrigatório')).withContext('hood input required error message').toBeNull();

    const hoodInput = screen.getByLabelText('Bairro');

    await userEvent.type(hoodInput, 'any');
    await userEvent.clear(hoodInput);
    fixture.detectChanges();

    expect(screen.queryByText('Bairro é obrigatório')).withContext('hood input required error message').not.toBeNull();
  });

  it('GIVEN tax input WHEN user do not provide the tax THEN required error message should appear', async () => {
    expect(screen.queryByText('Taxa é obrigatório')).withContext('tax input required error message').toBeNull();

    const taxInput = screen.getByLabelText('Taxa');

    fireEvent.blur(taxInput);
    fixture.detectChanges();

    expect(screen.queryByText('Taxa é obrigatório')).withContext('tax input required error message').not.toBeNull();
  });

  it('GIVEN save button was clicked WHEN is saving THEN load spinner should appear and disappear', async () => {
    const saveButton = screen.getByRole('button', {name: 'Salvar'});
    expect(saveButton.querySelector(".pi-spinner")).withContext('save button loading when component appear').toBeNull();

    const taxInput = screen.getByLabelText('Taxa');
    
    await userEvent.type(screen.getByLabelText('Bairro'), 'any');
    fireEvent.change(taxInput, {target:{value: "2"}});
    fireEvent.blur(taxInput);
    fixture.detectChanges();
    await userEvent.click(saveButton);
    fixture.detectChanges();
    expect(saveButton.querySelector(".pi-spinner")).withContext('save button loading just after clicked').not.toBeNull();
    
    await fixture.whenStable();
    fixture.detectChanges();
    expect(saveButton.querySelector(".pi-spinner")).withContext('save button loading when save operation finished').toBeNull();
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
    expect(table.querySelector(".pi-spinner")).withContext("loading should appear when is fetching").not.toBeNull();

    await fixture.whenStable();
    fixture.detectChanges();
    expect(table.querySelector(".pi-spinner")).withContext("loading should disappear after get all delivery locales").toBeNull();
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

  it('GIVEN some error ocurred WHEN fetching all delivery locales on init THEN isFetching should be false', () => {
    spyOn(TestBed.inject(DeliveryLocalesService), 'getAll').and.returnValue(throwError(() =>  new Error("any")));

    component.ngOnInit();

    expect(component.isFetching).toBeFalse();
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

  it('GIVEN some error ocurred WHEN fetching delivery locales on init THEN should add error to MessageService', () => {
    const messageService = TestBed.inject(MessageService);
    let actual: Message = {};
    
    spyOn(TestBed.inject(DeliveryLocalesService), 'delete').and.returnValue(throwError(() =>  new Error("any")));
    messageService.messageObserver.subscribe(message => actual = message as Message);
    
    component.onTrashButtonClick(0);

    expect(actual).toEqual(errorMessage);
  });

  function replaceNbspByEmptySpace(value: string): ArrayLike<string> {
    return value.replace(/\u00A0/g, ' ');
  }

});
