import { join } from 'path';

import { config } from '@root/support/config';
import { ICustomWorld } from '@root/support/custom-world';

interface ImagePathOptions {
  skipOs: boolean;
}

export function getImagePath(
  customWorld: ICustomWorld,
  name: string,
  options?: ImagePathOptions
): string {
  return join(
    'screenshots',
    customWorld.feature?.uri || '',
    options?.skipOs ? '' : process.platform,
    config.browser,
    `${name}.png`
  );
}
