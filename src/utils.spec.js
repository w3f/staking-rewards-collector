import { sleep, dateToString, makeDaysArray, initializeObject } from './utils';

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

describe('makeDaysArray()', () => {
  it('should return an inclusive range of date strings using the "start" and "end" dates provided', () => {
    const start = new Date('Mon Mar 7 2022');
    const end = new Date('Mon Mar 14 2022');

    const result = makeDaysArray(start, end);

    expect(result).toEqual([
      '07-03-2022',
      '08-03-2022',
      '09-03-2022',
      '10-03-2022',
      '11-03-2022',
      '12-03-2022',
      '13-03-2022',
      '14-03-2022',
    ]);
  });
});

describe('initializeObject()', () => {
  it('should enhance the data provided and return the result', () => {
    const days = ['07-03-2022', '07-04-2022'];
    const network = 'foo';
    const address = 'bar';
    const currency = 'baz';
    const startBalance = 0;
    const ticker = 'quux';
    const expected = {
      'address': 'bar',
      'annualizedReturn': 0,
      'currency': 'baz',
      'currentValueRewardsFiat': 0,
      'data': {
        'list': [
          {
            'amountHumanReadable': 0,
            'amountPlanks': 0,
            'blockNumber': '',
            'day': '07-03-2022',
            'extrinsicHash': '',
            'numberPayouts': 0,
            'price': 0,
            'valueFiat': 0,
            'volume': 0,
          },
          {
            'amountHumanReadable': 0,
            'amountPlanks': 0,
            'blockNumber': '',
            'day': '07-04-2022',
            'extrinsicHash': '',
            'numberPayouts': 0,
            'price': 0,
            'valueFiat': 0,
            'volume': 0,
          },
        ],
        'numberOfDays': 2,
        'numberRewardsParsed': 0,
      },
      'firstReward': '',
      'lastReward': '',
      'message': 'empty',
      'network': 'foo',
      'startBalance': 0,
      'ticker': 'quux',
      'totalAmountHumanReadable': 0,
      'totalValueFiat': 0,
    };

    const result = initializeObject(
      days,
      network,
      address,
      currency,
      startBalance,
      ticker,
    );

    expect(result).toEqual(expected);
  });
});
