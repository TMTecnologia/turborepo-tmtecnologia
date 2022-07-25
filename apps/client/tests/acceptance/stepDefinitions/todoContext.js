/* eslint-disable */
const { Given, When, Then } = require('@cucumber/cucumber');
// import expect for assertion
const { expect } = require('@playwright/test');

//launch url
const url = 'http://localhost:3000';

//define selectors
const homepageElement = '.borderTodo';
const todoInput = '.todo-input';
const todoButton = '.todo-button';
const todoItem = '.todo .todo-item ';

Given('um usuário tenha navegado para a página inicial', async function () {
  // navigate to the app
  await page.goto(url);
  // locate the element in the webUI
  const locator = page.locator(homepageElement);
  // assert that it's visible
  expect(locator).toBeVisible();
});

When(
  'o usuário adiciona {string} a lista de tarefas',
  async function (item) {
    // fill the item that was input from the feature file , to the inputText field in the UI
    await page.fill(todoInput, item);
    // click the button
    await page.click(todoButton);
  }
);

Then('o cartão {string} deveria ser mostrado', async function (item) {
  // get text of the item that is visible in the UI
  const text = await page.innerText(todoItem);
  // assert that its name is similar to what we provided
  expect(text).toBe(item);
});
