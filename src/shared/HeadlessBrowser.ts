import { EventEmitter } from 'events';
import * as Puppeteer from 'puppeteer';

import { APPConfig } from '@/config/app.config';

export class HeadlessBrowser extends EventEmitter {
  protected browser: Puppeteer.Browser;

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

  public async autoScroll(page: Puppeteer.Page) {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  public closeBrowser() {
    if (this.browser) {
      this.browser.close();
    }
  }

  private async initBrowser() {
    const browserArgs: any = {
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
      executablePath: APPConfig.chromiumPath,
    };
    this.browser = await Puppeteer.launch(browserArgs);
  }
}
