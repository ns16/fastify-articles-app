import BaseCrudController from '../../lib/base_crud_controller.js'

class TagsController extends BaseCrudController {
  constructor() {
    super()
    this.model = 'tag'
    this.mustBeExists = []
    this.mustBeUnique = []
  }
}

export default TagsController
