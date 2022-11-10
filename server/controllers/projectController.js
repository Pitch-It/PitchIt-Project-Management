const db = require('../models/projectModels');
const { json } = require('express');
const projectController = {};


const defaultErr = {
  log: 'Express error handler caught unknown middleware error',
  status: 500,
  message: { err: 'An error occurred' },
};

// retrieves all projects
projectController.getAllProjects = (req, res, next) => {
  const queryStr = 'SELECT s.*, pr.* FROM projects_skills_join_table jt JOIN projects pr ON jt.project_id = pr.id JOIN skills s ON jt.skill_id = s.id';
  db.query(queryStr)
    .then((data) => {
      return data.rows;
    })
    .then((projects) => {
      // ! We are getting back an array of objects with repeats because each object has a unique skill field
      // We already have a check that ensures that each project's title is unique on the frontend
      const uniqueTitles = new Set();
      // We have to add to previous values to ones that pass the Set, probably better to do this using reduce but i've already written a bunch of logic using filter
      const mergedProjects = [];
      // filter out any repeat project_name and instead just push the skill into an array
      projects.filter((project) => {
        // This if block triggers when there's a repeat
        if (uniqueTitles.has(project.project_name)) {
          // Find the project with the exact same project name and push in the unique skill
          const toMerge = mergedProjects.find(
            (obj) => obj.project_name === project.project_name
          );
          toMerge.skills.push(project.skill);
          return false;
        }
        // If the project_name is unique, add its name to the set
        uniqueTitles.add(project.project_name);
        // add a skills property to the project object that is an array with the skill
        project.skills = [project.skill];
        // delete that skill
        delete project.skill;
        // push the altered object into the merged Projects array
        mergedProjects.push(project);
        return true;
      });
      // If our query returns null, just send back false to our front end
      if (!projects) return res.status(400).json(false);
      return res.status(200).json(mergedProjects);
    })
    .catch((err) => {
      return next({
        log: 'Error in projectController.getAllProjects',
        status: 400,
        message: { err: err },
      });
    });
};
//get individual users projects
projectController.getMyProject = (req, res, next) => {
  const user_id = req.params.id;
  // ! For some reason, the project MUST be the second select or else the skill ID will be returned
  const array = [user_id];

  console.log(array);
  const queryStr = 'SELECT s.*, pr.* FROM projects_skills_join_table jt JOIN skills s ON jt.skill_id = s.id JOIN projects pr ON jt.project_id = pr.id WHERE pr.owner_id=$1';
  db.query(queryStr, array)
    .then((data) => {
      return data.rows;
    })
    .then((projects) => {
      // ! We are getting back an array of objects with repeats because each object has a unique skill field
      // We already have a check that ensures that each project's title is unique on the frontend
      const uniqueTitles = new Set();
      // We have to add to previous values to ones that pass the Set, probably better to do this using reduce but i've already written a bunch of logic using filter
      const mergedProjects = [];
      // filter out any repeat project_name and instead just push the skill into an array
      projects.filter((project) => {
        // This if block triggers when there's a repeat
        if (uniqueTitles.has(project.project_name)) {
          // Find the project with the exact same project name and push in the unique skill
          const toMerge = mergedProjects.find(
            (obj) => obj.project_name === project.project_name
          );
          toMerge.skills.push(project.skill);
          return false;
        }
        // If the project_name is unique, add its name to the set
        uniqueTitles.add(project.project_name);
        // add a skills property to the project object that is an array with the skill
        project.skills = [project.skill];
        // delete that skill
        delete project.skill;
        // push the altered object into the merged Projects array
        mergedProjects.push(project);
        return true;
      });
      // If our query returns null, just send back false to our front end
      if (!projects) return res.status(400).json(false);
      return res.status(200).json(mergedProjects);
    })
    .catch((err) => {
      return next({
        log: 'Error in projectController.getMyProject',
        status: 400,
        message: { err: err },
      });
    });
};


projectController.addProject = (req, res, next) => {
  const { owner_id, project_name, date, description, owner_name, skills } = req.body;
  const array = [owner_id, project_name, date, description, owner_name];
  const queryStr = 'INSERT INTO projects(owner_id, project_name, date, description, owner_name) VALUES ($1, $2, $3, $4, $5) RETURNING id';
  // send off a nested query to our database, effectively adding to the projects and join table with one user click
  db.query(queryStr, array)
    .then((data) => {
      // By using RETURNING id in conjunction with the insert into, we can store the new project's primary key in insertedId
      const insertedId = data.rows[0].id;
      console.log(insertedId);
      // We need to construct another query string to add to our join table
      // ! We have a varying amount of rows to enter into our join table.....
      const multipleStringArr = [];
      // each value of skills is the primary key to the skill in the skills table
      for (const value of skills) {
        multipleStringArr.push(`('${insertedId}', '${value}')`);
      }
      // create a single string, getting rid of all the backticks
      const multipleString = multipleStringArr.join(',').replaceAll('`', '');
      const queryStr2 = `INSERT INTO projects_skills_join_table (project_id, skill_id) VALUES${multipleString}`;
      db.query(queryStr2)
        .then(() => {
          return res.status(200).json(true);
        })
        .catch((err) => {
          return next({
            log: 'Error in projectController.addProject join table',
            status: 400,
            message: { err: err },
          });
        });
    })
    .catch((err) => {
      return next({
        log: 'Error in projectController.addProject',
        status: 400,
        message: { err: err },
      });
    });
};


projectController.deleteProject = (req, res, next) => {
  const project_id = req.params.id;
  const array = [project_id];
  const queryStr = 'DELETE FROM projects WHERE projects.id = $1';

  db.query(queryStr, array)
    .then(() => {
      return res.status(200).json(true);
    })
    .catch((err) => {
      console.log(err);
      return next({
        log: 'Error in projectController.deleteProject',
        status: 400,
        message: { err: err },
      });
    });
};

//Middleware to get all skills in the database
projectController.getSkills = (req, res, next) => {
  //Query to only grab skill names from the skills database
  const queryStr = 'SELECT skill from skills;';

  //Run query
  db.query(queryStr)
    .then(data => {
      //Map all the skills into an array to return to the frontend
      const skills = data.rows.map(element => element.skill);
      return res.status(200).json(skills);
    })
    .catch(err => {
      return next({
        log: `Error in projectController.getSkills: ${err.detail}`,
        status: 400,
        message: { err: err },
      });
    });
};

//Middleware to get both the ID and skill name from the skills database
projectController.getIndividualSkill = (req, res, next) => {
  //Grab the skillname from the params
  const skill = req.params.name;
  //Setup query to grab both ID and Skill name of an individual skill
  const queryStr = 'SELECT * from skills WHERE skill = $1;';

  //Run Query
  db.query(queryStr, [skill])
    .then(data => {
      //Return the information found in the query
      return res.status(200).json(data.rows[0]);
    })
    .catch(err => {
      return next({
        log: `Error in projectController.getSkills: ${err.detail}`,
        status: 400,
        message: { err: err },
      });
    });
};

//Middleware to add a new skill to the database
projectController.addNewSkill = (req, res, next) => {
  //Grab the new skill name from the body of the request
  const { skill } = req.body;

  //Create the queryStr with parametized queries
  const queryStr = 'INSERT INTO skills(skill) VALUES($1) RETURNING skill';
  
  //Run query
  db.query(queryStr, [skill])
    .then(data => {
      //Return the inserted items info
      return res.status(200).json(data.rows[0]);
    })
    .catch(err => {
      return next({
        log: `Error in projectController.getSkills: ${err.detail}`,
        status: 400,
        message: { err: err },
      });
    });
};

//Middleware to remove skills from the skills database
projectController.removeSkill = (req, res, next) => {
  //Grab the skill name using params
  const skill = req.params.name;
  
  //Create the queryStr using parametized queries as well
  const queryStr = 'DELETE FROM skills WHERE skill = $1';

  //Run query
  db.query(queryStr, [skill])
    .then(data => {
      //Return the removed skill
      return res.status(200).json(data.rows[0]);
    })
    .catch(err => {
      return next({
        log: `Error in projectController.getSkills: ${err.detail}`,
        status: 400,
        message: { err: err },
      });
    });
};

//Middleware to update information regarding an individual project
projectController.updateIndividualProject = (req, res, next) => {
  //Grab the project id from the params
  const id = req.params.id;
  //Deconstruct the variables inside of the request body
  const {project_name, description, skills} = req.body;
  
  //Create the parametized query and query to update the basic info (project name and description)
  const updateBasicInfoParams = [project_name, description, id];
  const updatebasicInfoQueryStr = `
    UPDATE projects
    SET project_name = $1, description = $2
    WHERE id = $3;
  `;

  //Create a parametized query which will delete all skills a project is currently associated with
  const deleteSkillsQueryStr = `
    DELETE FROM projects_skills_join_table
    WHERE project_id = $1
  `;
  const updateSkillsParams = [id];

  //We need to construct another query string to add to our join table
  // ! We have a varying amount of rows to enter into our join table.....
  const multipleStringArr = [];
  // each value of skills is the primary key to the skill in the skills table
  for (const value of skills) {
    multipleStringArr.push(`('${id}', '${value}')`);
  }
  // create a single string, getting rid of all the backticks
  const multipleString = multipleStringArr.join(',').replaceAll('`', '');
  const addSkillsQueryStr = `INSERT INTO projects_skills_join_table (project_id, skill_id) VALUES${multipleString}`;

  //First query which will deleate all skills from the selected project on update
  db.query(deleteSkillsQueryStr, updateSkillsParams)
    .then(() => {
      //Second query will then go and add the new skills selected
      db.query(addSkillsQueryStr)
        .then(() => {
          //Third the last query will update the basic information regarding the project
          db.query(updatebasicInfoQueryStr, updateBasicInfoParams)
            .then(data => {
              //Finally return the new project
              return res.status(200).json(data.rows[0]);
            })
            //Catch case for the third query
            .catch(err => {
              return next({
                log: `Error in projectController.updateIndividualProject: ${err.detail}`,
                status: 400,
                message: { err: err },
              });
            });
        })
        //Catch case for the second query
        .catch((err) => {
          return next({
            log: 'Error in projectController.updateIndividualProject ${err.detail}',
            status: 400,
            message: { err: err },
          });
        });
    })
    //Catch case for the first query
    .catch(err => {
      return next({
        log: `Error in projectController.updateIndividualProject: ${err.detail}`,
        status: 400,
        message: { err: err },
      });
    });
};

module.exports = projectController;
