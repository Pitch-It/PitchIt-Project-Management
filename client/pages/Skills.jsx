import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Checkbox from '../components/Checkbox.jsx';
import Project from '../components/Project.jsx';
import '../styles/myprojects.scss';

/* 
  MyProjects needs:
  Header
  Sidebar
  Project cards -> only ones you have made
  
*/
// ! Do we want Login to be its own page?

const Skills = () => {
  // this state hook will say which filters are active
  const [skillsObj, setSkillsObj] = useState({});
  const [skillState, setSkillState] = useState(skillsObj);
  const [newSkill, setNewSkill] = useState('');
  const checkboxArr = [];

  useEffect(() => {
    console.log('Get skills request was made');
    getSkills();
  }, [Object.keys(skillsObj).length]);
    
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

  const handleClick = (skill) => {
    console.log('Skill: ', skill);
    return setSkillState((prevState) => ({
      ...prevState,
      [skill]: !prevState[skill],
    }));
  };

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

  function handleAddClick() {
    axios.post('http://localhost:3000/projects/skill/new',
      {skill: newSkill})
      .then(() => {
        setSkillsObj({});
        setNewSkill('');
      });
  }

  function handleDeleteSkills() {
    Object.keys(skillState).forEach(skill => {
      if(skillState[skill]) {
        axios.delete(`http://localhost:3000/projects/skill/remove/${skill}`)
          .then(() => {
            setSkillsObj({});
          });
      }
    });

  }

  return (
    <div id="myprojects-div">
      <div className="myproject-header">Skills</div>
      <hr />
      <div className="field">
        <div className="add-skill-field">
          <label htmlFor="skill">Enter skill name: </label>
          <input autoComplete="off" name="skill" placeholder="Javascript" value={newSkill} onChange={input => setNewSkill(input.target.value)}/>
        </div>
        <div className="myprojects-button-container">
          <button
            id="create-project"
            type="button"
            onClick={handleAddClick}
          >
            Add a new skill!
          </button>
        </div>
      </div>
      <div className="field">
        <label>Current Skills (Click to delete):</label>
        <div className="filters">{checkboxArr}</div>

        <button
          id="create-project"
          type="button"
          onClick={handleDeleteSkills}
        >
            Delete Selected Skills
        </button>
      </div>
    </div>
  );
};

export default Skills;
