// Mock for react-router-dom
export const useHistory = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
}));

export const useLocation = jest.fn(() => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
}));

export const useParams = jest.fn(() => ({}));

export const Link = ({ children, to, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
);

export const Router = ({ children }) => <div>{children}</div>;
export const BrowserRouter = ({ children }) => <div>{children}</div>;
export const MemoryRouter = ({ children }) => <div>{children}</div>;
