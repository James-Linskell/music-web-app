import React from 'react';
import { render } from '@testing-library/react';
import Histogram from '../../components/Histogram';

/**
 * Jest + react-testing-library test for rendering Histogram.
 */
describe('Histogram', () => {
    it('renders histogram for song mood features', () => {
        // Tests (simply tests mounting as a graphic is returned):
        const {getByText} = render(<Histogram type="dance" data={[0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9]} songIndex={4}/>);
    })
});
