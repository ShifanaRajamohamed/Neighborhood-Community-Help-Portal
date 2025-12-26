import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userController, requestController } from './routes/api.routes';
import { loggerMiddleware } from './middleware/logger.middleware';
import { Database } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/users', (req, res) => {
  try {
    const users = userController.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = userController.login(email, password);
    if (user) {
      loggerMiddleware('LOGIN_ATTEMPT', { email, success: true });
      res.json(user);
    } else {
      loggerMiddleware('LOGIN_ATTEMPT', { email, success: false });
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/users/register', (req, res) => {
  try {
    const userData = req.body;
    const user = userController.create(userData);
    loggerMiddleware('REGISTER_USER', { name: user.name });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.put('/api/users/:id/approve', (req, res) => {
  try {
    const helperId = parseInt(req.params.id);
    userController.approveHelper(helperId);
    loggerMiddleware('APPROVE_HELPER', { helperId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve helper' });
  }
});

app.get('/api/requests', (req, res) => {
  try {
    const requests = requestController.getAll();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

app.post('/api/requests', (req, res) => {
  try {
    const requestData = req.body;
    requestController.create(requestData);
    loggerMiddleware('CREATE_REQUEST', { title: requestData.title });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

app.put('/api/requests/:id', (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const updates = req.body;
    requestController.update(requestId, updates);
    loggerMiddleware('UPDATE_REQUEST', { id: requestId, updates });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

app.delete('/api/requests/:id', (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    requestController.delete(requestId);
    loggerMiddleware('DELETE_REQUEST', { id: requestId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

app.post('/api/requests/:id/offers', (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const offer = req.body;
    requestController.makeOffer(requestId, offer);
    loggerMiddleware('MAKE_OFFER', { requestId, helperId: offer.helperId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to make offer' });
  }
});

app.put('/api/requests/:id/accept/:helperId', (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const helperId = parseInt(req.params.helperId);
    requestController.acceptOffer(requestId, helperId);
    loggerMiddleware('ACCEPT_OFFER', { requestId, helperId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept offer' });
  }
});

// Get system logs (admin endpoint)
app.get('/api/logs', (req, res) => {
  try {
    const db = Database.getInstance();
    res.json(db.logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
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
