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

Given('a user has navigated to the homepage', async function () {
  // navigate to the app
  await page.goto(url);
  // locate the element in the webUI
  const locator = page.locator(homepageElement);
  // assert that it's visible
  expect(locator).toBeVisible();
});

When(
  'the user adds {string} to the todo list using the webUI',
  async function (item) {
    // fill the item that was input from the feature file , to the inputText field in the UI
    await page.fill(todoInput, item);
    // click the button
    await page.click(todoButton);
  }
);

Then('card {string} should be displayed on the webUI', async function (item) {
  // get text of the item that is visible in the UI
  const text = await page.innerText(todoItem);
  // assert that its name is similar to what we provided
  expect(text).toBe(item);
});
