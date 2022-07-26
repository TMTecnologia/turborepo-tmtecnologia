import { Given, Then, When } from '@cucumber/cucumber';
// import expect for assertion
import { expect } from '@playwright/test';

import { ICustomWorld } from '../support/custom-world';

//launch url
const url = 'http://localhost:3000';

//define selectors
const homepageElement = '.borderTodo';
const todoInput = '.todo-input';
const todoButton = '.todo-button';
const todoItem = '.todo .todo-item ';

Given(
  'um usuário tenha navegado para a página inicial',
  async function (this: ICustomWorld) {
    const page = this.page!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

    // navigate to the app
    await page.goto(url);
    // locate the element in the webUI
    const locator = page.locator(homepageElement);
    // assert that it's visible
    expect(locator).toBeVisible();
  }
);

When(
  'o usuário adiciona {string} a lista de tarefas',
  async function (this: ICustomWorld, item) {
    const page = this.page!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

    // fill the item that was input from the feature file , to the inputText field in the UI
    await page.fill(todoInput, item);
    // click the button
    await page.click(todoButton);
  }
);

Then(
  'o cartão {string} deveria ser mostrado',
  async function (this: ICustomWorld, item) {
    const page = this.page!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

    // get text of the item that is visible in the UI
    const text = await page.innerText(todoItem);
    // assert that its name is similar to what we provided
    expect(text).toBe(item);
  }
);
