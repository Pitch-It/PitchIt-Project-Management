import MyProjects from '../../client/pages/MyProjects.jsx';
import Project from '../../client/components/Project.jsx';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor, } from '@testing-library/react';

//check to see that css
describe('check style', ()=>{
    //pulls up the info rendered
    let appInstance;
    const props = {};

    beforeAll(() => {
      appInstance = render(
        <BrowserRouter>
          <Project {...props} />
        </BrowserRouter>
      )
    });

    //test to check background colour
    test('checking background color', ()=>{
        expect(appInstance.getByText('Description:')).toHaveStyle({ backgroundColor: 'inherit' })
    })
})
