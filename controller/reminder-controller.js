const ApiError = require("../exceptions/api-error");
const validationMiddleware = require("../middlewares/validation-middleware");
const reminderService = require("../service/reminder-service");
const { validationResult } = require("express-validator");
const tokenService = require("../service/token-service");
const { addReminderTimer, deleteReminderTimer } = require("./socket-controller");

class ReminderController {
    async addReminder(req, res, next) {
        try {
            const errors = validationResult(req);
            const token = req.headers.authorization;

            if (!errors.isEmpty() || !token) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { medicine, time, notes } = req.body;

            const reminderData = await reminderService.addReminder(token, medicine, time, notes);

            addReminderTimer(reminderData,
                tokenService.validateAccessToken
                    (tokenService.getAccesToken(token)))

            return res.json(reminderData);
        } catch (e) {
            next(e);
        }
    }

    async changeReminder(req, res, next) {
        try {
            const id = req.params.id;
            const accessToken = validationMiddleware.getAccessTokenFromReq(req);

            const { medicine, time, notes } = req.body;
            const reminderData = await reminderService.changeReminder(id, accessToken, medicine, time, notes);

            return res.json(reminderData);
        } catch (e) {
            next(e);
        }
    }

    async getAllReminders(req, res, next) {
        try {
            const token = req.headers.authorization;
            const reminders = await reminderService.getAllReminders(token);

            return res.json(reminders);
        } catch (e) {
            next(e);
        }
    }
    async getAvailableReminders(req, res, next) {
        try {
            const token = req.headers.authorization;
            const reminders = await reminderService.getAvailableReminders(token);

            return res.json(reminders);
        } catch (e) {
            next(e);
        }
    }

    async getViewedReminders(req, res, next) {
        try {
            const token = req.headers.authorization;
            const reminders = await reminderService.getAllReminders(token);
            const viewedReminders = reminders.filter((reminder) => reminder.viewed);

            return res.json(viewedReminders);
        } catch (e) {
            next(e);
        }
    }
    async getReminder(req, res, next) {
        try {
            const id = req.params.id;
            const accessToken = validationMiddleware.getAccessTokenFromReq(req);

            const result = await reminderService.getReminder(accessToken, id);

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async deleteReminder(req, res, next) {
        try {
            const id = req.params.id;
            const accessToken = validationMiddleware.getAccessTokenFromReq(req);
            const result = await reminderService.deleteReminder(accessToken, id);

            // SocketController.removeReminderById(id);
            if (result) {
                if (result.viewed == false) {
                    deleteReminderTimer(result);
                }
            }

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async viewReminder(req, res, next) {
        try {
            const id = req.params.id;
            const accessToken = validationMiddleware.getAccessTokenFromReq(req);

            const result = await reminderService.viewReminder(accessToken, id)

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ReminderController();