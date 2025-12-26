import { User, HelpRequest } from '../../../shared/types';

/**
 * MOCK DATABASE CONNECTION
 * In a real Node.js app, this would use 'mysql2' or 'sequelize' to connect to the schema.sql DB.
 * For now, this provides an in-memory database for development.
 */
export class Database {
  private static instance: Database;

  // Tables (using arrays instead of Angular signals)
  public users: User[] = [
    { id: 1, name: 'Alice Resident', contact_info: 'alice@test.com', location: 'Springfield', role: 'Resident', password: 'password', created_at: '2025-01-01T00:00:00Z', isApproved: true, email: 'alice@test.com' },
    { id: 2, name: 'Bob Helper', contact_info: 'bob@test.com', location: 'Springfield', role: 'Helper', password: 'password', created_at: '2025-01-01T00:00:00Z', isApproved: true, email: 'bob@test.com' },
    { id: 3, name: 'Charlie Helper', contact_info: 'charlie@test.com', location: 'Springfield', role: 'Helper', password: 'password', created_at: '2025-01-01T00:00:00Z', isApproved: false, email: 'charlie@test.com' }
  ];

  public requests: HelpRequest[] = [
    {
      id: 101,
      resident_id: 1,
      helper_id: null,
      title: 'Leaky Kitchen Faucet',
      description: 'The faucet in my kitchen is dripping constantly. Need someone with basic plumbing skills.',
      category: 'Plumbing',
      status: 'Pending',
      created_at: '2025-01-01T00:00:00Z',
      requesterId: 1,
      requesterName: 'Alice Resident',
      offers: [],
      timeline: [{ status: 'Pending', timestamp: new Date('2025-01-01T00:00:00Z'), note: 'Request Created' }]
    },
    {
      id: 102,
      resident_id: 1,
      helper_id: 2,
      title: 'Grocery Run for Senior',
      description: 'I need help picking up 5 items from the local store. I am unable to drive this week.',
      category: 'Grocery',
      status: 'In-progress',
      created_at: '2025-01-02T00:00:00Z',
      requesterId: 1,
      requesterName: 'Alice Resident',
      helperName: 'Bob Helper',
      offers: [],
      timeline: [
        { status: 'Pending', timestamp: new Date('2025-01-02T00:00:00Z'), note: 'Request Created' },
        { status: 'Accepted', timestamp: new Date('2025-01-02T01:00:00Z'), note: 'Accepted by Bob Helper' }
      ]
    },
    {
      id: 103,
      resident_id: 1,
      helper_id: 2,
      title: 'Dog Walking Needed',
      description: 'I broke my leg and cannot walk my Golden Retriever, Max. He needs a 30 min walk daily.',
      category: 'Pet Care',
      status: 'Completed',
      created_at: '2025-01-03T00:00:00Z',
      requesterId: 1,
      requesterName: 'Alice Resident',
      helperName: 'Bob Helper',
      offers: [],
      timeline: [
        { status: 'Pending', timestamp: new Date('2025-01-03T00:00:00Z'), note: 'Request Created' },
        { status: 'Accepted', timestamp: new Date('2025-01-03T01:00:00Z'), note: 'Accepted by Bob Helper' },
        { status: 'Completed', timestamp: new Date('2025-01-03T02:00:00Z'), note: 'Completed by Bob Helper' }
      ]
    }
  ];

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
