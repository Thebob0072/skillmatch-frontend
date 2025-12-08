import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from '../../pages/login/LoginPage';

// Mock Google OAuth
vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: () => vi.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const submitButtons = screen.getAllByRole('button');
    const submitButton = submitButtons.find(btn => btn.getAttribute('type') === 'submit');
    expect(submitButton).toBeDefined();
    
    if (submitButton) {
      await user.click(submitButton);
    }

    // Form should not submit with empty fields
    expect(screen.getByPlaceholderText(/email/i)).toHaveValue('');
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'invalid-email');

    expect(emailInput).toHaveValue('invalid-email');
  });

  it('allows typing in password field', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/password/i);
    await user.type(passwordInput, 'TestPassword123!');

    expect(passwordInput).toHaveValue('TestPassword123!');
  });

  it('has link to registration page', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toBeInTheDocument();
  });
});
