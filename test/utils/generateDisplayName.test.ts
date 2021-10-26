import generateDisplayName from '@src/utils/generateDisplayName';
import { createElement } from 'react';

describe('utils/generateDisplayName', () => {
  it('should generate the correct display name from a string argument', () => {
    expect(generateDisplayName('h1')).toBe('styled.h1');
  });

  it('should generate the correct display name from a non-string argument with display name', () => {
    const target = () => createElement('h1');

    Object.defineProperty(target, 'displayName', { value: 'Target' });

    expect(generateDisplayName(target)).toBe('StyledTarget');
  });

  it('should generate the correct display name from a non-string argument with name', () => {
    const target = () => createElement('h1');

    Object.defineProperty(target, 'name', { value: 'Target' });

    expect(generateDisplayName(target)).toBe('StyledTarget');
  });

  it('should generate the correct display name from a non-string with fallback', () => {
    expect(generateDisplayName(() => createElement('h1'))).toBe('StyledComponent');
  });
});
