import { HeadlessBrowser } from './headlessBrowser';

export class Scraper {
  protected name: string;
  protected baseURL: string;
  protected browser = new HeadlessBrowser();

  constructor() {
    this.name = 'Scraper';
    this.baseURL = 'https://github.com/trending';
  }

  public scrape = async () => {
    console.info('starting scraper...');
    const page = await this.browser.getPage();
    console.info( `Opening ${this.baseURL}...`);

    await page.goto(this.baseURL, {
      timeout: 300000,
      waitUntil: 'networkidle0',
    });

    const data = await page.evaluate(() => {

      const allNamesRepos = Array.from(
        document.querySelectorAll(
          '.Box-row h1.lh-condensed a',
        ),
      ).map((item: HTMLElement | any) => {
        return { name: item.innerText };
      });

      const regexMatchDigits = /\d+/g;

      const allStarsRepos = Array.from(
        document.querySelectorAll(
          '.Box-row .d-inline-block.float-sm-right',
        ),
      ).map((item: HTMLElement | any) => {
        const starDigits = item.innerText.match(regexMatchDigits);
        return { stars: Number(starDigits[0]) };
      });


      const data = allNamesRepos.map((repo: any, index: number) => {
        const obj = {
          name: repo.name,
          starsToday: allStarsRepos[index].stars,
        };
        return obj;
      });
      return data;
    });

    this.browser.closeBrowser();
    return data;
  };
}