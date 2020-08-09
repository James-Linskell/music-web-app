import React from 'react';
import { render } from '@testing-library/react';
import PlaylistSearchPage from '../../routes/PlaylistSearchPage';

/**
 * Jest + react-testing-library test for rendering PlaylistSearchPage.
 */
describe('PlaylistSearchPage', () => {
    it('renders playlist search page with search box and song card displaying chosen song', () => {
        // Tests:
        const {getAllByText} = render(<PlaylistSearchPage location={{state: "undefined"}} />);
        const linkElement = getAllByText(/Search for a playlist/i);
        expect(linkElement[0]).toBeInTheDocument();
    })
});