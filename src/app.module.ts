import { Module } from '@nestjs/common';
import { ProcessController } from './modules/process/process.controller';
import { ProcessService } from './modules/process/process.service';

@Module({
  imports: [],
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class AppModule {}
