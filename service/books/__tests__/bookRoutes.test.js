const request = require('supertest');
const app = require('../app');

jest.mock('../services/bookService');
const bookService = require('../services/bookService');

describe('Book routes', () => {
  afterEach(() => jest.resetAllMocks());

  it('GET /api/libros responde con lista de libros', async () => {
    const books = [{ id: 1, titulo: 'Prueba', stock: 10 }];
    bookService.findAll.mockResolvedValue(books);

    const res = await request(app).get('/api/libros');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(books);
  });

  it('POST /api/libros crea un libro y responde 201', async () => {
    const payload = { titulo: 'Nuevo Libro', stock: 5 };
    const createdBook = { id: 1, ...payload };
    bookService.create.mockResolvedValue(createdBook);

    const res = await request(app).post('/api/libros').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(createdBook);
    expect(bookService.create).toHaveBeenCalledWith(payload);
  });

  it('GET /api/libros/:id responde 404 cuando no existe', async () => {
    bookService.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/libros/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Libro no encontrado' });
  });

  it('POST /api/libros responde 400 cuando falta el título', async () => {
    const error = new Error('Título requerido');
    bookService.create.mockRejectedValue(error);

    const res = await request(app).post('/api/libros').send({ stock: 2 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Título requerido' });
  });
});
