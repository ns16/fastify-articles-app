import BaseCrudController from '../../lib/base_crud_controller.js'

class ContentsController extends BaseCrudController {
  constructor() {
    super()
    this.model = 'content'
    this.mustBeExists = [
      { model: 'article', modelName: 'Article', field: 'article_id' }
    ]
    this.mustBeUnique = ['article_id']
  }
}

export default ContentsController
