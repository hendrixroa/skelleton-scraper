import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APPConfig } from '@/config/app.config';

//Repositories
import { UserRepository } from '@/repositories/user.repository';

// Services
import { ErrorService } from '@/services/error.service';
import { LogService } from '@/services/log.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserRepository]),
    HttpModule,
  ],
  providers: [
    ErrorService,
    LogService,
  ],
})
export class ScraperModule {}
