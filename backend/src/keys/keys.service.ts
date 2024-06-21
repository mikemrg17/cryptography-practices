import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as NodeRSA from 'node-rsa';
import * as archiver from 'archiver';

@Injectable()
export class KeysService {

  generateKeys() {

    
    const key = new NodeRSA({ b: 2048 });

    // key.generateKeyPair();
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
    
    fs.writeFileSync('public.pem', publicKey);
    fs.writeFileSync('private.pem', privateKey);

    const paths = ['./public.pem', './private.pem']
    const outputFile = 'keys.zip';
    
    const inputSources = paths.map(path => ({
      readStream: fs.createReadStream(path),
      name: path.split('/').pop()     // getFile name
    }));
    const outputStream = fs.createWriteStream(outputFile);
  
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    archive.pipe(outputStream);
    inputSources.forEach(src => archive.append(src.readStream, { name: src.name }));
    archive.finalize();
  }

}
