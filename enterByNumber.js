const chromeLauncher = require("chrome-launcher");
const puppeteer = require("puppeteer");
const request = require("request");
const util = require("util");
const dotenv = require("dotenv");
dotenv.config();
const argv = require("minimist")(process.argv.slice(2));
const {
  target_url: CLI_TARGET_URL,
  number_of_participate: CLI_NUMBER_OF_PARTICIPATE,
} = argv;
const { TARGET_URL, NUMBER_OF_PARTICIPATE } = process.env;

function* loop(number) {
  for (let i = 0; i < number; i++) {
    yield i;
  }
}

(async () => {
  for (i of loop(parseInt(NUMBER_OF_PARTICIPATE))) {
    console.log("------" + i + "------");
    try {
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

      // // init Puppeteer
      const page = (await browser.pages())[0];

      await page.setViewport({ width: 1200, height: 900 });
      await page.setDefaultTimeout(999999);

      await page.goto("https://st.remotemeeting.com/ko/home", {
        waitUntil: "networkidle2",
      });
      // await page.screenshot({ path: "goto.png" });
      console.log("goto--end");
      // login by Guest
      const guestEntryBtn = await page.$(
        ".go-room-form-box-inner form [type=submit]"
      );
      await guestEntryBtn.click();
      await page.type("input[name=accessCode]", "123 142829", { delay: 100 });
      await guestEntryBtn.click();

      await page.waitForSelector("#create-nickname-wrap input#nickname");
      await page.type("#create-nickname-wrap input#nickname", `bot-${i}`, {
        delay: 100,
      });
      const guestNameBtn = await page.$(
        "#create-nickname-wrap button[type=submit]"
      );
      await guestNameBtn.click();
      console.log("submit--end");
    } catch (e) {
      console.log("error : ", e);
      // browser.close();
    }
  }
})();
