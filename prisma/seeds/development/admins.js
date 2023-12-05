import bcrypt from 'bcrypt'

const AdminsSeed = [
  {
    id: 1,
    name: 'Nikolay Shamayko',
    username: 'ns16',
    password: bcrypt.hashSync('123456', 12),
    email: 'nikolay.shamayko@gmail.com',
    created_at: new Date(),
    updated_at: new Date()
  }
]

export default AdminsSeed
