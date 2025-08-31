import { adjustOffset, timeSince } from './time.jsx';

describe('time utilities', () => {
  describe('adjustOffset', () => {
    it('adjusts timestamp for timezone offset', () => {
      const mockDate = new Date('2024-01-01T12:00:00Z');
      const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
      
      // Mock timezone offset (e.g., EST is UTC-5, so offset is 300 minutes)
      Date.prototype.getTimezoneOffset = jest.fn(() => 300);
      
      const result = adjustOffset(mockDate);
      
      // Should subtract the offset (300 minutes = 18000000 milliseconds)
      const expected = new Date(mockDate.getTime() - (300 * 60 * 1000));
      expect(result).toEqual(expected);
      
      // Restore original method
      Date.prototype.getTimezoneOffset = originalGetTimezoneOffset;
    });

    it('handles different timezone offsets', () => {
      const mockDate = new Date('2024-01-01T12:00:00Z');
      const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
      
      // Mock PST (UTC-8, so offset is 480 minutes)
      Date.prototype.getTimezoneOffset = jest.fn(() => 480);
      
      const result = adjustOffset(mockDate);
      const expected = new Date(mockDate.getTime() - (480 * 60 * 1000));
      expect(result).toEqual(expected);
      
      Date.prototype.getTimezoneOffset = originalGetTimezoneOffset;
    });
  });

  describe('timeSince', () => {
    let originalNow;
    const fixedNow = new Date('2024-01-01T12:00:00Z');

    beforeEach(() => {
      originalNow = Date.now;
      Date.now = jest.fn(() => fixedNow.getTime());
      // Also mock the Date constructor to return our fixed date
      global.Date = jest.fn(() => fixedNow);
      global.Date.now = jest.fn(() => fixedNow.getTime());
      // Keep the original Date methods
      Object.setPrototypeOf(global.Date, Date);
      Object.getOwnPropertyNames(Date).forEach(name => {
        if (name !== 'now') {
          global.Date[name] = Date[name];
        }
      });
    });

    afterEach(() => {
      Date.now = originalNow;
      global.Date = Date;
    });

    it('returns "just now" for very recent timestamps', () => {
      const recentTime = new Date(fixedNow.getTime() - 5000); // 5 seconds ago
      const result = timeSince(recentTime);
      expect(result).toBe('just now');
    });

    it('returns seconds for timestamps under a minute', () => {
      const timestamp = new Date(fixedNow.getTime() - 30000); // 30 seconds ago
      const result = timeSince(timestamp);
      expect(result).toBe('30s ago');
    });

    it('returns minutes for timestamps under an hour', () => {
      const timestamp = new Date(fixedNow.getTime() - 1800000); // 30 minutes ago
      const result = timeSince(timestamp);
      expect(result).toBe('30m ago');
    });

    it('returns hours for timestamps under a day', () => {
      const timestamp = new Date(fixedNow.getTime() - 7200000); // 2 hours ago
      const result = timeSince(timestamp);
      expect(result).toBe('2h ago');
    });

    it('returns "1 day ago" for exactly one day', () => {
      const timestamp = new Date(fixedNow.getTime() - 86400000); // 1 day ago
      const result = timeSince(timestamp);
      expect(result).toBe('1 day ago');
    });

    it('returns days for timestamps under a month', () => {
      const timestamp = new Date(fixedNow.getTime() - 172800000); // 2 days ago
      const result = timeSince(timestamp);
      expect(result).toBe('2 days ago');
    });

    it('returns formatted date for older timestamps', () => {
      // Reset Date mock for this test to get proper date formatting
      global.Date = Date;
      
      const oldTimestamp = new Date('2023-06-15T10:00:00Z');
      const result = timeSince(oldTimestamp);
      
      // Should return "Jun 15" or "Jun 15, 2023" depending on current year
      expect(result).toMatch(/Jun 15/);
    });
  });
});
