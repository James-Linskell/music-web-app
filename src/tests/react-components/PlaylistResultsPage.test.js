import React from 'react';
import { render } from '@testing-library/react';
import PlaylistResultsPage from '../../routes/PlaylistResultsPage';

/**
 * Jest + react-testing-library test for rendering PlaylistResultsPage. Although this page works in practice, this jest
 * test currently always fails, as Chart.js uses the canvas library compiled to an old version of node. Still not sure
 * the the solution to this.
 */
describe('PlaylistResultsPage', () => {
    it('renders playlist results page with playlist analysis score and results', () => {
        // Tests (CURRENTLY FAIL):
        const {getAllByText} = render(<PlaylistResultsPage/>);
        const linkElement1 = getAllByText(/% Fit!/i);
        const linkElement2 = getAllByText(/Danceability:/i);
        const linkElement3 = getAllByText(/Energy:/i);
        const linkElement4 = getAllByText(/Positivity:/i);
        const linkElement5 = getAllByText(/Mood features explained:/i);
        expect(linkElement1[0]).toBeInTheDocument();
        expect(linkElement2[0]).toBeInTheDocument();
        expect(linkElement3[0]).toBeInTheDocument();
        expect(linkElement4[0]).toBeInTheDocument();
        expect(linkElement5[0]).toBeInTheDocument();
    })
});
