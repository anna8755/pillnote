const ApiError = require("../exceptions/api-error");
const validationMiddleware = require("../middlewares/validation-middleware");
const reminderService = require("../service/reminder-service");
const { validationResult } = require("express-validator");

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
            const result = await reminderService.deleteReminder(accessToken, id)

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new ReminderController();