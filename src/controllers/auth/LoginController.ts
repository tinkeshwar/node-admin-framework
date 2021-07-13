import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { UserInvalidCredentialError, UserNotActiveError, UserNotExistError } from '../../services/error';
import SignInService from '../../services/auth/SignInService';
import { User } from '../../models';
import { PasswordRecoveryService } from '../../services/auth';

interface IUser {
    id: number
}

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

    async forgot (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const { email } = request.payload as any;
            const user = await User.findOne({where:{email, status:true}});
            if(user){
                const recovery = await PasswordRecoveryService.requestRecovery({ email });
                return response.response({expires_at: recovery.expiresAt});
            }
            return Boom.notFound('Email address not found.');
        } catch (error) {
            return Boom.forbidden(error);
        }
    }

    async profile (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const authUser: any = request.auth.credentials.user;
            const user = await User.findOne({
                where:{id: authUser.id},
                include:['image']
            });
            request.auth.credentials.user = user;
            return response.response(request.auth.credentials);
        } catch (error) {
            return Boom.forbidden('UnAuthorized access.');
        }
    }
}
export default LoginController;