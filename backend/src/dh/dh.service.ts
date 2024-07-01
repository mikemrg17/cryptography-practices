import { BadRequestException, Injectable } from '@nestjs/common';

const crypto = require('crypto');
const AdmZip = require('adm-zip');

@Injectable()
export class DhService {

generateKeysWithPG() {
  const dh = crypto.createDiffieHellman(2048);
  dh.generateKeys();
  const publicKey = dh.getPublicKey('hex');
  const privateKey = dh.getPrivateKey('hex');
  const prime = dh.getPrime('hex');
  const generator = dh.getGenerator('hex');

  const zip = new AdmZip();
  zip.addFile('public.pem', Buffer.from('PUBLIC' + '\n' + publicKey));
  zip.addFile('private.pem', Buffer.from('PRIVATE' + '\n' + privateKey));
  zip.addFile('pg.pem', Buffer.from('PG' + '\n' + prime + '\n' + generator));

  return zip.toBuffer(); 
}

generateKeysFromPG(file: Express.Multer.File) {

  const content = file.buffer.toString().split('\n');

  if (content.length !== 3) {
    throw new BadRequestException('Invalid file content');
  }

  if(content[0] !== 'PG') {
    throw new BadRequestException('Invalid file content');
  }

  const prime = content[1];
  const generator = content[2];

  const dh = crypto.createDiffieHellman(prime, 'hex', generator, 'hex');
  dh.generateKeys();
  const publicKey = dh.getPublicKey('hex');
  const privateKey = dh.getPrivateKey('hex');

  const zip = new AdmZip();
  zip.addFile('public.pem', Buffer.from('PUBLIC' + '\n' + publicKey));
  zip.addFile('private.pem', Buffer.from('PRIVATE' + '\n' + privateKey));

  return zip.toBuffer();

}

generateSharedSecret(files: Array<Express.Multer.File>) {

  if(!files){
    throw new BadRequestException('No files were uploaded');
  }

  if(files.length !== 3){
    throw new BadRequestException('You must upload three files');
  }
  
  let count = 0;
  let publicKey = '';
  let privateKey = '';
  let prime = '';
  let generator = '';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const text = file.buffer.toString();
    
    if(text.includes('PUBLIC') && text.split('\n').length === 2){
      count++;
      publicKey = text.split('\n')[1];
    } else if(text.includes('PRIVATE') && text.split('\n').length === 2){
      count++;
      privateKey = text.split('\n')[1];
    } else if(text.includes('PG') && text.split('\n').length === 3){
      count++;
      const content = text.split('\n');
      prime = content[1];
      generator = content[2];
    }

  }
    if(count !== 3){
      throw new BadRequestException('Invalid files');
    }

    const dh = crypto.createDiffieHellman(prime, 'hex', generator, 'hex');
    dh.setPrivateKey(privateKey, 'hex');
    const sharedSecret = dh.computeSecret(publicKey, 'hex', 'hex');
    return Buffer.from(sharedSecret);
  
}


}
