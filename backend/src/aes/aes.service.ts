import { Injectable } from '@nestjs/common';
import { Express } from 'express'
import * as CryptoJS from 'crypto-js';
import { CreateAeDto } from './dto/create-ae.dto';

@Injectable()
export class AesService {

  async encryptFile(encryptDecryptDto: CreateAeDto, file: Express.Multer.File): Promise<Buffer> {
    return CryptoJS.AES.encrypt(file.buffer.toString(), encryptDecryptDto.password).toString();
  }

  async decryptFile(encryptDecryptDto: CreateAeDto, file: Express.Multer.File): Promise<Buffer> {
    return CryptoJS.AES.decrypt(file.buffer.toString(), encryptDecryptDto.password).toString(CryptoJS.enc.Utf8);
  }

  addExtenstion(filename: string, extension: string): string {
    const filenameSplited = filename.split('.');
    return filenameSplited[0] + extension + '.' +filenameSplited[1];
  }
}
