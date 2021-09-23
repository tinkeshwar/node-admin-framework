import { expect } from 'chai'
import { server } from '../../../src/config/server'
import { Permission, Role, User } from '../../../src/models'
import faker from 'faker'

describe('[USER API INTEGRATION] User API tests', () => {
  const id = faker.datatype.number({min: 10, max: 100})
  const permissionId = faker.datatype.number({min: 500, max: 999})
  const userTestData = {
    firstname: faker.name.firstName(),
    middlename: null,
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    password: 'test'
  }

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
    await User.create({
      id: id,
      ...userTestData
    })
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
    await User.destroy({
      where: { id: id },
      force: true
    })
    await Role.destroy({
      where: { id: id },
      force: true
    })
    await Permission.destroy({
      where: { id: permissionId },
      force: true
    })
  })

  it('Returns a list of users should pass', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/user/users?page=1&records=10',
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      }
    })
    expect(res.statusCode).equal(200)
  })

  it('Returns a user by id should pass', async () => {
    const res = await server.inject({
      method: 'GET',
      url: `/api/user/users/${id}`,
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      }
    })
    expect(res.statusCode).equal(200)
  })

  it('Mark as active user should pass', async () => {
    const res = await server.inject({
      method: 'PATCH',
      url: `/api/user/users/${id}`,
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      }
    })
    expect(res.statusCode).equal(200)
  })

  it('Assign role to user should pass', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: `/api/user/users/${id}/role`,
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      },
      payload: {
        role: id
      }
    })
    expect(res.statusCode).equal(200)
  })

  it('Assign permission to user should pass', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: `/api/user/users/${id}/permission`,
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
