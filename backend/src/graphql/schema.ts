import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # User types
  type User {
    id: ID!
    name: String!
    contact_info: String!
    email: String
    location: String!
    full_address: String
    abstract_address: String
    role: UserRole!
    is_approved: Boolean!
    created_at: String!
  }

  enum UserRole {
    resident
    helper
    admin
    requester
  }

  # Request types
  type HelpRequest {
    id: ID!
    resident_id: Int!
    requester_id: Int!
    requester_name: String!
    helper_id: Int
    helper_name: String
    title: String!
    description: String!
    category: String!
    status: RequestStatus!
    full_address: String
    abstract_address: String
    is_urgent: Boolean!
    complexity: Complexity
    estimated_duration: String
    preferred_time: String
    offers: [Offer!]!
    timeline: [TimelineEvent!]!
    created_at: String!
    updated_at: String!
  }

  enum RequestStatus {
    pending
    offered
    accepted
    in_progress
    completed
  }

  enum Complexity {
    Low
    Medium
    High
  }

  type Offer {
    helperId: Int!
    helperName: String!
    offeredAt: String!
  }

  type TimelineEvent {
    status: String!
    timestamp: String!
    note: String
  }

  # Input types
  input CreateUserInput {
    name: String!
    contact_info: String!
    email: String
    location: String!
    full_address: String
    abstract_address: String
    role: UserRole
    password: String!
  }

  input LoginInput {
    contact_info: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    contact_info: String
    email: String
    location: String
    full_address: String
    abstract_address: String
  }

  input CreateRequestInput {
    title: String!
    description: String!
    category: String!
    full_address: String
    abstract_address: String
    is_urgent: Boolean
    complexity: Complexity
    estimated_duration: String
    preferred_time: String
  }

  input UpdateRequestStatusInput {
    status: RequestStatus!
  }

  input MakeOfferInput {
    helperId: Int!
    helperName: String!
  }

  # Response types
  type AuthResponse {
    success: Boolean!
    data: AuthData
    message: String
  }

  type AuthData {
    user: User!
    token: String!
  }

  type ApiResponse {
    success: Boolean!
    data: String
    message: String
  }

  type UserResponse {
    success: Boolean!
    data: User
    message: String
  }

  type UsersResponse {
    success: Boolean!
    data: [User!]!
    message: String
  }

  type RequestResponse {
    success: Boolean!
    data: HelpRequest
    message: String
  }

  type RequestsResponse {
    success: Boolean!
    data: [HelpRequest!]!
    message: String
  }

  # Query definitions
  type Query {
    # User queries
    me: UserResponse!
    users: UsersResponse!
    user(id: ID!): UserResponse!

    # Request queries
    requests(
      status: RequestStatus
      category: String
      limit: Int
      offset: Int
    ): RequestsResponse!
    request(id: ID!): RequestResponse!
    myRequests: RequestsResponse!
    availableRequests: RequestsResponse!
    helperAcceptedRequests: RequestsResponse!
    helperInProgressRequests: RequestsResponse!
    helperCompletedRequests: RequestsResponse!
    unapprovedHelpers: UsersResponse!
    stats: RequestStatsResponse!
  }

  type RequestStatsResponse {
    success: Boolean!
    data: RequestStats!
    message: String
  }

  type RequestStats {
    total: Int!
    pending: Int!
    active: Int!
    completed: Int!
  }

  # Mutation definitions
  type Mutation {
    # Authentication mutations
    register(input: CreateUserInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    logout: ApiResponse!

    # User mutations
    updateUser(id: ID!, input: UpdateUserInput!): UserResponse!
    approveHelper(id: ID!): UserResponse!

    # Request mutations
    createRequest(input: CreateRequestInput!): RequestResponse!
    updateRequestStatus(id: ID!, input: UpdateRequestStatusInput!): RequestResponse!
    makeOffer(requestId: ID!, input: MakeOfferInput!): RequestResponse!
    acceptOffer(requestId: ID!, helperId: Int!): RequestResponse!
    deleteRequest(id: ID!): ApiResponse!
  }
`;
