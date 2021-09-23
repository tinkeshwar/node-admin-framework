import { Role, RoleSidebar, User } from '../../models'
import PermissionService from './PermissionService'

class SidebarService {
  static async getUserSidebar (userId: number): Promise<any> {
    const scopes = await PermissionService.getUserRoles(userId)
    const user = await User.findOne({
      where: { id: userId },
      include: [{ model: Role, as: 'roles', include: [{ model: RoleSidebar, as: 'roleSidebar' }] }]
    })
    if (user?.roles) {
      return await Promise.all(user.roles.map(async (role:any) => {
        return (await Promise.all(role.roleSidebar.sidebar.map(async (item: any) => {
          return await this.buildItem(item, scopes)
        }))).filter((item: any) => item !== null)
      }))
    }
    return []
  }

  private static isInScope (scopes: string[], item: string) {
    if (scopes.length > 0 && (item !== undefined || item !== '')) {
      return scopes.includes(item)
    }
    return false
  }

  private static async buildItem (item: any, scopes: string[]) {
    if (!item) {
      return null
    }
    if ('_children' in item !== true && 'scope' in item !== true) {
      return item
    }
    if ('_children' in item !== true && 'scope' in item === true && this.isInScope(scopes, item.scope)) {
      return item
    }
    if ('_children' in item === true && 'scope' in item !== true && item._children.length === 1 && (typeof item._children[0] === 'string')) {
      return item
    }
    if ('_children' in item === true && item._children.length === 1 && (typeof item._children[0] === 'object')) {
      item._children[0] = await this.buildItem(item._children[0], scopes) || ''
      return item
    }
    if ('_children' in item === true && item._children.length > 1) {
      const subitem = (await Promise.all(item._children.map(async (i: any) => {
        return await this.buildItem(i, scopes)
      }))).filter((item: any) => item !== null)
      item._children = subitem
      return item
    }
    return null
  }
}

export default SidebarService
