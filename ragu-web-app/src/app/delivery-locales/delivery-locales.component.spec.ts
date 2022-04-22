import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { fireEvent, screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { DeliveryLocalesComponent } from './delivery-locales.component';
import { DeliveryLocalesModule } from './delivery-locales.module';
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { RaguInMemoryDbService } from 'src/ragu-in-memory-db.service';

describe('DeliveryLocalesComponent', () => {
  let fixture: ComponentFixture<DeliveryLocalesComponent>;

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

  function replaceNbspByEmptySpace(value: string): ArrayLike<string> {
    return value.replace(/\u00A0/g, ' ');
  }

});
