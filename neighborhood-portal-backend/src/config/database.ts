import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'neighborhood_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  maxIdle: 10,
  idleTimeout: 60000,
  connectTimeout: 10000
});

// Connection pool error handling
pool.on('connection', () => {
  console.log('✓ New database connection established');
});

pool.on('release', () => {
  console.log('✓ Connection returned to pool');
});

// Test database connection with retry logic
export const testConnection = async (retries = 3): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('✓ Database connected successfully');
      console.log(`✓ Pool stats: ${pool.pool.config.connectionLimit} max connections`);
      connection.release();
      return;
    } catch (error) {
      console.error(`✗ Database connection attempt ${i + 1}/${retries} failed:`, error);
      if (i === retries - 1) {
        console.error('✗ All connection attempts exhausted');
        throw error;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('✓ Database connection pool closed gracefully');
  } catch (error) {
    console.error('✗ Error closing database pool:', error);
    throw error;
  }
};

// Handle process termination
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing database connections');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing database connections');
  await closePool();
  process.exit(0);
});

export default pool;
