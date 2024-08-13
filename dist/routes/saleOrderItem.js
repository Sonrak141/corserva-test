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
const express_1 = __importDefault(require('express'));
const saleOrderItem_1 = __importDefault(require('../models/saleOrderItem'));
const joi_1 = __importDefault(require('joi'));
const router = express_1.default.Router();
const saleOrderItemSchema = joi_1.default.object({
  productName: joi_1.default.string().required(),
  description: joi_1.default.string().required(),
  sale: joi_1.default.boolean().required(),
  quantity: joi_1.default.number().integer().positive().required(),
  price: joi_1.default.number().positive().required(),
});
// Create
router.post('/', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { error } = saleOrderItemSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { productName, description, sale, quantity, price } = req.body;
      const newItem = yield saleOrderItem_1.default.create({
        productName,
        description,
        sale,
        quantity,
        price,
      });
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error creating Sale Order Item:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  }),
);
// Read all
router.get('/', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const saleOrderItems = yield saleOrderItem_1.default.findAll();
      res.status(200).json(saleOrderItems);
    } catch (error) {
      console.error('Error fetching Sale Order Items:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  }),
);
// Read
router.get('/:id', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const saleOrderItem = yield saleOrderItem_1.default.findByPk(
        req.params.id,
      );
      if (saleOrderItem) {
        res.status(200).json(saleOrderItem);
      } else {
        res.status(404).json({ error: 'Sale Order Item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }),
);
// Update
router.put('/:id', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { error } = saleOrderItemSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const [updated] = yield saleOrderItem_1.default.update(req.body, {
        where: { id: req.params.id },
      });
      if (updated) {
        const updatedItem = yield saleOrderItem_1.default.findByPk(
          req.params.id,
        );
        res.status(200).json(updatedItem);
      } else {
        res.status(404).json({ error: 'Sale Order Item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }),
);
// Delete
router.delete('/:id', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const deleted = yield saleOrderItem_1.default.destroy({
        where: { id: req.params.id },
      });
      if (deleted) {
        res.status(204).json();
      } else {
        res.status(404).json({ error: 'Sale Order Item not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  }),
);
exports.default = router;
