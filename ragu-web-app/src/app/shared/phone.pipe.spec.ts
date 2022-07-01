import { PhonePipe } from './phone.pipe';

describe('PhonePipe', () => {
  let phonePipe: PhonePipe;

  beforeEach(() => {
    phonePipe = new PhonePipe();
  });

  it('should transform to (12) 98625-4104 when 12986254104 is given', () => {
    const rawPhoneNumber = 12986254104;

    const actual = phonePipe.transform(rawPhoneNumber);

    expect(actual).toBe('(12) 98625-4104');
  });

  it('should throw Error when phone number length is != than 11', () => {
    const badNumber =  1235;

    const actual = () => phonePipe.transform(badNumber);

    expect(actual).toThrow(new Error('Phone pipe only support format phone number which has length of 11'));
  });

  it('should return (00) 00000-0000 when value is undefined', () => {
    const given = undefined;

    const actual = phonePipe.transform(given);
    const expected = "(00) 00000-0000";

    expect(actual).toBe(expected);
  });
});
