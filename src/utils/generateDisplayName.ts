import getComponentName from './getComponentName';
import isType from './isType';
import { ChicTarget } from '../../types';

export default function generateDisplayName(target: ChicTarget) {
  return !isType(target, 'string')
    ? `Styled${getComponentName(target)}`
    : `styled.${(<string>target).toLowerCase()}`;
}
