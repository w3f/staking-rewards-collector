import { sleep } from './utils';

describe('sleep()', () => {
  it('should return a Promise that resolves after the number of milliseconds provided', async () => {
    const duration = 1000;
    const start = new Date().getTime();

    await sleep(duration);

    const end = new Date().getTime();

    expect(end).toBeGreaterThanOrEqual(start + duration);
  });
});
