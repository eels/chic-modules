import getComponentName from '@src/utils/getComponentName';
import isType from '@src/utils/isType';
import type { ChicTarget } from '@types';

export default function generateDisplayName(target: ChicTarget) {
  return !isType(target, 'string')
    ? `Styled${getComponentName(target)}`
    : `styled.${(<string>target).toLowerCase()}`;
}
