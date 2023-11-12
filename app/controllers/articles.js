import BaseCrudController from '../../lib/base_crud_controller.js'

class ArticlesController extends BaseCrudController {
  constructor() {
    super()
    this.model = 'article'
    this.mustBeExists = [
      { model: 'user', modelName: 'User', field: 'user_id' }
    ]
    this.mustBeUnique = []
  }
}

export default ArticlesController
