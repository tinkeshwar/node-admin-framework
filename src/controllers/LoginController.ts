import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { UserInvalidCredentialError, UserNotActiveError, UserNotExistError } from '../services/error';
import SignInService from '../services/auth/SignInService';


class LoginController{

    async login (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        const { email, password } = request.payload as any;
        try{
            const authUser = await SignInService.emailSignInProcess(email, password);
            return response.response(authUser);
        }catch(error){
            const err: Error = error;
            switch (err.constructor) {
                case UserNotExistError:
                    return Boom.notFound('User Not Found');
                case UserNotActiveError:
                    return Boom.forbidden('User Not Active');
                case UserInvalidCredentialError:
                    return Boom.unauthorized('Invalid Credentials');           
            }
            return Boom.unauthorized('Invalid Credentials');
        }
    }
}
export default LoginController;