import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UserController } from './controllers/user.controller';
import { RequestController } from './controllers/request.controller';
import { UserService } from './services/user.service';
import { RequestService } from './services/request.service';
import { UserRepository } from './repositories/user.repository';
import { RequestRepository } from './repositories/request.repository';
import { authenticateToken, requireResident, requireHelper } from './middleware/auth.middleware';
import { Database } from './config/db';

dotenv.config();

// Initialize database
Database.getInstance();

// Initialize repositories
const userRepository = new UserRepository();
const requestRepository = new RequestRepository();

// Initialize services
const userService = new UserService(userRepository);
const requestService = new RequestService(requestRepository);

// Initialize controllers
const userController = new UserController(userService);
const requestController = new RequestController(requestService);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await userController.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { contact_info, password } = req.body;
    const user = await userController.login(contact_info, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const userData = req.body;
    const user = await userController.create(userData);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.put('/api/users/:id/approve', authenticateToken, async (req, res) => {
  try {
    const helperId = parseInt(req.params.id);
    await userController.approveHelper(helperId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve helper' });
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const requests = await requestController.getAll();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

app.post('/api/requests', authenticateToken, requireResident, async (req, res) => {
  try {
    const requestData = req.body;
    const request = await requestController.create(requestData);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

app.put('/api/requests/:id', authenticateToken, async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const updates = req.body;
    const request = await requestController.update(requestId, updates);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

app.delete('/api/requests/:id', authenticateToken, async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const success = await requestController.delete(requestId);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

app.post('/api/requests/:id/offers', authenticateToken, requireHelper, async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const offer = req.body;
    await requestController.makeOffer(requestId, offer);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to make offer' });
  }
});

app.put('/api/requests/:id/accept/:helperId', authenticateToken, requireResident, async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const helperId = parseInt(req.params.helperId);
    await requestController.acceptOffer(requestId, helperId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept offer' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET  /api/users');
  console.log('- POST /api/users/login');
  console.log('- POST /api/users/register');
  console.log('- PUT  /api/users/:id/approve');
  console.log('- GET  /api/requests');
  console.log('- POST /api/requests');
  console.log('- PUT  /api/requests/:id');
  console.log('- DELETE /api/requests/:id');
  console.log('- POST /api/requests/:id/offers');
  console.log('- PUT  /api/requests/:id/accept/:helperId');
  console.log('- GET  /api/logs');
});
