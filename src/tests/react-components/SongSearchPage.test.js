import React from 'react';
import { render } from '@testing-library/react';
import SongSearchPage from '../../routes/SongSearchPage';

/**
 * Jest + react-testing-library test for rendering SongSearchPage.
 */
describe('SongSearchPage', () => {
    it('renders song search page with search box', () => {
        // Tests:
        const {getByText} = render(<SongSearchPage/>);
        const linkElement = getByText(/Search for a song to get started./i);
        expect(linkElement).toBeInTheDocument();
    })
});