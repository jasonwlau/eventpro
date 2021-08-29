import BlogIndexPage from "pages/BlogIndex.js";

const puppeteer = require('puppeteer');

let browser
let page
beforeAll (async() => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    devtools: true,
  })
  page = await browser.newPage();
  try {
    await page.goto('http://localhost:3000/components/innerPages/BlogIndexPage', {waitUntil: 'networkidle0'})
    await page.waitForSelector('.Search');
  } catch (err) {
    console.error(err);
    throw new Error ('localhost timed out');
  }

  page.setViewport({ width: 500, height: 2400 })
})

describe('<BlogIndexPage />', () => {

  test('title loads accurately', async() => {
    const html = await page.$eval('.BlogIndex__HeadingRow-sc-11jbi6t-0', e => e.textContent);
    expect(html).toBe('Find Events and Users');
    });

  test('search returns results container', async() => {
    try {
      await page.type('.SearchInput', 'test');
      await page.click('.SearchSpan');
    } catch(err) {
      console.error(err);
      throw new Error ('selection not found');
    }
    //jest.setTimeout(1500);
    const results = await page.$eval('.results', e => e.textContent);
    expect(results).toBeTruthy();
  } );

  test('filter by event works', async() => {
    await page.click('#eButton');
    const results = await page.$eval('#eventsresults', e => e.textContent);
    expect(results).toBeTruthy();
    await page.click('#eButton');

  });
  test('filter by user works', async() => {
    await page.click('#uButton');
    const results = await page.$eval('#usersresults', e => e.textContent);
    expect(results).toBeTruthy();
  });
});('searching blank input works', async() => {
  try {
    await page.click('.SearchSpan');
  } catch(err) {
    console.error(err);
    throw new Error ('selection not found');
  }
  const results = await page.$eval('.results', e => e.textContent);
  expect(results).toBeTruthy();


});
  test('load more button works', async() => {
    await page.click('#load');
    browser.close();
});
