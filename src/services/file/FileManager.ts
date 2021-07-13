import Boom from '@hapi/boom';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import * as fs from 'fs';
import { Dispatchable } from '../event';
import { IEventDispatcher } from '../event/ListenManager';
import { Image } from '../../models';



interface INewFile {
    name: string,
    filepath: string,
    public: string,
    ext: string
}

@Dispatchable
class FileManager {
    static fixpath: string = './upload';

    static async movefile(source: string, ext: string, type: 'image'|'file'): Promise<INewFile>{
        const name = `${uuidv4()}${ext}`;
        const filepath = path.join(this.fixpath, type);
        const destination = path.join(filepath,name);
        if (!fs.existsSync(filepath)){
            fs.mkdirSync(filepath,{recursive: true});
        }
        if(!fs.existsSync(source)){
            throw Boom.notFound('File upload failed');
        }
        fs.copyFileSync(source, destination)
        if(!fs.existsSync(destination)){
            throw Boom.notFound('File upload failed');
        }
        return {
            name,
            filepath,
            public:`static-images/${name}`,
            ext
        };
    }

    static async removeFile(name: string, type: 'image'|'file'): Promise<void>{
        const filepath = path.join(this.fixpath, type, name);
        if(!fs.existsSync(filepath)){
            throw Boom.notFound('File not found.');
        }
        return fs.rmSync(filepath);
    }

    public static subscribe(dispatcher: IEventDispatcher): void {
        dispatcher.on('IMAGE_UPLOADED', async (data: {
            imageId: string;
            existingImage?: string
        }) => {
            const { imageId: imageId,existingImage:existingImage } = data;
            const image = await Image.findByPk(imageId);
            image.update({status:1});
            if(existingImage !== null){
                this.removeFile(existingImage, 'image');
            }
        });
    }
}

export default FileManager;