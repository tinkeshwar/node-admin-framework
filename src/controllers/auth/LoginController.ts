import Boom from '@hapi/boom'
import Hapi from '@hapi/hapi'
import { InvalidJWTError, InvalidTokenTypeError, UserInvalidCredentialError, UserNotActiveError, UserNotExistError } from '../../services/error'
import SignInService from '../../services/auth/SignInService'
import { User } from '../../models'
import { PasswordRecoveryService } from '../../services/auth'

class LoginController {
  async login (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    const { email, password } = request.payload as any
    try {
      const authUser = await SignInService.emailSignInProcess(email, password)
      return response.response(authUser)
    } catch (error: any) {
      const err: Error = error
      switch (err.constructor) {
        case UserNotExistError:
          return Boom.notFound('User Not Found')
        case UserNotActiveError:
          return Boom.forbidden('User Not Active')
        case UserInvalidCredentialError:
          return Boom.unauthorized('Invalid Credentials')
      }
      return Boom.unauthorized('Invalid Credentials')
    }
  }

  async refresh (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Hapi.ResponseObject> {
    const { refresh } = request.payload as any
    try {
      const authData = await SignInService.refresh(refresh)
      return response.response(authData)
    } catch (error: any) {
      const err: Error = error
      switch (err.constructor) {
        case InvalidJWTError:
        case UserNotExistError:
          throw Boom.unauthorized(err.message)
        case InvalidTokenTypeError:
          throw Boom.badRequest(err.message)
      }
      throw err
    }
  }

  async forgot (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { email } = request.payload as any
      const user = await User.findOne({ where: { email, status: true } })
      if (user) {
        const recovery = await PasswordRecoveryService.requestRecovery({ email })
        return response.response({ expires_at: recovery.expiresAt })
      }
      return Boom.notFound('Email address not found.')
    } catch (error: any) {
      return Boom.forbidden(error)
    }
  }

  async reset (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { recovery_token: recoveryToken, verfication_code: verficationCode, password } = request.payload as any
      const recovered = await PasswordRecoveryService.recover(recoveryToken, verficationCode, password)
      return response.response(recovered)
    } catch (error: any) {
      return Boom.forbidden(error)
    }
  }

  async logout (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const { authorization } = request.headers as any
      const user = await SignInService.logout(authorization)
      return response.response(user.toJSON())
    } catch (error: any) {
      const err: Error = error
      switch (err.constructor) {
        case InvalidJWTError:
          return Boom.conflict('User Already Logged Out.')
        case UserNotExistError:
          return Boom.notFound('User Not Found.')
        case InvalidTokenTypeError:
          return Boom.unauthorized('You have no access.')
      }
      throw err
    }
  }
}
export default LoginController
