const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// All requests here are coming in from /projects/...
router.post('/', projectController.addProject);

router.get('/all', projectController.getAllProjects);

router.get('/user/:id', projectController.getMyProject);

router.delete('/:id', projectController.deleteProject);

router.get('/skills', projectController.getSkills);

router.get('/skill/:name', projectController.getIndividualSkill);

router.patch('/individual/:id', projectController.updateIndividualProject);

module.exports = router;
