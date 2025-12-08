import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LanguageSwitcher', () => {
  it('renders all language buttons', () => {
    renderWithRouter(<LanguageSwitcher />);
    expect(screen.getByText(/EN/i)).toBeInTheDocument();
    expect(screen.getByText(/ไทย/i)).toBeInTheDocument();
    expect(screen.getByText(/中文/i)).toBeInTheDocument();
  });

  it('highlights the current language', () => {
    renderWithRouter(<LanguageSwitcher />);
    const enButton = screen.getByText(/EN/i).closest('button');
    expect(enButton).toHaveClass('bg-gradient-to-r');
  });

  it('calls changeLanguage when clicking a language button', () => {
    renderWithRouter(<LanguageSwitcher />);
    const thButton = screen.getByText(/ไทย/i);
    fireEvent.click(thButton);
    expect(mockChangeLanguage).toHaveBeenCalledWith('th');
  });
});
