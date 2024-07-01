import { Injectable } from '@nestjs/common';
const AdmZip = require('adm-zip');
import * as NodeRSA from 'node-rsa';


@Injectable()
export class KeysService {

  generateKeys() {

    const key = new NodeRSA({ b: 2048 });

    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
    
    const zip = new AdmZip();
    zip.addFile('public.pem', Buffer.from(publicKey));
    zip.addFile('private.pem', Buffer.from(privateKey));

    return zip.toBuffer(); 
  }

}
