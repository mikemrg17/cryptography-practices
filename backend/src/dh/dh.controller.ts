import { Body, Controller, FileTypeValidator, ParseFilePipe, Post, Res, UploadedFile, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { DhService } from './dh.service';

import * as fs from 'fs';
import { Response } from 'express';
import { Readable } from 'stream';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('dh')
export class DhController {
  constructor(private readonly dhService: DhService) {}

  @Post('/generate-keys-with-pg')
  generateKeys(
    @Res() response: Response
  ) {
    const buffer = this.dhService.generateKeysWithPG();
    response.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Length': buffer.length
    });
    const stream = Readable.from(buffer);
    stream.pipe(response);
  }

  @Post('/generate-keys-from-pg')
  @UseInterceptors(FileInterceptor('file'))
  async encrypt(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response
  ) {
    const buffer = this.dhService.generateKeysFromPG(file);
    response.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Length': buffer.length
    });
    const stream = Readable.from(buffer);
    stream.pipe(response);
  }

  @Post('/generate-shared-secret')
  @UseInterceptors(FilesInterceptor('files'))
  generateSharedSecret(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() response: Response
  ) {
    const buffer =  this.dhService.generateSharedSecret(files);
    const stream = Readable.from(buffer);
    response.writeHead(200, {
      'Content-Type': 'application/text',
      'Content-Length': buffer.length
    });
    stream.pipe(response);
  }

}
