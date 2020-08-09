import React from 'react';
import { render } from '@testing-library/react';
import AboutPage from '../../routes/AboutPage';
import {BrowserRouter} from "react-router-dom";

/**
 * Jest + react-testing-library test for rendering AboutPage.
 */
describe('AboutPage', () => {
    it('renders about page with information about the app', () => {
        // Tests:
        const {getAllByText} = render(<BrowserRouter>
            <AboutPage/>
        </BrowserRouter>);
        const textElement = getAllByText(/About/i);
        expect(textElement[0]).toBeInTheDocument();
    })
});
