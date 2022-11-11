const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

//Get requests
router.get('/all', projectController.getAllProjects);
router.get('/user/:id', projectController.getMyProject);
router.get('/skills', projectController.getSkills);
router.get('/skill/:name', projectController.getIndividualSkill);

//Post requests
router.post('/skill/new', projectController.addNewSkill);
router.post('/', projectController.addProject);

//Patch requests
router.patch('/individual/:id', projectController.updateIndividualProject);

//Delete requests
router.delete('/skill/remove/:name', projectController.removeSkill);
router.delete('/:id', projectController.deleteProject);


module.exports = router;
