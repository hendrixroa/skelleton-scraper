import { INestApplicationContext } from '@nestjs/common';
import { HeadlessBrowser } from '@/shared/HeadlessBrowser';

import { LogService } from '@/services/log.service';

export class Scraper {
  private logService: LogService;
  protected provider: string;
  protected baseURL: string;
  protected recordsToScrape: number;
  protected browser = new HeadlessBrowser();

  constructor(app: INestApplicationContext) {
    this.provider = 'Scraper';
    this.baseURL = 'https://github.com/trending';
    this.logService = app.get(LogService);
  }

  public scrape = async () => {
    this.logService.info('starting scraper...');
    const page = await this.browser.getPage();
    this.logService.info( `Opening ${this.baseURL}...`);
    await page.goto(this.baseURL, {
      timeout: 300000,
      waitUntil: 'networkidle0',
    });

    const data = await page.evaluate(() => {
      const allNamesRepos = Array.from(
        document.querySelectorAll(
          '.Box-row h1.lh-condensed a',
        ),
      ).map((item: HTMLElement) => {
        return { name: item.innerText };
      });

      const allStarsRepos = Array.from(
        document.querySelectorAll(
          '.Box-row .muted-link.d-inline-block.mr-3',
        ),
      ).map((item: HTMLElement) => {
        return { stars: Number(item.innerText) };
      });

      let counter = 0;

      const data = allNamesRepos.map((repo: any) => {
        const obj = {
          name: repo.name,
          starsToday: allStarsRepos[counter],
          totalStars: allStarsRepos[counter + 1],
        };
        counter = counter + 2;
        return obj;
      });
      return data;
    });

    this.browser.closeBrowser();
    return data;
  };
}
