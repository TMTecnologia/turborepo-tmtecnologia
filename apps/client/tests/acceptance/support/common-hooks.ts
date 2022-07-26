import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { chromium, ChromiumBrowser } from '@playwright/test';

import { ICustomWorld } from './custom-world';

declare global {
  // eslint-disable-next-line no-var
  var browser: ChromiumBrowser;
}

setDefaultTimeout(60000);

// launch the browser
BeforeAll(async function () {
  global.browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
  });
});

// close the browser
AfterAll(async function () {
  await global.browser.close();
});

// Create a new browser context and page per scenario
Before(async function (this: ICustomWorld) {
  this.context = await global.browser.newContext();
  this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function (this: ICustomWorld) {
  await this.page?.close();
  await this.context?.close();
});
