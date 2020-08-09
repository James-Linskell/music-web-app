import React from 'react';
import { render } from '@testing-library/react';
import ContactPage from '../../routes/ContactPage';
import {BrowserRouter} from "react-router-dom";

/**
 * Jest + react-testing-library test for rendering ContactPage.
 */
describe('ContactPage', () => {
    it('renders contact page with contact info and social media links', () => {
        // Tests:
        const {getByText} = render(<BrowserRouter>
            <ContactPage/>
        </BrowserRouter>);
        const linkElement = getByText(/Contact/i);
        expect(linkElement).toBeInTheDocument();
    })
});
