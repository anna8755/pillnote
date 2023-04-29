const Router = require('express').Router;
// const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const reminderController = require('../controller/reminder-controller');
const validationMiddleware = require('../middlewares/validation-middleware');

const reminderRouter = new Router();

reminderRouter
    .post('/', validationMiddleware.validateTime(),
        authMiddleware,
        reminderController.addReminder)
    .get('/', authMiddleware,
        reminderController.getAllReminders)
    .get('/:id', authMiddleware,
        reminderController.getReminder)
    .patch('/:id', authMiddleware,
        validationMiddleware.validateTime(),
        reminderController.changeReminder)
    .delete('/:id', authMiddleware,
        reminderController.deleteReminder);

module.exports = reminderRouter;