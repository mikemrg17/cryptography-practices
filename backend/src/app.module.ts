import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AesModule } from './aes/aes.module';
import { KeysModule } from './keys/keys.module';
import { SignModule } from './sign/sign.module';
import { DhModule } from './dh/dh.module';

@Module({
  imports: [AesModule, KeysModule, SignModule, DhModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
