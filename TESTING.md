# Testing Guide

This project uses a comprehensive testing setup with Jest and React Testing Library.

## Test Scripts

- `npm test` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests once for CI/CD (no watch mode)

## Test Structure

### Unit Tests
Located alongside source files with `.test.jsx` extension:
- `PlayerCell.test.jsx` - Tests for PlayerCell component
- `Loading.test.jsx` - Tests for Loading component
- `time.test.jsx` - Tests for time utility functions

### Integration Tests
Located in `src/__tests__/` directory:
- `integration.test.jsx` - Cross-component integration tests

### Test Utilities
Located in `src/test-utils/`:
- Custom render functions with providers
- Mock data generators
- Common test helpers

### Mocks
Located in `src/__mocks__/`:
- `react-router-dom.js` - Router mocks
- `react-hot-toast.js` - Toast notification mocks

## Testing Patterns

### Component Testing
```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(/* assertion */).toBeTruthy();
  });
});
```

### Using Test Utilities
```jsx
import { renderWithRouter, createMockPlayer } from '../test-utils';

const mockPlayer = createMockPlayer({ name: 'Test Player' });
renderWithRouter(<PlayerComponent player={mockPlayer} />);
```

### Mocking External Dependencies
```jsx
jest.mock('../api/yahooApi', () => ({
  fetchPlayers: jest.fn(() => Promise.resolve([])),
}));
```

## Coverage Thresholds

The project is configured with minimum coverage thresholds:
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Descriptive Test Names**: Tests should read like documentation
3. **Keep Tests Isolated**: Each test should be independent
4. **Mock External Dependencies**: API calls, routing, etc.
5. **Test User Interactions**: Use userEvent for realistic user actions
6. **Test Error States**: Don't just test the happy path

## Common Testing Scenarios

### Testing Props
```jsx
it('displays player name from props', () => {
  const player = { name: 'Connor McDavid' };
  render(<PlayerCell player={player} />);
  expect(screen.getByText('Connor McDavid')).toBeInTheDocument();
});
```

### Testing State Changes
```jsx
it('updates UI when button is clicked', async () => {
  const user = userEvent.setup();
  render(<Component />);
  
  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Updated State')).toBeInTheDocument();
});
```

### Testing Async Operations
```jsx
it('loads data on mount', async () => {
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});
```

### Testing Error Handling
```jsx
it('displays error message when API fails', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  mockApi.mockRejectedValue(new Error('API Error'));
  
  render(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Running Tests

### Local Development
```bash
npm test
```
This starts Jest in watch mode, automatically re-running tests when files change.

### Coverage Report
```bash
npm run test:coverage
```
Generates a coverage report in the `coverage/` directory.

### CI/CD
```bash
npm run test:ci
```
Runs tests once with coverage, suitable for continuous integration.

## Debugging Tests

### Running Specific Tests
```bash
npm test -- --testNamePattern="PlayerCell"
npm test -- PlayerCell.test.jsx
```

### Debug Mode
```bash
npm test -- --verbose
npm test -- --debug
```

### Updating Snapshots
```bash
npm test -- --updateSnapshot
```

## Adding New Tests

1. Create test file alongside source file: `Component.test.jsx`
2. Import testing utilities: `import { render, screen } from '@testing-library/react'`
3. Group related tests in `describe` blocks
4. Use descriptive test names with `it` or `test`
5. Follow the Arrange-Act-Assert pattern
6. Mock external dependencies as needed

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
