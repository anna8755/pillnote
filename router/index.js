const Router = require('express').Router;
const reminderRouter = require('./reminder-router.js');
const userRouter = require('./user-router.js')
const logRouter = require('./log-router.js')

const router = new Router();

// router.get('/', (req, res) => {

// })
router.use('/user', userRouter);
router.use('/reminder', reminderRouter);
router.use('/log', logRouter);

module.exports = router;