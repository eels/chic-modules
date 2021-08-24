import { ChicTarget } from '../../types';

export default function getComponentName(target: ChicTarget) {
  return (
    (<Exclude<ChicTarget<any>, string>>target).displayName || (<Function>target).name || 'Component'
  );
}
