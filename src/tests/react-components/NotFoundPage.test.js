import React from 'react';
import { render } from '@testing-library/react';
import NotFoundPage from '../../routes/NotFoundPage';
import {BrowserRouter} from "react-router-dom";

/**
 * Jest + react-testing-library test for rendering NotFoundPage.
 */
describe('NotFoundPage', () => {
    it('renders 404 not found page with error message', () => {
        // Tests:
        const {getByText} = render(<BrowserRouter>
            <NotFoundPage/>
        </BrowserRouter>);
        const linkElement = getByText(/404 Not Found/i);
        expect(linkElement).toBeInTheDocument();
    })
});
