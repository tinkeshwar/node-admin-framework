import { expect } from 'chai'
import { server } from '../../../src/config/server'
import { Permission } from '../../../src/models'
import faker from 'faker'

describe('[USER API INTEGRATION] Permission API tests', () => {
  const id = faker.datatype.number({min: 500, max: 999})

  const permissionTestData = {
    name: faker.vehicle.model(),
    level: 'low'
  }
  
  before(async () => {
    await Permission.create({
      id: id,
      ...permissionTestData
    })
  })

  after(async () => {
    await Permission.destroy({
      where: { id: id },
      force: true
    })
  })

  it('Returns a list of permissions should pass', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/user/permissions?page=1&records=10',
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      }
    })
    expect(res.statusCode).equal(200)
  })

  it('Returns a permission by id should pass', async () => {
    const res = await server.inject({
      method: 'GET',
      url: `/api/user/permissions/${id}`,
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      }
    })
    expect(res.statusCode).equal(200)
  })

  it('Mark as active permission should pass', async () => {
    const res = await server.inject({
      method: 'PATCH',
      url: `/api/user/permissions/${id}`,
      headers: {
        authorization: `Bearer ${(global as any).adminToken}`
      }
    })
    expect(res.statusCode).equal(200)
  })
})
