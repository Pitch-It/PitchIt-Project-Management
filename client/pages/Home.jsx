import React, { useEffect, useState } from 'react';
import Project from '../components/Project.jsx';
import Checkbox from '../components/Checkbox.jsx';
import axios from 'axios';
import '../styles/home.scss';
/* 
  What do we need from Home component?
  Header component
  Sidebar component
  Filter buttton (dropdown)
  Project Card components
*/

const Home = () => {
  // this is to serve as a redundancy for filteredProjects
  // we could just throw this in a variable defined in the global scope but it's fine at this point
  const [projectArr, setProjectArr] = useState([]);
  // this is going to contain the filtered state
  const [filteredProjects, setFilteredProjects] = useState([]);
  // this hook will conditionally render the potential filters
  const [filterPress, setFilterPress] = useState(false);
  // this state hook will hold all skill states
  const [skillsObj, setSkillsObj] = useState({});
  // this state hook will say which filters are active
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

  // this handle click fires whenever a skill is selected
  const handleClick = (skill) => {
    // first we change the state of the selected skill
    setSkillState((prevState) => {
      // update the previous state's skills
      const updatedSkills = {
        ...prevState,
        [skill]: !prevState[skill],
      };
      // pick out only the truthy/active skills and create a new array from them
      const activeSkills = Object.entries(updatedSkills)
        .filter((skill) => skill[1])
        .map((skill) => skill[0]);
      // set a filtered Projects state, projectArr is a redundancy so that the filter never returns an empty page with nothing
      setFilteredProjects((prevState) => {
        console.log(projectArr);
        const activeFilter = projectArr.filter((project) => {
          return activeSkills.every((skill) =>
            project.props.skills.includes(skill)
          )
            ? true
            : false;
        });
        return activeFilter;
      });
      return updatedSkills;
    });
  };
  const checkboxArr = [];
  for (const skill in skillState) {
    skillState[skill];
    checkboxArr.push(
      <Checkbox
        key={skill}
        skill={skill}
        handleClick={handleClick}
        clicked={skillState[skill]}
      />
    );
  }
  // Send a get request to the server on page load to pull in all projects in our DB
  const getProjects = async () => {
    try {
      await axios
        .get('http://localhost:3000/projects/all')
        .then((response) => response.data)
        .then((data) => {
          return data.map((obj) => {
            return (
              <Project
                key={obj.id.toString()}
                project_id={obj.id.toString()}
                owner_name={obj.owner_name}
                title={obj.project_name}
                description={obj.description}
                skills={obj.skills}
                date={obj.date}
              />
            );
          });
        })
        .then((arr) => {
          setProjectArr(arr);
          setFilteredProjects(arr);
        });
    } catch (err) {
      alert('couldn\'t find project');
    }
  };
  // On page load, run the asynchronous get request
  useEffect(() => {
    getProjects();
    // populate user
  }, []);

  return (
    <div id="homepage-div">
      <div id="Home">Pitches</div>
      <div id="Home">Welcome, {localStorage.getItem('username')}</div>
      <hr />
      <div className="homepage-button-container">
        <button
          className="filter-button"
          onClick={() => setFilterPress(!filterPress)}
        >
          Filter
        </button>
      </div>
      {filterPress && <div className="filters">{checkboxArr}</div>}
      <div className="project-card-container">{filteredProjects}</div>
      <br></br>
    </div>
  );
};

export default Home;
