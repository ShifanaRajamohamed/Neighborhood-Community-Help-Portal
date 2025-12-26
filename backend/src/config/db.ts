import { User, HelpRequest, SystemLog } from '../../../shared/types';

/**
 * MOCK DATABASE CONNECTION
 * In a real Node.js app, this would use 'mysql2' or 'sequelize' to connect to the schema.sql DB.
 * For now, this provides an in-memory database for development.
 */
export class Database {
  private static instance: Database;
  
  // Tables (using arrays instead of Angular signals)
  public users: User[] = [
    { id: 1, name: 'Alice Requester', email: 'alice@test.com', role: 'requester', password: 'password', fullAddress: '123 Maple St, Springfield', abstractAddress: 'Springfield', isApproved: true },
    { id: 2, name: 'Bob Helper', email: 'bob@test.com', role: 'helper', password: 'password', fullAddress: '456 Oak Ave, Springfield', abstractAddress: 'Springfield', isApproved: true },
    { id: 3, name: 'Charlie Admin', email: 'admin@test.com', role: 'admin', password: 'password', fullAddress: '1 Admin Plaza, Metro City', abstractAddress: 'Metro City', isApproved: true },
    { id: 4, name: 'Diana Requester', email: 'diana@test.com', role: 'requester', password: 'password', fullAddress: '789 Pine Ln, Springfield', abstractAddress: 'Springfield', isApproved: true },
    { id: 5, name: 'Eve Helper', email: 'eve@test.com', role: 'helper', password: 'password', fullAddress: '101 Elm Ct, Springfield', abstractAddress: 'Springfield', isApproved: false }
  ];

  public requests: HelpRequest[] = [
    {
      id: 101,
      requesterId: 1,
      requesterName: 'Alice Requester',
      helperId: null,
      helperName: null,
      title: 'Leaky Kitchen Faucet',
      description: 'The faucet in my kitchen is dripping constantly. Need someone with basic plumbing skills.',
      category: 'Plumbing',
      status: 'pending',
      isUrgent: true,
      createdAt: new Date(Date.now() - 86400000),
      fullAddress: '123 Maple St, Kitchen',
      abstractAddress: 'Springfield',
      offers: [],
      complexity: 'Medium',
      estimatedDuration: '1-2 Hours',
      preferredTime: 'Evenings',
      timeline: [
        { status: 'pending', timestamp: new Date(Date.now() - 86400000), note: 'Request Created' }
      ]
    },
    {
      id: 102,
      requesterId: 1,
      requesterName: 'Alice Requester',
      helperId: 2,
      helperName: 'Bob Helper',
      title: 'Grocery Run for Senior',
      description: 'I need help picking up 5 items from the local store. I am unable to drive this week.',
      category: 'Grocery',
      status: 'in_progress',
      isUrgent: false,
      createdAt: new Date(Date.now() - 172800000),
      fullAddress: '123 Maple St',
      abstractAddress: 'Springfield',
      offers: [],
      complexity: 'Low',
      estimatedDuration: '45 Mins',
      preferredTime: 'Anytime',
      timeline: [
        { status: 'pending', timestamp: new Date(Date.now() - 172800000) },
        { status: 'accepted', timestamp: new Date(Date.now() - 100000000) },
        { status: 'in_progress', timestamp: new Date(Date.now() - 3600000) }
      ]
    },
    {
      id: 103,
      requesterId: 4,
      requesterName: 'Diana Requester',
      helperId: null,
      helperName: null,
      title: 'Move Heavy Sofa',
      description: 'Need a strong pair of hands to help move a sofa to the garage.',
      category: 'Moving',
      status: 'offered',
      isUrgent: false,
      createdAt: new Date(Date.now() - 3600000),
      fullAddress: '789 Pine Ln, Garage',
      abstractAddress: 'Springfield',
      offers: [{ helperId: 2, helperName: 'Bob Helper'}],
      complexity: 'High',
      estimatedDuration: '30 Mins',
      preferredTime: 'Saturday Morning',
      timeline: [
        { status: 'pending', timestamp: new Date(Date.now() - 3600000) },
        { status: 'offered', timestamp: new Date(Date.now() - 1800000) }
      ]
    },
    {
      id: 104,
      requesterId: 1,
      requesterName: 'Alice Requester',
      helperId: null,
      helperName: null,
      title: 'Dog Walking Needed',
      description: 'I broke my leg and cannot walk my Golden Retriever, Max. He needs a 30 min walk daily.',
      category: 'Pet Care',
      status: 'pending',
      isUrgent: true,
      createdAt: new Date(Date.now() - 7200000),
      fullAddress: '123 Maple St',
      abstractAddress: 'Springfield',
      offers: [],
      complexity: 'Low',
      estimatedDuration: '30 Mins',
      preferredTime: 'Mornings',
      timeline: [
        { status: 'pending', timestamp: new Date(Date.now() - 7200000) }
      ]
    },
    {
      id: 105,
      requesterId: 4,
      requesterName: 'Diana Requester',
      helperId: 2,
      helperName: 'Bob Helper',
      title: 'Math Tutoring for 5th Grader',
      description: 'Looking for someone to help my son with fractions and decimals twice a week.',
      category: 'Tutoring',
      status: 'completed',
      isUrgent: false,
      createdAt: new Date(Date.now() - 180000000),
      fullAddress: '789 Pine Ln',
      abstractAddress: 'Springfield',
      offers: [],
      complexity: 'Medium',
      estimatedDuration: '1 Hour',
      preferredTime: 'Weekdays 4PM',
      timeline: [
        { status: 'pending', timestamp: new Date(Date.now() - 180000000) },
        { status: 'accepted', timestamp: new Date(Date.now() - 170000000) },
        { status: 'in_progress', timestamp: new Date(Date.now() - 160000000) },
        { status: 'completed', timestamp: new Date(Date.now() - 150000000) },
      ]
    }
  ];

  public logs: SystemLog[] = [];

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
