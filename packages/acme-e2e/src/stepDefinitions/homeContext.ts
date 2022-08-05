import { Given, Then } from '@cucumber/cucumber';
// import expect for assertion
import { expect } from '@playwright/test';

import { config } from '@root/support/config';
import { ICustomWorld } from '@root/support/custom-world';

//define selectors
const homepageElement = 'h1';

Given(
  'um usuário tenha navegado para a página inicial',
  async function (this: ICustomWorld) {
    const page = this.page!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

    // navigate to the app
    await page.goto(config.BASE_URL);
    // locate the element in the webUI
    const locator = page.locator(homepageElement);
    // assert that it's visible
    expect(locator).toBeVisible();
  }
);

Then(
  'o título da página deveria ser mostrado',
  async function (this: ICustomWorld) {
    const page = this.page!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

    // assert that its name is similar to what we provided
    await expect(page.locator('h1')).toContainText('Create T3 App');
  }
);
