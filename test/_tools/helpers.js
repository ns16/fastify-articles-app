import jwt from 'jsonwebtoken'

import prisma from '../../lib/prisma.js'

export const getAuthorization = async () => prisma.admin.findFirst({ where: { username: 'ns16' } }).then(admin => jwt.sign(admin, process.env.JWT_KEY))

export const createUser = async () => prisma.user.create({ data: {
  name: 'Rosalind Trantow',
  username: 'Rosalind4',
  password: 'Y9ECfszZ',
  email: 'Rosalind.Trantow35@gmail.com'
} })

export const deleteUser = async id => prisma.user.delete({ where: { id } })

export const createArticle = async () => prisma.article.create({ data: {
  user_id: 1,
  title: 'illum beatae soluta',
  description:
    'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
  status: 'published'
} })

export const deleteArticle = async id => prisma.article.delete({ where: { id } })

export const createContent = async () => createArticle().then(article => prisma.content.create({ data: {
  article_id: article.id,
  body:
    'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo.\n' +
    'Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque.\n' +
    'Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
} }))

export const deleteContent = async id => prisma.content.delete({ where: { id } })

export const createTag = async () => prisma.tag.create({ data: {
  name: 'beatae'
} })

export const deleteTag = async id => prisma.tag.delete({ where: { id } })

export const attachTagToArticle = async () => prisma.article.update({
  where: { id: 1 },
  data: { tags: { connect: { id: 1 } } }
})

export const createAdmin = async () => prisma.admin.create({ data: {
  name: 'Anatoly Muravyov',
  username: 'test',
  password: 'RDnB7LAR',
  email: 'anatoly.muravyov@gmail.com'
} })

export const deleteAdmin = async id => prisma.admin.delete({ where: { id } })
