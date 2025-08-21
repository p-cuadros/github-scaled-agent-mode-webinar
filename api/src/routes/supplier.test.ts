import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import supplierRouter, { resetSuppliers } from './supplier';
import { suppliers as seedSuppliers } from '../seedData';

let app: express.Express;

describe('Supplier API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/suppliers', supplierRouter);
        resetSuppliers();
    });

    it('should create a new supplier', async () => {
        const newSupplier = {
            supplierId: 4,
            name: "Test Cat Solutions",
            description: "A test supplier for automated testing",
            contactPerson: "Test Person",
            email: "test@testcatsolutions.com",
            phone: "555-0999"
        };
        const response = await request(app).post('/suppliers').send(newSupplier);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newSupplier);
    });

    it('should get all suppliers', async () => {
        const response = await request(app).get('/suppliers');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedSuppliers.length);
        response.body.forEach((supplier: any, index: number) => {
            expect(supplier).toMatchObject(seedSuppliers[index]);
        });
    });

    it('should get a supplier by ID', async () => {
        const response = await request(app).get('/suppliers/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedSuppliers[0]);
    });

    it('should update a supplier by ID', async () => {
        const updatedSupplier = {
            ...seedSuppliers[0],
            name: 'Updated PurrTech Innovations',
            contactPerson: 'Updated Felix Whiskerton'
        };
        const response = await request(app).put('/suppliers/1').send(updatedSupplier);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedSupplier);
    });

    it('should delete a supplier by ID', async () => {
        const response = await request(app).delete('/suppliers/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing supplier', async () => {
        const response = await request(app).get('/suppliers/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 when updating non-existing supplier', async () => {
        const nonExistentSupplier = {
            supplierId: 999,
            name: "Non-existent Supplier",
            description: "This supplier does not exist",
            contactPerson: "Fake Person",
            email: "fake@example.com",
            phone: "555-0000"
        };
        const response = await request(app).put('/suppliers/999').send(nonExistentSupplier);
        expect(response.status).toBe(404);
    });

    it('should return 404 when deleting non-existing supplier', async () => {
        const response = await request(app).delete('/suppliers/999');
        expect(response.status).toBe(404);
    });
});