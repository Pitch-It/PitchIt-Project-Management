import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Checkbox from '../components/Checkbox.jsx';
import '../styles/create.scss';

const Edit = () => {
  // this state hook will say which filters are active
  const [skillsObj, setSkillsObj] = useState({});
  const [skillState, setSkillState] = useState(skillsObj);

  //Function that will get all skills from the server
  function getSkills(){
    axios.get(
      'http://localhost:3000/projects/skills',
    )
      .then(response =>{
        //Give response.data a reasonable name
        const skills = response.data;
        //Define skillsObj
        const skillObj = {};
        //Foreach loop to setup skillsObj
        skills.forEach(skill => {skillObj[skill] = false;});
        //Update State
        setSkillsObj(skillObj);
        setSkillState(skillObj);
      });
  }

  useEffect(() => {
    console.log('Get skills request was made');
    getSkills();
  }, [skillsObj.length]);

  const handleClick = (skill) => {
    return setSkillState((prevState) => ({
      ...prevState,
      [skill]: !prevState[skill],
    }));
  };
  
  const checkboxArr = [];
  for (const skill in skillState) {
    skillState[skill];
    checkboxArr.push(
      <Checkbox
        type="button"
        key={skill}
        skill={skill}
        handleClick={handleClick}
        clicked={skillState[skill]}
      />
    );
  }
  const defaultInput = {
    project_name: '',
    description: '',
  };
  const [inputData, setInputData] = useState(defaultInput);
  const [duplicate, setDuplicate] = useState(false);
  const [valid, setValid] = useState(true);
  const navigate = useNavigate();

  const handleInputChange = (e, inputId) => {
    console.log('skills', skillsObj);
    return setInputData((prevState) => ({
      ...prevState,
      [inputId]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Populate inputData with required fields
    const filteredSkills = [];
    // We are going to push the index of the truthy skills into an array, which we will send in a request to our backend
    for (const skill in skillState) {
      // If we read a truthy value in our skillState object
      if (skillState[skill])
        // push the index to the filteredSkills array
        // SQL indicies start at 1 so we should add 1 to each value
        filteredSkills.push(Object.keys(skillsObj).indexOf(skill) + 1);
    }
    const date = new Date();
    inputData.date = date.toDateString();
    inputData.owner_id = localStorage.getItem('user_id');
    inputData.owner_name = localStorage.getItem('username');
    inputData.skills = filteredSkills;
    if (
      !inputData.project_name ||
      !inputData.description ||
      !inputData.skills.length
    )
      return setValid(false);
    // Send an asynchronous post request to our server
    (async function postProject() {
      try {
        const postProjectStatus = await axios.post(
          'http://localhost:3000/projects/',
          inputData
        );
        if (postProjectStatus) {
          setDuplicate(false);
          setValid(true);
          setInputData(defaultInput);
          return navigate('/myprojects');
        }
      } catch (err) {
        console.log('catch block');
        setDuplicate(true);
      }
    })();
  };
  return (
    <div className="project-card-layout">
      <form
        id="project-creation-form"
        onSubmit={handleSubmit}
      >
        <h1 id="create-header">Create Pitch</h1>
        <hr />
        {duplicate && (
          <>
            <span className="duplicate-error">
              A project with this name already exists.
            </span>
            <br></br>
          </>
        )}
        {!valid && (
          <span className="input-error">
            Please enter valid project information.
          </span>
        )}
        <div className="field">
          <label>Project Title:</label>
          <input
            type="text"
            id="project-name"
            name="project-name"
            value={inputData.project_name}
            placeholder="Enter a title for your project"
            onChange={(e) => handleInputChange(e, 'project_name')}
          />
        </div>
        <div className="field">
          <label>Description:</label>
          <textarea
            rows="5"
            type="text"
            id="project-description"
            name="project-description"
            value={inputData.description}
            placeholder="Enter a short description of your project"
            onChange={(e) => handleInputChange(e, 'description')}
          />
        </div>
        <div className="field">
          <label>Needed Skills:</label>
          <div className="filters">{checkboxArr}</div>
        </div>
        <button
          id="create-button"
          type="submit"
        >
          Pitch it!
        </button>
      </form>
    </div>
  );
};

export default Edit;
