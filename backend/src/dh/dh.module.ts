import { Module } from '@nestjs/common';
import { DhService } from './dh.service';
import { DhController } from './dh.controller';

@Module({
  controllers: [DhController],
  providers: [DhService],
})
export class DhModule {}
