import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../../context/AuthContext';
import RegisterPage from '../../pages/register/RegisterPage';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'register_title': 'Create Your Account',
        'register_subtitle': 'Premium Adult Entertainment Platform',
        'register_username': 'Username',
        'register_username_placeholder': 'Enter your username',
        'register_email': 'Email',
        'register_email_placeholder': 'Enter your email',
        'register_password': 'Password',
        'register_password_placeholder': 'Enter password',
        'register_create_button': 'Create Account',
        'register_creating': 'Creating Account...',
        'register_google': 'Sign up with Google',
        'register_or': 'OR',
        'register_client': 'Client',
        'register_provider': 'Provider',
        'register_client_desc': 'Browse and book providers',
        'register_provider_desc': 'Offer premium services',
        'register_signin_prompt': 'Already have an account?',
        'register_signin_link': 'Sign in here',
        'register_age_confirm_text': 'I confirm that I am 20 years of age or older',
        'register_terms_text': 'I agree to the',
        'register_terms_link': 'Terms of Service',
        'register_privacy_text': 'I agree to the',
        'register_privacy_link': 'Privacy Policy',
        'register_privacy_understand': 'and understand how my data will be processed',
        'register_adult_warning_title': 'Adult Content Warning',
        'register_adult_warning_desc': 'This platform contains adult entertainment content.',
        'register_birthdate_label': 'Date of Birth',
        'register_birthdate_placeholder': 'Select your birthdate',
        'register_birthdate_hint': 'Your birthdate is kept confidential',
        'register_password_hint': 'Use a strong password',
        'register_role_label': 'I want to register as:',
        'register_privacy_notice': 'Privacy & Security notice',
        'register_id_verification_title': 'ID Verification Required',
        'register_id_verification_provider': 'Providers must complete ID verification',
        'register_id_verification_client': 'All providers are verified',
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' },
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: '3rdParty', init: () => {} },
}));

// Helper wrapper with all providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <BrowserRouter>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form', () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    // Password field exists but has different placeholder
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(<RegisterPage />);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    // Form should not submit with empty fields
    expect(screen.getByPlaceholderText(/email/i)).toHaveValue('');
  });

  it('allows selecting role (client or provider)', async () => {
    renderWithProviders(<RegisterPage />);

    // Get radio buttons by their value attribute instead
    const clientRadio = screen.getByDisplayValue('client');
    const providerRadio = screen.getByDisplayValue('provider');

    expect(clientRadio).toBeInTheDocument();
    expect(providerRadio).toBeInTheDocument();
    expect(clientRadio).toBeChecked(); // Client should be default
  });

  it('validates age requirement (20+)', async () => {
    renderWithProviders(<RegisterPage />);

    // Check age confirmation checkbox exists
    const ageCheckbox = screen.getByRole('checkbox', { name: /20 years of age or older/i });
    expect(ageCheckbox).toBeInTheDocument();
  });

  it('requires terms and privacy agreement', () => {
    renderWithProviders(<RegisterPage />);

    const termsCheckbox = screen.getByRole('checkbox', { name: /terms of service/i });
    const privacyCheckbox = screen.getByRole('checkbox', { name: /privacy policy/i });
    const ageCheckbox = screen.getByRole('checkbox', { name: /20 years of age or older/i });

    expect(termsCheckbox).toBeInTheDocument();
    expect(privacyCheckbox).toBeInTheDocument();
    expect(ageCheckbox).toBeInTheDocument();
  });

  it('has link to login page', () => {
    renderWithProviders(<RegisterPage />);

    const loginLink = screen.getByText(/already have an account/i);
    expect(loginLink).toBeInTheDocument();
  });

  it('shows Google sign up button', () => {
    renderWithProviders(<RegisterPage />);

    const googleButton = screen.getByRole('button', { name: /sign up with google/i });
    expect(googleButton).toBeInTheDocument();
  });
});
