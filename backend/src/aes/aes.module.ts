import { Module } from '@nestjs/common';
import { AesService } from './aes.service';
import { AesController } from './aes.controller';

@Module({
  controllers: [AesController],
  providers: [AesService],
})
export class AesModule {}
