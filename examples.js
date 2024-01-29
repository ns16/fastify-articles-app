export const filtersExamples = [
  {},
  { 'filters[id__eq]': 1 }
]

export const bodyExamples = {
  '/api/v1/auth/login': {
    post: [{
      username: 'ns16',
      password: '123456'
    }]
  },
  '/api/v1/users': {
    post: [{
      name: 'Rosalind Trantow',
      username: 'Rosalind4',
      password: 'Y9ECfszZ',
      email: 'Rosalind.Trantow35@gmail.com'
    }]
  },
  '/api/v1/users/{id}': {
    put: [{
      name: 'Rosalind Trantow',
      username: 'Rosalind5',
      email: 'Rosalind.Trantow35@gmail.com'
    }]
  },
  '/api/v1/articles': {
    post: [{
      userId: 1,
      title: 'illum beatae soluta',
      description: 'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
      status: 'published'
    }]
  },
  '/api/v1/articles/{id}': {
    put: [{
      userId: 1,
      title: 'illum beatae cumque',
      description: 'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
      status: 'published'
    }]
  },
  '/api/v1/contents': {
    post: [{
      articleId: 21,
      body: 'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo. Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque. Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
    }]
  },
  '/api/v1/contents/{id}': {
    put: [{
      articleId: 21,
      body: 'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo. Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque. Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.'
    }]
  },
  '/api/v1/tags': {
    post: [{
      name: 'beatae'
    }]
  },
  '/api/v1/tags/{id}': {
    put: [{
      name: 'labore'
    }]
  },
  '/api/v1/articles-tags': {
    post: [{
      articleId: 1,
      tagId: 1
    }],
    delete: [{
      articleId: 1,
      tagId: 1
    }]
  },
  '/api/v1/admins': {
    post: [{
      name: 'Anatoly Muravyov',
      username: 'test',
      password: 'RDnB7LAR',
      email: 'anatoly.muravyov@gmail.com'
    }]
  },
  '/api/v1/admins/{id}': {
    put: [{
      name: 'Anatoly Muravyov',
      username: 'pest',
      email: 'anatoly.muravyov@gmail.com'
    }]
  }
}

export const responseExamples = {
  '/api/v1/auth/login': {
    post: {
      200: [{
        data: {
          id: 1,
          name: 'Nikolay Shamayko',
          username: 'ns16',
          email: 'nikolay.shamayko@gmail.com',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'username\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid username or password'
      }]
    }
  },
  '/api/v1/auth/me': {
    get: {
      200: [{
        data: {
          id: 1,
          name: 'Nikolay Shamayko',
          username: 'ns16',
          email: 'nikolay.shamayko@gmail.com',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/users': {
    get: {
      200: [{
        data: [
          {
            id: 1,
            name: 'Sheldon Bahringer',
            username: 'Sheldon52',
            email: 'Sheldon_Bahringer6@yahoo.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 2,
            name: 'Harmony Sawayn',
            username: 'Harmony_Sawayn36',
            email: 'Harmony.Sawayn12@gmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 3,
            name: 'Hollie Hintz',
            username: 'Hollie_Hintz',
            email: 'Hollie_Hintz49@hotmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 4,
            name: 'Celestine Rolfson',
            username: 'Celestine_Rolfson',
            email: 'Celestine_Rolfson49@hotmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 5,
            name: 'Elmore O\'Kon II',
            username: 'Elmore77',
            email: 'Elmore.OKon4@yahoo.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 6,
            name: 'Hester Schowalter',
            username: 'Hester_Schowalter67',
            email: 'Hester1@yahoo.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 7,
            name: 'Alysha Rath',
            username: 'Alysha.Rath',
            email: 'Alysha94@gmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 8,
            name: 'Rita Cremin',
            username: 'Rita_Cremin64',
            email: 'Rita47@yahoo.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 9,
            name: 'Albina Kuphal-Zieme',
            username: 'Albina_Kuphal-Zieme',
            email: 'Albina_Kuphal-Zieme@hotmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 10,
            name: 'Kevin Keeling',
            username: 'Kevin12',
            email: 'Kevin3@hotmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          }
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          rowCount: 10,
          pageCount: 1
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring/page must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    },
    post: {
      201: [{
        data: {
          id: 11,
          name: 'Rosalind Trantow',
          username: 'Rosalind4',
          email: 'Rosalind.Trantow35@gmail.com',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'name\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/users/all': {
    get: {
      200: [{
        data: [
          {
            id: 1,
            name: 'Sheldon Bahringer',
            username: 'Sheldon52',
            email: 'Sheldon_Bahringer6@yahoo.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 2,
            name: 'Harmony Sawayn',
            username: 'Harmony_Sawayn36',
            email: 'Harmony.Sawayn12@gmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 3,
            name: 'Hollie Hintz',
            username: 'Hollie_Hintz',
            email: 'Hollie_Hintz49@hotmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 4,
            name: 'Celestine Rolfson',
            username: 'Celestine_Rolfson',
            email: 'Celestine_Rolfson49@hotmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 5,
            name: 'Elmore O\'Kon II',
            username: 'Elmore77',
            email: 'Elmore.OKon4@yahoo.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 6,
            name: 'Hester Schowalter',
            username: 'Hester_Schowalter67',
            email: 'Hester1@yahoo.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 7,
            name: 'Alysha Rath',
            username: 'Alysha.Rath',
            email: 'Alysha94@gmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 8,
            name: 'Rita Cremin',
            username: 'Rita_Cremin64',
            email: 'Rita47@yahoo.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 9,
            name: 'Albina Kuphal-Zieme',
            username: 'Albina_Kuphal-Zieme',
            email: 'Albina_Kuphal-Zieme@hotmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 10,
            name: 'Kevin Keeling',
            username: 'Kevin12',
            email: 'Kevin3@hotmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          }
        ]
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring/sort must be equal to one of the allowed values'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/users/{id}': {
    get: {
      200: [{
        data: {
          id: 11,
          name: 'Rosalind Trantow',
          username: 'Rosalind4',
          email: 'Rosalind.Trantow35@gmail.com',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    },
    put: {
      200: [{
        data: {
          id: 11,
          name: 'Rosalind Trantow',
          username: 'Rosalind5',
          email: 'Rosalind.Trantow35@gmail.com',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'name\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    },
    delete: {
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    }
  },
  '/api/v1/articles': {
    get: {
      200: [{
        data: [
          {
            id: 1,
            userId: 1,
            title: 'sint repellendus inventore',
            description: 'Debitis assumenda molestiae facilis odio facilis. Aliquid odit reiciendis ut rerum reiciendis. Laborum numquam explicabo non.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 2,
            userId: 1,
            title: 'deserunt tempore sit',
            description: 'Dicta mollitia dolorem dolorum doloremque beatae. Ut eum itaque ut. Repellat magni perspiciatis suscipit ab.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 3,
            userId: 2,
            title: 'et accusantium accusantium',
            description: 'Dolores perspiciatis dolorum. Corrupti ullam accusamus nesciunt soluta itaque consectetur corporis earum. In amet veritatis dignissimos laudantium ipsum repellat consectetur accusamus officiis.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 4,
            userId: 2,
            title: 'omnis id nam',
            description: 'Totam pariatur qui culpa earum nam aperiam aperiam molestiae officiis. Libero culpa suscipit consectetur magnam porro. Molestiae doloremque ratione dolores rerum commodi optio non.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 5,
            userId: 3,
            title: 'in fuga occaecati',
            description: 'Tenetur doloremque explicabo voluptatem facilis expedita recusandae. Vitae perspiciatis earum quisquam alias ad itaque tempore possimus. Perferendis mollitia nobis eos libero quos perferendis doloremque enim.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 6,
            userId: 3,
            title: 'porro maiores non',
            description: 'Porro reiciendis quidem recusandae sint officia aut maxime accusantium. Temporibus repellat error repellat soluta. Veniam beatae minima natus aspernatur ut deleniti laudantium.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 7,
            userId: 4,
            title: 'fugiat sed sequi',
            description: 'Error aperiam culpa quae occaecati expedita modi eum. Mollitia mollitia et quo. Autem nulla excepturi suscipit culpa odio.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 8,
            userId: 4,
            title: 'nemo libero porro',
            description: 'Sint ab magnam eos perferendis. Quod nesciunt in voluptatum numquam quasi optio. Tempora doloremque quasi mollitia doloremque dolor officiis aliquid molestiae.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 9,
            userId: 5,
            title: 'soluta placeat mollitia',
            description: 'Voluptate distinctio natus. Eligendi dolores quae illum deserunt nostrum eveniet dicta. Voluptates sunt nisi incidunt ducimus eligendi.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 10,
            userId: 5,
            title: 'repudiandae magnam ex',
            description: 'Iste a laboriosam suscipit architecto corrupti placeat a. Eos voluptatem quod corporis. Corporis iste vel.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          }
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring/page must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    },
    post: {
      201: [{
        data: {
          id: 21,
          userId: 1,
          title: 'illum beatae soluta',
          description: 'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
          status: 'published',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'title\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/articles/all': {
    get: {
      200: [{
        data: [
          {
            id: 1,
            userId: 1,
            title: 'sint repellendus inventore',
            description: 'Debitis assumenda molestiae facilis odio facilis. Aliquid odit reiciendis ut rerum reiciendis. Laborum numquam explicabo non.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 2,
            userId: 1,
            title: 'deserunt tempore sit',
            description: 'Dicta mollitia dolorem dolorum doloremque beatae. Ut eum itaque ut. Repellat magni perspiciatis suscipit ab.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 3,
            userId: 2,
            title: 'et accusantium accusantium',
            description: 'Dolores perspiciatis dolorum. Corrupti ullam accusamus nesciunt soluta itaque consectetur corporis earum. In amet veritatis dignissimos laudantium ipsum repellat consectetur accusamus officiis.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 4,
            userId: 2,
            title: 'omnis id nam',
            description: 'Totam pariatur qui culpa earum nam aperiam aperiam molestiae officiis. Libero culpa suscipit consectetur magnam porro. Molestiae doloremque ratione dolores rerum commodi optio non.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 5,
            userId: 3,
            title: 'in fuga occaecati',
            description: 'Tenetur doloremque explicabo voluptatem facilis expedita recusandae. Vitae perspiciatis earum quisquam alias ad itaque tempore possimus. Perferendis mollitia nobis eos libero quos perferendis doloremque enim.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 6,
            userId: 3,
            title: 'porro maiores non',
            description: 'Porro reiciendis quidem recusandae sint officia aut maxime accusantium. Temporibus repellat error repellat soluta. Veniam beatae minima natus aspernatur ut deleniti laudantium.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 7,
            userId: 4,
            title: 'fugiat sed sequi',
            description: 'Error aperiam culpa quae occaecati expedita modi eum. Mollitia mollitia et quo. Autem nulla excepturi suscipit culpa odio.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 8,
            userId: 4,
            title: 'nemo libero porro',
            description: 'Sint ab magnam eos perferendis. Quod nesciunt in voluptatum numquam quasi optio. Tempora doloremque quasi mollitia doloremque dolor officiis aliquid molestiae.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 9,
            userId: 5,
            title: 'soluta placeat mollitia',
            description: 'Voluptate distinctio natus. Eligendi dolores quae illum deserunt nostrum eveniet dicta. Voluptates sunt nisi incidunt ducimus eligendi.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 10,
            userId: 5,
            title: 'repudiandae magnam ex',
            description: 'Iste a laboriosam suscipit architecto corrupti placeat a. Eos voluptatem quod corporis. Corporis iste vel.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 11,
            userId: 6,
            title: 'facere ea odit',
            description: 'Enim modi hic labore voluptate tempore recusandae minus. Quibusdam quod quo eaque commodi beatae harum adipisci reiciendis saepe. Soluta nulla delectus impedit non beatae soluta reprehenderit eum.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 12,
            userId: 6,
            title: 'commodi quod quis',
            description: 'Quia voluptate vero quidem esse eveniet. Sunt et quas molestias nemo minus. Assumenda doloremque neque earum vitae.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 13,
            userId: 7,
            title: 'ea libero minus',
            description: 'Dicta facere sequi deserunt totam eum debitis ducimus ut. Hic est nihil in id quibusdam doloribus. Doloribus reiciendis unde minus ut.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 14,
            userId: 7,
            title: 'asperiores numquam labore',
            description: 'Possimus quos explicabo nisi sit dolorem ipsa animi. Esse aut mollitia modi quidem. Nemo maxime alias quibusdam esse facere.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 15,
            userId: 8,
            title: 'adipisci ducimus occaecati',
            description: 'Officiis sed eaque. Eius dolor incidunt. Reprehenderit optio dolores earum consectetur similique quaerat.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 16,
            userId: 8,
            title: 'magnam voluptate expedita',
            description: 'Voluptate culpa quidem suscipit a odio eius eligendi. Asperiores ipsa magnam quos. Quidem delectus ipsa maxime modi beatae assumenda voluptatum beatae.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 17,
            userId: 9,
            title: 'earum neque at',
            description: 'Provident cum nobis qui accusantium voluptatibus fuga porro. Architecto repellendus numquam. Error quo nostrum explicabo et consequuntur quis.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 18,
            userId: 9,
            title: 'voluptatum necessitatibus totam',
            description: 'Fugiat distinctio incidunt illo corporis dolores. Doloremque totam id consequuntur magni non. Deserunt amet laboriosam.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 19,
            userId: 10,
            title: 'fugit debitis ut',
            description: 'Eos accusamus repellendus est culpa iste dolor. Velit porro laborum excepturi. Officiis nisi minima.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 20,
            userId: 10,
            title: 'saepe cupiditate exercitationem',
            description: 'Omnis dignissimos eius voluptatum tenetur alias quibusdam. Aliquid ex ea quos dolore sunt error veritatis. Vitae esse dolor modi voluptates minima laudantium nihil beatae esse.',
            status: 'published',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          }
        ]
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring/sort must be equal to one of the allowed values'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/articles/{id}': {
    get: {
      200: [{
        data: {
          id: 21,
          userId: 1,
          title: 'illum beatae soluta',
          description: 'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
          status: 'published',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    },
    put: {
      200: [{
        data: {
          id: 21,
          userId: 1,
          title: 'illum beatae cumque',
          description: 'Vero nihil eius quidem. Quaerat ipsum rem animi fugit pariatur deleniti. Neque unde ad quam illo facere.',
          status: 'published',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'title\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    },
    delete: {
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    }
  },
  '/api/v1/contents': {
    get: {
      200: [{
        data: [
          {
            id: 1,
            articleId: 1,
            body: 'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae. Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium. Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 2,
            articleId: 2,
            body: 'Quisquam praesentium fugit et ducimus quos dolorum pariatur. Doloremque vero adipisci molestiae fuga aliquid quis a quibusdam. Vero laudantium libero error incidunt repellendus. Cupiditate deleniti illum modi minima voluptatum adipisci. Tempore molestias ducimus provident culpa. Unde in delectus pariatur dolorem unde quisquam. Consequuntur quod dolores quas quaerat veniam ipsa necessitatibus quasi natus. Laborum dolore corrupti omnis vero itaque velit nobis aut. Aperiam doloribus cumque illum dolore perferendis blanditiis.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 3,
            articleId: 3,
            body: 'Dolore aliquid aut optio aliquid. Perferendis ullam consectetur consequuntur ipsum at nemo modi corporis. Velit fuga saepe sit aliquam quia iste repellat vero cumque. Pariatur voluptatibus officia commodi ut mollitia occaecati vel. Et incidunt enim itaque sit laborum nisi qui. Delectus placeat vero in delectus tenetur aperiam sunt repudiandae. Quae quaerat nemo minus quam fugit. Voluptatibus mollitia aspernatur. Expedita molestias asperiores perferendis ducimus illum iste.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 4,
            articleId: 4,
            body: 'Et a maiores ex beatae a. Possimus aspernatur repellat. Adipisci ea provident earum impedit ullam quis ullam magnam fugiat. Quas quaerat amet temporibus blanditiis quia est. Eius fuga libero cumque exercitationem fugit at. Ipsum natus ex tempora itaque nostrum labore. Ipsam cum laboriosam dolorem voluptas. Qui numquam doloribus repellat dolor provident esse corrupti. Unde ullam qui laboriosam magnam fuga.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 5,
            articleId: 5,
            body: 'Culpa saepe magni tenetur iusto. Officiis non esse fuga veritatis tempore. Adipisci nam harum porro laboriosam minus tenetur eaque tenetur. Quo consectetur consequatur veniam voluptates commodi. Animi modi consectetur odio magnam commodi accusantium sed. Culpa architecto eos possimus neque vero accusamus veritatis beatae quisquam. Dignissimos officiis culpa repudiandae quidem porro. Facere facilis mollitia accusamus enim eligendi nesciunt. Hic voluptate illum nemo debitis odit fuga debitis sequi.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 6,
            articleId: 6,
            body: 'Velit veniam laborum. Nostrum rem officia repudiandae ipsa enim est unde expedita nam. Maxime culpa corporis eius explicabo voluptas nesciunt consequuntur sed mollitia. Deleniti magnam incidunt voluptates inventore repellendus sapiente quo est in. Nostrum modi suscipit laudantium ducimus architecto sequi. Sapiente iusto minima porro delectus quia animi expedita voluptate. Minus illum laboriosam cupiditate. Ullam sit eos facere sint. Perspiciatis sit rerum doloribus inventore commodi aspernatur.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 7,
            articleId: 7,
            body: 'Nesciunt modi vero eligendi saepe. Recusandae non nihil excepturi dolorum vitae dolores veritatis incidunt. Earum hic error ea. Reprehenderit cumque consequatur architecto expedita pariatur eveniet. Deleniti illo sit. Error totam similique tempore enim repudiandae. Ducimus perspiciatis repellendus harum quasi dolor autem voluptas. Commodi autem ipsum saepe expedita iste cum facere ea suscipit. Id qui delectus consequatur eos quidem accusamus provident error.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 8,
            articleId: 8,
            body: 'Repudiandae dignissimos quod accusantium molestias ad. Unde molestiae animi cupiditate inventore saepe incidunt mollitia voluptatibus. Corporis quo repellendus molestiae quae laudantium. Aut molestiae veniam laborum temporibus similique dolorem corporis consectetur ullam. Neque distinctio provident. Pariatur distinctio repellat odit eveniet ab perferendis officiis sequi voluptas. Pariatur qui rerum. Quo veniam consequuntur deserunt fugiat illum. Pariatur illum fuga quaerat est quasi.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 9,
            articleId: 9,
            body: 'In accusamus ut natus molestias nulla quisquam. Maxime aspernatur quia ut neque voluptatum numquam similique unde. Laudantium architecto sed explicabo non error. Necessitatibus corporis necessitatibus recusandae eligendi provident. Dolor incidunt optio earum adipisci aperiam minima consequatur accusamus est. Officiis numquam impedit quas. Saepe maiores suscipit debitis ex ullam soluta atque ipsum. Assumenda atque quidem. Odit nobis fuga nulla ea deleniti.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 10,
            articleId: 10,
            body: 'Repellendus saepe autem sit. Aliquam commodi error doloribus eum voluptatum quo. Qui quidem ad reiciendis est ex quia voluptatibus voluptate. Voluptatem numquam delectus commodi eius. Aut magnam reprehenderit possimus ab neque soluta minus. Cumque quae alias accusamus eligendi veritatis. Molestias corrupti ipsum. Qui inventore iusto soluta earum sed. Deleniti maiores et quisquam dolores.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          }
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          rowCount: 20,
          pageCount: 2
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring/page must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    },
    post: {
      201: [{
        data: {
          id: 21,
          articleId: 21,
          body: 'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo. Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque. Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'body\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/contents/all': {
    get: {
      200: [{
        data: [
          {
            id: 1,
            articleId: 1,
            body: 'Quam est dicta libero non voluptatem sint. Vitae harum sed quia sequi vel voluptas inventore aut eius. Aperiam blanditiis optio ducimus delectus error repellendus asperiores molestiae. Assumenda et error et unde. Neque quas necessitatibus aliquam incidunt vel. Aliquid enim porro doloribus laudantium. Deserunt odio iusto quisquam amet ut neque aliquam quis. Architecto officia culpa. Repellat fugit molestias nostrum fugiat ut temporibus.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 2,
            articleId: 2,
            body: 'Quisquam praesentium fugit et ducimus quos dolorum pariatur. Doloremque vero adipisci molestiae fuga aliquid quis a quibusdam. Vero laudantium libero error incidunt repellendus. Cupiditate deleniti illum modi minima voluptatum adipisci. Tempore molestias ducimus provident culpa. Unde in delectus pariatur dolorem unde quisquam. Consequuntur quod dolores quas quaerat veniam ipsa necessitatibus quasi natus. Laborum dolore corrupti omnis vero itaque velit nobis aut. Aperiam doloribus cumque illum dolore perferendis blanditiis.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 3,
            articleId: 3,
            body: 'Dolore aliquid aut optio aliquid. Perferendis ullam consectetur consequuntur ipsum at nemo modi corporis. Velit fuga saepe sit aliquam quia iste repellat vero cumque. Pariatur voluptatibus officia commodi ut mollitia occaecati vel. Et incidunt enim itaque sit laborum nisi qui. Delectus placeat vero in delectus tenetur aperiam sunt repudiandae. Quae quaerat nemo minus quam fugit. Voluptatibus mollitia aspernatur. Expedita molestias asperiores perferendis ducimus illum iste.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 4,
            articleId: 4,
            body: 'Et a maiores ex beatae a. Possimus aspernatur repellat. Adipisci ea provident earum impedit ullam quis ullam magnam fugiat. Quas quaerat amet temporibus blanditiis quia est. Eius fuga libero cumque exercitationem fugit at. Ipsum natus ex tempora itaque nostrum labore. Ipsam cum laboriosam dolorem voluptas. Qui numquam doloribus repellat dolor provident esse corrupti. Unde ullam qui laboriosam magnam fuga.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 5,
            articleId: 5,
            body: 'Culpa saepe magni tenetur iusto. Officiis non esse fuga veritatis tempore. Adipisci nam harum porro laboriosam minus tenetur eaque tenetur. Quo consectetur consequatur veniam voluptates commodi. Animi modi consectetur odio magnam commodi accusantium sed. Culpa architecto eos possimus neque vero accusamus veritatis beatae quisquam. Dignissimos officiis culpa repudiandae quidem porro. Facere facilis mollitia accusamus enim eligendi nesciunt. Hic voluptate illum nemo debitis odit fuga debitis sequi.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 6,
            articleId: 6,
            body: 'Velit veniam laborum. Nostrum rem officia repudiandae ipsa enim est unde expedita nam. Maxime culpa corporis eius explicabo voluptas nesciunt consequuntur sed mollitia. Deleniti magnam incidunt voluptates inventore repellendus sapiente quo est in. Nostrum modi suscipit laudantium ducimus architecto sequi. Sapiente iusto minima porro delectus quia animi expedita voluptate. Minus illum laboriosam cupiditate. Ullam sit eos facere sint. Perspiciatis sit rerum doloribus inventore commodi aspernatur.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 7,
            articleId: 7,
            body: 'Nesciunt modi vero eligendi saepe. Recusandae non nihil excepturi dolorum vitae dolores veritatis incidunt. Earum hic error ea. Reprehenderit cumque consequatur architecto expedita pariatur eveniet. Deleniti illo sit. Error totam similique tempore enim repudiandae. Ducimus perspiciatis repellendus harum quasi dolor autem voluptas. Commodi autem ipsum saepe expedita iste cum facere ea suscipit. Id qui delectus consequatur eos quidem accusamus provident error.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 8,
            articleId: 8,
            body: 'Repudiandae dignissimos quod accusantium molestias ad. Unde molestiae animi cupiditate inventore saepe incidunt mollitia voluptatibus. Corporis quo repellendus molestiae quae laudantium. Aut molestiae veniam laborum temporibus similique dolorem corporis consectetur ullam. Neque distinctio provident. Pariatur distinctio repellat odit eveniet ab perferendis officiis sequi voluptas. Pariatur qui rerum. Quo veniam consequuntur deserunt fugiat illum. Pariatur illum fuga quaerat est quasi.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 9,
            articleId: 9,
            body: 'In accusamus ut natus molestias nulla quisquam. Maxime aspernatur quia ut neque voluptatum numquam similique unde. Laudantium architecto sed explicabo non error. Necessitatibus corporis necessitatibus recusandae eligendi provident. Dolor incidunt optio earum adipisci aperiam minima consequatur accusamus est. Officiis numquam impedit quas. Saepe maiores suscipit debitis ex ullam soluta atque ipsum. Assumenda atque quidem. Odit nobis fuga nulla ea deleniti.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 10,
            articleId: 10,
            body: 'Repellendus saepe autem sit. Aliquam commodi error doloribus eum voluptatum quo. Qui quidem ad reiciendis est ex quia voluptatibus voluptate. Voluptatem numquam delectus commodi eius. Aut magnam reprehenderit possimus ab neque soluta minus. Cumque quae alias accusamus eligendi veritatis. Molestias corrupti ipsum. Qui inventore iusto soluta earum sed. Deleniti maiores et quisquam dolores.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 11,
            articleId: 11,
            body: 'Voluptas exercitationem officia nisi. Quis quidem dicta molestias necessitatibus ullam soluta saepe voluptatibus. Quas similique qui. Occaecati ad ducimus quis non sapiente officia. Nisi iure eveniet fuga officiis earum praesentium. Reprehenderit ipsum eaque autem facere ex quaerat. Soluta soluta ullam sapiente corporis earum numquam corrupti voluptatum accusantium. Illum iure exercitationem optio deleniti perferendis ducimus perspiciatis repudiandae dicta. Cum repellendus laboriosam provident optio temporibus dignissimos voluptas.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 12,
            articleId: 12,
            body: 'Molestiae porro asperiores aut ullam. Ducimus molestiae magnam quia non doloremque nemo eius corrupti dolores. Ut rem nulla modi voluptatibus sunt. Vel illum commodi voluptatibus ad labore adipisci. Porro nam similique libero autem quisquam delectus magni. Quod veritatis laboriosam sint iusto eum possimus sunt incidunt. Animi corporis expedita natus aspernatur porro itaque quas alias. Ut vitae maiores suscipit eius consequatur. Perferendis recusandae assumenda quisquam.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 13,
            articleId: 13,
            body: 'Enim maxime natus fugit dolore dolorem. Nihil similique repudiandae minus. Sequi ea quo quae illo sit vitae quam nesciunt. Ullam iste hic. In dolore vitae. Harum vitae dicta quia voluptate provident. Molestias esse vel laudantium quos reprehenderit quibusdam saepe aperiam. Rerum quasi aliquam reiciendis repellat numquam iusto consequatur harum. Odit sapiente voluptatum omnis.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 14,
            articleId: 14,
            body: 'Impedit eos voluptatem corrupti tempora fuga qui consequuntur. Quasi esse hic fugiat a ipsa tenetur dolor. Doloremque voluptatum ipsum. Tenetur dolores perspiciatis nisi eius debitis consequatur. Voluptates sint atque quibusdam temporibus quaerat. Alias at neque architecto incidunt sapiente. Est facere vero minima impedit itaque harum dicta aliquam soluta. Iusto aliquid beatae et neque ut voluptate hic amet. Ex numquam ad optio in.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 15,
            articleId: 15,
            body: 'Ab eum hic occaecati nisi magnam. Iusto inventore vero ea laborum libero exercitationem nam. Repudiandae nobis quis aspernatur. Corporis libero autem odio in hic nostrum. Inventore molestias dicta molestias esse. Officiis optio inventore vero tempore error quasi aperiam earum tenetur. Quae temporibus totam et molestias quas incidunt. Harum incidunt quo veniam aliquam neque ab ab possimus expedita. Quaerat non quod tempore.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 16,
            articleId: 16,
            body: 'Dolorem placeat iusto harum molestiae officia perspiciatis animi occaecati nemo. Temporibus rem omnis aliquam eius. Nulla occaecati aut quis quia sit iste neque. Consectetur fugiat neque adipisci sequi necessitatibus quas distinctio similique ipsum. Laboriosam enim repellat. Veniam ad aspernatur esse doloremque architecto voluptate suscipit. Quis doloremque doloremque illo accusantium maiores. Ab id tempora libero vitae alias numquam quia. Quis doloribus minima voluptatem optio quo.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 17,
            articleId: 17,
            body: 'Molestias id corrupti unde laboriosam modi. Nemo fugiat quae nisi fugiat voluptatibus ad. Est odio voluptatem sit. Ipsa quam modi asperiores ea nesciunt. Eveniet dolorem dicta odio. Eaque illo quia optio. Tempora exercitationem dicta praesentium reprehenderit error ex. Cumque libero iusto cumque. Delectus laborum at.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 18,
            articleId: 18,
            body: 'Consequatur delectus molestias eligendi. Libero est tempore quam eos aliquam exercitationem saepe accusamus. Iusto sit nulla aperiam dolorum. Repellendus eius enim laudantium quod. Illum consequuntur placeat temporibus nobis minima. Odio adipisci blanditiis. Maxime voluptatem consectetur nobis est repellendus adipisci animi. Quos consequuntur quod suscipit sequi quia velit. Dolores dolorum adipisci quo nostrum suscipit modi recusandae nemo.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 19,
            articleId: 19,
            body: 'Recusandae iure eum perferendis quasi nulla inventore non fugiat dolor. Dolores laborum quaerat accusamus. Nam harum distinctio nam tenetur. Sequi eius ut blanditiis. Recusandae vero error necessitatibus commodi repellendus fugiat. Reiciendis laudantium eius ducimus tempore cum voluptates cum. Quidem beatae nostrum perferendis dolores maxime rerum. Commodi voluptas voluptates unde. Tenetur alias odit.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 20,
            articleId: 20,
            body: 'Commodi nisi minus eaque facere ipsa eius. Esse iusto mollitia voluptas ipsam commodi itaque optio vitae quas. Itaque ipsa et accusantium maxime. Temporibus corrupti natus vitae inventore occaecati. Excepturi eos ipsam. A porro repudiandae aliquid error tempora. Laborum consequuntur laudantium repellat dignissimos veritatis fugiat. Enim consequatur deserunt doloremque. Dignissimos necessitatibus natus eos impedit.',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          }
        ]
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring/sort must be equal to one of the allowed values'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/contents/{id}': {
    get: {
      200: [{
        data: {
          id: 21,
          articleId: 21,
          body: 'Ipsum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo. Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque. Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    },
    put: {
      200: [{
        data: {
          id: 21,
          articleId: 21,
          body: 'Earum corrupti inventore molestiae assumenda libero odio harum molestiae. Rerum repellat doloribus earum hic officiis. Odio fugit quo nemo. Optio rem commodi placeat molestias corrupti exercitationem id deserunt. Veritatis inventore dolorem corporis quo. Doloremque cupiditate necessitatibus aliquid exercitationem accusantium repudiandae accusamus itaque. Quasi tempora reprehenderit quod quam aliquid aut pariatur. Ipsum dicta nostrum reprehenderit fugiat. Soluta autem aspernatur modi id.',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'body\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    },
    delete: {
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    }
  },
  '/api/v1/tags': {
    get: {
      200: [{
        data: [
          {
            id: 1,
            name: 'rem',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 2,
            name: 'perferendis',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 3,
            name: 'aliquam',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 4,
            name: 'nulla',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 5,
            name: 'veniam',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          }
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          rowCount: 5,
          pageCount: 1
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring/page must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    },
    post: {
      201: [{
        data: {
          id: 6,
          name: 'beatae',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'name\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/tags/all': {
    get: {
      200: [{
        data: [
          {
            id: 1,
            name: 'rem',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 2,
            name: 'perferendis',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 3,
            name: 'aliquam',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 4,
            name: 'nulla',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          },
          {
            id: 5,
            name: 'veniam',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          }
        ]
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring/sort must be equal to one of the allowed values'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/tags/{id}': {
    get: {
      200: [{
        data: {
          id: 6,
          name: 'beatae',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    },
    put: {
      200: [{
        data: {
          id: 6,
          name: 'labore',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'name\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    },
    delete: {
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    }
  },
  '/api/v1/articles-tags': {
    post: {
      200: [{
        data: {
          id: 1,
          userId: 1,
          title: 'sint repellendus inventore',
          description: 'Debitis assumenda molestiae facilis odio facilis. Aliquid odit reiciendis ut rerum reiciendis. Laborum numquam explicabo non.',
          status: 'published',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z',
          tags: [
            {
              id: 1,
              name: 'rem',
              createdAt: '2023-07-01T00:00:00.000Z',
              updatedAt: '2023-07-01T00:00:00.000Z'
            },
            {
              id: 2,
              name: 'perferendis',
              createdAt: '2023-07-01T00:00:00.000Z',
              updatedAt: '2023-07-01T00:00:00.000Z'
            },
            {
              id: 3,
              name: 'aliquam',
              createdAt: '2023-07-01T00:00:00.000Z',
              updatedAt: '2023-07-01T00:00:00.000Z'
            },
            {
              id: 5,
              name: 'veniam',
              createdAt: '2023-07-01T00:00:00.000Z',
              updatedAt: '2023-07-01T00:00:00.000Z'
            }
          ]
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'articleId\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    },
    delete: {
      200: [{
        data: {
          id: 1,
          userId: 1,
          title: 'sint repellendus inventore',
          description: 'Debitis assumenda molestiae facilis odio facilis. Aliquid odit reiciendis ut rerum reiciendis. Laborum numquam explicabo non.',
          status: 'published',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z',
          tags: [
            {
              id: 2,
              name: 'perferendis',
              createdAt: '2023-07-01T00:00:00.000Z',
              updatedAt: '2023-07-01T00:00:00.000Z'
            },
            {
              id: 3,
              name: 'aliquam',
              createdAt: '2023-07-01T00:00:00.000Z',
              updatedAt: '2023-07-01T00:00:00.000Z'
            },
            {
              id: 5,
              name: 'veniam',
              createdAt: '2023-07-01T00:00:00.000Z',
              updatedAt: '2023-07-01T00:00:00.000Z'
            }
          ]
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'articleId\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/admins': {
    get: {
      200: [{
        data: [
          {
            id: 1,
            name: 'Nikolay Shamayko',
            username: 'ns16',
            email: 'nikolay.shamayko@gmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          }
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          rowCount: 1,
          pageCount: 1
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring/page must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    },
    post: {
      201: [{
        data: {
          id: 2,
          name: 'Anatoly Muravyov',
          username: 'test',
          email: 'anatoly.muravyov@gmail.com',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'name\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/admins/all': {
    get: {
      200: [{
        data: [
          {
            id: 1,
            name: 'Nikolay Shamayko',
            username: 'ns16',
            email: 'nikolay.shamayko@gmail.com',
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-07-01T00:00:00.000Z'
          }
        ]
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'querystring/sort must be equal to one of the allowed values'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }]
    }
  },
  '/api/v1/admins/{id}': {
    get: {
      200: [{
        data: {
          id: 2,
          name: 'Anatoly Muravyov',
          username: 'test',
          email: 'anatoly.muravyov@gmail.com',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    },
    put: {
      200: [{
        data: {
          id: 2,
          name: 'Anatoly Muravyov',
          username: 'pest',
          email: 'anatoly.muravyov@gmail.com',
          createdAt: '2023-07-01T00:00:00.000Z',
          updatedAt: '2023-07-01T00:00:00.000Z'
        }
      }],
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }, {
        statusCode: 400,
        error: 'Bad Request',
        message: 'body must have required property \'name\''
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    },
    delete: {
      400: [{
        statusCode: 400,
        error: 'Bad Request',
        message: 'params/id must be integer'
      }],
      401: [{
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token'
      }],
      404: [{
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found'
      }]
    }
  }
}
