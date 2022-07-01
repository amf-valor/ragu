import { Address } from '../models/address.model';
import { AddressPipe } from './address.pipe';

describe('AddressPipe', () => {
  let pipe: AddressPipe;

  beforeEach(() => {
    pipe = new AddressPipe();
  });

  it('should transform when address is given', () => {
    const given: Address = {
      street: "Rua zé",
      streetNumber: 596,
      city: "São Paulo",
      neighborhood: "tatuapé"
    };

    const actual = pipe.transform(given);
    const expected = "Rua zé, 596 TATUAPÉ - São Paulo";

    expect(actual).toBe(expected);
  });
});
