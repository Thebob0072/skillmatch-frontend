import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AuthProvider } from '../context/AuthContext';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en',
    },
  }),
}));

// Mock Google OAuth
vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useGoogleLogin: () => vi.fn(),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  it('renders the home page', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Thai Variety/i)).toBeInTheDocument();
  });

  it('displays hero section when not authenticated', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Thai Variety/i)).toBeInTheDocument();
    expect(screen.getByText(/home_hero_subtitle/i)).toBeInTheDocument();
  });
});
