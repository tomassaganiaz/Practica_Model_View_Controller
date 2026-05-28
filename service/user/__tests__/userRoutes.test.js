const request = require('supertest');
const app = require('../app');

jest.mock('../services/userServices');
const userService = require('../services/userServices');

describe('User routes', () => {
  afterEach(() => jest.resetAllMocks());

  it('GET /api/usuarios responde con lista de usuarios', async () => {
    const users = [{ id: 1, nombre: 'Ana', bloqueado: false }];
    userService.findAll.mockResolvedValue(users);

    const res = await request(app).get('/api/usuarios');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(users);
  });

  it('POST /api/usuarios crea un usuario y responde 201', async () => {
    const payload = { nombre: 'Luis', bloqueado: false };
    const createdUser = { id: 1, ...payload };
    userService.create.mockResolvedValue(createdUser);

    const res = await request(app).post('/api/usuarios').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(createdUser);
    expect(userService.create).toHaveBeenCalledWith(payload);
  });

  it('GET /api/usuarios/:id responde 404 cuando no existe', async () => {
    userService.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/usuarios/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Usuario no encontrado' });
  });

  it('POST /api/usuarios responde 400 cuando falta el nombre', async () => {
    const error = new Error('Nombre requerido');
    userService.create.mockRejectedValue(error);

    const res = await request(app).post('/api/usuarios').send({ bloqueado: true });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Nombre requerido' });
  });
});
