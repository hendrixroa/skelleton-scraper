import { Scraper } from './scraper';

async function bootstrap() {
  const scraper = new Scraper();

  try {
    const data = await scraper.scrape();
    console.log(data);
  } catch (e) {
    console.error('error', e);
  }
}
bootstrap();