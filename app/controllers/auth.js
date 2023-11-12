import BaseAuthController from '../../lib/base_auth_controller.js'

class AuthController extends BaseAuthController {
  constructor() {
    super()
    this.model = 'admin'
    this.mustBeExists = []
    this.mustBeUnique = ['username', 'email']
  }
}

export default AuthController
