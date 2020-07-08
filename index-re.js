const dotenv = require("dotenv");
dotenv.config();
const argv = require("minimist")(process.argv.slice(2));
const {
  target_url: CLI_TARGET_URL,
  number_of_participate: CLI_NUMBER_OF_PARTICIPATE,
} = argv;
const { TARGET_URL, NUMBER_OF_PARTICIPATE } = process.env;

async function testCase() {
  try {
    const chromeLauncher = require("chrome-launcher");
    const puppeteer = require("puppeteer");
    const request = require("request");
    const util = require("util");
    const opts = {
      logLevel: "info",
      output: "json",

      // disableStorageReset: true, // 로그인 정보 유지
      chromeFlags: [
        // "--headless",
        "--incognito",
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
        // --allow-file-access-from-files - Allows API access for file:// URLs
        // --use-file-for-fake-audio-capture=<filename> - Provide a file to use when capturing audio.
        // --use-file-for-fake-video-capture=<filename> - Provide a file to use when capturing video.
      ],
    };

    // Launch chrome using chrome-launcher
    const chrome = await chromeLauncher.launch(opts);
    opts.port = chrome.port;

    // Connect to it using puppeteer.connect().
    const resp = await util.promisify(request)(
      `http://localhost:${opts.port}/json/version`
    );
    const { webSocketDebuggerUrl } = JSON.parse(resp.body);
    const browser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl,
    });

    // init Puppeteer
    const page = (await browser.pages())[0];
    await page.setViewport({ width: 1200, height: 900 });
    await page.goto(CLI_TARGET_URL || TARGET_URL, {
      waitUntil: "networkidle2",
    });

    // login by Guest
    const submitBtn = await page.$("#dialog-wrap [type=submit]");
    submitBtn.click();

    // await page.waitForNavigation();
    // return true;
  } catch (e) {
    console.log("error : ", e);
  }
}

let itterCount = 0;

for (let i = 0; i < itterCount; i++) {
  console.log("itterCount : ", itterCount);
  testCase();
  itterCount++;
}
