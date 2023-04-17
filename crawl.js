const puppeteer = require("puppeteer");
const getPriceFromString = (priceS) => {
  if (!priceS) return 0;
  const number = Number(
    priceS.replaceAll(".", "").replaceAll(",", "").replace("đ", "")
  );
  return isNaN(number) ? 0 : number;
};

const getDataCommon = async (url, option) => {
  const browser = await puppeteer.launch({
    headless: true, //open browser
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  const viewPort = { width: 1280, height: 720 };
  const headers = {
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  };
  await page.setViewport(viewPort);
  await page.setExtraHTTPHeaders(headers);
  await page.exposeFunction("getSelector", () => option);
  await page.exposeFunction("getPriceFromString", getPriceFromString);
  const response = await page.goto(url);
  const selector = await page.waitForSelector(option.menuSelector);
  if (response.status() !== 200 || !selector) {
    await browser.close();

    return [];
  }
  // page.on("console", (message) => {
  //   console.log(message.text());
  // });

  const menus = await page.evaluate(async () => {
    const option = await window.getSelector();
    let menuItems = document.querySelectorAll(option.menuSelector);
    let menus = [];
    for (const item of menuItems) {
      const title$ = item.querySelector(option.itemTitleSelector);
      const price$ = item.querySelector(option.itemDiscountPriceSelector);
      const originPrice$ = item.querySelector(option.itemOriginPriceSelector);
      if (title$ && price$) {
        const title = title$?.textContent;
        let price = await window.getPriceFromString(price$?.textContent);
        if (!price && originPrice$) {
          price = await window.getPriceFromString(originPrice$?.textContent);
        }
        menus.push({
          title: title,
          price: isNaN(price) ? 0 : price,
        });
      }
    }

    return menus;
  });
  await browser.close();
  const menusDistinct = [
    ...new Map(menus.map((item) => [item["title"], item])).values(),
  ];
  return menusDistinct;
};
const getDataGrab = async (url) => {
  const menuSelector = '[class*="menuItem___"]';
  const itemTitleSelector = '[class*="itemNameTitle___"]';
  const itemDiscountPriceSelector = '[class*="discountedPrice___"]';
  const itemOriginPriceSelector = '[class*="originPrice___"]';
  const options = {
    menuSelector,
    itemTitleSelector,
    itemDiscountPriceSelector,
    itemOriginPriceSelector,
  };

  return await getDataCommon(url, options);
};

const getDataShopeeFood = async (url) => {
  const menuSelector = '[class*="item-restaurant-row"]';
  const itemTitleSelector = '[class*="item-restaurant-name"]';
  const itemDiscountPriceSelector = '[class*="current-price"]';
  const itemOriginPriceSelector = '[class*="old-price"]';
  const options = {
    menuSelector,
    itemTitleSelector,
    itemDiscountPriceSelector,
    itemOriginPriceSelector,
  };

  return await getDataCommon(url, options);
};

module.exports = { getDataGrab, getDataShopeeFood };
