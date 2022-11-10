import Project from '../../client/components/Project.jsx';
import React from 'react';
import { fireEvent, render, screen, waitFor, } from '@testing-library/react';


test("Logo should be rendered", () => {
    render(<Project />)
    const projectCard = screen.getByTestId('project-test');
    expect(projectCard).toBeInTheDocument();
})