import { expect } from 'chai'
import { server } from '../../../src/config/server'
import { Permission, Role } from '../../../src/models'
import faker from 'faker'

describe('[USER API INTEGRATION] Role API tests', () => {
  const id = faker.datatype.number({min: 10, max: 100})
  const permissionId = faker.datatype.number({min: 500, max: 999})

  const roleTestData = {
    name: faker.vehicle.manufacturer(),
    alias: faker.vehicle.type(),
    description: faker.vehicle.vin()
  }

  const permissionTestData = {
    name: faker.vehicle.model(),
    level: 'low'
  }
  
  before(async () => {
    await Role.create({
      id: id,
      ...roleTestData
    })
    await Permission.create({
      id: permissionId,
      ...permissionTestData
    })
  })

  after(async () => {
    await Role.destroy({
      where: { id: id },
      force: true
    })
    await Permission.destroy({
      where: { id: permissionId },
      force: true
    })
  })

  it('Returns a list of roles should pass', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/user/roles?page=1&records=10',
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      }
    })
    expect(res.statusCode).equal(200)
  })

  it('Returns a role by id should pass', async () => {
    const res = await server.inject({
      method: 'GET',
      url: `/api/user/roles/${id}`,
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      }
    })
    expect(res.statusCode).equal(200)
  })

  it('Mark as active role should pass', async () => {
    const res = await server.inject({
      method: 'PATCH',
      url: `/api/user/roles/${id}`,
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      }
    })
    expect(res.statusCode).equal(200)
  })

  it('Assign permission to role should pass', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: `/api/user/roles/${id}/permission`,
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      },
      payload: {
        permission: permissionId
      }
    })
    expect(res.statusCode).equal(200)
  })
})
