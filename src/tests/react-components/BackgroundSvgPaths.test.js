import React from 'react';
import { render } from '@testing-library/react';
import BackgroundSvgPaths from '../../components/BackgroundSvgPaths';

/**
 * Jest + react-testing-library test for rendering BackgroundSvgPaths.
 */
describe('BackgroundSvgPaths', () => {
    it('renders svg image for page background', () => {
        // Tests:
        const {getByTitle} = render(<BackgroundSvgPaths shiftDown="5vh" fill="red"/>);
        const linkElement = getByTitle(/background/i);
        expect(linkElement).toBeInTheDocument();
    })
});