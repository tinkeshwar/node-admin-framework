import * as Hapi from '@hapi/hapi';
import * as fs from 'fs';
import Busboy from 'busboy';
import path from 'path';
import os from 'os';

interface IImageUploadInterface {
    file: string,
    ext: string
}

class ImageService {

    public static async upload(request: Hapi.Request):Promise<IImageUploadInterface|Error>{
        return new Promise(async (resolve, reject) => {
            try {
                const uploadResponse: IImageUploadInterface = {
                    file: '',
                    ext:''
                }
                const busboy = new Busboy({ headers: request.raw.req.headers});
                busboy.on('file', async (fieldname, file, filename, encoding, mimetype)=> {
                    // file.on('data', function() {});
                    // file.on('end', function() {});
                    uploadResponse.file = path.join(os.tmpdir(), path.basename(fieldname));
                    uploadResponse.ext = path.extname(filename);
                    const fileStream = fs.createWriteStream(uploadResponse.file);
                    file.pipe(fileStream);
                });
                busboy.once('finish', async () => {
                    return resolve(uploadResponse);
                });
                request.raw.req.pipe(busboy);
            } catch (error) {
                return error;
            }
        });
    }
}

export default ImageService;