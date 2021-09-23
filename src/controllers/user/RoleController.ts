import Boom from '@hapi/boom'
import Hapi from '@hapi/hapi'
import Role from '../../models/Role'
import MasterController from '../master/MasterController'
import connector from '../../config/database'
import { Permission } from '../../models'

class RoleController extends MasterController<typeof Role> {
  constructor () {
    super(Role)
  }

  async store (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const payload = await this.preStore(request)
      const exist = await this.isUnique(request)
      if (exist) {
        return Boom.conflict('Data already exist.')
      }
      const role = await Role.create(payload)
      return response.response((await role.reload()).toJSON())
    } catch (error: any) {
      return Boom.badData(error)
    }
  }

  async permissions (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const role = await connector.transaction(async (t) => {
        const { where, data } = await this.preUpdate(request)
        const updateable = await this.model.findOne({ where })
        if (!updateable) {
          return Boom.notFound('No role found.')
        }
        if (data.permissions.length === 0) {
          return Boom.notFound('No permission found.')
        }
        const allPermission = (await Permission.findAll()).map(permissions => permissions.id)
        await updateable.removePermissions(allPermission, { transaction: t })
        for (const permissionId of data.permissions) {
          const permission = await Permission.findByPk(permissionId)
          if (permission) {
            await updateable.addPermission(permission, { transaction: t })
          }
        }
        return (await updateable.reload()).toJSON()
      })
      return response.response(role)
    } catch (error: any) {
      return Boom.badData(error)
    }
  }

  async permission (request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const role = await connector.transaction(async (t) => {
        const { where, data } = await this.preUpdate(request)
        const updateable = await this.model.findOne({ where })
        const permission = await Permission.findByPk(data.permission)
        if (!permission) {
          return Boom.notFound('No such permission found.')
        }
        if (!updateable) {
          return Boom.notFound('No such role found.')
        }
        if (await updateable.hasPermission(permission)) {
          await updateable.removePermission(permission, { transaction: t })
        } else {
          await updateable.addPermission(permission, { transaction: t })
        }
        return (await updateable.reload()).toJSON()
      })
      return response.response(role)
    } catch (error: any) {
      return Boom.badData(error)
    }
  }
}

RoleController.options = {
  id: 'id',
  searchBy: ['id'],
  sortBy: ['created_at', 'desc'],
  uniqueBy: ['name', 'alias'],
  createWith: ['id', 'name', 'alias', 'description'],
  updateWith: ['name', 'alias', 'description', 'permissions', 'permission', 'status'],
  included: ['permissions']
}

export default RoleController
