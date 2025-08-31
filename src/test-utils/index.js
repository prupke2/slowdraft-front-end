import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

// Custom render function that includes providers
export const renderWithRouter = (ui, options = {}) => {
  const {
    initialEntries = ['/'],
    history = createMemoryHistory({ initialEntries }),
    ...renderOptions
  } = options;

  const Wrapper = ({ children }) => (
    <Router history={history}>
      {children}
    </Router>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    history,
  };
};

// Mock data generators
export const createMockPlayer = (overrides = {}) => ({
  player_id: '123',
  user: null,
  team_key: 'nhl.l.123.t.1',
  ir: null,
  headshot: 'https://example.com/headshot.jpg',
  prospect: 0,
  is_keeper: 0,
  ...overrides,
});

export const createMockCell = (playerData = {}) => ({
  row: {
    original: createMockPlayer(playerData),
  },
  value: playerData.name || 'Test Player',
});

// Common test props
export const defaultProps = {
  showWatchlist: true,
  showAutodraft: true,
  setWatchlist: jest.fn(),
  setAutodraftTableRows: jest.fn(),
  autodraftOnly: false,
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
