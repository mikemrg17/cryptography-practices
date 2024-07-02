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

  encryptFileWithPassFile(files: Array<Express.Multer.File>){
    let password = '';
    let filecontent = '';
    let count = 0;
    let flag = false;

    for (const file of files) {
      if (file.mimetype === 'application/x-x509-ca-cert') {
        password = file.buffer.toString();
        count++;
        flag = true;
      } else{
        filecontent = file.buffer.toString();
        count++;
      }
    }

    if (count !== 2) {
      throw new Error('You must upload two files');
    }
    
    if (!flag) {
      throw new Error('You must upload a password file');
    }
    return CryptoJS.AES.encrypt(filecontent, password).toString();
  }

  decryptFileWithPassFile(files: Array<Express.Multer.File>){
    let password = '';
    let filecontent = '';
    let count = 0;
    let flag = false;

    for (const file of files) {
      if (file.mimetype === 'application/x-x509-ca-cert') {
        password = file.buffer.toString();
        count++;
        flag = true;
      } else{
        filecontent = file.buffer.toString();
        count++;
      }
    }

    if (count !== 2) {
      throw new Error('You must upload two files');
    }
    
    if (!flag) {
      throw new Error('You must upload a password file');
    }
    return CryptoJS.AES.decrypt(filecontent, password).toString(CryptoJS.enc.Utf8);
  }
}
