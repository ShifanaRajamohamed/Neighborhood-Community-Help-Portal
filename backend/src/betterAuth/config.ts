import { betterAuth } from 'better-auth';
import { mysqlAdapter } from 'better-auth/adapters/mysql2';
import pool from '../config/database';

export const auth = betterAuth({
  database: mysqlAdapter(pool),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    // Can be extended with OAuth providers later
  },
  user: {
    modelName: 'Users',
    fields: {
      email: 'contact_info',
      name: 'name',
      role: 'role',
      isApproved: 'is_approved',
    },
    additionalFields: {
      location: {
        type: 'string',
      },
      full_address: {
        type: 'string',
      },
      abstract_address: {
        type: 'string',
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  advanced: {
    cookiePrefix: 'help_hive',
  },
});
