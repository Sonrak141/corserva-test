import request from 'supertest';
import { app } from '../index';
import sequelize from '../models';
import SaleOrderItem from '../models/saleOrderItem';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('SaleOrderItem API', () => {
  it('should create a sale order item', async () => {
    const response = await request(app).post('/api/sale-order-items').send({
      productName: 'Test Product',
      description: 'This is a test description for the Order',
      sale: false,
      quantity: 10,
      price: 99.99,
    });

    expect(response.status).toBe(201);
    expect(response.body.productName).toBe('Test Product');
  });
});

describe('Sale Order Item API', () => {
  beforeEach(async () => {
    await SaleOrderItem.truncate();
  });

  it('should get all sale order items', async () => {
    // Crea varios SaleOrderItems para la prueba
    await SaleOrderItem.bulkCreate([
      {
        productName: 'Product 1',
        description: 'Description 1',
        sale: true,
        quantity: 5,
        price: 50.0,
      },
      {
        productName: 'Product 2',
        description: 'Description 2',
        sale: false,
        quantity: 10,
        price: 100.0,
      },
      {
        productName: 'Product 3',
        description: 'Description 3',
        sale: true,
        quantity: 15,
        price: 150.0,
      },
    ]);

    const response = await request(app).get('/api/sale-order-items');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body[0]).toHaveProperty('productName', 'Product 1');
    expect(response.body[1]).toHaveProperty('productName', 'Product 2');
    expect(response.body[2]).toHaveProperty('productName', 'Product 3');
  });

  it('should get a sale order item by ID', async () => {
    const createdItem = await SaleOrderItem.create({
      productName: 'Test Product',
      description: 'This is a test description for the Order',
      sale: false,
      quantity: 10,
      price: 99.99,
    });

    const response = await request(app).get(
      `/api/sale-order-items/${createdItem.id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdItem.id);
    expect(response.body).toHaveProperty('productName', 'Test Product');
    expect(response.body).toHaveProperty('quantity', 10);
    expect(response.body).toHaveProperty('price', 99.99);
  });

  it('should return 404 if the sale order item does not exist', async () => {
    // Envía una solicitud GET para un ID que no existe
    const response = await request(app).get('/api/sale-order-items/999');

    // Verifica que la respuesta sea un error 404
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Sale Order Item not found');
  });
});

describe('PUT /api/sale-order-items/:id', () => {
  let createdItem: SaleOrderItem;

  beforeEach(async () => {
    await SaleOrderItem.truncate();
    createdItem = await SaleOrderItem.create({
      productName: 'Old Product',
      description: 'teste description',
      sale: false,
      quantity: 10,
      price: 150,
    });
  });

  it('should update a sale order item by ID', async () => {
    const response = await request(app)
      .put(`/api/sale-order-items/${createdItem.id}`)
      .send({
        productName: 'Updated Product',
        description: 'Updated description for the product',
        sale: true,
        quantity: 20,
        price: 250,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdItem.id);
    expect(response.body).toHaveProperty('productName', 'Updated Product');
    expect(response.body).toHaveProperty(
      'description',
      'Updated description for the product',
    );
    expect(response.body).toHaveProperty('sale', true);
    expect(response.body).toHaveProperty('quantity', 20);
    expect(response.body).toHaveProperty('price', 250);
  });

  it('should return 404 if the sale order item to update does not exist', async () => {
    const response = await request(app).put('/api/sale-order-items/999').send({
      productName: 'Non-existent Product',
      description: 'description for a non existent product',
      sale: false,
      quantity: 0,
      price: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'error',
      '"quantity" must be a positive number',
    );
  });
});

describe('DELETE /api/sale-order-items/:id', () => {
  let createdItem: SaleOrderItem;

  beforeEach(async () => {
    await SaleOrderItem.truncate();
    createdItem = await SaleOrderItem.create({
      productName: 'Product to Delete',
      description: 'test description',
      sale: false,
      quantity: 5,
      price: 100,
    });
  });

  it('should delete a sale order item by ID', async () => {
    const response = await request(app).delete(
      `/api/sale-order-items/${createdItem.id}`,
    );

    expect(response.status).toBe(204);
  });

  it('should return 404 if the sale order item to delete does not exist', async () => {
    const response = await request(app).delete('/api/sale-order-items/999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Sale Order Item not found');
  });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await sequelize.truncate();
});
