import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';

describe('HomePage', () => {
  it('renders main heading', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Check for key elements
    const heading = screen.getByText(/Thai Variety/i);
    expect(heading).toBeInTheDocument();
  });

  it('displays feature cards', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Should have multiple feature cards
    const cards = screen.getAllByRole('link');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('has navigation links', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Check for browse link by href
    const links = screen.getAllByRole('link');
    const browseLink = links.find(link => link.getAttribute('href') === '/browse');
    expect(browseLink).toBeDefined();
  });

  it('displays statistics section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Check for stats
    expect(screen.getByText(/1000\+/i)).toBeInTheDocument();
    expect(screen.getByText(/5000\+/i)).toBeInTheDocument();
  });
});
