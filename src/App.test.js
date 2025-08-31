import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock react-router-dom since App likely uses routing
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>
}));

// Mock any API calls or async operations
jest.mock('./api/yahooApi.jsx', () => ({
  fetchData: jest.fn(() => Promise.resolve({})),
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    // Since we don't know the exact content, just check that it renders
    expect(document.body).toBeInTheDocument();
  });

  it("renders the router wrapper", () => {
    render(<App />);
    expect(screen.getByTestId("router")).toBeInTheDocument();
  });
});
