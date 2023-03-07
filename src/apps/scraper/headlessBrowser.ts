import { EventEmitter } from 'events';
import * as Puppeteer from 'puppeteer';
import { PuppeteerLaunchOptions } from "puppeteer";

export class HeadlessBrowser extends EventEmitter {
  // @ts-ignore
  protected browser: Puppeteer.Browser;

 /*
 * We are creating 1 only instance, to make sure do not open several windows
 * */
  public async getPage() {
    if (!this.browser) {
      await this.initBrowser();
    }
    const page = await this.browser.newPage();

    // Avoiding Bot detection
    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);

    page.on('console', msg => {
      this.emit('console', msg.text());
    });
    return page;
  }

  public closeBrowser() {
    if (this.browser) {
      this.browser.close();
    }
  }

  private async initBrowser() {
    const browserArgs: PuppeteerLaunchOptions = {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
      ],
    };
    this.browser = await Puppeteer.launch(browserArgs);
  }
}