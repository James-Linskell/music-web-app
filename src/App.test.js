import React from 'react';
import { render } from '@testing-library/react';
import SongSearchPage from './routes/SongSearchPage';

test('renders learn react link', () => {
  const { getByText } = render(<SongSearchPage />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
