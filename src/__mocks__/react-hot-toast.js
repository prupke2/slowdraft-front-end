// Mock for react-hot-toast
export const toast = {
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  custom: jest.fn(),
};

export const Toaster = () => null;

export default toast;
