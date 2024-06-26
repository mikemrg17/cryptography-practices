import { Controller, Post, UseInterceptors, UploadedFiles, Res, HttpCode } from '@nestjs/common';
import { SignService } from './sign.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Post('sign')
  @UseInterceptors(FilesInterceptor('files'))
  sign(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() response: Response
  ){
   const buffer = this.signService.sign(files);
   const stream = Readable.from(buffer);
    response.writeHead(200, {
      'Content-Type': 'application/text',
      'Content-Length': buffer.length
    });
    stream.pipe(response);
  }

  @Post('verify')
  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files'))
  verify(@UploadedFiles() files: Array<Express.Multer.File>){
    return this.signService.verify(files);
  }
}
