import { Injectable } from '@nestjs/common';
import { CreateAeDto } from './dto/create-ae.dto';
import { UpdateAeDto } from './dto/update-ae.dto';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { Express } from 'express'

@Injectable()
export class AesService {
  algorithm: string = 'aes-256-ctr';
  iv = randomBytes(16);

  getHello(): string {
    return 'Hello World!';
  }

  async encryptFile(encryptDecryptDto: CreateAeDto, file: Express.Multer.File): Promise<Buffer> {
    const key = (await promisify(scrypt)(encryptDecryptDto.password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv(this.algorithm, key, this.iv);

    const textToEncrypt = file.buffer;
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);

    return encryptedText;

  }

  async decryptFile(encryptDecryptDto: CreateAeDto, file: Express.Multer.File): Promise<Buffer> {
    const key = (await promisify(scrypt)(encryptDecryptDto.password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv(this.algorithm, key, this.iv);

    const textToDechiper = file.buffer;
    const decryptedText = Buffer.concat([
      decipher.update(textToDechiper),
      decipher.final(),
    ]);
    

    return decryptedText;

  }

  addExtenstion(filename: string, extension: string): string {
    const filenameSplited = filename.split('.');
    return filenameSplited[0] + extension + '.' +filenameSplited[1];
  }
}
