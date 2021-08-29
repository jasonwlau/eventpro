const puppeteer = require("puppeteer");
const faker = require("faker");
const person = {
  email: faker.internet.email(),
  password: faker.random.word(),
};
const appUrlBase = "http://localhost:3000";
const routes = {
  public: {
    register: `${appUrlBase}/login2`,
    login: `${appUrlBase}/login2`,
  },
  private: {
    account: `${appUrlBase}/account`,
    search: `${appUrlBase}/components/innerPages/BlogIndexPage`,
    main: `${appUrlBase}/main`,
  },
};

let browser;
let page;

beforeAll(async () => {
  // launch browser
  browser = await puppeteer.launch({
    headless: false, // headless mode set to false so browser opens up with visual feedback
    slowMo: 250, // how slow actions should be
    devtools: true,
  });
  // creates a new page in the opened browser
  page = await browser.newPage();
});

describe("on search page", () => {
  test("title loads accurately", async () => {
    await page.goto(
      "http://localhost:3000/components/innerPages/BlogIndexPage",
      { waitUntil: "networkidle0" }
    );
    await page.waitForSelector(".Search");
    const html = await page.$eval(
      ".BlogIndex__HeadingRow-sc-11jbi6t-0",
      (e) => e.textContent
    );
    expect(html).toBe("Find Events and Users");
  }, 16000);
  /*

  test("search returns results container", async () => {
    try {
      await page.type(".SearchInput", "test");
      await page.click(".SearchSpan");
    } catch (err) {
      console.error(err);
      throw new Error("selection not found");
    }
    jest.setTimeout(1500);
    const results = await page.$eval("#results", (e) => e.textContent);
    expect(results).toBeTruthy();
  });
  */
});

// test("search hides results on clear", async () => {
//   await page.screenshot({
//     path: "/test/clear-search-test.png",
//   });
//   browser.close();
// });
// test('search works for blank input', async() => {
//
// });
// test('search filters work', async() => {
//
// });
// test('load more button works', async() => {
//
// });
// test('search returns accurate results', async() => {
//
// });
/*
describe("SignUp", () => {
  test("users can signup", async () => {
    await page.goto(routes.public.register);
    await page.waitForSelector(".logincontainer");

    await page.click("input[name=email]");
    await page.type("input[name=email]", "shehzaai@usc.edu");
    await page.click("input[name=password]");
    await page.type("input[name=password]", "Password");
    await page.click("button[type=login]");
    // await page.waitForSelector(".root");
    const results = await page.$eval(".root", (e) => e.textContent);
    expect(results).toBeTruthy();
  }, 1600000);
  test("users can login", async () => {
    await page.goto(routes.public.login);
    await page.waitForSelector(".logincontainer");

    await page.click("input[name=email]");
    await page.type("input[name=email]", "shehzaai@usc.edu");
    await page.click("input[name=password]");
    await page.type("input[name=password]", "Password");
    await page.click("button[type=login]");
    // await page.waitForSelector(".root");
    const results = await page.$eval(".root", (e) => e.textContent);
    expect(results).toBeTruthy();
  }, 1600000);
  test("users can signout", async () => {
    await page.goto(routes.private.main);
    await page.waitForSelector(".root");
    await page.click(".LogOut");
    // await page.waitForSelector(".loginPage");
    const results = await page.$eval(".loginPage", (e) => e.textContent);
    expect(results).toBeTruthy();
  }, 1600000);
});
describe("Unathorized view", () => {
  test("users that are not logged in are redirected to sign in page", async () => {
    await page.goto(routes.private.main);
    // await page.waitForSelector(".logincontainer");
    const results = await page.$eval(".logincontainer", (e) => e.textContent);
    expect(results).toBeTruthy();
  }, 9000000);
});
describe("Nav Tests", () => {
  test("does search event work", async () => {
    await page.goto(routes.public.login);
    await page.waitForSelector(".logincontainer");

    await page.click("input[name=email]");
    await page.type("input[name=email]", "shehzaai@usc.edu");
    await page.click("input[name=password]");
    await page.type("input[name=password]", "Password");
    await page.click("button[type=login]");
    await page.goto(routes.private.main);
    await page.click(".SearchEvents");
    // await page.waitForSelector(".BlogPage");
    const results = await page.$eval(".BlogPage", (e) => e.textContent);
    expect(results).toBeTruthy();
  }, 9000000);
  test("does search users work", async () => {
    await page.goto(routes.private.main);
    await page.click(".SearchEvents");
    // await page.waitForSelector(".group");
    const results = await page.$eval(".group", (e) => e.textContent);
    expect(results).toBeTruthy();
  }, 9000000);
  test("does profile work", async () => {
    await page.goto(routes.private.main);
    await page.click(".Profile");
    // await page.waitForSelector(".ProfilePage");
    const results = await page.$eval(".ProfilePage", (e) => e.textContent);
    expect(results).toBeTruthy();
  }, 9000000);
  test("does feed work", async () => {
    await page.goto(routes.private.main);
    await page.click(".Feed");
    // await page.waitForSelector(".ProfilePage");
    const results = await page.$eval(".ProfilePage", (e) => e.textContent);
    expect(results).toBeTruthy();
  }, 9000000);
  test("does main work", async () => {
    await page.goto(routes.private.main);
    await page.click(".Main");
    // await page.waitForSelector(".root");
    const results = await page.$eval(".root", (e) => e.textContent);
    expect(results).toBeTruthy();
  }, 9000000);
  test("does login page work", async () => {
    await page.goto(routes.private.main);
    await page.click(".Main");
    // await page.waitForSelector(".loginPage");
    const results = await page.$eval(".loginPage", (e) => e.textContent);
    expect(results).toBeTruthy();
  }, 9000000);
});
*/

afterAll(() => {
  browser.close();
});
