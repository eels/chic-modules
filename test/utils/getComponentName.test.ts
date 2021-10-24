import getComponentName from '@src/utils/getComponentName';
import { createElement } from 'react';

describe('utils/getComponentName', () => {
  it('should return the `displayName` property of a component', () => {
    const Heading = Object.assign(() => createElement('h1', {}), {
      displayName: 'HeadingWithDisplayName',
    });

    expect(getComponentName(Heading)).toBe('HeadingWithDisplayName');
  });

  it('should return the `name` property of a component', () => {
    const Heading = () => createElement('h1', {});

    expect(getComponentName(Heading)).toBe('Heading');
  });

  it('should return the default component name when none is set', () => {
    expect(getComponentName(() => createElement('h1'))).toBe('Component');
  });
});
