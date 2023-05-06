const Router = require('express').Router;
const logController = require('../../controller/log-controller');
const authMiddleware = require('../../middlewares/auth-middleware');


const logRouter = new Router();

logRouter
    .post('/', authMiddleware,
        logController.addLog)
    .get('/:reminderId', authMiddleware,
        logController.getLogsByReminderId)
    .delete('/:id', authMiddleware,
        logController.deleteLog)
    .patch('/:id', authMiddleware,
        logController.updateLog);

module.exports = logRouter;