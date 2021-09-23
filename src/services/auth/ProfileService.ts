import Hapi from '@hapi/hapi'
import { User } from '../../models'
import { UserInvalidCredentialError, UserNotExistError } from '../error'
import PasswordChangeEmailDeliveryJob from '../job/jobs/PasswordChangeEmailDeliveryJob'
import SidebarService from './SidebarService'

class ProfileService {
  public static async profile (request: Hapi.Request) {
    const user = request.auth.credentials.user as any
    const dbUser = await User.findOne({
      where: { id: user.id },
      include: ['image']
    })
    if (dbUser !== undefined && dbUser !== null) {
      request.auth.credentials.user = dbUser
    }
    const sidebar = await SidebarService.getUserSidebar(user.id)
    if (sidebar) {
      request.auth.credentials.sidebar = sidebar
    }
    if (request.auth.credentials.scope !== undefined) {
      delete request.auth.credentials.scope
    }
    return request.auth.credentials
  }

  public static async changePassword (request: Hapi.Request) {
    const { current_password: currentPassword, new_password: newPassword } = request.payload as any
    const user = request.auth.credentials.user as any
    const dbUser = await User.findOne({ where: { id: user.id } })
    if (!dbUser) {
      throw new UserNotExistError('Account Does Not Exist')
    }
    const isValid = await dbUser.authenticate(currentPassword)
    if (!isValid) {
      throw new UserInvalidCredentialError('Invalid Password')
    }
    await dbUser.update({ password: newPassword })
    await PasswordChangeEmailDeliveryJob.schedule(dbUser)
    return dbUser.toJSON()
  }
}

export default ProfileService
