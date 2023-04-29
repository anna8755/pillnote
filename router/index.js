const Router = require('express').Router;
const reminderRouter = require('./reminder-router.js');
const userRouter = require('./user-router.js')

const router = new Router();

router.use('/user', userRouter);
router.use('/reminder', reminderRouter);

module.exports = router;