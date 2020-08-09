import React from 'react';
import { render } from '@testing-library/react';
import HomePage from '../../routes/HomePage';
import {BrowserRouter} from "react-router-dom";

/**
 * Jest + react-testing-library test for rendering HomePage.
 */
describe('HomePage', () => {
    it('renders home page with links to song and playlist analysers', () => {
        // Tests:
        const {getByText} = render(<BrowserRouter>
            <HomePage/>
        </BrowserRouter>);
        const linkElement1 = getByText(/Song Analyser/i);
        const linkElement2 = getByText(/Playlist Analyser/i);
        expect(linkElement1).toBeInTheDocument();
        expect(linkElement2).toBeInTheDocument();
    })
});
