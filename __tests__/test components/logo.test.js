import Logo from '../../client/components/Logo.jsx';
import React from 'react';
import { fireEvent, render, screen, waitFor, } from '@testing-library/react';

test("Logo should be rendered", () => {
  render(<Logo />)
  const svgLogo = screen.getByTestId('logo-svg-test');
  expect(svgLogo).toBeInTheDocument();
})