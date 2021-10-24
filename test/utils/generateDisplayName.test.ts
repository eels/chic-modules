import generateDisplayName from '@src/utils/generateDisplayName';
import { createElement } from 'react';

jest.mock('../../src/utils/getComponentName', () => jest.fn(() => 'Component'));

describe('utils/generateDisplayName', () => {
  it('should generate the correct display name from a string argument', () => {
    expect(generateDisplayName('h1')).toBe('styled.h1');
  });

  it('should generate the correct display name from a non-string argument', () => {
    expect(generateDisplayName(() => createElement('h1'))).toBe('StyledComponent');
  });
});
