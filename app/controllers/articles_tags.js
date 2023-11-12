import BaseRelationController from '../../lib/base_relation_controller.js'

class ArticlesTagsController extends BaseRelationController {
  constructor() {
    super()
    this.main = { model: 'article', modelName: 'Article', field: 'article_id' }
    this.relation = { modelName: 'Tag', field: 'tag_id' }
    this.relationship = 'tags'
  }
}

export default ArticlesTagsController
