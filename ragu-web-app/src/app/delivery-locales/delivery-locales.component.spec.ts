import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { within } from '@testing-library/angular';
import { fireEvent, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { Message, MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { RaguInMemoryDbService } from 'src/ragu-in-memory-db.service';
import { givenInputExpectOnlyNumbersAndCurrencyFormat } from 'src/testing';
import { DeliveryLocalesRaguService } from '../services/delivery-locales-ragu.service';
import { DeliveryLocalesComponent } from './delivery-locales.component';
import { DeliveryLocalesModule } from './delivery-locales.module';

const ERROR_MESSAGE: Message = {
  severity: 'error',
  summary: 'Oops!',
  detail: 'Desculpe o transtorno, mas algo inesperado ocorreu. Tente novamente mais tarde.'
};

const GET_ALL = 'getAll';
const ITAGUA_IN_MEMORY_PATTERN = /itagua - in memory/i;
const SPINNER_CLASS = ".pi-spinner";


class DeliveryLocalesPage {
  get hoodInput(): HTMLInputElement {
    return screen.getByLabelText('Bairro');
  }

  get saveButton(): HTMLButtonElement {
    return screen.getByRole('button', { name: 'Salvar' });
  }

  get taxInput(): HTMLInputElement {
    return screen.getByLabelText('Taxa');
  }

  get table(): HTMLElement {
    return screen.getByTestId('delivery-locales-table');
  }

  getCell(text: string): HTMLElement {
    return screen.getByRole('cell', { name: text });
  }

  getTrashButtonByRowName(name: string | RegExp): HTMLElement {
    return within(screen.getByRole('row', { name: name })).getByTestId("trashButton");
  }

  queryCell(text: string): HTMLElement | null {
    return screen.queryByRole('cell', { name: text });
  }

  queryRow(name: string | RegExp): HTMLElement | null {
    return screen.queryByRole('row', { name: name });
  }
}

describe('DeliveryLocalesComponent', () => {
  let fixture: ComponentFixture<DeliveryLocalesComponent>;
  let component: DeliveryLocalesComponent;
  let page: DeliveryLocalesPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryLocalesComponent],
      imports: [
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

  it('should accept only numbers and format currency when type tax value', async () => {
    await givenInputExpectOnlyNumbersAndCurrencyFormat(page.taxInput);
  });

  it(`GIVEN neighbourhood and tax WHEN user clicks on salvar 
      THEN should clear inputs and append new line to the hood list`, waitForAsync(async () => {
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

  it(`GIVEN hood input WHEN do not provide the neighborhood 
      THEN required error message appear`, async () => {

    expect(screen.queryByText('Bairro é obrigatório'))
      .withContext('hood input required error message').toBeNull();

    await userEvent.type(page.hoodInput, 'any');
    await userEvent.clear(page.hoodInput);
    fixture.detectChanges();

    expect(screen.queryByText('Bairro é obrigatório'))
      .withContext('hood input required error message').not.toBeNull();
  });

  it(`GIVEN tax input WHEN user do not provide the tax 
      THEN required error message should appear`, async () => {

    expect(screen.queryByText('Taxa é obrigatório'))
      .withContext('tax input required error message').toBeNull();

    fireEvent.blur(page.taxInput);
    fixture.detectChanges();

    expect(screen.queryByText('Taxa é obrigatório'))
      .withContext('tax input required error message').not.toBeNull();
  });

  it(`GIVEN save button was clicked WHEN is saving 
      THEN load spinner should appear and disappear`, async () => {

    expect(page.saveButton.querySelector(SPINNER_CLASS))
      .withContext('save button loading when component appear').toBeNull();

    await userEvent.type(page.hoodInput, 'any');
    fireEvent.change(page.taxInput, { target: { value: "2" } });
    fireEvent.blur(page.taxInput);
    fixture.detectChanges();
    await userEvent.click(page.saveButton);
    fixture.detectChanges();

    expect(page.saveButton.querySelector(SPINNER_CLASS))
      .withContext('save button loading just after clicked').not.toBeNull();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.saveButton.querySelector(SPINNER_CLASS))
      .withContext('save button loading when save operation finished').toBeNull();
  });

  it(`GIVEN delivery locales previously registered WHEN user goes to Locais de entrega 
      THEN all of them should be displayed`, async () => {

    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.getCell('itagua - in memory'))
      .withContext('itagua should be displayed').not.toBeNull();

    expect(page.getCell('centro - in memory'))
      .withContext('centro should be displayed').not.toBeNull();
  });

  it(`GIVEN component is initializing WHEN is fetching all delivery locales 
      THEN loading should appear and disappear`, async () => {

    fixture.detectChanges();

    expect(page.table.querySelector(SPINNER_CLASS))
      .withContext("loading should appear when is fetching").not.toBeNull();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.table.querySelector(SPINNER_CLASS))
      .withContext("loading should disappear after get all delivery locales").toBeNull();
  });

  it(`GIVEN some error ocurred WHEN save new delivery locale 
      THEN isSaving should be false`, () => {

    spyOn(TestBed.inject(DeliveryLocalesRaguService), 'post')
      .and.returnValue(throwError(() => new Error("any")));

    component.onSaveButtonClick();

    expect(component.isSaving).toBeFalse();
  });

  it(`GIVEN some error ocurred WHEN fetching delivery locales on init 
      THEN should add error to MessageService`, () => {

    const messageService = TestBed.inject(MessageService);
    let actual: Message = {};

    spyOn(TestBed.inject(DeliveryLocalesRaguService), GET_ALL)
      .and.returnValue(throwError(() => new Error("any")));

    messageService.messageObserver.subscribe(message => actual = message as Message);

    component.ngOnInit();

    expect(actual).toEqual(ERROR_MESSAGE);
  });

  it(`GIVEN some error ocurred WHEN fetching all delivery locales on init 
      THEN isTableLoading should be false`, () => {

    spyOn(TestBed.inject(DeliveryLocalesRaguService), GET_ALL)
      .and.returnValue(throwError(() => new Error("any")));

    component.ngOnInit();

    expect(component.isTableLoading).toBeFalse();
  });

  it(`GIVEN an existing delivery locale WHEN user click on trash button 
      THEN delivery locale should be removed from the hood list`, async () => {

    await fixture.whenStable();
    fixture.detectChanges();

    const deleteButton = page.getTrashButtonByRowName(ITAGUA_IN_MEMORY_PATTERN);
    await userEvent.click(deleteButton);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.queryRow(ITAGUA_IN_MEMORY_PATTERN)).toBeNull();
  });

  it(`GIVEN some error ocurred WHEN deleting delivery locales 
      THEN should add error to MessageService`, () => {

    const messageService = TestBed.inject(MessageService);
    let actual: Message = {};

    spyOn(TestBed.inject(DeliveryLocalesRaguService), 'delete')
      .and.returnValue(throwError(() => new Error("any")));

    messageService.messageObserver.subscribe(message => actual = message as Message);

    component.onTrashButtonClick(0);

    expect(actual).toEqual(ERROR_MESSAGE);
  });

  it(`GIVEN trash button was clicked WHEN is removing 
      THEN load spinner should appear and disappear`, async () => {

    await fixture.whenStable();
    fixture.detectChanges();
    const trashButton = page.getTrashButtonByRowName(ITAGUA_IN_MEMORY_PATTERN);

    await userEvent.click(trashButton);
    fixture.detectChanges();

    expect(page.table.querySelector(SPINNER_CLASS))
      .withContext('table loading after trash button clicked').not.toBeNull();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.table.querySelector(SPINNER_CLASS))
      .withContext('table stop loading when delete operation finished').toBeNull();
  });
});
