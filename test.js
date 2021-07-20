import {writeFileSync} from 'fs';

const mockWriteFileSync = jest.fn();
jest.mock('fs', () => {

  // This shold work! But once it's compiled, it doesn't
  const {writeFileSync, ...rest} = jest.requireActual('fs');

  return {
    ...rest,
    writeFileSync: (...args) => {
      debugger;
      mockWriteFileSync(...args);
      return writeFileSync(...args);
    },
  };
});

describe('basic', () => {
  test('thing', () => {
    expect(1 + 1).toBe(2);

    writeFileSync('foo.txt', 'hello', 'utf8');
  });
});
