/// <reference types="jest" />
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import userRoutes from '../src/routes/userRoutes';

// Mock the database for integration tests
jest.mock('../src/config/database', () => ({
  default: {
    execute: jest.fn()
  }
}));

describe('Authentication API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    // Create express app for testing
    app = express();
    app.use(express.json());
    app.use(cors());

    // Setup routes
    app.use('/api/auth', userRoutes);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Integration Test User',
        contact_info: 'integration@test.com',
        email: 'integration@test.com',
        location: 'Test City',
        full_address: '123 Test St, Test City',
        role: 'requester',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.name).toBe(userData.name);
    });

    it('should reject registration with invalid data', async () => {
      const invalidUserData = {
        name: '',
        contact_info: 'invalid-email',
        role: 'requester',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it('should reject duplicate contact info', async () => {
      const userData = {
        name: 'Duplicate User',
        contact_info: 'duplicate@test.com',
        email: 'duplicate@test.com',
        location: 'Test City',
        role: 'requester',
        password: 'testpassword123'
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same contact info
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Register a user for login tests
      const userData = {
        name: 'Login Test User',
        contact_info: 'login@test.com',
        email: 'login@test.com',
        location: 'Test City',
        role: 'requester',
        password: 'testpassword123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        contact_info: 'login@test.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.contact_info).toBe(loginData.contact_info);
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        contact_info: 'login@test.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject login for non-existent user', async () => {
      const loginData = {
        contact_info: 'nonexistent@test.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });
});
