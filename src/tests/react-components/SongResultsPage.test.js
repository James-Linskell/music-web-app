import React from 'react';
import { render } from '@testing-library/react';
import SongResultsPage from '../../routes/SongResultsPage';

/**
 * Jest + react-testing-library test for rendering SongResultsPage. Although this page works in practice, this jest
 * test currently always fails, as Chart.js uses the canvas library compiled to an old version of node. Still not sure
 * the the solution to this.
 */
describe('SongResultsPage', () => {
    it('renders song results page with graphs and information', () => {
        // Tests (CURRENTLY FAIL):
        const {getByText} = render(<SongResultsPage/>);
        const linkElement1 = getByText(/Musical information:/i);
        const linkElement2 = getByText(/Song details:/i);
        const linkElement3 = getByText(/Energy:/i);
        const linkElement4 = getByText(/Positivity:/i);
        const linkElement5 = getByText(/Mood features explained:/i);
        expect(linkElement1).toBeInTheDocument();
        expect(linkElement2).toBeInTheDocument();
        expect(linkElement3).toBeInTheDocument();
        expect(linkElement4).toBeInTheDocument();
        expect(linkElement5).toBeInTheDocument();
    })
});
