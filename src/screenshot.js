const { Parcel } = require("@parcel/core");
const { chromium } = require("playwright");

const bundleAndServe = () => {
  let bundler = new Parcel({
    entries: "index.html",
    defaultConfig: "@parcel/config-default",
    serveOptions: {
      port: 1234,
    },
  });

  return bundler.watch();
};

const takeBrowserScreenshot = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1100, height: 700 });
  await page.goto("http://localhost:1234");

  const ready = page.locator("#ready");
  await ready.waitFor();

  await page.screenshot({ path: "map.png" });
  await browser.close();
};

(async () => {
  try {
    await bundleAndServe();
    await takeBrowserScreenshot();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
