import BaseCrudController from '../../lib/base_crud_controller.js'

class AdminsController extends BaseCrudController {
  constructor() {
    super()
    this.model = 'admin'
    this.mustBeExists = []
    this.mustBeUnique = ['username', 'email']
  }
}

export default AdminsController
