'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
const index_1 = require('../index');
const models_1 = __importDefault(require('../models'));
const saleOrderItem_1 = __importDefault(require('../models/saleOrderItem'));
beforeAll(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.default.sync({ force: true });
  }),
);
describe('SaleOrderItem API', () => {
  it('should create a sale order item', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(index_1.app)
        .post('/api/sale-order-items')
        .send({
          productName: 'Test Product',
          description: 'This is a test description for the Order',
          sale: false,
          quantity: 10,
          price: 99.99,
        });
      expect(response.status).toBe(201);
      expect(response.body.productName).toBe('Test Product');
    }));
});
describe('Sale Order Item API', () => {
  beforeEach(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield saleOrderItem_1.default.truncate();
    }),
  );
  it('should get all sale order items', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      // Crea varios SaleOrderItems para la prueba
      yield saleOrderItem_1.default.bulkCreate([
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
      const response = yield (0, supertest_1.default)(index_1.app).get(
        '/api/sale-order-items',
      );
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body[0]).toHaveProperty('productName', 'Product 1');
      expect(response.body[1]).toHaveProperty('productName', 'Product 2');
      expect(response.body[2]).toHaveProperty('productName', 'Product 3');
    }));
  it('should get a sale order item by ID', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const createdItem = yield saleOrderItem_1.default.create({
        productName: 'Test Product',
        description: 'This is a test description for the Order',
        sale: false,
        quantity: 10,
        price: 99.99,
      });
      const response = yield (0, supertest_1.default)(index_1.app).get(
        `/api/sale-order-items/${createdItem.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdItem.id);
      expect(response.body).toHaveProperty('productName', 'Test Product');
      expect(response.body).toHaveProperty('quantity', 10);
      expect(response.body).toHaveProperty('price', 99.99);
    }));
  it('should return 404 if the sale order item does not exist', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      // Envía una solicitud GET para un ID que no existe
      const response = yield (0, supertest_1.default)(index_1.app).get(
        '/api/sale-order-items/999',
      );
      // Verifica que la respuesta sea un error 404
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'error',
        'Sale Order Item not found',
      );
    }));
});
describe('PUT /api/sale-order-items/:id', () => {
  let createdItem;
  beforeEach(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield saleOrderItem_1.default.truncate();
      createdItem = yield saleOrderItem_1.default.create({
        productName: 'Old Product',
        description: 'teste description',
        sale: false,
        quantity: 10,
        price: 150,
      });
    }),
  );
  it('should update a sale order item by ID', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(index_1.app)
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
    }));
  it('should return 404 if the sale order item to update does not exist', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(index_1.app)
        .put('/api/sale-order-items/999')
        .send({
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
    }));
});
describe('DELETE /api/sale-order-items/:id', () => {
  let createdItem;
  beforeEach(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield saleOrderItem_1.default.truncate();
      createdItem = yield saleOrderItem_1.default.create({
        productName: 'Product to Delete',
        description: 'test description',
        sale: false,
        quantity: 5,
        price: 100,
      });
    }),
  );
  it('should delete a sale order item by ID', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(index_1.app).delete(
        `/api/sale-order-items/${createdItem.id}`,
      );
      expect(response.status).toBe(204);
    }));
  it('should return 404 if the sale order item to delete does not exist', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(index_1.app).delete(
        '/api/sale-order-items/999',
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'error',
        'Sale Order Item not found',
      );
    }));
});
afterAll(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.default.close();
  }),
);
beforeEach(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.default.truncate();
  }),
);
