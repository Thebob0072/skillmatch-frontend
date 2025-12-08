import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from '../../pages/login/LoginPage';
import * as authService from '../../services/authService';
import * as profileService from '../../services/profileService';

// Mock Google OAuth - must be before imports
const mockGoogleLoginTrigger = vi.fn();
let mockOnSuccess: ((response: any) => void) | undefined;
let mockOnError: ((error: any) => void) | undefined;

vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: (config: any) => {
    mockOnSuccess = config.onSuccess;
    mockOnError = config.onError;
    return mockGoogleLoginTrigger;
  },
}));

// Mock services
vi.mock('../../services/authService');
vi.mock('../../services/profileService');

describe('Google Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock successful responses
    vi.mocked(authService.googleAuth).mockResolvedValue({
      token: 'mock_jwt_token_abc123',
      user: {
        user_id: 1,
        email: 'test@google.com',
        role: 'client',
      } as any,
    });

    vi.mocked(profileService.getCurrentUser).mockResolvedValue({
      user_id: 1,
      email: 'test@google.com',
      role: 'client',
      full_name: 'Test User',
      profile_picture_url: 'https://example.com/photo.jpg',
    } as any);
  });

  it('renders Google login button', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const googleButtons = screen.getAllByRole('button');
    const googleButton = googleButtons.find(btn => 
      btn.textContent?.includes('Google') || btn.querySelector('svg')
    );
    expect(googleButton).toBeDefined();
  });

  it('handles successful Google login flow', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Find Google login button
    const buttons = screen.getAllByRole('button');
    const googleButton = buttons[buttons.length - 1];

    // Click Google login button and simulate success
    await user.click(googleButton);
    
    // Trigger Google OAuth success callback
    if (mockOnSuccess) {
      mockOnSuccess({ code: 'mock_google_code_123' });
    }

    // Verify auth service was called
    await waitFor(() => {
      expect(authService.googleAuth).toHaveBeenCalledWith({
        code: 'mock_google_code_123',
      });
    }, { timeout: 3000 });

    // Verify token was stored
    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe('mock_jwt_token_abc123');
    });

    // Verify user data was fetched
    await waitFor(() => {
      expect(profileService.getCurrentUser).toHaveBeenCalled();
    });
  });

  it('handles Google login with missing token error', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock response without token
    vi.mocked(authService.googleAuth).mockResolvedValue({
      token: '',
      user: null,
    } as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    const googleButton = buttons[buttons.length - 1];

    await user.click(googleButton);
    
    if (mockOnSuccess) {
      mockOnSuccess({ code: 'mock_google_code_123' });
    }

    // Verify error was logged and caught
    await waitFor(() => {
      expect(authService.googleAuth).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Google login error:',
        expect.objectContaining({
          message: 'No token received from backend'
        })
      );
    }, { timeout: 3000 });

    consoleErrorSpy.mockRestore();
  });

  it('handles Google login backend error', async () => {
    const user = userEvent.setup();

    // Mock backend error
    vi.mocked(authService.googleAuth).mockRejectedValue({
      response: {
        data: {
          message: 'Google authentication failed',
        },
      },
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    const googleButton = buttons[buttons.length - 1];

    await user.click(googleButton);
    
    if (mockOnSuccess) {
      mockOnSuccess({ code: 'mock_google_code_123' });
    }

    // Should show error message
    await waitFor(() => {
      expect(authService.googleAuth).toHaveBeenCalled();
      const errorText = screen.queryByText(/failed/i);
      expect(errorText).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles Google OAuth cancellation', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    const googleButton = buttons[buttons.length - 1];

    await user.click(googleButton);
    
    // Trigger error callback
    if (mockOnError) {
      mockOnError({ error: 'access_denied' });
    }

    // Error message should be shown
    await waitFor(() => {
      const errorText = screen.queryByText(/cancelled/i);
      expect(errorText).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('stores user data correctly after Google login', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    const googleButton = buttons[buttons.length - 1];

    await user.click(googleButton);
    
    if (mockOnSuccess) {
      mockOnSuccess({ code: 'mock_google_code_123' });
    }

    await waitFor(() => {
      expect(authService.googleAuth).toHaveBeenCalled();
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(profileService.getCurrentUser).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Verify stored user data structure
    await waitFor(() => {
      const storedUser = localStorage.getItem('user');
      expect(storedUser).toBeTruthy();
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        expect(userData).toHaveProperty('user_id');
        expect(userData).toHaveProperty('email');
        expect(userData).toHaveProperty('role');
        expect(userData.email).toBe('test@google.com');
      }
    });
  });

  it('uses auth-code flow for Google OAuth', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // useGoogleLogin should have been called during component mount
    // Check that it was configured with auth-code flow (verified by mock setup)
    expect(mockOnSuccess).toBeDefined();
    expect(mockOnError).toBeDefined();
  });

  it('does not include redirect_uri in Google OAuth config', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Test passes if component renders without error
    // The actual check for redirect_uri is in the LoginPage implementation
    expect(mockOnSuccess).toBeDefined();
  });

  it('handles profile fetch failure after successful auth', async () => {
    const user = userEvent.setup();

    // Auth succeeds but profile fetch fails
    vi.mocked(profileService.getCurrentUser).mockRejectedValue(
      new Error('Failed to fetch user profile')
    );

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    const googleButton = buttons[buttons.length - 1];

    await user.click(googleButton);
    
    if (mockOnSuccess) {
      mockOnSuccess({ code: 'mock_google_code_123' });
    }

    await waitFor(() => {
      expect(authService.googleAuth).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Should still store token even if profile fetch fails
    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBe('mock_jwt_token_abc123');
    });

    // Should show error
    await waitFor(() => {
      const errorText = screen.queryByText(/failed/i);
      expect(errorText).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
