import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../components/ui/input';
import { describe, it, expect, vi } from 'vitest';

describe('Input', () => {
  it('renders with label and placeholder', () => {
    render(<Input label="Email" placeholder="Enter your email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toHaveClass('text-destructive');
  });

  it('handles input changes', async () => {
    const handleChange = vi.fn();
    render(<Input label="Email" onChange={handleChange} />);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });
});
