import { Controller, Post, Body, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, Res } from '@nestjs/common';
import { AesService } from './aes.service';
import { CreateAeDto } from './dto/create-ae.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';


@Controller('aes')
export class AesController {
  constructor(private readonly aesService: AesService) {}

  @Post('/encrypt')
  @UseInterceptors(FileInterceptor('file'))
  async encrypt(
    @Body() encryptDecryptDto: CreateAeDto,
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
    response.attachment(this.aesService.addExtenstion(file.originalname, '_C'));

    const buffer = await this.aesService.encryptFile(encryptDecryptDto, file);
    const stream = Readable.from(buffer);

    stream.pipe(response);
  }

  @Post('/decrypt')
  @UseInterceptors(FileInterceptor('file'))
  async decrypt(
    @Body() encryptDecryptDto: CreateAeDto,
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
    response.attachment(this.aesService.addExtenstion(file.originalname, '_D'));

    const buffer = await this.aesService.decryptFile(encryptDecryptDto, file);
    const stream = Readable.from(buffer);

    stream.pipe(response);
  }
}
