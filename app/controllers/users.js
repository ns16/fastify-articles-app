import BaseCrudController from '../../lib/base_crud_controller.js'

class UsersController extends BaseCrudController {
  constructor() {
    super()
    this.model = 'user'
    this.mustBeExists = []
    this.mustBeUnique = ['username', 'email']
  }
}

export default UsersController
