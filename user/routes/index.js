const express = require('express');
const { registration, login, validateInput,setRole,checkRole } = require('../controller/userLogin');
const userRouter = express.Router();
const bodyParser = require('body-parser');
const { Auth } = require('../middleware/auth');

const jsonparser = bodyParser.json();

console.log('aa gya 2')
userRouter.post('/login',jsonparser, login); // Assuming login function is defined in your controller
userRouter.post('/setrole',jsonparser,Auth, setRole);
userRouter.get('/checkrole',jsonparser,Auth, checkRole);
module.exports = userRouter
