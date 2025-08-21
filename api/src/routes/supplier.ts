/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: API endpoints for managing suppliers
 */

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Returns all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: List of all suppliers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 * 
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 *   put:
 *     summary: Update a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Supplier ID
 *     responses:
 *       204:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 */

import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { Supplier } from '../models/supplier';
import { suppliers as seedSuppliers } from '../seedData';

const router = express.Router();

let suppliers: Supplier[] = [...seedSuppliers];

// Validation middleware
const validateSupplier = [
  body('supplierId').isInt({ min: 1 }).withMessage('Supplier ID must be a positive integer'),
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  body('contactPerson').trim().isLength({ min: 1, max: 100 }).withMessage('Contact person must be between 1 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  body('phone').trim().isLength({ min: 1, max: 20 }).withMessage('Phone must be between 1 and 20 characters'),
];

const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];

// Validation error handler
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
    return;
  }
  next();
};

// Create a new supplier
router.post('/', validateSupplier, handleValidationErrors, (req: any, res: any) => {
    const newSupplier = req.body as Supplier;
    
    // Check if supplier ID already exists
    if (suppliers.find(s => s.supplierId === newSupplier.supplierId)) {
      return res.status(409).json({ error: 'Supplier ID already exists' });
    }
    
    suppliers.push(newSupplier);
    res.status(201).json(newSupplier);
});

// Get all suppliers
router.get('/', (req, res) => {
    res.json(suppliers);
});

// Get a supplier by ID
router.get('/:id', validateId, handleValidationErrors, (req: any, res: any) => {
    const supplier = suppliers.find(s => s.supplierId === parseInt(req.params.id));
    if (supplier) {
        res.json(supplier);
    } else {
        res.status(404).json({ error: 'Supplier not found' });
    }
});

// Update a supplier by ID
router.put('/:id', validateId, validateSupplier, handleValidationErrors, (req: any, res: any) => {
    const index = suppliers.findIndex(s => s.supplierId === parseInt(req.params.id));
    if (index !== -1) {
        suppliers[index] = req.body;
        res.json(suppliers[index]);
    } else {
        res.status(404).json({ error: 'Supplier not found' });
    }
});

// Delete a supplier by ID
router.delete('/:id', validateId, handleValidationErrors, (req: any, res: any) => {
    const index = suppliers.findIndex(s => s.supplierId === parseInt(req.params.id));
    if (index !== -1) {
        suppliers.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Supplier not found' });
    }
});

export default router;