import bcrypt from 'bcrypt'

const AdminsSeed = [
  {
    id: 1,
    name: 'Nikolay Shamayko',
    username: 'ns16',
    password: bcrypt.hashSync('123456', 12),
    email: 'nikolay.shamayko@gmail.com',
    created_at: '2023-07-01T00:00:00.000Z',
    updated_at: '2023-07-01T00:00:00.000Z'
  }
]

export default AdminsSeed
