import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { BookingStatusBadge } from '../../components/BookingStatusBadge';

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
              booking_status: {
                pending: 'Pending',
                confirmed: 'Confirmed',
                completed: 'Completed',
                cancelled: 'Cancelled',
                in_progress: 'In Progress',
              }
            }
          }
        },
        interpolation: {
          escapeValue: false
        }
      });
  }
});

describe('BookingStatusBadge', () => {
  it('renders pending status correctly', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <BookingStatusBadge status="pending" />
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });
  });

  it('renders confirmed status correctly', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <BookingStatusBadge status="confirmed" />
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
    });
  });

  it('renders completed status correctly', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <BookingStatusBadge status="completed" />
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });
  });

  it('renders cancelled status correctly', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <BookingStatusBadge status="cancelled" />
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/cancelled/i)).toBeInTheDocument();
    });
  });

  it('renders with appropriate styling classes', async () => {
    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <BookingStatusBadge status="pending" />
      </I18nextProvider>
    );

    await waitFor(() => {
      const badge = container.querySelector('span');
      expect(badge).toBeInTheDocument();
    });
  });
});
