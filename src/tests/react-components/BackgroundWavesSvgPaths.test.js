import React from 'react';
import { render } from '@testing-library/react';
import BackgroundWavesSvgPaths from '../../components/BackgroundWavesSvgPaths';

/**
 * Jest + react-testing-library test for rendering BackgroundWavesSvgPaths.
 */
describe('BackgroundWavesSvgPaths', () => {
    it('renders svg image for page background', () => {
        // Tests:
        const {getByTitle} = render(<BackgroundWavesSvgPaths shiftDown="5vh" fill="red"/>);
        const linkElement = getByTitle(/background/i);
        expect(linkElement).toBeInTheDocument();
    })
});