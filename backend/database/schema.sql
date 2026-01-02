-- Neighborhood Community Help Portal Database Schema
-- Only 2 Tables as per requirements

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS HelpRequests;
DROP TABLE IF EXISTS Users;

-- ============================================
-- Table 1: Users
-- ============================================
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_info VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NULL,
  location VARCHAR(255) NOT NULL,
  full_address VARCHAR(500) NULL,
  abstract_address VARCHAR(255) NULL,
  role ENUM('helper', 'admin', 'requester') NOT NULL DEFAULT 'requester',
  password VARCHAR(255) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_role (role),
  INDEX idx_contact (contact_info),
  INDEX idx_is_approved (is_approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 2: HelpRequests
-- ============================================
CREATE TABLE HelpRequests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  requester_id INT NOT NULL,
  requester_name VARCHAR(255) NULL,
  helper_id INT NULL,
  helper_name VARCHAR(255) NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  attachments TEXT NULL,
  full_address VARCHAR(500) NULL,
  abstract_address VARCHAR(255) NULL,
  is_urgent BOOLEAN DEFAULT FALSE,
  complexity ENUM('Low', 'Medium', 'High') NULL,
  estimated_duration VARCHAR(100) NULL,
  preferred_time VARCHAR(100) NULL,
  offers JSON NULL,
  timeline JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  CONSTRAINT fk_requester FOREIGN KEY (requester_id) 
    REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_helper FOREIGN KEY (helper_id) 
    REFERENCES Users(id) ON DELETE SET NULL,
  
  -- Indexes for performance
  INDEX idx_requester (requester_id),
  INDEX idx_helper (helper_id),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Sample Users
INSERT INTO Users (name, contact_info, email, location, full_address, abstract_address, role, password, is_approved) VALUES
('John Doe', 'john.doe@email.com', 'john.doe@email.com', '123 Main St, Downtown', '123 Main St, Downtown', 'Downtown', 'requester', '$2a$10$YourHashedPasswordHere', TRUE),
('Jane Smith', 'jane.smith@email.com', 'jane.smith@email.com', '456 Oak Ave, Uptown', '456 Oak Ave, Uptown', 'Uptown', 'helper', '$2a$10$YourHashedPasswordHere', TRUE),
('Admin User', 'admin@portal.com', 'admin@portal.com', 'Portal HQ', 'Portal HQ', 'HQ', 'admin', '$2a$10$YourHashedPasswordHere', TRUE);

-- Sample Help Requests
INSERT INTO HelpRequests (requester_id, requester_name, title, description, category, status, full_address, abstract_address, is_urgent, complexity, estimated_duration, preferred_time, offers, timeline) VALUES
(1, 'John Doe', 'Need help with plumbing', 'Kitchen sink is leaking and needs repair', 'Plumbing', 'pending', '123 Main St, Downtown', 'Downtown', FALSE, 'Medium', '2 hours', 'Weekends', '[]', '[{"status":"pending","timestamp":"2024-01-01T00:00:00.000Z","note":"Request Created"}]'),
(1, 'John Doe', 'Grocery shopping assistance', 'Need someone to help pick up groceries from store', 'Grocery', 'pending', '123 Main St, Downtown', 'Downtown', FALSE, 'Low', '1 hour', 'Mornings', '[]', '[{"status":"pending","timestamp":"2024-01-01T00:00:00.000Z","note":"Request Created"}]');

-- ============================================
-- Verification Queries
-- ============================================

-- View all users
-- SELECT id, name, contact_info, email, location, full_address, abstract_address, role, is_approved, created_at FROM Users;

-- View all requests with user details
-- SELECT 
--   r.id,
--   r.title,
--   r.category,
--   r.status,
--   u1.name as requester_name,
--   u2.name as helper_name,
--   r.created_at
-- FROM HelpRequests r
-- INNER JOIN Users u1 ON r.requester_id = u1.id
-- LEFT JOIN Users u2 ON r.helper_id = u2.id;
