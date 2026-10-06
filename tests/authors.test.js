const request = require('supertest');

jest.mock('../src/db', () => ({
  query: jest.fn()
}));

const pool = require('../src/db');
const app = require('../src/app');


describe('Authors API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  // GET /authors
  test('GET /authors should return all authors', async () => {
    const mockAuthors = [
      {
        id: 1,
        name: 'Ana García',
        email: 'ana@example.com',
        bio: 'Desarrolladora full-stack',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Carlos Ruiz',
        email: 'carlos@example.com',
        bio: 'Escritor técnico',
        created_at: new Date().toISOString()
      }
    ];

    pool.query.mockResolvedValue({
      rows: mockAuthors
    });

    const response = await request(app)
      .get('/authors');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe('Ana García');
  });


  // GET /authors/:id - ID inválido
  test('GET /authors/:id should return 400 for an invalid ID', async () => {
    const response = await request(app)
      .get('/authors/abc');

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: 'Invalid ID'
    });

    expect(pool.query).not.toHaveBeenCalled();
  });


  // GET /authors/:id - autor inexistente
  test('GET /authors/:id should return 404 when author does not exist', async () => {
    pool.query.mockResolvedValue({
      rows: []
    });

    const response = await request(app)
      .get('/authors/999');

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: 'Author not found'
    });
  });


  // POST /authors - creación correcta
  test('POST /authors should create a new author', async () => {
    const newAuthor = {
      id: 4,
      name: 'Laura Gomez',
      email: 'laura@example.com',
      bio: 'Desarrolladora backend',
      created_at: new Date().toISOString()
    };

    pool.query.mockResolvedValue({
      rows: [newAuthor]
    });

    const response = await request(app)
      .post('/authors')
      .send({
        name: 'Laura Gomez',
        email: 'laura@example.com',
        bio: 'Desarrolladora backend'
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Laura Gomez');
    expect(response.body.email).toBe('laura@example.com');
  });


  // POST /authors - nombre faltante
  test('POST /authors should return 400 when name is missing', async () => {
    const response = await request(app)
      .post('/authors')
      .send({
        email: 'laura@example.com'
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: 'Name is required'
    });

    expect(pool.query).not.toHaveBeenCalled();
  });


  // POST /authors - email duplicado
  test('POST /authors should return 400 when email already exists', async () => {
    pool.query.mockRejectedValue({
      code: '23505'
    });

    const response = await request(app)
      .post('/authors')
      .send({
        name: 'Otro autor',
        email: 'ana@example.com',
        bio: 'Bio de prueba'
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: 'Email already exists'
    });
  });


  // PUT /authors/:id
  test('PUT /authors/:id should update an author', async () => {
    const updatedAuthor = {
      id: 1,
      name: 'Ana García Actualizada',
      email: 'ana@example.com',
      bio: 'Bio actualizada',
      created_at: new Date().toISOString()
    };

    pool.query.mockResolvedValue({
      rows: [updatedAuthor]
    });

    const response = await request(app)
      .put('/authors/1')
      .send({
        name: 'Ana García Actualizada',
        email: 'ana@example.com',
        bio: 'Bio actualizada'
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Ana García Actualizada');
    expect(response.body.bio).toBe('Bio actualizada');
  });


  // DELETE /authors/:id
  test('DELETE /authors/:id should delete an author', async () => {
    pool.query.mockResolvedValue({
      rows: [
        {
          id: 4,
          name: 'Laura Gomez',
          email: 'laura@example.com'
        }
      ]
    });

    const response = await request(app)
      .delete('/authors/4');

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

});