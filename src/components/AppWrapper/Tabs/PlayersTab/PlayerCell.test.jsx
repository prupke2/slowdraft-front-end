import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, createMockCell, defaultProps } from '../../../../test-utils';
import PlayerCell from './PlayerCell';

// Mock the child components
jest.mock('../../UsernameStyled/UsernameStyled', () => {
  return function MockUsernameStyled({ username, teamKey, color, small }) {
    return (
      <span data-testid="username-styled">
        {username} ({teamKey}) - {color} - {small ? 'small' : 'large'}
      </span>
    );
  };
});

jest.mock('../WatchlistTab/WatchlistButton', () => {
  return function MockWatchlistButton({ cell, setWatchlist, setAutodraftTableRows }) {
    return (
      <button 
        data-testid="watchlist-button"
        onClick={() => {
          setWatchlist(prev => [...prev, cell.row.original]);
        }}
      >
        Add to Watchlist
      </button>
    );
  };
});

jest.mock('../WatchlistTab/Autodraft/AutodraftButton', () => {
  return function MockAutodraftButton({ 
    cell, 
    setWatchlist, 
    setAutodraftTableRows, 
    showToastOnAutodraft 
  }) {
    return (
      <button 
        data-testid="autodraft-button"
        onClick={() => {
          setAutodraftTableRows(prev => [...prev, cell.row.original]);
          if (showToastOnAutodraft) {
            // Mock toast would be called here
          }
        }}
      >
        Autodraft
      </button>
    );
  };
});

describe('PlayerCell', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  describe('when player has no player_id', () => {
    it('renders just the cell value', () => {
      const mockCell = {
        row: { original: {} },
        value: 'No Player Data',
      };

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
        />
      );

      expect(screen.getByText('No Player Data')).toBeInTheDocument();
      expect(screen.queryByTestId('watchlist-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('autodraft-button')).not.toBeInTheDocument();
    });
  });

  describe('when player has player_id', () => {
    it('renders player with headshot and external link', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Connor McDavid',
        headshot: 'https://example.com/mcdavid.jpg',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
        />
      );

      // Check player name link
      const playerLink = screen.getByRole('link', { name: /connor mcdavid/i });
      expect(playerLink).toHaveAttribute('href', 'https://sports.yahoo.com/nhl/players/123');
      expect(playerLink).toHaveAttribute('target', '_blank');

      // Check headshot
      const headshot = screen.getByRole('img');
      expect(headshot).toHaveAttribute('src', 'https://example.com/mcdavid.jpg');
    });

    it('renders empty headshot when no valid headshot provided', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Test Player',
        headshot: 'https://s.yimg.com/iu/api/res/1.2/TcM85WhJ.fAOHWf2QKLjIw--~C/YXBwaWQ9eXNwb3J0cztjaD0yMDA7Y3I9MTtjdz0xNTM7ZHg9NzQ7ZHk9MDtmaT11bGNyb3A7aD02MDtxPTEwMDt3PTQ2/https://s.yimg.com/dh/ap/default/140828/silhouette@2x.png',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
        />
      );

      const headshot = screen.getByRole('img');
      expect(headshot.src).toContain('emptyHeadshot.png');
    });

    it('displays IR status when player is injured', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Injured Player',
        ir: 'IR',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
        />
      );

      expect(screen.getByText('IR')).toBeInTheDocument();
      expect(screen.getByText('IR')).toHaveClass('ir');
    });

    it('displays prospect indicator when player is a prospect', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Prospect Player',
        prospect: 1,
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
        />
      );

      const prospectIndicator = screen.getByText('P');
      expect(prospectIndicator).toBeInTheDocument();
      expect(prospectIndicator).toHaveClass('prospect');
      expect(prospectIndicator).toHaveAttribute('title', 'Prospect');
    });

    it('displays keeper indicator when player is a keeper', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Keeper Player',
        is_keeper: 1,
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
        />
      );

      const keeperIndicator = screen.getByText('K');
      expect(keeperIndicator).toBeInTheDocument();
      expect(keeperIndicator).toHaveClass('keeper');
      expect(keeperIndicator).toHaveAttribute('title', 'Keeper');
    });

    it('displays both prospect and keeper indicators', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Special Player',
        prospect: 1,
        is_keeper: 1,
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
        />
      );

      expect(screen.getByText('P')).toBeInTheDocument();
      expect(screen.getByText('K')).toBeInTheDocument();
    });

    it('shows username when player is taken and showWatchlist is true', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Taken Player',
        user: 'testuser',
        team_key: 'nhl.l.123.t.1',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
          showWatchlist={true}
        />
      );

      expect(screen.getByTestId('username-styled')).toBeInTheDocument();
      expect(screen.getByText(/testuser/)).toBeInTheDocument();
    });

    it('does not show username when showWatchlist is false', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Taken Player',
        user: 'testuser',
        team_key: 'nhl.l.123.t.1',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
          showWatchlist={false}
        />
      );

      expect(screen.queryByTestId('username-styled')).not.toBeInTheDocument();
    });
  });

  describe('autodraftOnly mode', () => {
    it('renders only autodraft button when autodraftOnly is true', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Test Player',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
          autodraftOnly={true}
        />
      );

      expect(screen.getByTestId('autodraft-button')).toBeInTheDocument();
      expect(screen.queryByTestId('watchlist-button')).not.toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('button interactions', () => {
    it('calls setWatchlist when watchlist button is clicked', async () => {
      const mockSetWatchlist = jest.fn();
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Test Player',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
          setWatchlist={mockSetWatchlist}
          showWatchlist={true}
        />
      );

      await user.click(screen.getByTestId('watchlist-button'));
      expect(mockSetWatchlist).toHaveBeenCalled();
    });

    it('calls setAutodraftTableRows when autodraft button is clicked', async () => {
      const mockSetAutodraftTableRows = jest.fn();
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Test Player',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
          setAutodraftTableRows={mockSetAutodraftTableRows}
          showAutodraft={true}
        />
      );

      await user.click(screen.getByTestId('autodraft-button'));
      expect(mockSetAutodraftTableRows).toHaveBeenCalled();
    });
  });

  describe('conditional rendering of buttons', () => {
    it('shows watchlist button when showWatchlist is true and not autodraftOnly', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Test Player',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
          showWatchlist={true}
          autodraftOnly={false}
        />
      );

      expect(screen.getByTestId('watchlist-button')).toBeInTheDocument();
    });

    it('shows autodraft button when showAutodraft is true and not autodraftOnly', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Test Player',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
          showAutodraft={true}
          autodraftOnly={false}
        />
      );

      expect(screen.getByTestId('autodraft-button')).toBeInTheDocument();
    });

    it('hides buttons when respective show props are false', () => {
      const mockCell = createMockCell({
        player_id: '123',
        name: 'Test Player',
      });

      renderWithRouter(
        <PlayerCell 
          cell={mockCell} 
          {...defaultProps}
          showWatchlist={false}
          showAutodraft={false}
          autodraftOnly={false}
        />
      );

      expect(screen.queryByTestId('watchlist-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('autodraft-button')).not.toBeInTheDocument();
    });
  });
});
