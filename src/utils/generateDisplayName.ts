import isType from '@src/utils/isType';
import type { ChicTarget } from '@types';

export default function generateDisplayName(target: ChicTarget) {
  if (isType(target, 'string')) {
    return `styled.${target}`;
  }

  const componentDisplayName = (<Exclude<ChicTarget, string>>target).displayName;
  const componentName = (<Function>target).name;
  const componentStaticName = 'Component';

  return `Styled${componentDisplayName || componentName || componentStaticName}`;
}
