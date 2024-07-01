import { Controller, Post, Res } from '@nestjs/common';
import { KeysService } from './keys.service';
import * as fs from 'fs';
import { Response } from 'express';
import { Readable } from 'stream';


@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  generateKeys(
    @Res() response: Response
  ) {
    this.keysService.generateKeys();

    const buffer = fs.readFileSync('keys.zip');
 
    const stream = Readable.from(buffer);
    response.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Length': buffer.length
    });
    stream.pipe(response);
    // fs.rmSync('keys.zip');
  }

}
