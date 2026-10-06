const request = require('supertest');

jest.mock('../src/db', () => ({
  query: jest.fn()
}));

const pool = require('../src/db');
const app = require('../src/app');


describe('Posts API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  // GET /posts
  test('GET /posts should return all posts', async () => {
    const mockPosts = [
      {
        id: 1,
        title: 'Introducción a Node.js',
        content: 'Node.js es un runtime de JavaScript...',
        author_id: 1,
        published: true,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'PostgreSQL vs MySQL',
        content: 'Ambas bases de datos tienen ventajas...',
        author_id: 2,
        published: true,
        created_at: new Date().toISOString()
      }
    ];

    pool.query.mockResolvedValue({
      rows: mockPosts
    });

    const response = await request(app)
      .get('/posts');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe('Introducción a Node.js');
  });


  // GET /posts/:id
  test('GET /posts/:id should return a post', async () => {
    const mockPost = {
      id: 1,
      title: 'Introducción a Node.js',
      content: 'Node.js es un runtime de JavaScript...',
      author_id: 1,
      published: true,
      created_at: new Date().toISOString()
    };

    pool.query.mockResolvedValue({
      rows: [mockPost]
    });

    const response = await request(app)
      .get('/posts/1');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.title).toBe('Introducción a Node.js');
  });


  // GET /posts/:id - ID inválido
  test('GET /posts/:id should return 400 for an invalid ID', async () => {
    const response = await request(app)
      .get('/posts/abc');

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: 'Invalid ID'
    });

    expect(pool.query).not.toHaveBeenCalled();
  });


  // GET /posts/:id - post inexistente
  test('GET /posts/:id should return 404 when post does not exist', async () => {
    pool.query.mockResolvedValue({
      rows: []
    });

    const response = await request(app)
      .get('/posts/999');

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: 'Post not found'
    });
  });


  // GET /posts/author/:authorId
  test('GET /posts/author/:authorId should return posts from an author', async () => {
    const mockPosts = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Contenido 1',
        author_id: 1,
        published: true
      },
      {
        id: 3,
        title: 'Post 2',
        content: 'Contenido 2',
        author_id: 1,
        published: false
      }
    ];

    pool.query.mockResolvedValue({
      rows: mockPosts
    });

    const response = await request(app)
      .get('/posts/author/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].author_id).toBe(1);
    expect(response.body[1].author_id).toBe(1);
  });


  // GET /posts/author/:authorId - ID inválido
  test('GET /posts/author/:authorId should return 400 for an invalid author ID', async () => {
    const response = await request(app)
      .get('/posts/author/abc');

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: 'Invalid author ID'
    });

    expect(pool.query).not.toHaveBeenCalled();
  });


  // POST /posts
  test('POST /posts should create a new post', async () => {
    const newPost = {
      id: 6,
      title: 'Nuevo post',
      content: 'Contenido del nuevo post',
      author_id: 1,
      published: true,
      created_at: new Date().toISOString()
    };

    pool.query.mockResolvedValue({
      rows: [newPost]
    });

    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Nuevo post',
        content: 'Contenido del nuevo post',
        author_id: 1,
        published: true
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Nuevo post');
    expect(response.body.author_id).toBe(1);
  });


  // POST /posts - título faltante
  test('POST /posts should return 400 when title is missing', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        content: 'Contenido de prueba',
        author_id: 1
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: 'Title is required'
    });

    expect(pool.query).not.toHaveBeenCalled();
  });


  // POST /posts - autor inexistente
  test('POST /posts should return 400 when author does not exist', async () => {
    pool.query.mockRejectedValue({
      code: '23503'
    });

    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Post inválido',
        content: 'Contenido de prueba',
        author_id: 999,
        published: false
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: 'Author does not exist'
    });
  });


  // PUT /posts/:id
  test('PUT /posts/:id should update a post', async () => {
    const updatedPost = {
      id: 1,
      title: 'Post actualizado',
      content: 'Contenido actualizado',
      author_id: 1,
      published: true,
      created_at: new Date().toISOString()
    };

    pool.query.mockResolvedValue({
      rows: [updatedPost]
    });

    const response = await request(app)
      .put('/posts/1')
      .send({
        title: 'Post actualizado',
        content: 'Contenido actualizado',
        author_id: 1,
        published: true
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Post actualizado');
    expect(response.body.content).toBe('Contenido actualizado');
  });


  // DELETE /posts/:id
  test('DELETE /posts/:id should delete a post', async () => {
    pool.query.mockResolvedValue({
      rows: [
        {
          id: 6,
          title: 'Post de prueba'
        }
      ]
    });

    const response = await request(app)
      .delete('/posts/6');

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

});