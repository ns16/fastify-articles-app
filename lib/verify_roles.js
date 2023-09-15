import createError from 'http-errors'

export default roles => (request, reply, done) => {
  if (!request.user || !roles.includes(request.user.role)) return done(new createError.Forbidden())
  done()
}
