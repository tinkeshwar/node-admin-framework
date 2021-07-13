import * as Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import ImageService from '../../services/upload/ImageService';

class UploadController {

    async image (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const file = await ImageService.upload(request);
            return response.response(file);
        } catch (err) {
            return Boom.gatewayTimeout(err);
        }
    }
}

export default UploadController;