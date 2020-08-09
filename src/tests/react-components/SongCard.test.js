import React from 'react';
import { render } from '@testing-library/react';
import SongCard from '../../components/SongCard';

/**
 * Jest + react-testing-library test for rendering Histogram.
 */
describe('SongCard', () => {
    it('renders song card with song info and album art', () => {
        // Tests (simply tests mounting as a graphic is returned):
        const {getByText} = render(<SongCard name="test name" album="test album"/>);
        const linkElement1 = getByText(/test name/i);
        const linkElement2 = getByText(/test album/i);
        expect(linkElement1).toBeInTheDocument();
        expect(linkElement2).toBeInTheDocument();
    })
});
