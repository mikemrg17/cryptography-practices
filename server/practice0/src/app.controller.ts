import { Controller, Get, Post, Body, UploadedFile, ParseFilePipe, FileTypeValidator, UseInterceptors, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { EncryptDecryptDto } from './dto/encrypt-decrypt.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/encrypt')
  @UseInterceptors(FileInterceptor('file'))
  async encrypt(
    @Body() encryptDecryptDto: EncryptDecryptDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'text/plain' })
        ]
      }),
    )
    file: Express.Multer.File,
    @Res() response: Response
  ) {
    response.contentType('text/plain');
    response.attachment(this.appService.addExtenstion(file.originalname, '_C'));

    const buffer = await this.appService.encryptFile(encryptDecryptDto, file);
    const stream = Readable.from(buffer);

    stream.pipe(response);
  }

  @Post('/decrypt')
  @UseInterceptors(FileInterceptor('file'))
  async decrypt(
    @Body() encryptDecryptDto: EncryptDecryptDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'text/plain' })
        ]
      }),
    )
    file: Express.Multer.File,
    @Res() response: Response
  ) {
    response.contentType('text/plain');
    response.attachment(this.appService.addExtenstion(file.originalname, '_D'));

    const buffer = await this.appService.decryptFile(encryptDecryptDto, file);
    const stream = Readable.from(buffer);

    stream.pipe(response);
  }
}
