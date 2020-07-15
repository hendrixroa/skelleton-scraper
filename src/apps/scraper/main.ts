import { NestFactory } from '@nestjs/core';

import { ScraperModule } from './scraper.module';
import { LogService } from '@/services/log.service';
import { APPConfig } from '@/config/app.config';
import { Scraper } from './scraper';

async function bootstrap() {
  const app = await NestFactory.create(ScraperModule);

  const logService = app.get(LogService);
  const scraper = new Scraper(app);

  try {
    const data = await scraper.scrape();
    logService.info('DATA', data);
  } catch (e) {
    logService.error('error', e);
  } finally {
    await app.close();
  }
}
bootstrap();
