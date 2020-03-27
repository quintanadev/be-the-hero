const express = require('express');
const OngConroller = require('./controllers/OngController')
const IncidentConroller = require('./controllers/IncidentController')
const ProfileConroller = require('./controllers/ProfileController')
const SessionController = require('./controllers/SessionController')

const routes = express.Router();

routes.post('/sessions', SessionController.create);

routes.get('/ongs', OngConroller.index);
routes.post('/ongs', OngConroller.create);

routes.get('/incidents', IncidentConroller.index);
routes.post('/incidents', IncidentConroller.create);
routes.delete('/incidents/:id', IncidentConroller.delete);

routes.get('/profile', ProfileConroller.index);

module.exports = routes;