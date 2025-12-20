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
  location VARCHAR(255) NOT NULL,
  role ENUM('resident', 'helper', 'admin') NOT NULL DEFAULT 'resident',
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_role (role),
  INDEX idx_contact (contact_info)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table 2: HelpRequests
-- ============================================
CREATE TABLE HelpRequests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resident_id INT NOT NULL,
  helper_id INT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  status ENUM('pending', 'accepted', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  attachments TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  CONSTRAINT fk_resident FOREIGN KEY (resident_id) 
    REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_helper FOREIGN KEY (helper_id) 
    REFERENCES Users(id) ON DELETE SET NULL,
  
  -- Indexes for performance
  INDEX idx_resident (resident_id),
  INDEX idx_helper (helper_id),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Sample Users
INSERT INTO Users (name, contact_info, location, role, password) VALUES
('John Doe', 'john.doe@email.com', '123 Main St, Downtown', 'resident', '$2a$10$YourHashedPasswordHere'),
('Jane Smith', 'jane.smith@email.com', '456 Oak Ave, Uptown', 'helper', '$2a$10$YourHashedPasswordHere'),
('Admin User', 'admin@portal.com', 'Portal HQ', 'admin', '$2a$10$YourHashedPasswordHere');

-- Sample Help Requests
INSERT INTO HelpRequests (resident_id, title, description, category, status) VALUES
(1, 'Need help with plumbing', 'Kitchen sink is leaking and needs repair', 'plumbing', 'pending'),
(1, 'Grocery shopping assistance', 'Need someone to help pick up groceries from store', 'grocery', 'pending');

-- ============================================
-- Verification Queries
-- ============================================

-- View all users
-- SELECT id, name, contact_info, location, role, created_at FROM Users;

-- View all requests with user details
-- SELECT 
--   r.id,
--   r.title,
--   r.category,
--   r.status,
--   u1.name as resident_name,
--   u2.name as helper_name,
--   r.created_at
-- FROM HelpRequests r
-- INNER JOIN Users u1 ON r.resident_id = u1.id
-- LEFT JOIN Users u2 ON r.helper_id = u2.id;
