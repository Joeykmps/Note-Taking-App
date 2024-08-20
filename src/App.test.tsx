import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Save note button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/save note/i);
  expect(buttonElement).toBeInTheDocument();
});

test('Renders input box', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/enter note title here.../i);
  expect(inputElement).toBeInTheDocument();
});