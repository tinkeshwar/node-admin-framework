import { User } from "../../models";
import { UserInvalidCredentialError, UserNotActiveError, UserNotExistError } from "../error";
import AuthService from "./AuthService";

class SignInService{

    public static async emailSignInProcess(email: string, password: string){

        const user = await User.findOne({where:{email}});
        if(!user){
            throw new UserNotExistError('User Does Not Exist');
        }

        if(!user.status){
            throw new UserNotActiveError('User Not Active');
        }

        const isValid = await user.authenticate(password);
        if(!isValid){
            throw new UserInvalidCredentialError('Invalid Credentials');
        }

        return AuthService.authorize(user);
    }
}

export default SignInService;