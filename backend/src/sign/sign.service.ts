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

    let sign = '';

    if(index === 0){
      sign = key.sign(files[1].buffer).toString('base64');
      sign += '\n';
      sign += files[1].buffer.toString();
    }else{
      sign = key.sign(files[0].buffer).toString('base64');
      sign += '\n';
      sign += files[0].buffer.toString();
    }

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
      // if(text.includes('-----BEGIN PUBLIC KEY-----')){
      //   index = i;
      //   break;
      // }
      if(text.includes('-----BEGIN')){
        index = i;
        break;
      }
    }
    
    if(index === -1){
      throw new BadRequestException('No public key was found');
    }

    const key = new NodeRSA(files[index].buffer.toString());
    // if (!key.isPublic()) {
    //   throw new BadRequestException('Invalid public key');
    // }

    if(index === 0){
      const signature = files[1].buffer.toString().split('\n')[0];
      const text = files[1].buffer.toString().replace(signature+'\n', '')
      console.log(signature);
      console.log(text);
      return key.verify(text, signature, 'utf8', 'buffer');
    }else{
      const signature = files[0].buffer.toString().split('\n')[0];
      const text = files[1].buffer.toString().replace(signature+'\n', '')
      console.log(signature);
      console.log(text);
      return key.verify(text, signature, 'utf8', 'buffer');
    }
  }
  // create(createSignDto: CreateSignDto) {
  //   return 'This action adds a new sign';
  // }

  // findAll() {
  //   return `This action returns all sign`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} sign`;
  // }

  // update(id: number, updateSignDto: UpdateSignDto) {
  //   return `This action updates a #${id} sign`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} sign`;
  // }
}
