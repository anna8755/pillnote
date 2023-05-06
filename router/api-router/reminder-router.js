const Router = require('express').Router;
const authMiddleware = require('../../middlewares/auth-middleware');
const reminderController = require('../../controller/reminder-controller');
const validationMiddleware = require('../../middlewares/validation-middleware');

const reminderRouter = new Router();

reminderRouter
    .post('/', validationMiddleware.validateTime(),
        authMiddleware,
        reminderController.addReminder)
    .post('/view/:id', authMiddleware,
        reminderController.viewReminder)
    .get('/viewed', authMiddleware,
        reminderController.getViewedReminders)
    .get('/', authMiddleware,
        reminderController.getAllReminders)
    .get('/available', authMiddleware,
        reminderController.getAvailableReminders)
    .get('/:id', authMiddleware,
        reminderController.getReminder)
    .patch('/:id', authMiddleware,
        validationMiddleware.validateTime(),
        reminderController.changeReminder)
    .delete('/:id', authMiddleware,
        reminderController.deleteReminder);

module.exports = reminderRouter;