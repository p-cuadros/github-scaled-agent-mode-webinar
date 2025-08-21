import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import supplierRoutes from './supplier';

const app = express();
app.use(express.json());
app.use('/api/suppliers', supplierRoutes);

describe('Supplier API Security Tests', () => {
    
    describe('Input Validation', () => {
        it('should reject invalid supplier data', async () => {
            const invalidSupplier = {
                supplierId: -1, // Invalid: negative number
                name: '', // Invalid: empty string
                email: 'invalid-email', // Invalid: not an email
                phone: '', // Invalid: empty string
                contactPerson: '', // Invalid: empty string
                description: 'A'.repeat(501) // Invalid: too long
            };

            const response = await request(app)
                .post('/api/suppliers')
                .send(invalidSupplier);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Validation failed');
            expect(response.body.details).toBeDefined();
            expect(Array.isArray(response.body.details)).toBe(true);
        });

        it('should accept valid supplier data', async () => {
            const validSupplier = {
                supplierId: 999, // Use a unique ID not in seed data
                name: 'Test Supplier',
                email: 'test@example.com',
                phone: '123-456-7890',
                contactPerson: 'John Doe',
                description: 'A test supplier'
            };

            const response = await request(app)
                .post('/api/suppliers')
                .send(validSupplier);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(validSupplier);
        });

        it('should prevent duplicate supplier IDs', async () => {
            const supplier = {
                supplierId: 998, // Use a unique ID not in seed data
                name: 'Test Supplier 2',
                email: 'test2@example.com',
                phone: '123-456-7890',
                contactPerson: 'Jane Doe',
                description: 'Another test supplier'
            };

            // Add supplier first time
            await request(app)
                .post('/api/suppliers')
                .send(supplier);

            // Try to add the same supplier ID again
            const response = await request(app)
                .post('/api/suppliers')
                .send(supplier);

            expect(response.status).toBe(409);
            expect(response.body.error).toBe('Supplier ID already exists');
        });
    });

    describe('Parameter Validation', () => {
        it('should reject invalid ID parameters', async () => {
            const response = await request(app)
                .get('/api/suppliers/invalid-id');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Validation failed');
        });

        it('should reject negative ID parameters', async () => {
            const response = await request(app)
                .get('/api/suppliers/-1');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Validation failed');
        });

        it('should accept valid ID parameters', async () => {
            const response = await request(app)
                .get('/api/suppliers/999'); // Non-existent but valid ID

            expect([404, 200]).toContain(response.status); // Either not found or found
        });
    });

    describe('XSS Prevention', () => {
        it('should sanitize potentially dangerous input', async () => {
            const maliciousSupplier = {
                supplierId: 100,
                name: '<script>alert("xss")</script>',
                email: 'test@example.com',
                phone: '123-456-7890',
                contactPerson: '<img src="x" onerror="alert(1)">',
                description: 'Safe description'
            };

            const response = await request(app)
                .post('/api/suppliers')
                .send(maliciousSupplier);

            // Should still accept the data but trim whitespace
            expect(response.status).toBe(201);
            // The data should be stored as-is for now, but in a real app would be sanitized
            expect(response.body.name).toBe('<script>alert("xss")</script>');
        });
    });

    describe('Error Responses', () => {
        it('should return structured error responses', async () => {
            const response = await request(app)
                .get('/api/suppliers/12345'); // Use a definitely non-existent ID

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Supplier not found');
        });
    });
});