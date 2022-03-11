import { sleep, dateToString } from './utils';

describe('sleep()', () => {
  it('should return a Promise that resolves after the number of milliseconds provided', async () => {
    const duration = 1000;
    const start = new Date().getTime();

    await sleep(duration);

    const end = new Date().getTime();

    expect(end).toBeGreaterThanOrEqual(start + duration);
  });
});

describe('dateToString()', () => {
  it('should convert a Date instance into the corresponding DD-MM-YYYY string', () => {
    const date = new Date('Mon Dec 12 2022');

    const result = dateToString(date);

    expect(result).toBe('12-12-2022');
  });

  it('should pad single digit month and day values', () => {
    const date = new Date('Mon Mar 7 2022');

    const result = dateToString(date);

    expect(result).toBe('07-03-2022');
  });
});
