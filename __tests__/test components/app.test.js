import React from 'react';
import{render, screen} from '@testing-library/react';

import App from '../../client/App';

describe('Integration test', () => {

beforeEach(async () => {
  const app = await render(
<App />
  );
});
//before each b/c it is an async call
test('button test', async () => {
const button = await (screen.findAllByRole('button'));
expect(button.length).toBe(1);
});

})