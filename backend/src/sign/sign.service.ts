import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as NodeRSA from 'node-rsa';

@Injectable()
export class SignService {

  sign(files: Array<Express.Multer.File>){
    if(!files){
      throw new BadRequestException('No files were uploaded');
    }

    if(files.length !== 2){
      throw new BadRequestException('You must upload two files');
    }
    
    let index = -1;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = file.buffer.toString();
      if(text.includes('-----BEGIN RSA PRIVATE KEY-----')){
        index = i;
        break;
      }
    }
    
    if(index === -1){
      throw new BadRequestException('No private key was found');
    }

    const key = new NodeRSA(files[index].buffer.toString());
    if (!key.isPrivate()) {
      throw new BadRequestException('Invalid private key');
    }
    
    let buffer = Buffer.from('');

    if(index === 0){
      buffer = files[1].buffer;
    } else {
      buffer = files[0].buffer;
    }

    const sign = key.sign(buffer, 'base64', 'utf8') + '\n' + buffer.toString();

    return Buffer.from(sign);
  }

  verify(files: Array<Express.Multer.File>){
    if(!files){
      throw new BadRequestException('No files were uploaded');
    }

    if(files.length !== 2){
      throw new BadRequestException('You must upload two files');
    }
    
    let index = -1;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = file.buffer.toString();
      if(text.includes('-----BEGIN PUBLIC KEY-----')){
        index = i;
        break;
      }
    }
    
    if(index === -1){
      throw new BadRequestException('No public key was found');
    }

    const key = new NodeRSA(files[index].buffer.toString());
    if (!key.isPublic()) {
      throw new BadRequestException('Invalid public key');
    }
  
    let text = '';
    let signature = '';

    if(index === 0){
      signature = files[1].buffer.toString().split('\n')[0];
      text = files[1].buffer.toString().replace(signature+'\n', '')
    }else{
      signature = files[0].buffer.toString().split('\n')[0];
      text = files[0].buffer.toString().replace(signature+'\n', '')
    }

    if (!key.verify(text, signature, 'utf8', 'base64')){
      throw new ForbiddenException('Invalid signature');
    }

    return 'Signature is valid';

  }

}
