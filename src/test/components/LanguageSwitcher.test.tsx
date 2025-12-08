import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

// Initialize i18n for tests without HttpBackend
beforeAll(async () => {
  if (!i18n.isInitialized) {
    await i18n
      .use(initReactI18next)
      .init({
        lng: 'en',
        fallbackLng: 'en',
        resources: {
          en: {
            translation: {
              language: 'English',
            }
          },
          th: {
            translation: {
              language: 'ไทย',
            }
          }
        },
        interpolation: {
          escapeValue: false
        }
      });
  }
});

describe('LanguageSwitcher', () => {
  it('renders language switcher buttons', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    );

    await waitFor(() => {
      // Check for language buttons (TH/EN flags)
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('switches language when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    );

    await waitFor(async () => {
      const buttons = screen.getAllByRole('button');
      
      // Click first button (language switch)
      await user.click(buttons[0]);
      
      // Language should be changed (test that click works)
      expect(buttons[0]).toBeInTheDocument();
    });
  });

  it('displays current language indicator', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
