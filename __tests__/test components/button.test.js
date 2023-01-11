import MyProjects from '../../client/pages/MyProjects.jsx';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor, } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

describe('button tests', () => {

    const buttonClick = jest.fn();

    test("button should be rendered", () => {
    render(
        <BrowserRouter>
            <MyProjects />
        </BrowserRouter>)
    const createPitchButton = screen.getByRole('button');
    expect(createPitchButton).toHaveClass('primary');
    })

    test("button should route", () => {
        render(
            <BrowserRouter>
                <MyProjects />
            </BrowserRouter>)

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(buttonClick).toHaveBeenCalled();


        // const mockCallBack = jest.fn();
        // const createPitchButton = screen.getByRole('button');
        // const button = shallow((<createPitchButton onClick={mockCallBack}></createPitchButton>));
        // button.find('button').simulate('click');
        // expect(mockCallBack).toHaveBeenCalled()

        //simulate click
        //check to see that the window pathname is equal to /

    })
})