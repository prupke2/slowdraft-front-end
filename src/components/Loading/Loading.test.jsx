import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading', () => {
  it('renders with default props', () => {
    render(<Loading />);
    
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('scoreboardLoading.gif'));
  });

  it('renders with custom text', () => {
    const text = 'Loading players...';
    render(<Loading text={text} />);
    
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('applies absolute positioning class when absolute prop is true', () => {
    render(<Loading absolute={true} />);
    
    const wrapper = screen.getByRole('img').parentElement;
    expect(wrapper).toHaveClass('loading-wrapper', 'absolute');
  });

  it('applies small size class when small prop is true', () => {
    render(<Loading small={true} />);
    
    const wrapper = screen.getByRole('img').parentElement;
    expect(wrapper).toHaveClass('loading-wrapper', 'loading-small');
  });

  it('uses alternative loading gif when alt prop is true', () => {
    render(<Loading alt={true} />);
    
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('gearsLoading.gif'));
  });

  it('uses default loading gif when alt prop is false', () => {
    render(<Loading alt={false} />);
    
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('scoreboardLoading.gif'));
  });

  it('combines multiple props correctly', () => {
    const text = 'Custom loading text';
    render(<Loading text={text} absolute={true} small={true} alt={true} />);
    
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('gearsLoading.gif'));
    
    const wrapper = screen.getByRole('img').parentElement;
    expect(wrapper).toHaveClass('loading-wrapper', 'absolute', 'loading-small');
  });
});
