import { Then } from '@cucumber/cucumber';

import { ICustomWorld } from '@root/support/custom-world';
import { getImagePath } from '@root/utils/imageHelpers';

Then(
  'faz uma captura de tela {string}',
  async function (this: ICustomWorld, name: string) {
    const { page } = this;
    await page?.screenshot({ path: getImagePath(this, name) });
  }
);

Then('faz uma captura de tela', async function (this: ICustomWorld) {
  const { page } = this;
  const image = await page?.screenshot();
  image && (await this.attach(image, 'image/png'));
});

Then('debug', async function () {
  // eslint-disable-next-line no-debugger
  debugger;
});
