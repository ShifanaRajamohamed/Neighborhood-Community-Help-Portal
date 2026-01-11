describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should load the landing page with honeycomb image', () => {
    cy.visit('/');

    // Check if page loads
    cy.contains('HELP HIVE').should('be.visible');

    // Check if honeycomb image is visible
    cy.get('img[alt="Honeycomb"]').should('be.visible');

    // Check navigation elements
    cy.contains('Login').should('be.visible');
    cy.contains('Join Hive').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.contains('SIGN IN').should('be.visible');
  });

  it('should navigate to registration page', () => {
    cy.visit('/');
    cy.contains('Join Hive').click();
    cy.url().should('include', '/register');
    cy.contains('CREATE ACCOUNT').should('be.visible');
  });

  it('should show login form elements', () => {
    cy.visit('/login');

    // Check form elements
    cy.get('input[name="contact_info"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.contains('SIGN IN').should('be.visible');
    cy.contains('No account? Create one').should('be.visible');
  });

  it('should show registration form elements', () => {
    cy.visit('/register');

    // Check form elements
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="contact_info"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="location"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.contains('CREATE ACCOUNT').should('be.visible');
  });

  it('should reject login with invalid credentials', () => {
    cy.visit('/login');

    cy.get('input[name="contact_info"]').type('invalid@test.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.contains('SIGN IN').click();

    // Should show error message
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('should successfully login with demo credentials', () => {
    cy.login('admin@portal.com', 'password');

    // Should redirect to dashboard or main app
    cy.url().should('not.include', '/login');
    cy.contains('Dashboard').should('be.visible');
  });

  it('should successfully register a new user', () => {
    const testUser = {
      name: 'E2E Test User',
      contact_info: `e2e-${Date.now()}@test.com`,
      email: `e2e-${Date.now()}@test.com`,
      location: 'Test City',
      role: 'requester',
      password: 'testpassword123'
    };

    cy.registerUser(testUser);

    // Should redirect after successful registration
    cy.url().should('not.include', '/register');
    cy.contains('Dashboard').should('be.visible');
  });

  it('should maintain login session across page refreshes', () => {
    cy.login('admin@portal.com', 'password');

    // Refresh the page
    cy.reload();

    // Should still be logged in
    cy.url().should('not.include', '/login');
    cy.contains('Dashboard').should('be.visible');
  });
});
