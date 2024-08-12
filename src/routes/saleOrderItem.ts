import express from 'express';
import SaleOrderItem from '../models/saleOrderItem';
import Joi from 'joi';
import { Request, Response } from 'express';

const router = express.Router();

const saleOrderItemSchema = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().required(),
  sale: Joi.boolean().required(),
  quantity: Joi.number().integer().positive().required(),
  price: Joi.number().positive().required(),
});

// Create
router.post('/', async (req: Request, res: Response) => {
  try {
    const { error } = saleOrderItemSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { productName, description, sale, quantity, price } = req.body;

    const newItem = await SaleOrderItem.create({
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
});

// Read
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const saleOrderItem = await SaleOrderItem.findByPk(req.params.id);
    if (saleOrderItem) {
      res.status(200).json(saleOrderItem);
    } else {
      res.status(404).json({ error: 'Sale Order Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Update
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = saleOrderItemSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const [updated] = await SaleOrderItem.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedItem = await SaleOrderItem.findByPk(req.params.id);
      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ error: 'Sale Order Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await SaleOrderItem.destroy({
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
});

export default router;
