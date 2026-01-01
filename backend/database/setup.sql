-- ========================================
-- Neighborhood Community Help Portal
-- Database Setup Script
-- ========================================
-- Purpose:
--  - Create tables
--  - Insert sample data
--  - Fix JSON columns safely
--  - NO user / privilege manipulation
-- ========================================

-- Ensure correct database is selected
USE neighborhood_portal;

-- ========================================
-- Drop existing tables (safe for dev)
-- ========================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS HelpRequests;

DROP TABLE IF EXISTS Users;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- Table: Users
-- ========================================
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NULL,
    location VARCHAR(255) NOT NULL,
    full_address VARCHAR(500) NULL,
    abstract_address VARCHAR(255) NULL,
    role ENUM(
        'helper',
        'admin',
        'requester'
    ) NOT NULL DEFAULT 'requester',
    password VARCHAR(255) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_contact (contact_info),
    INDEX idx_is_approved (is_approved)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ========================================
-- Table: HelpRequests
-- ========================================
CREATE TABLE HelpRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT NOT NULL,
    requester_id INT NULL,
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
    offers JSON NOT NULL DEFAULT(JSON_ARRAY()),
    timeline JSON NOT NULL DEFAULT(JSON_ARRAY()),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_resident FOREIGN KEY (resident_id) REFERENCES Users (id) ON DELETE CASCADE,
    CONSTRAINT fk_helper FOREIGN KEY (helper_id) REFERENCES Users (id) ON DELETE SET NULL,
    INDEX idx_resident (resident_id),
    INDEX idx_requester (requester_id),
    INDEX idx_helper (helper_id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_created (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ========================================
-- Sample Data (Development Only)
-- ========================================

INSERT INTO
    Users (
        name,
        contact_info,
        email,
        location,
        full_address,
        abstract_address,
        role,
        password,
        is_approved
    )
VALUES (
        'John Doe',
        'john.doe@email.com',
        'shifa@gmail.com',
        '123 Main St, Downtown',
        '123 Main St, Downtown',
        'Downtown',
        'admin',
        '$2a$10$O3jYvI.Oos9uRrJ3FPemoOdx9Uk.mITl1pVhn7Gmm2Wa.qiW9vfI.',
        TRUE
    ),
    (
        'Jane Smith',
        'jane.smith@email.com',
        'jane.smith@email.com',
        '456 Oak Ave, Uptown',
        '456 Oak Ave, Uptown',
        'Uptown',
        'helper',
        '$2a$10$YourHashedPasswordHere',
        TRUE
    ),
    (
        'Admin User',
        'admin@portal.com',
        'admin@portal.com',
        'Portal HQ',
        'Portal HQ',
        'HQ',
        'admin',
        '$2a$10$YourHashedPasswordHere',
        TRUE
    );

INSERT INTO
    HelpRequests (
        resident_id,
        requester_id,
        requester_name,
        title,
        description,
        category,
        status,
        full_address,
        abstract_address,
        is_urgent,
        complexity,
        estimated_duration,
        preferred_time,
        offers,
        timeline
    )
VALUES (
        1,
        1,
        'John Doe',
        'Need help with plumbing',
        'Kitchen sink is leaking and needs repair',
        'Plumbing',
        'pending',
        '123 Main St, Downtown',
        'Downtown',
        FALSE,
        'Medium',
        '2 hours',
        'Weekends',
        JSON_ARRAY(),
        JSON_ARRAY(
            JSON_OBJECT(
                'status',
                'pending',
                'timestamp',
                '2024-01-01T00:00:00Z',
                'note',
                'Request Created'
            )
        )
    ),
    (
        1,
        1,
        'John Doe',
        'Grocery shopping assistance',
        'Need someone to help pick up groceries',
        'Grocery',
        'pending',
        '123 Main St, Downtown',
        'Downtown',
        FALSE,
        'Low',
        '1 hour',
        'Mornings',
        JSON_ARRAY(),
        JSON_ARRAY(
            JSON_OBJECT(
                'status',
                'pending',
                'timestamp',
                '2024-01-01T00:00:00Z',
                'note',
                'Request Created'
            )
        )
    );

-- ========================================
-- Verification Queries (Optional)
-- ========================================
-- SELECT * FROM Users;
-- SELECT * FROM HelpRequests;